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
    <section className="relative z-10 w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-12 py-12 sm:py-16 md:py-24 text-center border-t border-white/5">
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.6 }}
        className="text-[11px] sm:text-xs uppercase tracking-widest text-white/40 font-mono font-medium px-2"
      >
        Verified &amp; Deployed Across Premier Institutional Campuses
      </motion.p>

      <div className="mt-8 sm:mt-12 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4 sm:gap-6 lg:gap-8 items-center">
        {INSTITUTIONS.map((name, i) => (
          <motion.div
            key={name}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5, delay: i * 0.04 }}
            className="flex items-center justify-center py-2 px-1"
          >
            <span className="text-xs sm:text-sm font-semibold tracking-tight text-white/50 hover:text-white transition-colors duration-200 cursor-default select-none text-center">
              {name}
            </span>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
