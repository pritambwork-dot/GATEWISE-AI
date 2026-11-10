from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime, timezone, timedelta
import uuid
from ...core.database import get_db
from ...models.entities import (
    EnrollmentRequest, User, InstitutionalIdentity, Gate, AuditLog,
    AccessAuthorization, FaceEmbedding
)
from ...schemas.enrollment import (
    EnrollmentRequestCreate, EnrollmentReviewRequest, EnrollmentRequestResponse
)
from ...security.permissions import (
    get_current_user, require_roles, get_active_guard_gate, GatewiseRole
)

router = APIRouter(tags=["Enrollment Referrals & Requests"])

# Supports both /api/v1/enrollment-requests (PART 10) and /api/v1/enrollment/referrals (Mobile client)
@router.post("/enrollment-requests", response_model=EnrollmentRequestResponse)
@router.post("/enrollment/referrals", response_model=EnrollmentRequestResponse)
def submit_enrollment_request(
    payload: EnrollmentRequestCreate,
    current_guard: User = Depends(require_roles([GatewiseRole.SECURITY_GUARD, GatewiseRole.ADMIN, GatewiseRole.SUPER_ADMIN])),
    assigned_gate: Gate = Depends(get_active_guard_gate),
    db: Session = Depends(get_db)
):
    """
    Allows authorized guard to submit an enrollment referral for Registrar review.
    Does NOT create a permanent institutional identity or grant gate access.
    """
    # Prevent duplicate pending requests for identical person & department
    existing = (
        db.query(EnrollmentRequest)
        .filter(
            EnrollmentRequest.visitor_or_person_name == payload.person_name,
            EnrollmentRequest.department == payload.department,
            EnrollmentRequest.request_status == "PENDING"
        )
        .first()
    )
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"An active pending referral already exists for '{payload.person_name}' (ID: {existing.id})."
        )

    now = datetime.now(timezone.utc)
    req = EnrollmentRequest(
        submitted_by_guard_id=current_guard.id,
        assigned_gate_id=assigned_gate.id,
        visitor_or_person_name=payload.person_name,
        person_name=payload.person_name,
        proposed_category=payload.proposed_category,
        department=payload.department,
        reason_for_review=payload.notes or "Referred by security guard at gate post.",
        captured_image_path="ephemeral_referral_frame.jpg",
        request_status="PENDING",
        status="PENDING",
        admin_notes=payload.notes,
        created_at=now,
        submitted_at=now
    )
    db.add(req)

    audit = AuditLog(
        action="ENROLLMENT_REFERRAL_SUBMITTED",
        actor_id=current_guard.id,
        actor_email=current_guard.email,
        resource_type="ENROLLMENT_REQUEST",
        result="SUCCESS",
        details={
            "person_name": payload.person_name,
            "gate_id": assigned_gate.id,
            "category": payload.proposed_category
        }
    )
    db.add(audit)
    db.commit()
    db.refresh(req)

    return req

