from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from ...core.database import get_db
from ...models.entities import User, VerificationEvent, Gate
from ...schemas.verification import (
    FaceVerificationRequest, VerificationResultResponse,
    GuardDecisionRequest, VerificationEventResponse
)
from ...services.verification_service import verify_face_capture, record_guard_decision
from .auth import get_current_user

router = APIRouter(prefix="/verification", tags=["Verification"])

@router.post("/verify", response_model=VerificationResultResponse)
def run_verification(
    payload: FaceVerificationRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Guard must verify at their assigned gate, or allow gate_id from payload if authorized
    return verify_face_capture(
        db=db,
        gate_id=payload.gate_id,
        guard_id=current_user.id,
        image_base64=payload.image_base64,
        ambient_light_score=payload.ambient_light_score
    )

@router.post("/decision", response_model=VerificationEventResponse)
def submit_decision(
    payload: GuardDecisionRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    try:
        return record_guard_decision(
            db=db,
            guard_id=current_user.id,
            decision_payload=payload
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/events", response_model=List[VerificationEventResponse])
def get_recent_verification_events(
    gate_id: Optional[str] = None,
    limit: int = 50,
    db: Session = Depends(get_db)
):
    query = db.query(VerificationEvent)
    if gate_id:
        query = query.filter(VerificationEvent.gate_id == gate_id)
    events = query.order_by(VerificationEvent.timestamp.desc()).limit(limit).all()
    
    results = []
    for evt in events:
        gate = db.query(Gate).filter(Gate.id == evt.gate_id).first()
        guard = db.query(User).filter(User.id == evt.guard_id).first()
        results.append(
            VerificationEventResponse(
                id=evt.id,
                timestamp=evt.timestamp,
                gate_id=evt.gate_id,
                gate_name=gate.name if gate else "Gate Post",
                guard_id=evt.guard_id,
                guard_name=guard.full_name if guard else "Guard",
                person_id=evt.person_id,
                person_name=evt.person_name,
                person_category=evt.person_category,
                outcome=evt.match_outcome,
                guard_decision=evt.guard_decision,
                similarity_score=evt.similarity_score,
                decision_reason=evt.decision_reason,
                cryptographic_signature=evt.cryptographic_signature,
                sync_status=evt.sync_status
            )
        )
    return results
