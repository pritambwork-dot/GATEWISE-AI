import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Boolean, Float, DateTime, ForeignKey, Text, JSON
from sqlalchemy.orm import relationship
from ..core.database import Base

def gen_uuid():
    return str(uuid.uuid4())

def utc_now():
    return datetime.now(timezone.utc)

class User(Base):
    __tablename__ = "users"
    id = Column(String, primary_key=True, default=gen_uuid)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String, nullable=False)
    role = Column(String, nullable=False, default="SECURITY_GUARD") # SUPER_ADMIN, ADMIN, SECURITY_GUARD
    employee_id = Column(String, unique=True, nullable=False)
    avatar_url = Column(String, nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=utc_now)
    
    # Relationships
    gate_assignments = relationship("GuardGateAssignment", back_populates="guard")

class Gate(Base):
    __tablename__ = "gates"
    id = Column(String, primary_key=True, default=gen_uuid)
    name = Column(String, nullable=False) # e.g. Main Campus Gate
    code = Column(String, unique=True, nullable=False) # e.g. GATE-NORTH-02
    location = Column(String, nullable=False)
    operating_hours = Column(String, default="06:00 - 23:00")
    status = Column(String, default="ACTIVE") # ACTIVE, MAINTENANCE, OFFLINE
    created_at = Column(DateTime, default=utc_now)
    
    # Relationships
    guard_assignments = relationship("GuardGateAssignment", back_populates="gate")
    verification_events = relationship("VerificationEvent", back_populates="gate")

class GuardGateAssignment(Base):
    __tablename__ = "guard_gate_assignments"
    id = Column(String, primary_key=True, default=gen_uuid)
    guard_id = Column(String, ForeignKey("users.id"), nullable=False)
    gate_id = Column(String, ForeignKey("gates.id"), nullable=False)
    shift_name = Column(String, default="Shift A (Morning)")
    is_active = Column(Boolean, default=True)
    assigned_at = Column(DateTime, default=utc_now)
    assigned_by = Column(String, nullable=False) # Admin employee ID
    
    guard = relationship("User", back_populates="gate_assignments")
    gate = relationship("Gate", back_populates="guard_assignments")

class InstitutionalIdentity(Base):
    __tablename__ = "institutional_identities"
    id = Column(String, primary_key=True, default=gen_uuid)
    person_id = Column(String, unique=True, index=True, nullable=False) # e.g. STU-2024-0492
    full_name = Column(String, nullable=False)
    category = Column(String, nullable=False) # Student, Faculty, Staff, Contractor
    department = Column(String, nullable=False)
    email = Column(String, nullable=True)
    phone = Column(String, nullable=True)
    valid_from = Column(String, nullable=False)
    valid_until = Column(String, nullable=False)
    clearance_level = Column(String, default="ALL_GATES_STANDARD")
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=utc_now)
    
    reference_photos = relationship("IdentityReferencePhoto", back_populates="identity")
    embeddings = relationship("FaceEmbedding", back_populates="identity")

class IdentityReferencePhoto(Base):
    __tablename__ = "identity_reference_photos"
    id = Column(String, primary_key=True, default=gen_uuid)
    identity_id = Column(String, ForeignKey("institutional_identities.id"), nullable=False)
    drive_file_id = Column(String, nullable=True)
    file_name = Column(String, nullable=False)
    file_path = Column(String, nullable=False)
    checksum = Column(String, nullable=False)
    is_approved = Column(Boolean, default=True)
    synced_at = Column(DateTime, default=utc_now)
    
    identity = relationship("InstitutionalIdentity", back_populates="reference_photos")

class FaceEmbedding(Base):
    __tablename__ = "face_embeddings"
    id = Column(String, primary_key=True, default=gen_uuid)
    identity_id = Column(String, ForeignKey("institutional_identities.id"), nullable=False)
    photo_id = Column(String, ForeignKey("identity_reference_photos.id"), nullable=True)
    model_name = Column(String, default="SFace")
    model_version = Column(String, default="v1.0")
    vector = Column(JSON, nullable=False) # 128-dim list of floats for pgvector/sqlite
    created_at = Column(DateTime, default=utc_now)
    
    identity = relationship("InstitutionalIdentity", back_populates="embeddings")

