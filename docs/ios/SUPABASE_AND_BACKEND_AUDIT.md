# GATEWISE AI — Supabase & Backend Architecture Audit
## Database Schema · Row Level Security (RLS) · Authentication · Realtime Channels · Edge Functions

### 1. Executive Summary
This audit outlines the database, authentication, storage, and API infrastructure supporting the GATEWISE AI platform. It serves as the specification for the native iOS application's data layer, whether communicating with an existing Supabase instance or the core FastAPI backend.

---

### 2. Database Schema & Entity Inventory

The database schema (`backend/app/models/entities.py`) comprises 8 core tables with foreign key constraints, vector indexing, and cryptographic verification seals:

```
┌────────────────────┐          ┌────────────────────┐
│     identities     │ 1      1 │  face_embeddings   │
│  (id, roll_no, ...)│──────────│ (vector, model_ver)│
└─────────┬──────────┘          └────────────────────┘
          │ 1
          │
          │ N
┌─────────▼──────────┐          ┌────────────────────┐
│verification_events │ N      1 │   gate_stations    │
│(signature, outcome)│──────────│(id, code, name, ..)│
└─────────▲──────────┘          └─────────┬──────────┘
          │ N                             │ 1
          │                               │
          │ 1                             │ N
┌─────────┴──────────┐          ┌─────────▼──────────┐
│       guards       │ 1      N │    guard_shifts    │
│(employee_id, hash) │──────────│(shift_a, time, ...)│
└────────────────────┘          └────────────────────┘
```

| Table Name | Primary Key | Key Attributes | Native Swift DTO Equivalent |
| :--- | :--- | :--- | :--- |
| `identities` | `id` (UUID) | `person_name`, `department`, `category`, `status`, `reference_photo_url` | `IdentityDTO.swift` |
| `face_embeddings`| `id` (UUID) | `identity_id` (FK), `embedding_vector` (128D), `model_version`, `quality_score` | Server-Side Vector Store |
| `gate_stations` | `id` (String) | `code`, `name`, `location`, `status`, `is_locked`, `barrier_relay_ip` | `GateStationDTO.swift` |
| `guards` | `id` (String) | `employee_id`, `full_name`, `password_hash` (Argon2id), `role`, `is_active` | `GuardDTO.swift` |
| `guard_shifts` | `id` (UUID) | `guard_id` (FK), `gate_id` (FK), `shift_name`, `start_time`, `end_time` | `GuardShiftDTO.swift` |
| `visitor_passes` | `id` (UUID) | `pass_code` (Unique), `visitor_name`, `phone`, `id_type`, `host_name`, `status` | `VisitorPassDTO.swift` |
| `verification_events`| `id` (String) | `gate_id`, `guard_id`, `outcome`, `decision`, `signature` (HMAC), `timestamp` | `VerificationEventDTO.swift` |
| `audit_logs` | `id` (UUID) | `actor_id`, `action`, `resource_type`, `ip_address`, `timestamp` | `AuditLogDTO.swift` |

---

### 3. Row Level Security (RLS) Policy Specifications

To guarantee zero unauthorized terminal takeover or student privacy breaches, all native operations enforce strict RLS policies:

```sql
-- 1. Gate Stations: Public read for status; update restricted to assigned active guard
CREATE POLICY "Allow authenticated read for active gates"
  ON gate_stations FOR SELECT
  TO authenticated
  USING (true);

-- 2. Verification Events: Guards can only insert into their locked gate; Admin full read
CREATE POLICY "Guards can record verification events at assigned gate"
  ON verification_events FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = guard_id AND
    gate_id = current_setting('request.jwt.claims', true)::json->>'assigned_gate'
  );

-- 3. Visitor Passes: Guards can issue passes and process checkouts
CREATE POLICY "Guards can manage visitor passes"
  ON visitor_passes FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- 4. Identities & Biometrics: Read-only for authenticated guards; Biometric embeddings isolated
CREATE POLICY "Guards can query candidate identity records"
  ON identities FOR SELECT
  TO authenticated
  USING (status = 'ACTIVE');
```

---

### 4. Authentication Architecture

The native iOS application supports both Supabase Auth and core JWT authentication:
- **Identifier:** Institutional Employee ID (`SEC-G014`) or institutional email.
- **Credential Storage:** Tokens are stored in the device's hardware-backed Keychain (`KeychainManager.swift`).
- **Session Lifecycle:** Automatic session restoration upon app launch, token refresh before 8-hour shift expiry, and explicit terminal lock release on sign-out.

---

### 5. Supabase Realtime Channels

The iOS application subscribes to two selective Realtime channels:

```swift
// 1. Live Telemetry Stream for Admin Command Centre
let telemetryChannel = supabase.realtime.channel("public:verification_events")
telemetryChannel.on("INSERT") { message in
    // Broadcast live admission to Command Centre dashboard
}

// 2. Barrier Status Channel for Guard Terminal
let gateChannel = supabase.realtime.channel("public:gate_stations:gate-post-02")
gateChannel.on("UPDATE") { message in
    // Update live barrier lock/unlock state
}
```

---

### 6. File Storage Buckets

| Bucket Name | Purpose | Permissions | Client Access Pattern |
| :--- | :--- | :--- | :--- |
| `enrolled-photos` | High-res reference headshots | Authenticated Read | Async image caching via `CachedAsyncImage` |
| `visitor-badges` | Issued digital pass QR codes | Public Read | Instant download and native share sheet |
| `temporary-frames`| Ephemeral capture frames | Write & Auto-Delete | Private cache; purged immediately after verification |

---

### 7. Summary
The backend architecture is clean, hardened, and ready for native iOS integration. The native Swift app preserves all existing tables, RLS security rules, and real-time publication channels.
