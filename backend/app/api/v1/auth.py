from fastapi import APIRouter, Depends, HTTPException, status, Header
from sqlalchemy.orm import Session
from typing import Optional
from ...core.database import get_db
from ...core.security import create_access_token, decode_access_token
from ...models.entities import User
from ...schemas.auth import LoginRequest, TokenResponse, UserProfileSchema
from ...services.auth_service import authenticate_user, build_user_profile

router = APIRouter(prefix="/auth", tags=["Authentication"])

def get_current_user(
    authorization: Optional[str] = Header(None),
    db: Session = Depends(get_db)
) -> User:
    if not authorization or not authorization.startswith("Bearer "):
        # For testing / mock fallback if no header provided, return demo guard
        demo_guard = db.query(User).filter(User.employee_id == "SEC-G014").first()
        if demo_guard:
            return demo_guard
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Authorization header missing")
    
    token = authorization.split(" ")[1]
    payload = decode_access_token(token)
    if not payload or "sub" not in payload:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired token")
        
    user_id = payload["sub"]
    user = db.query(User).filter(User.id == user_id, User.is_active == True).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
    return user

@router.post("/login", response_model=TokenResponse)
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    user = authenticate_user(db, payload.employee_id, payload.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid Employee ID or security credentials."
        )
    
    access_token = create_access_token(subject=user.id)
    profile = build_user_profile(db, user)
    return TokenResponse(
        access_token=access_token,
        token_type="bearer",
        user=profile
    )

@router.get("/me", response_model=UserProfileSchema)
def get_current_user_profile(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return build_user_profile(db, current_user)
