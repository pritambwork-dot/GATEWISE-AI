from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime, timezone
import random
from ...core.database import get_db
from ...models.entities import VisitorPass, User
from ...schemas.visitor import VisitorPassResponse, VisitorPassCreate, VisitorIntakeRequest
from .auth import get_current_user

router = APIRouter(prefix="/visitors", tags=["Visitors"])

def generate_pass_code() -> str:
    return f"PASS-{random.randint(1000, 9999)}"

@router.get("/", response_model=List[VisitorPassResponse])
def list_visitor_passes(
    status: Optional[str] = None,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    query = db.query(VisitorPass)
    if status:
        query = query.filter(VisitorPass.status == status)
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
        phone=payload.phone,
        id_type=payload.id_type,
        id_number=payload.id_number,
        host_name=payload.host_name,
        host_department=payload.host_department,
        purpose=payload.purpose,
        valid_date=now.strftime("%Y-%m-%d"),
        valid_until_time="20:00",
        status="CHECKED_IN",
        check_in_time=now,
        gate_id=payload.gate_id
    )
    db.add(pass_record)
    db.commit()
    db.refresh(pass_record)
    return pass_record

@router.post("/create-pass", response_model=VisitorPassResponse)
def create_pre_approved_pass(
    payload: VisitorPassCreate,
    db: Session = Depends(get_db)
):
    pass_code = generate_pass_code()
    pass_record = VisitorPass(
        pass_code=pass_code,
        visitor_name=payload.visitor_name,
        phone=payload.phone,
        id_type=payload.id_type,
        id_number=payload.id_number,
        host_name=payload.host_name,
        host_department=payload.host_department,
        purpose=payload.purpose,
        valid_date=payload.valid_date,
        valid_until_time=payload.valid_until_time,
        status="EXPECTED",
        gate_id=payload.gate_id
    )
    db.add(pass_record)
    db.commit()
    db.refresh(pass_record)
    return pass_record

@router.post("/{pass_code}/check-in", response_model=VisitorPassResponse)
def check_in_visitor(pass_code: str, db: Session = Depends(get_db)):
    pass_record = db.query(VisitorPass).filter(VisitorPass.pass_code == pass_code).first()
    if not pass_record:
        raise HTTPException(status_code=404, detail="Visitor pass not found")
    
    pass_record.status = "CHECKED_IN"
    pass_record.check_in_time = datetime.now(timezone.utc)
    db.commit()
    db.refresh(pass_record)
    return pass_record

@router.post("/{pass_code}/check-out", response_model=VisitorPassResponse)
def check_out_visitor(pass_code: str, db: Session = Depends(get_db)):
    pass_record = db.query(VisitorPass).filter(VisitorPass.pass_code == pass_code).first()
    if not pass_record:
        raise HTTPException(status_code=404, detail="Visitor pass not found")
        
    pass_record.status = "CHECKED_OUT"
    pass_record.check_out_time = datetime.now(timezone.utc)
    db.commit()
    db.refresh(pass_record)
    return pass_record
