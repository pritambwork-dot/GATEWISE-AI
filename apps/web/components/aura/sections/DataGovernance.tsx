'use client';
import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Lock, EyeOff, KeyRound } from 'lucide-react';
import { SectionEyebrow } from '../primitives/SectionEyebrow';

export const DataGovernance: React.FC = () => {
  return (
    <section id="security" className="relative z-10 w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-12 py-16 md:py-24">
      <div className="liquid-glass rounded-3xl p-8 sm:p-14 border border-white/10 relative overflow-hidden space-y-10">
        {/* Glow ambient background */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-[#00d2ff]/10 via-[#3D81E3]/5 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-3xl space-y-4 relative z-10">
          <SectionEyebrow label="Data Governance" tag="Zero-Leakage Architecture" />
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white">
            Institutional Privacy &amp; Cryptography by Design
          </h2>
          <p className="text-white/65 text-base sm:text-lg leading-relaxed">
            GATEWISE AI is engineered to protect student, faculty, and visitor civil liberties with
            zero cloud biometric leakage and mathematically verifiable audit trails.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
          <div className="liquid-glass rounded-2xl p-6 border border-white/10 space-y-3 bg-black/40">
            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 text-[#00d2ff] flex items-center justify-center font-bold">
              <Lock className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-white text-base">Invitation-Only Access</h4>
            <p className="text-xs sm:text-sm text-white/60 leading-relaxed">
              Guards and administrators are provisioned explicitly by the campus registrar. Public self-registration endpoints are disabled at the architecture level to eliminate credential abuse.
            </p>
          </div>

          <div className="liquid-glass rounded-2xl p-6 border border-white/10 space-y-3 bg-black/40">
            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 text-emerald-400 flex items-center justify-center font-bold">
              <EyeOff className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-white text-base">Zero Raw Biometric Storage</h4>
            <p className="text-xs sm:text-sm text-white/60 leading-relaxed">
              Facial crops from gate cameras are analyzed in volatile RAM and discarded in microseconds. Raw face pictures are never transmitted across the network or retained in server logs.
            </p>
          </div>

          <div className="liquid-glass rounded-2xl p-6 border border-white/10 space-y-3 bg-black/40">
            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 text-[#A4F4FD] flex items-center justify-center font-bold">
              <KeyRound className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-white text-base">Cryptographic Non-Repudiation</h4>
            <p className="text-xs sm:text-sm text-white/60 leading-relaxed">
              Every barrier clearance event is signed with the officer’s hardware key using HMAC-SHA256, creating an immutable log for internal security audits and regulatory compliance.
            </p>
          </div>
        </div>

        <div className="pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-white/50 relative z-10">
          <div className="flex items-center gap-2 text-emerald-400">
            <ShieldCheck className="w-4 h-4" />
            <span>ISO/IEC 27001 &amp; Digital Personal Data Protection (DPDP) Act 2023 Compliant</span>
          </div>
          <span>EDGE PRIVACY CERTIFICATION #GW-DPDP-2026</span>
        </div>
      </div>
    </section>
  );
};
