'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, ArrowRight, X, AlertCircle } from 'lucide-react';

export interface ActionProposalData {
  proposal_id: string;
  action_type: string;
  title: string;
  description: string;
  parameters: Record<string, any>;
  target_url: string;
  requires_confirmation?: boolean;
}

interface ActionProposalCardProps {
  proposal: ActionProposalData;
  onDismiss?: () => void;
  onNavigate?: () => void;
}

export function ActionProposalCard({ proposal, onDismiss, onNavigate }: ActionProposalCardProps) {
  const router = useRouter();
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  const handleExecute = () => {
    if (proposal.target_url) {
      router.push(proposal.target_url);
      if (onNavigate) onNavigate();
    }
  };

  const handleDismiss = () => {
    setDismissed(true);
    if (onDismiss) onDismiss();
  };

  return (
    <div className="my-3 rounded-2xl border-2 border-emerald-500/30 bg-gradient-to-br from-white to-emerald-50/40 p-4 shadow-sm text-gatewise-text transition-all">
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 rounded-lg bg-emerald-600 flex items-center justify-center text-white shrink-0 shadow-xs">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <span className="inline-block text-[10px] font-extrabold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
              Action Proposal · Human Review Required
            </span>
          </div>
        </div>
        <button
          onClick={handleDismiss}
          className="text-gatewise-secondary hover:text-gatewise-text p-1 rounded-lg hover:bg-slate-100 transition-colors"
          title="Dismiss proposal"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="mt-2.5">
        <h4 className="text-xs font-bold text-gatewise-text">{proposal.title}</h4>
        <p className="mt-1 text-xs text-gatewise-secondary leading-relaxed">{proposal.description}</p>
      </div>

      {proposal.parameters && Object.keys(proposal.parameters).length > 0 && (
        <div className="mt-3 p-2 rounded-xl bg-white border border-slate-200/80 text-[11px] space-y-1">
          <span className="font-bold text-slate-700 block text-[10px] uppercase tracking-wide">
            Proposed Parameters
          </span>
          <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-slate-600">
            {Object.entries(proposal.parameters).map(([key, val]) => (
              <div key={key} className="truncate">
                <span className="font-medium text-slate-500">{key}:</span>{' '}
                <span className="font-semibold text-slate-800">{String(val)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-3.5 flex items-center justify-between pt-2 border-t border-emerald-100/60">
        <div className="flex items-center space-x-1.5 text-[10px] text-emerald-700 font-medium">
          <AlertCircle className="w-3 h-3 text-emerald-600" />
          <span>Requires administrator verification</span>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleDismiss}
            className="px-2.5 py-1.5 text-[11px] font-semibold text-slate-600 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition-colors"
          >
            Dismiss
          </button>
          <button
            onClick={handleExecute}
            className="flex items-center space-x-1.5 px-3 py-1.5 text-[11px] font-bold text-white bg-gatewise-primary hover:bg-gatewise-deep rounded-xl shadow-xs transition-all"
          >
            <span>Review & Execute</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
}
