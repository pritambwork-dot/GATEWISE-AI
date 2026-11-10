import uuid
from datetime import datetime, timezone
from typing import List, Optional
from sqlalchemy import (
    Column, String, Boolean, Float, DateTime, ForeignKey, Text, JSON, Integer, Index
)
from sqlalchemy.orm import relationship
from sqlalchemy.types import TypeDecorator
from ..core.database import Base

def gen_uuid() -> str:
    return str(uuid.uuid4())

def utc_now() -> datetime:
    return datetime.now(timezone.utc)

class Vector128(TypeDecorator):
    """
    Dual-compatibility vector type:
    Uses pgvector's Vector(128) on PostgreSQL when available;
    falls back to JSON serialized list on SQLite for lightweight local dev and testing.
    """
    impl = JSON
    cache_ok = True

    def load_dialect_impl(self, dialect):
        if dialect.name == "postgresql":
            try:
                from pgvector.sqlalchemy import Vector
                return dialect.type_descriptor(Vector(128))
            except ImportError:
                return dialect.type_descriptor(JSON())
        return dialect.type_descriptor(JSON())

    def process_bind_param(self, value, dialect):
        if value is None:
            return None
        if isinstance(value, list):
            return value
        return list(value)

    def process_result_value(self, value, dialect):
        if value is None:
            return None
        return list(value)

# ==============================================================================
# 1. USERS & SESSIONS
# ==============================================================================

class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, default=gen_uuid)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False) # Argon2id hashed
    full_name = Column(String, nullable=False)
    employee_id = Column(String, unique=True, index=True, nullable=False)
    role = Column(String, nullable=False, default="SECURITY_GUARD") # SUPER_ADMIN, ADMIN, SECURITY_GUARD
    account_status = Column(String, nullable=False, default="ACTIVE") # ACTIVE, SUSPENDED, DEACTIVATED
    mfa_enabled = Column(Boolean, default=False)
    avatar_url = Column(String, nullable=True)
    created_at = Column(DateTime, default=utc_now)
    updated_at = Column(DateTime, default=utc_now, onupdate=utc_now)

    # Relationships
    gate_assignments = relationship("GuardGateAssignment", foreign_keys="GuardGateAssignment.guard_id", back_populates="guard")
    sessions = relationship("UserSession", back_populates="user", cascade="all, delete-orphan")
    verification_events = relationship("VerificationEvent", back_populates="guard")
    guard_decisions = relationship("GuardDecision", back_populates="guard")

    @property
    def hashed_password(self) -> str:
        return self.password_hash

    @hashed_password.setter
    def hashed_password(self, val: str):
        self.password_hash = val

    @property
    def is_active(self) -> bool:
        return self.account_status == "ACTIVE"

    @is_active.setter
    def is_active(self, val: bool):
        self.account_status = "ACTIVE" if val else "DEACTIVATED"

class UserSession(Base):
    __tablename__ = "user_sessions"

    id = Column(String, primary_key=True, default=gen_uuid)
    user_id = Column(String, ForeignKey("users.id"), nullable=False, index=True)
    refresh_token_hash = Column(String, unique=True, index=True, nullable=False)
    device_info = Column(String, nullable=True)
    expires_at = Column(DateTime, nullable=False)
    is_revoked = Column(Boolean, default=False)
    created_at = Column(DateTime, default=utc_now)

    user = relationship("User", back_populates="sessions")

# ==============================================================================
# 2. GATES
# ==============================================================================

