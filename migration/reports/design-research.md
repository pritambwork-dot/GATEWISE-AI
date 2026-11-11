# DISCOVERY REPORT: iOS 26 DESIGN RESEARCH & LIQUID GLASS GUIDANCE
**Agent:** `design_researcher`  
**Execution Mode:** Read-Only Discovery  
**Output Target:** `migration/reports/design-research.md`  
**Timestamp:** 2026-11-11T12:33:00+05:30  

---

### 1. Subject & Institutional Context

The application is an enterprise-grade security access control system for academic and research institutions (modeled on IIM Sambalpur). The visual tone must express:
- **Calm Authority**: Daylight canvas (`#F4F8F5`), restrained dark slate text (`#1E2D26`).
- **Precision**: Monospaced quantitative scores, clear high-contrast status pills.
- **Deference**: Content leads; chrome recedes into frosted translucency.

---

### 2. Apple iOS 26 Liquid Glass Architecture

Based on `heyparsadev/liquid-glass-skill` and Apple HIG:

1. **The Functional Layer (Controls & Navigation)**:
   - Elements that float above content opt into Liquid Glass:
     - Floating bottom tab bar (`AppTabBar` wrapped in `GlassEffectContainer`).
     - Floating Action Buttons (`.buttonStyle(.glassProminent)` for primary verify trigger).
     - Filter pill controls and top status indicators (`LiquidGlassPill`).
2. **The Content Layer (Information Cards & Lists)**:
   - Elements that scroll or present data must NEVER use glass:
     - Candidate Identity Cards (`AppCard` with solid `#FFFFFF` or `.regularMaterial`).
     - Verification Result details, visitor passes, and timeline rows.
     - Never put glass on top of glass.
3. **Typography & Legibility**:
   - San Francisco Pro at intentional weights: SF Symbols at medium/bold weight.
   - Text directly resting on glass surfaces is strictly `.primary` to guarantee WCAG AAA contrast (> 7:1).
   - Monospaced digits (`.monospacedDigit()`) for verification timers, similarity percentages, and pass codes.

---

### 3. Motion & Haptics System

- **Spring Curves**:
  - `MotionTokens.snappy`: `Animation.snappy(duration: 0.28)` for tab transitions and modal popovers.
  - `MotionTokens.bouncy`: `Animation.bouncy(duration: 0.45, extraBounce: 0.15)` for verification score reveals and progress ring completion.
- **Haptic Feedback**:
  - Selection changed feedback on tab bar clicks.
  - Success notification haptic on State A authorization.
  - Warning notification haptic on unauthorized / expired status.

---

### 4. Linter Verification Status

The entire SwiftUI codebase in `apps/ios/GatewiseGuard/Sources` was scanned using `check_glass.py`:
- Result: **0 errors, 0 warnings** (100% compliant with iOS 26 Liquid Glass rules).
