# GATEWISE AI — Video Production & Encoding Report

**Document:** `VPR-SPEC-1.0.0`  
**Production Tooling:** Python OpenCV + PIL Synthesis + FFmpeg 7.1 (macOS arm64)  
**Output Directory:** `/apps/web/public/media/videos/`  
**Associated Posters:** `/apps/web/public/media/posters/`  

---

## 1. Master Walkthrough Storyboard (65 Seconds)

The master product walkthrough video (`gatewise-overview.mp4` and `gatewise-overview.webm`) was authored according to the 5-scene cinematic structure specified in Master Prompt 17.

```
+---------------------------------------------------------------------------------------------------+
| 00:00 - 00:12 | Scene 1: Perimeter Bottleneck & High-Density Shift Changes                      |
| 00:12 - 00:28 | Scene 2: GATEWISE Guard Android Verification & 28ms Edge Inference              |
| 00:28 - 00:44 | Scene 3: Admin Command Centre Live Telemetry & Event Stream                     |
| 00:44 - 00:58 | Scene 4: Connected Cryptographic Audit & HMAC-SHA256 Non-Repudiation            |
| 00:58 - 01:05 | Scene 5: Institutional Governance, DPDP Compliance & Production Readiness        |
+---------------------------------------------------------------------------------------------------+
```

### Scene 1 (00:00 – 00:12): Perimeter Challenges
- **Narrative Focus:** Traditional institutional bottlenecks at campus gates during morning shift arrivals and student class transitions.
- **Visual Presentation:** Dark tactical title card transitioning into high-contrast gate telemetry statistics (650+ entrants/hour, manual register latency 14.2s vs. GATEWISE target <300ms).
- **Core Message:** "Manual gate registers and centralized cloud biometrics create vulnerability and delays. GATEWISE AI re-engineers access control from the physical perimeter inward."

### Scene 2 (00:12 – 00:28): Guard Mobile HUD
- **Narrative Focus:** Officer Ramesh Verma operating the ruggedized Android terminal at Gate-Main-02.
- **Visual Presentation:** 30fps optical viewfinder stream with active corner reticles. Real-time YuNet 5-point landmark detection (28ms) locking onto simulated faculty candidate Dr. Maya Sharma.
- **Core Message:** "YuNet detects landmarks in 28ms. SFace extracts 128-D vector coordinates on-device. Zero photos saved to server disks. Immediate 0.984 cosine clearance."

### Scene 3 (00:28 – 00:44): Central Command Centre
- **Narrative Focus:** Central institutional dashboard reflecting the real-time event.
- **Visual Presentation:** MacBook Pro Command Deck view. Sub-second WebSocket stream lighting up Gate-Main-02. Cosine distribution curve displaying healthy verification cluster.
- **Core Message:** "Every verification updates the administrative deck across the campus within 300 milliseconds. Instant oversight, zero guesswork."

### Scene 4 (00:44 – 00:58): Connected Cryptographic Audit
- **Narrative Focus:** Non-repudiation cryptographic verification pipeline.
- **Visual Presentation:** Visual split-screen showing Guard approval generating an HMAC-SHA256 signature token (`sha256-7f4a...92b1`), binding guard, timestamp, and gate post key.
- **Core Message:** "Every admission is cryptographically sealed with hardware-backed HMAC-SHA256 signatures. Immutable audit records for total institutional forensic integrity."

### Scene 5 (00:58 – 01:05): Deployment Readiness
- **Narrative Focus:** Institutional trust, DPDP Act 2023 compliance, and deployment conclusion.
- **Visual Presentation:** Clean brand lockup, IIM Sambalpur pilot badge, version indicator (v1.0.0 Production Release), download CTA.
- **Core Message:** "Sovereign on-premise access control. Production ready. Welcome to GATEWISE AI."

---

## 1.5 High-Energy Motion Teaser Template (28.84 Seconds • 60 FPS)

Recreated directly from the user-uploaded template video (`64173585.mp4` / `media_1794382458736_56d85117.mp4`), preserving its exact electronic soundtrack, 60fps frame rate, scene timings, kinetic typography, and motion pacing while translating all visuals to GATEWISE AI branding:

```
+---------------------------------------------------------------------------------------------------+
| 00:00 - 02.27 | Scene 1: The Kinetic Hook — Edge Biometrics, GATEWISE Logo, Sub-300ms Pill        |
| 02.27 - 07.60 | Scene 2: Live Ingress Queue — Active Gate Cards & Pulsating Stadium Button Wave   |
| 07.60 - 13.10 | Scene 3: Sovereign Security Stack — 3D Cascading Deck with Animated Green Cursor |
| 13.10 - 15.43 | Scene 4: The Unified Platform Statement — Connect All Systems & 5 Orbiting Badges |
| 15.43 - 21.70 | Scene 5: Massive Metric Showcase — <300ms SLA & 5 Floating Sine-Wave Pills        |
| 21.70 - 25.00 | Scene 6: Constellation Perimeter Network — 6 Checkpoint Nodes in Connected Orbit  |
| 25.00 - 27.50 | Scene 7: Value Proposition & Call to Action — Dual Glowing Arches & Toggle Switch  |
| 27.50 - 28.84 | Scene 8: Brand Outro & Release Lockup — Emerald Shield Checkmark & IIM Sambalpur  |
+---------------------------------------------------------------------------------------------------+
```

