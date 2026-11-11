# GATEWISE AI — Screenshot Asset Manifest

**Document:** `SAM-CAT-1.0.0`  
**Standard:** 1440 × 900 HiDPI (16:10 aspect ratio)  
**Encoding:** Dual WebP (Primary) + PNG (Lossless Fallback)  
**Target Directory:** `/apps/web/public/media/screenshots/`  

---

## 1. Overview & Verification Policy

Every screenshot in this catalog captures actual operational interfaces engineered for GATEWISE AI. No wireframes, mockup templates, or generic dashboard placeholders are present.

### Synthetic Privacy Guarantee
All displayed personnel records (e.g., *Dr. Maya Sharma, Research Fellow, Bioengineering*), vehicle license registrations (*OD 02 AK 9142*), officer identities (*Officer Ramesh Verma*), gate identifiers (*GATE-MAIN-02*), and HMAC signature digests (*sha256-7f4a...92b1*) are strictly synthetic test artifacts generated under controlled staging protocols.

---

## 2. Android Guard Application Catalog (`/guard/`)

### Screen 01: Guard Post Authentication
- **Filename:** `01_guard_login.png` / `01_guard_login.webp`
- **Category:** `guard` / `administration`
- **Operational Purpose:** Dedicated officer PIN terminal requiring badge tap or officer PIN code. Verifies guard identity and binds device session to a specific gate post hardware ID.
- **Key UI Elements:** Numeric PIN entry pad, active post indicator (GATE-MAIN-02), hardware keystore indicator, battery & network telemetry.

### Screen 02: Active Edge Viewfinder (Idle)
- **Filename:** `02_guard_viewfinder_idle.png` / `02_guard_viewfinder_idle.webp`
- **Category:** `guard` / `verification`
- **Operational Purpose:** Standby optical camera stream with daylight-tuned contrast reticles, ready to detect approaching pedestrians or vehicle passengers.
- **Key UI Elements:** Tactical corner brackets, 30fps stream status, ambient light measurement, offline queue depth counter.

### Screen 03: 5-Point Landmark Detection
- **Filename:** `03_guard_detecting_landmarks.png` / `03_guard_detecting_landmarks.webp`
- **Category:** `verification`
- **Operational Purpose:** Edge YuNet inference isolating eyes, nose tip, and mouth corners within 28ms to assess presentation angle, tilt, and optical focus.
- **Key UI Elements:** Bounding box reticle with coordinate tracking, green landmark pins, head pose angle telemetry (<15° yaw/pitch).

### Screen 04: SFace Biometric Match
- **Filename:** `04_guard_biometric_match.png` / `04_guard_biometric_match.webp`
- **Category:** `verification`
- **Operational Purpose:** Extraction of 128-D embedding vector and cosine calculation against local enrolled vector cache.
- **Key UI Elements:** Cosine score pill (0.984), institutional candidate payload (Dr. Maya Sharma), Department of Bioengineering badge.

### Screen 05: Access Clearance Granted
- **Filename:** `05_guard_entry_granted.png` / `05_guard_entry_granted.webp`
- **Category:** `verification`
- **Operational Purpose:** High-contrast admission banner confirming valid entry pass, triggering turnstile relay pulse, and recording signed event.
- **Key UI Elements:** Emerald admission badge, turnstile relay timer (1.8s pulse), HMAC signature digest, audible chime indicator.

### Screen 06: Native Hardware Security
- **Filename:** `06_guard_camera_permission.png` / `06_guard_camera_permission.webp`
- **Category:** `guard`
- **Operational Purpose:** Android 10+ camera hardware access declaration and encrypted keystore enclave initialization.
- **Key UI Elements:** Cryptographic enclave status, hardware buffer allocation, local biometric policy compliance seal.

