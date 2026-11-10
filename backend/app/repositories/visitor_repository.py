from typing import Optional, List
from sqlalchemy.orm import Session
from ..models.entities import VisitorPass

class VisitorRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_by_code(self, pass_code: str) -> Optional[VisitorPass]:
        return self.db.query(VisitorPass).filter(VisitorPass.pass_code == pass_code).first()

    def list_passes(self, status: Optional[str] = None, limit: int = 100) -> List[VisitorPass]:
        query = self.db.query(VisitorPass)
        if status:
            query = query.filter(VisitorPass.status == status)
        return query.order_by(VisitorPass.created_at.desc()).limit(limit).all()

    def add(self, visitor_pass: VisitorPass) -> VisitorPass:
        self.db.add(visitor_pass)
        self.db.commit()
        self.db.refresh(visitor_pass)
        return visitor_pass
