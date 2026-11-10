# GATEWISE AI — Android Guard Application Specification
Version 3.0.0 · Master Android Native Experience & Complete Engineering Handoff

---

## 1. Executive Summary & Product Scope

**GATEWISE AI** is a mission-critical institutional gate verification and visitor identity platform engineered for high-consequence educational environments (such as IIM Sambalpur).

The mobile application is deployed onto ruggedized or institutional Android smartphones operated by security guards at physical campus gates. 

The application operates on an uncompromising principle: **AI assists the guard; it never replaces human judgment, institutional policy, or deterministic authority.**

Guards are empowered to:
1. Capture still images manually via the rear device camera.
2. Submit the capture for edge-assisted face detection and reference-photo matching (YuNet + SFace via secure on-premise backend).
3. Review separate, unambiguous results for **Identity Match** vs. **Access Authorization**.
4. Perform human visual comparison between live capture and approved institutional reference records.
5. Record explicit, auditable gate decisions (**Grant Entry**, **Deny Entry**, **Escalate to Admin**).

**Security Boundary**: Security guards CANNOT create, approve, or edit permanent institutional identities. All identity registration is strictly restricted to authorized administrators via the central portal.

---

## 2. Visual Identity & Design Tokens

The mobile application utilizes the established GATEWISE AI daylight palette:

| Token | Hex | Role in Mobile Application |
|---|---|---|
| `bg-main` | `#F4F8F5` | Natural pale campus backdrop, calm on the eyes during 8-hour shifts |
| `surface-primary` | `#FFFFFF` | Elevated cards, bottom sheets, camera control containers |
| `surface-secondary`| `#EDF4EF` | Neutral pill badges, alternate list item backgrounds, retake buttons |
| `brand-light` | `#DDF0E2` | Active navigation pill backgrounds, verified status badges |
| `brand-mint` | `#C7E7D8` | Reticle corner guides, ambient light feedback bars |
| `brand-primary` | `#23865D` | Primary action buttons ("Start Verification", "Grant Entry", "Sign In") |
| `brand-deep` | `#176346` | Header typography, active bottom navigation icons, lock badges |
| `accent-teal` | `#3A9B8B` | System latency metrics, gate connection dots, auxiliary data |
| `text-primary` | `#1E2D26` | High-contrast body text, student/visitor names, headers |
| `text-secondary` | `#65756C` | Department subtitles, roll numbers, gate timestamps |
| `text-muted` | `#95A39A` | Unselected tab labels, inactive placeholders |
| `border-subtle` | `#E2EBE4` | Clean 1px hairlines separating cards and list items |
| `status-success` | `#26865E` | Verified identity badge, active clearance indicator |
| `status-warning` | `#CF983E` | Potential match, expired pass, administrator review pending |
| `status-error` | `#C85B57` | Unauthorized entry, gate denial button, connection failure |

**Strict Anti-Patterns**: Dark themes, cyberpunk neons, futuristic HUDs, glowing halos, continuous background video scanning.

---

## 3. Mobile Typography (iOS Craftsmanship on Android)

System Font Stack: `Inter`, `Geist Sans`, or Android System `Roboto`/`-apple-system`.

| Style | Size | Line Height | Weight | Tracking | Usage |
|---|---|---|---|---|---|
| Screen Title | 24px | 28px | 700 / Bold | -0.02em | Verify Home Header, Verification Title |
| Section Header | 18px | 24px | 600 / SemiBold | -0.01em | Person Name, Card Titles, Dialog Headers |
| Primary Body | 15px | 22px | 500 / Medium | 0.00em | Form inputs, status labels, card details |
| Secondary Body| 13px | 18px | 400 / Regular | +0.01em | Department metadata, timestamps, instructions |
| Caption / Chip | 11px | 14px | 600 / SemiBold | +0.02em | Gate tags, match confidence chips, badges |
| Code / Monospace| 12px | 16px | 500 / Mono | +0.03em | Student Roll Numbers (`STU-2024-0492`), Checksums |

---

## 4. Mobile Component Standards & Touch Geometry

All interactive targets strictly adhere to human ergonomics and one-handed gate operation:

- **Minimum Touch Target**: `48dp × 48dp` across all interactive elements.
- **Primary Action Buttons**: Height `54dp`, full-width with `16dp` horizontal margins, `12dp` border-radius (`#23865D` solid background, `#FFFFFF` text).
- **Camera Shutter Button**: Diameter `68dp` floating ring with `56dp` inner tactile circle.
- **Card Radii**: `16dp` for large containers, `12dp` for sub-cards, `9999dp` for status pills.
- **Bottom Navigation Bar**: Fixed height `64dp` + system safe-area insets. Exactly 4 destinations:
  1. `Verify` (Default active tab)
  2. `Activity` (Recent gate history)
  3. `Visitors` (Visitor passes & check-in)
  4. `Profile` (Guard station status & credentials)

---

## 5. Complete Verification State Machine (The 7 Core States)

