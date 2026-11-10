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
from ...security.permissions import (
    get_current_user, require_roles, get_active_guard_gate, GatewiseRole
)

router = APIRouter(prefix="/verification", tags=["Verification"])

@router.post("/verify", response_model=VerificationResultResponse)
@router.post("/capture", response_model=VerificationResultResponse)
def run_verification(
    payload: FaceVerificationRequest,
    current_guard: User = Depends(require_roles([GatewiseRole.SECURITY_GUARD, GatewiseRole.ADMIN, GatewiseRole.SUPER_ADMIN])),
    assigned_gate: Gate = Depends(get_active_guard_gate),
    db: Session = Depends(get_db)
):
    """
    Core Verification Endpoint:
    - Resolves guard's active station assignment server-side (never trusts client gate_id).
    - Decodes and validates still capture image.
    - Evaluates focus blur, illumination, and face geometry.
    - Matches SFace 128-dim embedding against institutional repository.
    - Checks independent access clearance.
    - Creates immutable verification record awaiting human guard decision.
    """
    # Enforce server-resolved assigned gate
    return verify_face_capture(
        db=db,
        gate=assigned_gate,
        guard=current_guard,
        image_base64=payload.image_base64,
        ambient_light_score=payload.ambient_light_score
    )

@router.post("/decision", response_model=VerificationEventResponse)
@router.post("/{event_id}/decision", response_model=VerificationEventResponse)
def submit_decision(
    payload: GuardDecisionRequest,
    event_id: Optional[str] = None,
    current_guard: User = Depends(require_roles([GatewiseRole.SECURITY_GUARD, GatewiseRole.ADMIN, GatewiseRole.SUPER_ADMIN])),
    assigned_gate: Gate = Depends(get_active_guard_gate),
    db: Session = Depends(get_db)
):
    """
    Sovereign Human Guard Decision Endpoint:
    - Commits physical access decision (GRANT_ENTRY, DENY_ENTRY, ESCALATE_TO_ADMIN, REFER_TO_VISITOR_DESK).
    - Cryptographically seals record with HMAC-SHA256 signature.
    """
    # Use path event_id if present
    target_event_id = event_id or payload.event_id
    payload.event_id = target_event_id

    try:
        return record_guard_decision(
            db=db,
            guard_id=current_guard.id,
            decision_payload=payload
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/events", response_model=List[VerificationEventResponse])
def get_recent_verification_events(
    gate_id: Optional[str] = None,
    limit: int = 50,
    current_user: User = Depends(get_current_user),
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
                gate_name=gate.gate_name if gate else "Main Campus Gate · Post 02",
                guard_id=evt.guard_id,
                guard_name=guard.full_name if guard else "Security Guard",
                person_id=evt.person_id,
                person_name=evt.person_name,
                person_category=evt.person_category,
                outcome=evt.identity_match_status,
                guard_decision=evt.final_decision_status,
                similarity_score=evt.similarity_score,
                decision_reason=evt.decision_reason,
                cryptographic_signature=evt.cryptographic_signature,
                sync_status=evt.sync_status
            )
        )
    return results

@router.get("/{event_id}", response_model=VerificationEventResponse)
def get_verification_event_by_id(
    event_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    evt = db.query(VerificationEvent).filter(VerificationEvent.id == event_id).first()
    if not evt:
        raise HTTPException(status_code=404, detail=f"Verification event '{event_id}' not found.")
    
    gate = db.query(Gate).filter(Gate.id == evt.gate_id).first()
    guard = db.query(User).filter(User.id == evt.guard_id).first()

    return VerificationEventResponse(
        id=evt.id,
        timestamp=evt.timestamp,
        gate_id=evt.gate_id,
        gate_name=gate.gate_name if gate else "Main Campus Gate · Post 02",
        guard_id=evt.guard_id,
        guard_name=guard.full_name if guard else "Security Guard",
        person_id=evt.person_id,
        person_name=evt.person_name,
        person_category=evt.person_category,
        outcome=evt.identity_match_status,
        guard_decision=evt.final_decision_status,
        similarity_score=evt.similarity_score,
        decision_reason=evt.decision_reason,
        cryptographic_signature=evt.cryptographic_signature,
        sync_status=evt.sync_status
    )
