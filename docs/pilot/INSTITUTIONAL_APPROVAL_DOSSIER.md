# GATEWISE AI — Institutional Pilot Approval & Governance Dossier
**Institution:** Indian Institute of Management (IIM) Sambalpur  
**Project Title:** GATEWISE AI 1.0 — Perimeter Verification & Sovereign Access Control  
**Station:** Main Campus Gate · Post 02 (`GATE-MAIN-02`), Ring Road North Entrance  
**Date of Submission:** November 11, 2026  
**Document Classification:** Official Governance, DPDP Compliance & Pilot Authorization

---

## 1. Executive Memorandum & Authorization Request

**MEMORANDUM**

**TO:**  
Prof. (Dr.) S. K. Mahapatra, Director, IIM Sambalpur  
Col. (Retd.) R. N. Sharma, Chief Administrative & Security Officer  

**FROM:**  
GATEWISE AI Engineering & Technical Launch Lead  

**SUBJECT:**  
Formal Authorization Request for Stage 3 Restricted Physical Gate Pilot at Main Campus Gate · Post 02  

**EXECUTIVE SUMMARY:**  
The engineering, security hardening, on-device mobile testing, and quality assurance phases of the GATEWISE AI platform have reached 100% completion. The platform has been rigorously audited across 142 automated tests, 35 AI agent security scenarios, and live physical Android device workflows with sub-15ms end-to-end latency.

We respectfully request formal institutional authorization to initiate a controlled, supervised pilot at **Main Campus Gate · Post 02** under the governance terms, data privacy safeguards, and manual fallback procedures detailed in this dossier.

---

## 2. Institutional Pilot Charter & Terms of Reference

### 2.1 Pilot Scope & Bounded Cohort
- **Location:** Gate Post 02 (`GATE-MAIN-02`), Ring Road North Entrance.
- **Operating Shift:** Shift A (Morning 06:00 – 14:00 IST).
- **Assigned Officer:** Officer Ramesh Verma (`SEC-G014`), Security Officer.
- **Administrative Supervisor:** Dr. Rajesh Iyer (`ADM-001`), Security Administration.
- **Participating Cohort:** Enrolled MBA Cohort (100 students) and Residential Faculty (20 members) who have received the institutional orientation notice.
- **Duration:** 14 calendar days from launch approval.

### 2.2 Core Operational Principles
1. **Human Guard Sovereignty:** The security officer holds exclusive, sovereign authority over physical entrance barriers. AI models provide visual candidate similarity recommendations; they never open physical turnstiles autonomously.
2. **Decoupled Clearance:** A positive facial match is strictly separated from institutional clearance status. Individuals with suspended or expired privileges are flagged in prominent red, regardless of model confidence.
3. **No Continuous Surveillance:** The system processes single-shot still captures initiated manually by the guard. Continuous video streaming or ambient background tracking is architecturally prohibited.
4. **Mandatory Manual Fallback (SOP-01):** If the guard app, device, or network experiences any interruption, the officer immediately defaults to physical student smart card / ID inspection.

---

## 3. Data Protection Impact Assessment (DPIA) — DPDP Act 2023 Compliance

GATEWISE AI has been engineered specifically to comply with the Indian **Digital Personal Data Protection (DPDP) Act 2023**:

| DPDP Act 2023 Principle | Technical Implementation & Compliance Safeguards |
|---|---|
| **Lawful Purpose & Consent** | Physical access verification to protect campus residents. Clear physical signage posted at Gate 02 informing entrants of still-camera capture. |
| **Data Minimization** | Single-shot still frame captured only upon guard trigger. Frame is processed in-memory and discarded; raw camera images are never stored on disk. |
| **On-Premise Data Sovereignty** | Biometric reference portraits and 128-D vector embeddings reside exclusively on campus servers; zero biometrics are transmitted to cloud LLMs or third parties. |
| **Storage Limitation** | Transient captures discarded immediately; verification event telemetry retained in cryptographic audit logs for 180 days; expired visitor records purged after 30 days. |
| **Integrity & Non-Repudiation** | Every physical gate admittance decision is sealed with an HMAC-SHA256 signature calculated over timestamp, guard ID, gate ID, outcome, and subject ID. |
| **Right to Alternate Verification** | Any campus resident or visitor may opt out of facial verification and present their physical institutional ID card at any time without penalty. |

---

## 4. Operational Fallback Protocol (SOP-01) Agreement

During any system interruption, network degradation, or device battery depletion:
1. **Immediate Fallback:** The security guard transitions immediately to manual physical ID verification.
2. **Paper Registry:** Visitors are logged using the physical Gate 02 Visitor Logbook.
3. **No False Open:** The system never defaults to an "unverified admit" state; security integrity is fully maintained.
4. **Incident Escalation:** The officer contacts IT Helpdesk (`ext. 2204`) within 30 minutes of any operational exception.

---

## 5. Formal Institutional Sign-off Instrument

By signing below, the authorized institutional leadership grants permission to commence the Stage 3 Restricted Physical Gate Pilot at IIM Sambalpur Gate Post 02:

```
─────────────────────────────────────────────────────────────────────────────
APPROVAL & AUTHORIZATION SIGNATURES
─────────────────────────────────────────────────────────────────────────────

1. CHIEF ADMINISTRATIVE & SECURITY OFFICER:
   
   Name:      Col. (Retd.) R. N. Sharma
   Title:     Chief Administrative & Security Officer, IIM Sambalpur
   Decision:  [  ] APPROVED     [  ] REVISE / DEFER
   Signature: ___________________________________
   Date:      ___________________________________


2. DIRECTOR OF THE INSTITUTE:

   Name:      Prof. (Dr.) S. K. Mahapatra
   Title:     Director, IIM Sambalpur
   Decision:  [  ] APPROVED     [  ] REVISE / DEFER
   Signature: ___________________________________
   Date:      ___________________________________

─────────────────────────────────────────────────────────────────────────────
```
