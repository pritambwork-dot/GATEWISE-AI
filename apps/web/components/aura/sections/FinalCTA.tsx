'use client';
import React from 'react';
import { motion } from 'motion/react';
import { ChevronRight, ShieldCheck, Download } from 'lucide-react';
import { AppleButton } from '../primitives/AppleButton';

export const FinalCTA: React.FC = () => {
  return (
    <section className="relative z-10 w-full max-w-[1600px] mx-auto px-6 lg:px-12 py-20 md:py-32">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="liquid-glass relative overflow-hidden rounded-3xl px-8 py-16 md:py-24 text-center border border-white/10"
      >
        {/* Radial glow overlay */}
        <div
          className="pointer-events-none absolute inset-0 opacity-30"
          style={{
            background:
              'radial-gradient(800px circle at 50% 0%, rgba(0,210,255,0.2), transparent 70%)',
          }}
        />

        {/* Heading */}
        <h2 className="relative z-10 text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight leading-[1.02] text-white">
          Close the gates to risk.
          <br />
          Open your campus.
        </h2>

        {/* Paragraph */}
        <p className="relative z-10 mt-6 text-white/65 max-w-xl mx-auto text-base sm:text-lg leading-[1.6]">
          Join leading educational institutions and enterprise campuses that protect their
          perimeter with mathematical certainty — not fragile paper logbooks.
        </p>

        {/* Action Buttons */}
        <div className="relative z-10 mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <AppleButton label="Download Guard APK" icon="android" />
          <button
            type="button"
            className="group rounded-full border border-white/15 bg-white/5 text-white text-sm font-semibold px-6 py-3.5 hover:bg-white/10 active:scale-[0.98] transition-all flex items-center gap-2"
          >
            <span>Book Campus Demonstration</span>
            <ChevronRight className="w-4 h-4 text-white/60 transition-transform duration-200 group-hover:translate-x-[2px]" />
          </button>
        </div>

        {/* Release Integrity Footnote */}
        <div className="relative z-10 mt-8 flex items-center justify-center gap-2 font-mono text-[11px] text-white/40">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span>PRODUCTION SHA-256 SIGNED BINARIES AVAILABLE</span>
        </div>
      </motion.div>
    </section>
  );
};
