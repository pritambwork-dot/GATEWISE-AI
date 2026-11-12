'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Hexagon,
  FileText,
  ArrowLeft,
  Camera,
  CheckCircle2,
  AlertOctagon,
  Clock,
  User,
  ExternalLink,
  ShieldAlert
} from 'lucide-react';

export default function VerificationEventPage() {
  const [activeTab, setActiveTab] = useState<'event' | 'list'>('event');

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Page Title & Controls */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              Verification event
            </h1>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#EBF0FF] text-[#2F5BFF]">
              Confirmed core capability
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            One event from capture to final outcome.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/admin/repository"
            className="px-4 py-2 rounded-full text-xs font-medium bg-[#2F5BFF] text-white hover:bg-[#254EDB] transition-colors shadow-xs"
          >
            Photograph review
          </Link>
          <Link
            href="/admin/audit"
            className="px-4 py-2 rounded-full text-xs font-medium bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors shadow-xs"
          >
            Audit history
          </Link>
          <Link
            href="/admin/activity"
            className="px-4 py-2 rounded-full text-xs font-medium bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors shadow-xs"
          >
            Back to events
          </Link>
        </div>
      </div>

      {/* Dark Biometric Warning Banner (Page 12) */}
      <div className="bg-[#0B0F19] text-white rounded-2xl p-4 text-xs flex items-center gap-3 shadow-md">
        <Hexagon className="w-4 h-4 text-white shrink-0" />
        <p className="leading-relaxed text-slate-200">
          Biometric images are role-gated, never public, and every view is written to the audit log. Face embeddings are never displayed. Images are never sent to a general-purpose AI.
        </p>
      </div>

      {/* Outcome Distribution Bar */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
        <h2 className="text-sm font-bold text-slate-900">Outcome distribution</h2>
        <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden" />
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-slate-600">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#1FB36B]" /> Permitted · —
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#C93338]" /> Denied · —
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#2F5BFF]" /> Referred · —
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-500" /> Pending · —
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-slate-400" /> Failed or unavailable · —
          </span>
        </div>
      </div>

      {/* 4 Detail Cards in 2x2 Grid (Page 12) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: Event information */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900">Event information</h3>
          <div className="space-y-3 text-xs divide-y divide-slate-100">
            <div className="flex items-center justify-between pt-2">
              <span className="text-slate-500">Event ID</span>
              <span className="font-mono text-slate-700">—</span>
            </div>
            <div className="flex items-center justify-between pt-2">
              <span className="text-slate-500">Timestamp</span>
              <span className="font-mono text-slate-700">—</span>
            </div>
            <div className="flex items-center justify-between pt-2">
              <span className="text-slate-500">Gate</span>
              <span className="font-mono text-slate-700">—</span>
            </div>
            <div className="flex items-center justify-between pt-2">
              <span className="text-slate-500">Guard</span>
              <span className="font-mono text-slate-700">—</span>
            </div>
            <div className="flex items-center justify-between pt-2">
              <span className="text-slate-500">Session ID</span>
              <span className="font-mono text-slate-700">—</span>
            </div>
          </div>
        </div>

        {/* Card 2: Photograph information */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-4">Photograph information</h3>
            <div className="space-y-3 text-xs divide-y divide-slate-100">
              <div className="flex items-center justify-between pt-2">
                <span className="text-slate-500">Captured image</span>
                <span className="font-mono text-slate-700">—</span>
              </div>
              <div className="flex items-center justify-between pt-2">
                <span className="text-slate-500">Approved reference photograph</span>
                <span className="font-mono text-slate-700">—</span>
              </div>
              <div className="flex items-center justify-between pt-2">
                <span className="text-slate-500">Image upload status</span>
                <span className="font-mono text-slate-700">—</span>
              </div>
              <div className="flex items-center justify-between pt-2">
                <span className="text-slate-500">Image quality status</span>
                <span className="font-mono text-slate-700">—</span>
              </div>
            </div>
          </div>
          <p className="text-[11px] text-slate-400 pt-3 border-t border-slate-100">
            Both images are visible only with the right permission.
          </p>
        </div>

        {/* Card 3: Verification results */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-4">Verification results</h3>
            <div className="space-y-3 text-xs divide-y divide-slate-100">
              <div className="flex items-center justify-between pt-2">
                <span className="text-slate-500">Image quality assessment</span>
                <span className="font-mono text-slate-700">—</span>
              </div>
              <div className="flex items-center justify-between pt-2">
                <span className="text-slate-500">Face detection</span>
                <span className="font-mono text-slate-700">—</span>
              </div>
              <div className="flex items-center justify-between pt-2">
                <span className="text-slate-500">Identity matching</span>
                <span className="font-mono text-slate-700">—</span>
              </div>
              <div className="flex items-center justify-between pt-2">
                <span className="text-slate-500">Authorisation evaluation</span>
                <span className="font-mono text-slate-700">—</span>
              </div>
            </div>
          </div>
          <p className="text-[11px] text-slate-400 pt-3 border-t border-slate-100">
            Identity match and entry authorisation are never merged into one result.
          </p>
        </div>

        {/* Card 4: Decision history */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900">Decision history</h3>
          <div className="space-y-3 text-xs divide-y divide-slate-100">
            <div className="flex items-center justify-between pt-2">
              <span className="text-slate-500">Decision</span>
              <span className="font-mono text-slate-700">—</span>
            </div>
            <div className="flex items-center justify-between pt-2">
              <span className="text-slate-500">Submitted by</span>
              <span className="font-mono text-slate-700">—</span>
            </div>
            <div className="flex items-center justify-between pt-2">
              <span className="text-slate-500">Timestamp</span>
              <span className="font-mono text-slate-700">—</span>
            </div>
            <div className="flex items-center justify-between pt-2">
              <span className="text-slate-500">Notes</span>
              <span className="font-mono text-slate-700">—</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
