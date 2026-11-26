import React from 'react';
import { Metadata } from 'next';
import { GuardWebApp } from '@/components/guard/GuardWebApp';

export const metadata: Metadata = {
  title: 'GATEWISE Guard — Sovereign Field Verification Web App',
  description:
    'Sovereign zero-install mobile web terminal for campus perimeter security officers at IIM Sambalpur. Edge facial verification, visitor pass scanning, and real-time Command Centre sync.',
};

export default function GuardPage() {
  return (
    <div className="min-h-screen bg-[#F6F7FB] flex flex-col items-center justify-center p-0 sm:p-4">
      {/* Container constrained to mobile viewport on desktop or full on mobile */}
      <div className="w-full max-w-md min-h-screen sm:min-h-[820px] bg-white sm:rounded-[32px] sm:shadow-2xl overflow-hidden border border-black/5 flex flex-col">
        <GuardWebApp embedded={false} />
      </div>
    </div>
  );
}
