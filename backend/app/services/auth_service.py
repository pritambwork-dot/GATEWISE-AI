from typing import Optional
from sqlalchemy.orm import Session
from ..models.entities import User, GuardGateAssignment, Gate
from ..core.security import verify_password, create_access_token
from ..schemas.auth import UserProfileSchema, AssignedGateSchema

def authenticate_user(db: Session, employee_id: str, password: str) -> Optional[User]:
    user = db.query(User).filter(User.employee_id == employee_id, User.is_active == True).first()
    if not user:
        # Also allow login with email
        user = db.query(User).filter(User.email == employee_id, User.is_active == True).first()
    if not user:
        return None
    if not verify_password(password, user.hashed_password):
        return None
    return user

def get_guard_assigned_gate(db: Session, user_id: str) -> Optional[AssignedGateSchema]:
    assignment = (
        db.query(GuardGateAssignment)
        .filter(GuardGateAssignment.guard_id == user_id, GuardGateAssignment.is_active == True)
        .first()
    )
    if not assignment:
        return None
    
    gate = db.query(Gate).filter(Gate.id == assignment.gate_id).first()
    if not gate:
        return None
        
    return AssignedGateSchema(
        id=gate.id,
        name=gate.name,
        code=gate.code,
        location=gate.location,
        operating_hours=gate.operating_hours,
        status=gate.status,
        shift_name=assignment.shift_name,
        assigned_at=assignment.assigned_at
    )

def build_user_profile(db: Session, user: User) -> UserProfileSchema:
    assigned_gate = None
    if user.role == "SECURITY_GUARD":
        assigned_gate = get_guard_assigned_gate(db, user.id)
        
    return UserProfileSchema(
        id=user.id,
        email=user.email,
        full_name=user.full_name,
        role=user.role,
        employee_id=user.employee_id,
        avatar_url=user.avatar_url,
        is_active=user.is_active,
        assigned_gate=assigned_gate
    )
