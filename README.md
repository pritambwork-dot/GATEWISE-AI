# GATEWISE AI 1.0
### Institutional Gate Verification & Visitor Identification Platform
**Production Deployment for Indian Institute of Management Sambalpur**

---

## 1. Product Overview

**GATEWISE AI** is an institutional security platform engineered for high-consequence educational campuses and research institutes. It replaces slow, error-prone paper visitor registers and visual-only ID checks with an edge-assisted, camera-verified identity matching workflow where:

> **The AI assists the security officer; it never replaces the human decision.**

### Core Capabilities
* **Single-Shot Camera Capture**: Manual capture triggered exclusively by the stationed security officer. Zero continuous background video surveillance or ambient tracking.
* **Decoupled Identity vs. Authorization**: Biometric comparison confirms *who* a person is ($\ge 90\%$ confidence); institutional records separately determine *whether* their term clearance permits entry.
* **Immutable Cryptographic Audit Trail**: Every verification event and guard decision is sealed with a SHA-256 cryptographic signature.
* **Zero Biometric Exposure to LLMs**: The embedded Gemini AI assistant operates purely on operational SOPs and text policies. Biometrics are never sent to external LLMs.

---

## 2. Monorepo Architecture

```text
gatewise-ai/
│
├── apps/
│   ├── mobile/               # Android Guard Mobile App (Expo, React Native, TypeScript, Expo Router)
│   │   ├── app/              # Expo Router routes (_layout, login, verify, activity, visitors, profile)
│   │   ├── components/       # Shared mobile UI components
│   │   ├── features/         # Feature modules (capture, review, processing, confirmation)
│   │   ├── hooks/            # Custom hooks
│   │   ├── services/         # Mobile API and SecureStore services
│   │   ├── assets/           # App icon, splash screen, adaptive icon
│   │   ├── constants/        # Design system tokens and geometry
│   │   └── app.json          # Android application & camera permissions configuration
│   │
│   └── web/                  # Web App & Command Centre (Next.js 14 App Router, TypeScript, Tailwind)
│       ├── app/
│       │   ├── (public)/     # Public website routes (home, product, features, download)
│       │   ├── (admin)/      # Institutional Command Centre (dashboard, activity, people, visitors, etc.)
│       │   └── layout.tsx    # Root application shell
│       ├── components/       # Reusable web components
│       ├── lib/              # Client utilities and API service
│       └── types/            # TypeScript data contracts
│
├── backend/                  # Modular FastAPI Core Backend
│   ├── app/
│   │   ├── api/v1/           # Versioned REST & SSE endpoints
│   │   ├── core/             # Pydantic settings, database pool, structured logging
│   │   ├── models/           # SQLAlchemy declarative models (User, Gate, Identity, Event, etc.)
│   │   ├── schemas/          # Pydantic v2 validation models
│   │   ├── repositories/     # Database access layer
│   │   ├── services/         # Business logic & verification state machine
│   │   ├── security/         # HMAC-SHA256 JWT tokens & password hashing
│   │   ├── integrations/     # Google Drive & Gemini SOP interfaces
│   │   ├── computer_vision/  # OpenCV YuNet/SFace & blur estimation pipeline
│   │   └── main.py           # FastAPI entrypoint, CORS, lifespan handler
│   ├── migrations/           # Alembic database migrations
│   ├── tests/                # Automated Pytest suite
│   ├── alembic.ini           # Alembic configuration
│   └── requirements.txt      # Python dependencies
│
├── packages/
│   ├── design-tokens/        # Canonical color palette, typography, spacing, radii, thresholds
│   └── api-contracts/        # Shared TypeScript interfaces for auth, events, and visitor passes
│
├── docs/
│   ├── architecture/         # REPOSITORY_AUDIT.md, SYSTEM_ARCHITECTURE.md, DEVELOPMENT_ROADMAP.md
│   ├── design/               # DESIGN_IMPLEMENTATION.md
│   ├── api/                  # API contracts & endpoint specifications
│   ├── security/             # Security model & cryptographic signatures
│   └── deployment/           # Deployment guides
│
├── scripts/                  # Development scripts (dev.sh, migrate.sh, test.sh)
├── docker-compose.yml        # PostgreSQL service definition
├── pnpm-workspace.yaml       # pnpm workspace configuration
├── .env.example              # Environment variables template
├── .gitignore                # Secret and build artifact exclusions
├── package.json              # Monorepo root scripts
└── README.md
```

