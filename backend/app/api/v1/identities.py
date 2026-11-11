from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime, timezone
from ...core.database import get_db
from ...models.entities import InstitutionalIdentity, IdentityReferencePhoto, AccessAuthorization, User, AuditLog
from ...schemas.identity import IdentityResponse, IdentityCreate
from ...services.drive_sync_service import run_drive_sync
from ...security.permissions import get_current_user, require_roles, GatewiseRole

router = APIRouter(prefix="/identities", tags=["Institutional Identities"])

@router.get("", response_model=List[IdentityResponse])
@router.get("/", response_model=List[IdentityResponse])
def list_identities(
    category: Optional[str] = None,
    search: Optional[str] = None,
    limit: int = 100,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    query = db.query(InstitutionalIdentity)
    if category:
        query = query.filter(InstitutionalIdentity.category == category)
    if search:
        query = query.filter(
            (InstitutionalIdentity.full_name.ilike(f"%{search}%")) |
            (InstitutionalIdentity.institutional_id.ilike(f"%{search}%")) |
            (InstitutionalIdentity.person_id.ilike(f"%{search}%")) |
            (InstitutionalIdentity.department.ilike(f"%{search}%"))
        )
    return query.limit(limit).all()

@router.get("/{person_id}", response_model=IdentityResponse)
def get_identity_by_id(
    person_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    identity = db.query(InstitutionalIdentity).filter(
        (InstitutionalIdentity.institutional_id == person_id) |
        (InstitutionalIdentity.person_id == person_id) |
        (InstitutionalIdentity.id == person_id)
    ).first()
    if not identity:
        raise HTTPException(status_code=404, detail="Identity record not found.")
    return identity

@router.post("/", response_model=IdentityResponse)
def create_permanent_identity(
    payload: IdentityCreate,
    admin: User = Depends(require_roles([GatewiseRole.ADMIN, GatewiseRole.SUPER_ADMIN])),
    db: Session = Depends(get_db)
):
    """
    Admin-only: Creates a verified permanent institutional identity.
    Guards are strictly forbidden from creating permanent identities.
    """
    existing = db.query(InstitutionalIdentity).filter(
        (InstitutionalIdentity.institutional_id == payload.person_id) |
        (InstitutionalIdentity.person_id == payload.person_id)
    ).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Identity with ID '{payload.person_id}' already exists."
        )

    now = datetime.now(timezone.utc)
    identity = InstitutionalIdentity(
        institutional_id=payload.person_id,
        person_id=payload.person_id,
        full_name=payload.full_name,
        category=payload.category,
        department=payload.department,
        email=payload.email,
        phone=payload.phone,
        identity_status="ACTIVE",
        authorization_start=datetime.fromisoformat(payload.valid_from.replace("Z", "+00:00")),
        authorization_end=datetime.fromisoformat(payload.valid_until.replace("Z", "+00:00")),
        approved_by=admin.id,
        approved_at=now,
        created_at=now
    )
    db.add(identity)
    db.commit()
    db.refresh(identity)

    # Automatically initialize AccessAuthorization entity
    auth_rec = AccessAuthorization(
        identity_id=identity.id,
        access_status="AUTHORIZED",
        valid_from=identity.authorization_start,
        valid_until=identity.authorization_end,
        permitted_zones=["ALL_CAMPUS_GATES"],
        created_by=admin.id
    )
    db.add(auth_rec)

    audit = AuditLog(
        action="PERMANENT_IDENTITY_CREATED",
        actor_id=admin.id,
        actor_email=admin.email,
        resource_type="INSTITUTIONAL_IDENTITY",
        resource_id=identity.id,
        result="SUCCESS",
        details={"institutional_id": identity.institutional_id, "category": identity.category}
    )
    db.add(audit)
    db.commit()
    db.refresh(identity)

    return identity

@router.post("/sync-drive")
def trigger_google_drive_sync(
    folder_id: Optional[str] = None,
    admin: User = Depends(require_roles([GatewiseRole.ADMIN, GatewiseRole.SUPER_ADMIN])),
    db: Session = Depends(get_db)
):
    res = run_drive_sync(db, folder_id or "IIM_Sambalpur_Approved_Identities_2024_2026", admin_id=admin.id)
    return res
