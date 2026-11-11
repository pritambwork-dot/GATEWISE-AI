# GATEWISE AI — COMPONENT LIBRARY SPECIFICATION
**Standardized Component Anatomy & Guidelines across Web and Mobile**  
*Design System: GATEWISE AI 2.0*  
*Architecture: React / Next.js / Tailwind CSS (Web) & React Native / Expo (Mobile)*

---

## 1. Web & Desktop Component Standards

### 1.1 Buttons (`Button`)
- **Primary**: Full-bleed `#00685B`, text `#FFFFFF` font-semibold, radius `10px`, height `38px`, padding `0 16px`. On hover: lifts `-1px`, background `#004D43`, shadow subtle.
- **Secondary**: Background `#FFFFFF`, border `1px solid rgba(0,0,0,0.1)`, text `#19221E`. On hover: background `#F4F8F5`.
- **Ghost**: Background `transparent`, text `#616E68`. On hover: background `rgba(0,0,0,0.04)`, text `#19221E`.
- **Destructive**: Background `#C85B57`, text `#FFFFFF`. Requires confirmation sheet for consequential actions.

### 1.2 Form Fields (`Field`, `Input`)
- **Container**: Border `1px solid rgba(0,0,0,0.12)`, radius `10px`, background `#FFFFFF`, height `40px`, padding `0 12px`.
- **Focus Ring**: `box-shadow: 0 0 0 2px rgba(0, 104, 91, 0.25)`, border `#00685B`.
- **Label**: Font-size `12px`, font-medium, color `#616E68`, margin-bottom `6px`.
- **Error State**: Border `#C85B57`, text `#C85B57`, error message rendered with icon directly below field with `4px` gap.

### 1.3 Data Tables (`Table`)
- **Header**: Height `36px`, background `#EDF4EF`, font-size `11px`, font-bold, uppercase tracking `+0.04em`, text `#616E68`.
- **Row**: Height `52px`, border-bottom `1px solid rgba(0,0,0,0.05)`, padding `0 16px`.
- **Hover State**: Background `rgba(0, 104, 91, 0.02)`.
- **Action Lane**: Sticky right column with subtle gradient mask for overflow.

### 1.4 Status Badges (`Badge`, `Tag`)
- **Verified / Authorized**: Background `rgba(37, 135, 93, 0.12)`, border `1px solid rgba(37, 135, 93, 0.25)`, text `#1E6B4B`, font-semibold, radius `9999px`. Includes 6px solid emerald dot.
- **Potential Match / Review**: Background `rgba(207, 152, 62, 0.12)`, border `1px solid rgba(207, 152, 62, 0.25)`, text `#8C631F`.
- **Denied / Exception**: Background `rgba(200, 91, 87, 0.12)`, border `1px solid rgba(200, 91, 87, 0.25)`, text `#992E2A`.

### 1.5 Side Drawers & Sheets (`Drawer`)
- **Width**: `480px` (Desktop), `100vw` (Mobile).
- **Backdrop**: `rgba(25, 34, 30, 0.35)` with `backdrop-blur-sm`.
- **Header**: Sticky 56px bar with title, breadcrumb, and close button (`Esc` key supported).

---

## 2. Mobile Guard Component Standards (Android Native)

### 2.1 Viewfinder Frame (`CameraViewfinder`)
- **Geometry**: Aspect ratio 4:3 or 16:9, rounded corners `20dp`.
- **Corner Reticles**: 4 corner L-brackets in `#25875D`, stroke width `3dp`, length `20dp`.
- **Guidance Pill**: Floating top chip: `Align Face Within Frame • Single-Shot Mode`.
- **Shutter Trigger**: 72dp circular tactile button in `#00685B` with white inner ring.

### 2.2 Decoupled Result Cards (`VerificationResultCard`)
- **Two-Tier Layout**:
  - **Upper Tier (Identity Match)**: Candidate photo, full name, role, candidate cosine score (`98.4% Match`).
  - **Lower Tier (Clearance State)**: Specific gate access permission (`North Gate 01: PERMITTED`).
- **Sovereign Action Triggers**:
  - `GRANT ENTRY`: Green primary button (min touch height `48dp`).
  - `REFER TO VISITOR DESK`: Secondary button.

---

## 3. Stageshow Showcase Atoms (`Stage`, `Window`, `Satellite`)

- **Stageshow Window Chrome**: 38px titlebar, macOS traffic lights, active URL / telemetry pill.
- **Stageshow Straddling Satellite Card**: `position: absolute`, bottom right, shadow stage, live cryptographic digest ticker.
- **Tactical Cursor**: Optical cursor with click ring and typing indicator for authored feature walkthroughs.
