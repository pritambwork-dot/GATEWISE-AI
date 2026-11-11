# GATEWISE AI 1.0 — COMPLETE SCREENSHOT INVENTORY
**Release Candidate Visual Asset Registry · Safe Synthetic Test Environment**  
*Captured: November 11, 2026 · Total Verified Visual Assets: 70 Captures*

---

## 1. Test Environment & Verification Methodology

All screenshots in this inventory were captured automatically using Playwright Chromium in headless mode against the verified Next.js production build (`http://localhost:3000`) connected to the active FastAPI local backend daemon (`http://localhost:8000`).

- **Base Directory**: `docs/design/screenshots/`
- **Data Fixtures**: Safe synthetic institutional identities (IIM Sambalpur Security Directorate schema), generated test verification events, and pre-seeded administrative test sessions (`ADM-001`).
- **Zero Production Data Leakage**: No real personal identifiable information (PII) or live biometric credentials were used.

---

## 2. Pillar 1: Admin Portal Inventory

| Screenshot ID & Path | Route | Target Component / View | Viewport | State |
|:---|:---|:---|:---:|:---:|
| `admin/admin_01_login.png` | `/admin/login` | Institutional Security Login Portal with Quick-Test Credentials | 1440×900 | Clean / Unauthenticated |
| `admin/admin_02_command_centre.png` | `/admin` | Command Centre Dashboard, Real-Time KPIs, Throughput Area Chart & Quick Action Bar | 1440×900 | Populated (Live) |
| `admin/admin_03_live_activity.png` | `/admin/activity` | Live Gate Activity Telemetry, Verification Log Table & Cryptographic Badge Feed | 1440×900 | Streaming / Populated |
| `admin/admin_04_people_identities.png` | `/admin/people` | Institutional Identity Directory, Clearance Levels & 128-D Vector Sync Badges | 1440×900 | Populated |
| `admin/admin_05_enrollment_requests.png` | `/admin/enrollment` | Field Enrollment Referrals, Officer Submission Queue & Priority Filter Pills | 1440×900 | Populated (Pending) |
| `admin/admin_06_visitor_passes.png` | `/admin/visitors` | Visitor Pass Registry, Active Campus Passes & Walk-in Intake Tracking | 1440×900 | Populated |
| `admin/admin_07_gate_posts.png` | `/admin/gates` | Perimeter Gate Posts, Assigned Shifts, Lane Status & Lockdown Toggles | 1440×900 | Populated (Active) |
| `admin/admin_08_guard_management.png` | `/admin/guards` | Security Guard Roster, Shift Allocations & Active Token Revocation Controls | 1440×900 | Populated |
| `admin/admin_09_drive_repository.png` | `/admin/repository` | Google Drive Identity Repository Sync, Folder Mapping & Embedding Integrity | 1440×900 | Operational / Synced |
| `admin/admin_10_analytics_eval.png` | `/admin/analytics` | Biometric Evaluation Metrics, Cosine Distribution Histogram & Latency Quartiles | 1440×900 | Populated |
| `admin/admin_11_system_settings.png` | `/admin/settings` | Security Thresholds (90% Auto-Admit / 70% Flag), Session Timers & Audit Rules | 1440×900 | Default Institutional |
| `admin/admin_12_verification_detail_modal.png` | `/admin/activity` | Verification Event Modal with Facial Crop, Similarity Cosine & HMAC Non-Repudiation Hash | 1440×900 | Modal Active |
| `admin/admin_13_identity_drawer.png` | `/admin/people` | Institutional Identity Slide-Over Drawer with Clearance Tier & Privilege Roster | 1440×900 | Drawer Open |
| `admin/admin_15_gate_config_modal.png` | `/admin/gates` | Perimeter Gate Post Configuration Modal with Lane Lockdown & Shift Allocation | 1440×900 | Modal Active |
| `admin/admin_16_guard_detail_modal.png` | `/admin/guards` | Security Officer Profile Modal with Active Session Termination & Badge Status | 1440×900 | Modal Active |
| `admin/admin_17_assistant_panel.png` | `/admin` | Operational Gemini AI Assistant Workspace with Suggested Contextual Prompts (`Cmd+K`) | 1440×900 | Panel Expanded |

---

## 3. Pillar 2: Public Website Inventory

| Screenshot ID & Path | Route | Target Component / Section | Viewport | State |
|:---|:---|:---|:---:|:---:|
| `website/web_01_homepage.png` | `/` | Technical Hero Section, Live Telemetry Strip, Trust Badges & 3D Interactive Architecture | 1440×900 | Populated |
| `website/web_02_product.png` | `/product` | Product Overview, Perimeter Edge Intelligence & Multi-Gate Topology | 1440×900 | Populated |
| `website/web_03_how_it_works.png` | `/how-it-works` | Three-Tier Processing Deep Dive (YuNet 28ms + SFace 128-D + Sovereign Guard Oversight) | 1440×900 | Populated |
| `website/web_04_features.png` | `/features` | Institutional Capabilities Grid, Anti-Spoofing Laplacian Blur & Offline Buffering | 1440×900 | Populated |
| `website/web_05_security.png` | `/security` | Cryptographic Architecture, Zero-Raw-Biometric Storage & Non-Repudiation Guarantees | 1440×900 | Populated |
| `website/web_06_download.png` | `/download` | Official Signed APK Distribution Centre with Interactive SHA-256 Verifier | 1440×900 | Populated |
| `website/web_07_installation.png` | `/installation` | Field Device Provisioning Guide & Institutional MDM Setup Workflow | 1440×900 | Populated |
| `website/web_08_faq.png` | `/faq` | Guard Operations FAQ, Edge Cases, Lighting Constraints & Exception Handling | 1440×900 | Populated |
| `website/web_09_support.png` | `/support` | Security Escalation Channels, Incident Response SLA & Gate Telemetry Diagnostics | 1440×900 | Populated |
| `website/web_10_stageshow_studio.png` | `/showcase` | Stageshow Interactive Product Demonstration Studio with 5 Guided Rehearsal Scenes | 1440×900 | Interactive |