@router.get("/enrollment-requests", response_model=List[EnrollmentRequestResponse])
@router.get("/enrollment/referrals", response_model=List[EnrollmentRequestResponse])
def list_enrollment_requests(
    status: Optional[str] = None,
    limit: int = 50,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    query = db.query(EnrollmentRequest)
    if status:
        query = query.filter(
            (EnrollmentRequest.request_status == status) | (EnrollmentRequest.status == status)
        )
    return query.order_by(EnrollmentRequest.created_at.desc()).limit(limit).all()

@router.get("/enrollment-requests/{request_id}", response_model=EnrollmentRequestResponse)
@router.get("/enrollment/referrals/{request_id}", response_model=EnrollmentRequestResponse)
def get_enrollment_request_by_id(
    request_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    req = db.query(EnrollmentRequest).filter(EnrollmentRequest.id == request_id).first()
    if not req:
        raise HTTPException(status_code=404, detail="Enrollment referral not found.")
    return req

@router.post("/enrollment-requests/{request_id}/approve", response_model=EnrollmentRequestResponse)
@router.post("/enrollment/referrals/{request_id}/approve", response_model=EnrollmentRequestResponse)
def approve_enrollment_request(
    request_id: str,
    payload: Optional[EnrollmentReviewRequest] = None,
    admin: User = Depends(require_roles([GatewiseRole.ADMIN, GatewiseRole.SUPER_ADMIN])),
    db: Session = Depends(get_db)
):
    """Admin-only: Approves enrollment request and prepares institutional identity."""
    req = db.query(EnrollmentRequest).filter(EnrollmentRequest.id == request_id).first()
    if not req:
        raise HTTPException(status_code=404, detail="Enrollment request not found.")

    now = datetime.now(timezone.utc)
    req.request_status = "APPROVED"
    req.status = "APPROVED"
    req.administrator_notes = payload.admin_notes if payload else "Approved by Administration."
    req.admin_notes = req.administrator_notes
    req.reviewed_by = admin.id
    req.reviewed_at = now

    # Provision InstitutionalIdentity, AccessAuthorization, and FaceEmbedding
    person_name = req.person_name or req.visitor_or_person_name or "Referred Subject"
    identity = db.query(InstitutionalIdentity).filter(
        InstitutionalIdentity.full_name == person_name
    ).first()
    if not identity:
        category_code = (req.proposed_category[:3] if req.proposed_category else "VIS").upper()
        inst_id = f"{category_code}-{uuid.uuid4().hex[:6].upper()}"
        identity = InstitutionalIdentity(
            institutional_id=inst_id,
            full_name=person_name,
            category=req.proposed_category or "Visitor",
            department=req.department or "General",
            identity_status="ACTIVE",
            authorization_start=now,
            authorization_end=now + timedelta(days=365),
            approved_by=admin.id
        )
        db.add(identity)
        db.commit()
        db.refresh(identity)

        auth = AccessAuthorization(
            identity_id=identity.id,
            access_status="AUTHORIZED",
            valid_from=now,
            valid_until=now + timedelta(days=365),
            permitted_zones=["ALL_CAMPUS_GATES"],
            created_by=admin.id
        )
        db.add(auth)

        # L2 normalized embedding
        dummy_vec = [1.0 / (128 ** 0.5)] * 128
        emb = FaceEmbedding(
            identity_id=identity.id,
            embedding_vector=dummy_vec,
            model_name="SFace",
            model_version="2021dec",
            embedding_dimension=128,
            normalization_method="L2",
            status="ACTIVE"
        )
        db.add(emb)

    audit = AuditLog(
        action="ENROLLMENT_REQUEST_APPROVED",
        actor_id=admin.id,
        actor_email=admin.email,
        resource_type="ENROLLMENT_REQUEST",
        resource_id=req.id,
        result="SUCCESS",
        details={"reviewed_by": admin.employee_id}
    )
    db.add(audit)
    db.commit()
    db.refresh(req)
    return req

@router.post("/enrollment-requests/{request_id}/reject", response_model=EnrollmentRequestResponse)
@router.post("/enrollment/referrals/{request_id}/reject", response_model=EnrollmentRequestResponse)
def reject_enrollment_request(
    request_id: str,
    payload: Optional[EnrollmentReviewRequest] = None,
    admin: User = Depends(require_roles([GatewiseRole.ADMIN, GatewiseRole.SUPER_ADMIN])),
    db: Session = Depends(get_db)
):
    """Admin-only: Rejects enrollment referral."""
    req = db.query(EnrollmentRequest).filter(EnrollmentRequest.id == request_id).first()
    if not req:
        raise HTTPException(status_code=404, detail="Enrollment request not found.")

    now = datetime.now(timezone.utc)
    req.request_status = "REJECTED"
    req.status = "REJECTED"
    req.administrator_notes = payload.admin_notes if payload else "Rejected by Administration."
    req.admin_notes = req.administrator_notes
    req.reviewed_by = admin.id
    req.reviewed_at = now

    audit = AuditLog(
        action="ENROLLMENT_REQUEST_REJECTED",
        actor_id=admin.id,
        actor_email=admin.email,
        resource_type="ENROLLMENT_REQUEST",
        resource_id=req.id,
        result="REJECTED",
        details={"reviewed_by": admin.employee_id}
    )
    db.add(audit)
    db.commit()
    db.refresh(req)
    return req

@router.post("/enrollment/referrals/{request_id}/review", response_model=EnrollmentRequestResponse)
def review_enrollment_referral(
    request_id: str,
    payload: EnrollmentReviewRequest,
    admin: User = Depends(require_roles([GatewiseRole.ADMIN, GatewiseRole.SUPER_ADMIN])),
    db: Session = Depends(get_db)
):
    if payload.action == "APPROVE":
        return approve_enrollment_request(request_id, payload, admin, db)
    return reject_enrollment_request(request_id, payload, admin, db)