class Gate(Base):
    __tablename__ = "gates"

    id = Column(String, primary_key=True, default=gen_uuid)
    gate_code = Column(String, unique=True, index=True, nullable=False) # e.g. GATE-MAIN-02
    gate_name = Column(String, nullable=False) # e.g. Main Campus Gate · Post 02
    location = Column(String, nullable=False)
    operating_hours = Column(String, default="24/7 Continuous")
    status = Column(String, default="ACTIVE") # ACTIVE, MAINTENANCE, OFFLINE
    created_at = Column(DateTime, default=utc_now)

    # Relationships
    guard_assignments = relationship("GuardGateAssignment", back_populates="gate")
    verification_events = relationship("VerificationEvent", back_populates="gate")

    @property
    def name(self) -> str:
        return self.gate_name

    @name.setter
    def name(self, val: str):
        self.gate_name = val

    @property
    def code(self) -> str:
        return self.gate_code

    @code.setter
    def code(self, val: str):
        self.gate_code = val

# ==============================================================================
# 3. GUARD GATE ASSIGNMENTS
# ==============================================================================

class GuardGateAssignment(Base):
    __tablename__ = "guard_gate_assignments"

    id = Column(String, primary_key=True, default=gen_uuid)
    guard_id = Column(String, ForeignKey("users.id"), nullable=False, index=True)
    gate_id = Column(String, ForeignKey("gates.id"), nullable=False, index=True)
    assigned_by = Column(String, ForeignKey("users.id"), nullable=False) # Admin user ID
    assigned_at = Column(DateTime, default=utc_now)
    effective_from = Column(DateTime, default=utc_now)
    effective_until = Column(DateTime, nullable=True)
    status = Column(String, default="ACTIVE") # ACTIVE, EXPIRED, REVOKED
    shift_name = Column(String, default="Shift A (Morning 06:00 - 14:00)")

    guard = relationship("User", foreign_keys=[guard_id], back_populates="gate_assignments")
    gate = relationship("Gate", back_populates="guard_assignments")
    assigner = relationship("User", foreign_keys=[assigned_by])

    @property
    def is_active(self) -> bool:
        return self.status == "ACTIVE"

# ==============================================================================
# 4. INSTITUTIONAL IDENTITIES
# ==============================================================================

class InstitutionalIdentity(Base):
    __tablename__ = "institutional_identities"

    id = Column(String, primary_key=True, default=gen_uuid)
    institutional_id = Column(String, unique=True, index=True, nullable=False) # STU-2024-0492, FAC-0219
    full_name = Column(String, nullable=False, index=True)
    category = Column(String, nullable=False) # Student, Faculty, Staff, Visiting Faculty, Researcher, Contractor, Other
    department = Column(String, nullable=False)
    designation = Column(String, nullable=True)
    identity_status = Column(String, default="ACTIVE") # ACTIVE, GRADUATED, SUSPENDED, DEACTIVATED
    authorization_start = Column(DateTime, nullable=True)
    authorization_end = Column(DateTime, nullable=True)
    approved_by = Column(String, ForeignKey("users.id"), nullable=True)
    approved_at = Column(DateTime, nullable=True)
    email = Column(String, nullable=True)
    phone = Column(String, nullable=True)
    created_at = Column(DateTime, default=utc_now)
    updated_at = Column(DateTime, default=utc_now, onupdate=utc_now)

    # Relationships
    reference_photos = relationship("IdentityReferencePhoto", back_populates="identity", cascade="all, delete-orphan")
    embeddings = relationship("FaceEmbedding", back_populates="identity", cascade="all, delete-orphan")
    access_authorizations = relationship("AccessAuthorization", back_populates="identity", cascade="all, delete-orphan")
    approver = relationship("User", foreign_keys=[approved_by])

    @property
    def person_id(self) -> str:
        return self.institutional_id

# ==============================================================================
# 5. IDENTITY REFERENCE PHOTOS
# ==============================================================================

