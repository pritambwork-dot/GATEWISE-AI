# GATEWISE AI 1.0 — Formal Feature Freeze Notice
**Policy Classification:** Release Management & Quality Assurance Baseline  
**Effective Date:** November 11, 2026  
**Release Target:** Version 1.0.0 (Institutional Pilot Release)  
**Authority:** Principal Software Architect, Release Manager & QA Lead

---

## 1. Feature Freeze Scope & Purpose

As of November 11, 2026, **the feature set for GATEWISE AI 1.0 is officially FROZEN.** 

This freeze establishes a stable, predictable engineering baseline for the institutional pilot at the Indian Institute of Management (IIM) Sambalpur. All planned features across the three core applications have been fully developed, tested, and validated:

1. **GATEWISE Guard (Android):** Single-shot camera capture, YuNet/SFace verification, decoupled clearance display, sovereign decision recording, offline caching, and authoritative gate assignment lock.
2. **GATEWISE Admin Portal (Desktop Web):** Live SSE Command Centre, verification audit log, institutional identity directory, field referral approvals, visitor tracking, gate stationing, and assistant-ui policy co-pilot.
3. **GATEWISE Public Website:** Public institutional showcase, architectural 3D visual, documentation guides, and signed Android APK Download Centre.

---

## 2. Freeze Rules & Change Control Protocol

Effective immediately, the following operational boundaries are enforced across all branches:
1. **Zero New Features:** No new capabilities, additional third-party dependencies, or visual redesigns will be accepted for the v1.0.0 release.
2. **P0/P1 Bug Fixes Only:** Only critical security patches, fatal crash resolutions, or data integrity fixes may be merged into `main`.
3. **Mandatory Regression Testing:** Any proposed fix must pass the full 142-test backend suite, mobile typecheck, and on-device workflow verification before merge.
4. **Release Tag Preservation:** The release tag `release-v1.0.0-production-launch` serves as the golden master release artifact.

---

## 3. Frozen Component Inventory

| Application / Module | Frozen Version | Technology Baseline | Audit Status |
|---|---|---|---|
| **Android Guard App** | `v1.0.0 (code 1)` | React Native 0.74.5 · Expo SDK 51 · Hermes | **FROZEN & VERIFIED** |
| **Desktop Admin Portal** | `v1.0.0` | Next.js 14.2.15 · React 18 · assistant-ui | **FROZEN & VERIFIED** |
| **Public Website** | `v1.0.0` | Next.js 14.2.15 (All 25 static pages) | **FROZEN & VERIFIED** |
| **FastAPI Backend** | `v1.0.0` | Python 3.11/3.13 · Uvicorn · Alembic | **FROZEN & VERIFIED** |
| **Database & Vector** | `Postgres 16` | pgvector 0.2.5 · Dual-mode Vector128 | **FROZEN & VERIFIED** |
| **CV Models** | `YuNet 2023mar` / `SFace 2021dec` | OpenCV 4.9.0 ONNX Engine | **FROZEN & VERIFIED** |
| **AI Assistant** | `Google ADK 2.14` | Gemini 1.5 Flash (Rate-limited, zero PII) | **FROZEN & VERIFIED** |
