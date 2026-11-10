from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from ...core.database import get_db
from ...models.entities import AuditLog, User
from ...security.permissions import require_roles, GatewiseRole

router = APIRouter(prefix="/audit", tags=["Audit Ledger"])

@router.get("/logs")
def get_audit_logs(
    action: Optional[str] = None,
    resource_type: Optional[str] = None,
    limit: int = Query(50, ge=1, le=200),
    offset: int = Query(0, ge=0),
    admin: User = Depends(require_roles([GatewiseRole.ADMIN, GatewiseRole.SUPER_ADMIN])),
    db: Session = Depends(get_db)
):
    """Admin-only: Retrieves immutable system audit records."""
    query = db.query(AuditLog)
    if action:
        query = query.filter(AuditLog.action == action)
    if resource_type:
        query = query.filter(AuditLog.resource_type == resource_type)

    total = query.count()
    logs = query.order_by(AuditLog.timestamp.desc()).offset(offset).limit(limit).all()

    return {
        "total": total,
        "offset": offset,
        "limit": limit,
        "items": [
            {
                "id": l.id,
                "action": l.action,
                "actor_id": l.actor_id,
                "actor_email": l.actor_email or "system@iimsambalpur.ac.in",
                "resource_type": l.resource_type,
                "resource_id": l.resource_id,
                "result": l.result,
                "timestamp": l.timestamp.isoformat() if l.timestamp else None,
                "details": l.details
            }
            for l in logs
        ]
    }
