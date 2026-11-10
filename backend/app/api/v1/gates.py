from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime, timezone
from pydantic import BaseModel
from ...core.database import get_db
from ...models.entities import Gate, GuardGateAssignment, User, AuditLog
from ...security.permissions import (
    get_current_user, require_roles, get_active_guard_gate, GatewiseRole
)

router = APIRouter(prefix="/gates", tags=["Campus Gates & Assignments"])

class AssignGuardRequest(BaseModel):
    guard_id: str
    gate_id: str
    shift_name: Optional[str] = "Shift A (Morning 06:00 - 14:00)"
    effective_until: Optional[datetime] = None

class CreateGateRequest(BaseModel):
    gate_code: str
    gate_name: str
    location: str
    operating_hours: Optional[str] = "24/7 Continuous"
    status: Optional[str] = "ACTIVE"

class UpdateGateRequest(BaseModel):
    gate_name: Optional[str] = None
    location: Optional[str] = None
    operating_hours: Optional[str] = None
    status: Optional[str] = None

@router.get("/")
def list_gates(db: Session = Depends(get_db)):
    return db.query(Gate).all()

@router.post("/", status_code=status.HTTP_201_CREATED)
def create_gate(
    payload: CreateGateRequest,
    admin: User = Depends(require_roles([GatewiseRole.ADMIN, GatewiseRole.SUPER_ADMIN])),
    db: Session = Depends(get_db)
):
    """Admin-only: Creates a new physical institutional gate post."""
    existing = db.query(Gate).filter(Gate.gate_code == payload.gate_code).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Gate with code '{payload.gate_code}' already exists."
        )

    gate = Gate(
        gate_code=payload.gate_code,
        gate_name=payload.gate_name,
        location=payload.location,
        operating_hours=payload.operating_hours,
        status=payload.status or "ACTIVE"
    )
    db.add(gate)

    audit = AuditLog(
        action="GATE_POST_CREATED",
        actor_id=admin.id,
        actor_email=admin.email,
        resource_type="GATE",
        resource_id=gate.id,
        result="SUCCESS",
        details={"gate_code": payload.gate_code, "gate_name": payload.gate_name}
    )
    db.add(audit)
    db.commit()
    db.refresh(gate)
    return gate

@router.patch("/{gate_id}")
def update_gate(
    gate_id: str,
    payload: UpdateGateRequest,
    admin: User = Depends(require_roles([GatewiseRole.ADMIN, GatewiseRole.SUPER_ADMIN])),
    db: Session = Depends(get_db)
):
    """Admin-only: Updates gate operational status, name, or location."""
    gate = db.query(Gate).filter(Gate.id == gate_id).first()
    if not gate:
        raise HTTPException(status_code=404, detail=f"Gate '{gate_id}' not found.")

    if payload.gate_name is not None:
        gate.gate_name = payload.gate_name
    if payload.location is not None:
        gate.location = payload.location
    if payload.operating_hours is not None:
        gate.operating_hours = payload.operating_hours
    if payload.status is not None:
        gate.status = payload.status

    audit = AuditLog(
        action="GATE_POST_UPDATED",
        actor_id=admin.id,
        actor_email=admin.email,
        resource_type="GATE",
        resource_id=gate.id,
        result="SUCCESS",
        details={"gate_id": gate.id, "new_status": gate.status}
    )
    db.add(audit)
    db.commit()
    db.refresh(gate)
    return gate

@router.get("/my-assignment")
def get_my_active_assignment(
    assigned_gate: Gate = Depends(get_active_guard_gate),
    current_guard: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Guard endpoint to inspect active gate post assignment."""
    assignment = (
        db.query(GuardGateAssignment)
        .filter(
            GuardGateAssignment.guard_id == current_guard.id,
            GuardGateAssignment.status == "ACTIVE"
        )
        .first()
    )
    return {
        "gate": assigned_gate,
        "shift_name": assignment.shift_name if assignment else "Standard Shift",
        "assigned_at": assignment.assigned_at.isoformat() if assignment else None,
        "status": "ACTIVE"
    }

@router.post("/assignments")
def assign_guard_to_gate(
    payload: AssignGuardRequest,
    admin: User = Depends(require_roles([GatewiseRole.ADMIN, GatewiseRole.SUPER_ADMIN])),
    db: Session = Depends(get_db)
):
    """
    Admin-only: Assigns a security guard to a gate post.
    Deactivates any previous active assignments and preserves assignment history.
    """
    guard = db.query(User).filter(User.id == payload.guard_id).first()
    if not guard or guard.role != GatewiseRole.SECURITY_GUARD:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Guard account with ID '{payload.guard_id}' not found."
        )

    gate = db.query(Gate).filter(Gate.id == payload.gate_id).first()
    if not gate or gate.status != "ACTIVE":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Gate post '{payload.gate_id}' is not an active station."
        )

    now = datetime.now(timezone.utc)

    # Deactivate previous active assignment for this guard
    prev_assignments = (
        db.query(GuardGateAssignment)
        .filter(
            GuardGateAssignment.guard_id == guard.id,
            GuardGateAssignment.status == "ACTIVE"
        )
        .all()
    )
    for prev in prev_assignments:
        prev.status = "EXPIRED"
        prev.effective_until = now

    # Create new assignment record
    new_assignment = GuardGateAssignment(
        guard_id=guard.id,
        gate_id=gate.id,
        assigned_by=admin.id,
        assigned_at=now,
        effective_from=now,
        effective_until=payload.effective_until,
        status="ACTIVE",
        shift_name=payload.shift_name
    )
    db.add(new_assignment)

    audit = AuditLog(
        action="GUARD_GATE_ASSIGNED",
        actor_id=admin.id,
        actor_email=admin.email,
        resource_type="GUARD_ASSIGNMENT",
        resource_id=new_assignment.id,
        result="SUCCESS",
        details={
            "guard_id": guard.id,
            "gate_id": gate.id,
            "shift": payload.shift_name
        }
    )
    db.add(audit)
    db.commit()
    db.refresh(new_assignment)

    return {
        "status": "SUCCESS",
        "assignment_id": new_assignment.id,
        "guard_name": guard.full_name,
        "gate_name": gate.gate_name,
        "shift_name": new_assignment.shift_name,
        "assigned_at": new_assignment.assigned_at.isoformat()
    }

@router.get("/assignments/history")
def get_assignment_history(
    guard_id: Optional[str] = None,
    limit: int = 50,
    admin: User = Depends(require_roles([GatewiseRole.ADMIN, GatewiseRole.SUPER_ADMIN])),
    db: Session = Depends(get_db)
):
    """Admin-only: Retrieves audit history of all guard station assignments."""
    query = db.query(GuardGateAssignment)
    if guard_id:
        query = query.filter(GuardGateAssignment.guard_id == guard_id)
    assignments = query.order_by(GuardGateAssignment.assigned_at.desc()).limit(limit).all()

    return [
        {
            "id": a.id,
            "guard_id": a.guard_id,
            "guard_name": a.guard.full_name if a.guard else "Guard",
            "gate_id": a.gate_id,
            "gate_name": a.gate.gate_name if a.gate else "Gate",
            "assigned_by": a.assigner.employee_id if a.assigner else "Admin",
            "assigned_at": a.assigned_at.isoformat(),
            "status": a.status,
            "shift_name": a.shift_name
        }
        for a in assignments
    ]

@router.get("/{gate_id}")
def get_gate(gate_id: str, db: Session = Depends(get_db)):
    gate = db.query(Gate).filter(Gate.id == gate_id).first()
    if not gate:
        raise HTTPException(status_code=404, detail="Gate not found")
    return gate
