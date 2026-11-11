import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Activity, Search, Wifi } from 'lucide-react';
import { AppleLogo } from '../primitives/AppleLogo';

const MENU_ITEMS = [
  'Perimeter',
  'Guard Posts',
  'Identities',
  'YuNet Mesh',
  'Ledger',
  'Window',
  'Help',
];

export const MenuBarStrip: React.FC = () => {
  const [currentTime, setCurrentTime] = useState('Wed May 6 1:09 PM');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleDateString('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
          hour: 'numeric',
          minute: '2-digit',
          hour12: true,
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.7,
        delay: 0.9,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="relative z-10 w-full h-11 bg-black/50 backdrop-blur-md border-t border-b border-white/10 select-none"
    >
      <div className="w-full max-w-[1600px] mx-auto px-6 lg:px-12 h-full flex items-center justify-between text-xs text-white/80">
        {/* Left side: Apple logo + GATEWISE AI + Menu items */}
        <div className="flex items-center gap-5 sm:gap-6">
          <div className="flex items-center gap-2.5">
            <AppleLogo className="w-3.5 h-3.5 text-white/90" />
            <span className="font-bold text-white tracking-tight">GATEWISE AI</span>
          </div>

          <div className="flex items-center gap-4 sm:gap-5 text-white/70">
            {MENU_ITEMS.map((item, index) => {
              let visibility = 'inline';
              if (index > 4) {
                visibility = 'hidden lg:inline';
              } else if (index > 2) {
                visibility = 'hidden sm:inline';
              }

              return (
                <span
                  key={item}
                  className={`cursor-pointer hover:text-white transition-colors ${visibility}`}
                >
                  {item}
                </span>
              );
            })}
          </div>
        </div>

        {/* Right side: Operations Telemetry & Time */}
        <div className="flex items-center gap-5 text-white/70">
          <div className="hidden sm:flex items-center gap-3 font-mono text-[11px] text-white/60">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              4 Gates Online
            </span>
            <span>•</span>
            <span className="text-white/50">12 Guards Active</span>
            <span>•</span>
            <span className="text-[#00d2ff]">242ms Edge Match</span>
          </div>

          <div className="flex items-center gap-3">
            <Wifi className="w-3.5 h-3.5 text-white/50" />
            <button
              type="button"
              className="hover:text-white transition-colors flex items-center"
              aria-label="Search operations"
            >
              <Search className="w-3.5 h-3.5 text-white/60" />
            </button>
            <span className="text-white/70 font-medium tracking-tight whitespace-nowrap">
              {currentTime}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
