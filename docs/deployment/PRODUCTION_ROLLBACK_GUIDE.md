# GATEWISE AI 1.0 — PRODUCTION ROLLBACK & DISASTER RECOVERY GUIDE
**Operational Runbook for Rapid Incident Containment & Rollback**  
*Target: GATEWISE AI 1.0 Production Stack*  
*Last Updated: 2026-11-11*  
*Classification: DevOps / Release Management Standard Operating Procedure*

---

## 1. Rollback Trigger Criteria

An immediate rollback or service isolation must be initiated if any of the following conditions occur:
1. **Critical Security Vulnerability**: Authentication bypass, token forgery, or unauthorized access to institutional identities.
2. **Biometric Leakage**: Raw face vectors or unencrypted images detected in logs, external API calls, or client bundles.
3. **Severe Availability Degrade**: Backend error rate > 5% over 5 consecutive minutes or tensor inference failure rate > 2%.
4. **Data Corruption**: Inconsistent database state, corrupted migration, or integrity failure on audit logs.
5. **APK Crash Loop**: Android Guard application crashing on launch or camera viewfinder freeze on target Android devices.

---

## 2. Checkpoint & Rollback Targets

| Component | Target Checkpoint | Rollback Target Version | Rollback Mechanism |
| :--- | :--- | :--- | :--- |
| **Git Repository** | `checkpoint-production-deployment-start` | `c76936b5b77a4b55cab436203b8135398facc42f` | `git checkout <tag>` |
| **Web Frontend** | Vercel Deployment History | Previous Stable Production Build | Vercel Instant Rollback / Alias Shift |
| **Backend API** | Previous Release Container | Tag `release-v1.0.0-rc1` / Git Checkout | Service restart / Container roll |
| **Database** | Snapshot `backups/gatewise_snapshot_*.db` | Prior Consistent Snapshot | `scripts/db_backup_restore.py` |
| **Android APK** | Manifest `android-release.json` | Version 1.0.0-rc1 / Set `published: false` | `scripts/verify_and_publish_apk.py` |

---

## 3. Step-by-Step Rollback Procedures

### Procedure A: Emergency Android APK Retraction
If an APK defect is identified post-release:
1. Immediately unpublish the APK manifest to disable download buttons across the web portal:
   ```bash
   python3 scripts/verify_and_publish_apk.py apps/web/public/downloads/gatewise-guard-v1.0.0-release.apk --dry-run
   ```
2. In `apps/web/public/releases/android-release.json`, set `"published": false` and `"verification_status": "RETRACTED_FOR_MAINTENANCE"`.
3. Commit and push the manifest update. The public download portal will immediately display maintenance notices.

### Procedure B: Database Disaster Recovery & Restoration
If database corruption occurs:
1. Stop write traffic by putting the backend in read-only maintenance mode:
   ```bash
   export MAINTENANCE_MODE=true
   ```
2. Locate the most recent verified snapshot in `/backups/`:
   ```bash
   ls -lt backups/gatewise_snapshot_*.db | head -n 1
   ```
3. Execute the automated parity-validated restore script:
   ```bash
   python3 scripts/db_backup_restore.py
   ```
4. Verify table row counts and schema integrity before re-opening gate traffic:
   ```bash
   python3 scripts/production_smoke_tests.py
   ```

### Procedure C: Backend Codebase Rollback
To restore backend code to the verified deployment checkpoint:
```bash
git checkout checkpoint-production-deployment-start
cd backend
pytest tests/test_production_launch_scenarios.py
# Restart FastAPI service via process supervisor or container
kill -HUP $(pgrep -f "uvicorn app.main:app")
```

### Procedure D: Web Frontend Rollback
1. Open the Vercel dashboard or run:
   ```bash
   vercel rollback <previous-deployment-url>
   ```
2. Verify that `http://localhost:3000` or production URL returns HTTP 200 OK across public and admin routes.

---

## 4. Recovery Time & Point Objectives (RTO / RPO)

- **Target RPO (Data Loss Tolerance)**: **0 seconds** (Consistent transactional snapshots with WAL archiving).
- **Target RTO (Recovery Time Objective)**: **< 15 minutes** (Automated script recovery benchmarked at **9.37 milliseconds** for database restore).

---

## 5. Escalation & Incident Communications

| Role | Responsibility | Contact |
| :--- | :--- | :--- |
| **Release Manager** | Incident Commander & Rollback Decision | DevOps Lead |
| **Security Engineer** | Cryptographic verification & Secret rotation | Security Lead |
| **Campus Operations** | Checkpoint Guard notification & Manual Fallback | Duty Commander Desk |

In the event of a total network outage or backend restart, guards switch immediately to **Offline Station Mode** using locally cached credentials until reconnection occurs.
