# GATEWISE AI — Infrastructure Decision Document
**Classification:** Cloud & Infrastructure Architecture Analysis  
**Prepared For:** Institutional IT Steering Committee & Security Directorate  
**Date:** November 11, 2026

---

## 1. Requirements & Operational Constraints

1. **Indian Sovereign Latency:** Target < 100ms API response time from campus entrances in Odisha (Sambalpur) and across India.
2. **Persistent Compute & Workers:** OpenCV YuNet and SFace model inference requires persistent in-memory weights (approx. 80MB RAM) and CPU-bound tensor arithmetic. Serverless functions with cold starts (e.g., standard Lambda or Vercel serverless) are unacceptable due to 2–5s cold-start spikes and 15s execution caps.
3. **Continuous Streaming SSE:** Server-Sent Events requires long-lived HTTP connections with 15s heartbeats. Hosting platforms that terminate idling connections after 30–60s without custom buffering controls (e.g. Cloudflare standard free proxy or basic serverless) break live admin event streams.
4. **PostgreSQL with pgvector:** Requires standard PostgreSQL 15/16 with the official `pgvector` C-extension compiled for 128-D vector indexing.
5. **Data Protection & Institutional Sovereignty:** Under Indian Digital Personal Data Protection (DPDP) Act 2023, biometric reference data of campus residents must remain securely stored in Indian jurisdiction or on-premise institutional infrastructure.
6. **Zero Unauthorized Cost:** Must run deterministically on validated local/staging infrastructure before incurring recurring commercial cloud expenses.

---

## 2. Infrastructure Options Comparison

| Evaluation Dimension | Option A: On-Premise Institutional Server (IIM Sambalpur Data Centre) | Option B: AWS India (Mumbai `ap-south-1`) | Option C: Google Cloud India (Mumbai `asia-south1`) | Option D: DigitalOcean (Bengaluru `blr1`) | Option E: Serverless Free-Tiers (Vercel + Supabase + Render) |
|---|---|---|---|---|---|
| **Data Residency** | **100% On-Campus** (Sovereign hardware) | India (`ap-south-1`) | India (`asia-south1`) | India (`blr1`) | Global / US regions (Non-compliant) |
| **Gate Latency** | **< 5 ms** (LAN / Campus Wi-Fi) | ~25–35 ms | ~25–35 ms | ~30–40 ms | > 250 ms (Multi-region hops) |
| **CV Inference (YuNet/SFace)** | High (Dedicated Quad-core CPU) | High (c6i.large / t4g.large) | High (e2-standard-2) | High (General Purpose 2 vCPU) | Unusable (Cold starts & CPU throttling) |
| **pgvector Compatibility** | Yes (Native Docker container) | Yes (RDS Postgres 16) | Yes (Cloud SQL Postgres 16) | Yes (Droplet or Managed DB) | Limited |
| **SSE Telemetry** | Full (Direct WebSocket/SSE) | Full (ALB / EC2) | Full (GCE / Cloud Run) | Full (Caddy / Droplet) | Frequent disconnects |
| **Automated Backups** | Local script + NAS replica | Automated AWS EBS / RDS | Automated GCP Snapshots | Automated Volume Backups | Manual dump |
| **Operational Simplicity** | High (Single docker-compose stack) | Moderate (VPC, IAM, RDS, ALB) | Moderate (VPC, IAM, Cloud SQL) | High (Single Docker Droplet) | High (Split control planes) |
| **Monthly Estimate** | **₹0** (Existing institutional hardware) | ~$45–65 / month | ~$48–70 / month | ~$24–36 / month | $0 (Non-production/unreliable) |

---

## 3. Recommended Infrastructure Decision

### Primary Architecture for Institutional Pilot: Option A (On-Premise Institutional Server)
**Rationale:**
1. **Zero Recurring Infrastructure Cost:** Operates entirely on existing campus server infrastructure or a dedicated departmental Linux host.
2. **Sub-10ms Gate Response:** Operating on the campus LAN delivers instant verification (< 10ms network round-trip), allowing guards to admit subjects without perceptible delay.
3. **Absolute Data Sovereignty:** Biometric embeddings and student photographs never leave the physical campus boundaries, ensuring complete DPDP compliance.
4. **Single-Command Docker Orchestration:** Uses [`docker-compose.prod.yml`](file:///Users/pritambiswas/antigravity/NORVA/docker-compose.prod.yml) running PostgreSQL+pgvector, FastAPI, Next.js, and Caddy.

### Secondary Architecture for Multi-Campus Cloud Rollout: Option B (AWS ap-south-1)
If the institution requires off-campus remote administration and cloud multi-gate scalability:
- **Compute:** EC2 `t4g.medium` (ARM Graviton3, 2 vCPU, 4GB RAM) in Mumbai.
- **Database:** Amazon RDS for PostgreSQL 16 (db.t4g.micro) with pgvector extension.
- **Storage:** S3 for encrypted daily database backups.
- **Ingress:** Route 53 with AWS Certificate Manager (ACM) TLS.
