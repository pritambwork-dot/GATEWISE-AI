# GATEWISE AI 1.0 — SCREEN-BY-SCREEN REDESIGN SPECIFICATION
## Comprehensive Architectural Audit · Before vs. After · Web, Admin, and Android Mobile

---

### Executive Summary

This document records the screen-by-screen transformation of GATEWISE AI from a functional development prototype into an Apple-crafted institutional platform. Across both web and mobile surfaces, the redesign eliminated container nesting, border fatigue, loud alert banners, and ambiguous typography in favor of unified geometry, restrained color accents, tabular numerals, and tactical precision.

---

### 1. Public Web Application Surfaces

#### 1.1 Public Landing Page (`apps/web/app/(public)/page.tsx`)
- **Before:** Generic dark hero section with static illustration, standard 3-column feature boxes, repetitive card borders, and unmeasured marketing copy.
- **After:**
  - Integrated **Stageshow Hero Demo**: Interactive single-shot guard viewfinder paired with 3D digital campus twin, ANPR lens, and straddling HMAC-SHA256 satellite receipt card.
  - **14-Rule Bento Grid**: Strict checkerboard alternation of UI fragments, display typography metrics ("98.4%", "28ms"), physical hardware credentials, and campus architecture.
  - Live cluster telemetry banner (`bg-[#17221c]`) showing node heartbeat, SFace average score, and edge latency.

#### 1.2 Interactive Stageshow Showcase (`apps/web/app/(public)/showcase/page.tsx`)
- **Before:** No dedicated product demonstration lab existed; reviewers had to inspect static documentation.
- **After:**
  - Interactive multi-scene studio presenting all 5 core Stageshow scenes (`device-pair`, `phone-touch`, `choreography`, `panel-annotation`, and `ai-cards`).
  - Viewport mode switch between desktop (1100w) and compact mobile (390w).
  - Play, pause, scrub, and step controls with real-time `--gate rehearsal passed` audit status.

---

### 2. Administrative Portal Modules (`apps/web/app/(admin)/admin/`)

#### 2.1 Admin Portal Layout & Navigation (`admin/layout.tsx`)
- **Before:** Fixed static sidebar with high-contrast borders and disconnected top bar.
- **After:**
  - macOS/iPadOS-inspired collapsible sidebar (`Cmd+B` shortcut) with icon and label hierarchy.
  - Frosted top glass navigation with breadcrumbs, live station telemetry heartbeat, quick command launcher (`Cmd+K`), and notification popover.
  - Faint 1px hairline boundary with soft backdrop blur (`bg-white/80 backdrop-blur-xl`).

#### 2.2 Command Centre (`admin/page.tsx`)
- **Before:** Cluttered 4-card metric strip with identical styling, flat static table, and basic Recharts bar.
- **After:**
  - 7-column primary hero metric (`1,420` verified scans today) with secondary 4-metric grid.
  - 24-Hour Ingress/Egress Area Chart with custom frosted glass tooltips and faint gridlines (`#f1f5f9`).
  - Active Station Inspector showing gate posts, assigned guards, and live scan counts.
  - Slide-over audit record dossier drawer with copyable cryptographic HMAC-SHA256 non-repudiation signature.

#### 2.3 Live Gate Telemetry & Verification Stream (`admin/activity/page.tsx`)
- **Before:** Dense table with repeating text, noisy status tags, and lack of visual flow.
- **After:**
  - View toggle between **Enterprise Data Grid** and **Timeline Rail** with connecting vertical line and pulse dots.
  - Tabular numerals (`font-mono tabular-nums`) on all timestamps, IDs, and similarity scores.
  - Refined audit inspection drawer with zero-knowledge biometric compliance notice.

#### 2.4 Institutional Identity Registry (`admin/people/page.tsx`)
- **Before:** Monolithic table without clear category distinction or fast filtering.
- **After:**
  - Quick category filter chips (All Directory, Students, Faculty, Staff, Contractors).
  - Clean column tracks with sticky action lane and responsive card reflow on smaller displays.
  - Slide-over profile dossier showing mapped Google Drive reference photos and clearance tiers.