### Screen 07: Offline Capture Review
- **Filename:** `07_guard_capture_review.png` / `07_guard_capture_review.webp`
- **Category:** `guard` / `verification`
- **Operational Purpose:** Guard-in-the-loop secondary review screen for low-confidence matches or edge anomalies.
- **Key UI Elements:** Side-by-side verification review, manual clearance override button, reason code selector (badge forgotten, heavy eyewear).

### Screen 08: Edge Processing Telemetry HUD
- **Filename:** `08_guard_processing_hud.png` / `08_guard_processing_hud.webp`
- **Category:** `verification`
- **Operational Purpose:** Diagnostic overlay showing inference duration, CPU load, temperature, and local vector cache hit rate.
- **Key UI Elements:** Inference time meter (28ms YuNet + 85ms SFace), memory buffer usage, local SQLite transaction status.

### Screen 09: Visitor Pass Directory
- **Filename:** `09_guard_visitor_directory.png` / `09_guard_visitor_directory.webp`
- **Category:** `visitors`
- **Operational Purpose:** Fast directory of scheduled guest visits, visiting faculty passes, and vendor deliveries for the current shift.
- **Key UI Elements:** Guest name, host department, scheduled entry window, vehicle plate linkage, pass status badge.

### Screen 10: Visitor Intake & QR Scan
- **Filename:** `10_guard_visitor_intake.png` / `10_guard_visitor_intake.webp`
- **Category:** `visitors`
- **Operational Purpose:** On-the-spot guest registration form with QR digital badge issuance and host notification dispatch.
- **Key UI Elements:** Guest photo capture, government ID verification field, destination block selection, host SMS dispatch toggle.

### Screen 11: Local Ingress Ledger
- **Filename:** `11_guard_activity_history.png` / `11_guard_activity_history.webp`
- **Category:** `guard`
- **Operational Purpose:** Offline-first event queue recording chronological gate crossings with background server synchronization.
- **Key UI Elements:** Verification timecode, person ID, clearance category, local sync status (SYNCED / PENDING_QUEUE).

### Screen 12: Officer SOP & Post Profile
- **Filename:** `12_guard_profile_sop.png` / `12_guard_profile_sop.webp`
- **Category:** `administration`
- **Operational Purpose:** Duty shift checklist, post supervisor contact directory, and emergency campus lockdown protocols.
- **Key UI Elements:** Emergency gate lockdown button, post inventory check, supervisor hotline, SOP quick-reference card.

---

## 3. Web Admin Command Centre Catalog (`/admin/`)

### Screen 01: Admin MFA Portal Access
- **Filename:** `01_admin_login.png` / `01_admin_login.webp`
- **Category:** `admin`
- **Operational Purpose:** High-security administrative entrance requiring role-based credentials and hardware security key.
- **Key UI Elements:** WebAuthn token trigger, campus security domain validator, session timeout configuration.

### Screen 02: Central Command Centre
- **Filename:** `02_command_centre.png` / `02_command_centre.webp`
- **Category:** `admin`
- **Operational Purpose:** Macro campus overview displaying total throughput, active gates, active security officers, and system health.
- **Key UI Elements:** Real-time KPI stat cards, multi-gate network map, 24-hour ingress curve, active alert strip.

### Screen 03: Live Telemetry Stream
- **Filename:** `03_live_activity.png` / `03_live_activity.webp`
- **Category:** `verification` / `admin`
- **Operational Purpose:** High-speed WebSocket stream showing every entry event, match confidence, and cryptographic signature in real time.
- **Key UI Elements:** Real-time event log, cosine score bar, gate post origin, officer ID badge, cryptographic hash link.

### Screen 04: Institutional Registry
- **Filename:** `04_people_identities.png` / `04_people_identities.webp`
- **Category:** `administration` / `admin`
- **Operational Purpose:** Master directory of enrolled students, faculty members, and operational staff with vector enrollment status.
- **Key UI Elements:** Identity search table, department filters, enrollment status (ACTIVE / PENDING / REVOKED), vector count.

