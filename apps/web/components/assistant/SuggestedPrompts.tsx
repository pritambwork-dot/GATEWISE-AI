'use client';

import React from 'react';
import { Sparkles } from 'lucide-react';

interface SuggestedPromptsProps {
  onSelectPrompt: (prompt: string) => void;
  disabled?: boolean;
}

const PROMPTS = [
  "Summarize today's operations",
  "How many enrollment requests are pending?",
  "Show gate activity summary",
  "Check visitor management status",
  "Check subsystem health diagnostics",
  "Explain State D protocol"
];

export function SuggestedPrompts({ onSelectPrompt, disabled }: SuggestedPromptsProps) {
  return (
    <div className="py-2">
      <div className="flex items-center space-x-1.5 px-1 mb-1.5 text-[10px] font-bold uppercase tracking-wider text-gatewise-secondary/70">
        <Sparkles className="w-3 h-3 text-gatewise-primary" />
        <span>Suggested Queries</span>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {PROMPTS.map((prompt) => (
          <button
            key={prompt}
            onClick={() => onSelectPrompt(prompt)}
            disabled={disabled}
            className="text-left px-2.5 py-1 rounded-full border border-slate-200/80 bg-white hover:bg-emerald-50 hover:border-emerald-200 text-slate-700 hover:text-emerald-900 text-[11px] font-medium transition-all disabled:opacity-50 disabled:pointer-events-none shadow-xs"
          >
            {prompt}
          </button>
        ))}
      </div>
    </div>
  );
}