class IdentityReferencePhoto(Base):
    __tablename__ = "identity_reference_photos"

    id = Column(String, primary_key=True, default=gen_uuid)
    identity_id = Column(String, ForeignKey("institutional_identities.id"), nullable=False, index=True)
    drive_file_id = Column(String, nullable=True, index=True)
    drive_folder_id = Column(String, nullable=True)
    file_checksum = Column(String, nullable=False, index=True) # SHA-256 of image bytes
    source = Column(String, default="GOOGLE_DRIVE") # GOOGLE_DRIVE, ADMIN_MANUAL
    review_status = Column(String, default="APPROVED") # APPROVED, PENDING_REVIEW, REJECTED
    approved_by = Column(String, ForeignKey("users.id"), nullable=True)
    approved_at = Column(DateTime, nullable=True)
    sync_status = Column(String, default="SYNCED") # SYNCED, PENDING, DEACTIVATED
    created_at = Column(DateTime, default=utc_now)

    identity = relationship("InstitutionalIdentity", back_populates="reference_photos")
    embeddings = relationship("FaceEmbedding", back_populates="reference_photo", cascade="all, delete-orphan")
    approver = relationship("User", foreign_keys=[approved_by])

# ==============================================================================
# 6. FACE EMBEDDINGS (pgvector / Vector128)
# ==============================================================================

class FaceEmbedding(Base):
    __tablename__ = "face_embeddings"

    id = Column(String, primary_key=True, default=gen_uuid)
    identity_id = Column(String, ForeignKey("institutional_identities.id"), nullable=False, index=True)
    reference_photo_id = Column(String, ForeignKey("identity_reference_photos.id"), nullable=True, index=True)
    embedding_vector = Column(Vector128, nullable=False) # 128-dimensional L2-normalized vector
    model_name = Column(String, default="SFace", nullable=False)
    model_version = Column(String, default="2021dec", nullable=False)
    embedding_dimension = Column(Integer, default=128, nullable=False)
    normalization_method = Column(String, default="L2", nullable=False)
    status = Column(String, default="ACTIVE", nullable=False) # ACTIVE, DEPRECATED
    created_at = Column(DateTime, default=utc_now)

    identity = relationship("InstitutionalIdentity", back_populates="embeddings")
    reference_photo = relationship("IdentityReferencePhoto", back_populates="embeddings")

# ==============================================================================
# 7. ACCESS AUTHORIZATIONS (Separate from identity status)
# ==============================================================================

class AccessAuthorization(Base):
    __tablename__ = "access_authorizations"

    id = Column(String, primary_key=True, default=gen_uuid)
    identity_id = Column(String, ForeignKey("institutional_identities.id"), nullable=False, index=True)
    access_status = Column(String, default="AUTHORIZED") # AUTHORIZED, EXPIRED, SUSPENDED, REVOKED
    valid_from = Column(DateTime, nullable=False)
    valid_until = Column(DateTime, nullable=False)
    permitted_zones = Column(JSON, default=list) # e.g. ["ALL_CAMPUS_GATES"] or specific gate IDs
    restrictions = Column(Text, nullable=True) # Reason if access is revoked or constrained
    created_by = Column(String, ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime, default=utc_now)
    updated_at = Column(DateTime, default=utc_now, onupdate=utc_now)

    identity = relationship("InstitutionalIdentity", back_populates="access_authorizations")
    creator = relationship("User", foreign_keys=[created_by])

# ==============================================================================
# 8. VISITORS / VISITOR PASSES
# ==============================================================================