- **Output Files:**
  - `gatewise-teaser-template.mp4` (4.50 MB, H.264 High Profile, 60 fps, 1920x1080)
  - `gatewise-teaser-template.webm` (7.66 MB, VP8, 60 fps, 1920x1080)
  - `gatewise-teaser.webp` (37 KB poster image)
- **Audio:** Original driving electronic soundtrack extracted from user template (`soundtrack.aac`) and perfectly muxed.
- **Renderer Script:** [`scripts/render_template_video.py`](file:///Users/pritambiswas/antigravity/NORVA/scripts/render_template_video.py)

---

## 2. Technical Encoding Specifications

### 2.1 Master File: `gatewise-overview.mp4`
- **Container:** MP4 (ISO/IEC 14496-14)
- **Video Stream:** H.264 / AVC (High Profile, Level 4.1)
- **Resolution:** 1920 × 1080 (16:9 widescreen)
- **Pixel Format:** `yuv420p` (maximum cross-device browser compatibility)
- **Frame Rate:** 30.00 fps constant
- **Bitrate:** ~830 kbps Average Bitrate (VBR)
- **Total Duration:** 65.0 seconds (1,950 frames)
- **File Size:** 6,760,928 bytes (~6.45 MB)
- **FastStart Enabled:** `+faststart` moov atom positioned at front for instant progressive streaming.

### 2.2 Open-Standard Fallback: `gatewise-overview.webm`
- **Container:** WebM
- **Video Stream:** VP8 codec
- **Resolution:** 1920 × 1080
- **Frame Rate:** 30.00 fps
- **File Size:** 7,552,410 bytes (~7.2 MB)
- **Purpose:** Native standards-compliant streaming for Chromium, Firefox, and Linux endpoints without proprietary patent encumbrance.

### 2.3 Standalone Demonstration Clips
1. **`guard-app-demo.mp4`**:
   - **Resolution:** 1080 × 1920 (9:16 vertical smartphone format)
   - **Duration:** 16 seconds (480 frames)
   - **File Size:** 324 KB
   - **Codec:** H.264 `yuv420p`
   - **Role:** Autoplay looping demonstration inside the Phone Mockup in Section A.

2. **`admin-portal-demo.mp4`**:
   - **Resolution:** 1920 × 1080 (16:9 desktop format)
   - **Duration:** 18 seconds (540 frames)
   - **File Size:** 6.06 MB
   - **Codec:** H.264 `yuv420p`
   - **Role:** Autoplay looping demonstration inside the Desktop Frame in Section B.

---

## 3. Accessibility & Multi-Modal Compliance

### 3.1 Synchronized Closed Captions (`gatewise-overview.vtt`)
Standard WebVTT format file mapped via `<track>` in Next.js:
```vtt
WEBVTT - GATEWISE AI Master Product Walkthrough Captions

00:00.000 --> 00:06.000
Institutional campus perimeters face high congestion during shift changes.

00:06.000 --> 00:12.000
GATEWISE AI combines sub-300ms verification with sovereign guard oversight.

00:12.000 --> 00:20.000
At Gate-Main-02, Officer Ramesh Verma points the ruggedized Android terminal.

00:20.000 --> 00:28.000
YuNet isolates facial landmarks in 28ms; SFace calculates a 128-D vector.

00:28.000 --> 00:36.000
Dr. Maya Sharma is matched at 0.984 cosine similarity with zero raw photos saved.

00:36.000 --> 00:44.000
Simultaneously, the central Admin Command Centre logs the entry via WebSocket.

00:44.000 --> 00:52.000
Every admission is cryptographically sealed with an HMAC-SHA256 signature.

00:52.000 --> 00:58.000
Even during network disconnects, local SQLite queues guarantee total continuity.

00:58.000 --> 01:05.000
GATEWISE AI 1.0: Sub-300ms SLA, 100% on-premise, enterprise sovereign privacy.
```

### 3.2 Machine-Readable Transcript (`transcript.txt`)
A plain-text document hosted at `/media/videos/transcript.txt` allows screen readers, search engine crawlers, and bandwidth-constrained users to review the complete walkthrough verbatim without loading video streams.

---

## 4. Privacy Verification & Production Sign-off

- [x] **Zero Real Biometric Data:** Verified. All face crops and coordinates synthesized in local memory.
- [x] **Zero Real Student PII:** Verified. Dr. Maya Sharma and Officer Ramesh Verma are synthetic personas.
- [x] **Audio Policy:** Video does not autoplay sound; audio tracks follow user gesture initiation.
- [x] **Reduced Motion Compliance:** Video respects CSS `prefers-reduced-motion` media queries.
- [x] **H.264 FastStart:** Moov atom shifted to file beginning for instant start on low-bandwidth connections.
