from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from ...core.database import get_db
from ...models.entities import InstitutionalIdentity, IdentityReferencePhoto, User
from ...schemas.identity import IdentityResponse, IdentityCreate
from ...services.drive_sync_service import run_drive_sync
from .auth import get_current_user

router = APIRouter(prefix="/identities", tags=["Identities"])

@router.get("/", response_model=List[IdentityResponse])
def list_identities(
    category: Optional[str] = None,
    search: Optional[str] = None,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    query = db.query(InstitutionalIdentity)
    if category:
        query = query.filter(InstitutionalIdentity.category == category)
    if search:
        query = query.filter(
            (InstitutionalIdentity.full_name.ilike(f"%{search}%")) |
            (InstitutionalIdentity.person_id.ilike(f"%{search}%")) |
            (InstitutionalIdentity.department.ilike(f"%{search}%"))
        )
    return query.limit(limit).all()

@router.get("/{person_id}", response_model=IdentityResponse)
def get_identity_by_id(person_id: str, db: Session = Depends(get_db)):
    identity = db.query(InstitutionalIdentity).filter(
        (InstitutionalIdentity.person_id == person_id) | (InstitutionalIdentity.id == person_id)
    ).first()
    if not identity:
        raise HTTPException(status_code=404, detail="Identity record not found")
    return identity

@router.post("/sync-drive")
def trigger_google_drive_sync(
    folder_id: Optional[str] = None,
    db: Session = Depends(get_db)
):
    res = run_drive_sync(db, folder_id or "IIM_Sambalpur_Approved_Identities_2024_2026")
    return res
