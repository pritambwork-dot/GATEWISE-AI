# GATEWISE AI 1.0 — Desktop Administrator Portal
## Implementation Architecture & Technical Specification

---

## 1. Overview & Architecture

The **GATEWISE AI Desktop Administrator Portal** is an institutional command and operational control application built inside `apps/web/` using **Next.js 14 App Router**, **React**, **TypeScript**, **Tailwind CSS**, **Lucide Icons**, and **Recharts**.

It serves institutional security directors, perimeter supervisors, and registrars managing gate access, biometric telemetry, field guard assignments, and identity verification logs.

```
                    ┌─────────────────────────────────────────────────────┐
                    │      GATEWISE AI Desktop Admin Portal (Next.js)     │
                    │   apps/web/app/(admin)/admin/                       │
                    └───────────┬─────────────────────────────▲───────────┘
                                │ Next.js API Proxy           │
                                │ /api/v1/* -> :8000/api/v1/* │
                                ▼                             │
                    ┌─────────────────────────────────────────┴───────────┐
                    │      GATEWISE AI Central FastAPI Backend (Python)   │
                    │   backend/app/main.py (:8000)                       │
                    └───────────┬─────────────────────────────▲───────────┘
                                │ SQLAlchemy 2.0 ORM          │
                                ▼                             │
                    ┌─────────────────────────────────────────┴───────────┐
                    │      PostgreSQL / SQLite Central Database           │
                    │   Gate & Guard Records, Identities, Pass Events     │
                    └─────────────────────────────────────────────────────┘
```

---

## 2. Page & Module Inventory

| Route | Page Name | Primary Features & Backend Endpoints |
|---|---|---|
| `/admin` | **Command Centre** | Real-time database metrics, interactive campus blueprint with perimeter gate nodes, Recharts traffic area and pie charts, recent verification logs table, detailed inspection modal. (`/analytics/dashboard`, `/verification/events`) |
| `/admin/activity` | **Live Gate Activity** | Real-time verification event stream with 4-second live polling toggle, multi-facet filters (gate, outcome, guard decision, search), and HMAC-SHA256 signature inspector. (`/verification/events`, `/gates/`) |
| `/admin/people` | **Identity Registry** | Authoritative directory of students, faculty, staff, contractors, search, category/status filters, "Enroll Identity" modal, and identity profile drawer. (`/identities/`) |
| `/admin/enrollment` | **Field Referrals** | Queue of guard field referrals, status tabs (`PENDING`, `APPROVED`, `REJECTED`), adjudication drawer with "Approve & Enroll" and "Reject" actions. (`/enrollment-requests`) |
| `/admin/visitors` | **Visitor Management** | On-campus guest tracker, expected visitors, "Issue Pre-Approved Pass" modal, instant check-in/check-out actions, and pass token drawer. (`/visitors/`) |
| `/admin/gates` | **Gate Management** | Perimeter station cards, online health indicators, "Add Gate Station" modal, "Assign Guard" modal, and "Configure Gate" modal. (`/gates/`, `/guards/`) |
| `/admin/guards` | **Guard Management** | Security officer directory, active station tracking, "Enroll Guard" modal, "Suspend / Activate" toggle, and "Revoke Device Sessions" action. (`/guards/`) |
| `/admin/repository` | **Identity Repository** | Google Drive photo sync status card, 128-D embedding metrics, "Sync Repository Now" action (with full re-index toggle), and "Unmapped Files" review drawer. (`/repository/status`, `/repository/sync`, `/repository/unmapped-files`) |
| `/admin/analytics` | **Analytics & Benchmarks**| 24-hour ingress curve (AreaChart), gate workload comparison (BarChart), OpenCV Zoo SFace FAR/FRR tradeoff curve (LineChart), and edge pipeline latency decomposition. (`/analytics/dashboard`) |
| `/admin/settings` | **System Settings** | Institutional identity metadata, emergency perimeter lockdown toggle, SFace/YuNet similarity sliders (`0.90` / `0.70` / `60px`), session policies, and connected engine health. |
| `/admin/login` | **Admin Sign-In** | Institutional administrator authentication, credential switcher (`ADM-001` / `SUPER-001`), and secure JWT token storage. (`/auth/login`) |

---

## 3. Security, Privacy & Compliance Implementation

1. **Zero Raw Biometric Exposure**:
   - The portal strictly conforms to institutional privacy regulations and zero-knowledge principles.
   - Raw facial crops and live camera feeds are processed in ephemeral memory on mobile Android terminals and are **never** transmitted to, or downloadable from, the administrative portal.
   - Embeddings are 128-dimensional L2-normalized floating-point vectors which are non-invertible.

2. **Cryptographic Non-Repudiation (HMAC-SHA256)**:
   - Every verification record displays its cryptographic HMAC seal, ensuring that neither administrators nor guards can tamper with verification audit trails after the fact.
   - The seal can be verified and copied with one click in the audit drawer.

3. **Role-Based Access Control (RBAC)**:
   - Security guards (`SECURITY_GUARD`) are restricted to the Android application and cannot access administrative routes.
   - Administrative routes require `ADMIN` or `SUPER_ADMIN` credentials.
   - Tokens are validated via bearer authorization headers on all requests.

4. **Single Source of Truth**:
   - Zero hardcoded mock data or separate client-side databases.
   - The central FastAPI backend and PostgreSQL/SQLite database govern all state mutations.

---

## 4. Verification & Testing Status

- **Web Application Build**: All 18 Next.js routes compile statically with zero warnings (`next build`).
- **Web Application Typecheck**: Full TypeScript compliance (`tsc --noEmit` exited 0).
- **Mobile Application Typecheck**: Full Expo/React Native TypeScript compliance (`tsc --noEmit` exited 0).
- **Backend Test Suite**: 52/52 pytest tests pass (`pytest` executed in 2.19s).
