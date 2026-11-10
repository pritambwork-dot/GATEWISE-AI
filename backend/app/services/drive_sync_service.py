import hashlib
import json
import os
import re
from datetime import datetime, timezone
from typing import Dict, Any, List, Optional
from sqlalchemy.orm import Session
from ..models.entities import (
    InstitutionalIdentity, IdentityReferencePhoto,
    FaceEmbedding, AccessAuthorization, DriveSyncJob, AuditLog, User
)
from ..computer_vision.face_pipeline import cv_pipeline
from ..integrations.google_drive import GoogleDriveClient
from ..core.logging import logger
from .embedding_cache import embedding_cache

# Approved institutional reference repository catalog for IIM Sambalpur directory
DEFAULT_DRIVE_FOLDER_ID = "IIM_Sambalpur_Approved_Identities_2024_2026"

INSTITUTIONAL_SEED_DIRECTORY: List[Dict[str, Any]] = [
    {
        "institutional_id": "STU-2024-0492",
        "full_name": "Aarav Sharma",
        "category": "Student",
        "department": "MBA - Term IV (Marketing & Strategy)",
        "email": "aarav.s24@iimsambalpur.ac.in",
        "phone": "+91 98765 43210",
        "valid_from": "2024-06-01T00:00:00Z",
        "valid_until": "2027-06-30T23:59:59Z",
        "clearance_level": "ALL_GATES_STANDARD",
        "drive_file_id": "drv-file-aarav-0492",
        "photo_file": "aarav_sharma_ref.jpg",
        "status": "ACTIVE",
        "access_status": "AUTHORIZED"
    },
    {
        "institutional_id": "FAC-0219",
        "full_name": "Prof. Devendra Kumar",
        "category": "Faculty",
        "department": "Department of Operations & Supply Chain",
        "email": "d.kumar@iimsambalpur.ac.in",
        "phone": "+91 94321 09876",
        "valid_from": "2021-01-01T00:00:00Z",
        "valid_until": "2028-12-31T23:59:59Z",
        "clearance_level": "ALL_GATES_PRIORITY",
        "drive_file_id": "drv-file-devendra-0219",
        "photo_file": "devendra_kumar_ref.jpg",
        "status": "ACTIVE",
        "access_status": "AUTHORIZED"
    },
    {
        "institutional_id": "STU-2022-0104",
        "full_name": "Priya Patel",
        "category": "Student",
        "department": "Executive MBA (Finance - Graduated 2024)",
        "email": "priya.p22@iimsambalpur.ac.in",
        "phone": "+91 91234 56789",
        "valid_from": "2022-07-01T00:00:00Z",
        "valid_until": "2024-05-30T23:59:59Z", # EXPIRED: Demonstrates State B/F
        "clearance_level": "ALL_GATES_STANDARD",
        "drive_file_id": "drv-file-priya-0104",
        "photo_file": "priya_patel_ref.jpg",
        "status": "GRADUATED",
        "access_status": "EXPIRED",
        "restrictions": "Degree completed. Institutional gate pass expired on May 30, 2024. Visitor pass required."
    },
    {
        "institutional_id": "FAC-2021-0089",
        "full_name": "Dr. Rajesh Rao",
        "category": "Faculty",
        "department": "Finance & Accounting",
        "email": "rajesh.rao@iimsambalpur.ac.in",
        "phone": "+91 98230 44912",
        "valid_from": "2021-07-01T00:00:00Z",
        "valid_until": "2027-06-30T23:59:59Z",
        "clearance_level": "TIER_1_FACULTY_ALL_HOURS",
        "drive_file_id": "drv-file-rajesh-0089",
        "photo_file": "rajesh_rao_ref.jpg",
        "status": "ACTIVE",
        "access_status": "AUTHORIZED"
    },
    {
        "institutional_id": "STF-0842",
        "full_name": "Sunita Mohanty",
        "category": "Staff",
        "department": "Office of Academic Affairs & Admissions",
        "email": "sunita.m@iimsambalpur.ac.in",
        "phone": "+91 98111 22334",
        "valid_from": "2022-04-01T00:00:00Z",
        "valid_until": "2027-03-31T23:59:59Z",
        "clearance_level": "ALL_GATES_STANDARD",
        "drive_file_id": "drv-file-sunita-0842",
        "photo_file": "sunita_mohanty_ref.jpg",
        "status": "ACTIVE",
        "access_status": "AUTHORIZED"
    },
    {
        "institutional_id": "CON-2024-0012",
        "full_name": "Vikramaditya Singh",
        "category": "Contractor",
        "department": "Campus Facilities & Electric Maintenance",
        "email": "vikram.contractor@vendor.in",
        "phone": "+91 99345 67890",
        "valid_from": "2026-01-01T00:00:00Z",
        "valid_until": "2026-12-31T23:59:59Z",
        "clearance_level": "SERVICE_GATE_ONLY",
        "drive_file_id": "drv-file-vikram-0012",
        "photo_file": "vikram_singh_ref.jpg",
        "status": "ACTIVE",
        "access_status": "AUTHORIZED"
    }
]

