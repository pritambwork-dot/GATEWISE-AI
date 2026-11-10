# GATEWISE AI Assistant — Operational Architecture & Runbook
**Document Version:** 1.0.0  
**Status:** Approved for Production  
**Target Environment:** IIM Sambalpur Institutional Deployment  
**Lead AI Systems Architect:** GATEWISE AI Core Engineering  

---

## 1. System Overview

The **GATEWISE AI Assistant** is an intelligent, tool-using operations co-pilot integrated directly into the GATEWISE AI Desktop Administrator Portal. 

Designed under Apple-grade craftsmanship standards and institutional security principles, the Assistant accelerates administrator workflows by providing:
- Real-time operational summaries of campus gate traffic and security verifications.
- Trend analysis of entry throughput, exception patterns, and peak traffic windows.
- Live telemetry from gate posts, active security officers, and turnstile hardware.
- Real-time visitor intake and campus occupancy overviews.
- Automated pending identity enrollment tracking against institutional SLAs.
- Curated institutional Standard Operating Procedure (SOP) guidance.
- Interactive deep-link navigation across the administrator portal.
- Structured **Action Proposals** requiring explicit human confirmation before executing any state changes.

---

## 2. Core Safety Invariants & Guardrails

The GATEWISE AI Assistant is architected with strict, unbypassable security invariants enforced on the backend:

```
+--------------------------------------------------------------------------------+
|                        GATEWISE SECURITY INVARIANTS                            |
+--------------------------------------------------------------------------------+
| 1. ZERO AUTONOMOUS PRIVILEGE                                                   |
|    The assistant CANNOT grant entry, deny access, approve identities, or alter |
|    access policies. All mutations are emitted as Action Proposals for human    |
|    administrator review and sign-off.                                          |
|                                                                                |
| 2. ZERO BIOMETRIC EXPOSURE                                                     |
|    Raw 128-D facial embeddings, facial crops, and private student/faculty PII  |
|    are strictly isolated from the LLM runtime. Data is aggregated/anonymized.  |
|                                                                                |
| 3. BACKEND AUTHORITY                                                           |
|    The LLM never queries the database directly. All data access occurs through |
|    strictly authorized, typed Python service methods.                          |
|                                                                                |
| 4. RESILIENT FALLBACK                                                          |
|    When the Gemini API is offline or quota-limited, the system automatically   |
|    degrades to deterministic database queries with zero downtime.              |
+--------------------------------------------------------------------------------+
```

---

## 3. Technology Stack & Protocol

| Layer | Technology | Role |
| :--- | :--- | :--- |
| **LLM Inference** | Google Gemini Developer API (`gemini-1.5-flash`) | Core natural-language comprehension & function calling |
| **Agent Framework** | Google Agent Development Kit (`google-adk==2.14.0`) + `google-genai==2.34.0` | Tool declarations, schemas, and execution loop |
| **Backend Runtime** | Python 3.13 / FastAPI 0.141 / SQLAlchemy 2.0 | Authentication, RBAC, tool execution, session isolation |
| **Streaming Protocol** | Server-Sent Events (SSE) over HTTP/TLS 1.3 | Sub-millisecond token & tool-call event delivery |
| **Frontend UI** | Next.js 14 / React 18 / Tailwind CSS / `@assistant-ui/react` | Apple-grade slide-over assistant drawer & tool cards |

---

## 4. Registered Operational Tool Catalog

All tools are strictly typed with Pydantic schemas and registered in `backend/app/agent/tools/registry.py`:

### 4.1 Read-Only & Analytical Tools

1. **`get_dashboard_summary`**
   - **Purpose:** Fetches daily operational totals across all campus gates.
   - **Returned Metrics:** `total_scans_today`, `authorized_entries`, `denied_entries`, `administrative_escalations`, `active_visitors_on_campus`, `pending_enrollment_referrals`, `active_gates_count`, `last_drive_sync`.
   - **PII Scrubbing:** Anonymized aggregate counts only. Zero personal names or biometric data.

