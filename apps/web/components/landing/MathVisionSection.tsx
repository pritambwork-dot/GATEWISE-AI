'use client';

import React from 'react';
import { motion } from 'motion/react';
import { DoodleSparkle, DoodleArrowNote } from '@/components/landing/EditorialDoodles';

export const MathVisionSection: React.FC<{ animateVisuals: boolean }> = ({ animateVisuals }) => {
  return (
    <section id="math" className="bg-white border-b border-[#DCE1EC]">
      <div className="max-w-[1080px] mx-auto px-4 sm:px-6 lg:px-0 py-16 sm:py-24">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-10 mb-12 border-b border-[#DCE1EC]">
          <div className="relative">
            <DoodleSparkle
              className="hidden sm:block absolute w-6 h-6 -top-5 -left-7 pointer-events-none"
              color="#2F5BFF"
              animate={animateVisuals}
            />
            <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-[#2F5BFF] block mb-2">
              MATHEMATICAL FOUNDATIONS
            </span>
            <h2 className="font-display font-bold uppercase text-4xl sm:text-5xl tracking-tight text-[#0A0E1A]">
              The Math Behind Every Gate Scan.
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[#475569] max-w-sm">
            From Haar-like integral windows and Softmax confidence normalization to 128-D cosine
            geometry and LSTM ANPR contrast stretching.
          </p>
        </div>

        {/* 2x2 Animated Math + Doodle Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* 1. SOFTMAX PROBABILITY */}
          <motion.article
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.4 }}
            className="border border-[#DCE1EC] bg-[#FAF9F6] p-6 space-y-5 relative"
          >
            <DoodleArrowNote
              label="sums to 1.0!"
              direction="left"
              className="hidden sm:inline-flex absolute -top-4 right-5 pointer-events-none"
            />
            <div className="space-y-1.5">
              <span className="font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-[#2F5BFF]">
                01 · CLASSIFICATION CONFIDENCE
              </span>
              <h3 className="font-display text-2xl font-bold uppercase text-[#0A0E1A]">
                Softmax Normalization
              </h3>
              <p className="text-xs text-[#475569] leading-relaxed">
                Converts raw neural logits <code className="font-mono text-[#0A0E1A]">z_i</code> into
                calibrated class probabilities summing to 100% before gate decisioning.
              </p>
            </div>

            <div className="border border-[#DCE1EC] bg-white p-3 font-mono text-xs text-center text-[#0A0E1A]">
              <span className="text-[#2F5BFF] font-bold">σ(z)ᵢ</span> = e^(zᵢ) / Σⱼ e^(zⱼ)
            </div>

            <div className="border border-[#DCE1EC] bg-white p-4">
              <svg viewBox="0 0 300 110" className="w-full h-28" fill="none" aria-hidden="true">
                <text x="12" y="22" className="fill-[#475569] font-mono text-[8px] font-bold">
                  LOGIT z=[3.2, 1.1, 0.4]
                </text>
                <text x="12" y="48" className="fill-[#0A0E1A] font-mono text-[9px] font-bold">
                  MATCH
                </text>
                <rect x="64" y="38" width="180" height="14" fill="#EEF2FF" />
                <motion.rect
                  x="64"
                  y="38"
                  height="14"
                  fill="#2F5BFF"
                  animate={animateVisuals ? { width: [110, 152, 110] } : { width: 150 }}
                  transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
                />
                <text x="252" y="48" className="fill-[#2F5BFF] font-mono text-[9px] font-bold">
                  84.6%
                </text>

                <text x="12" y="72" className="fill-[#475569] font-mono text-[9px]">
                  OTHER
                </text>
                <rect x="64" y="62" width="180" height="14" fill="#F1F5F9" />
                <motion.rect
                  x="64"
                  y="62"
                  height="14"
                  fill="#0D9488"
                  animate={animateVisuals ? { width: [38, 19, 38] } : { width: 19 }}
                  transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
                />
                <text x="252" y="72" className="fill-[#0D9488] font-mono text-[9px] font-bold">
                  10.3%
                </text>

                <text x="12" y="96" className="fill-[#475569] font-mono text-[9px]">
                  NOISE
                </text>
                <rect x="64" y="86" width="180" height="14" fill="#F1F5F9" />
                <rect x="64" y="86" width="10" height="14" fill="#94A3B8" />
                <text x="252" y="96" className="fill-[#475569] font-mono text-[9px]">
                  5.1%
                </text>
              </svg>
            </div>
          </motion.article>

          {/* 2. HAAR CASCADE & INTEGRAL IMAGE */}
          <motion.article
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.4, delay: 0.06 }}
            className="border border-[#DCE1EC] bg-[#FAF9F6] p-6 space-y-5 relative"
          >
            <div className="space-y-1.5">
              <span className="font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-[#0D9488]">
                02 · CASCADE FEATURE WINDOWS
              </span>
              <h3 className="font-display text-2xl font-bold uppercase text-[#0A0E1A]">
                Haar Cascade &amp; Integral Image
              </h3>
              <p className="text-xs text-[#475569] leading-relaxed">
                Computes rectangular edge/eye-bridge contrast in <code className="font-mono text-[#0A0E1A]">O(1)</code>{' '}
                time using 4-corner integral sums before deep landmark alignment.
              </p>
            </div>

            <div className="border border-[#DCE1EC] bg-white p-3 font-mono text-xs text-center text-[#0A0E1A]">
              <span className="text-[#0D9488] font-bold">Sum(R)</span> = II(D) − II(B) − II(C) + II(A)
            </div>

            <div className="border border-[#DCE1EC] bg-white p-4">
              <svg viewBox="0 0 300 110" className="w-full h-28" fill="none" aria-hidden="true">
                {/* Face grid */}
                <rect x="26" y="14" width="82" height="82" fill="#FAF9F6" stroke="#0A0E1A" strokeWidth="1.5" />
                <circle cx="67" cy="54" r="24" stroke="#CBD5E1" strokeWidth="1.5" strokeDasharray="3 3" />
                <circle cx="58" cy="48" r="2.5" fill="#0A0E1A" />
                <circle cx="76" cy="48" r="2.5" fill="#0A0E1A" />
                <path d="M59 63 C63 67 71 67 75 63" stroke="#0A0E1A" strokeWidth="1.5" strokeLinecap="round" />

                {/* Sliding Haar Feature Window */}
                <motion.g
                  animate={animateVisuals ? { x: [0, 18, 0], y: [0, 10, 0] } : {}}
                  transition={{ duration: 3.6, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <rect x="44" y="38" width="24" height="12" fill="#2F5BFF" fillOpacity="0.25" stroke="#2F5BFF" strokeWidth="1.4" />
                  <rect x="44" y="50" width="24" height="12" fill="#0A0E1A" fillOpacity="0.8" />
                </motion.g>

                {/* Arrow to Integral Matrix */}
                <path d="M122 55 H158 M152 50 L159 55 L152 60" stroke="#2F5BFF" strokeWidth="2" strokeLinecap="round" />

                {/* Integral Image Box */}
                <rect x="172" y="18" width="108" height="74" fill="#EEF2FF" stroke="#2F5BFF" strokeWidth="1.5" />
                <text x="226" y="38" textAnchor="middle" className="fill-[#2F5BFF] font-mono text-[8px] font-bold">
                  INTEGRAL GRID
                </text>
                <text x="226" y="56" textAnchor="middle" className="fill-[#0A0E1A] font-mono text-[9px] font-bold">
                  Σ(+) − Σ(−) &gt; θ
                </text>
                <text x="226" y="75" textAnchor="middle" className="fill-[#0D9488] font-mono text-[8px] font-bold">
                  STAGE PASS ✓
                </text>
              </svg>
            </div>
          </motion.article>

          {/* 3. 128-D COSINE SIMILARITY */}
          <motion.article
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.4, delay: 0.12 }}
            className="border border-[#DCE1EC] bg-[#FAF9F6] p-6 space-y-5 relative"
          >
            <DoodleArrowNote
              label="θ → 0° = match!"
              direction="right"
              className="hidden sm:inline-flex absolute -top-4 left-5 pointer-events-none"
            />
            <div className="space-y-1.5">
              <span className="font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-[#2F5BFF]">
                03 · RESNET-34 METRIC SPACE
              </span>
              <h3 className="font-display text-2xl font-bold uppercase text-[#0A0E1A]">
                128-D Cosine Similarity
              </h3>
              <p className="text-xs text-[#475569] leading-relaxed">
                Measures the angular proximity between L2-normalized live face embeddings and
                central <code className="font-mono text-[#0A0E1A]">face_biometrics</code> vectors.
              </p>
            </div>

            <div className="border border-[#DCE1EC] bg-white p-3 font-mono text-xs text-center text-[#0A0E1A]">
              <span className="text-[#2F5BFF] font-bold">cos(θ)</span> = (A · B) / (‖A‖ ‖B‖) ≥ 0.78
            </div>

            <div className="border border-[#DCE1EC] bg-white p-4">
              <svg viewBox="0 0 300 110" className="w-full h-28" fill="none" aria-hidden="true">
                {/* Axes */}
                <line x1="40" y1="92" x2="260" y2="92" stroke="#CBD5E1" strokeWidth="1.2" />
                <line x1="40" y1="92" x2="40" y2="14" stroke="#CBD5E1" strokeWidth="1.2" />

                {/* DB Vector */}
                <line x1="40" y1="92" x2="178" y2="28" stroke="#0A0E1A" strokeWidth="2.2" />
                <circle cx="178" cy="28" r="3.5" fill="#0A0E1A" />
                <text x="186" y="31" className="fill-[#0A0E1A] font-mono text-[8px] font-bold">
                  V_DB
                </text>

                {/* Live Vector rotating closer */}
                <motion.line
                  x1="40"
                  y1="92"
                  x2="188"
                  y2="46"
                  stroke="#2F5BFF"
                  strokeWidth="2.4"
                  animate={animateVisuals ? { y2: [58, 36, 58] } : {}}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                />
                <text x="196" y="54" className="fill-[#2F5BFF] font-mono text-[8px] font-bold">
                  V_LIVE
                </text>

                {/* Angle arc */}
                <path d="M98 65 A64 64 0 0 1 104 73" stroke="#0D9488" strokeWidth="2" />
                <text x="112" y="75" className="fill-[#0D9488] font-mono text-[8px] font-bold">
                  θ ≈ 19°
                </text>

                <rect x="220" y="64" width="68" height="22" fill="#F0FDFA" stroke="#0D9488" />
                <text x="254" y="78" textAnchor="middle" className="fill-[#0D9488] font-mono text-[8px] font-bold">
                  0.94 ≥ 0.78
                </text>
              </svg>
            </div>
          </motion.article>

          {/* 4. ANPR CONTRAST STRETCHING & LSTM OCR */}
          <motion.article
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.4, delay: 0.18 }}
            className="border border-[#DCE1EC] bg-[#FAF9F6] p-6 space-y-5 relative"
          >
            <div className="space-y-1.5">
              <span className="font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-[#0D9488]">
                04 · TESSERACT LSTM ANPR
              </span>
              <h3 className="font-display text-2xl font-bold uppercase text-[#0A0E1A]">
                Contrast Stretch &amp; CTC Decoding
              </h3>
              <p className="text-xs text-[#475569] leading-relaxed">
                Normalizes rear-camera plate luminance across glare/shadow before LSTM sequence
                decoding extracts <code className="font-mono text-[#0A0E1A]">[A-Z0-9]</code> tokens.
              </p>
            </div>

            <div className="border border-[#DCE1EC] bg-white p-3 font-mono text-xs text-center text-[#0A0E1A]">
              <span className="text-[#0D9488] font-bold">I_out</span> = 255 · (I_in − min) / (max − min)
            </div>

            <div className="border border-[#DCE1EC] bg-white p-4">
              <svg viewBox="0 0 300 110" className="w-full h-28" fill="none" aria-hidden="true">
                <rect x="20" y="28" width="126" height="44" fill="#FAF9F6" stroke="#0A0E1A" strokeWidth="1.5" />
                <rect x="20" y="28" width="14" height="44" fill="#2F5BFF" />
                <text x="27" y="53" textAnchor="middle" className="fill-white font-mono text-[7px] font-bold">
                  IN
                </text>
                <text x="90" y="54" textAnchor="middle" className="fill-[#0A0E1A] font-mono text-[12px] font-bold tracking-[0.15em]">
                  OD02AB1234
                </text>

                {animateVisuals && (
                  <motion.line
                    x1="38"
                    y1="24"
                    x2="38"
                    y2="76"
                    stroke="#0D9488"
                    strokeWidth="2"
                    animate={{ x1: [38, 140, 38], x2: [38, 140, 38] }}
                    transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
                  />
                )}

                <path d="M156 50 H184 M178 45 L185 50 L178 55" stroke="#2F5BFF" strokeWidth="2" strokeLinecap="round" />

                <rect x="194" y="22" width="90" height="56" fill="#EEF2FF" stroke="#2F5BFF" strokeWidth="1.5" />
                <text x="239" y="42" textAnchor="middle" className="fill-[#2F5BFF] font-mono text-[7.5px] font-bold">
                  LSTM CTC DECODER
                </text>
                <text x="239" y="60" textAnchor="middle" className="fill-[#0A0E1A] font-mono text-[9px] font-bold">
                  PLATE: VERIFIED
                </text>
              </svg>
            </div>
          </motion.article>
        </div>
      </div>
    </section>
  );
};
