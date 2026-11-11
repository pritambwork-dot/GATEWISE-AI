from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime, timezone
from pydantic import BaseModel
from ...core.database import get_db
from ...models.entities import User, GuardGateAssignment, Gate, UserSession, AuditLog
from ...security.permissions import require_roles, GatewiseRole
from ...security.passwords import get_password_hash

router = APIRouter(prefix="/guards", tags=["Guard Management"])

class CreateGuardRequest(BaseModel):
    employee_id: str
    email: str
    full_name: str
    password: Optional[str] = "guard123"
    avatar_url: Optional[str] = None

class UpdateGuardRequest(BaseModel):
    full_name: Optional[str] = None
    account_status: Optional[str] = None # ACTIVE, SUSPENDED, INACTIVE
    avatar_url: Optional[str] = None

@router.get("")
@router.get("/")
def list_guards(
    status: Optional[str] = None,
    admin: User = Depends(require_roles([GatewiseRole.ADMIN, GatewiseRole.SUPER_ADMIN])),
    db: Session = Depends(get_db)
):
    """Admin-only: Retrieves directory of institutional security guards with active assignments."""
    query = db.query(User).filter(User.role == GatewiseRole.SECURITY_GUARD)
    if status:
        query = query.filter(User.account_status == status)
    guards = query.order_by(User.full_name.asc()).all()

    results = []
    for g in guards:
        active_assignment = (
            db.query(GuardGateAssignment)
            .filter(
                GuardGateAssignment.guard_id == g.id,
                GuardGateAssignment.status == "ACTIVE"
            )
            .first()
        )
        gate = active_assignment.gate if active_assignment else None

        results.append({
            "id": g.id,
            "employee_id": g.employee_id,
            "email": g.email,
            "full_name": g.full_name,
            "role": g.role,
            "account_status": g.account_status,
            "avatar_url": g.avatar_url,
            "assigned_gate": {
                "id": gate.id,
                "code": gate.gate_code,
                "name": gate.gate_name,
                "shift": active_assignment.shift_name if active_assignment else None
            } if gate else None,
            "created_at": g.created_at.isoformat() if g.created_at else None
        })
    return results

@router.post("/", status_code=status.HTTP_201_CREATED)
def invite_guard(
    payload: CreateGuardRequest,
    admin: User = Depends(require_roles([GatewiseRole.ADMIN, GatewiseRole.SUPER_ADMIN])),
    db: Session = Depends(get_db)
):
    """Admin-only: Provisions a new security guard account."""
    existing_emp = db.query(User).filter(User.employee_id == payload.employee_id).first()
    if existing_emp:
        raise HTTPException(status_code=409, detail=f"Employee ID '{payload.employee_id}' is already registered.")

    existing_email = db.query(User).filter(User.email == payload.email).first()
    if existing_email:
        raise HTTPException(status_code=409, detail=f"Email '{payload.email}' is already in use.")

    guard = User(
        employee_id=payload.employee_id,
        email=payload.email,
        full_name=payload.full_name,
        password_hash=get_password_hash(payload.password or "guard123"),
        role=GatewiseRole.SECURITY_GUARD,
        account_status="ACTIVE",
        avatar_url=payload.avatar_url or "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
        mfa_enabled=False
    )
    db.add(guard)

    audit = AuditLog(
        action="GUARD_ACCOUNT_PROVISIONED",
        actor_id=admin.id,
        actor_email=admin.email,
        resource_type="USER",
        resource_id=guard.id,
        result="SUCCESS",
        details={"employee_id": payload.employee_id, "name": payload.full_name}
    )
    db.add(audit)
    db.commit()
    db.refresh(guard)

    return {
        "id": guard.id,
        "employee_id": guard.employee_id,
        "email": guard.email,
        "full_name": guard.full_name,
        "role": guard.role,
        "account_status": guard.account_status
    }

@router.patch("/{guard_id}")
def update_guard_status(
    guard_id: str,
    payload: UpdateGuardRequest,
    admin: User = Depends(require_roles([GatewiseRole.ADMIN, GatewiseRole.SUPER_ADMIN])),
    db: Session = Depends(get_db)
):
    """Admin-only: Updates guard account status (ACTIVE, SUSPENDED) or profile."""
    guard = db.query(User).filter(User.id == guard_id, User.role == GatewiseRole.SECURITY_GUARD).first()
    if not guard:
        raise HTTPException(status_code=404, detail="Guard record not found.")

    if payload.account_status is not None:
        guard.account_status = payload.account_status
        # If suspended, automatically revoke active sessions
        if payload.account_status == "SUSPENDED":
            db.query(UserSession).filter(UserSession.user_id == guard.id).update({"is_revoked": True})

    if payload.full_name is not None:
        guard.full_name = payload.full_name
    if payload.avatar_url is not None:
        guard.avatar_url = payload.avatar_url

    audit = AuditLog(
        action="GUARD_ACCOUNT_UPDATED",
        actor_id=admin.id,
        actor_email=admin.email,
        resource_type="USER",
        resource_id=guard.id,
        result="SUCCESS",
        details={"guard_id": guard.id, "account_status": guard.account_status}
    )
    db.add(audit)
    db.commit()
    db.refresh(guard)

    return {
        "id": guard.id,
        "employee_id": guard.employee_id,
        "full_name": guard.full_name,
        "account_status": guard.account_status
    }

@router.post("/{guard_id}/revoke-sessions")
def revoke_guard_sessions(
    guard_id: str,
    admin: User = Depends(require_roles([GatewiseRole.ADMIN, GatewiseRole.SUPER_ADMIN])),
    db: Session = Depends(get_db)
):
    """Admin-only: Revokes all active terminal sessions for the guard."""
    guard = db.query(User).filter(User.id == guard_id).first()
    if not guard:
        raise HTTPException(status_code=404, detail="Guard not found.")

    db.query(UserSession).filter(UserSession.user_id == guard.id).update({"is_revoked": True})
    
    audit = AuditLog(
        action="GUARD_SESSIONS_REVOKED",
        actor_id=admin.id,
        actor_email=admin.email,
        resource_type="USER_SESSION",
        resource_id=guard.id,
        result="SUCCESS",
        details={"guard_employee_id": guard.employee_id}
    )
    db.add(audit)
    db.commit()

    return {"status": "SUCCESS", "message": f"All sessions revoked for {guard.full_name}."}
