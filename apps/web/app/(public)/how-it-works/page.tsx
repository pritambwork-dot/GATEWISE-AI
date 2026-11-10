'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Camera, Eye, Cpu, Database, CheckCircle2, ShieldCheck,
  Lock, ArrowRight, Smartphone, Check, Clock, AlertTriangle
} from 'lucide-react';

export default function HowItWorksPage() {
  const [activeStep, setActiveStep] = useState(0);

  const pipeline = [
    {
      step: '01',
      title: 'Manual Single-Shot Camera Capture',
      subtitle: 'Tactical Viewfinder Ingress',
      desc: 'When an individual approaches a perimeter gate, the security officer holds the Android terminal in one hand and taps the dedicated shutter trigger. Unlike passive video surveillance, GATEWISE AI captures a single still photograph on command, respecting privacy.',
      tag: 'Edge Android Camera API',
      technical: 'Rear autofocus camera, 1080p still frame, manual shutter trigger.'
    },
    {
      step: '02',
      title: 'YuNet Deep Neural Face Detection',
      subtitle: '5-Point Landmark Extraction',
      desc: 'The frame is processed by an OpenCV Zoo YuNet deep neural network model. YuNet locates the bounding box and extracts 5 facial landmarks (eyes, nose, mouth corners) even if the individual is wearing glasses or looking slightly away from the lens.',
      tag: 'OpenCV Zoo YuNet',
      technical: 'Input size 320x320, inference ~42ms, confidence threshold >= 0.70.'
    },
    {
      step: '03',
      title: 'Automated Image Quality Filtering',
      subtitle: 'Blur & Illumination Assessment',
      desc: 'The candidate crop is assessed before computing biometric embeddings. If the face bounding box is smaller than 60px (too distant) or the image is blurred from fast motion, the app alerts the guard to retake the shot rather than generating a spurious mismatch.',
      tag: 'Quality Pre-filter',
      technical: 'Laplacian variance blur detection, minimum face width >= 60px.'
    },
    {
      step: '04',
      title: 'SFace 128-D Vector Embedding',
      subtitle: 'Non-Invertible Mathematical Projection',
      desc: 'The aligned face crop is passed through the SFace neural network. SFace converts facial topography into a 128-dimensional floating-point vector that is normalized on the unit hypersphere. The raw photo is then discarded from memory.',
      tag: 'OpenCV Zoo SFace',
      technical: '128-D L2-normalized float32 vector, non-reversible representation.'
    },
    {
      step: '05',
      title: 'Cosine Similarity Candidate Matching',
      subtitle: 'Instant Vector Distance Query',
      desc: 'The probe vector is matched against pre-indexed reference embeddings in the institutional database. The highest cosine similarity score is evaluated: >= 0.90 is a High Confidence Match, 0.70 - 0.89 is a Potential Match requiring visual check, and < 0.70 is an Unknown Person.',
      tag: 'Vector Search',
      technical: 'Cosine similarity metric (dot product of normalized vectors), latency ~18ms.'
    },
    {
      step: '06',
      title: 'Deterministic Authorization Clearance',
      subtitle: 'Decoupled Access Policy Check',
      desc: 'Finding a matching face does NOT automatically clear entry. The system checks the subject institutional record: Is their student/faculty status active? Is their card expired? Are they permitted at this specific gate post during this hour?',
      tag: 'Institutional Policy Engine',
      technical: 'Evaluates clearance level, active status, gate curfew, and suspension flags.'
    },
    {
      step: '07',
      title: 'Side-by-Side Presentation to Officer',
      subtitle: 'Sovereign Human Inspection',
      desc: 'The guard terminal screen presents the live capture alongside the approved institutional reference photograph, along with the student name, department, roll number, and unambiguous color-coded match badge.',
      tag: 'Tactical UI / UX',
      technical: 'Human visual comparison window with dual card layout.'
    },
    {
      step: '08',
      title: 'Cryptographic HMAC-SHA256 Sealing',
      subtitle: 'Immutable Non-Repudiation Audit',
      desc: 'The guard taps Grant Entry or Deny Entry. The final decision, station ID, timestamp, and guard credentials are cryptographically signed using an HMAC-SHA256 server secret, guaranteeing that entry logs cannot be falsified or altered.',
      tag: 'Cryptographic Security',
      technical: 'HMAC-SHA256 signature generated, saved to audit log table.'
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 space-y-16">
      {/* Header */}
      <div className="max-w-2xl space-y-3">
        <span className="text-[11px] font-bold uppercase tracking-wider text-gatewise-primary bg-gatewise-light px-3 py-1 rounded-full border border-gatewise-mint">
          Operational Mechanics
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-gatewise-text tracking-tight">
          How Verification Works at the Gate
        </h1>
        <p className="text-sm text-gatewise-secondary leading-relaxed">
          From the physical press of the shutter button to the cryptographic sealing of the gate audit log — explore each phase of the GATEWISE AI pipeline.
        </p>
      </div>

      {/* Interactive Step Explorer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Step Selector List */}
        <div className="lg:col-span-5 space-y-2">
          {pipeline.map((item, idx) => (
            <button
              key={idx}
              onClick={() => setActiveStep(idx)}
              className={`w-full p-4 rounded-2xl text-left transition-all border flex items-center justify-between ${
                activeStep === idx
                  ? 'bg-white border-gatewise-primary shadow-xs'
                  : 'bg-white/60 border-gatewise-border hover:bg-white text-gatewise-secondary'
              }`}
            >
              <div className="flex items-center space-x-3">
                <span
                  className={`font-mono text-xs font-bold px-2 py-0.5 rounded-lg ${
                    activeStep === idx
                      ? 'bg-gatewise-light text-gatewise-deep border border-gatewise-mint'
                      : 'bg-background-secondary text-gatewise-secondary'
                  }`}
                >
                  {item.step}
                </span>
                <span className={`text-xs font-bold ${activeStep === idx ? 'text-gatewise-text' : ''}`}>
                  {item.title}
                </span>
              </div>
              <CheckCircle2
                className={`w-4 h-4 shrink-0 ${activeStep === idx ? 'text-gatewise-primary' : 'text-transparent'}`}
              />
            </button>
          ))}
        </div>

        {/* Step Detail Card */}
        <div className="lg:col-span-7 p-8 rounded-3xl bg-white border border-gatewise-border shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-black text-gatewise-primary bg-gatewise-light px-3 py-1 rounded-full border border-gatewise-mint">
              STAGE {pipeline[activeStep].step} OF 08
            </span>
            <span className="text-xs font-mono text-gatewise-secondary bg-background-secondary px-2.5 py-1 rounded-lg border border-gatewise-border">
              {pipeline[activeStep].tag}
            </span>
          </div>

          <div>
            <h2 className="text-2xl font-black text-gatewise-text">
              {pipeline[activeStep].title}
            </h2>
            <span className="text-xs font-bold text-gatewise-primary mt-1 block">
              {pipeline[activeStep].subtitle}
            </span>
          </div>

          <p className="text-sm text-gatewise-secondary leading-relaxed">
            {pipeline[activeStep].desc}
          </p>

          <div className="p-4 rounded-2xl bg-background-secondary border border-gatewise-border space-y-1">
            <span className="text-[10px] uppercase font-bold text-gatewise-secondary tracking-wider block">
              Technical Specification
            </span>
            <p className="font-mono text-xs text-gatewise-text">
              {pipeline[activeStep].technical}
            </p>
          </div>

          <div className="pt-4 border-t border-gatewise-border flex items-center justify-between">
            <button
              onClick={() => setActiveStep((prev) => (prev > 0 ? prev - 1 : 0))}
              disabled={activeStep === 0}
              className="text-xs font-bold text-gatewise-secondary hover:text-gatewise-text disabled:opacity-30"
            >
              &larr; Previous Stage
            </button>

            <button
              onClick={() => setActiveStep((prev) => (prev < pipeline.length - 1 ? prev + 1 : prev))}
              disabled={activeStep === pipeline.length - 1}
              className="px-4 py-2 rounded-xl bg-gatewise-primary text-white text-xs font-bold hover:bg-gatewise-deep transition-all shadow-xs disabled:opacity-30"
            >
              Next Stage &rarr;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
