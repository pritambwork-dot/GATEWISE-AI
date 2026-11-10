import asyncio
import json
from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from typing import List, Optional
from ...core.database import get_db, SessionLocal
from ...models.entities import VerificationEvent, Gate, User
from ...schemas.verification import VerificationEventResponse
from ...services.broadcaster import broadcaster

router = APIRouter(prefix="/activity", tags=["Activity & Live Feed"])

@router.get("/recent", response_model=List[VerificationEventResponse])
def get_recent_activity(
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

@router.get("/stream")
async def stream_live_activity():
    """
    Server-Sent Events (SSE) feed for the Central Command Centre desktop portal.
    Emits verification event telemetry in real time immediately upon commit (< 1ms).
    """
    async def event_generator():
        q = broadcaster.subscribe()
        try:
            # Yield initial latest event on connect
            db = SessionLocal()
            try:
                latest = db.query(VerificationEvent).order_by(VerificationEvent.timestamp.desc()).first()
                if latest:
                    gate = db.query(Gate).filter(Gate.id == latest.gate_id).first()
                    guard = db.query(User).filter(User.id == latest.guard_id).first()
                    payload = {
                        "id": latest.id,
                        "timestamp": latest.timestamp.isoformat(),
                        "gate_id": latest.gate_id,
                        "gate_name": gate.gate_name if gate else "Gate Post",
                        "guard_name": guard.full_name if guard else "Guard",
                        "person_id": latest.person_id,
                        "person_name": latest.person_name,
                        "person_category": latest.person_category,
                        "outcome": latest.match_outcome,
                        "guard_decision": latest.guard_decision,
                        "similarity_score": latest.similarity_score,
                        "cryptographic_signature": latest.cryptographic_signature[:16] + "..."
                    }
                    yield f"data: {json.dumps(payload)}\n\n"
            finally:
                db.close()

            # Stream new events from broadcaster queue with periodic keepalive heartbeat
            while True:
                try:
                    event_data = await asyncio.wait_for(q.get(), timeout=15.0)
                    yield f"data: {json.dumps(event_data)}\n\n"
                except asyncio.TimeoutError:
                    # Keep-alive heartbeat comment
                    yield ": heartbeat\n\n"
        finally:
            broadcaster.unsubscribe(q)

    return StreamingResponse(event_generator(), media_type="text/event-stream")