### Screen 05: Biometric Enrollment Approvals
- **Filename:** `05_enrollment_requests.png` / `05_enrollment_requests.webp`
- **Category:** `admin`
- **Operational Purpose:** Verification queue where security officers approve new face submissions before vectorization and database insertion.
- **Key UI Elements:** Image quality analysis score, duplicate vector check, one-click approve/reject actions with comment logs.

### Screen 06: Visitor Pass Management
- **Filename:** `06_visitor_passes.png` / `06_visitor_passes.webp`
- **Category:** `visitors` / `admin`
- **Operational Purpose:** Pre-clearance system for conference attendees, external contractors, and VIP delegations.
- **Key UI Elements:** Pass creation wizard, multi-day validity periods, host authorization workflow, digital badge preview.

### Screen 07: Gate Hardware Posts
- **Filename:** `07_gate_posts.png` / `07_gate_posts.webp`
- **Category:** `administration` / `admin`
- **Operational Purpose:** Network status and hardware health monitoring for all physical boom barriers, turnstiles, and cameras.
- **Key UI Elements:** Barrier latency telemetry, controller firmware version, ping status, emergency barrier toggle.

### Screen 08: Security Officer Roster
- **Filename:** `08_guard_management.png` / `08_guard_management.webp`
- **Category:** `administration` / `admin`
- **Operational Purpose:** Shift scheduling, post deployment matrix, and device allocation for campus security staff.
- **Key UI Elements:** Guard shift calendar, active post mapping, device serial binding, officer qualification status.

### Screen 09: Sovereign Document Vault
- **Filename:** `09_drive_repository.png` / `09_drive_repository.webp`
- **Category:** `admin`
- **Operational Purpose:** AES-256 encrypted repository for institutional security guidelines, gate CCTV incident reports, and compliance logs.
- **Key UI Elements:** Encrypted file browser, version control, cryptographic hash verification, role-scoped permission labels.

### Screen 10: Throughput & Cosine Analytics
- **Filename:** `10_analytics_eval.png` / `10_analytics_eval.webp`
- **Category:** `admin`
- **Operational Purpose:** Statistical deep dive into peak ingress volume, false reject rates, and model cosine distribution across gates.
- **Key UI Elements:** Hourly traffic histogram, cosine similarity distribution curve, ROC curve threshold tuner, SLA compliance percentage.

### Screen 11: Policy Engine & HMAC Keys
- **Filename:** `11_system_settings.png` / `11_system_settings.webp`
- **Category:** `administration` / `admin`
- **Operational Purpose:** System security policy editor, cosine acceptance threshold slider (0.72 standard), and cryptographic secret key rotation.
- **Key UI Elements:** HMAC secret rotation modal, automatic vector pruning interval, retention policy selector, database backup orchestrator.

### Screen 12: AI Security Assistant Panel
- **Filename:** `12_ai_assistant_panel.png` / `12_ai_assistant_panel.webp`
- **Category:** `administration` / `admin`
- **Operational Purpose:** Natural language operational copilot capable of synthesizing gate data, finding anomalies, and generating shift reports.
- **Key UI Elements:** Interactive chat interface, pre-built prompt pills ("Summarize morning shift peak"), structured JSON telemetry card renderer.

---

## 4. Workflow Banners (`/workflows/`)

### Workflow 01: Connected 5-Stage Verification Flow
- **Filename:** `01_connected_verification_flow.png` / `01_connected_verification_flow.webp`
- **Role:** Full architectural diagram illustrating YuNet capture &rarr; SFace 128-D &rarr; Cosine match &rarr; HMAC seal &rarr; Admin WebSocket update.

### Workflow 02: Real Device Pair Composition
- **Filename:** `02_device_pair_composition.png` / `02_device_pair_composition.webp`
- **Role:** High-craft hero visual pairing the MacBook Pro Admin Command Centre with the Android Guard App displaying synchronized telemetry.