2. **`get_verification_trends(timeframe: str = "today")`**
   - **Purpose:** Computes admittance rates, peak operational windows, and throughput metrics.
   - **Returned Metrics:** `admittance_rate_percent`, `denial_count`, `peak_operational_window`, `throughput_avg_scans_per_minute`.

3. **`get_gate_activity_summary`**
   - **Purpose:** Provides operational status and volume counters for each campus gate.
   - **Returned Data:** List of gate posts with `code`, `name`, `location`, `status`, `today_scans`, `verified_entries`, `denied_entries`.

4. **`get_pending_enrollment_summary`**
   - **Purpose:** Monitors pending student, faculty, and staff identity enrollment referrals.
   - **Returned Data:** `total_pending_requests`, `category_breakdown` (e.g. `{"STUDENT": 12, "FACULTY": 2}`), `sla_target_hours`.

5. **`get_visitor_summary`**
   - **Purpose:** Reports campus visitor statistics.
   - **Returned Data:** `total_registered_passes`, `currently_checked_in`, `expected_arrivals`, `expired_passes`, `campus_visitor_capacity_percent`.

6. **`get_system_health_summary`**
   - **Purpose:** Reports health status of backend subsystems.
   - **Returned Data:** Status of FastAPI backend (`OPERATIONAL`), PostgreSQL DB (`CONNECTED`), OpenCV YuNet & SFace models (`LOADED_ONNX`), Vector Cache (`WARMED`), Telemetry Stream (`STREAMING`).

7. **`explain_application_workflow(topic: str)`**
   - **Purpose:** Delivers authoritative institutional security standard operating procedures (State A through State F, Visitor Intake, Escalation Hierarchy).

8. **`explain_status(status_code: str)`**
   - **Purpose:** Decodes technical codes (`VERIFIED_AUTHORIZED`, `IDENTIFIED_UNAUTHORIZED`, `UNKNOWN_PERSON`, `INSUFFICIENT_QUALITY`) into operational guidance.

9. **`navigate_to_page(target_page: str)`**
   - **Purpose:** Directs the desktop client to allowlisted administrative screens (`/admin/activity`, `/admin/visitors`, `/admin/enrollment`, `/admin/gates`, `/admin/guards`, `/admin/repository`, `/admin/analytics`, `/admin/settings`).

---

### 4.2 Human-in-the-Loop Action Proposal Tools

These tools **never modify state directly**. Instead, they emit structured `ActionProposal` objects rendered as interactive cards in the UI:

1. **`propose_gate_status_change(gate_code, new_status, reason)`**
   - Emits proposal card linking to `/admin/gates` with pre-filled transition parameters.

2. **`propose_enrollment_review(request_id)`**
   - Emits proposal card linking to `/admin/enrollment?id={request_id}` for identity verification determination.

3. **`propose_visitor_pass(visitor_name, purpose, host_department)`**
   - Emits proposal card linking to `/admin/visitors?action=new` with validated metadata.

---

## 5. Security Architecture & RBAC Matrix

```
+-----------------------------------+-------------+-------+-------+
| Tool / Capability                 | SUPER_ADMIN | ADMIN | GUARD |
+-----------------------------------+-------------+-------+-------+
| get_dashboard_summary             | YES         | YES   | NO    |
| get_verification_trends           | YES         | YES   | NO    |
| get_gate_activity_summary         | YES         | YES   | NO    |
| get_pending_enrollment_summary    | YES         | YES   | NO    |
| get_visitor_summary               | YES         | YES   | NO    |
| get_system_health_summary         | YES         | YES   | NO    |
| navigate_to_page                  | YES         | YES   | NO    |
| propose_gate_status_change        | YES         | YES   | NO    |
| propose_enrollment_review         | YES         | YES   | NO    |
| propose_visitor_pass              | YES         | YES   | NO    |
| explain_application_workflow      | YES         | YES   | YES   |
| explain_status                    | YES         | YES   | YES   |
+-----------------------------------+-------------+-------+-------+
```

