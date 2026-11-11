import React from 'react';
import { LogoMark } from '../primitives/LogoMark';

export const Footer: React.FC = () => {
  return (
    <footer className="relative z-10 border-t border-white/10 w-full max-w-[1600px] mx-auto px-6 lg:px-12 py-14 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-white/50">
      <div className="flex items-center gap-3">
        <LogoMark className="w-6 h-6 text-white/90" />
        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
          <span className="font-bold text-white/90">GATEWISE AI</span>
          <span className="hidden sm:inline">•</span>
          <span>© {new Date().getFullYear()} GATEWISE Technologies Inc. Sovereign Perimeter Operations.</span>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-6">
        <a href="#security" className="hover:text-white transition-colors">
          Security Whitepaper
        </a>
        <a href="#privacy" className="hover:text-white transition-colors">
          Zero-Image Privacy Policy
        </a>
        <a href="#compliance" className="hover:text-white transition-colors">
          ISO 27001 &amp; DPDP
        </a>
        <div className="flex items-center gap-2 text-emerald-400 font-mono">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>All Perimeter Gates Operational</span>
        </div>
      </div>
    </footer>
  );
};