class VerificationEvent(Base):
    __tablename__ = "verification_events"
    id = Column(String, primary_key=True, default=gen_uuid) # EVT-2026-XXXX
    timestamp = Column(DateTime, default=utc_now, index=True)
    gate_id = Column(String, ForeignKey("gates.id"), nullable=False)
    guard_id = Column(String, ForeignKey("users.id"), nullable=False)
    person_id = Column(String, nullable=True) # None if unknown
    person_name = Column(String, nullable=True)
    person_category = Column(String, nullable=True)
    match_outcome = Column(String, nullable=False) # VERIFIED_AUTHORIZED, IDENTIFIED_UNAUTHORIZED, etc.
    similarity_score = Column(Float, nullable=True)
    guard_decision = Column(String, nullable=False) # GRANT_ENTRY, DENY_ENTRY, ESCALATE_TO_ADMIN
    decision_reason = Column(String, nullable=True)
    cryptographic_signature = Column(String, nullable=False)
    sync_status = Column(String, default="SYNCED")
    
    gate = relationship("Gate", back_populates="verification_events")

class VisitorPass(Base):
    __tablename__ = "visitor_passes"
    id = Column(String, primary_key=True, default=gen_uuid)
    pass_code = Column(String, unique=True, index=True, nullable=False) # PASS-8921
    visitor_name = Column(String, nullable=False)
    phone = Column(String, nullable=False)
    id_type = Column(String, nullable=False)
    id_number = Column(String, nullable=False)
    host_name = Column(String, nullable=False)
    host_department = Column(String, nullable=False)
    purpose = Column(String, nullable=False)
    valid_date = Column(String, nullable=False)
    valid_until_time = Column(String, nullable=False)
    status = Column(String, default="EXPECTED") # EXPECTED, CHECKED_IN, CHECKED_OUT, EXPIRED
    check_in_time = Column(DateTime, nullable=True)
    check_out_time = Column(DateTime, nullable=True)
    gate_id = Column(String, nullable=True)
    created_at = Column(DateTime, default=utc_now)

class EnrollmentRequest(Base):
    __tablename__ = "enrollment_requests"
    id = Column(String, primary_key=True, default=gen_uuid)
    person_name = Column(String, nullable=False)
    proposed_category = Column(String, nullable=False)
    department = Column(String, nullable=False)
    captured_image_path = Column(String, nullable=False)
    submitted_by_guard_id = Column(String, nullable=False)
    gate_id = Column(String, nullable=False)
    status = Column(String, default="PENDING") # PENDING, APPROVED, REJECTED
    admin_notes = Column(Text, nullable=True)
    submitted_at = Column(DateTime, default=utc_now)
    reviewed_at = Column(DateTime, nullable=True)
    reviewed_by = Column(String, nullable=True)

class DriveSyncJob(Base):
    __tablename__ = "drive_sync_jobs"
    id = Column(String, primary_key=True, default=gen_uuid)
    folder_id = Column(String, nullable=False)
    status = Column(String, default="COMPLETED") # RUNNING, COMPLETED, FAILED
    identities_indexed = Column(Float, default=0)
    photos_processed = Column(Float, default=0)
    error_message = Column(Text, nullable=True)
    started_at = Column(DateTime, default=utc_now)
    completed_at = Column(DateTime, nullable=True)

class AuditLog(Base):
    __tablename__ = "audit_logs"
    id = Column(String, primary_key=True, default=gen_uuid)
    action = Column(String, nullable=False)
    actor_id = Column(String, nullable=False)
    actor_email = Column(String, nullable=False)
    details = Column(JSON, nullable=True)
    ip_address = Column(String, nullable=True)
    timestamp = Column(DateTime, default=utc_now)
