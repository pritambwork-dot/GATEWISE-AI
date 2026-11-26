-- =============================================================================
-- GATEWISE AI — MASTER GATE SECURITY & VISITOR VERIFICATION DATABASE SCHEMA
-- Target Database: PostgreSQL 15+ / Supabase PostgreSQL with pgvector
-- Revision: 2026.11.26 - Production Master
-- =============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
-- CREATE EXTENSION IF NOT EXISTS "vector"; -- Enable if pgvector is installed

-- -----------------------------------------------------------------------------
-- 1. USERS TABLE (Centralized Authentication & RBAC Root)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id VARCHAR(64) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(32),
    role VARCHAR(32) NOT NULL CHECK (role IN ('SUPER_ADMIN', 'ADMIN', 'GUARD')),
    account_status VARCHAR(32) NOT NULL DEFAULT 'ACTIVE' CHECK (account_status IN ('ACTIVE', 'SUSPENDED', 'DEACTIVATED')),
    avatar_url TEXT,
    mfa_enabled BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- 2. ADMINISTRATORS TABLE
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS administrators (
    id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    admin_code VARCHAR(32) UNIQUE NOT NULL,
    department VARCHAR(128) NOT NULL DEFAULT 'Institutional Security Directorate',
    clearance_level VARCHAR(32) NOT NULL DEFAULT 'LEVEL_3_DIRECTOR',
    can_manage_guards BOOLEAN NOT NULL DEFAULT TRUE,
    can_approve_registrations BOOLEAN NOT NULL DEFAULT TRUE,
    can_export_reports BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- 3. GUARDS TABLE
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS guards (
    id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    guard_badge_id VARCHAR(32) UNIQUE NOT NULL, -- e.g. 'GRD-101'
    assigned_gate_code VARCHAR(32) NOT NULL DEFAULT 'GATE-01',
    assigned_gate_name VARCHAR(128) NOT NULL DEFAULT 'Main Gate 01',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    shift_name VARCHAR(64) DEFAULT 'Day Shift (06:00 - 18:00)',
    last_active_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- 4. PERSONS TABLE (Authorized Master Registry: Admin-Created & Guard-Created)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS persons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    person_code VARCHAR(64) UNIQUE NOT NULL, -- e.g. 'PER-2026-8041'
    full_name VARCHAR(255) NOT NULL,
    category VARCHAR(64) NOT NULL CHECK (category IN ('Faculty', 'Student', 'Staff', 'Contractor', 'Visitor', 'VIP', 'Delivery')),
    department VARCHAR(128) NOT NULL,
    designation VARCHAR(128),
    email VARCHAR(255),
    phone VARCHAR(32),
    residential_address TEXT,
    id_document_type VARCHAR(64),
    id_document_number VARCHAR(128),
    photo_url TEXT,
    account_status VARCHAR(32) NOT NULL DEFAULT 'ACTIVE_AUTHORIZED'
        CHECK (account_status IN ('ACTIVE_AUTHORIZED', 'PENDING_APPROVAL', 'TEMPORARILY_AUTHORIZED', 'SUSPENDED', 'EXPIRED', 'REJECTED', 'ARCHIVED')),
    creation_source VARCHAR(32) NOT NULL DEFAULT 'ADMIN_CREATED' CHECK (creation_source IN ('ADMIN_CREATED', 'GUARD_CREATED')),
    created_by_id UUID REFERENCES users(id),
    created_by_name VARCHAR(255),
    registration_notes TEXT,
    registration_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    valid_from TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    valid_until TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- 4B. PERSON_PHOTOS TABLE (Multiple Facial Photographs per Person)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS person_photos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    person_id UUID NOT NULL REFERENCES persons(id) ON DELETE CASCADE,
    photo_url TEXT NOT NULL,
    is_primary BOOLEAN NOT NULL DEFAULT FALSE,
    quality_score FLOAT NOT NULL DEFAULT 0.95 CHECK (quality_score >= 0.0 AND quality_score <= 1.0),
    capture_method VARCHAR(32) NOT NULL DEFAULT 'UPLOAD' CHECK (capture_method IN ('UPLOAD', 'WEBCAM', 'MOBILE_GUARD')),
    uploaded_by_id UUID REFERENCES users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- 4C. GUARD_PERMISSIONS TABLE (Admin-Controlled Granular Registration & Action Rights)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS guard_permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    guard_id UUID UNIQUE NOT NULL REFERENCES guards(id) ON DELETE CASCADE,
    registration_mode VARCHAR(32) NOT NULL DEFAULT 'APPROVAL_REQUIRED'
        CHECK (registration_mode IN ('APPROVAL_REQUIRED', 'DIRECT_PERMISSION')),
    direct_record_policy VARCHAR(32) NOT NULL DEFAULT 'TEMPORARY_ONLY'
        CHECK (direct_record_policy IN ('ACTIVE_LIMITED', 'TEMPORARY_ONLY', 'PENDING_FINAL_REVIEW')),
    can_submit_registration_requests BOOLEAN NOT NULL DEFAULT TRUE,
    can_create_person_directly BOOLEAN NOT NULL DEFAULT FALSE,
    can_register_vehicles BOOLEAN NOT NULL DEFAULT FALSE,
    can_capture_upload_photos BOOLEAN NOT NULL DEFAULT TRUE,
    can_edit_own_created_records BOOLEAN NOT NULL DEFAULT FALSE,
    can_record_entry_exit BOOLEAN NOT NULL DEFAULT TRUE,
    can_view_limited_history BOOLEAN NOT NULL DEFAULT TRUE,
    updated_by_admin_id UUID REFERENCES administrators(id),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- 4D. GATE_LOCATIONS TABLE (Campus Gate Checkpoints)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS gate_locations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    gate_code VARCHAR(32) UNIQUE NOT NULL,
    name VARCHAR(128) NOT NULL,
    gate_type VARCHAR(32) NOT NULL CHECK (gate_type IN ('PEDESTRIAN', 'VEHICLE', 'MIXED', 'SERVICE')),
    location_description TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- 5. VEHICLES TABLE (Campus Vehicle Registry)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS vehicles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    license_plate VARCHAR(32) UNIQUE NOT NULL,       -- e.g. 'OD-15-AB-1234'
    normalized_plate VARCHAR(32) UNIQUE NOT NULL,    -- e.g. 'OD15AB1234'
    vehicle_type VARCHAR(32) NOT NULL CHECK (vehicle_type IN ('Car', 'Two-Wheeler', 'Bus', 'Commercial', 'Emergency')),
    make_model VARCHAR(128),
    color VARCHAR(64),
    photo_url TEXT,
    is_authorized BOOLEAN NOT NULL DEFAULT TRUE,
    registration_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- 6. PERSON_VEHICLE_MAPPING TABLE (Supports Multiple Vehicles per Person)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS person_vehicle_mapping (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    person_id UUID NOT NULL REFERENCES persons(id) ON DELETE CASCADE,
    vehicle_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
    is_primary BOOLEAN NOT NULL DEFAULT FALSE,
    assigned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(person_id, vehicle_id)
);

-- -----------------------------------------------------------------------------
-- 7. FACE_BIOMETRICS TABLE (Protected Biometric Representations)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS face_biometrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    person_id UUID UNIQUE NOT NULL REFERENCES persons(id) ON DELETE CASCADE,
    algorithm VARCHAR(64) NOT NULL DEFAULT 'YuNet-SFace-128D',
    embedding_json JSONB NOT NULL,                   -- 128-D cosine embedding vector representation
    quality_score FLOAT NOT NULL CHECK (quality_score >= 0.0 AND quality_score <= 1.0),
    liveness_verified BOOLEAN NOT NULL DEFAULT TRUE,
    presentation_attack_score FLOAT DEFAULT 0.02,
    encrypted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- 8. REGISTRATION_REQUESTS TABLE (Guard Submissions for Admin Approval)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS registration_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_code VARCHAR(32) UNIQUE NOT NULL,         -- e.g. 'REQ-2026-0042'
    submitted_by_guard_id UUID NOT NULL REFERENCES guards(id),
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(32),
    category VARCHAR(64) NOT NULL CHECK (category IN ('Visitor', 'Contractor', 'VIP', 'Delivery', 'Temporary Staff')),
    purpose TEXT NOT NULL,
    expected_duration VARCHAR(64) NOT NULL,           -- e.g. '2 Hours', 'Full Day', '3 Days'
    face_photo_url TEXT,
    vehicle_plate VARCHAR(32),
    vehicle_photo_url TEXT,
    additional_notes TEXT,
    status VARCHAR(32) NOT NULL DEFAULT 'PENDING_APPROVAL' 
        CHECK (status IN ('PENDING_APPROVAL', 'APPROVED', 'REJECTED', 'ADDITIONAL_INFO_REQUIRED')),
    reviewed_by_admin_id UUID REFERENCES administrators(id),
    review_notes TEXT,
    submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    reviewed_at TIMESTAMPTZ
);

-- -----------------------------------------------------------------------------
-- 9. VERIFICATION_SESSIONS TABLE (Telemetry for Field Terminal Scans)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS verification_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_code VARCHAR(64) UNIQUE NOT NULL,
    guard_id UUID NOT NULL REFERENCES guards(id),
    gate_code VARCHAR(32) NOT NULL,
    scan_type VARCHAR(32) NOT NULL CHECK (scan_type IN ('FACE', 'VEHICLE', 'COMBINED')),
    person_id UUID REFERENCES persons(id),
    vehicle_id UUID REFERENCES vehicles(id),
    outcome VARCHAR(64) NOT NULL 
        CHECK (outcome IN ('CASE_1_VERIFIED', 'CASE_2_PARTIALLY_VERIFIED', 'CASE_3_NOT_VERIFIED', 'ACCESS_DENIED')),
    face_match_confidence FLOAT,
    vehicle_match_found BOOLEAN DEFAULT FALSE,
    failure_reason TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- 10. ENTRY_EXIT_LOGS TABLE (Immutable Gate Auditable Transactions)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS entry_exit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id VARCHAR(64) UNIQUE NOT NULL,             -- e.g. 'EVT-20261126-001'
    event_type VARCHAR(16) NOT NULL CHECK (event_type IN ('ENTRY', 'EXIT')),
    session_id UUID REFERENCES verification_sessions(id),
    person_id UUID REFERENCES persons(id),
    vehicle_id UUID REFERENCES vehicles(id),
    guard_id UUID NOT NULL REFERENCES guards(id),
    gate_code VARCHAR(32) NOT NULL,
    outcome VARCHAR(64) NOT NULL,
    guard_decision VARCHAR(32) NOT NULL CHECK (guard_decision IN ('GRANT_ENTRY', 'DENY_ENTRY', 'RECORD_EXIT', 'ESCALATED')),
    similarity_score FLOAT,
    cryptographic_signature CHAR(64) NOT NULL,        -- HMAC-SHA256 non-repudiation signature
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- 11. ACCESS_PERMISSIONS TABLE (Granular Gate and Schedule Authorizations)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS access_permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    person_id UUID NOT NULL REFERENCES persons(id) ON DELETE CASCADE,
    permitted_gates TEXT[] NOT NULL DEFAULT '{"GATE-01", "GATE-02", "GATE-03"}',
    valid_from TIMESTAMPTZ NOT NULL,
    valid_until TIMESTAMPTZ NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    special_conditions TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- 12. NOTIFICATIONS TABLE (Real-Time System Alerts & Pending Approvals)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recipient_role VARCHAR(32) NOT NULL CHECK (recipient_role IN ('ADMIN', 'GUARD', 'ALL')),
    recipient_user_id UUID REFERENCES users(id),
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(64) NOT NULL CHECK (type IN ('REGISTRATION_REQUEST', 'UNAUTHORIZED_ATTEMPT', 'SYSTEM_ALERT', 'GATE_OVERRIDE')),
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    metadata JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- 13. AUDIT_LOGS TABLE (Security Event Ledger)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_id UUID REFERENCES users(id),
    actor_email VARCHAR(255) NOT NULL,
    actor_role VARCHAR(32) NOT NULL,
    action VARCHAR(128) NOT NULL,
    target_table VARCHAR(64) NOT NULL,
    target_id VARCHAR(64),
    changes JSONB,
    ip_address VARCHAR(45),
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================================================
-- INDEXES FOR ULTRA-FAST SUB-100MS VERIFICATION
-- =============================================================================
CREATE INDEX IF NOT EXISTS idx_persons_code ON persons(person_code);
CREATE INDEX IF NOT EXISTS idx_persons_category ON persons(category);
CREATE INDEX IF NOT EXISTS idx_vehicles_plate ON vehicles(license_plate);
CREATE INDEX IF NOT EXISTS idx_vehicles_norm_plate ON vehicles(normalized_plate);
CREATE INDEX IF NOT EXISTS idx_pv_mapping_person ON person_vehicle_mapping(person_id);
CREATE INDEX IF NOT EXISTS idx_pv_mapping_vehicle ON person_vehicle_mapping(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_reg_requests_status ON registration_requests(status);
CREATE INDEX IF NOT EXISTS idx_entry_exit_timestamp ON entry_exit_logs(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_entry_exit_person ON entry_exit_logs(person_id);
CREATE INDEX IF NOT EXISTS idx_verif_sessions_guard ON verification_sessions(guard_id);

-- =============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================================================
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE administrators ENABLE ROW LEVEL SECURITY;
ALTER TABLE guards ENABLE ROW LEVEL SECURITY;
ALTER TABLE persons ENABLE ROW LEVEL SECURITY;
ALTER TABLE person_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE guard_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE gate_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE person_vehicle_mapping ENABLE ROW LEVEL SECURITY;
ALTER TABLE face_biometrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE registration_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE verification_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE entry_exit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE access_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- 1. Administrators have unrestricted read & write on all 16 tables
CREATE POLICY admin_all_users ON users FOR ALL USING (auth.jwt() ->> 'role' IN ('ADMIN', 'SUPER_ADMIN'));
CREATE POLICY admin_all_administrators ON administrators FOR ALL USING (auth.jwt() ->> 'role' IN ('ADMIN', 'SUPER_ADMIN'));
CREATE POLICY admin_all_guards ON guards FOR ALL USING (auth.jwt() ->> 'role' IN ('ADMIN', 'SUPER_ADMIN'));
CREATE POLICY admin_all_persons ON persons FOR ALL USING (auth.jwt() ->> 'role' IN ('ADMIN', 'SUPER_ADMIN'));
CREATE POLICY admin_all_person_photos ON person_photos FOR ALL USING (auth.jwt() ->> 'role' IN ('ADMIN', 'SUPER_ADMIN'));
CREATE POLICY admin_all_guard_permissions ON guard_permissions FOR ALL USING (auth.jwt() ->> 'role' IN ('ADMIN', 'SUPER_ADMIN'));
CREATE POLICY admin_all_gate_locations ON gate_locations FOR ALL USING (auth.jwt() ->> 'role' IN ('ADMIN', 'SUPER_ADMIN'));
CREATE POLICY admin_all_vehicles ON vehicles FOR ALL USING (auth.jwt() ->> 'role' IN ('ADMIN', 'SUPER_ADMIN'));
CREATE POLICY admin_all_mapping ON person_vehicle_mapping FOR ALL USING (auth.jwt() ->> 'role' IN ('ADMIN', 'SUPER_ADMIN'));
CREATE POLICY admin_all_requests ON registration_requests FOR ALL USING (auth.jwt() ->> 'role' IN ('ADMIN', 'SUPER_ADMIN'));
CREATE POLICY admin_all_sessions ON verification_sessions FOR ALL USING (auth.jwt() ->> 'role' IN ('ADMIN', 'SUPER_ADMIN'));
CREATE POLICY admin_all_entry_exit ON entry_exit_logs FOR ALL USING (auth.jwt() ->> 'role' IN ('ADMIN', 'SUPER_ADMIN'));
CREATE POLICY admin_all_permissions ON access_permissions FOR ALL USING (auth.jwt() ->> 'role' IN ('ADMIN', 'SUPER_ADMIN'));
CREATE POLICY admin_all_notifications ON notifications FOR ALL USING (auth.jwt() ->> 'role' IN ('ADMIN', 'SUPER_ADMIN'));
CREATE POLICY admin_all_audit ON audit_logs FOR ALL USING (auth.jwt() ->> 'role' IN ('ADMIN', 'SUPER_ADMIN'));

-- Guards CAN read their own assigned guard_permissions row
CREATE POLICY guard_read_own_permissions ON guard_permissions FOR SELECT
    USING (auth.uid() = guard_id);

-- Guards CAN insert persons ONLY when guard_permissions.can_create_person_directly = TRUE
CREATE POLICY guard_direct_create_person ON persons FOR INSERT
    WITH CHECK (
        creation_source = 'GUARD_CREATED'
        AND created_by_id = auth.uid()
        AND EXISTS (
            SELECT 1 FROM guard_permissions gp
            WHERE gp.guard_id = auth.uid() AND gp.can_create_person_directly = TRUE
        )
    );

-- 2. Guard Strict Restrictions:
-- Guards CANNOT browse persons or vehicles directly
-- Guards CANNOT view face_biometrics vectors
-- Guards CAN insert verification sessions for their guard_id
CREATE POLICY guard_insert_session ON verification_sessions FOR INSERT
    WITH CHECK (auth.uid() = guard_id);

CREATE POLICY guard_select_own_sessions ON verification_sessions FOR SELECT
    USING (auth.uid() = guard_id);

-- Guards CAN insert entry_exit_logs
CREATE POLICY guard_insert_entry_exit ON entry_exit_logs FOR INSERT
    WITH CHECK (auth.uid() = guard_id);

CREATE POLICY guard_select_own_entry_exit ON entry_exit_logs FOR SELECT
    USING (auth.uid() = guard_id);

-- Guards CAN insert registration requests with PENDING_APPROVAL status
CREATE POLICY guard_insert_reg_requests ON registration_requests FOR INSERT
    WITH CHECK (auth.uid() = submitted_by_guard_id AND status = 'PENDING_APPROVAL');

CREATE POLICY guard_select_own_reg_requests ON registration_requests FOR SELECT
    USING (auth.uid() = submitted_by_guard_id);

-- Guards CAN read notifications directed to GUARD or ALL
CREATE POLICY guard_read_notifications ON notifications FOR SELECT
    USING (recipient_role IN ('GUARD', 'ALL') OR recipient_user_id = auth.uid());

-- Biometric Vectors are restricted exclusively to backend server processes (Service Role)
CREATE POLICY service_only_biometrics ON face_biometrics FOR ALL
    USING (auth.jwt() ->> 'role' = 'service_role');