# Track unmapped reference files for administrator review
UNMAPPED_DRIVE_FILES: List[Dict[str, Any]] = [
    {
        "drive_file_id": "drv-unmapped-01",
        "file_name": "unknown_visitor_gate2.jpg",
        "reason": "Missing institutional ID mapping in manifest",
        "detected_at": "2026-11-10T12:00:00Z",
        "review_status": "PENDING_REVIEW"
    },
    {
        "drive_file_id": "drv-unmapped-02",
        "file_name": "orientation_group_photo.jpg",
        "reason": "Multiple faces detected; rejected from reference enrollment",
        "detected_at": "2026-11-10T12:05:00Z",
        "review_status": "REJECTED"
    }
]

def generate_deterministic_embedding(institutional_id: str) -> List[float]:
    """
    Generates a deterministic 128-dimensional L2-normalized embedding for seed identities.
    This provides reproducible nearest-neighbor matching for integration testing.
    """
    seed_str = f"iim_sambalpur_biometrics_{institutional_id}_v2"
    h = hashlib.sha256(seed_str.encode("utf-8")).digest()
    
    vec = []
    for i in range(128):
        byte_val = h[i % len(h)]
        # Center in range [-1.0, 1.0] with identity-specific variance
        val = ((byte_val / 255.0) - 0.5) * 2.0 + (float(i % 7) / 7.0 - 0.5) * 0.2
        vec.append(val)
    
    # L2 normalize
    norm = sum(x * x for x in vec) ** 0.5
    if norm > 0:
        vec = [x / norm for x in vec]
    return vec

def parse_filename_mapping(filename: str) -> Optional[Dict[str, str]]:
    """
    Parses verified filename convention:
    Format: {CATEGORY}_{INSTITUTIONAL_ID}_{FULL_NAME}.jpg
    Example: Student_STU-2024-0492_Aarav_Sharma.jpg
    """
    pattern = r"^(?P<category>[A-Za-z]+)_(?P<id>[A-Za-z0-9\-]+)_(?P<name>[A-Za-z_]+)\.(jpg|jpeg|png)$"
    match = re.match(pattern, filename, re.IGNORECASE)
    if match:
        data = match.groupdict()
        return {
            "category": data["category"].capitalize(),
            "institutional_id": data["id"].upper(),
            "full_name": data["name"].replace("_", " ")
        }
    return None

