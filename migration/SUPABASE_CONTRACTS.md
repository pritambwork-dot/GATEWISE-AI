# CONTRACT: SUPABASE SCHEMA, RLS & REALTIME SPECIFICATION
**Status:** Frozen  
**Lead Orchestrator:** Lead Agent  
**Date:** 2026-11-11  

---

### 1. Database Table Contracts

- `guards`: Security officers, unique `employee_id`, foreign key `assigned_gate_id`.
- `gates`: Gate post stations, unique `code` (`GATE-MAIN-02`).
- `members`: Students, faculty, staff, vector `face_embedding(128)`, clearance expiration `valid_until`.
- `visitor_passes`: Passes issued, unique `pass_code` (`PASS-XXXX`), `status` (`CHECKED_IN`, `CHECKED_OUT`).
- `verification_events`: Audit log, foreign keys to guard, gate, member/visitor, and 64-character HMAC non-repudiation seal.

---

### 2. Row Level Security Contracts

- Guards can insert verification events strictly matching their authenticated `guard_id`.
- Guards can read visitor passes and events registered at their active `gate_id`.
- Supervisors and Administrators (`SUPER_ADMIN`) have global read access across all gate posts.
- Client applications must NEVER possess or transmit the Supabase service-role secret.

---

### 3. Realtime Channels & Events

- Channel `gate-events`: Emits `event_inserted` payloads whenever an officer commits a verification decision.
- Channel `station-telemetry`: Emits `relay_status_changed` whenever a barrier relay is actuated.
