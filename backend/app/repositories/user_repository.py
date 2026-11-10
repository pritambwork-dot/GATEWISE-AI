from typing import Optional, List
from sqlalchemy.orm import Session
from ..models.entities import User, GuardGateAssignment

class UserRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_by_id(self, user_id: str) -> Optional[User]:
        return self.db.query(User).filter(User.id == user_id).first()

    def get_by_employee_id(self, employee_id: str) -> Optional[User]:
        return self.db.query(User).filter(User.employee_id == employee_id).first()

    def get_by_email(self, email: str) -> Optional[User]:
        return self.db.query(User).filter(User.email == email).first()

    def list_guards(self) -> List[User]:
        return self.db.query(User).filter(User.role == "SECURITY_GUARD").all()

    def get_active_gate_assignment(self, user_id: str) -> Optional[GuardGateAssignment]:
        return (
            self.db.query(GuardGateAssignment)
            .filter(GuardGateAssignment.guard_id == user_id, GuardGateAssignment.is_active == True)
            .first()
        )
