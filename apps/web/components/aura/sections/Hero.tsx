'use client';
import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Play, ArrowRight, Smartphone, Terminal } from 'lucide-react';
import { AppleButton } from '../primitives/AppleButton';
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
        className="mt-10 flex flex-col items-center gap-4"
      >
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <AppleButton label="Deploy Gatewise Guard" icon="shield" />
          <a
            href="#operations"
            className="group px-6 py-3.5 rounded-full border border-white/15 bg-white/5 hover:bg-white/10 active:scale-[0.98] transition-all text-sm font-semibold text-white flex items-center gap-2"
          >
            <span>Inspect Live Operations</span>
            <ArrowRight className="w-4 h-4 text-white/60 transition-transform group-hover:translate-x-1" />
          </a>
        </div>

        <div className="flex items-center gap-3 text-xs text-white/40 tracking-tight mt-1">
          <span>Native Android Guard APK</span>
          <span>•</span>
          <span>Universal macOS DMG (1.2 MB)</span>
          <span>•</span>
          <span>Apple TestFlight & MDM</span>
        </div>
      </motion.div>
    </section>
  );
};
