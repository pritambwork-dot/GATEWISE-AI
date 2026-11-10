from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime, timezone
from ...core.database import get_db
from ...models.entities import EnrollmentRequest, User, InstitutionalIdentity
from ...schemas.enrollment import (
    EnrollmentRequestCreate, EnrollmentReviewRequest, EnrollmentRequestResponse
)
from .auth import get_current_user

router = APIRouter(prefix="/enrollment", tags=["Enrollment Referrals"])

@router.get("/referrals", response_model=List[EnrollmentRequestResponse])
def list_enrollment_referrals(
    status: Optional[str] = None,
    limit: int = 50,
    db: Session = Depends(get_db)
):
    query = db.query(EnrollmentRequest)
    if status:
        query = query.filter(EnrollmentRequest.status == status)
    return query.order_by(EnrollmentRequest.submitted_at.desc()).limit(limit).all()

@router.post("/referrals", response_model=EnrollmentRequestResponse)
def submit_enrollment_referral(
    payload: EnrollmentRequestCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    req = EnrollmentRequest(
        person_name=payload.person_name,
        proposed_category=payload.proposed_category,
        department=payload.department,
        captured_image_path="captured_referral.jpg",
        submitted_by_guard_id=current_user.id,
        gate_id=payload.gate_id,
        status="PENDING",
        admin_notes=payload.notes
    )
    db.add(req)
    db.commit()
    db.refresh(req)
    return req

@router.post("/referrals/{request_id}/review", response_model=EnrollmentRequestResponse)
def review_enrollment_referral(
    request_id: str,
    payload: EnrollmentReviewRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    req = db.query(EnrollmentRequest).filter(EnrollmentRequest.id == request_id).first()
    if not req:
        raise HTTPException(status_code=404, detail="Enrollment referral not found")
        
    req.status = "APPROVED" if payload.action == "APPROVE" else "REJECTED"
    req.admin_notes = payload.admin_notes
    req.reviewed_at = datetime.now(timezone.utc)
    req.reviewed_by = current_user.full_name
    db.commit()
    db.refresh(req)
    return req
