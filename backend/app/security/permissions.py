from typing import List, Optional
from fastapi import Depends, HTTPException, status, Header
from sqlalchemy.orm import Session
from ..core.database import get_db
from ..models.entities import User, Gate, GuardGateAssignment
from .tokens import decode_access_token

class GatewiseRole:
    SUPER_ADMIN = "SUPER_ADMIN"
    ADMIN = "ADMIN"
    SECURITY_GUARD = "SECURITY_GUARD"

def get_current_user(
    authorization: Optional[str] = Header(None),
    db: Session = Depends(get_db)
) -> User:
    """
    Validates Bearer access token and returns active authenticated User.
    Default-deny: unauthorized if header is missing, malformed, or user is inactive.
    """
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authorization credentials missing or invalid format.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    token = authorization.split(" ")[1].strip()
    payload = decode_access_token(token)
    if not payload or "sub" not in payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Access token is invalid or has expired.",
            headers={"WWW-Authenticate": "Bearer"},
        )
        
    user_id = payload["sub"]
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authenticated user account not found."
        )
    if user.account_status != "ACTIVE":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"User account is {user.account_status.lower()}. Access restricted."
        )
    return user

def require_roles(allowed_roles: List[str]):
    """
    Dependency factory enforcing default-deny RBAC for specific roles.
    """
    def role_checker(current_user: User = Depends(get_current_user)) -> User:
        if current_user.role not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Operation requires one of roles: {', '.join(allowed_roles)}. Role '{current_user.role}' is unauthorized."
            )
        return current_user
    return role_checker

def get_active_guard_gate(
    current_user: User = Depends(require_roles([GatewiseRole.SECURITY_GUARD, GatewiseRole.ADMIN, GatewiseRole.SUPER_ADMIN])),
    db: Session = Depends(get_db)
) -> Gate:
    """
    MANDATORY BUSINESS RULE:
    Resolves the guard's actively assigned gate post from the database.
    Never trusts a client-supplied gate ID.
    If the guard has no active assignment, immediately aborts with 403 Forbidden.
    """
    assignment = (
        db.query(GuardGateAssignment)
        .filter(
            GuardGateAssignment.guard_id == current_user.id,
            GuardGateAssignment.status == "ACTIVE"
        )
        .first()
    )

    if not assignment:
        # If admin or super admin, fall back to Main Gate if no specific post assigned
        if current_user.role in [GatewiseRole.ADMIN, GatewiseRole.SUPER_ADMIN]:
            main_gate = db.query(Gate).filter(Gate.code == "GATE-MAIN-02").first()
            if main_gate:
                return main_gate

        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Security guard has no active gate post assignment. Contact Post Commander to assign post."
        )

    gate = db.query(Gate).filter(Gate.id == assignment.gate_id).first()
    if not gate or gate.status != "ACTIVE":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"Assigned gate post '{gate.gate_name if gate else 'Unknown'}' is currently {gate.status if gate else 'offline'}."
        )

    return gate
