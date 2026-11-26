'use client';

import React from 'react';
import { GuardWebApp } from '@/components/guard/GuardWebApp';
import { PhoneOnlyGate } from '@/components/guard/PhoneOnlyGate';

export default function GuardPage() {
  return (
    <PhoneOnlyGate>
      <div className="min-h-screen bg-[#F6F7FB] flex flex-col items-center justify-center p-0">
        <div className="w-full max-w-md min-h-screen bg-white overflow-hidden flex flex-col shadow-none sm:shadow-2xl sm:rounded-[32px] sm:my-4 sm:border sm:border-black/5">
          <GuardWebApp embedded={false} />
        </div>
      </div>
    </PhoneOnlyGate>
  );
}
