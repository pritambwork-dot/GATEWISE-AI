'use client';

import React, { useState } from 'react';
import { Wrench, ChevronDown, ChevronUp, CheckCircle2, Compass, ShieldAlert } from 'lucide-react';

interface ToolExecutionCardProps {
  toolName: string;
  arguments?: Record<string, any>;
  result?: any;
}

const TOOL_TITLES: Record<string, string> = {
  get_dashboard_summary: 'Queried Institutional Operations Summary',
  get_verification_trends: 'Analyzed Verification Traffic Trends',
  get_gate_activity_summary: 'Retrieved Gate Post Telemetry',
  get_pending_enrollment_summary: 'Queried Pending Identity Referrals',
  get_visitor_summary: 'Retrieved Campus Visitor Metrics',
  get_system_health_summary: 'Executed Subsystem Diagnostics',
  explain_application_workflow: 'Retrieved Institutional Security SOP',
  explain_status: 'Decoded Technical Status Code',
  navigate_to_page: 'Navigated to Administrative View',
  propose_gate_status_change: 'Prepared Gate Transition Proposal',
  propose_enrollment_review: 'Prepared Enrollment Review Proposal',
  propose_visitor_pass: 'Prepared Visitor Pass Proposal',
};

export function ToolExecutionCard({ toolName, arguments: args, result }: ToolExecutionCardProps) {
  const [expanded, setExpanded] = useState(false);
  const displayTitle = TOOL_TITLES[toolName] || `Executed Tool: ${toolName}`;

  return (
    <div className="my-2 rounded-xl border border-emerald-100 bg-emerald-50/50 p-2.5 text-xs text-gatewise-text transition-all">
      <div
        className="flex items-center justify-between cursor-pointer select-none"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center space-x-2">
          <div className="w-5 h-5 rounded-md bg-emerald-100 flex items-center justify-center text-emerald-700">
            {toolName.startsWith('navigate') ? (
              <Compass className="w-3.5 h-3.5" />
            ) : (
              <Wrench className="w-3.5 h-3.5" />
            )}
          </div>
          <span className="font-semibold text-emerald-950 text-[11px]">{displayTitle}</span>
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
        </div>
        <button
          type="button"
          className="text-emerald-700 hover:text-emerald-900 p-0.5"
          aria-label={expanded ? 'Collapse' : 'Expand'}
        >
          {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {expanded && (
        <div className="mt-2.5 pt-2 border-t border-emerald-200/50 space-y-1.5 font-mono text-[10px]">
          {args && Object.keys(args).length > 0 && (
            <div>
              <span className="text-emerald-800 font-bold block mb-0.5">Parameters:</span>
              <pre className="bg-white/80 p-1.5 rounded-lg border border-emerald-200/60 overflow-x-auto text-emerald-900">
                {JSON.stringify(args, null, 2)}
              </pre>
            </div>
          )}
          {result && (
            <div>
              <span className="text-emerald-800 font-bold block mb-0.5">Output Data:</span>
              <pre className="bg-white/80 p-1.5 rounded-lg border border-emerald-200/60 overflow-x-auto text-emerald-900 max-h-36">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
