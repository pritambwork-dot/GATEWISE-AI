'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { HelpCircle, ChevronDown, ShieldCheck, ArrowRight } from 'lucide-react';

export default function FAQPage() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Does GATEWISE AI replace the security guard at the gate?',
      a: 'No. GATEWISE AI operates on the fundamental principle that AI assists the human guard; it never replaces human judgment. The AI provides high-speed candidate matching and clearance telemetry, but the physical officer holds absolute sovereign authority to grant entry, deny entry, or conduct a physical ID check.'
    },
    {
      q: 'How are student and faculty reference photos added to the system?',
      a: 'Reference photos are synchronized directly from existing institutional photo repositories (such as Google Drive folders or campus SIS directories). The repository sync service maps files automatically based on student roll numbers or employee IDs.'
    },
    {
      q: 'What happens if the campus WiFi or 4G network drops at an outdoor gate?',
      a: 'GATEWISE Guard features an offline verification buffer. Recent identity embeddings and active visitor pass codes are cached on the local Android terminal, allowing officers to continue verifying personnel without interruption. Verification events are queued and cryptographically synced once connectivity is restored.'
    },
    {
      q: 'How does the platform handle visitors, contractors, and guest parents?',
      a: 'Authorized campus hosts can issue pre-approved digital visitor passes through the administrator portal. Visitors present their pass code or digital pass at the gate, which the officer scans in seconds. For unannounced walk-ins, officers can register a temporary pass on the Android terminal.'
    },
    {
      q: 'Can students or the public download and sign into the Android app?',
      a: 'Anyone can download the APK file from the public website, but signing in requires an active security officer account provisioned by campus administration. Unauthorized users cannot bypass the authentication barrier.'
    },
    {
      q: 'Is raw biometric face imagery transmitted over the public internet?',
      a: 'No. Gate captures are converted to 128-dimensional vectors in ephemeral device memory, and the raw photograph is purged. The system operates entirely within the institutional intranet or private virtual perimeter.'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 space-y-12">
      {/* Header */}
      <div className="space-y-3">
        <span className="text-[11px] font-bold uppercase tracking-wider text-gatewise-primary bg-gatewise-light px-3 py-1 rounded-full border border-gatewise-mint">
          Operational Inquiries
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-gatewise-text tracking-tight">
          Frequently Asked Questions
        </h1>
        <p className="text-sm text-gatewise-secondary leading-relaxed">
          Common operational, technical, and privacy questions regarding the GATEWISE AI platform.
        </p>
      </div>

      {/* Accordion List */}
      <div className="space-y-3">
        {faqs.map((faq, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-white border border-gatewise-border shadow-xs transition-all"
            >
              <button
                onClick={() => setOpenIdx(isOpen ? null : idx)}
                className="w-full text-left flex items-center justify-between space-x-4"
              >
                <span className="font-bold text-sm text-gatewise-text">{faq.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-gatewise-secondary transition-transform ${isOpen ? 'rotate-180 text-gatewise-primary' : ''}`}
                />
              </button>
              {isOpen && (
                <p className="text-xs text-gatewise-secondary leading-relaxed mt-3 pt-3 border-t border-gatewise-border/70 animate-in fade-in duration-150">
                  {faq.a}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* Still Have Questions Box */}
      <div className="p-8 rounded-3xl bg-background-secondary/60 border border-gatewise-border text-center space-y-3">
        <h3 className="font-black text-base text-gatewise-text">Need Institutional Deployment Support?</h3>
        <p className="text-xs text-gatewise-secondary max-w-md mx-auto">
          Contact our institutional systems engineering team for on-premise installation and hardware sizing assistance.
        </p>
        <Link
          href="/support"
          className="inline-flex items-center space-x-1.5 text-xs font-bold text-gatewise-primary hover:text-gatewise-deep"
        >
          <span>Visit Support Portal</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
