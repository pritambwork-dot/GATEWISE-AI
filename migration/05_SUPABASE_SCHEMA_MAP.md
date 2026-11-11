# MIGRATION AUDIT 05: SUPABASE SCHEMA & SECURITY ARCHITECTURE
## PostgreSQL Tables, Row Level Security, Storage, & Realtime Channels

**Audited By:** AGENT 04 — Supabase Backend Agent  
**Date:** 2026-11-11  

---

### 1. Database Table Schemas

#### 1.1 `guards`
- `id`: UUID (Primary Key, default `gen_random_uuid()`)
- `employee_id`: VARCHAR(32) UNIQUE NOT NULL (e.g., `SEC-G014`)
- `full_name`: VARCHAR(128) NOT NULL
- `phone`: VARCHAR(24)
- `badge_number`: VARCHAR(32) UNIQUE
- `role`: VARCHAR(32) NOT NULL DEFAULT 'SECURITY_GUARD' (`GUARD`, `SUPERVISOR`, `SUPER_ADMIN`)
- `assigned_gate_id`: UUID REFERENCES `gates(id)`
- `is_active`: BOOLEAN DEFAULT true
- `created_at`: TIMESTAMPTZ DEFAULT now()

#### 1.2 `gates`
- `id`: UUID (Primary Key)
- `code`: VARCHAR(32) UNIQUE NOT NULL (e.g., `GATE-MAIN-02`)
- `name`: VARCHAR(128) NOT NULL
- `location_zone`: VARCHAR(64) NOT NULL
- `hardware_relay_ip`: INET
- `status`: VARCHAR(24) DEFAULT 'ACTIVE' (`ACTIVE`, `MAINTENANCE`, `OFFLINE`)
- `operating_hours`: VARCHAR(64) DEFAULT '24/7'
- `created_at`: TIMESTAMPTZ DEFAULT now()

#### 1.3 `members` (Students, Faculty, Staff, Contractors)
- `id`: UUID (Primary Key)
- `identity_code`: VARCHAR(32) UNIQUE NOT NULL (e.g., `STU-2024-0492`)
- `full_name`: VARCHAR(128) NOT NULL
- `category`: VARCHAR(32) NOT NULL (`STUDENT`, `FACULTY`, `STAFF`, `CONTRACTOR`)
- `department`: VARCHAR(64) NOT NULL
- `face_embedding`: vector(128) (Indexed via `ivfflat` cosine distance)
- `photo_storage_path`: TEXT (Storage path in `faces` bucket)
- `clearance_level`: VARCHAR(32) DEFAULT 'GENERAL_CAMPUS'
- `is_authorized`: BOOLEAN DEFAULT true
- `valid_until`: TIMESTAMPTZ NOT NULL
- `created_at`: TIMESTAMPTZ DEFAULT now()

#### 1.4 `visitor_passes`
- `id`: UUID (Primary Key)
- `pass_code`: VARCHAR(32) UNIQUE NOT NULL (e.g., `PASS-8492`)
- `visitor_name`: VARCHAR(128) NOT NULL
- `phone`: VARCHAR(24) NOT NULL
- `id_type`: VARCHAR(32) NOT NULL (Aadhaar, Passport, Driver License)
- `id_number_masked`: VARCHAR(32) NOT NULL
- `host_name`: VARCHAR(128) NOT NULL
- `host_department`: VARCHAR(64) NOT NULL
- `purpose`: VARCHAR(256) NOT NULL
- `gate_id`: UUID REFERENCES `gates(id)`
- `status`: VARCHAR(24) DEFAULT 'CHECKED_IN' (`CHECKED_IN`, `CHECKED_OUT`, `EXPIRED`)
- `check_in_time`: TIMESTAMPTZ DEFAULT now()
- `check_out_time`: TIMESTAMPTZ

#### 1.5 `verification_events` (Immutable Audit Log)
- `id`: UUID (Primary Key)
- `gate_id`: UUID REFERENCES `gates(id)` NOT NULL
- `guard_id`: UUID REFERENCES `guards(id)` NOT NULL
- `member_id`: UUID REFERENCES `members(id)`
- `visitor_pass_id`: UUID REFERENCES `visitor_passes(id)`
- `outcome`: VARCHAR(48) NOT NULL (Adheres to the 7-state institutional enum)
- `decision`: VARCHAR(32) NOT NULL (`GRANT_ENTRY`, `DENY_ENTRY`, `MANUAL_OVERRIDE`)
- `similarity_score`: FLOAT
- `cryptographic_signature`: CHAR(64) NOT NULL (HMAC-SHA256 non-repudiation seal)
- `override_reason`: TEXT
- `captured_thumbnail_url`: TEXT
- `created_at`: TIMESTAMPTZ DEFAULT now()

---

### 2. Row Level Security (RLS) Policies

1. **Guards Read/Write**:
   ```sql
   ALTER TABLE verification_events ENABLE ROW LEVEL SECURITY;
   CREATE POLICY "Guards can insert events for their assigned gate"
     ON verification_events FOR INSERT
     WITH CHECK (auth.uid() = guard_id);
   CREATE POLICY "Guards can view events for their assigned gate"
     ON verification_events FOR SELECT
     USING (auth.uid() = guard_id OR auth.jwt() ->> 'role' = 'SUPER_ADMIN');
   ```
2. **Members Privacy**:
   - `face_embedding` vector is restricted to security edge inference services; raw embeddings are never exposed to public roles.
3. **Visitor Passes**:
   - Authenticated guards can read and insert passes for their station gate.

---

### 3. Supabase Realtime Channels

- `gate-events:{gateId}`: Broadcasts real-time verification commits and barrier trigger signals.
- `station-telemetry`: Broadcasts terminal health metrics and gate connectivity changes.

---

### 4. Supabase Storage Buckets

- `faces`: Encrypted private bucket storing reference enrollment images and cropped face thumbnails.
- `audit-logs`: WORM (Write Once, Read Many) bucket storing cryptographic decision signatures and signed receipt archives.
