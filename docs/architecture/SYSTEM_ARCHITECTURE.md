# GATEWISE AI 1.0 — System Architecture Specification
**Document ID:** `ARCH-2026-11-10`  
**Classification:** Institutional Security Platform  
**Target Institution:** Indian Institute of Management Sambalpur

---

## 1. System Overview & Core Philosophy

**GATEWISE AI** is a mission-critical institutional gate verification, physical security, and visitor management platform. It replaces slow, error-prone paper visitor registers and visual-only ID checks with an edge-assisted, camera-verified identity matching workflow.

### The Human-in-the-Loop Sovereign Principle
The core architectural tenet of GATEWISE AI is:
> **The AI assists the stationed security officer; it never replaces the human decision.**

Identity recognition is strictly decoupled from institutional clearance:
* **Identity Recognition**: Confirms *who* an individual is with probabilistic confidence ($\ge 90\%$).
* **Institutional Clearance**: Deterministically validates *whether* the subject holds active term clearance for the assigned gate post at the current time.

---

## 2. High-Level System Architecture Diagram

```
                              ┌──────────────────────────────────────────────┐
                              │     Google Workspace Shared Drive Repo       │
                              │ (Approved Student, Faculty & Staff Portraits)│
                              └──────────────────────┬───────────────────────┘
                                                     │
                                                     ▼
┌───────────────────────────┐          ┌───────────────────────────┐          ┌───────────────────────────┐
│     GATEWISE AI Guard     │          │    Central Core Backend   │          │    GATEWISE AI Admin      │
│      (Android Mobile)     │ ◄──────► │  (FastAPI · OpenCV 5.0.0) │ ◄──────► │  (Next.js Command Portal) │
│ Single-Shot Manual Camera │          │  PostgreSQL/pgvector·JWT  │          │ Real-Time SSE Telemetry   │
│ Locked Gate Terminal      │          │  Port 8000                │          │ Port 3000                 │
└───────────────────────────┘          └─────────────┬─────────────┘          └───────────────────────────┘
                                                     │
                                                     ▼
                                       ┌───────────────────────────┐
                                       │    Public Web & Release   │
                                       │ (Signed APK Distribution) │
                                       │ SHA-256 Checksum Validator│
                                       └───────────────────────────┘
```

---

## 3. Subsystem Breakdown

### 3.1. Android Guard Application (`apps/mobile/`)
* **Technology**: React Native, Expo (SDK 51), TypeScript, Expo Router, Expo Camera, Expo SecureStore.
* **Target OS**: Android 12 to 15 (minSdkVersion 31, targetSdkVersion 34).
* **Package Identifier**: `com.gatewiseai.guard`.
* **Station Locking**: Enforces station-level lock. A guard authenticated as `SEC-G014` is locked to `Main Campus Gate · Post 02` and cannot modify their station assignment.
* **Camera Architecture**: Operates strictly in single-shot manual capture mode. Zero continuous background video surveillance or ambient tracking.
* **Local Offline Cache**: Stores pre-approved visitor passes and queued verification logs locally in SQLite when network connectivity drops.

### 3.2. Institutional Desktop Command Centre & Public Web (`apps/web/`)
* **Technology**: Next.js 14 App Router, React 18, TypeScript, Tailwind CSS, Lucide icons, Motion.
* **Public Route Group (`(public)`)**:
  * `/`: Institutional landing experience detailing architecture and security guarantees.
  * `/product`: Platform architecture overview.
  * `/features`: Technical capabilities breakdown.
  * `/download`: Official signed APK release hub with SHA-256 checksum verification and sideloading instructions.
* **Administrative Route Group (`(admin)`)**:
  * `/admin`: Central Command Centre with real-time gate telemetry, station health, and today's scan distributions.
  * `/admin/activity`: Live verification audit log with cryptographic proof inspector.
  * `/admin/people`: Campus directory of enrolled students and faculty.
  * `/admin/enrollment`: Guard referral queue for walk-in scholar registration.
  * `/admin/visitors`: Pre-approved visitor pass issuance and on-campus tracking.
  * `/admin/repository`: Google Drive identity sync manager.

### 3.3. Central Core Backend (`backend/`)
* **Technology**: Python 3.13, FastAPI, SQLAlchemy 2.0, Alembic migrations, OpenCV 5.0.0.
* **Modular Clean Architecture**:
  * `app/api/v1/`: Versioned API endpoints (auth, verification, identities, visitors, enrollment, activity, gates, analytics).
  * `app/core/`: Configuration via Pydantic settings, database session pool, structured logging.
  * `app/models/`: Declarative SQLAlchemy models (`User`, `Gate`, `GuardGateAssignment`, `InstitutionalIdentity`, `IdentityReferencePhoto`, `FaceEmbedding`, `VerificationEvent`, `VisitorPass`, `EnrollmentRequest`).
  * `app/repositories/`: Independent database access layer isolating query mechanics.
  * `app/services/`: Business logic orchestration (verification state machine, Google Drive indexing, operational SOP assistance).
  * `app/security/`: HMAC-SHA256 JWT access token generation, constant-time validation, salted password verification.
  * `app/computer_vision/`: OpenCV YuNet/SFace biometric feature extraction, motion blur Laplacian variance estimation, cosine similarity scoring.
  * `app/integrations/`: Backend-only integrations for Google Drive Workspace and Gemini operational policy assistance.

---

## 4. Cryptographic Audit Trail & Security Boundary

Every verification event and subsequent human guard decision is bound by an immutable SHA-256 cryptographic signature:

$$\text{Signature} = \text{SHA-256}(\text{EventID} \parallel \text{Timestamp} \parallel \text{GateID} \parallel \text{GuardID} \parallel \text{Outcome} \parallel \text{Decision} \parallel \text{InstitutionalSalt})$$

### Security Invariants
1. **Zero Biometric Exposure**: Biometric embeddings and live crops are strictly confidential and processed in ephemeral RAM. Never sent to Gemini or external LLMs.
2. **Guards Cannot Create Identities**: Security guards at gate terminals are technically prevented from creating, approving, or editing permanent institutional identities. All permanent enrollment requires Institutional Registrar authorization.
3. **No Hardcoded Credentials**: Authentication relies on deterministic salted cryptography with environmental secret injection.
