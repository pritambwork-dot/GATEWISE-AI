# GATEWISE AI 1.0 — DESIGN AUDIT & REDESIGN BASELINE
**Comprehensive Pre-Redesign Baseline Audit across Web Portal, Public Site & Android App**  
*Branch: `design/apple-quality-redesign`*  
*Date of Audit: 2026-11-11*  
*Methodology: Visual inspection, DOM structure, component geometry, token analysis, contrast review*

---

## 1. Executive Summary of Current State

The existing GATEWISE AI 1.0 platform possesses an exceptionally strong architectural foundation:
- Clean daylight brand tokens (`#F4F8F5` background, `#23865D` institutional emerald, `#DDF0E2` mint).
- Robust full-stack functionality with 20 web routes, 82 green tests, and an active FastAPI backend.
- Decoupled face matching and sovereign guard authorization workflows.

However, from an **Apple-quality product design** standpoint, several visual and interaction shortcomings exist:
1. **Container Stacking & Border Fatigue**: Multiple sections in the Admin Portal nest containers inside containers, resulting in up to 4 concentric gray hairline borders that add visual clutter.
2. **Metric Uniformity in Command Centre**: Key metrics are laid out as 6 identical square cards with identical visual weight, missing an intentional focal hierarchy (e.g., active incident vs. routine count).
3. **Typography & Line Pitch**: Several tables and form controls lack optical cap-height centering (`text-box: trim-both cap alphabetic`), leading to labels sitting slightly low in pills and button frames.
4. **Android Native Convention Divergence**: Mobile screens currently resemble generic cross-platform layouts rather than taking full advantage of Android 14/15 Material 3 conventions (subtle tonal elevation, 48dp minimum touch targets, Android system navigation clearance).
5. **Stageshow Product Showcases**: The public website demonstrates the product via a single hero stage, but lacks full Stageshow multi-scene choreography (`device-pair`, `phone-touch`, `choreography`, `panel-annotation`, `ai-chat`).

---

## 2. Screen-by-Screen Baseline Audit

### 2.1 Public Website (`/`)
- **Current State**: Responsive hero with 3D Canvas (`Campus3DView`), 6-tile Bento grid, 4-step accordion, and footer.
- **Issues**:
  - The hero text and 3D canvas compete for visual dominance on 1024px tablet screens.
  - The Bento grid uses identical border treatments on every tile; lacks the deliberate material contrast advocated in Stageshow `references/bento.md` (e.g. inverted dark tile, stat-only tile, component-only tile).
  - Feature cards below the hero have repetitive text sizes.
- **Opportunities**:
  - Implement the Stageshow `device-pair` pattern showing the Android Guard phone and Desktop Admin portal communicating in real time.
  - Implement fine-ruled bento grid layout with shared inner rules.

### 2.2 Admin Portal — Command Centre (`/admin`)
- **Current State**: Header with refresh button, 6-card KPI grid, hourly traffic area chart, donut outcome chart, active gate posts, and recent events list.
- **Issues**:
  - KPI cards lack hierarchy: "Total Scans Today" looks identical to "Pending Approvals".
  - Recent events list rows are slightly tall (48px text height) with inconsistent status badge padding.
  - Gate selection panel has near-tangents (2px gap to parent container).
- **Opportunities**:
  - Adopt Apple-like macOS split view: Primary Hero KPI with large display numeral (48px) and contextual delta indicator; secondary metrics grouped into a quiet segmented band.
  - Refine event rows with consistent 12px inset, optical alignment, and subtle status dots.

### 2.3 Admin Portal — Live Gate Activity (`/admin/activity`)
- **Current State**: Event feed with filter chips, date filter, and detail modal.
- **Issues**:
  - Frequent SSE updates cause micro-jitter if row heights vary.
  - Filter chips lack active pill elevation.
- **Opportunities**:
  - Implement a pinned timeline rail with subtle connecting hairline.
  - Smooth row transitions using Framer Motion layout animations.

### 2.4 Admin Portal — People & Identities (`/admin/people`)
- **Current State**: Data table with search bar, role filter dropdown, and action buttons.
- **Issues**:
  - Table stretches to 100% width on wide monitors, causing awkward whitespace between the person name and the action button.
  - Mobile layout clips the right-most columns.
- **Opportunities**:
  - Clean table with fixed column tracks and sticky action lane.
  - Card-based reflow for screens < 768px.

### 2.5 Admin Portal — Enrollment Requests (`/admin/enrollment`)
- **Current State**: Two-column layout with request list and review card.
- **Issues**:
  - Review card has 3 nested border frames around applicant photos.
  - Action buttons (Approve / Reject) sit directly below form fields without sufficient separation.
- **Opportunities**:
  - Clean master-detail split pane inspired by iPadOS Mail / Photos.
  - 12px clearance between review metadata and sovereign approval buttons.

### 2.6 Admin Portal — Visitor Management (`/admin/visitors`)
- **Current State**: Visitor pass cards, active visitor counter, walk-in registration modal.
- **Issues**:
  - Active vs. checked-out visitors look similar at a glance.
  - QR pass preview in modal is unstyled.
- **Opportunities**:
  - Distinct status treatments: Emerald badge with pulse dot for `CHECKED_IN`, quiet slate for `CHECKED_OUT`.
  - Polished digital pass badge design resembling an institutional credential.

### 2.7 Admin Portal — Google Drive Repository (`/admin/repository`)
- **Current State**: Status banner, sync statistics, file list.
- **Issues**:
  - Status banner is text-heavy and uses warning yellow even when sync is healthy.
- **Opportunities**:
  - Restrained Apple-like settings card with sync progress meter, folder path breadcrumbs, and error log drawer.

### 2.8 Admin Portal — Analytics & Evaluation (`/admin/analytics`)
- **Current State**: Recharts AreaChart, BarChart, and statistical summary cards.
- **Issues**:
  - Chart grid lines are dark (`#bdc9c5`), distracting from data curves.
  - Tooltip styling uses default browser borders.
- **Opportunities**:
  - Custom frosted glass tooltips (`backdrop-blur-md bg-white/90`).
  - Ultra-faint gridlines (`rgba(0,0,0,0.04)`) and curated institutional emerald/teal color ramps.

### 2.9 Admin Portal — AI Assistant Panel
- **Current State**: Side drawer with chat messages and input field.
- **Issues**:
  - Drawer transition is abrupt.
  - Message bubbles have sharp corners and lack structured tool execution tags.
- **Opportunities**:
  - Smooth spring-animated drawer with frosted background.
  - Stageshow `ai-chat` pattern with tool badges (`Querying Gate Telemetry...`) and structured answer cards.

### 2.10 Android Guard Application
- **Current State**: Tab navigation (`Verify`, `Activity`, `Visitors`, `Profile`), Camera capture screen with reticle, review screen, result screen.
- **Issues**:
  - Tab bar height and icons use iOS-style glyphs rather than Android Material iconography.
  - Camera reticle lacks tactical corner anchors.
  - Result screen combines identity candidate match with gate authorization in a confusing banner.
- **Opportunities**:
  - Authentic Android Material 3 design: 56dp action bars, 48dp minimum touch targets, floating action button for capture, and clear decoupled clearance cards.

---

## 3. Preserved Architectural Invariants

The redesign strictly preserves:
1. **API Contracts**: Zero changes to `/api/v1/*` schemas.
2. **Security & RBAC**: Sovereign guard oversight and admin privilege boundaries remain intact.
3. **Model Weights & Checksums**: YuNet and SFace weights remain untouched.
4. **Database Integrity**: Schema and migration version `b32670b55c76` preserved.