class VisitorPass(Base):
    __tablename__ = "visitor_passes"

    id = Column(String, primary_key=True, default=gen_uuid)
    pass_code = Column(String, unique=True, index=True, nullable=False) # e.g. PASS-8921
    visitor_name = Column(String, nullable=False, index=True)
    contact_details = Column(String, nullable=True) # Phone or email
    phone = Column(String, nullable=False)
    id_type = Column(String, nullable=False) # Aadhaar Card, Driving License, PAN, Passport
    id_number = Column(String, nullable=False)
    host_name = Column(String, nullable=False)
    host_identity_id = Column(String, ForeignKey("institutional_identities.id"), nullable=True)
    host_department = Column(String, nullable=False)
    visit_purpose = Column(String, nullable=False)
    purpose = Column(String, nullable=True) # Alias for compatibility
    appointment_start = Column(DateTime, nullable=True)
    appointment_end = Column(DateTime, nullable=True)
    valid_date = Column(String, nullable=False)
    valid_until_time = Column(String, nullable=False) # e.g. "18:00"
    approval_status = Column(String, default="EXPECTED") # EXPECTED, CHECKED_IN, CHECKED_OUT, EXPIRED, REJECTED
    status = Column(String, default="EXPECTED") # Alias for compatibility
    check_in_at = Column(DateTime, nullable=True)
    check_out_at = Column(DateTime, nullable=True)
    check_in_time = Column(DateTime, nullable=True) # Alias
    check_out_time = Column(DateTime, nullable=True) # Alias
    gate_id = Column(String, ForeignKey("gates.id"), nullable=True)
    created_by = Column(String, ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime, default=utc_now)

    host_identity = relationship("InstitutionalIdentity", foreign_keys=[host_identity_id])
    gate = relationship("Gate", foreign_keys=[gate_id])
    creator = relationship("User", foreign_keys=[created_by])

# ==============================================================================
# 9. ENROLLMENT REQUESTS
# ==============================================================================

class EnrollmentRequest(Base):
    __tablename__ = "enrollment_requests"

    id = Column(String, primary_key=True, default=gen_uuid)
    submitted_by_guard_id = Column(String, ForeignKey("users.id"), nullable=False, index=True)
    assigned_gate_id = Column(String, ForeignKey("gates.id"), nullable=False, index=True)
    visitor_or_person_name = Column(String, nullable=False)
    person_name = Column(String, nullable=True) # Alias for compatibility
    proposed_category = Column(String, nullable=False) # Student, Faculty, Staff, Contractor
    department = Column(String, nullable=False)
    institutional_id = Column(String, nullable=True)
    reason_for_review = Column(Text, nullable=False)
    captured_image_path = Column(String, nullable=True)
    captured_image_hash = Column(String, nullable=True)
    request_status = Column(String, default="PENDING") # PENDING, UNDER_REVIEW, APPROVED, REJECTED
    status = Column(String, default="PENDING") # Alias
    administrator_notes = Column(Text, nullable=True)
    admin_notes = Column(Text, nullable=True) # Alias
    reviewed_by = Column(String, ForeignKey("users.id"), nullable=True)
    reviewed_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=utc_now)
    submitted_at = Column(DateTime, default=utc_now) # Alias

    guard = relationship("User", foreign_keys=[submitted_by_guard_id])
    gate = relationship("Gate", foreign_keys=[assigned_gate_id])

    @property
    def gate_id(self) -> str:
        return self.assigned_gate_id
    reviewer = relationship("User", foreign_keys=[reviewed_by])

# ==============================================================================
# 10. VERIFICATION EVENTS
# ==============================================================================

