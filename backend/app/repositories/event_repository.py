from typing import Optional, List
from sqlalchemy.orm import Session
from ..models.entities import VerificationEvent

class EventRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_by_id(self, event_id: str) -> Optional[VerificationEvent]:
        return self.db.query(VerificationEvent).filter(VerificationEvent.id == event_id).first()

    def list_recent(self, gate_id: Optional[str] = None, limit: int = 50) -> List[VerificationEvent]:
        query = self.db.query(VerificationEvent)
        if gate_id:
            query = query.filter(VerificationEvent.gate_id == gate_id)
        return query.order_by(VerificationEvent.timestamp.desc()).limit(limit).all()

    def add(self, event: VerificationEvent) -> VerificationEvent:
        self.db.add(event)
        self.db.commit()
        self.db.refresh(event)
        return event
