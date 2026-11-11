'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, Shield, Smartphone } from 'lucide-react';
import { LogoMark } from '../primitives/LogoMark';
import { AppleButton } from '../primitives/AppleButton';

const NAV_LINKS = [
  { name: 'Platform', href: '#platform' },
  { name: 'Guard App', href: '#guard-app' },
  { name: 'Live Operations', href: '#operations' },
  { name: 'Architecture', href: '#architecture' },
  { name: 'Pricing', href: '#pricing' },
  { name: 'Security', href: '#security' },
];

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="relative z-30 pt-6"
    >
      <nav className="w-full max-w-[1600px] mx-auto px-6 lg:px-12 flex items-center justify-between">
        {/* Left: Logo + Brand Title */}
        <a href="#" className="flex items-center gap-3 group" aria-label="GATEWISE AI">
          <LogoMark className="w-8 h-8 transition-transform group-hover:scale-105" />
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-bold text-base text-white tracking-tight">GATEWISE</span>
              <span className="px-1.5 py-0.2 rounded bg-gradient-to-r from-[#00d2ff] to-[#3D81E3] text-[10px] font-extrabold text-black uppercase tracking-wider">
                AI
              </span>
            </div>
            <span className="text-[10px] text-white/40 tracking-wider uppercase font-mono">
              Sovereign Access System
            </span>
          </div>
        </a>

        {/* Center: Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link, i) => (
            <motion.a
              key={link.name}
              href={link.href}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 + i * 0.05, ease: 'easeOut' }}
              className="text-white/70 text-sm font-medium hover:text-white transition-colors relative py-1"
            >
              {link.name}
            </motion.a>
          ))}
        </div>

        {/* Right Desktop: Deploy Action */}
        <div className="hidden lg:flex items-center gap-4">
          <div className="hidden xl:flex items-center gap-2 text-xs text-white/50 border-r border-white/10 pr-4">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Campus Production v1.0</span>
          </div>
          <AppleButton label="Download Guard APK" icon="android" />
        </div>

        {/* Mobile Right: Menu button */}
        <div className="lg:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="w-10 h-10 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-white/80 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="lg:hidden px-6 pt-4 pb-6 overflow-hidden"
          >
            <div className="liquid-glass rounded-2xl p-6 flex flex-col gap-4 border border-white/10">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <span className="text-xs text-white/50 uppercase font-mono">Operations Navigation</span>
                <span className="text-xs text-emerald-400 font-mono">v1.0.0 Verified</span>
              </div>
              {NAV_LINKS.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-white/80 text-base font-medium py-1 hover:text-white transition-colors"
                >
                  {link.name}
                </a>
              ))}
              <div className="pt-2 border-t border-white/10 flex flex-col gap-3">
                <AppleButton label="Download Guard APK" icon="android" full />
                <button
                  type="button"
                  className="w-full py-3 rounded-full border border-white/15 text-white text-xs font-semibold hover:bg-white/5 transition-colors"
                >
                  Universal macOS DMG (1.2 MB)
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};