### 5.2 Rate Limiting & Sliding Window Controls
- **Per-Minute Window:** Enforced via `SlidingWindowRateLimiter` at **30 requests per minute** per user ID. Excess requests receive HTTP 429 Too Many Requests.
- **Daily Quota Window:** Capped at **1,500 requests per day** across all threads.
- **Session Auto-Reclamation:** Inactive administrator conversations expire after **60 minutes** (`SESSION_TTL_MINUTES=60`).

### 5.3 Compliance Audit Logging
- Every tool invocation automatically records an entry in the PostgreSQL `AuditLog` table:
  - `action`: `"AGENT_TOOL_EXECUTION"`
  - `resource_type`: `"AGENT_ASSISTANT"`
  - `resource_id`: Executed tool name
  - `details`: Sanitized parameters, timestamps, and caller user ID.

---
- **Input Screening:** Queries are scanned for prompt injection markers (`system override`, `developer mode`, `drop database`). Malicious requests are rejected immediately.
- **Data Redaction:** Regex filters automatically redact 12-digit Aadhaar numbers, 10-digit telephone numbers, JWT tokens, API keys, and 128-D raw floating-point arrays before LLM processing.
- **Output Scrubbing:** All tool dictionaries pass through `scrub_sensitive_dict`, stripping fields named `password`, `embedding`, `raw_vector`, or `token`.

---

## 6. Resilience & High-Availability Fallback Mode

If the Google Gemini API key is unset, invalid, or reaches its rate limit (HTTP 429), the GATEWISE AI Assistant switches seamlessly to **Deterministic High-Availability Fallback Mode**:

1. Identifies intent using semantic rule routing.
2. Executes the authorized tools directly against the live PostgreSQL database.
3. Streams formatted, authoritative institutional summaries with full tool cards and proposal cards.
4. Appends standard operational telemetry with zero user disruption.

**The core gate verification engine, tablet guard terminals, and command center remain 100% operational regardless of external LLM availability.**

---

## 7. API Reference

### `POST /api/v1/agent/chat`
- **Description:** Streaming Server-Sent Events (SSE) chat endpoint.
- **Headers:** `Authorization: Bearer <JWT>`, `Accept: text/event-stream`.
- **Request Body:**
  ```json
  {
    "query": "Summarize today's operations",
    "session_id": "optional-uuid"
  }
  ```
- **Stream Events:**
  - `text_delta`: `{"type": "text_delta", "delta": "string"}`
  - `tool_start`: `{"type": "tool_start", "tool_name": "string", "arguments": {}}`
  - `tool_result`: `{"type": "tool_result", "tool_name": "string", "result": {}}`
  - `action_proposal`: `{"type": "action_proposal", "proposal": {}}`
  - `navigation`: `{"type": "navigation", "target_page": "/admin/visitors", "page_title": "..."}`
  - `done`: `{"type": "done", "session_id": "uuid"}`

### `POST /api/v1/agent/message`
- **Description:** Synchronous JSON endpoint for REST clients.
- **Request Body:** Same as `/chat`.
- **Response Body:**
  ```json
  {
    "session_id": "uuid",
    "response": "Markdown response text",
    "tools_executed": [...],
    "proposals": [...]
  }
  ```

### `GET /api/v1/agent/sessions`
- **Description:** Returns active user-isolated chat sessions.

### `DELETE /api/v1/agent/sessions/{session_id}`
- **Description:** Deletes specified user session.

### `GET /api/v1/agent/tools`
- **Description:** Lists authorized tools permitted for caller's role.

---

## 8. Operational Troubleshooting & Runbooks

### Alert: "403 Forbidden: Operation requires one of roles..."
- **Root Cause:** Caller authenticated with `SECURITY_GUARD` credentials attempted to invoke administrative tools.
- **Resolution:** Instruct user to sign in with an authorized `ADMIN` or `SUPER_ADMIN` institutional profile.

### Alert: "Assistant using High-Availability Fallback"
- **Root Cause:** `GEMINI_API_KEY` missing from `.env` or free-tier rate limit reached.
- **Resolution:** Verify `GEMINI_API_KEY` in `backend/.env`. If quota exhausted, the assistant continues operating with real database data in fallback mode.
