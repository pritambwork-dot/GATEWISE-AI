import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, MapPin, Building2, CheckCircle2, Cpu } from 'lucide-react';

export const LogoCloud: React.FC = () => {
  return (
    <section className="relative z-10 w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-12 py-12 sm:py-16 md:py-20 border-t border-white/5">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.6 }}
        className="liquid-glass rounded-3xl p-6 sm:p-10 md:p-12 border border-white/10 relative overflow-hidden bg-gradient-to-r from-[#2F5BFF]/10 via-black/60 to-[#12B5A6]/10 shadow-[0_20px_70px_rgba(0,0,0,0.6)]"
      >
        {/* Subtle ambient light */}
        <div className="absolute top-0 right-1/4 w-80 h-80 bg-[#12B5A6]/10 blur-[90px] rounded-full pointer-events-none" />

        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 relative z-10">
          {/* Left: Deployment Title & Badge */}
          <div className="space-y-3 text-center lg:text-left max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-[#1FB36B]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#1FB36B] animate-pulse" />
              <span>LIVE OPERATIONAL DEPLOYMENT</span>
            </div>

            <h3 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Indian Institute of Management Sambalpur
            </h3>

            <p className="text-xs sm:text-sm text-white/65 leading-relaxed">
              GATEWISE AI powers autonomous perimeter ingress, vehicle checkpoint verification, and cryptographic clearance across the IIM Sambalpur institutional campus.
            </p>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-1 text-xs text-white/50 font-mono">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#12B5A6]" />
                <span>Sambalpur, Odisha</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-[#2F5BFF]" />
                <span>Premier National Institute</span>
              </span>
            </div>
          </div>

          {/* Right: Operational Specs Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-2 gap-3 w-full lg:w-auto shrink-0">
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1">
              <span className="text-[10px] font-mono uppercase text-white/40 block">Perimeter Security</span>
              <span className="text-sm font-bold text-white block">Active Gate Posts</span>
              <span className="text-[11px] text-[#1FB36B] font-mono flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                <span>100% Ingress Audited</span>
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1">
              <span className="text-[10px] font-mono uppercase text-white/40 block">Vector Inference</span>
              <span className="text-sm font-bold text-white block">Sub-300ms Match</span>
              <span className="text-[11px] text-[#12B5A6] font-mono flex items-center gap-1">
                <Cpu className="w-3 h-3" />
                <span>On-Device SFace 128-D</span>
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1">
              <span className="text-[10px] font-mono uppercase text-white/40 block">Privacy Standard</span>
              <span className="text-sm font-bold text-white block">Zero Raw Images</span>
              <span className="text-[11px] text-[#1FB36B] font-mono flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                <span>DPDP Act 2023</span>
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1">
              <span className="text-[10px] font-mono uppercase text-white/40 block">Ledger Integrity</span>
              <span className="text-sm font-bold text-white block">HMAC-SHA256</span>
              <span className="text-[11px] text-white/60 font-mono">Non-Repudiation</span>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};
