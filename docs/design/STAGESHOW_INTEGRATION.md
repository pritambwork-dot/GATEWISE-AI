# GATEWISE AI 1.0 — STAGESHOW INTEGRATION SPECIFICATION & REHEARSAL LEDGER
## Version 1.1.1 · Interactive Product Demonstrations · 5 Core Scenes · Rehearsal Verification

---

### Executive Summary

To present GATEWISE AI with Apple-level product craftsmanship, the **Stageshow** skill (version 1.1.1 from `benjitaylor/skills`) was integrated into the platform architecture. Rather than relying on static screenshots, generic dashboard templates, or ungrounded generative mockups, GATEWISE AI utilizes 5 authored interactive scenes adhering to the **14 Bento Rules**, the **Stageshow Craft and Framing Specifications**, and the **Act Motion APIs**.

---

### 1. Stageshow Skill Environment & Installation Record

| Attribute | Specification |
|---|---|
| **Skill Name** | `stageshow` |
| **Installed Version** | `1.1.1` |
| **Source Repository** | `https://github.com/benjitaylor/skills.git` |
| **Installation Path** | `/Users/pritambiswas/antigravity/NORVA/.agents/skills/stageshow` |
| **Kit Tokens** | `--ss-stage-shadow`, `--ss-card-shadow`, `--ss-satellite-shadow`, `--ss-cyan-glow` |
| **Interactive Showcase Route** | `http://localhost:3000/showcase` |
| **Public Landing Integration** | `http://localhost:3000/` (Hero Demo + 14-Rule Bento Grid) |

---

### 2. Scene-by-Scene Architecture & Gold Pattern Reference

#### Scene 1: Platform Overview (`device-pair`)
- **Reference Gold Pattern:** `device-pair` ("A dashboard and a lock screen telling one event; the phone straddles over margin, never over the figure").
- **Visual Composition:** An 8-column desktop Mac Command Centre window in daylight titanium/slate, straddled by a 4-column handheld Android Guard Terminal in obsidian titanium.
- **Story & Flow:**
  - Beat 1: Command Centre displays active station cluster (4 online gates, 1,420 scans).
  - Beat 2: Handheld terminal initiates biometric capture on candidate subject.
  - Beat 3: Handheld terminal records SFace 128-D cosine similarity (0.982) and transmits HMAC seal.
  - Beat 4 (Payoff): The Command Centre verification table updates dynamically to 1,421 scans without a full-page reload.
- **Word Restraint Budget:** Exactly 5 displayed strings in the focal frame; zero filler text.

#### Scene 2: Guard Verification (`phone-touch` / `hero-demo`)
- **Reference Gold Pattern:** `phone-touch` / `hero-demo` ("A card opens into its screen as one object, and the loop folds back").
- **Visual Composition:** Dedicated handheld mobile terminal with tactical viewfinder, corner brackets, and responsive face oval reticle.
- **Story & Flow:**
  - Beat 1: Viewfinder displays ambient lighting assessment (Optimal 91%).
  - Beat 2: Candidate face aligns within the dashed oval; reticle pulses amber as landmarks are detected.
  - Beat 3: Instant recognition match card resolves with candidate photo and identity (Dr. Elena Rostova, 98.4%).
  - Beat 4 (Payoff): Sovereign human guard taps tactile "Grant Passage" button, generating an HMAC-SHA256 signature.
- **Touch Target Verification:** All interactive controls maintain $\ge 48\text{dp}$ touch target compliance.

#### Scene 3: Live Administrative Activity (`choreography` / `payout-flow`)
- **Reference Gold Pattern:** `choreography` / `payout-flow` ("Slow overlapping arrivals, reading time, a payoff that holds").
- **Visual Composition:** Streamlined telemetry activity feed with real-time arrival animations and cryptographic badge verification.
- **Story & Flow:**
  - Beat 1: Ambient stream displays recent verifications with soft hairline connectors.
  - Beat 2: New scan arrival slides down with a 240ms ease-out spring curve.
  - Beat 3: Status chip transitions from pending evaluation to `VERIFIED_AUTHORIZED`.
  - Beat 4 (Payoff): Audit hash expands to reveal cryptographic non-repudiation proof (`STATUS: VALID`).

#### Scene 4: Field Enrollment Review (`panel-annotation` / `static-card`)
- **Reference Gold Pattern:** `panel-annotation` / `static-card` ("A settings panel over the product's margin, one leader from the setting to what it changed").
- **Visual Composition:** Master-detail split pane inspired by iPadOS Photos/Mail, presenting candidate photo crop, quality metrics, and clearance options.
- **Story & Flow:**
  - Beat 1: Left master list highlights pending field referral with amber indicator.
  - Beat 2: Detail pane expands subject metadata, quality assessment (92%), and referring officer ID.
  - Beat 3: Administrator selects clearance tier ("Level 2 — Academic Zones").
  - Beat 4 (Payoff): "Approve & Index Vector" commits the embedding to SQLite vector database with permanent audit entry.

#### Scene 5: Gatewise AI Security Intelligence (`ai-cards` / `ai-chat`)
- **Reference Gold Pattern:** `ai-cards` / `ai-chat` ("The question sent, Thinking, the answer streaming in with its height, sources last; no sparkles, no purple").
- **Visual Composition:** Clean conversational stream with structured analytical response cards rather than unformatted chat bubbles.
- **Story & Flow:**
  - Beat 1: Administrator submits natural language query ("Show exceptions at West Gate in last 2 hours").
  - Beat 2: Thinking indicator displays model inference on OpenCV and backend logs.
  - Beat 3: Structured card renders with KPI metrics (284 evaluated scans, 98.9% auto-admit, 3 exceptions).
  - Beat 4 (Payoff): Security recommendation synthesized with actionable verdict and zero hallucination.

---

### 3. Stageshow Rehearsal Ledger & Gate Verification

```
Stageshow Rehearsal Audit Matrix (60 FPS / GPU Canvas)
================================================================================
Scene 1: Platform Overview       [PASS]  1100w desktop / 390w compact verified
Scene 2: Guard Verification      [PASS]  Tactile reticle / 48dp targets validated
Scene 3: Live Telemetry          [PASS]  Choreographed spring timing 240ms ease-out
Scene 4: Enrollment Review       [PASS]  Master-detail clearance 12px verified
Scene 5: AI Intelligence         [PASS]  Structured output card / zero purple/sparkles
================================================================================
VERDICT: --gate rehearsal passed (0 faults, 0 wrapping units, 0 unmeasured rects)
```

---

### 4. Code Locations & Implementation References

1. **Interactive Showcase Route:** [`apps/web/app/(public)/showcase/page.tsx`](file:///Users/pritambiswas/antigravity/NORVA/apps/web/app/(public)/showcase/page.tsx)
2. **Public Landing Hero Demo & Bento:** [`apps/web/app/(public)/page.tsx`](file:///Users/pritambiswas/antigravity/NORVA/apps/web/app/(public)/page.tsx)
3. **Public Navigation Bar Link:** [`apps/web/app/(public)/layout.tsx`](file:///Users/pritambiswas/antigravity/NORVA/apps/web/app/(public)/layout.tsx)
4. **Stageshow Style & Reticle Tokens:** [`apps/web/app/globals.css`](file:///Users/pritambiswas/antigravity/NORVA/apps/web/app/globals.css)
5. **Mobile Viewfinder Reticle:** [`apps/mobile/app/(guard)/verify/camera.tsx`](file:///Users/pritambiswas/antigravity/NORVA/apps/mobile/app/(guard)/verify/camera.tsx)
