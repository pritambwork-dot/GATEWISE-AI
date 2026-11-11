# CONTRACT: iOS 26 LIQUID GLASS & DESIGN TOKENS
**Status:** Frozen  
**Lead Orchestrator:** Lead Agent  
**Date:** 2026-11-11  

---

### 1. Palette Contract

- Canvas Background: `#F4F8F5` (`ColorTokens.canvas`)
- Surface Light: `#FFFFFF` (`ColorTokens.surface`)
- Surface Secondary: `#EDF4EF` (`ColorTokens.surfaceSecondary`)
- Brand Primary: `#23865D` (`ColorTokens.brandPrimary`)
- Brand Deep: `#176346` (`ColorTokens.brandDeep`)
- Brand Mint: `#C7E7D8` (`ColorTokens.brandMint`)
- Text Primary: `#1E2D26` (`ColorTokens.textPrimary`)
- Status Success: `#26865E`, Warning: `#CF983E`, Error: `#C85B57`, Info: `#3A9B8B`

---

### 2. Liquid Glass Rules

- **Functional Layer**:
  - `AppTabBar`: Floating bottom capsule with `.ultraThinMaterial` and hairline glass border.
  - `StatusBadge`: Live online pulse indicator.
  - Floating action buttons: `.buttonStyle(.glassProminent)` for verification trigger.
- **Content Layer**:
  - `AppCard`: Solid `#FFFFFF` or `.regularMaterial` with continuous superellipse corners.
  - Zero glass on information cards, list rows, or tables.

---

### 3. Motion & Haptic Tokens

- Springs: `MotionTokens.snappy` (0.28s), `MotionTokens.bouncy` (0.45s, 0.15 bounce).
- Haptics: Selection changed on tabs; success notification on admitted; warning on unauthorized.
