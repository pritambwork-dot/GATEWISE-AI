'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ShieldCheck, Smartphone, Monitor, ArrowRight, CheckCircle2,
  Lock, Eye, Shield, Cpu, Activity, Clock, Users, DoorClosed,
  Download, QrCode, Sparkles, ChevronRight, AlertCircle, RefreshCw
} from 'lucide-react';
import Campus3DView from '@/components/Campus3DView';

export default function PublicHomePage() {
  const [releaseInfo, setReleaseInfo] = useState<{
    published: boolean;
    version_name?: string;
  }>({ published: false, version_name: '1.0.0' });

  useEffect(() => {
    fetch('/releases/android-release.json')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) {
          setReleaseInfo({
            published: data.published,
            version_name: data.version_name || '1.0.0',
          });
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="space-y-24 md:space-y-32 pb-24 overflow-hidden">
      {/* ========================================================================= */}
      {/* SECTION 1 — HERO                                                          */}
      {/* ========================================================================= */}
      <section className="relative pt-10 md:pt-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Text Column */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-gatewise-light text-gatewise-deep text-xs font-bold border border-gatewise-mint shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Campus Security Architecture 1.0</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-gatewise-text tracking-tight leading-[1.08]">
              Smarter Gate Verification.{' '}
              <span className="text-gatewise-primary">Simpler Campus Operations.</span>
            </h1>

            <p className="text-base sm:text-lg text-gatewise-secondary leading-relaxed max-w-xl">
              GATEWISE AI brings intelligent identity verification and institutional visitor management into one connected platform, helping security personnel make informed gate decisions.
            </p>

            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <Link
                href="/download"
                className="px-6 py-3.5 rounded-2xl bg-gatewise-primary text-white text-xs sm:text-sm font-bold hover:bg-gatewise-deep transition-all shadow-sm flex items-center space-x-2.5 group"
              >
                <Smartphone className="w-4 h-4" />
                <span>Download for Android</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="/product"
                className="px-6 py-3.5 rounded-2xl border border-gatewise-border bg-white text-gatewise-text text-xs sm:text-sm font-bold hover:bg-background-secondary transition-all shadow-xs flex items-center space-x-2"
              >
                <span>Explore the Platform</span>
              </Link>
            </div>

            {/* Micro-proof strip */}
            <div className="pt-4 flex flex-wrap items-center gap-6 text-xs text-gatewise-secondary border-t border-gatewise-border/70">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-gatewise-primary" />
                <span className="font-medium">Single-Shot Camera Matching</span>
              </div>
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-gatewise-primary" />
                <span className="font-medium">Sovereign Guard Oversight</span>
              </div>
              <div className="flex items-center space-x-2">
                <Lock className="w-4 h-4 text-gatewise-primary" />
                <span className="font-medium">HMAC-SHA256 Audit Trail</span>
              </div>
            </div>
          </div>

          {/* Right Column: 3D Campus Model Preview */}
          <div className="lg:col-span-6 relative">
            <div className="relative w-full h-[400px] sm:h-[480px] lg:h-[540px] rounded-3xl overflow-hidden border border-gatewise-border shadow-md bg-white">
              <Campus3DView className="w-full h-full" showControls={true} interactive={true} />
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 2 — PRODUCT INTRODUCTION                                          */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
          <span className="text-[11px] font-bold uppercase tracking-wider text-gatewise-primary bg-gatewise-light px-3 py-1 rounded-full border border-gatewise-mint">
            Ecosystem Overview
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-gatewise-text tracking-tight">
            One Platform. Two Connected Experiences.
          </h2>
          <p className="text-sm text-gatewise-secondary leading-relaxed">
            Designed specifically for institutional gates and central security operations centers, creating seamless harmony between checkpoint officers and campus administrators.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Card 1: GATEWISE Guard (Mobile) */}
          <div className="p-8 sm:p-10 rounded-3xl bg-white border border-gatewise-border shadow-xs hover:border-gatewise-primary/40 transition-all flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-gatewise-light flex items-center justify-center text-gatewise-primary border border-gatewise-mint shadow-2xs">
                <Smartphone className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-gatewise-secondary">
                  Native Mobile Experience
                </span>
                <h3 className="text-2xl font-black text-gatewise-text mt-0.5">GATEWISE Guard</h3>
              </div>
              <p className="text-sm text-gatewise-secondary leading-relaxed">
                The Android application for security personnel to capture, verify, and record perimeter gate events with high-speed YuNet detection and on-premise SFace inference.
              </p>
              <ul className="space-y-2.5 text-xs text-gatewise-text font-medium pt-2">
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-gatewise-primary" />
                  <span>One-handed tactical camera viewfinder with corner reticles</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-gatewise-primary" />
                  <span>Separation of Identity Match vs. Institutional Authorization</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-gatewise-primary" />
                  <span>Sovereign Grant/Deny buttons locked by cryptographic HMAC signatures</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-gatewise-primary" />
                  <span>Field enrollment referral queue for unregistered visitors</span>
                </li>
              </ul>
            </div>

            <div className="pt-4 border-t border-gatewise-border flex items-center justify-between">
              <span className="text-xs font-mono text-gatewise-secondary">Package: com.gatewiseai.guard</span>
              <Link
                href="/download"
                className="text-xs font-bold text-gatewise-primary hover:text-gatewise-deep flex items-center space-x-1"
              >
                <span>Download APK</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Card 2: GATEWISE Admin (Desktop) */}
          <div className="p-8 sm:p-10 rounded-3xl bg-white border border-gatewise-border shadow-xs hover:border-gatewise-primary/40 transition-all flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-gatewise-light flex items-center justify-center text-gatewise-primary border border-gatewise-mint shadow-2xs">
                <Monitor className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-gatewise-secondary">
                  Desktop Operations Portal
                </span>
                <h3 className="text-2xl font-black text-gatewise-text mt-0.5">GATEWISE Admin</h3>
              </div>
              <p className="text-sm text-gatewise-secondary leading-relaxed">
                The institutional web portal for administrators to manage identities, visitor passes, gates, guards, Google Drive repositories, and verification activity.
              </p>
              <ul className="space-y-2.5 text-xs text-gatewise-text font-medium pt-2">
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-gatewise-primary" />
                  <span>Command Centre with real-time perimeter gate node blueprint</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-gatewise-primary" />
                  <span>Automated Google Drive 128-D embedding repository sync</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-gatewise-primary" />
                  <span>Multi-facet Live Activity stream with cryptographic seal inspection</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-gatewise-primary" />
                  <span>FAR/FRR biometric accuracy curve &amp; latency decomposition</span>
                </li>
              </ul>
            </div>

            <div className="pt-4 border-t border-gatewise-border flex items-center justify-between">
              <span className="text-xs font-mono text-gatewise-secondary">Access: Restricted (MFA Enforced)</span>
              <Link
                href="/admin/login"
                className="text-xs font-bold text-gatewise-primary hover:text-gatewise-deep flex items-center space-x-1"
              >
                <span>Admin Login</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 3 — HOW IT WORKS                                                  */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
          <span className="text-[11px] font-bold uppercase tracking-wider text-gatewise-primary bg-gatewise-light px-3 py-1 rounded-full border border-gatewise-mint">
            Verification Architecture
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-gatewise-text tracking-tight">
            How GATEWISE AI Works
          </h2>
          <p className="text-sm text-gatewise-secondary leading-relaxed">
            An 8-stage verification pipeline running at the intersection of on-device edge capture and deterministic institutional database policy.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { step: '01', title: 'Capture at Gate', desc: 'Guard initiates manual single-shot capture on Android terminal viewfinder.' },
            { step: '02', title: 'Detect Face', desc: 'OpenCV Zoo YuNet detects 5 facial landmarks with orientation alignment.' },
            { step: '03', title: 'Quality Assessment', desc: 'Filters blur, low-illumination, and distant faces below minimum pixel width.' },
            { step: '04', title: '128-D Embedding', desc: 'SFace model extracts an L2-normalized biometric vector in ephemeral memory.' },
            { step: '05', title: 'Reference Compare', desc: 'Cosine similarity computed against institutional approved reference photos.' },
            { step: '06', title: 'Clearance Check', desc: 'Validates gate access zone, time window, and student/faculty status.' },
            { step: '07', title: 'Present to Guard', desc: 'Displays match confidence score alongside approved reference card.' },
            { step: '08', title: 'Sovereign Decision', desc: 'Guard records Grant/Deny; transaction is sealed with HMAC-SHA256 signature.' }
          ].map((item, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-white border border-gatewise-border shadow-xs hover:border-gatewise-primary/40 transition-colors space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-black text-gatewise-primary bg-gatewise-light px-2.5 py-0.5 rounded-lg border border-gatewise-mint">
                  STEP {item.step}
                </span>
                <span className="w-2 h-2 rounded-full bg-gatewise-primary/40" />
              </div>
              <h4 className="font-black text-base text-gatewise-text">{item.title}</h4>
              <p className="text-xs text-gatewise-secondary leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 4 — COMPLETE PRODUCT CAPABILITIES                                 */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
          <span className="text-[11px] font-bold uppercase tracking-wider text-gatewise-primary bg-gatewise-light px-3 py-1 rounded-full border border-gatewise-mint">
            Core Features
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-gatewise-text tracking-tight">
            Engineered for Campus Integrity
          </h2>
          <p className="text-sm text-gatewise-secondary leading-relaxed">
            Built from first principles to solve the operational bottlenecks of high-density institutional checkpoints.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-white border border-gatewise-border shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-gatewise-light text-gatewise-primary flex items-center justify-center font-bold">
              <Eye className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-gatewise-text">Camera-Based Verification</h3>
            <p className="text-xs text-gatewise-secondary leading-relaxed">
              Tactical single-shot capture engineered for varying sunlight, backlighting, and weather conditions at outdoor perimeter gates.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-gatewise-border shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-gatewise-light text-gatewise-primary flex items-center justify-center font-bold">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-gatewise-text">Approved Identity Repository</h3>
            <p className="text-xs text-gatewise-secondary leading-relaxed">
              Seamlessly ingests reference photos from institutional Google Drive folders without requiring manual student re-enrollment.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-gatewise-border shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-gatewise-light text-gatewise-primary flex items-center justify-center font-bold">
              <DoorClosed className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-gatewise-text">Visitor Pass Issuance</h3>
            <p className="text-xs text-gatewise-secondary leading-relaxed">
              Pre-approved visitor passes and QR codes allow fast ingress/egress logging for guest speakers, contractors, and parents.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-gatewise-border shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-gatewise-light text-gatewise-primary flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-gatewise-text">Human Sovereign Oversight</h3>
            <p className="text-xs text-gatewise-secondary leading-relaxed">
              The AI never auto-locks gates or denies entry without human guard verification. The officer retains ultimate physical discretion.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-gatewise-border shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-gatewise-light text-gatewise-primary flex items-center justify-center font-bold">
              <Activity className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-gatewise-text">Cryptographic Audit Logs</h3>
            <p className="text-xs text-gatewise-secondary leading-relaxed">
              Every verification decision is HMAC-SHA256 signed with the guard's device key, creating an immutable non-repudiation audit trail.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-gatewise-border shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-gatewise-light text-gatewise-primary flex items-center justify-center font-bold">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-gatewise-text">Sub-300ms SLA Latency</h3>
            <p className="text-xs text-gatewise-secondary leading-relaxed">
              Optimized YuNet and SFace models execute in milliseconds on local hardware, eliminating queue congestion during peak hours.
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 5 — 3D CAMPUS SHOWCASE                                            */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-white border border-gatewise-border shadow-xs space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-gatewise-primary bg-gatewise-light px-3 py-1 rounded-full border border-gatewise-mint">
                Perimeter Architecture
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-gatewise-text tracking-tight mt-2">
                Simulated 3D Campus Environment
              </h2>
              <p className="text-xs text-gatewise-secondary mt-1 max-w-xl">
                A visual representation of an institutional campus perimeter, showing checkpoint access barriers, security booths, and administrative halls.
              </p>
            </div>
            <div className="text-xs font-mono text-gatewise-secondary bg-background-secondary px-3 py-1.5 rounded-xl border border-gatewise-border w-fit">
              Model: Daylight Architectural Mesh
            </div>
          </div>

          <div className="h-[360px] sm:h-[420px] rounded-2xl overflow-hidden border border-gatewise-border bg-background">
            <Campus3DView className="w-full h-full" showControls={true} interactive={true} />
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 6 — TRUST & PRIVACY                                               */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-gatewise-deep text-white space-y-8">
          <div className="max-w-2xl space-y-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300 bg-white/10 px-3 py-1 rounded-full border border-white/20">
              Enterprise Compliance
            </span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
              Institutional Trust &amp; Privacy by Design
            </h2>
            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
              GATEWISE AI is engineered to protect student and staff privacy with zero cloud biometric leakage and human-first accountability.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 text-xs">
            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
              <span className="font-bold text-white text-sm block">Invitation-Only Access</span>
              <p className="text-gray-300 leading-relaxed">
                Guards and administrators are provisioned explicitly by the institution. Public sign-up is disabled by design.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
              <span className="font-bold text-white text-sm block">Zero Raw Biometric Storage</span>
              <p className="text-gray-300 leading-relaxed">
                Facial crops from gate cameras are analyzed in ephemeral memory and discarded. Raw face pictures are never retained in server logs.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
              <span className="font-bold text-white text-sm block">Controlled Retention Policies</span>
              <p className="text-gray-300 leading-relaxed">
                Audit logs and verification metadata are retained strictly for institutional security compliance and purged per institutional schedule.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 7 — ANDROID DOWNLOAD CALL TO ACTION                               */}
      {/* ========================================================================= */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        <div className="w-14 h-14 rounded-2xl bg-gatewise-light flex items-center justify-center text-gatewise-primary mx-auto border border-gatewise-mint shadow-xs">
          <Smartphone className="w-7 h-7" />
        </div>

        <div className="space-y-2">
          <h2 className="text-3xl sm:text-4xl font-black text-gatewise-text tracking-tight">
            Bring Smarter Verification to Your Gate.
          </h2>
          <p className="text-sm text-gatewise-secondary max-w-lg mx-auto">
            Get started with the GATEWISE AI Android application for authorized institutional security personnel.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            href="/download"
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gatewise-primary text-white text-xs sm:text-sm font-bold hover:bg-gatewise-deep transition-all shadow-sm flex items-center justify-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>{releaseInfo.published ? 'Download Android APK' : 'Android App Coming Soon'}</span>
          </Link>

          <Link
            href="/installation"
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl border border-gatewise-border bg-white text-gatewise-text text-xs sm:text-sm font-bold hover:bg-background-secondary transition-all"
          >
            View Installation Guide
          </Link>
        </div>

        <p className="text-[11px] text-gatewise-secondary font-mono">
          Package: com.gatewiseai.guard • Release v{releaseInfo.version_name || '1.0.0'}
        </p>
      </section>
    </div>
  );
}
