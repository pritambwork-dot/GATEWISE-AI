from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional, Dict, Any
from pydantic import BaseModel
from ...core.database import get_db
from ...models.entities import (
    User, InstitutionalIdentity, IdentityReferencePhoto,
    FaceEmbedding, DriveSyncJob
)
from ...services.drive_sync_service import (
    run_drive_sync, get_repository_status, UNMAPPED_DRIVE_FILES, DEFAULT_DRIVE_FOLDER_ID
)
from ...security.permissions import require_roles, GatewiseRole

router = APIRouter(prefix="/repository", tags=["Google Drive Reference Repository"])

class ConnectRepositoryRequest(BaseModel):
    folder_id: str
    manifest: Optional[List[Dict[str, Any]]] = None

class SyncRepositoryRequest(BaseModel):
    folder_id: Optional[str] = None
    force_full: bool = False

@router.post("/connect")
def connect_repository(
    payload: ConnectRepositoryRequest,
    admin: User = Depends(require_roles([GatewiseRole.ADMIN, GatewiseRole.SUPER_ADMIN])),
    db: Session = Depends(get_db)
):
    """
    Admin-only: Connects an institution-controlled Google Drive folder and performs initial synchronization.
    Never exposes OAuth client secrets.
    """
    res = run_drive_sync(
        db=db,
        folder_id=payload.folder_id or DEFAULT_DRIVE_FOLDER_ID,
        manifest=payload.manifest,
        admin_id=admin.id
    )
    return {
        "status": "CONNECTED",
        "folder_id": payload.folder_id,
        "sync_result": res
    }

@router.get("/status")
def get_status(
    admin: User = Depends(require_roles([GatewiseRole.ADMIN, GatewiseRole.SUPER_ADMIN])),
    db: Session = Depends(get_db)
):
    """Admin-only: Retrieves real-time repository health, connected folder, and index counts."""
    return get_repository_status(db)

@router.post("/sync")
def trigger_sync(
    payload: Optional[SyncRepositoryRequest] = None,
    admin: User = Depends(require_roles([GatewiseRole.ADMIN, GatewiseRole.SUPER_ADMIN])),
    db: Session = Depends(get_db)
):
    """Admin-only: Manually triggers an incremental or full repository synchronization."""
    folder_id = payload.folder_id if payload and payload.folder_id else DEFAULT_DRIVE_FOLDER_ID
    res = run_drive_sync(db=db, folder_id=folder_id, admin_id=admin.id)
    return res

@router.get("/sync-history")
def get_sync_history(
    limit: int = 20,
    admin: User = Depends(require_roles([GatewiseRole.ADMIN, GatewiseRole.SUPER_ADMIN])),
    db: Session = Depends(get_db)
):
    """Admin-only: Retrieves audit log history of synchronization executions."""
    jobs = db.query(DriveSyncJob).order_by(DriveSyncJob.started_at.desc()).limit(limit).all()
    return [
        {
            "id": j.id,
            "folder_id": j.folder_id,
            "job_type": j.job_type,
            "status": j.job_status,
            "started_at": j.started_at.isoformat() if j.started_at else None,
            "completed_at": j.completed_at.isoformat() if j.completed_at else None,
            "files_processed": j.files_processed,
            "files_rejected": j.files_rejected,
            "last_error": j.last_error
        }
        for j in jobs
    ]

@router.get("/identities")
def get_indexed_identities(
    category: Optional[str] = None,
    limit: int = 100,
    admin: User = Depends(require_roles([GatewiseRole.ADMIN, GatewiseRole.SUPER_ADMIN])),
    db: Session = Depends(get_db)
):
    """Admin-only: Lists enrolled institutional identities and their reference photo status."""
    query = db.query(InstitutionalIdentity)
    if category:
        query = query.filter(InstitutionalIdentity.category == category)
    identities = query.order_by(InstitutionalIdentity.institutional_id.asc()).limit(limit).all()

    return [
        {
            "id": i.id,
            "institutional_id": i.institutional_id,
            "full_name": i.full_name,
            "category": i.category,
            "department": i.department,
            "identity_status": i.identity_status,
            "valid_from": i.authorization_start.isoformat() if i.authorization_start else None,
            "valid_until": i.authorization_end.isoformat() if i.authorization_end else None,
            "photo_count": len(i.reference_photos),
            "embeddings_count": len(i.embeddings)
        }
        for i in identities
    ]

@router.get("/unmapped-files")
def get_unmapped_files(
    admin: User = Depends(require_roles([GatewiseRole.ADMIN, GatewiseRole.SUPER_ADMIN]))
):
    """Admin-only: Lists Drive images without a verified identity mapping or with multiple faces."""
    return UNMAPPED_DRIVE_FILES
