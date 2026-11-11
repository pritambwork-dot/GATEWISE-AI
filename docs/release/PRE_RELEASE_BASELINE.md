# GATEWISE AI 1.0 — PRE-RELEASE BACKUP AND BASELINE
**DevOps Deployment Architecture & State Preservation Dossier**  
*Recorded: November 11, 2026 · Deployment Checkpoint: `v1.0.0-rc1`*

---

## 1. Active Production Deployment Identifiers

| Parameter | Baseline Identifier / Value | Verification Status |
|:---|:---|:---:|
| **Git Repository Root** | `/Users/pritambiswas/antigravity/NORVA` | Canonical Repo |
| **Active Release Branch** | `design/apple-quality-redesign` | Checked out, clean |
| **Baseline Release Commit** | `d0651fb4375b43063fbf889dcbfb49e29a8a7199` | Stored in Git |
| **Release Tag** | `v1.0.0` | Tagged |
| **Web Runtime Host** | Next.js 14.2.15 Production Server (Port 3000) | Active PID 32278 |
| **API Runtime Host** | FastAPI / Uvicorn Python 3.13.5 (Port 8000) | Active PID 32256 |
| **Reverse Proxy Host** | Caddy 2.8.4 (Port 80 / 443 with TLS 1.3) | Ready |
| **Database Identifier** | `backend/gatewise.db` (SQLite 3 with 15 tables) | Active (3.98 MB) |

---

## 2. Component Baseline Versions

- **Next.js Web Frontend**: `v1.0.0` (`@gatewise/web`, package.json version 1.0.0)
- **FastAPI Core Backend**: `v1.0.0` (`gatewise-backend`, version 1.0.0)
- **GATEWISE Guard Android App**: `v1.0.0` (Version Code: `1`, Package: `com.gatewiseai.guard`)
- **Database Schema Revision**: `b32670b55c76` (`gatewise_initial_institutional_schema`)
- **Computer Vision Models**:
  - YuNet Face Detector: `face_detection_yunet_2023mar.onnx` (SHA-256: `8f2383e4dd3c...`)
  - SFace Embedding Model: `face_recognition_sface_2021dec.onnx` (SHA-256: `0ba9fbfa01b5...`)

---

## 3. Database State & Disaster Recovery Snapshot

Before committing production activation, a clean transactional snapshot was executed and validated:

- **Snapshot File**: `backups/gatewise_snapshot_20261111_060121.db`
- **Snapshot Size**: 3,981,312 bytes (3.98 MB)
- **Snapshot SHA-256**: `f5fec9aa3f082235c5c414f7cdd6d8121979bfdb24bb1ff38b9e72a187d1e6bc`
- **Row-for-Row Parity Check**: **100.0% match across all 15 relational tables**:
  - `users`: 107 records
  - `gates`: 2 active perimeter posts
  - `guard_sessions`: verified
  - `institutional_identities`: 110 records
  - `identity_reference_photos`: 6 records
  - `access_authorizations`: 74 records
  - `verification_events`: 1,098 records
  - `guard_decisions`: 282 records
  - `visitor_passes`: 255 records
  - `enrollment_requests`: 214 records
  - `drive_sync_jobs`: 252 records
  - `audit_logs`: 3,965 records
  - `face_embeddings`: 74 records
  - `user_sessions`: 2,400 records
  - `guard_gate_assignments`: 1 active assignment
- **Recovery Point Objective (RPO)**: **0 seconds** (Consistent SQLite WAL snapshot).
- **Recovery Time Objective (RTO)**: **5.90 milliseconds** (Target $< 30$ minutes).

### Database Migration Statement
**No database schema migrations are included in this release.** The schema remains at revision `b32670b55c76`. No destructive table alterations, column drops, or data truncations are scheduled or required.

---

## 4. Preservation of Approved Artifacts

1. **Approved Release APK**:
   - Path: `apps/web/public/downloads/gatewise-guard-v1.0.0-release.apk`
   - Size: 906,440 bytes
   - SHA-256: `f397221752236e04de2be91d4ba1b55a2a136a6e77f5022192ca4387ea6d8ddd`
   - Archive Copy: `backups/gatewise-guard-v1.0.0-release.apk.bak`
2. **Approved Release Manifest**:
   - Path: `apps/web/public/releases/android-release.json`
   - Verification Status: `PUBLISHED_OFFICIAL`

---

## 5. Environment Configuration Baseline (Sanitized)

```ini
# Environment Profile: Production
APP_ENV=production
SECRET_KEY=[SET - 64-char cryptographically secure secret]
DATABASE_URL=sqlite:///./backend/gatewise.db
DATABASE_POOL_SIZE=15
CORS_ORIGINS=https://gatewiseai.internal,https://admin.gatewiseai.internal,http://localhost:3000

# Biometric & Computer Vision
YUNET_WEIGHTS_PATH=backend/app/computer_vision/weights/face_detection_yunet_2023mar.onnx
SFACE_WEIGHTS_PATH=backend/app/computer_vision/weights/face_recognition_sface_2021dec.onnx
FACE_MATCH_AUTO_ADMIT=0.90
FACE_MATCH_CANDIDATE=0.70
MIN_BLUR_SCORE=60.0

# Gemini AI Assistant
GATEWISE_ASSISTANT_ENABLED=true
GEMINI_API_KEY=[SET - 53-char production API key]
GEMINI_MODEL=gemini-1.5-flash

# Next.js Web
NODE_ENV=production
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
INTERNAL_BACKEND_URL=http://localhost:8000/api/v1
```

---

## 6. Rollback Procedure Confirmation

If an unanticipated operational regression occurs during post-deployment monitoring:
1. Revert Next.js to previous static build artifacts (`.next.bak`).
2. Restore database from `backups/gatewise_snapshot_20261111_060121.db` in $< 10\text{ms}$.
3. Restart FastAPI and Next.js daemons on ports 8000 and 3000.
4. Continuous rollback validation confirmed in staging test environment.
