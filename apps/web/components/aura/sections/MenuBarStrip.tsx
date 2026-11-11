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
      className="relative z-10 w-full h-11 bg-black/50 backdrop-blur-md border-t border-b border-white/10 select-none overflow-hidden"
    >
      <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-12 h-full flex items-center justify-between text-xs text-white/80">
        {/* Left side: Apple logo + GATEWISE AI + Menu items */}
        <div className="flex items-center gap-3 sm:gap-6">
          <div className="flex items-center gap-2">
            <AppleLogo className="w-3.5 h-3.5 text-white/90 shrink-0" />
            <span className="font-bold text-white tracking-tight text-xs sm:text-sm whitespace-nowrap">GATEWISE AI</span>
          </div>

          {/* Desktop Menu Items */}
          <div className="hidden sm:flex items-center gap-4 sm:gap-5 text-white/70">
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
                  className={`cursor-pointer hover:text-white transition-colors text-xs ${visibility}`}
                >
                  {item}
                </span>
              );
            })}
          </div>

          {/* Mobile Live Pill */}
          <div className="sm:hidden font-mono text-[10px] text-emerald-400 flex items-center gap-1.5 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>4 Gates Online</span>
          </div>
        </div>

        {/* Right side: Operations Telemetry & Time */}
        <div className="flex items-center gap-2.5 sm:gap-5 text-white/70">
          <div className="hidden md:flex items-center gap-3 font-mono text-[11px] text-white/60">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              4 Gates Online
            </span>
            <span>•</span>
            <span className="text-white/50">12 Guards Active</span>
            <span>•</span>
            <span className="text-[#00d2ff]">242ms Edge Match</span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <Wifi className="w-3.5 h-3.5 text-white/50 shrink-0" />
            <span className="text-white/70 font-medium tracking-tight whitespace-nowrap text-[11px] sm:text-xs">
              {currentTime}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
