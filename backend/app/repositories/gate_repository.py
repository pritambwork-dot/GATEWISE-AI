from typing import Optional, List
from sqlalchemy.orm import Session
from ..models.entities import Gate

class GateRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_by_id(self, gate_id: str) -> Optional[Gate]:
        return self.db.query(Gate).filter(Gate.id == gate_id).first()

    def get_by_code(self, code: str) -> Optional[Gate]:
        return self.db.query(Gate).filter(Gate.code == code).first()

    def list_all(self) -> List[Gate]:
        return self.db.query(Gate).all()
