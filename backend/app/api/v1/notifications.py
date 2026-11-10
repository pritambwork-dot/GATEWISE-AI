from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from datetime import datetime, timezone
from typing import List
from ...core.database import get_db
from ...models.entities import EnrollmentRequest, DriveSyncJob, VerificationEvent, User
from ...security.permissions import require_roles, GatewiseRole

router = APIRouter(prefix="/notifications", tags=["Notifications"])

@router.get("/")
def get_notifications(
    admin: User = Depends(require_roles([GatewiseRole.ADMIN, GatewiseRole.SUPER_ADMIN])),
    db: Session = Depends(get_db)
):
    """Admin-only: Generates unified operational notification items from system events."""
    notifications = []

    # 1. Pending enrollment referrals
    pending_enrollments = (
        db.query(EnrollmentRequest)
        .filter(EnrollmentRequest.status == "PENDING")
        .order_by(EnrollmentRequest.created_at.desc())
        .limit(5)
        .all()
    )
    for req in pending_enrollments:
        notifications.append({
            "id": f"notif-enr-{req.id[:8]}",
            "type": "ENROLLMENT_REFERRAL",
            "title": "New Field Referral for Review",
            "message": f"Officer at gate post submitted referral for {req.person_name} ({req.proposed_category} - {req.department}).",
            "severity": "WARNING",
            "timestamp": req.created_at.isoformat() if req.created_at else datetime.now(timezone.utc).isoformat(),
            "target_url": "/admin/enrollment",
            "is_read": False
        })

    # 2. Drive sync job status
    last_sync = db.query(DriveSyncJob).order_by(DriveSyncJob.started_at.desc()).first()
    if last_sync and last_sync.job_status == "COMPLETED":
        notifications.append({
            "id": f"notif-sync-{last_sync.id[:8]}",
            "type": "DRIVE_SYNC",
            "title": "Google Drive Index Updated",
            "message": f"Reference photo repository synchronized: {last_sync.files_processed} files processed.",
            "severity": "INFO",
            "timestamp": last_sync.completed_at.isoformat() if last_sync.completed_at else datetime.now(timezone.utc).isoformat(),
            "target_url": "/admin/repository",
            "is_read": True
        })

    # 3. Denied verifications / expired card exceptions
    recent_exceptions = (
        db.query(VerificationEvent)
        .filter(VerificationEvent.guard_decision == "DENY_ENTRY")
        .order_by(VerificationEvent.timestamp.desc())
        .limit(3)
        .all()
    )
    for exc in recent_exceptions:
        notifications.append({
            "id": f"notif-exc-{exc.id[:8]}",
            "type": "ACCESS_DENIED",
            "title": "Gate Entry Denied",
            "message": f"Officer denied access at gate {exc.gate_id}: {exc.decision_reason or 'Access credentials expired'}.",
            "severity": "ERROR",
            "timestamp": exc.timestamp.isoformat() if exc.timestamp else datetime.now(timezone.utc).isoformat(),
            "target_url": "/admin/activity",
            "is_read": False
        })

    return notifications
