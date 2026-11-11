# GATEWISE AI — Premium Mobile Design System
## iOS Craftsmanship Engineered for Android (`@gatewise/design-tokens` & `@gatewise/mobile`)

### 1. Design Philosophy: Institutional Daylight Elegance
The GATEWISE Guard visual experience is built upon the principle of **Daylight Institutional Elegance**. Unlike generic SaaS dark-mode dashboards or sterile enterprise forms, the interface communicates calm authority, transparency, and high physical legibility under challenging outdoor lighting conditions (e.g. bright sunlight at outdoor guard gates).

The experience mirrors the precision, fluid transitions, and typography of Apple's flagship iOS applications, implemented natively using Android Material 3 foundations.

---

### 2. Color Palette & Semantic Roles

```
┌────────────────────────────────────────────────────────────────────────┐
│                        DAYLIGHT BACKGROUND MATRIX                      │
│                                                                        │
│   #F4F8F5 (Main Canvas)   #FFFFFF (Card Surface)   #EDF4EF (Secondary) │
└────────────────────────────────────────────────────────────────────────┘
```

| Token Name | Hex Value | Semantic Role & Context |
| :--- | :--- | :--- |
| `Colors.background` | `#F4F8F5` | Daylight main application canvas; prevents glare and eye fatigue. |
| `Colors.surface` | `#FFFFFF` | Primary elevated card surface; contains form inputs and action cards. |
| `Colors.surfaceSecondary` | `#EDF4EF` | Subtle grouping background; used for secondary cards and pills. |
| `Colors.primary` | `#23865D` | Primary institutional green; primary buttons, active tabs, checkmarks. |
| `Colors.deep` | `#176346` | Deep institutional forest green; brand logos, headers, station icons. |
| `Colors.lightGreen` | `#DDF0E2` | Soft green tint for avatar backgrounds, shield icons, and focus rings. |
| `Colors.mint` | `#C7E7D8` | High-visibility accent; reticle corner brackets and active borders. |
| `Colors.teal` | `#3A9B8B` | Restrained secondary accent for telemetry status and informational tags. |
| `Colors.textPrimary` | `#1E2D26` | High-contrast dark green-slate for primary titles and readable body text. |
| `Colors.textSecondary` | `#65756C` | Neutral slate for descriptive copy, timestamps, and input labels. |
| `Colors.textMuted` | `#95A39A` | Subtle gray for disabled text, icon hints, and helper footers. |
| `Colors.borderSubtle` | `#E2EBE4` | 1dp boundary for surface cards and daylight dividers. |
| `Colors.borderMedium` | `#C8D9CD` | 1.5dp boundary for interactive inputs and category badges. |
| `Colors.borderStrong` | `#8FA998` | 2dp high-contrast border for selected cards and active focus states. |
| `Colors.success` | `#26865E` | Verified identity, authorized clearance, gate unlocked. |
| `Colors.warning` | `#CF983E` | Potential match (70-89%), expired passes, manual inspection required. |
| `Colors.error` | `#C85B57` | Unauthorized access, denied entry, camera hardware errors. |
| `Colors.info` | `#3A9B8B` | System telemetry, offline standby, technical support notices. |

---

### 3. Spacing Scale & Touch Targets

The design system enforces an 8-point base grid (with 4-point micro-adjustments) to ensure rhythm and geometric balance across all Android screen densities:

```
xxs: 2dp  │ xs: 4dp   │ sm: 8dp    │ md: 12dp   │ base: 16dp
lg:  20dp │ xl: 24dp  │ 2xl: 32dp  │ 3xl: 40dp  │ 4xl:  48dp
```

#### Accessibility Guarantee: 48dp Minimum Touch Target
In strict adherence to WCAG 2.1 AA and Android Accessibility Guidelines, all interactive triggers (buttons, icons, checkboxes, and list items) enforce a minimum hit target dimension of **48 × 48 dp**:

```typescript
export const Spacing = {
  // ... base spacing
  minTouchTarget: 48,
} as const;
```

---

### 4. Typography Scale

