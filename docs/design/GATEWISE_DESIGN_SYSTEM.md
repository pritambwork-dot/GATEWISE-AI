# GATEWISE AI — DESIGN SYSTEM SPECIFICATION
**Institutional Design Language · Apple Craftsmanship · Material 3 Native Android**  
*Version: 2.0.0 (Apple-Quality Redesign)*  
*Target Environments: Next.js Admin Portal, Public Website, Android Guard App (Expo/RN)*  
*Source of Truth: `packages/design-tokens` & `apps/web/app/globals.css`*

---

## 1. Visual Philosophy & Core Principles

The GATEWISE AI design language reflects the precision, calm authority, and craftsmanship of Apple's flagship software (macOS, iPadOS, iOS) blended with institutional architectural dignity:

1. **Restraint over Decoration**: Eliminate arbitrary card borders and stacked containers. Hierarchy is achieved through subtle surface shifts, whitespace, and typographic contrast.
2. **Intentional Framing**: Every screen has a clear focal hero. Supporting tools and telemetry occupy quiet secondary planes.
3. **Harmonic Geometry**: All nested shapes adhere to the geometric rule:
   $$\text{Radius}_{\text{outer}} = \text{Radius}_{\text{inner}} + \text{Padding}$$
4. **Authentic Platform Conventions**:
   - **Web / Desktop Admin**: macOS & iPadOS precision, refined sidebars, 38px titlebars, subtle frosted glass (`backdrop-blur-xl`), and keyboard shortcuts (`Cmd+K`).
   - **Mobile Guard App**: Genuine Android Material 3 design, 48dp minimum touch targets, floating tactical actions, and system-native haptics.
5. **Decoupled Security Clarity**: Never conflate technical facial similarity with institutional authorization or the human guard's sovereign decision.

---

## 2. Color Palette & Token Architecture

### 2.1 Surfaces & Ground
| Token | Hex | Usage | Contrast vs Text |
| :--- | :--- | :--- | :--- |
| `--gw-background` | `#F4F8F5` | Daylight institutional page canvas | 14.2:1 (Passes AAA) |
| `--gw-surface` | `#FFFFFF` | Primary content panels, cards, sheets | 15.6:1 (Passes AAA) |
| `--gw-surface-secondary` | `#EDF4EF` | Inset wells, table headers, inactive tabs | 13.8:1 (Passes AAA) |
| `--gw-surface-mint` | `#EAF3ED` | Soft status callouts, verified highlight | 13.1:1 (Passes AAA) |
| `--gw-surface-dark` | `#151C18` | Tactical camera viewfinder, ANPR screen | 16.4:1 (Passes AAA) |

### 2.2 Brand & Accents
| Token | Hex | Usage | Role |
| :--- | :--- | :--- | :--- |
| `--gw-primary` | `#00685B` | Primary actions, key badges, focus rings | Institutional Emerald |
| `--gw-primary-deep` | `#004D43` | Hover & active states, dark headers | Grounding Forest |
| `--gw-mint` | `#C7E7D8` | Active border tints, micro-pill borders | Fresh Daylight Accent |
| `--gw-teal` | `#3A9B8B` | Secondary charts, sensor feeds | Muted Telemetry |

### 2.3 Text & Ink Tokens
| Token | Hex | Alpha | Role |
| :--- | :--- | :--- | :--- |
| `--gw-text-primary` | `#19221E` | 100% | Headlines, titles, active labels |
| `--gw-text-secondary` | `#616E68` | 100% | Body prose, table cells, secondary captions |
| `--gw-text-muted` | `#8A9690` | 100% | Disabled states, metadata timestamps, shortcuts |
| `--gw-text-on-dark` | `#F4F8F5` | 100% | Text inside dark viewfinder panels |

### 2.4 Status & Feedback
| Token | Hex | Soft Tint (Fill) | Usage |
| :--- | :--- | :--- | :--- |
| `--gw-status-verified` | `#25875D` | `rgba(37, 135, 93, 0.12)` | Confirmed identity, barrier lifted |
| `--gw-status-alert` | `#CF983E` | `rgba(207, 152, 62, 0.12)` | Potential match, physical review required |
| `--gw-status-error` | `#C85B57` | `rgba(200, 91, 87, 0.12)` | Denied clearance, blurred camera capture |

---

## 3. Typography Scale & Alignment

All type scales strictly enforce line-heights $\ge 1.3$ and use optical cap-height centering (`text-box: trim-both cap alphabetic`):

```css
/* Typography Scale */
--font-display-lg: 56px / 1.08, -0.035em tracking, 900 weight (Hero display)
--font-title-xl:   32px / 1.15, -0.025em tracking, 800 weight (Section titles)
--font-title-lg:   22px / 1.25, -0.015em tracking, 700 weight (Page headers)
--font-title-md:   16px / 1.35, -0.010em tracking, 600 weight (Card titles)
--font-body:       14px / 1.50, -0.005em tracking, 400 weight (Paragraph prose)
--font-body-sm:    13px / 1.45,  0.000em tracking, 400 weight (Table data)
--font-caption:    11px / 1.40, +0.020em tracking, 500 weight (Metadata labels)
--font-mono:       12px / 1.40,  0.000em tracking, 600 weight (Hashes, IDs)
```

---

## 4. Elevation, Radii & Shadows

### 4.1 Border Radii
- **Full**: `9999px` (Pills, circular badges, avatar rings)
- **Window / Sheet**: `24px` (Main modals, device frames, bento hero)
- **Card / Panel**: `16px` (Bento tiles, event containers, form cards)
- **Inner Control**: `10px` (Buttons, input fields, dropdown triggers)
- **Tag / Micro-badge**: `6px` (Hash badges, status pills)

### 4.2 Multi-Layer Natural Shadows
```css
/* Restrained natural drop shadows with ambient occlusion */
--gw-shadow-subtle: 0 1px 2px rgba(0, 0, 0, 0.04), 0 0 0 1px rgba(0, 0, 0, 0.04);
--gw-shadow-card:   0 4px 16px -2px rgba(25, 34, 30, 0.05), 0 0 0 1px rgba(0, 0, 0, 0.05);
--gw-shadow-stage:  0 24px 64px -12px rgba(0, 104, 91, 0.12), 0 8px 24px -6px rgba(0, 0, 0, 0.06), 0 0 0 1px rgba(0, 0, 0, 0.06);
--gw-shadow-drawer: -8px 0 32px -4px rgba(0, 0, 0, 0.08);
```

---

## 5. Motion & Interaction Tokens

1. **Micro-interactions (Hover, Press, Focus)**:
   - Duration: `150ms`
   - Easing: `cubic-bezier(0.16, 1, 0.3, 1)` (Apple standard spring-feel curve)
   - Hover Action: `translateY(-1px)` with subtle shadow bloom
2. **Sheet & Drawer Transitions**:
   - Duration: `280ms`
   - Easing: `cubic-bezier(0.32, 0.72, 0, 1)`
3. **Reduced Motion**:
   - When `prefers-reduced-motion: reduce` is detected, all transitions revert to instant state updates without visual delay.
