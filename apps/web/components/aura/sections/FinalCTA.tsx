import React from 'react';
import { motion } from 'motion/react';
import { ChevronRight, ShieldCheck, Download, Monitor } from 'lucide-react';
import { AppleButton } from '../primitives/AppleButton';

export const FinalCTA: React.FC = () => {
  return (
    <section className="relative z-10 w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-12 py-14 md:py-32">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="liquid-glass relative overflow-hidden rounded-2xl sm:rounded-3xl px-5 sm:px-8 py-12 sm:py-16 md:py-24 text-center border border-white/10"
      >
        {/* Radial glow overlay */}
        <div
          className="pointer-events-none absolute inset-0 opacity-30"
          style={{
            background:
              'radial-gradient(800px circle at 50% 0%, rgba(47,91,255,0.25), rgba(18,181,166,0.12) 40%, transparent 70%)',
          }}
        />

        {/* Heading */}
        <h2 className="relative z-10 text-3xl sm:text-6xl md:text-7xl font-bold tracking-tight leading-[1.02] text-white">
          Close the gates to risk.
          <br />
          Open your campus.
        </h2>

        {/* Paragraph */}
        <p className="relative z-10 mt-5 sm:mt-6 text-white/65 max-w-xl mx-auto text-sm sm:text-lg leading-[1.6] px-2">
          Join leading educational institutions and enterprise campuses that protect their
          perimeter with mathematical certainty — not fragile paper logbooks.
        </p>

        {/* Action Buttons */}
        <div className="relative z-10 mt-8 sm:mt-10 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 w-full max-w-sm sm:max-w-none mx-auto">
          <a
            href="/admin"
            className="w-full sm:w-auto px-6 py-3.5 min-h-[48px] rounded-full bg-white text-black font-bold text-sm hover:bg-white/90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-[0_0_24px_rgba(255,255,255,0.25)] cursor-pointer"
          >
            <Monitor className="w-4 h-4 text-black" />
            <span>Launch Web Command Centre</span>
          </a>

          <a
            href="#downloads"
            className="w-full sm:w-auto px-6 py-3.5 min-h-[48px] rounded-full border border-white/20 bg-white/5 text-white text-sm font-semibold hover:bg-white/10 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Download className="w-4 h-4 text-[#12B5A6]" />
            <span>Download Guard APK</span>
          </a>
        </div>

        {/* Release Integrity Footnote */}
        <div className="relative z-10 mt-8 flex items-center justify-center gap-2 font-mono text-[10px] sm:text-[11px] text-white/40">
          <span className="w-1.5 h-1.5 rounded-full bg-[#1FB36B] shrink-0" />
          <span className="truncate">PRODUCTION SHA-256 SIGNED BINARIES AVAILABLE</span>
        </div>
      </motion.div>
    </section>
  );
};
