# GATEWISE AI 1.0 — Deployment & Operations Guide
**Staging, Production & Rollback Runbook**  
*Release Version: 1.0.0 | Date: November 2026*

---

## 1. System Architecture & Infrastructure

GATEWISE AI is structured as a cloud-native monorepo:

- **Frontend / Web Portal (`apps/web`):** Next.js 14 (App Router) deployed on Vercel or Google Cloud Run.
- **Backend Core API (`backend`):** FastAPI + OpenCV Zoo deployed on Google Cloud Run or Kubernetes container.
- **Database:** Managed PostgreSQL 15+ with `pgvector` extension (or local SQLite for isolated branch deployments).
- **Mobile Guard App (`apps/mobile`):** Android APK built with Expo EAS Build, signed with Google Play App Signing or institutional release keystore.

---

## 2. Environment Variables & Secret Configuration

### 2.1 Backend Core (`backend/.env`)

```ini
# Core API Settings
PROJECT_NAME="GATEWISE AI"
API_V1_STR="/api/v1"
ENVIRONMENT="production"
DEBUG=False

# Database
DATABASE_URL="postgresql://gatewise_user:STRONG_PASSWORD@postgres.internal:5432/gatewise_prod"

# Security & Tokens
SECRET_KEY="PRODUCTION_CRYPTO_SECRET_AT_LEAST_64_CHARS"
ACCESS_TOKEN_EXPIRE_MINUTES=60
REFRESH_TOKEN_EXPIRE_DAYS=14

# Computer Vision
MIN_BLUR_SCORE=60.0
MIN_FACE_SIZE=60
FACE_MATCH_AUTO_ADMIT=0.90
FACE_MATCH_CANDIDATE=0.70

# Integrations
GOOGLE_DRIVE_FOLDER_ID="IIM_Sambalpur_Approved_Identities_2026"
GOOGLE_APPLICATION_CREDENTIALS="/etc/secrets/google_service_account.json"
GEMINI_API_KEY="YOUR_GEMINI_PRODUCTION_API_KEY"
```

### 2.2 Next.js Web Portal (`apps/web/.env.production`)

```ini
NEXT_PUBLIC_API_URL="https://api.gatewise.internal/api/v1"
NEXT_PUBLIC_CAMPUS_NAME="IIM Sambalpur"
NEXT_PUBLIC_APP_VERSION="1.0.0"
```

---

## 3. Production Deployment Procedure

### Step 1: Run Pre-Flight Validation
Ensure all automated regression tests pass:
```bash
# Backend pytest suite (78/78 tests)
pytest

# Web build verification (25 static routes)
pnpm --filter @gatewise/web build

# Mobile typecheck
pnpm --filter @gatewise/mobile typecheck
```

### Step 2: Database Migration
Apply schema migrations using Alembic:
```bash
cd backend
alembic upgrade head
python -m app.main  # Executes idempotent baseline seed
```

### Step 3: Deploy Backend Container
Build and push the multi-stage Docker container:
```bash
docker build -t gcr.io/gatewise-prod/core-backend:v1.0.0 -f backend/Dockerfile .
gcloud run deploy gatewise-backend \
  --image gcr.io/gatewise-prod/core-backend:v1.0.0 \
  --platform managed \
  --region asia-south1 \
  --cpu 4 --memory 4Gi \
  --min-instances 2 --max-instances 10 \
  --port 8000
```

### Step 4: Deploy Next.js Web Portal
```bash
pnpm --filter @gatewise/web build
vercel --prod
```

### Step 5: Build & Publish Signed Android Guard APK
```bash
cd apps/mobile
eas build --platform android --profile production --local --output /tmp/gatewise-guard-v1.0.0.apk

# Verify signature and publish to download centre
python scripts/verify_and_publish_apk.py \
  --apk /tmp/gatewise-guard-v1.0.0.apk \
  --version 1.0.0 \
  --version-code 100 \
  --min-sdk 26 \
  --target-sdk 34 \
  --release-notes "Official GATEWISE AI 1.0 production release with native YuNet/SFace verification."
```

---

## 4. Health Checks & Synthetic Monitoring

- **Core Health Endpoint:** `GET /health`  
  Returns: `{"status": "HEALTHY", "version": "1.0.0", "cv_engine": "ACTIVE"}`
- **SSE Stream Health:** `GET /api/v1/activity/stream`  
  Monitored by synthetic heartbeat ping every 30 seconds.

---

## 5. Rollback & Disaster Recovery Procedures

1. **Traffic Rollback:** In Cloud Run, rollback to previous stable revision:
   ```bash
   gcloud run services update-traffic gatewise-backend --to-revisions=gatewise-backend-PREVIOUS=100
   ```
2. **Database Rollback:**
   ```bash
   alembic downgrade -1
   ```
3. **Emergency Offline Operation:**
   Mobile terminals automatically transition to local buffered mode if connection to the backend is severed. The tablet continues to verify against local cached embeddings and buffers guard decisions until connectivity is re-established.
