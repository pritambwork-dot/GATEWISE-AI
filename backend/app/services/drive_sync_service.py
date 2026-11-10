import hashlib
from datetime import datetime, timezone
from typing import Dict, Any, List
from sqlalchemy.orm import Session
from ..models.entities import (
    InstitutionalIdentity, IdentityReferencePhoto,
    FaceEmbedding, DriveSyncJob, AuditLog
)
from ..computer_vision.face_pipeline import FacePipeline

cv_pipeline = FacePipeline()

# Reference identity repository catalog for IIM Sambalpur institutional directory
SEED_IDENTITIES = [
    {
        "person_id": "STU-2024-0492",
        "full_name": "Aarav Sharma",
        "category": "Student",
        "department": "MBA - Term IV (Marketing & Strategy)",
        "email": "aarav.s24@iimsambalpur.ac.in",
        "phone": "+91 98765 43210",
        "valid_from": "2024-06-01",
        "valid_until": "2026-06-30",
        "clearance_level": "ALL_GATES_STANDARD",
        "photo_file": "aarav_sharma_ref.jpg",
        "is_active": True
    },
    {
        "person_id": "FAC-0219",
        "full_name": "Prof. Devendra Kumar",
        "category": "Faculty",
        "department": "Department of Operations & Supply Chain",
        "email": "d.kumar@iimsambalpur.ac.in",
        "phone": "+91 94321 09876",
        "valid_from": "2021-01-01",
        "valid_until": "2028-12-31",
        "clearance_level": "ALL_GATES_PRIORITY",
        "photo_file": "devendra_kumar_ref.jpg",
        "is_active": True
    },
    {
        "person_id": "STU-2023-0182",
        "full_name": "Priya Patel",
        "category": "Student",
        "department": "Executive MBA (Finance)",
        "email": "priya.p23@iimsambalpur.ac.in",
        "phone": "+91 91234 56789",
        "valid_from": "2023-07-01",
        "valid_until": "2024-06-30", # Expired - Demonstrates State B & F: Identified but Expired/Unauthorized
        "clearance_level": "ALL_GATES_STANDARD",
        "photo_file": "priya_patel_ref.jpg",
        "is_active": True
    },
    {
        "person_id": "STF-0842",
        "full_name": "Sunita Mohanty",
        "category": "Staff",
        "department": "Office of Academic Affairs & Admissions",
        "email": "sunita.m@iimsambalpur.ac.in",
        "phone": "+91 98111 22334",
        "valid_from": "2022-04-01",
        "valid_until": "2027-03-31",
        "clearance_level": "ALL_GATES_STANDARD",
        "photo_file": "sunita_mohanty_ref.jpg",
        "is_active": True
    },
    {
        "person_id": "CTR-1094",
        "full_name": "Rajesh Nayak",
        "category": "Contractor",
        "department": "Campus Facilities & Electric Maintenance",
        "email": "rajesh.contractor@vendor.in",
        "phone": "+91 99345 67890",
        "valid_from": "2026-01-01",
        "valid_until": "2026-12-31",
        "clearance_level": "SERVICE_GATE_ONLY",
        "photo_file": "rajesh_nayak_ref.jpg",
        "is_active": True
    }
]

def generate_synthetic_embedding(person_id: str) -> List[float]:
    """Generates a reproducible 128-dim normalized embedding based on person_id hash."""
    seed_hash = hashlib.sha256(person_id.encode("utf-8")).digest()
    vals = []
    for i in range(128):
        byte_val = seed_hash[i % len(seed_hash)]
        vals.append(float(byte_val) / 255.0 - 0.5)
    import numpy as np
    arr = np.array(vals, dtype=np.float32)
    norm = np.linalg.norm(arr)
    if norm > 0:
        arr = arr / norm
    return arr.tolist()

def run_drive_sync(db: Session, folder_id: str = "IIM_Sambalpur_Approved_Identities_2024_2026") -> Dict[str, Any]:
    job = DriveSyncJob(
        folder_id=folder_id,
        status="RUNNING"
    )
    db.add(job)
    db.commit()
    db.refresh(job)

    try:
        indexed_count = 0
        photos_count = 0

        for item in SEED_IDENTITIES:
            # Check if identity exists
            ident = db.query(InstitutionalIdentity).filter(InstitutionalIdentity.person_id == item["person_id"]).first()
            if not ident:
                ident = InstitutionalIdentity(
                    person_id=item["person_id"],
                    full_name=item["full_name"],
                    category=item["category"],
                    department=item["department"],
                    email=item["email"],
                    phone=item["phone"],
                    valid_from=item["valid_from"],
                    valid_until=item["valid_until"],
                    clearance_level=item["clearance_level"],
                    is_active=item["is_active"]
                )
                db.add(ident)
                db.commit()
                db.refresh(ident)
                indexed_count += 1
            else:
                ident.valid_until = item["valid_until"]
                ident.is_active = item["is_active"]
                db.commit()

            # Check reference photo
            photo = db.query(IdentityReferencePhoto).filter(IdentityReferencePhoto.identity_id == ident.id).first()
            if not photo:
                photo = IdentityReferencePhoto(
                    identity_id=ident.id,
                    drive_file_id=f"gdrive_{item['person_id']}",
                    file_name=item["photo_file"],
                    file_path=f"https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80" if "Sharma" in item["full_name"] else (
                        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80" if "Devendra" in item["full_name"] else
                        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80"
                    ),
                    checksum=hashlib.md5(item["person_id"].encode()).hexdigest(),
                    is_approved=True
                )
                db.add(photo)
                db.commit()
                db.refresh(photo)
                photos_count += 1

            # Check embedding
            embedding = db.query(FaceEmbedding).filter(FaceEmbedding.identity_id == ident.id).first()
            if not embedding:
                vec = generate_synthetic_embedding(item["person_id"])
                embedding = FaceEmbedding(
                    identity_id=ident.id,
                    photo_id=photo.id,
                    model_name="SFace",
                    model_version="v1.0",
                    vector=vec
                )
                db.add(embedding)
                db.commit()

        job.status = "COMPLETED"
        job.identities_indexed = float(len(SEED_IDENTITIES))
        job.photos_processed = float(len(SEED_IDENTITIES))
        job.completed_at = datetime.now(timezone.utc)
        db.commit()

        return {
            "status": "COMPLETED",
            "folder_id": folder_id,
            "identities_indexed": len(SEED_IDENTITIES),
            "photos_processed": len(SEED_IDENTITIES),
            "synced_at": job.completed_at.isoformat()
        }
    except Exception as e:
        job.status = "FAILED"
        job.error_message = str(e)
        job.completed_at = datetime.now(timezone.utc)
        db.commit()
        return {
            "status": "FAILED",
            "error": str(e)
        }
