from fastapi import APIRouter, Depends, HTTPException, status, Header
from sqlalchemy.orm import Session
from typing import Optional
from ...core.database import get_db
from ...models.entities import User
from ...schemas.auth import (
    LoginRequest, TokenResponse, UserProfileSchema,
    RefreshTokenRequest, RevokeSessionRequest
)
from ...services.auth_service import (
    authenticate_user, create_user_session, rotate_refresh_token,
    revoke_session, build_user_profile
)
from ...security.permissions import get_current_user

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/login", response_model=TokenResponse)
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    user = authenticate_user(db, payload.employee_id, payload.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid Employee ID or security credentials."
        )
    
    access_token, refresh_token = create_user_session(db, user)
    profile = build_user_profile(db, user)
    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        token_type="bearer",
        user=profile
    )

@router.post("/refresh", response_model=TokenResponse)
def refresh_token(payload: RefreshTokenRequest, db: Session = Depends(get_db)):
    result = rotate_refresh_token(db, payload.refresh_token)
    if not result:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Refresh token is invalid, expired, or has been revoked."
        )
    
    new_access_token, new_refresh_token, user = result
    profile = build_user_profile(db, user)
    return TokenResponse(
        access_token=new_access_token,
        refresh_token=new_refresh_token,
        token_type="bearer",
        user=profile
    )

@router.post("/logout")
def logout(payload: RevokeSessionRequest, db: Session = Depends(get_db)):
    revoked = revoke_session(db, payload.refresh_token)
    return {"status": "SUCCESS", "message": "Session successfully revoked." if revoked else "Session already inactive."}

@router.get("/me", response_model=UserProfileSchema)
def get_current_user_profile(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return build_user_profile(db, current_user)
