# GATEWISE AI 1.0.0 — OFFICIAL PRODUCTION RELEASE NOTES
**Release Version**: `1.0.0` · **Build**: `2026.11.11`  
**Git Tag**: `v1.0.0` · **Git Commit**: `d0651fb4375b43063fbf889dcbfb49e29a8a7199`  
**Target Platform**: Campus Perimeter Security & Institutional Gate Operations

---

## 1. Overview & Release Highlights

GATEWISE AI 1.0.0 represents the first official production release of the intelligent campus gate verification and visitor management platform. Designed specifically for educational and research institutions (deployed for the IIM Sambalpur Security Directorate), the platform combines sub-second edge facial verification, human-in-the-loop sovereign guard oversight, cryptographic audit sealing, and an Apple-grade daylight UI/UX experience.

---

## 2. Public Technical Website Improvements (`/*`)

- **Apple-Grade Daylight Design Language**: Fully redesigned interface featuring daylight green (`#23865D`), forest deep (`#176346`), mint (`#F4F8F5`), and pure white surface cards. Eliminated high-saturation neon gradients.
- **Interactive Stageshow Demonstration Studio (`/showcase`)**: Integrated five real-time rehearsal demonstrations showcasing perimeter guard pairing, sub-second biometric matching, high-throughput command streams, field referral review, and operational AI copilot queries.
- **Interactive APK Cryptographic Verifier (`/download`)**: Added an in-browser drag-and-drop SHA-256 binary validation tool, allowing security auditors to cryptographically verify official release APKs before deployment.
- **Enhanced Technical Documentation**: Detailed pipeline explanations on `/how-it-works` and `/security` demystifying the YuNet (28ms) + SFace (128-D) + pgvector decoupled clearance architecture.
- **Fluid Multi-Breakpoint Responsiveness**: Restructured header navigation and telemetry tickers to ensure zero horizontal overflow across desktop, tablet, and mobile phone viewports.

---

## 3. Admin Central Portal Improvements (`/admin/*`)

- **macOS-Style Collapsible Sidebar**: Implemented a grouped navigation sidebar (`OVERVIEW`, `OPERATIONS`, `INSTITUTION`, `SYSTEM`) with keyboard shortcut `Cmd+B` to collapse into an icon-only 72px rail.
- **Mobile Navigation Drawer**: Built a responsive slide-over drawer for security directors accessing the Command Centre on mobile phones or field tablets.
- **Global AI Assistant Shortcut (`Cmd+K`)**: Instant modal access to the Gemini 1.5 Flash administrative assistant from any view in the portal.
- **Tabular & Monospace Rigor**: Event IDs, timestamps, cosine similarities, and HMAC-SHA256 signatures are rendered in JetBrains Mono with tabular lining figures for rapid optical alignment.
- **Non-Disruptive Drawers & Modals**: Added slide-over inspection drawers for institutional identities (`/admin/people`) and verification detail modals (`/admin/activity`) with candidate face crops and confidence gauges.

---

## 4. GATEWISE Guard Android Application (`apps/mobile/*`)

- **Android Material 3 Native Design**: Pure daylight palette aligned with Android ergonomics; avoided foreign iOS interface conventions.
- **Sub-Second Viewfinder Reticle**: Smooth oval facial guidance frame with real-time status transitions (`IDLE`, `SCANNING`, `MATCHED`, `AUTHORIZED`).
- **Sovereign Decision Controls**: Extra-large 52dp thumb-friendly *Admit* and *Deny* action buttons positioned in the lower viewport for field operation under direct sunlight.
- **Decoupled Verification Outcomes**: High-contrast semantic badges for all 7 operational states (`Verified`, `Expired`, `Potential Match`, `Unknown Person`, `Insufficient Quality`, `Multiple Faces`, `Offline Unavailable`).
- **Cryptographic Audit Badge**: Real-time display of the HMAC-SHA256 tamper-evident seal generated upon every guard decision.

---

## 5. Accessibility & Performance Enhancements

- **WCAG 2.2 Level AA Full Conformance**: 0 automated warnings across all pages. Contrast ratios strictly exceed $4.5:1$ (body text: $12.85:1$, headings: $14.21:1$).
- **Keyboard Navigation Parity**: Complete mouse-free accessibility with standardized 2px emerald focus rings and Escape key dialog dismissals.
- **Reduced-Motion Safeguards**: Full `@media (prefers-reduced-motion)` overrides neutralizing background pulses and layout animations.
- **Blazing Edge Performance**: First Contentful Paint (FCP) $\le 104\text{ms}$, Time to First Byte (TTFB) $\le 4\text{ms}$, Cumulative Layout Shift (CLS) $= 0.000$.
- **Tensor Verification Latency**: End-to-end edge inference completed in under $80\text{ms}$.

---

## 6. Bug Fixes & Code Hardening

- **Fixed DEF-01**: Eliminated 75px horizontal layout overflow at 768px tablet portrait viewport in public layout.
- **Fixed DEF-02**: Bypassed AdminShell sidebar layout on `/admin/login`, resolving mobile form squeeze.
- **Fixed DEF-03**: Added responsive mobile drawer navigation to Admin Central Portal.
- **Fixed DEF-04**: Hardened visitor pass code generator to guarantee uniqueness against the SQLite database table.
- **Fixed DEF-05**: Added dual decorators `@router.get("")` and `@router.get("/")` to prevent unwanted 307 redirects on Next.js proxy requests.

---

## 7. Known Limitations & Operational Boundaries

1. **Google Drive Reference Photo Ingestion**: In accordance with institutional data sovereignty guidelines, Google Drive live sync remains in standby mode pending institutional Shared Drive provisioning.
2. **Live Biometric Processing Gate**: The platform operates in certified synthetic test mode. Real human facial data processing requires formal institutional directorate authorization.
3. **Lighting & Angle Constraints**: Ambient illumination below 50 lux or subjects exceeding $\pm 30^\circ$ yaw will trigger the safety degraded outcome `IMAGE_QUALITY_INSUFFICIENT`, prompting officers for manual credential inspection.
