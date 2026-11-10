'use client';

import React from 'react';
import Link from 'next/link';
import {
  Smartphone, Monitor, ShieldCheck, CheckCircle2, ArrowRight,
  Database, Activity, DoorClosed, Lock, Eye, Download, Server
} from 'lucide-react';

export default function ProductOverviewPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 space-y-16">
      {/* Header */}
      <div className="max-w-2xl space-y-3">
        <span className="text-[11px] font-bold uppercase tracking-wider text-gatewise-primary bg-gatewise-light px-3 py-1 rounded-full border border-gatewise-mint">
          Product Architecture
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-gatewise-text tracking-tight">
          One Connected Security Ecosystem
        </h1>
        <p className="text-sm text-gatewise-secondary leading-relaxed">
          GATEWISE AI unites rugged mobile field operations with central administrative command, ensuring perimeter safety without sacrificing institutional dignity or operational flow.
        </p>
      </div>

      {/* Product 1: GATEWISE Guard */}
      <div className="p-8 sm:p-12 rounded-3xl bg-white border border-gatewise-border shadow-xs space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-gatewise-light text-gatewise-primary flex items-center justify-center font-bold">
              <Smartphone className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-gatewise-secondary block">
              Checkpoint Field Application
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-gatewise-text">
              GATEWISE Guard for Android
            </h2>
            <p className="text-sm text-gatewise-secondary leading-relaxed">
              Engineered for one-handed operation under bright sunlight, rain, and outdoor gate conditions. Security officers can verify identities in seconds with clear visual side-by-side comparison.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
              <div className="p-3.5 rounded-xl bg-background-secondary border border-gatewise-border">
                <span className="font-bold text-gatewise-text block mb-1">Single-Shot Capture</span>
                <p className="text-gatewise-secondary">Manual shutter trigger avoids continuous intrusive scanning of passersby.</p>
              </div>
              <div className="p-3.5 rounded-xl bg-background-secondary border border-gatewise-border">
                <span className="font-bold text-gatewise-text block mb-1">Decoupled Evaluation</span>
                <p className="text-gatewise-secondary">Clearly separates identity candidate match from institutional gate clearance.</p>
              </div>
              <div className="p-3.5 rounded-xl bg-background-secondary border border-gatewise-border">
                <span className="font-bold text-gatewise-text block mb-1">Cryptographic Non-Repudiation</span>
                <p className="text-gatewise-secondary">Officer decisions are sealed with device HMAC tokens for legal auditability.</p>
              </div>
              <div className="p-3.5 rounded-xl bg-background-secondary border border-gatewise-border">
                <span className="font-bold text-gatewise-text block mb-1">Offline Ingress Queue</span>
                <p className="text-gatewise-secondary">Transient perimeter WiFi dropouts are cached locally and synchronized on reconnect.</p>
              </div>
            </div>

            <div className="pt-2">
              <Link
                href="/download"
                className="inline-flex items-center space-x-2 text-xs font-bold text-gatewise-primary hover:text-gatewise-deep"
              >
                <span>Download Guard APK Specification</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5 bg-background-secondary p-8 rounded-2xl border border-gatewise-border text-center space-y-4">
            <div className="w-32 h-48 mx-auto bg-white rounded-2xl border-4 border-gatewise-text shadow-md flex flex-col justify-between p-2">
              <div className="w-12 h-1.5 bg-gatewise-secondary/30 rounded-full mx-auto" />
              <div className="space-y-1">
                <div className="w-10 h-10 rounded-full bg-gatewise-light mx-auto flex items-center justify-center text-gatewise-primary">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div className="text-[9px] font-bold text-gatewise-text">VERIFIED 98.4%</div>
                <div className="text-[7px] text-emerald-700 font-mono">AUTHORIZED</div>
              </div>
              <div className="w-full h-4 rounded bg-gatewise-primary text-white text-[7px] font-bold flex items-center justify-center">
                GRANT ENTRY
              </div>
            </div>
            <span className="text-xs font-mono text-gatewise-secondary block">
              GATEWISE Guard Tactical Viewfinder Interface
            </span>
          </div>
        </div>
      </div>

      {/* Product 2: GATEWISE Admin */}
      <div className="p-8 sm:p-12 rounded-3xl bg-white border border-gatewise-border shadow-xs space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-5 order-2 lg:order-1 bg-background-secondary p-8 rounded-2xl border border-gatewise-border text-center space-y-4">
            <div className="w-full h-40 bg-white rounded-xl border border-gatewise-border shadow-xs p-3 space-y-2 text-left">
              <div className="flex items-center justify-between border-b border-gatewise-border pb-1.5">
                <span className="text-[10px] font-bold text-gatewise-text">Command Centre</span>
                <span className="text-[8px] font-mono text-emerald-700 bg-emerald-50 px-1.5 rounded">ONLINE</span>
              </div>
              <div className="grid grid-cols-3 gap-1.5 text-[8px]">
                <div className="p-1 rounded bg-background-secondary font-mono">1,482 Scans</div>
                <div className="p-1 rounded bg-background-secondary font-mono">98.4% Auto</div>
                <div className="p-1 rounded bg-background-secondary font-mono">4 Gates Active</div>
              </div>
              <div className="h-16 w-full rounded bg-emerald-50/50 border border-emerald-100 flex items-center justify-center text-[9px] text-gatewise-primary font-mono font-bold">
                Live Gate Telemetry Stream
              </div>
            </div>
            <span className="text-xs font-mono text-gatewise-secondary block">
              GATEWISE Admin Desktop Operations Portal
            </span>
          </div>

          <div className="lg:col-span-7 order-1 lg:order-2 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-gatewise-light text-gatewise-primary flex items-center justify-center font-bold">
              <Monitor className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-gatewise-secondary block">
              Central Institutional Portal
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-gatewise-text">
              GATEWISE Admin for Desktop
            </h2>
            <p className="text-sm text-gatewise-secondary leading-relaxed">
              Provides complete supervisory oversight for campus directors, security chiefs, and registrars. Monitor live entry telemetry across perimeter terminals and manage Google Drive photo sync jobs.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
              <div className="p-3.5 rounded-xl bg-background-secondary border border-gatewise-border">
                <span className="font-bold text-gatewise-text block mb-1">Perimeter Node Blueprint</span>
                <p className="text-gatewise-secondary">Interactive station mapping showing officer on duty, scan rate, and maintenance health.</p>
              </div>
              <div className="p-3.5 rounded-xl bg-background-secondary border border-gatewise-border">
                <span className="font-bold text-gatewise-text block mb-1">Drive Reference Synchronization</span>
                <p className="text-gatewise-secondary">Automated ingest from Google Drive photo directories with unmapped file alerts.</p>
              </div>
              <div className="p-3.5 rounded-xl bg-background-secondary border border-gatewise-border">
                <span className="font-bold text-gatewise-text block mb-1">Biometric Evaluation Curves</span>
                <p className="text-gatewise-secondary">FAR/FRR calibration curves to fine-tune cosine similarity thresholds with scientific rigor.</p>
              </div>
              <div className="p-3.5 rounded-xl bg-background-secondary border border-gatewise-border">
                <span className="font-bold text-gatewise-text block mb-1">Field Referral Adjudication</span>
                <p className="text-gatewise-secondary">Central review queue to approve or reject unregistered persons captured at the gate.</p>
              </div>
            </div>

            <div className="pt-2">
              <Link
                href="/admin/login"
                className="inline-flex items-center space-x-2 text-xs font-bold text-gatewise-primary hover:text-gatewise-deep"
              >
                <span>Access Administrator Portal</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
