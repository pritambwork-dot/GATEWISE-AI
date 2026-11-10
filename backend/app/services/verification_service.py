import hashlib
import json
from datetime import datetime, timezone
from typing import Optional, List, Tuple
from sqlalchemy.orm import Session
from ..models.entities import (
    VerificationEvent, Gate, User, InstitutionalIdentity,
    FaceEmbedding, IdentityReferencePhoto, AuditLog
)
from ..computer_vision.face_pipeline import FacePipeline
from ..schemas.verification import (
    VerificationResultResponse, FaceMatchCandidate, AuthorizationStatus,
    GuardDecisionRequest, VerificationEventResponse
)
from ..core.config import settings

# Global pipeline instance
cv_pipeline = FacePipeline()

def compute_crypto_signature(event_id: str, timestamp_str: str, gate_id: str, guard_id: str, outcome: str, decision: str) -> str:
    raw = f"{event_id}|{timestamp_str}|{gate_id}|{guard_id}|{outcome}|{decision}|gatewise-audit-salt-2026"
    return hashlib.sha256(raw.encode("utf-8")).hexdigest()

def verify_face_capture(
    db: Session,
    gate_id: str,
    guard_id: str,
    image_base64: str,
    ambient_light_score: Optional[float] = None
) -> VerificationResultResponse:
    now = datetime.now(timezone.utc)
    now_iso = now.isoformat()
    event_id = f"EVT-{now.strftime('%Y%m%d%H%M%S')}-{gate_id[-4:] if len(gate_id) >= 4 else '0000'}"

    gate = db.query(Gate).filter(Gate.id == gate_id).first()
    gate_name = gate.name if gate else "Unknown Gate Post"
    
    guard = db.query(User).filter(User.id == guard_id).first()
    guard_name = guard.full_name if guard else "Security Guard"

    # 1. Decode base64 image
    img = cv_pipeline.decode_base64_image(image_base64)
    if img is None:
        initial_sig = compute_crypto_signature(event_id, now_iso, gate_id, guard_id, "QUALITY_INSUFFICIENT", "PENDING")
        event = VerificationEvent(
            id=event_id,
            timestamp=now,
            gate_id=gate_id,
            guard_id=guard_id,
            match_outcome="QUALITY_INSUFFICIENT",
            guard_decision="PENDING",
            decision_reason="Invalid image payload could not be decoded.",
            cryptographic_signature=initial_sig
        )
        db.add(event)
        db.commit()
        return VerificationResultResponse(
            event_id=event_id,
            gate_id=gate_id,
            gate_name=gate_name,
            guard_id=guard_id,
            guard_name=guard_name,
            timestamp=now,
            outcome="QUALITY_INSUFFICIENT",
            face_detected=False,
            image_quality_score=0.0,
            quality_feedback=["Invalid image payload. Please capture again."],
            candidate=None,
            authorization=None,
            live_photo_thumbnail_url=None
        )

    # 2. Assess image quality
    is_acceptable, blur_score, quality_feedback = cv_pipeline.assess_image_quality(img)
    quality_score = min(100.0, max(0.0, blur_score / 3.0))

    if not is_acceptable and blur_score < 40.0:
        initial_sig = compute_crypto_signature(event_id, now_iso, gate_id, guard_id, "QUALITY_INSUFFICIENT", "PENDING")
        event = VerificationEvent(
            id=event_id,
            timestamp=now,
            gate_id=gate_id,
            guard_id=guard_id,
            match_outcome="QUALITY_INSUFFICIENT",
            guard_decision="PENDING",
            decision_reason="; ".join(quality_feedback),
            cryptographic_signature=initial_sig
        )
        db.add(event)
        db.commit()
        return VerificationResultResponse(
            event_id=event_id,
            gate_id=gate_id,
            gate_name=gate_name,
            guard_id=guard_id,
            guard_name=guard_name,
            timestamp=now,
            outcome="QUALITY_INSUFFICIENT",
            face_detected=False,
            image_quality_score=round(quality_score, 1),
            quality_feedback=quality_feedback,
            candidate=None,
            authorization=None,
            live_photo_thumbnail_url=None
        )

    # 3. Detect Face and Extract 128-dim Embedding
    has_face, live_vec, face_err = cv_pipeline.extract_face_embedding(img)
    if not has_face or live_vec is None:
        initial_sig = compute_crypto_signature(event_id, now_iso, gate_id, guard_id, "UNKNOWN_PERSON", "PENDING")
        event = VerificationEvent(
            id=event_id,
            timestamp=now,
            gate_id=gate_id,
            guard_id=guard_id,
            match_outcome="UNKNOWN_PERSON",
            guard_decision="PENDING",
            decision_reason=face_err or "No face detected.",
            cryptographic_signature=initial_sig
        )
        db.add(event)
        db.commit()
        return VerificationResultResponse(
            event_id=event_id,
            gate_id=gate_id,
            gate_name=gate_name,
            guard_id=guard_id,
            guard_name=guard_name,
            timestamp=now,
            outcome="UNKNOWN_PERSON",
            face_detected=False,
            image_quality_score=round(quality_score, 1),
            quality_feedback=[face_err or "No face detected in camera viewfinder. Re-align subject inside guide frame."],
            candidate=None,
            authorization=None,
            live_photo_thumbnail_url=None
        )

    # 4. Biometric Matching against Enrolled Identities
    all_embeddings = db.query(FaceEmbedding).all()
    best_candidate_identity = None
    best_score = -1.0
    
    for emb in all_embeddings:
        sim = cv_pipeline.cosine_similarity(live_vec, emb.vector)
        if sim > best_score:
            best_score = sim
            best_candidate_identity = emb.identity

    # If no enrolled embeddings in DB, or matching score is below minimum threshold
    candidate_schema: Optional[FaceMatchCandidate] = None
    auth_schema: Optional[AuthorizationStatus] = None
    outcome = "UNKNOWN_PERSON"

    if best_candidate_identity and best_score >= settings.FACE_MATCH_CANDIDATE:
        ref_photo = db.query(IdentityReferencePhoto).filter(
            IdentityReferencePhoto.identity_id == best_candidate_identity.id
        ).first()
        ref_url = ref_photo.file_path if ref_photo else "/avatars/default_student.png"

        candidate_schema = FaceMatchCandidate(
            identity_id=best_candidate_identity.id,
            person_name=best_candidate_identity.full_name,
            person_id=best_candidate_identity.person_id,
            category=best_candidate_identity.category,
            department=best_candidate_identity.department,
            reference_photo_url=ref_url,
            similarity_score=round(float(best_score), 4)
        )

        # 5. Decoupled Institutional Authorization Evaluation
        is_active = best_candidate_identity.is_active
        today_date_str = now.strftime("%Y-%m-%d")
        is_date_valid = (
            best_candidate_identity.valid_from <= today_date_str <= best_candidate_identity.valid_until
        )
        
        # Check gate access hours if gate exists
        is_gate_open = True
        if gate and gate.status != "ACTIVE":
            is_gate_open = False

        if not is_active:
            auth_is_valid = False
            restriction = "Institutional identity record has been deactivated or suspended by Registrar."
        elif not is_date_valid:
            auth_is_valid = False
            restriction = f"Identity validity expired on {best_candidate_identity.valid_until}. Requires clearance renewal."
        elif not is_gate_open:
            auth_is_valid = False
            restriction = f"Gate {gate.name} is currently flagged for maintenance or restricted access."
        else:
            auth_is_valid = True
            restriction = None

        auth_schema = AuthorizationStatus(
            is_authorized=auth_is_valid,
            clearance_level=best_candidate_identity.clearance_level,
            valid_from=best_candidate_identity.valid_from,
            valid_until=best_candidate_identity.valid_until,
            permitted_gates=["ALL_CAMPUS_GATES"],
            restriction_reason=restriction
        )

        if best_score >= settings.FACE_MATCH_AUTO_ADMIT:
            outcome = "VERIFIED_AUTHORIZED" if auth_is_valid else "IDENTIFIED_UNAUTHORIZED"
        else:
            outcome = "POTENTIAL_MATCH"
    else:
        outcome = "UNKNOWN_PERSON"

    # 6. Save event record
    initial_sig = compute_crypto_signature(
        event_id, now_iso, gate_id, guard_id, outcome, "PENDING"
    )
    event = VerificationEvent(
        id=event_id,
        timestamp=now,
        gate_id=gate_id,
        guard_id=guard_id,
        person_id=candidate_schema.person_id if candidate_schema else None,
        person_name=candidate_schema.person_name if candidate_schema else None,
        person_category=candidate_schema.category if candidate_schema else None,
        match_outcome=outcome,
        similarity_score=round(float(best_score), 4) if best_score >= 0 else None,
        guard_decision="PENDING",
        decision_reason=None,
        cryptographic_signature=initial_sig
    )
    db.add(event)
    db.commit()

    return VerificationResultResponse(
        event_id=event_id,
        gate_id=gate_id,
        gate_name=gate_name,
        guard_id=guard_id,
        guard_name=guard_name,
        timestamp=now,
        outcome=outcome,
        face_detected=True,
        image_quality_score=round(quality_score, 1),
        quality_feedback=quality_feedback,
        candidate=candidate_schema,
        authorization=auth_schema,
        live_photo_thumbnail_url=None
    )