---

## 3. Technology Stack

* **Mobile**: Expo SDK 51, React Native 0.74, TypeScript 5.3, Expo Router, Expo Camera, Expo SecureStore.
* **Web**: Next.js 14.2 (App Router), React 18, TypeScript, Tailwind CSS, Lucide Icons, Framer Motion.
* **Backend**: Python 3.13, FastAPI, SQLAlchemy 2.0, Alembic, OpenCV (`cv2`) 5.0.0.
* **Database**: PostgreSQL (with pgvector in production; SQLite development fallback).
* **Package Manager**: `pnpm` 11.22+ workspaces.

---

## 4. Setup Instructions & Prerequisites

### Prerequisites
* **Node.js**: v18.0.0+ (Tested on v22.23.1)
* **pnpm**: v9.0.0+ (Tested on v11.22.0)
* **Python**: v3.10+ (Tested on v3.13.5)
* **OpenCV (`cv2`)**: Pre-installed or via `opencv-python-headless`

### 1. Clone & Install Dependencies
```bash
# Clone the repository
git clone <repo-url>
cd gatewise-ai

# Install JavaScript/TypeScript dependencies across all workspace projects
pnpm install

# Install Python backend dependencies
pip install -r backend/requirements.txt
```

### 2. Environment Setup
```bash
# Copy template to .env
cp .env.example .env

# Review and configure your environment variables:
# - DATABASE_URL (defaults to sqlite:///./gatewise.db for instant zero-config dev)
# - SECRET_KEY (generate via openssl rand -hex 32)
```

### 3. Run Database Migrations
```bash
# Apply initial Alembic migrations
pnpm migrate
```

---

## 5. Development Commands

| Command | Action | Port / Environment |
|---|---|---|
| `pnpm dev:backend` | Start modular FastAPI backend server | `http://localhost:8000` |
| `pnpm dev:web` | Start Next.js Web App & Command Centre | `http://localhost:3000` |
| `pnpm dev:mobile` | Start Expo Metro Bundler for Android Guard app | Metro Bundler |
| `pnpm test` | Run complete automated Pytest test suite | Pytest (63 tests) |
| `pnpm build` | Type-check and build all workspace projects | Build validation |
| `pnpm migrate` | Run Alembic database schema migrations | Database |

### Startup Order
1. **Start Core Backend**: `pnpm dev:backend` (Initializes database, seeds initial users and gates, serves `/health`).
2. **Start Web Portal**: `pnpm dev:web` (Serves public website and admin portal on port 3000).
3. **Start Mobile Terminal**: `pnpm dev:mobile` (Launches Expo Metro bundler for Android emulator or physical device).

---

## 6. Official Public Website & Android Download Centre

* **Public Website**:
  * Homepage: `http://localhost:3000/` (Features interactive 3D daylight campus model `<Campus3DView />`)
  * Product Showcase: `http://localhost:3000/product`
  * Features Matrix: `http://localhost:3000/features`
  * How It Works: `http://localhost:3000/how-it-works`
  * Security & Compliance: `http://localhost:3000/security`
  * Android Download Centre: `http://localhost:3000/download` (Dynamic release metadata and QR code)
  * Installation Guide: `http://localhost:3000/installation`
  * FAQ & Support: `http://localhost:3000/faq` & `http://localhost:3000/support`
* **Desktop Command Centre**: `http://localhost:3000/admin` (Protected institutional portal)
* **Android Release Verification Tool**:
  ```bash
  python3 scripts/verify_and_publish_apk.py <path-to-apk> \
    --version-name 1.0.0 \
    --version-code 1 \
    --download-url <https-url> \
    --publish
  ```