---

## 4. Pillar 3: Guard Android App & Verification States

| Screenshot ID & Path | View / Route | Operational Context | Viewport | Biometric Outcome |
|:---|:---|:---|:---:|:---:|
| `mobile/mob_01_viewfinder_idle.png` | `/showcase` (Scene 2) | Handheld Guard Viewfinder Idle State with Oval Guidance Reticle | Phone Frame | Idle / Ready |
| `mobile/mob_02_detecting_landmarks.png` | `/showcase` (Scene 2) | Sub-second YuNet Face Landmark Extraction & SFace Embedding | Phone Frame | Scanning / Induction |
| `mobile/mob_03_biometric_match_found.png` | `/showcase` (Scene 2) | High-Confidence Candidate Match (98.4%) with Auto-Admit Recommendation | Phone Frame | Verified / Authorized |
| `mobile/mob_04_sovereign_entry_granted.png` | `/showcase` (Scene 2) | Sovereign Officer Decision Payoff & Cryptographic Seal Record | Phone Frame | Entry Granted |

### Matrix of Operational Guard States Covered in Mobile Suite (`apps/mobile/__tests__`)
1. **State A — Verified & Authorized**: Cosine similarity $\ge 90\%$, valid institutional clearance level, gate admission granted.
2. **State B — Identified but Expired**: Cosine similarity $\ge 90\%$, clearance expired (e.g. former student/alumnus), redirected to visitor desk.
3. **State C — Potential Match (Amber)**: Cosine similarity $70–89\%$, requires physical identity badge inspection before officer decision.
4. **State D — Unknown Person**: Cosine similarity $<70\%$, subject unregistered, field referral or visitor pass protocol triggered.
5. **State E — Image Quality Insufficient**: Laplacian blur score $<60.0$ or inadequate ambient lighting, prompt for re-capture.
6. **State F — Multiple Faces Detected**: Multiple subjects in camera viewfinder, officer guided to isolate individual subject.
7. **State G — Verification Unavailable / Offline**: Network disruption, local SQLite caching activated with HMAC tamper-evident seals.

---

## 5. Pillar 4: Multi-Breakpoint Responsive Captures

Captured across all 7 required device profiles:

| Profile | Dimensions | Route `/` | Route `/admin` | Route `/admin/activity` | Route `/features` | Route `/download` |
|:---|:---:|:---:|:---:|:---:|:---:|:---:|
| **Desktop Pro** | 1920×1080 | `resp_01_...` | `resp_02_...` | `resp_03_...` | `resp_04_...` | `resp_05_...` |
| **Standard Desktop** | 1440×900 | `resp_01_...` | `resp_02_...` | `resp_03_...` | `resp_04_...` | `resp_05_...` |
| **Compact Desktop** | 1280×800 | `resp_01_...` | `resp_02_...` | `resp_03_...` | `resp_04_...` | `resp_05_...` |
| **Tablet Landscape** | 1024×768 | `resp_01_...` | `resp_02_...` | `resp_03_...` | `resp_04_...` | `resp_05_...` |
| **Tablet Portrait** | 768×1024 | `resp_01_...` | `resp_02_...` | `resp_03_...` | `resp_04_...` | `resp_05_...` |
| **Mobile Phone** | 390×844 | `resp_01_...` | `resp_02_...` | `resp_03_...` | `resp_04_...` | `resp_05_...` |
| **Compact Android** | 360×800 | `resp_01_...` | `resp_02_...` | `resp_03_...` | `resp_04_...` | `resp_05_...` |

*Verification Result*: **100% of the 35 responsive captures exhibit zero horizontal overflow, zero clipped typography, and fully functional responsive navigation.**

---

## 6. Pillar 5: Stageshow Rehearsal Scenes

| Scene ID | Filename | Demonstration Subject | Device Pattern |
|:---:|:---|:---|:---:|
| **Scene 1** | `rehearsal/stageshow_scene_1.png` | Platform Overview: Mac Command Centre & Handheld Device Pair | `device-pair` |
| **Scene 2** | `rehearsal/stageshow_scene_2.png` | Sub-Second Edge Verification: Single-Shot Induction & Match | `phone-touch` |
| **Scene 3** | `rehearsal/stageshow_scene_3.png` | High-Throughput Stream: Multi-Gate Live Verification Feed | `realtime-feed` |
| **Scene 4** | `rehearsal/stageshow_scene_4.png` | Human-in-the-Loop Adjudication: Field Referral Review | `dialog-review` |
| **Scene 5** | `rehearsal/stageshow_scene_5.png` | Operational AI Copilot: Gemini Assistant Telemetry Workspace | `assistant-thread` |

---

## 7. Storage & Archive Integrity
All visual assets reside in the repository under version control in `docs/design/screenshots/` and are cross-referenced in the Release Candidate Report.