class VerificationEvent(Base):
    __tablename__ = "verification_events"

    id = Column(String, primary_key=True, default=gen_uuid) # e.g. EVT-20261110-XXXX
    guard_id = Column(String, ForeignKey("users.id"), nullable=False, index=True)
    gate_id = Column(String, ForeignKey("gates.id"), nullable=False, index=True)
    verification_timestamp = Column(DateTime, default=utc_now, index=True)
    timestamp = Column(DateTime, default=utc_now, index=True) # Alias
    identity_match_status = Column(String, nullable=False) # VERIFIED_AUTHORIZED, IDENTIFIED_UNAUTHORIZED, POTENTIAL_MATCH, UNKNOWN_PERSON, IMAGE_QUALITY_INSUFFICIENT, SERVICE_UNAVAILABLE
    match_outcome = Column(String, nullable=False) # Alias
    authorization_status = Column(String, nullable=True) # AUTHORIZED, UNAUTHORIZED, EXPIRED
    candidate_identity_id = Column(String, ForeignKey("institutional_identities.id"), nullable=True, index=True)
    person_id = Column(String, nullable=True) # STU-2024-0492
    person_name = Column(String, nullable=True)
    person_category = Column(String, nullable=True)
    similarity_score = Column(Float, nullable=True)
    processing_status = Column(String, default="COMPLETED") # COMPLETED, FAILED
    final_decision_status = Column(String, default="PENDING") # PENDING, GRANT_ENTRY, DENY_ENTRY, ESCALATE_TO_ADMIN, REFER_TO_VISITOR_DESK
    guard_decision = Column(String, default="PENDING") # Alias
    decision_reason = Column(String, nullable=True)
    decision_recorded_at = Column(DateTime, nullable=True)
    cryptographic_signature = Column(String, nullable=False) # HMAC-SHA256 seal
    sync_status = Column(String, default="SYNCED")

    guard = relationship("User", back_populates="verification_events")
    gate = relationship("Gate", back_populates="verification_events")
    candidate_identity = relationship("InstitutionalIdentity", foreign_keys=[candidate_identity_id])
    decision_record = relationship("GuardDecision", back_populates="verification_event", uselist=False, cascade="all, delete-orphan")

# ==============================================================================
# 11. GUARD DECISIONS
# ==============================================================================

class GuardDecision(Base):
    __tablename__ = "guard_decisions"

    id = Column(String, primary_key=True, default=gen_uuid)
    verification_event_id = Column(String, ForeignKey("verification_events.id"), unique=True, nullable=False)
    guard_id = Column(String, ForeignKey("users.id"), nullable=False)
    decision = Column(String, nullable=False) # GRANT_ENTRY, DENY_ENTRY, ESCALATE_TO_ADMIN, REFER_TO_VISITOR_DESK
    decision_reason = Column(Text, nullable=True)
    recorded_at = Column(DateTime, default=utc_now)

    verification_event = relationship("VerificationEvent", back_populates="decision_record")
    guard = relationship("User", back_populates="guard_decisions")

# ==============================================================================
# 12. AUDIT LOGS
# ==============================================================================

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(String, primary_key=True, default=gen_uuid)
    actor_id = Column(String, ForeignKey("users.id"), nullable=True, index=True)
    actor_email = Column(String, nullable=True)
    action = Column(String, nullable=False, index=True) # AUTH_LOGIN, VERIFICATION_SUBMIT, DECISION_COMMIT, etc.
    resource_type = Column(String, nullable=False) # USER, GATE, VERIFICATION_EVENT, DRIVE_SYNC
    resource_id = Column(String, nullable=True, index=True)
    timestamp = Column(DateTime, default=utc_now, index=True)
    result = Column(String, default="SUCCESS") # SUCCESS, FAILURE, REJECTED
    relevant_request_id = Column(String, nullable=True)
    details = Column(JSON, nullable=True)
    ip_address = Column(String, nullable=True)

    actor = relationship("User", foreign_keys=[actor_id])

# ==============================================================================
# 13. DRIVE SYNCHRONIZATION JOBS
# ==============================================================================

class DriveSyncJob(Base):
    __tablename__ = "drive_sync_jobs"

    id = Column(String, primary_key=True, default=gen_uuid)
    folder_id = Column(String, nullable=False)
    job_type = Column(String, default="INITIAL") # INITIAL, INCREMENTAL, MANUAL
    job_status = Column(String, default="COMPLETED") # RUNNING, COMPLETED, FAILED
    started_at = Column(DateTime, default=utc_now)
    completed_at = Column(DateTime, nullable=True)
    files_processed = Column(Integer, default=0)
    files_rejected = Column(Integer, default=0)
    identities_indexed = Column(Integer, default=0) # Alias
    photos_processed = Column(Integer, default=0) # Alias
    last_error = Column(Text, nullable=True)
    error_message = Column(Text, nullable=True) # Alias
    page_token = Column(String, nullable=True)

    @property
    def status(self) -> str:
        return self.job_status
