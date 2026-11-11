'use client';

import React from 'react';
import { Navbar } from '@/components/aura/sections/Navbar';
import { Hero } from '@/components/aura/sections/Hero';
import { MenuBarStrip } from '@/components/aura/sections/MenuBarStrip';
import { InboxMockup } from '@/components/aura/sections/InboxMockup';
import { ProductVideoTeaser } from '@/components/aura/sections/ProductVideoTeaser';
import { BentoCapabilities } from '@/components/aura/sections/BentoCapabilities';
import { VerificationProtocol } from '@/components/aura/sections/VerificationProtocol';
import { InteractiveScreenshotGallery } from '@/components/aura/sections/InteractiveScreenshotGallery';
import { FeatureTriage } from '@/components/aura/sections/FeatureTriage';
import { DownloadSection } from '@/components/aura/sections/DownloadSection';
import { LogoCloud } from '@/components/aura/sections/LogoCloud';
import { Testimonials } from '@/components/aura/sections/Testimonials';
import { DataGovernance } from '@/components/aura/sections/DataGovernance';
import { FinalCTA } from '@/components/aura/sections/FinalCTA';
import { Footer } from '@/components/aura/sections/Footer';

export default function PublicHomePage() {
  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-[#0c0c0c] text-white selection:bg-[#3D81E3]/30">
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

      {/* Global Background Video (fixed, behind everything) */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover pointer-events-none opacity-40 filter saturate-150 brightness-75"
          src="/media/videos/gatewise-teaser-uploaded.mp4"
        />
        {/* Dark subtle gradient overlay to ensure perfect contrast */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0c0c0c]/85 via-[#0c0c0c]/70 to-[#0c0c0c]/95 pointer-events-none" />
      </div>

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

        {/* Section 4 — Live Gate Operations Console */}
        <InboxMockup />

        {/* Section 5 — 4K Motion Video Teaser (2x Speed) */}
        <ProductVideoTeaser />

        {/* Section 6 — Bento Feature Grid & Dynamic Slider */}
        <BentoCapabilities />

        {/* Section 7 — 4-Stage Verification Protocol */}
        <VerificationProtocol />

        {/* Section 8 — 24-Screen Interactive Interface Gallery */}
        <InteractiveScreenshotGallery />

        {/* Section 9 — Perimeter Defense Architecture */}
        <FeatureTriage />

        {/* Section 10 — Download & Web App Access Hub */}
        <DownloadSection />

        {/* Section 11 — Institutional Trust Cloud */}
        <LogoCloud />

        {/* Section 12 — Executive Testimonials */}
        <Testimonials />

        {/* Section 13 — Zero-Image Data Governance */}
        <DataGovernance />

        {/* Section 14 — Final CTA */}
        <FinalCTA />

        {/* Section 15 — Institutional Footer */}
        <Footer />
      </div>
    </div>
  );
}
