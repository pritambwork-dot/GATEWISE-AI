import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, Shield, Smartphone, Monitor, Lock, Download, ExternalLink } from 'lucide-react';
import { LogoMark } from '../primitives/LogoMark';
import { AppleButton } from '../primitives/AppleButton';

const NAV_LINKS = [
  { name: 'Platform', href: '#platform' },
  { name: 'Motion Teaser', href: '#motion-showcase' },
  { name: 'Live Operations', href: '#operations' },
  { name: 'Architecture', href: '#architecture' },
  { name: 'Downloads & Web App', href: '#downloads' },
  { name: 'Pricing', href: '#pricing' },
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
        <div className="hidden lg:flex items-center gap-7">
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

        {/* Right Desktop: Command Centre Login & Download CTA */}
        <div className="hidden md:flex items-center gap-3">
          {/* Command Centre Login Button */}
          <a
            href="/admin/login"
            className="px-4 py-2 rounded-full border border-white/20 bg-white/5 hover:bg-white/10 active:scale-[0.98] transition-all text-xs font-semibold text-white flex items-center gap-2 cursor-pointer shadow-sm"
          >
            <Lock className="w-3.5 h-3.5 text-[#00d2ff]" />
            <span>Command Centre</span>
          </a>

          {/* Download Centre CTA */}
          <a
            href="#downloads"
            className="group px-4 py-2 rounded-full bg-white text-black hover:bg-white/90 active:scale-[0.98] transition-all text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-[0_0_20px_rgba(255,255,255,0.2)]"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Apps</span>
          </a>
        </div>

        {/* Mobile Right: Menu button */}
        <div className="lg:hidden flex items-center gap-2">
          <a
            href="/admin/login"
            className="px-3 py-1.5 rounded-full border border-white/20 bg-white/5 text-xs font-medium text-white flex items-center gap-1.5"
          >
            <Lock className="w-3 h-3 text-[#00d2ff]" />
            <span>Login</span>
          </a>
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
                  className="text-white/80 hover:text-white text-sm font-medium py-1 transition-colors"
                >
                  {link.name}
                </a>
              ))}
              <div className="pt-3 border-t border-white/10 flex flex-col gap-2">
                <a
                  href="/admin/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2.5 rounded-xl bg-white/10 text-white font-bold text-xs flex items-center justify-center gap-2 border border-white/15"
                >
                  <Lock className="w-3.5 h-3.5 text-[#00d2ff]" />
                  <span>Command Centre Login</span>
                </a>
                <a
                  href="#downloads"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2.5 rounded-xl bg-white text-black font-bold text-xs flex items-center justify-center gap-2"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Apps & Web Portal</span>
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};