The typographic hierarchy prioritizes rapid scanning by security officers wearing tactical gloves or viewing handheld devices at arm's length:

| Style Variant | Size | Weight | Line Height | Usage |
| :--- | :--- | :--- | :--- | :--- |
| `Typography.titleLarge` | 24 sp | 700 (Bold) | 30 sp | Main application branding, onboarding headlines. |
| `Typography.titleMedium` | 20 sp | 700 (Bold) | 26 sp | Screen titles, subject names in result cards. |
| `Typography.titleSmall` | 16 sp | 600 (SemiBold) | 22 sp | Section headers, card titles, dialog titles. |
| `Typography.headline` | 15 sp | 700 (Bold) | 20 sp | Action button labels, alert banners. |
| `Typography.body` | 14 sp | 400 (Regular) | 20 sp | General body paragraphs, orientation descriptions. |
| `Typography.bodyMedium` | 14 sp | 500 (Medium) | 20 sp | Secondary action copy, checklist points. |
| `Typography.caption` | 12 sp | 400 (Regular) | 16 sp | Subtitles, input hints, system status notes. |
| `Typography.captionBold` | 12 sp | 700 (Bold) | 16 sp | Key-value labels, telemetry values. |
| `Typography.badge` | 11 sp | 800 (ExtraBold)| 14 sp | Category badges, step counts, state indicators. |

---

### 5. Geometry & Elevation System

```
Border Radius Scale:
sm: 4dp  │ md: 8dp  │ lg: 12dp  │ xl: 16dp  │ 2xl: 20dp  │ 3xl: 24dp  │ full: 9999dp
```

#### Elevation Tokens (Material 3 Soft Shadowing)
Rather than harsh black drop shadows, surfaces utilize a daylight ambient shadow with a hint of deep forest tint:

```typescript
// SurfaceCard Elevated Shadow Specification
shadowColor: '#176346',
shadowOffset: { width: 0, height: 2 },
shadowOpacity: 0.08,
shadowRadius: 8,
elevation: 3, // Android Hardware Render Target
```

---

### 6. Component Specifications

#### 6.1 `PrimaryButton`
- **Height:** 48dp minimum.
- **Background:** `Colors.primary` (`#23865D`).
- **Text Color:** `#FFFFFF` (15sp Bold, centered).
- **Icon:** Optional left-aligned 20dp Ionicons glyph.
- **Loading State:** Inlined `<ActivityIndicator size="small" color="#FFFFFF" />`.
- **Active Opacity:** `0.85` with `Vibration.vibrate(25)`.

#### 6.2 `SecondaryButton`
- **Variants:**
  - `soft`: Background `#E8F5EE`, text `Colors.deep` (`#176346`).
  - `outline`: Background transparent, border 1.5dp `Colors.borderMedium`, text `Colors.deep`.
  - `ghost`: Background transparent, zero border, text `Colors.textSecondary`.

#### 6.3 `StationTelemetryBar`
- **Context:** Fixed header banner indicating active post name (`Main Campus Gate · Post 02`), active officer name (`Officer Ramesh Verma`), shift schedule (`Shift A: 06:00 - 14:00`), and live cluster connection status (`CONNECTED`).

#### 6.4 `CryptographicSealBadge`
- **Visual Design:** Translucent mint card with embedded shield icon, displaying the 64-character HMAC-SHA256 non-repudiation signature in monospace font with timestamp and verified lock icon.

---

### 7. Interaction System & Motion Principles
1. **Immediate Feedback:** Every press provides tactile feedback via Android vibration motors (`20-30 ms` duration).
2. **Restrained Transitions:** Avoids excessive bouncy animations; uses subtle fades and linear transforms (`150-250 ms`).
3. **Reduced Motion Compliance:** Respects OS-level accessibility setting; falls back to instantaneous cross-fades when requested by the user.
4. **Android Native Identity:** Never renders artificial iOS Dynamic Islands, fake iOS Home Indicators, or iOS system dialogs. The app is unmistakably Android with Apple-grade polish.