#### 2.5 Field Enrollment Requests (`admin/enrollment/page.tsx`)
- **Before:** Basic modal dialog requiring full context switching to review referrals.
- **After:**
  - iPadOS Mail/Photos-inspired master-detail split pane (40% master list / 60% detail pane).
  - Exactly 12px clearance between candidate metadata, admin adjudication notes, and approval actions.
  - Immediate optimistic status updates upon approval or rejection.

#### 2.6 Visitor Pass Management (`admin/visitors/page.tsx`)
- **Before:** Standard list with ambiguous status badges and plain text passcodes.
- **After:**
  - Distinct status treatments: emerald pulse badge for `CHECKED_IN`, quiet slate for `CHECKED_OUT`, and warm amber for `EXPECTED`.
  - Titanium / obsidian digital credential pass card with holographic pass code, copy feedback, and check-in/out timestamps.

#### 2.7 Gate Posts & Terminals (`admin/gates/page.tsx`)
- **Before:** Flat card list with raw database IDs and manual form inputs.
- **After:**
  - Station post cards with live status beacons (`bg-emerald-500 animate-pulse`), assigned officer badge, and today's scan statistics.
  - Controlled guard assignment modal allowing seamless shift dispatching.

#### 2.8 Security Guard Directory (`admin/guards/page.tsx`)
- **Before:** Unstyled officer list without active device session oversight.
- **After:**
  - Officer directory with real-time station post linkage and active shift indicators.
  - One-click session revocation tool for emergency mobile token deauthorization.

#### 2.9 Identity Photo Repository (`admin/repository/page.tsx`)
- **Before:** Status text block without visual progress or folder context.
- **After:**
  - Google Drive ingestion progress meter displaying mapped vs. expected percentage.
  - Hierarchical folder path breadcrumb (`Google Drive > AUT-Perimeter > reference_photos`).
  - Dedicated unmapped file review modal with filename schema guidance (`<ID>_<Name>.jpg`).

#### 2.10 Biometric Analytics & ROC Curves (`admin/analytics/page.tsx`)
- **Before:** Simple line charts without domain context or threshold reference markers.
- **After:**
  - Biometric FAR vs. FRR Tradeoff Curve highlighting the optimal production cutoff (`0.90`).
  - Pipeline latency decomposition breakdown showing YuNet detection, SFace inference, and HMAC sealing.
  - Custom frosted glass chart tooltips (`FrostedTooltip`).

#### 2.11 System Configuration (`admin/settings/page.tsx`)
- **Before:** Long unorganized settings form with raw text inputs.
- **After:**
  - Grouped setting sections under segmented pill navigation tabs.
  - Interactive calibration sliders for auto-admit threshold (`0.90`) and review floor (`0.70`).
  - FIDO2 hardware key enrollment management and emergency lockdown protocol slider.

---

### 3. Android Guard Mobile Application (`apps/mobile/`)

#### 3.1 Camera Capture & Viewfinder (`app/(guard)/verify/camera.tsx`)
- **Before:** Square camera preview with 44dp buttons and standard icons.
- **After:**
  - Genuine Android Material 3 tactile reticle with corner brackets and face oval guide.
  - Upgraded touch targets to $\ge 48\text{dp}$ (`minWidth: 48, minHeight: 48`).
  - Real-time ambient lighting score indicator (Optimal 91%).

#### 3.2 Verification Result Card (`src/components/VerificationResultCard.tsx`)
- **Before:** Single column result with photo stack.
- **After:**
  - Decoupled candidate identity resolution from institutional authorization status.
  - Side-by-side comparison of live capture crop vs. enrolled reference photo.
  - Crisp status badge with similarity cosine percentage (`98.2% MATCH`).

#### 3.3 Sovereign Guard Decision Screen (`app/(guard)/verify/decision.tsx`)
- **Before:** Basic buttons without override notes or cryptographic context.
- **After:**
  - High-contrast primary action buttons with minimum 48dp height.
  - Explicit discretionary override reasons ("Visual Confirmation", "Official Badge Inspected", "Manual Escort").
  - Automatic HMAC-SHA256 signature binding upon decision submission.
