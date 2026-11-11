import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Play, ArrowRight, Smartphone, Terminal, Monitor, Download, Lock } from 'lucide-react';
import { gradientStyle } from '@/constants/styles';

export const Hero: React.FC = () => {
  return (
    <section className="relative z-10 w-full max-w-[1600px] mx-auto pt-16 md:pt-24 pb-16 text-center flex flex-col items-center px-6 lg:px-12">
      {/* Top Operational Pill */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-white/10 bg-white/[0.04] backdrop-blur-xl mb-8"
      >
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span className="text-xs font-semibold text-white/90 tracking-tight uppercase">
          Production Release 1.0
        </span>
        <span className="text-white/20">•</span>
        <span className="text-xs text-white/60">
          Verified for Institutional Campus Security
        </span>
      </motion.div>

      {/* Motion Headline */}
      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.8,
          delay: 0.3,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-bold tracking-tight leading-[0.92] flex flex-col items-center"
      >
        <span className="text-white">Sovereign Access.</span>
        <span className="animate-shiny select-none inline-block mt-3" style={gradientStyle}>
          Revitalized
        </span>
      </motion.h1>

      {/* Motion Paragraph */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.8,
          delay: 0.5,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="mt-8 text-white/65 max-w-2xl text-base sm:text-lg leading-[1.6] text-center"
      >
        GATEWISE AI unites high-speed on-device Android guard verification with a centralized
        institutional command centre. Sub-300ms edge YuNet camera landmark tracking, SFace 128-D
        cosine vectors, and HMAC-SHA256 non-repudiation cryptographic ledgers on every entry.
      </motion.p>

      {/* Motion Actions */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.8,
          delay: 0.7,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="mt-10 flex flex-col items-center gap-5 w-full"
      >
        {/* Main CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 w-full max-w-md sm:max-w-none">
          {/* Primary Action 1: Launch Web Command Centre */}
          <a
            href="/admin"
            className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-white text-black font-bold text-sm hover:bg-white/90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(255,255,255,0.25)] cursor-pointer group"
          >
            <Monitor className="w-4 h-4 text-black" />
            <span>Launch Web Command Centre</span>
            <ArrowRight className="w-4 h-4 text-black transition-transform group-hover:translate-x-1" />
          </a>

          {/* Primary Action 2: Multi-Platform Downloads */}
          <a
            href="#downloads"
            className="w-full sm:w-auto px-6 py-3.5 rounded-full border border-white/20 bg-white/5 hover:bg-white/10 active:scale-[0.98] transition-all text-sm font-semibold text-white flex items-center justify-center gap-2 cursor-pointer shadow-sm group"
          >
            <Download className="w-4 h-4 text-[#00d2ff]" />
            <span>Download Guard APK & DMG</span>
          </a>

          {/* Tertiary Action: Live Operations */}
          <a
            href="#operations"
            className="w-full sm:w-auto px-5 py-3.5 rounded-full border border-white/10 bg-black/40 hover:bg-white/5 active:scale-[0.98] transition-all text-xs font-semibold text-white/70 hover:text-white flex items-center justify-center gap-2"
          >
            <span>Live Console</span>
          </a>
        </div>

        {/* Clear Platform Support Strip */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs text-white/50 tracking-tight mt-1">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-white/70">
            <Monitor className="w-3 h-3 text-[#00d2ff]" />
            <span>Web App & PWA</span>
          </span>
          <span className="text-white/20">•</span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-white/70">
            <Smartphone className="w-3 h-3 text-emerald-400" />
            <span>Android Guard APK</span>
          </span>
          <span className="text-white/20">•</span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-white/70">
            <span>macOS Universal DMG</span>
          </span>
          <span className="text-white/20">•</span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-white/70">
            <span>Apple iOS TestFlight</span>
          </span>
        </div>
      </motion.div>
    </section>
  );
};
