'use client';

import React from 'react';
import { Navbar } from '@/components/aura/sections/Navbar';
import { Hero } from '@/components/aura/sections/Hero';
import { MenuBarStrip } from '@/components/aura/sections/MenuBarStrip';
import { GuardWebAppScene } from '@/components/aura/sections/GuardWebAppScene';
import { InboxMockup } from '@/components/aura/sections/InboxMockup';
import { ProductVideoTeaser } from '@/components/aura/sections/ProductVideoTeaser';
import { BentoCapabilities } from '@/components/aura/sections/BentoCapabilities';
import { VerificationProtocol } from '@/components/aura/sections/VerificationProtocol';
import { FeatureTriage } from '@/components/aura/sections/FeatureTriage';
import { DownloadSection } from '@/components/aura/sections/DownloadSection';
import { LogoCloud } from '@/components/aura/sections/LogoCloud';
import { DataGovernance } from '@/components/aura/sections/DataGovernance';
import { FinalCTA } from '@/components/aura/sections/FinalCTA';
import { Footer } from '@/components/aura/sections/Footer';
import { CookieConsent } from '@/components/aura/compliance/CookieConsent';
import { LegalModals } from '@/components/aura/compliance/LegalModals';

export default function PublicHomePage() {
  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-[#070B1A] text-white selection:bg-[#2F5BFF]/35">
      {/* Root SVG Noise Filter for the Shiny Headline */}
      <svg
        className="absolute w-0 h-0 pointer-events-none"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
      >
        <filter id="c3-noise">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.9"
            numOctaves="2"
            stitchTiles="stitch"
          />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.35 0"
          />
          <feComposite in2="SourceGraphic" operator="in" result="noise" />
          <feBlend in="SourceGraphic" in2="noise" mode="multiply" />
        </filter>
      </svg>


      {/* Fullscreen expansive guide lines */}
      <div className="hidden 2xl:block pointer-events-none fixed inset-y-0 left-1/2 -translate-x-[calc(50%+50rem)] w-px bg-white/10 z-[5]" />
      <div className="hidden 2xl:block pointer-events-none fixed inset-y-0 left-1/2 translate-x-[calc(-50%+50rem)] w-px bg-white/10 z-[5]" />
      <div className="hidden md:block 2xl:hidden pointer-events-none fixed inset-y-0 left-6 lg:left-10 w-px bg-white/5 z-[5]" />
      <div className="hidden md:block 2xl:hidden pointer-events-none fixed inset-y-0 right-6 lg:right-10 w-px bg-white/5 z-[5]" />

      {/* Main Page Layout */}
      <div className="relative z-10 flex flex-col w-full">
        {/* Section 1 — Navbar */}
        <Navbar />

        {/* Section 2 — Hero */}
        <Hero />

        {/* Section 3 — macOS Menu Bar Strip */}
        <MenuBarStrip />

        {/* Section 4 — Guard Web App Scene (Field Terminal & Live Sync) */}
        <GuardWebAppScene />

        {/* Section 5 — Live Gate Operations Console */}
        <InboxMockup />

        {/* Section 5 — 4K Motion Video Teaser (2x Speed) */}
        <ProductVideoTeaser />

        {/* Section 6 — Bento Feature Grid & Dynamic Slider */}
        <BentoCapabilities />

        {/* Section 7 — 4-Stage Verification Protocol */}
        <VerificationProtocol />

        {/* Section 8 — Perimeter Defense Architecture */}
        <FeatureTriage />

        {/* Section 10 — Download & Web App Access Hub */}
        <DownloadSection />

        {/* Section 11 — Institutional Trust Cloud */}
        <LogoCloud />

        {/* Section 13 — Zero-Image Data Governance */}
        <DataGovernance />

        {/* Section 14 — Final CTA */}
        <FinalCTA />

        {/* Section 15 — Institutional Footer */}
        <Footer />
      </div>

      {/* Institutional Compliance & Cookies */}
      <CookieConsent />
      <LegalModals />
    </div>
  );
}
