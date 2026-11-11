'use client';
import React from 'react';
import { motion } from 'motion/react';

const INSTITUTIONS = [
  'IIM Sambalpur',
  'IIT Delhi',
  'Silicon Institute',
  'Tata Power Hub',
  'Infosys Campus',
  'Reliance Jamnagar',
  'AIIMS Complex',
  'Defence Estate',
];

export const LogoCloud: React.FC = () => {
  return (
    <section className="relative z-10 w-full max-w-[1600px] mx-auto px-6 lg:px-12 py-16 md:py-24 text-center border-t border-white/5">
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.6 }}
        className="text-xs uppercase tracking-widest text-white/40 font-mono font-medium"
      >
        Verified &amp; Deployed Across Premier Institutional Campuses
      </motion.p>

      <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-6 sm:gap-8 items-center">
        {INSTITUTIONS.map((name, i) => (
          <motion.div
            key={name}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5, delay: i * 0.05 }}
            className="flex items-center justify-center py-2"
          >
            <span className="text-sm font-semibold tracking-tight text-white/50 hover:text-white transition-colors duration-200 cursor-default select-none whitespace-nowrap">
              {name}
            </span>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
