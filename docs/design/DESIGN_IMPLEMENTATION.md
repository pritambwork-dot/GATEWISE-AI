# GATEWISE AI 1.0 — Design System Implementation & Stitch Mapping
**Document ID:** `DESIGN-IMPL-2026-11-10`  
**Source of Truth:** Google Stitch Project `8400330389051989963`

---

## 1. Approved Institutional Palette & Design Tokens

Implemented in `packages/design-tokens/src/index.ts` and configured across Tailwind and React Native:

| Token Name | Hex Code | Visual Role | Applied In Web / Mobile |
|---|---|---|---|
| `bg-main` | `#F4F8F5` | Primary canvas background | `bg-background`, Screen root |
| `surface-primary` | `#FFFFFF` | Elevated cards, dialogs, inputs | `bg-white`, Card containers |
| `surface-secondary` | `#EDF4EF` | Neutral pill badges, subtle bars | `bg-background-secondary` |
| `brand-light` | `#DDF0E2` | Verified status chip backgrounds | Navigation active chips, badges |
| `brand-mint` | `#C7E7D8` | Viewfinder guide accents | Reticle guides, light meters |
| `brand-primary` | `#23865D` | Main CTA button, active elements | Primary buttons, active state |
| `brand-deep` | `#176346` | Header typography, locked badges | Top navigation title, icons |
| `accent-teal` | `#3A9B8B` | System telemetry, connection dots | Latency badges, data chips |
| `text-primary` | `#1E2D26` | High-contrast body, student names | Heading & high-emphasis text |
| `text-secondary` | `#65756C` | Subtitles, roll numbers, times | Subtitles & card descriptions |
| `border-subtle` | `#E2EBE4` | 1px card separators, dividers | Borders, table hairlines |
| `status-success` | `#26865E` | Verified badge, active clearance | State A verdict badge |
| `status-warning` | `#CF983E` | Expired pass, candidate review | State B/C/F verdict badge |
| `status-error` | `#C85B57` | Gate access denied, blur error | State D/E verdict badge |

---

## 2. Stitch Screen References & Architecture Mapping

| Stitch Screen Title | Stitch Screen ID | Architectural Destination | Status |
|---|---|---|---|
| **Public Website Homepage** | `screens/4c87adac2749427cb47caed27844f111` | `apps/web/app/(public)/page.tsx` | Scaffolding complete |
| **APK Download & Guide** | `screens/8950413ad9954f43bbfe085f4f65bafe` | `apps/web/app/(public)/download/page.tsx` | Scaffolding complete |
| **Guard Secure Sign-In** | `screens/9a7135b274ce48a4b2aa3b54a9b354f5` | `apps/mobile/app/(auth)/login.tsx` | Scaffolding complete |
| **Guard Home & Camera** | `screens/3bca3fc385f8487fbf455aba54dd67cc` | `apps/mobile/app/(guard)/verify.tsx` | Scaffolding complete |
| **Guard Capture Review** | `screens/25823c90e88045548f02af67848efafb` | `apps/mobile/features/review/` | Ready for Phase 2 |
| **Multi-Stage Processing** | `screens/4df443ecee5c4fd3bfc78f8cc911cb87` | `apps/mobile/features/processing/` | Ready for Phase 2 |
| **Decision Recorded** | `screens/226dbe5cab274a9aa4b71182aa9fa2c8` | `apps/mobile/features/confirmation/` | Ready for Phase 2 |
| **Guard Activity History** | `screens/8aab00212b114a52bfdfcd6396850a54` | `apps/mobile/app/(guard)/activity.tsx` | Scaffolding complete |
| **Visitor Management** | `screens/66c5316284444ea2aae3efcdbb8e98da` | `apps/mobile/app/(guard)/visitors.tsx` | Scaffolding complete |
| **Station Profile & Status** | `screens/640efd0f2b8f490481681a66ff5a8c50` | `apps/mobile/app/(guard)/profile.tsx` | Scaffolding complete |
| **Command Centre (Admin)** | `screens/d251bb039aef45c5bac5616f355908f6` | `apps/web/app/(admin)/admin/page.tsx` | Scaffolding complete |
| **Drive Sync Portal** | `screens/a28abf48195d42ebb12cad77b94fc41d` | `apps/web/app/(admin)/admin/repository/` | Scaffolding complete |
| **Admin Login** | `screens/fd978ebbd22d4fdf922ec87bc6a8cad8` | `apps/web/app/(admin)/admin/login/` | Scaffolding complete |

---

## 3. Touch Geometry & Mobile Component Mapping

* **Touch Targets**: Minimum 48dp $\times$ 48dp on all interactive icons and buttons.
* **Camera Shutter**: 68dp outer ring with 56dp inner circle.
* **Primary Actions**: 54dp height, 12dp border-radius, full-width.
* **Bottom Navigation**: 64dp fixed height + system safe area insets.

---

## 4. Missing Design Assets

* Vector SVG logo asset (interim SVG implemented using brand shield geometry).
* Raw 3D campus GLTF mesh files (hosted remotely in Stitch project storage).