def record_guard_decision(
    db: Session,
    guard_id: str,
    decision_payload: GuardDecisionRequest
) -> VerificationEventResponse:
    event = db.query(VerificationEvent).filter(VerificationEvent.id == decision_payload.event_id).first()
    if not event:
        raise ValueError("Verification event not found.")

    now = datetime.now(timezone.utc)
    event.guard_decision = decision_payload.action
    event.decision_reason = decision_payload.notes or decision_payload.override_reason

    # Recompute cryptographic signature to lock the human guard decision
    event.cryptographic_signature = compute_crypto_signature(
        event.id,
        event.timestamp.isoformat(),
        event.gate_id,
        guard_id,
        event.match_outcome,
        decision_payload.action
    )
    db.commit()
    db.refresh(event)

    # Fetch gate and guard names
    gate = db.query(Gate).filter(Gate.id == event.gate_id).first()
    guard = db.query(User).filter(User.id == event.guard_id).first()

    return VerificationEventResponse(
        id=event.id,
        timestamp=event.timestamp,
        gate_id=event.gate_id,
        gate_name=gate.name if gate else "Gate Post",
        guard_id=event.guard_id,
        guard_name=guard.full_name if guard else "Guard",
        person_id=event.person_id,
        person_name=event.person_name,
        person_category=event.person_category,
        outcome=event.match_outcome,
        guard_decision=event.guard_decision,
        similarity_score=event.similarity_score,
        decision_reason=event.decision_reason,
        cryptographic_signature=event.cryptographic_signature,
        sync_status=event.sync_status
    )
