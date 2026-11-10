from datetime import datetime, timezone, timedelta
from typing import Optional, Dict, Any, Tuple
from sqlalchemy.orm import Session
from ..models.entities import User, GuardGateAssignment, Gate, UserSession, AuditLog
from ..security.passwords import verify_password
from ..security.tokens import (
    create_access_token, generate_refresh_token, hash_token
)
from ..schemas.auth import UserProfileSchema, AssignedGateSchema
from ..core.config import settings

def authenticate_user(db: Session, employee_id: str, password: str) -> Optional[User]:
    """
    Authenticates user using Employee ID or Email against Argon2id hash.
    Checks that the user account is ACTIVE.
    """
    user = db.query(User).filter(User.employee_id == employee_id).first()
    if not user:
        user = db.query(User).filter(User.email == employee_id).first()
    if not user:
        return None
    if user.account_status != "ACTIVE":
        return None
    if not verify_password(password, user.password_hash):
        return None
    return user

def create_user_session(
    db: Session,
    user: User,
    device_info: Optional[str] = None
) -> Tuple[str, str]:
    """
    Issues a short-lived access token and a rotating hashed refresh token.
    Persists session in database.
    """
    access_token = create_access_token(
        subject=user.id,
        role=user.role,
        employee_id=user.employee_id
    )

    raw_refresh_token = generate_refresh_token()
    token_hash = hash_token(raw_refresh_token)
    expires_at = datetime.now(timezone.utc) + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)

    session_rec = UserSession(
        user_id=user.id,
        refresh_token_hash=token_hash,
        device_info=device_info or "Android Terminal Post 02",
        expires_at=expires_at,
        is_revoked=False
    )
    db.add(session_rec)

    audit = AuditLog(
        action="AUTH_LOGIN_SUCCESS",
        actor_id=user.id,
        actor_email=user.email,
        resource_type="SESSION",
        resource_id=session_rec.id,
        result="SUCCESS",
        details={"employee_id": user.employee_id, "role": user.role}
    )
    db.add(audit)
    db.commit()

    return access_token, raw_refresh_token

def rotate_refresh_token(
    db: Session,
    raw_refresh_token: str
) -> Optional[Tuple[str, str, User]]:
    """
    Validates and rotates a refresh token:
    1. Looks up unrevoked session by hash.
    2. Validates expiration.
    3. Revokes current session (single-use guarantee).
    4. Issues new access token and new refresh token.
    """
    now = datetime.now(timezone.utc)
    token_hash = hash_token(raw_refresh_token)

    session_rec = (
        db.query(UserSession)
        .filter(
            UserSession.refresh_token_hash == token_hash,
            UserSession.is_revoked == False,
            UserSession.expires_at > now
        )
        .first()
    )

    if not session_rec:
        return None

    user = db.query(User).filter(User.id == session_rec.user_id, User.account_status == "ACTIVE").first()
    if not user:
        return None

    # Revoke old session
    session_rec.is_revoked = True

    # Issue new pair
    new_access_token, new_refresh_token = create_user_session(db, user, session_rec.device_info)
    return new_access_token, new_refresh_token, user

def revoke_session(db: Session, raw_refresh_token: str) -> bool:
    """Revokes a session by refresh token hash (logout)."""
    token_hash = hash_token(raw_refresh_token)
    session_rec = db.query(UserSession).filter(UserSession.refresh_token_hash == token_hash).first()
    if session_rec:
        session_rec.is_revoked = True
        db.commit()
        return True
    return False

def get_guard_assigned_gate(db: Session, user_id: str) -> Optional[AssignedGateSchema]:
    """Retrieves the guard's active station assignment."""
    assignment = (
        db.query(GuardGateAssignment)
        .filter(GuardGateAssignment.guard_id == user_id, GuardGateAssignment.status == "ACTIVE")
        .first()
    )
    if not assignment:
        return None
    
    gate = db.query(Gate).filter(Gate.id == assignment.gate_id).first()
    if not gate:
        return None
        
    return AssignedGateSchema(
        id=gate.id,
        name=gate.gate_name,
        code=gate.gate_code,
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