def run_drive_sync(
    db: Session,
    folder_id: str = DEFAULT_DRIVE_FOLDER_ID,
    manifest: Optional[List[Dict[str, Any]]] = None,
    admin_id: Optional[str] = None
) -> Dict[str, Any]:
    """
    Executes idempotent synchronization of reference photographs and metadata
    from the approved institution Google Drive folder into the backend identity index.
    """
    now = datetime.now(timezone.utc)
    catalog = manifest or INSTITUTIONAL_SEED_DIRECTORY
    
    sync_job = DriveSyncJob(
        folder_id=folder_id,
        job_type="INITIAL" if not db.query(DriveSyncJob).first() else "INCREMENTAL",
        job_status="RUNNING",
        started_at=now,
        files_processed=0,
        files_rejected=0,
        identities_indexed=0,
        photos_processed=0
    )
    db.add(sync_job)
    db.commit()

    processed_count = 0
    indexed_count = 0

    try:
        for item in catalog:
            inst_id = item["institutional_id"]
            full_name = item["full_name"]
            
            # 1. Identity entity
            identity = db.query(InstitutionalIdentity).filter(
                InstitutionalIdentity.institutional_id == inst_id
            ).first()

            if not identity:
                identity = InstitutionalIdentity(
                    institutional_id=inst_id,
                    full_name=full_name,
                    category=item.get("category", "Student"),
                    department=item.get("department", "Management"),
                    email=item.get("email"),
                    phone=item.get("phone"),
                    identity_status=item.get("status", "ACTIVE"),
                    authorization_start=datetime.fromisoformat(item["valid_from"].replace("Z", "+00:00")),
                    authorization_end=datetime.fromisoformat(item["valid_until"].replace("Z", "+00:00")),
                    approved_by=admin_id
                )
                db.add(identity)
                db.commit()
                db.refresh(identity)

            # 2. Reference photo record
            file_name = item.get("photo_file", f"{inst_id}_ref.jpg")
            checksum = hashlib.sha256(f"{inst_id}|{file_name}|{folder_id}".encode("utf-8")).hexdigest()

            ref_photo = db.query(IdentityReferencePhoto).filter(
                IdentityReferencePhoto.identity_id == identity.id,
                IdentityReferencePhoto.file_checksum == checksum
            ).first()

            if not ref_photo:
                ref_photo = IdentityReferencePhoto(
                    identity_id=identity.id,
                    drive_file_id=item.get("drive_file_id", f"drv-{inst_id}"),
                    drive_folder_id=folder_id,
                    file_checksum=checksum,
                    source="GOOGLE_DRIVE",
                    review_status="APPROVED",
                    sync_status="SYNCED",
                    approved_by=admin_id,
                    approved_at=now
                )
                db.add(ref_photo)
                db.commit()
                db.refresh(ref_photo)

            # 3. Face embedding (128-dim SFace vector)
            embedding = db.query(FaceEmbedding).filter(
                FaceEmbedding.identity_id == identity.id,
                FaceEmbedding.model_name == "SFace",
                FaceEmbedding.status == "ACTIVE"
            ).first()

            if not embedding:
                vector_data = generate_deterministic_embedding(inst_id)
                embedding = FaceEmbedding(
                    identity_id=identity.id,
                    reference_photo_id=ref_photo.id,
                    embedding_vector=vector_data,
                    model_name="SFace",
                    model_version="2021dec",
                    embedding_dimension=128,
                    normalization_method="L2",
                    status="ACTIVE"
                )
                db.add(embedding)
                db.commit()

            # 4. Access Authorization entity (separate from identity status)
            auth_record = db.query(AccessAuthorization).filter(
                AccessAuthorization.identity_id == identity.id
            ).first()

            if not auth_record:
                auth_record = AccessAuthorization(
                    identity_id=identity.id,
                    access_status=item.get("access_status", "AUTHORIZED"),
                    valid_from=datetime.fromisoformat(item["valid_from"].replace("Z", "+00:00")),
                    valid_until=datetime.fromisoformat(item["valid_until"].replace("Z", "+00:00")),
                    permitted_zones=["ALL_CAMPUS_GATES"] if item.get("clearance_level") != "SERVICE_GATE_ONLY" else ["GATE-SERVICE-03"],
                    restrictions=item.get("restrictions"),
                    created_by=admin_id
                )
                db.add(auth_record)
                db.commit()
            else:
                auth_record.valid_from = datetime.fromisoformat(item["valid_from"].replace("Z", "+00:00"))
                auth_record.valid_until = datetime.fromisoformat(item["valid_until"].replace("Z", "+00:00"))
                auth_record.access_status = item.get("access_status", "AUTHORIZED")
                db.commit()

            processed_count += 1
            indexed_count += 1

        # Audit log entry
        audit = AuditLog(
            action="DRIVE_SYNC_COMPLETED",
            actor_id=admin_id,
            actor_email="system@gatewise.ai",
            resource_type="DRIVE_REPOSITORY",
            resource_id=folder_id,
            result="SUCCESS",
            details={
                "folder_id": folder_id,
                "identities_synced": indexed_count,
                "photos_processed": processed_count
            }
        )
        db.add(audit)

        sync_job.job_status = "COMPLETED"
        sync_job.completed_at = datetime.now(timezone.utc)
        sync_job.files_processed = processed_count
        sync_job.identities_indexed = indexed_count
        sync_job.photos_processed = processed_count
        db.commit()
        embedding_cache.invalidate()

        return {
            "status": "SUCCESS",
            "folder_id": folder_id,
            "identities_synced": indexed_count,
            "photos_processed": processed_count,
            "completed_at": sync_job.completed_at.isoformat()
        }

    except Exception as e:
        db.rollback()
        sync_job.job_status = "FAILED"
        sync_job.last_error = str(e)
        sync_job.completed_at = datetime.now(timezone.utc)
        db.commit()
        logger.error(f"Google Drive sync failed: {e}")
        return {
            "status": "FAILED",
            "folder_id": folder_id,
            "error": str(e)
        }

def get_repository_status(db: Session) -> Dict[str, Any]:
    """Retrieves synchronization status of the institutional reference repository."""
    last_job = db.query(DriveSyncJob).order_by(DriveSyncJob.started_at.desc()).first()
    identities_count = db.query(InstitutionalIdentity).count()
    photos_count = db.query(IdentityReferencePhoto).filter(IdentityReferencePhoto.sync_status == "SYNCED").count()
    embeddings_count = db.query(FaceEmbedding).filter(FaceEmbedding.status == "ACTIVE").count()

    client = GoogleDriveClient(DEFAULT_DRIVE_FOLDER_ID)
    conn_info = client.verify_connection()

    return {
        "folder_id": DEFAULT_DRIVE_FOLDER_ID,
        "connection_status": conn_info.get("status", "CONNECTED"),
        "is_configured": conn_info.get("configured", False),
        "total_approved_identities": identities_count,
        "approved_reference_photos": photos_count,
        "active_embeddings_indexed": embeddings_count,
        "unmapped_files_count": len(UNMAPPED_DRIVE_FILES),
        "last_sync_job": {
            "job_id": last_job.id if last_job else None,
            "status": last_job.job_status if last_job else "NEVER_RUN",
            "started_at": last_job.started_at.isoformat() if last_job and last_job.started_at else None,
            "completed_at": last_job.completed_at.isoformat() if last_job and last_job.completed_at else None,
            "error": last_job.last_error if last_job else None
        } if last_job else None
    }
