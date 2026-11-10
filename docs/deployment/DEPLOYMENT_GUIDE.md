# GATEWISE AI — Production Deployment Guide
**Target System:** Institutional Host / Containerized Infrastructure  
**Stack:** PostgreSQL 16 (pgvector), FastAPI (Python 3.11/3.13), Next.js 14, Caddy 2, Android APK  
**Release Version:** 1.0.0

---

## 1. Prerequisites & System Requirements

### Hardware Requirements
- **CPU:** 4 physical cores (or 4 vCPUs) x86_64 or ARM64 (Apple Silicon / AWS Graviton).
- **RAM:** Minimum 8 GB (16 GB recommended for high-volume campus peaks).
- **Storage:** 50 GB SSD with NVMe I/O (for vector search indexing and audit logs).
- **Network:** Static IP, outbound port 443 for Drive/Gemini, inbound ports 80/443.

### Software Prerequisites
- Docker Engine 24.0+ and Docker Compose v2.20+.
- Domain ownership or institutional intranet DNS entries configured:
  - `gatewiseai.internal` (Public Website)
  - `admin.gatewiseai.internal` (Desktop Admin Portal)
  - `api.gatewiseai.internal` (FastAPI Core Backend)

---

## 2. Step-by-Step Production Deployment

### Step 1: Clone Repository & Create Release Configuration
```bash
git clone https://github.com/gatewise-ai/NORVA.git /opt/gatewise
cd /opt/gatewise

# Create production environment file from template
cp .env.example .env.production

# Generate secure secrets
export MASTER_SECRET=$(openssl rand -hex 32)
export DB_PASS=$(openssl rand -hex 24)

# Configure production variables in .env.production
sed -i "s/replace-with-secure-32-byte-hex-secret/$MASTER_SECRET/g" .env.production
sed -i "s/gatewise_secure_password/$DB_PASS/g" .env.production
sed -i "s/APP_ENV=development/APP_ENV=production/g" .env.production
```

### Step 2: Validate Secret Hygiene Before Deployment
```bash
python3 scripts/security_secret_scan.py
```
*Must return: `ZERO SECRETS DETECTED. Repository working tree and history are clean.`*

### Step 3: Launch Production Container Stack
```bash
docker compose -f docker-compose.prod.yml --env-file .env.production up -d --build
```

### Step 4: Execute Database Migrations
```bash
docker compose -f docker-compose.prod.yml exec backend alembic upgrade head
```

### Step 5: Verify Service Health & Diagnostics
```bash
# 1. Verify Backend Health
curl -i https://api.gatewiseai.internal/health

# 2. Verify Next.js Public Website
curl -I https://gatewiseai.internal/

# 3. Verify Admin Command Centre
curl -I https://admin.gatewiseai.internal/

# 4. Verify Computer Vision Weights & Embeddings Cache
curl -s https://api.gatewiseai.internal/api/v1/repository/status | jq .
```

---

## 3. Post-Deployment Verification Checklist

- [ ] HTTP requests to port 80 automatically redirect to port 443 (HTTPS).
- [ ] TLS 1.3 negotiated with valid institutional certificate.
- [ ] Backend returns `X-Content-Type-Options: nosniff` and `X-Frame-Options: DENY`.
- [ ] Computer vision inference models (YuNet and SFace) report loaded in startup logs.
- [ ] SSE endpoint (`/api/v1/activity/stream`) holds open with 15s heartbeats.
- [ ] APK download link serves `gatewise-guard-v1.0.0-release.apk` with matching SHA-256 checksum.

---

## 4. Rollback & Maintenance Procedures

### Graceful Restart
```bash
docker compose -f docker-compose.prod.yml restart backend web
```

### Emergency Rollback
```bash
# Revert to previous release tag
git checkout release-v1.0.0-final-agent-integration
docker compose -f docker-compose.prod.yml up -d --build
```