| State | Match Confidence | Institutional Authorization | Badge Color | Primary Guard Action | Secondary Action |
|---|---|---|---|---|---|
| **A. Verified Identity & Authorized** | Match $\ge 90\%$ | Active Clearance | Green (`#26865E`) | Grant Entry (`#23865D`) | Deny / Manual Check |
| **B. Identified But Not Authorized** | Match $\ge 90\%$ | Inactive / Gate Restriction | Crimson (`#C85B57`) | Deny Entry (`#C85B57`) | Escalate to Admin |
| **C. Potential Match (Ambiguous)** | Candidate $70-89\%$ | Pending Visual Check | Amber (`#CF983E`) | Verify Physical ID | Retake Photograph |
| **D. Unknown Person (No Match)** | No Match $< 70\%$ | No Record Found | Slate / Neutral (`#65756C`) | Request Admin Review | Start Visitor Intake |
| **E. Image Quality Insufficient** | Inconclusive | Inconclusive | Amber (`#CF983E`) | Retake Photograph | Manual Protocol |
| **F. Authorization Expired** | Match $\ge 90\%$ | Expired Past Date | Amber/Crimson (`#CF983E`) | Deny Entry | Escalate Clearance |
| **G. Service / Offline Mode** | Network Disconnected | Offline Local Fallback | Teal/Amber (`#3A9B8B`) | Check Physical ID Pass | Retry Connection |

---

## 6. End-to-End Interactive User Flows

1. **Normal Entry Flow**:
   - `Guard Login` $\to$ `Verify Home` $\to$ Tap `Start Verification` $\to$ `Camera Viewfinder` $\to$ Shutter Press $\to$ `Capture Review` $\to$ `Processing (7 Stages)` $\to$ `State A: Verified Identity & Active Authorization` $\to$ Guard reviews side-by-side $\to$ Taps `Grant Entry` $\to$ `Event Logged Confirmation` $\to$ Auto-reset to `Verify Home`.
2. **Identified But Unauthorized Flow**:
   - `Camera` $\to$ `Processing` $\to$ `State B: Identified But Not Authorized` (e.g., student curfew violation or restricted gate) $\to$ Guard taps `Deny Entry` with reason code $\to$ `Event Logged`.
3. **Unknown Person Escalation Flow**:
   - `Camera` $\to$ `Processing` $\to$ `State D: Unknown Person (No Match)` $\to$ Guard taps `Request Administrator Review` $\to$ Capture and gate metadata submitted to admin dashboard $\to$ Confirmation receipt.
4. **Visitor Intake Flow**:
   - `Visitors Tab` OR `State D: Start Visitor Verification` $\to$ `Visitor Intake Bottom Sheet` $\to$ Enter Visitor Name, Host Faculty, Purpose, Phone $\to$ Issue Temporary Digital Pass $\to$ `Pass Generated & Check-In Recorded`.
5. **Quality Insufficient Retake Flow**:
   - `Camera` $\to$ `Processing` $\to$ `State E: Image Quality Insufficient` (motion blur / backlighting diagnostic) $\to$ Guard taps `Retake Photograph` $\to$ `Camera Active`.
6. **Offline Emergency Flow**:
   - Network failure $\to$ `State G: Verification Service Offline` $\to$ Tap `Execute Approved Manual Verification Procedure` $\to$ Manual verification checklist.
7. **Activity Inspection Flow**:
   - `Activity Tab` $\to$ Filter by Today / All / Flagged $\to$ Tap any verification event card $\to$ `Event Details Deep Audit Sheet`.
8. **Profile & Handover Flow**:
   - `Profile Tab` $\to$ Review locked assigned gate (*Main Campus Gate — Terminal 02*) $\to$ Review shift hours $\to$ Tap `Handover Shift / End Session` $\to$ Confirmation dialog $\to$ `Guard Login`.

---

## 7. Developer Handoff Architecture (Expo & React Native)

```
/src
  /navigation
    AppNavigator.tsx        # BottomTabNavigator (Verify, Activity, Visitors, Profile)
    AuthNavigator.tsx       # Login stack
  /screens
    /auth
      LoginScreen.tsx       # Guard credentials & terminal initialization
    /verify
      VerifyHomeScreen.tsx  # Station status, quick start, today's throughput
      CameraScreen.tsx      # Expo Camera viewfinder, face reticle, manual capture
      ReviewScreen.tsx      # Pre-submission visual review & quality check
      ProcessingScreen.tsx  # 7-stage step progress indicator
      ResultScreen.tsx      # Dynamic rendering of States A through G
      DecisionConfirmationScreen.tsx # Event receipt & next verification trigger
    /activity
      ActivityScreen.tsx    # Chronological gate event log with filters
      EventDetailModal.tsx  # Cryptographic audit details & guard signature
    /visitors
      VisitorsScreen.tsx    # Pre-approved visitor passes list
      VisitorIntakeModal.tsx# Walk-in guest registration form
    /profile
      ProfileScreen.tsx     # Guard identity, locked gate assignment, shift logout
  /components
    Button.tsx              # Standard 54dp primary, secondary, destructive
    Badge.tsx               # Pill status badges (Success, Warning, Error, Info)
    Card.tsx                # White 16dp rounded card with #E2EBE4 border
    FaceReticle.tsx         # Camera centering guide with ambient light feedback
    PhotoComparison.tsx     # Side-by-side live vs reference display
  /constants
    Colors.ts               # Gatewise light palette tokens
    Typography.ts           # Inter / Geist font styles
```
