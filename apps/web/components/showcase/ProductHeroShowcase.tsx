'use client';

import React from 'react';
import Link from 'next/link';
import {
  ShieldCheck, Smartphone, Monitor, ArrowRight, Play,
  Lock, CheckCircle2, Cpu, Zap, Activity, Shield, ChevronRight
} from 'lucide-react';

interface ProductHeroShowcaseProps {
  onWatchVideoClick?: () => void;
  onExploreGalleryClick?: () => void;
}

export default function ProductHeroShowcase({
  onWatchVideoClick,
  onExploreGalleryClick,
}: ProductHeroShowcaseProps) {
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative pt-6 pb-16 md:pt-12 md:pb-24 overflow-hidden">
      {/* Background radial gradients for subtle Apple-like depth */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-gatewise-light/40 via-gatewise-mint/10 to-transparent blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Operational Pill */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center space-x-2.5 px-3.5 py-1.5 rounded-full bg-white/90 border border-gatewise-borderMedium shadow-2xs backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-gatewise-primary animate-pulse" />
            <span className="text-[11px] font-semibold text-gatewise-text tracking-tight uppercase">
              Production Release 1.0
            </span>
            <span className="text-gatewise-borderMedium">•</span>
            <span className="text-[11px] font-medium text-gatewise-secondary">
              Verified for IIM Sambalpur Campus
            </span>
          </div>
        </div>

        {/* Hero Title & Subtitle */}
        <div className="text-center max-w-4xl mx-auto space-y-5">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-gatewise-text tracking-tight leading-[1.08]">
            One Connected Platform for{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gatewise-primary via-gatewise-teal to-gatewise-deep">
              Smarter Gate Operations.
            </span>
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-gatewise-secondary leading-relaxed max-w-2xl mx-auto font-normal">
            GATEWISE AI unites high-speed on-device Android guard verification with a centralised institutional command centre. Sub-300ms verification, zero raw images stored in audit logs, and non-repudiation cryptographic signatures on every entry.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3.5 pt-4">
            <button
              onClick={() => {
                if (onExploreGalleryClick) {
                  onExploreGalleryClick();
                } else {
                  scrollToSection('product-gallery');
                }
              }}
              className="px-6 py-3.5 rounded-full bg-gatewise-primary text-white text-xs sm:text-sm font-semibold hover:bg-gatewise-deep active:scale-98 transition-all shadow-md hover:shadow-lg flex items-center space-x-2.5 group cursor-pointer"
            >
              <span>Explore Platform Screens</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => {
                if (onWatchVideoClick) {
                  onWatchVideoClick();
                } else {
                  scrollToSection('product-video');
                }
              }}
              className="px-6 py-3.5 rounded-full border border-gatewise-borderMedium bg-white/90 text-gatewise-text text-xs sm:text-sm font-semibold hover:bg-white active:scale-98 transition-all shadow-2xs backdrop-blur-md flex items-center space-x-2.5 cursor-pointer"
            >
              <div className="w-6 h-6 rounded-full bg-gatewise-light flex items-center justify-center text-gatewise-primary">
                <Play className="w-3 h-3 fill-current ml-0.5" />
              </div>
              <span>Watch Product Teaser (28s)</span>
            </button>
          </div>

          {/* Quick Platform Strip */}
          <div className="pt-3 flex flex-wrap items-center justify-center gap-2 text-xs text-gatewise-secondary">
            <span className="font-medium text-slate-500">Available downloads:</span>
            <Link
              href="/download?platform=android"
              className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/80 hover:bg-emerald-100 transition-colors font-semibold text-[11px]"
            >
              <Smartphone className="w-3 h-3 text-emerald-600" />
              <span>Android APK</span>
            </Link>
            <span className="text-slate-300">•</span>
            <Link
              href="/download?platform=ios"
              className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-sky-50 text-sky-800 border border-sky-200/80 hover:bg-sky-100 transition-colors font-semibold text-[11px]"
            >
              <span>Apple iOS (TestFlight)</span>
            </Link>
            <span className="text-slate-300">•</span>
            <Link
              href="/download?platform=macos"
              className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-purple-50 text-purple-800 border border-purple-200/80 hover:bg-purple-100 transition-colors font-semibold text-[11px]"
            >
              <Monitor className="w-3 h-3 text-purple-600" />
              <span>macOS (DMG)</span>
            </Link>
          </div>
        </div>

        {/* Real Metrics Ribbon */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto">
          <div className="bg-white/80 border border-gatewise-borderMedium/80 rounded-2xl p-4 text-center backdrop-blur-sm shadow-2xs">
            <div className="text-2xl sm:text-3xl font-black text-gatewise-text font-mono tracking-tight">
              &lt;300ms
            </div>
            <div className="text-xs font-medium text-gatewise-secondary mt-1">
              End-to-End Latency SLA
            </div>
          </div>
          <div className="bg-white/80 border border-gatewise-borderMedium/80 rounded-2xl p-4 text-center backdrop-blur-sm shadow-2xs">
            <div className="text-2xl sm:text-3xl font-black text-gatewise-primary font-mono tracking-tight">
              98.4%
            </div>
            <div className="text-xs font-medium text-gatewise-secondary mt-1">
              Mean Cosine Accuracy
            </div>
          </div>
          <div className="bg-white/80 border border-gatewise-borderMedium/80 rounded-2xl p-4 text-center backdrop-blur-sm shadow-2xs">
            <div className="text-2xl sm:text-3xl font-black text-gatewise-text font-mono tracking-tight">
              128-D
            </div>
            <div className="text-xs font-medium text-gatewise-secondary mt-1">
              Zero Raw Images Stored
            </div>
          </div>
          <div className="bg-white/80 border border-gatewise-borderMedium/80 rounded-2xl p-4 text-center backdrop-blur-sm shadow-2xs">
            <div className="text-2xl sm:text-3xl font-black text-gatewise-teal font-mono tracking-tight">
              HMAC-256
            </div>
            <div className="text-xs font-medium text-gatewise-secondary mt-1">
              Cryptographic Audit Seal
            </div>
          </div>
        </div>

        {/* Device Pair Visual Composition */}
        <div className="mt-12 relative max-w-5xl mx-auto">
          <div className="relative rounded-3xl p-3 sm:p-5 bg-gradient-to-b from-white/90 to-white/40 border border-white/80 shadow-2xl backdrop-blur-xl">
            {/* Live Status Header */}
            <div className="flex items-center justify-between pb-3 px-2 border-b border-gatewise-border/70 text-xs text-gatewise-secondary">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-semibold text-gatewise-text">GATE-MAIN-02 ACTIVE</span>
                <span className="hidden sm:inline text-gatewise-muted">• Post Officer: Ramesh Verma</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="hidden md:inline px-2 py-0.5 rounded-md bg-gatewise-light text-gatewise-deep font-mono text-[10px] font-semibold">
                  WEBSOCKET CONNECTED
                </span>
                <span className="font-mono text-[11px] text-gatewise-text">Telemetry Sync: 14:32:08 IST</span>
              </div>
            </div>

            {/* Device-Pair Image Composition */}
            <div className="mt-4 relative rounded-2xl overflow-hidden border border-black/[0.08] bg-slate-900 group">
              <picture>
                <source srcSet="/media/screenshots/workflows/02_device_pair_composition.webp" type="image/webp" />
                <img
                  src="/media/screenshots/workflows/02_device_pair_composition.png"
                  alt="GATEWISE AI Connected Ecosystem: MacBook Pro Admin Command Centre with Android Guard Application"
                  className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-[1.01]"
                  loading="eager"
                />
              </picture>

              {/* Floating Callout Badges on Top of Image */}
              <div className="hidden sm:block absolute top-4 left-4 bg-black/75 backdrop-blur-md border border-white/15 rounded-xl px-3 py-2 text-white shadow-lg pointer-events-none">
                <div className="flex items-center space-x-2">
                  <Monitor className="w-3.5 h-3.5 text-gatewise-mint" />
                  <span className="text-[11px] font-semibold tracking-wide uppercase text-slate-200">
                    Admin Command Centre
                  </span>
                </div>
                <p className="text-[10px] text-slate-300 mt-0.5">
                  Live multi-gate telemetry &amp; security governance
                </p>
              </div>

              <div className="hidden sm:block absolute bottom-4 right-4 bg-black/75 backdrop-blur-md border border-white/15 rounded-xl px-3 py-2 text-white shadow-lg pointer-events-none">
                <div className="flex items-center space-x-2">
                  <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-[11px] font-semibold tracking-wide uppercase text-slate-200">
                    GATEWISE Guard Mobile
                  </span>
                </div>
                <p className="text-[10px] text-slate-300 mt-0.5">
                  Sub-300ms on-device SFace verification
                </p>
              </div>
            </div>

            {/* Synthetic Data Disclaimer Pill */}
            <div className="mt-3 text-center">
              <span className="text-[10px] text-gatewise-muted tracking-tight">
                * All identity records, names, and images displayed are synthetic demonstration data generated for compliance and security demonstration.
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
