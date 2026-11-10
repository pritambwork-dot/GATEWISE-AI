'use client';

import React from 'react';
import { Sparkles, Bot } from 'lucide-react';

interface AssistantTriggerButtonProps {
  onClick: () => void;
  isOpen: boolean;
}

export function AssistantTriggerButton({ onClick, isOpen }: AssistantTriggerButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center space-x-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-xs ${
        isOpen
          ? 'bg-emerald-900 text-white'
          : 'bg-emerald-50 text-emerald-900 border border-emerald-200/80 hover:bg-emerald-100 hover:border-emerald-300'
      }`}
      title="Toggle GATEWISE AI Operations Assistant"
    >
      <div className="w-4 h-4 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-700">
        <Sparkles className="w-2.5 h-2.5 text-emerald-600 animate-pulse" />
      </div>
      <span>AI Assistant</span>
      <span className="hidden lg:inline-block px-1.5 py-0.2 rounded-md bg-white/80 border border-emerald-200 text-[9px] font-mono text-emerald-800">
        Ask
      </span>
    </button>
  );
}
