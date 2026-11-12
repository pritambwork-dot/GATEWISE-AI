import React from 'react';
import { motion } from 'motion/react';

const TESTIMONIALS = [
  {
    quote:
      'GATEWISE gave our 4,000-student campus 300ms verification at the perimeter. Unregistered breaches dropped to zero, and guards operate with complete confidence.',
    author: 'Col. Rajesh Nair',
    role: 'Chief Security Officer',
    company: 'IIM SAMBALPUR',
  },
  {
    quote:
      'The offline HMAC-SHA256 cryptographic ledger means our perimeter operates continuously even during optical fiber breaks. Truly sovereign engineering.',
    author: 'Dr. S. K. Roy',
    role: 'Dean of Infrastructure & Campus Operations',
    company: 'SILICON INSTITUTE',
  },
  {
    quote:
      'On-device YuNet and SFace eliminated privacy concerns since no raw facial photographs ever leave the edge devices or sit in cloud storage.',
    author: 'Meera Patel',
    role: 'Head of Campus IT & Cybersecurity',
    company: 'NATIONAL TECH HUB',
  },
];

export const Testimonials: React.FC = () => {
  return (
    <section className="relative z-10 w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-12 py-14 md:py-28 border-t border-white/10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
        {TESTIMONIALS.map((t, index) => (
          <motion.figure
            key={t.author}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{
              duration: 0.6,
              delay: index * 0.1,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="liquid-glass rounded-2xl p-5 sm:p-7 border border-white/10 flex flex-col justify-between"
          >
            <blockquote className="text-sm sm:text-base text-white/80 leading-[1.6]">
              &ldquo;{t.quote}&rdquo;
            </blockquote>

            <figcaption className="mt-6 sm:mt-8 pt-4 sm:pt-5 border-t border-white/10">
              <div className="text-sm font-semibold text-white">{t.author}</div>
              <div className="text-xs text-white/50 mt-0.5">{t.role}</div>
              <div className="text-xs text-[#12B5A6] font-semibold tracking-wider uppercase mt-2">
                {t.company}
              </div>
            </figcaption>
          </motion.figure>
        ))}
      </div>
    </section>
  );
};
