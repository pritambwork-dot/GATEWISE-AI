# DISCOVERY REPORT: SUPABASE & BACKEND AUDIT
**Agent:** `supabase_auditor`  
**Execution Mode:** Read-Only Discovery  
**Output Target:** `migration/reports/supabase-audit.md`  
**Timestamp:** 2026-11-11T12:33:00+05:30  

---

### 1. Database Architecture & PostgreSQL Extensions

- **Database Engine**: PostgreSQL 16.2
- **Required Extensions**:
  - `pgcrypto`: Generates UUID v4 and SHA-256 hashes.
  - `vector` (`pgvector`): Stores and indexes 128-dimensional facial embedding vectors.
  - Indexing: `CREATE INDEX ON members USING ivfflat (face_embedding vector_cosine_ops) WITH (lists = 100);`

---

### 2. Table Specifications & Foreign Keys

1. `guards` (Security Personnel Roster):
   - `id`: UUID (PK)
   - `employee_id`: VARCHAR(32) UNIQUE NOT NULL (e.g., `SEC-G014`)
   - `full_name`: VARCHAR(128) NOT NULL
   - `phone`: VARCHAR(24)
   - `badge_number`: VARCHAR(32) UNIQUE
   - `role`: VARCHAR(32) NOT NULL DEFAULT 'SECURITY_GUARD'
   - `assigned_gate_id`: UUID REFERENCES `gates(id)`
   - `is_active`: BOOLEAN DEFAULT true
   - `created_at`: TIMESTAMPTZ DEFAULT now()

2. `gates` (Physical Entry Points):
   - `id`: UUID (PK)
   - `code`: VARCHAR(32) UNIQUE NOT NULL (e.g., `GATE-MAIN-02`)
   - `name`: VARCHAR(128) NOT NULL
   - `location_zone`: VARCHAR(64) NOT NULL
   - `hardware_relay_ip`: INET
   - `status`: VARCHAR(24) DEFAULT 'ACTIVE'
   - `operating_hours`: VARCHAR(64) DEFAULT '24/7'
   - `created_at`: TIMESTAMPTZ DEFAULT now()

3. `members` (Students, Faculty, Staff, Contractors):
   - `id`: UUID (PK)
   - `identity_code`: VARCHAR(32) UNIQUE NOT NULL (e.g., `STU-2024-0492`)
   - `full_name`: VARCHAR(128) NOT NULL
   - `category`: VARCHAR(32) NOT NULL (`STUDENT`, `FACULTY`, `STAFF`, `CONTRACTOR`)
   - `department`: VARCHAR(64) NOT NULL
   - `face_embedding`: vector(128)
   - `photo_storage_path`: TEXT
   - `clearance_level`: VARCHAR(32) DEFAULT 'GENERAL_CAMPUS'
   - `is_authorized`: BOOLEAN DEFAULT true
   - `valid_until`: TIMESTAMPTZ NOT NULL
   - `created_at`: TIMESTAMPTZ DEFAULT now()

4. `visitor_passes` (Temporary Visitors):
   - `id`: UUID (PK)
   - `pass_code`: VARCHAR(32) UNIQUE NOT NULL (e.g., `PASS-8492`)
   - `visitor_name`: VARCHAR(128) NOT NULL
   - `phone`: VARCHAR(24) NOT NULL
   - `id_type`: VARCHAR(32) NOT NULL
   - `id_number_masked`: VARCHAR(32) NOT NULL
   - `host_name`: VARCHAR(128) NOT NULL
   - `host_department`: VARCHAR(64) NOT NULL
   - `purpose`: VARCHAR(256) NOT NULL
   - `gate_id`: UUID REFERENCES `gates(id)`
   - `status`: VARCHAR(24) DEFAULT 'CHECKED_IN'
   - `check_in_time`: TIMESTAMPTZ DEFAULT now()
   - `check_out_time`: TIMESTAMPTZ

5. `verification_events` (Immutable Non-Repudiation Audit Log):
   - `id`: UUID (PK)
   - `gate_id`: UUID REFERENCES `gates(id)` NOT NULL
   - `guard_id`: UUID REFERENCES `guards(id)` NOT NULL
   - `member_id`: UUID REFERENCES `members(id)`
   - `visitor_pass_id`: UUID REFERENCES `visitor_passes(id)`
   - `outcome`: VARCHAR(48) NOT NULL
   - `decision`: VARCHAR(32) NOT NULL
   - `similarity_score`: FLOAT
   - `cryptographic_signature`: CHAR(64) NOT NULL
   - `override_reason`: TEXT
   - `captured_thumbnail_url`: TEXT
   - `created_at`: TIMESTAMPTZ DEFAULT now()

---

### 3. Row Level Security (RLS) & Server-Side Security

- **RLS Status**: Enabled on all tables.
- **Client Security Boundary**:
  - The iOS client connects using the Supabase `anon` public key and user JWT tokens.
  - Service-role secret is strictly confined to the backend server and never bundled in client code.
  - Direct insertion to `verification_events` is verified against the authenticated `guard_id`.

---

### 4. Storage & Realtime Channels

- **Storage Buckets**:
  - `faces`: Encrypted private bucket for reference enrollments and live photo thumbnails.
  - `audit-logs`: WORM bucket storing signed cryptographic audit certificates.
- **Realtime Channels**:
  - `gate-events`: Broadcasts decision commits and relay open triggers.
  - `station-telemetry`: Broadcasts terminal status and gate post relay diagnostics.