---

## 7. Testing & Verification

Execute the comprehensive automated test suite covering all 78 architectural criteria and 15 end-to-end scenarios:
```bash
# Run full automated test suite
pytest

# Run end-to-end integration scenarios specifically
pytest backend/tests/test_e2e_scenarios.py -v

# Run Next.js production build check
pnpm --filter @gatewise/web build

# Run Mobile TypeScript typecheck
pnpm --filter @gatewise/mobile typecheck
```

Expected test result:
```
============================== 78 passed in 2.55s ==============================
```

---

## 8. Release Documentation Catalog

The complete production readiness, performance, security, and deployment documentation is available in `docs/release/`:

1. [**Platform Integration Audit**](docs/release/PLATFORM_INTEGRATION_AUDIT.md) — Comprehensive pre-integration baseline audit of mobile, web, backend, and computer vision subsystems.
2. [**Platform Integration Report**](docs/release/PLATFORM_INTEGRATION_REPORT.md) — Architectural integration synthesis, single source of truth enforcement, and data flow diagrams.
3. [**End-to-End Test Report**](docs/release/END_TO_END_TEST_REPORT.md) — Verification evidence and execution logs for all 15 end-to-end product scenarios.
4. [**Performance & Latency Benchmark Report**](docs/release/PERFORMANCE_REPORT.md) — Empirical micro-benchmarks ($p50/p95$) confirming compliance with the $< 300\,\text{ms}$ frame-to-decision SLA.
5. [**Security Review & Threat Audit**](docs/release/SECURITY_REVIEW.md) — OWASP ASVS verification, RBAC boundaries, cryptographic seals, and the Five-Stage Biometric Data Privacy Lifecycle.
6. [**Production Readiness Checklist**](docs/release/PRODUCTION_READINESS_CHECKLIST.md) — 79-point QA matrix with 100% signoff across all modules.
7. [**Deployment & Operations Guide**](docs/release/DEPLOYMENT_GUIDE.md) — Staging and production deployment runbooks, Docker/Cloud Run commands, and rollback procedures.
8. [**Known Limitations & Operational Bounds**](docs/release/KNOWN_LIMITATIONS.md) — Environmental lighting guidelines, facial pose bounds, offline buffer limits, and hardware recommendations.

---

## 9. Performance Optimization & Benchmark Catalog

Comprehensive latency breakdowns, concurrency profiles, and micro-benchmarks are documented in `docs/performance/`:

1. [**Performance Baseline Audit**](docs/performance/PERFORMANCE_BASELINE.md) — Pre vs. post-optimization empirical benchmarks across computer vision, vector search, and API endpoints.
2. [**Verification Latency Breakdown**](docs/performance/VERIFICATION_LATENCY_BREAKDOWN.md) — 18-stage end-to-end request tracing waterfall from camera shutter tap to desktop SSE delivery.
3. [**Performance Optimization Master Report**](docs/performance/PERFORMANCE_OPTIMIZATION_REPORT.md) — Technical report on vectorized in-memory embedding cache ($1,219\times$ speedup), SSE pub-sub broadcaster, and connection pooling.
4. [**Load & Concurrency Benchmark Report**](docs/performance/LOAD_TEST_REPORT.md) — Multi-terminal stress testing up to 20 concurrent guard stations with $349.6\,\text{req/s}$ sustained throughput and 0% error rate.
5. [**Performance Observability & Monitoring**](docs/performance/PERFORMANCE_MONITORING.md) — Safe logging specification, correlation IDs (`X-Request-ID`), and alerting thresholds.

---

## 10. Default Development Credentials

* **Security Guard Station**:
  * Employee ID: `SEC-G014`
  * Password: `guard123`
  * Assigned Gate: `Main Campus Gate · Post 02` (Station locked)
* **Institutional Administrator**:
  * Employee ID: `ADM-001`
  * Password: `admin123`
  * Full Name: `Dr. Rajesh Iyer`
