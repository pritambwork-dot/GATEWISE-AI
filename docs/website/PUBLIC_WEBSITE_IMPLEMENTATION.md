# GATEWISE AI 1.0 — Official Public Website
## Architecture, Routes & Technical Implementation

---

## 1. Overview & Core Mission

The **GATEWISE AI Public Website** is the official digital front door and institutional product showcase for the GATEWISE AI platform. It serves campus directors, chief security officers, security guards, and IT registrars.

Built inside `apps/web/` using **Next.js 14 App Router**, **React**, **TypeScript**, **Tailwind CSS**, and **Three.js**, it operates alongside the protected Desktop Administrator Portal while maintaining a strict, non-bypassable security boundary.

---

## 2. Public Route Inventory

| Route | Page | Purpose & Key Features |
|---|---|---|
| `/` | **Homepage** | Product landing page featuring the approved headline, artistic 3D daylight campus environment (`<Campus3DView />`), 8-step verification pipeline, product previews, trust & privacy by design, and Android download CTA. |
| `/product` | **Product Overview** | Deep dive into both connected product experiences: **GATEWISE Guard** (Android) and **GATEWISE Admin** (Desktop Command Centre). |
| `/features` | **Feature Matrix** | Complete institutional capability breakdown: Computer vision (YuNet + SFace), Google Drive identity sync, visitor passes, human sovereign oversight, and HMAC-SHA256 seals. |
| `/how-it-works`| **Interactive Pipeline** | Interactive 8-stage verification walkthrough from camera capture to cryptographic non-repudiation sealing. |
| `/security` | **Security & Privacy** | Truthful compliance documentation: Zero raw biometric persistence, ephemeral RAM processing, 128-D non-invertible embeddings, and role-based access control. |
| `/download` | **Download Centre** | Official Android APK download hub with live release metadata verification, dynamic QR code generator for smartphones, SHA-256 binary checksum, and release notes. |
| `/installation`| **Installation Guide** | Non-technical 7-step guide for installing and granting scoped camera permissions on Android 8.0 through Android 15. |
| `/faq` | **Operational FAQ** | Comprehensive answers to common campus security, network drop, and privacy questions. |
| `/support` | **Support & Operations** | Field operations documentation, administrator portal links, and emergency fallback protocols. |
| `/robots.txt` | **Robots Policy** | Allows indexing of public informational pages; explicitly disallows crawling of `/admin/` and `/api/`. |
| `/sitemap.xml` | **XML Sitemap** | Dynamic sitemap generator providing canonical endpoints and weekly change frequency. |

---

## 3. Brand Identity & Design System

The public website adheres to the established GATEWISE AI light-theme palette:

- **Main Background**: `#F4F8F5`
- **Surface**: `#FFFFFF`
- **Secondary Surface**: `#EDF4EF`
- **Light Green**: `#DDF0E2`
- **Mint**: `#C7E7D8`
- **Primary Green**: `#23865D`
- **Deep Green**: `#176346`
- **Teal Accent**: `#3A9B8B`
- **Primary Text**: `#1E2D26`
- **Secondary Text**: `#65756C`
- **Hairline Border**: `#E2EBE4`

Typography is set in high-contrast `Inter` / system sans-serif with tabular numerals and monospaced code identifiers for roll numbers and cryptographic hashes.

---

## 4. 3D Campus Architectural Environment

The hero section and dedicated campus showcase feature an interactive Three.js daylight scene (`apps/web/components/Campus3DView.tsx`):
- **Lighting**: Hemisphere sky light + warm sunlight directional shadows + soft ambient illumination.
- **Architectural Mesh**: Checkpoint gate portal arch (`GATE-01`), security guard kiosk booth, automatic access barrier, modern academic pavilions, clock tower, and stylized trees.
- **Interactivity**: Smooth auto-orbiting camera with interactive mouse tracking and pulsating verification status beacon.
- **Zero-Block Fallback**: If WebGL is unavailable or reduced motion is preferred, an optimized SVG/CSS architectural illustration renders instantly without delaying page load or Core Web Vitals.

---

## 5. Security & Boundary Enforcement

- **Administrative Isolation**: The public layout (`(public)/layout.tsx`) and private administrative layout (`(admin)/admin/layout.tsx`) are completely decoupled.
- **No Data Leakage**: Public endpoints and pages never expose student identities, guard rosters, or live biometric coordinates.
- **Crawler Protection**: `robots.ts` disallows `/admin/` and `/api/` from search indexation.
