from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime, timezone
import random
from ...core.database import get_db
from ...models.entities import VisitorPass, User, AuditLog
from ...schemas.visitor import VisitorPassResponse, VisitorPassCreate, VisitorIntakeRequest
from ...security.permissions import get_current_user, require_roles, GatewiseRole

router = APIRouter(prefix="/visitors", tags=["Visitors"])

def generate_pass_code() -> str:
    return f"PASS-{random.randint(1000, 9999)}"

@router.get("/", response_model=List[VisitorPassResponse])
def list_visitor_passes(
    status: Optional[str] = None,
    limit: int = 100,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    query = db.query(VisitorPass)
    if status:
        query = query.filter((VisitorPass.status == status) | (VisitorPass.approval_status == status))
    return query.order_by(VisitorPass.created_at.desc()).limit(limit).all()

@router.post("/intake", response_model=VisitorPassResponse)
def register_walk_in_visitor(
    payload: VisitorIntakeRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    now = datetime.now(timezone.utc)
    pass_code = generate_pass_code()
    
    pass_record = VisitorPass(
        pass_code=pass_code,
        visitor_name=payload.visitor_name,
        contact_details=payload.phone,
        phone=payload.phone,
        id_type=payload.id_type,
        id_number=payload.id_number,
        host_name=payload.host_name,
        host_department=payload.host_department,
        visit_purpose=payload.purpose or "Institutional Visit",
        purpose=payload.purpose,
        valid_date=now.strftime("%Y-%m-%d"),
        valid_until_time="20:00",
        approval_status="CHECKED_IN",
        status="CHECKED_IN",
        check_in_at=now,
        check_in_time=now,
        gate_id=payload.gate_id,
        created_by=current_user.id
    )
    db.add(pass_record)

    audit = AuditLog(
        action="VISITOR_INTAKE_REGISTERED",
        actor_id=current_user.id,
        actor_email=current_user.email,
        resource_type="VISITOR_PASS",
        result="SUCCESS",
        details={
            "pass_code": pass_code,
            "visitor_name": payload.visitor_name,
            "host_name": payload.host_name
        }
    )
    db.add(audit)
    db.commit()
    db.refresh(pass_record)
    return pass_record

@router.get("/{pass_id_or_code}", response_model=VisitorPassResponse)
def get_visitor_pass(
    pass_id_or_code: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    pass_record = (
        db.query(VisitorPass)
        .filter(
            (VisitorPass.id == pass_id_or_code) |
            (VisitorPass.pass_code == pass_id_or_code)
        )
        .first()
    )
    if not pass_record:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Visitor pass '{pass_id_or_code}' not found."
        )
    return pass_record

@router.post("/{pass_id_or_code}/check-in", response_model=VisitorPassResponse)
def check_in_visitor(
    pass_id_or_code: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    pass_record = (
        db.query(VisitorPass)
        .filter(
            (VisitorPass.id == pass_id_or_code) |
            (VisitorPass.pass_code == pass_id_or_code)
        )
        .first()
    )
    if not pass_record:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Visitor pass '{pass_id_or_code}' not found."
        )

    # Validate pass is not expired or rejected
    if pass_record.status in ["EXPIRED", "REJECTED"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Cannot check in pass with status '{pass_record.status}'."
        )

    now = datetime.now(timezone.utc)
    pass_record.status = "CHECKED_IN"
    pass_record.approval_status = "CHECKED_IN"
    pass_record.check_in_at = now
    pass_record.check_in_time = now

    audit = AuditLog(
        action="VISITOR_CHECKED_IN",
        actor_id=current_user.id,
        actor_email=current_user.email,
        resource_type="VISITOR_PASS",
        resource_id=pass_record.id,
        result="SUCCESS",
        details={"pass_code": pass_record.pass_code}
    )
    db.add(audit)
    db.commit()
    db.refresh(pass_record)
    return pass_record

@router.post("/{pass_id_or_code}/check-out", response_model=VisitorPassResponse)
def check_out_visitor(
    pass_id_or_code: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    pass_record = (
        db.query(VisitorPass)
        .filter(
            (VisitorPass.id == pass_id_or_code) |
            (VisitorPass.pass_code == pass_id_or_code)
        )
        .first()
    )
    if not pass_record:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Visitor pass '{pass_id_or_code}' not found."
        )

    now = datetime.now(timezone.utc)
    pass_record.status = "CHECKED_OUT"
    pass_record.approval_status = "CHECKED_OUT"
    pass_record.check_out_at = now
    pass_record.check_out_time = now

    audit = AuditLog(
        action="VISITOR_CHECKED_OUT",
        actor_id=current_user.id,
        actor_email=current_user.email,
        resource_type="VISITOR_PASS",
        resource_id=pass_record.id,
        result="SUCCESS",
        details={"pass_code": pass_record.pass_code}
    )
    db.add(audit)
    db.commit()
    db.refresh(pass_record)
    return pass_record

@router.post("/create-pass", response_model=VisitorPassResponse)
def create_pre_approved_pass(
    payload: VisitorPassCreate,
    current_admin: User = Depends(require_roles([GatewiseRole.ADMIN, GatewiseRole.SUPER_ADMIN])),
    db: Session = Depends(get_db)
):
    pass_code = generate_pass_code()
    pass_record = VisitorPass(
        pass_code=pass_code,
        visitor_name=payload.visitor_name,
        contact_details=payload.phone,
        phone=payload.phone,
        id_type=payload.id_type,
        id_number=payload.id_number,
        host_name=payload.host_name,
        host_department=payload.host_department,
        visit_purpose=payload.purpose or "Institutional Visit",
        purpose=payload.purpose,
        valid_date=payload.valid_date,
        valid_until_time=payload.valid_until_time,
        approval_status="EXPECTED",
        status="EXPECTED",
        created_by=current_admin.id
    )
    db.add(pass_record)
    db.commit()
    db.refresh(pass_record)
    return pass_record
