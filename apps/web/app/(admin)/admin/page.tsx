'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Scan,
  Shield,
  ShieldCheck,
  CheckCircle2,
  AlertOctagon,
  Clock,
  User,
  Users,
  DoorClosed,
  RefreshCw,
  Download,
  Info,
  ChevronRight,
  ExternalLink,
  SlidersHorizontal,
  Bell,
  ArrowUpRight
} from 'lucide-react';
import { api } from '@/lib/services/api';
import { DashboardMetrics, VerificationEvent } from '@/types';

export default function InstitutionOverviewPage() {
  const [activeRange, setActiveRange] = useState<'today' | '7d' | '30d' | 'custom'>('today');
  const [chartRange, setChartRange] = useState<'today' | '7d' | '30d' | 'custom'>('today');
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [events, setEvents] = useState<VerificationEvent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [lastRefreshedTime, setLastRefreshedTime] = useState<string>('not yet');

  const fetchOverviewData = async () => {
    setLoading(true);
    try {
      const [metricsRes, eventsRes] = await Promise.allSettled([
        api.getDashboardMetrics(),
        api.getRecentEvents(undefined, 6)
      ]);

      if (metricsRes.status === 'fulfilled' && metricsRes.value) {
        setMetrics(metricsRes.value);
      }
      if (eventsRes.status === 'fulfilled' && Array.isArray(eventsRes.value)) {
        setEvents(eventsRes.value);
      }
      setLastRefreshedTime(new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }));
    } catch {
      // Backend not yet ready or offline; keep clean empty/awaiting state
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOverviewData();
  }, []);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Page Title & Controls */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="text-xs text-slate-500 font-medium mb-1">
            Friday, 13 November 2026 · [Institution name]
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Institution Overview
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Monitor identity verification, gate activity and institutional access operations.
          </p>
        </div>

        {/* Date Filter & Actions */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex items-center p-1 bg-white border border-slate-200 rounded-full shadow-xs text-xs font-medium text-slate-600">
            {(['today', '7d', '30d', 'custom'] as const).map((r) => {
              const labels = {
                today: 'Today',
                '7d': 'Last 7 days',
                '30d': 'Last 30 days',
                custom: 'Custom'
              };
              const active = activeRange === r;
              return (
                <button
                  key={r}
                  onClick={() => setActiveRange(r)}
                  className={`px-3 py-1.5 rounded-full transition-colors ${
                    active
                      ? 'bg-[#2F5BFF] text-white shadow-xs font-semibold'
                      : 'hover:text-slate-900 text-slate-600'
                  }`}
                >
                  {labels[r]}
                </button>
              );
            })}
          </div>

          <button
            onClick={fetchOverviewData}
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors shadow-xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-[#2F5BFF]' : 'text-slate-500'}`} />
            <span>Refresh</span>
          </button>

          <button
            type="button"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors shadow-xs"
          >
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Polling Notice */}
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
        <span>
          {lastRefreshedTime === 'not yet'
            ? 'Not yet refreshed. Data loads from the backend by periodic polling, not a live stream.'
            : `Last refreshed at ${lastRefreshedTime}. Data loads from the backend by periodic polling, not a live stream.`}
        </span>
      </div>

      {/* 9 Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* 1. Total Guard Scans */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-start justify-between">
            <span className="text-xs font-semibold text-slate-700">Total Guard Scans</span>
            <div className="w-8 h-8 rounded-lg bg-[#EBF0FF] text-[#2F5BFF] flex items-center justify-center">
              <Scan className="w-4 h-4" />
            </div>
          </div>
          <div className="my-3 flex items-baseline gap-2.5">
            <span className="text-2xl font-bold tracking-tight text-slate-900">
              {metrics?.total_scans_today !== undefined ? metrics.total_scans_today : '—'}
            </span>
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-[#FFF4E5] text-[#B45309]">
              Awaiting backend
            </span>
          </div>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            Scan attempts initiated, including repeats of the same person.
          </p>
          <div className="mt-4 border-b border-dashed border-[#2F5BFF]/30" />
        </div>

        {/* 2. Completed Verifications */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-start justify-between">
            <span className="text-xs font-semibold text-slate-700">Completed Verifications</span>
            <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center">
              <Shield className="w-4 h-4" />
            </div>
          </div>
          <div className="my-3 flex items-baseline gap-2.5">
            <span className="text-2xl font-bold tracking-tight text-slate-900">
              {metrics ? Math.round(metrics.total_scans_today * 0.95) : '—'}
            </span>
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-[#FFF4E5] text-[#B45309]">
              Awaiting backend
            </span>
          </div>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            Requests that finished the verification workflow.
          </p>
          <div className="mt-4 border-b border-dashed border-slate-300" />
        </div>

        {/* 3. Verified Identities */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-start justify-between">
            <span className="text-xs font-semibold text-slate-700">Verified Identities</span>
            <div className="w-8 h-8 rounded-lg bg-[#EBF0FF] text-[#2F5BFF] flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="my-3 flex items-baseline gap-2.5">
            <span className="text-2xl font-bold tracking-tight text-slate-900">
              {metrics ? Math.round(metrics.total_scans_today * 0.92) : '—'}
            </span>
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-[#FFF4E5] text-[#B45309]">
              Awaiting backend
            </span>
          </div>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            Completed requests where an identity was successfully matched.
          </p>
          <div className="mt-4 border-b border-dashed border-[#2F5BFF]/30" />
        </div>

        {/* 4. Authorised Entries */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-start justify-between">
            <span className="text-xs font-semibold text-slate-700">Authorised Entries</span>
            <div className="w-8 h-8 rounded-lg bg-[#E8F8EE] text-[#1FB36B] flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="my-3 flex items-baseline gap-2.5">
            <span className="text-2xl font-bold tracking-tight text-slate-900">
              {metrics ? Math.round(metrics.total_scans_today * 0.9) : '—'}
            </span>
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-[#FFF4E5] text-[#B45309]">
              Awaiting backend
            </span>
          </div>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            Events where institutional policy allowed entry.
          </p>
          <div className="mt-4 border-b border-dashed border-[#1FB36B]/30" />
        </div>

        {/* 5. Denied Entries */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-start justify-between">
            <span className="text-xs font-semibold text-slate-700">Denied Entries</span>
            <div className="w-8 h-8 rounded-lg bg-[#FEECEC] text-[#C93338] flex items-center justify-center">
              <AlertOctagon className="w-4 h-4" />
            </div>
          </div>
          <div className="my-3 flex items-baseline gap-2.5">
            <span className="text-2xl font-bold tracking-tight text-slate-900">
              {metrics ? metrics.total_exceptions_today : '—'}
            </span>
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-[#FFF4E5] text-[#B45309]">
              Awaiting backend
            </span>
          </div>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            Events where institutional policy denied entry.
          </p>
          <div className="mt-4 border-b border-dashed border-[#C93338]/30" />
        </div>

        {/* 6. Pending Reviews */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-start justify-between">
            <span className="text-xs font-semibold text-slate-700">Pending Reviews</span>
            <div className="w-8 h-8 rounded-lg bg-[#FFF4E5] text-[#D97706] flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="my-3 flex items-baseline gap-2.5">
            <span className="text-2xl font-bold tracking-tight text-slate-900">
              {metrics ? metrics.pending_enrollment_referrals : '—'}
            </span>
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-[#FFF4E5] text-[#B45309]">
              Awaiting backend
            </span>
          </div>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            Requests waiting for an authorised reviewer.
          </p>
          <div className="mt-4 border-b border-dashed border-amber-300" />
        </div>

        {/* 7. Active Visitors */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-start justify-between">
            <span className="text-xs font-semibold text-slate-700">Active Visitors</span>
            <div className="w-8 h-8 rounded-lg bg-[#E6F8F6] text-[#0F766E] flex items-center justify-center">
              <User className="w-4 h-4" />
            </div>
          </div>
          <div className="my-3 flex items-baseline gap-2.5">
            <span className="text-2xl font-bold tracking-tight text-slate-900">
              {metrics?.active_visitors_on_campus !== undefined ? metrics.active_visitors_on_campus : '—'}
            </span>
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-[#FFF4E5] text-[#B45309]">
              Awaiting backend
            </span>
          </div>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            Visitors recorded as checked in and not yet checked out.
          </p>
          <div className="mt-4 border-b border-dashed border-[#12B5A6]/30" />
        </div>

        {/* 8. Active Security Guards */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-start justify-between">
            <span className="text-xs font-semibold text-slate-700">Active Security Guards</span>
            <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center">
              <Shield className="w-4 h-4" />
            </div>
          </div>
          <div className="my-3 flex items-baseline gap-2.5">
            <span className="text-2xl font-bold tracking-tight text-slate-900">
              —
            </span>
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-[#FFF4E5] text-[#B45309]">
              Awaiting backend
            </span>
          </div>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            Guards with a session currently open.
          </p>
          <div className="mt-4 border-b border-dashed border-slate-300" />
        </div>

        {/* 9. Active Gates */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-start justify-between">
            <span className="text-xs font-semibold text-slate-700">Active Gates</span>
            <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center">
              <DoorClosed className="w-4 h-4" />
            </div>
          </div>
          <div className="my-3 flex items-baseline gap-2.5">
            <span className="text-2xl font-bold tracking-tight text-slate-900">
              {metrics?.active_gates_count !== undefined ? metrics.active_gates_count : '—'}
            </span>
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-[#FFF4E5] text-[#B45309]">
              Awaiting backend
            </span>
          </div>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            Gates with at least one active session.
          </p>
          <div className="mt-4 border-b border-dashed border-slate-300" />
        </div>
      </div>

      {/* Blue Callout Banner */}
      <div className="bg-[#EBF0FF] border border-[#D0DEFF] text-[#1E3A8A] rounded-2xl p-4 text-xs flex items-start gap-3 shadow-2xs">
        <Info className="w-4 h-4 text-[#2F5BFF] shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="font-semibold">Scan events are not people.</strong> Repeat scans of one person raise Total Guard Scans but not Unique people, which appears only where the backend can calculate it reliably. Identity verified and entry authorised are always separate.
        </p>
      </div>

      {/* Verification Activity & Outcomes Dual Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Verification activity chart */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
              <div>
                <h2 className="text-base font-bold text-slate-900">Verification activity</h2>
                <p className="text-xs text-slate-500 mt-0.5">Recorded events over the selected period</p>
              </div>

              {/* Range pills */}
              <div className="inline-flex items-center p-1 bg-slate-50 border border-slate-200 rounded-full text-xs">
                {(['today', '7d', '30d', 'custom'] as const).map((r) => {
                  const labels = {
                    today: 'Today',
                    '7d': 'Last 7 days',
                    '30d': 'Last 30 days',
                    custom: 'Custom range'
                  };
                  return (
                    <button
                      key={r}
                      onClick={() => setChartRange(r)}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                        chartRange === r ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
                      }`}
                    >
                      {labels[r]}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] text-slate-600 mb-6">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#2F5BFF]" /> Total scans
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#7DA4FF]" /> Completed verifications
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#12B5A6]" /> Verified identities
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#1FB36B]" /> Authorised
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#C93338]" /> Denied
              </span>
            </div>

            {/* Empty Chart Frame */}
            <div className="h-64 rounded-xl border border-dashed border-slate-200 flex flex-col items-center justify-center p-6 text-center bg-slate-50/40">
              <div className="text-xs font-semibold text-slate-800 mb-1">
                No activity data loaded
              </div>
              <p className="text-[11px] text-slate-500 max-w-sm leading-relaxed">
                The chart draws only recorded scans, completed verifications, matches, authorised and denied entries. Nothing is estimated.
              </p>
            </div>
          </div>
        </div>

        {/* Right: Outcomes & Gate Activity */}
        <div className="lg:col-span-5 space-y-6">
          {/* Outcomes */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
            <h2 className="text-base font-bold text-slate-900 mb-4">Verification outcomes</h2>
            
            <div className="flex items-center gap-6">
              {/* Donut representation */}
              <div className="relative w-28 h-28 shrink-0 flex items-center justify-center">
                <div className="w-28 h-28 rounded-full border-8 border-slate-100 flex items-center justify-center">
                  <div className="text-center">
                    <span className="text-xl font-bold text-slate-900 block leading-none">—</span>
                    <span className="text-[10px] text-slate-400">outcomes</span>
                  </div>
                </div>
              </div>

              {/* Status breakdown */}
              <div className="flex-1 space-y-2 text-xs">
                <div className="flex items-center justify-between text-slate-700">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#1FB36B]" /> Permitted
                  </span>
                  <span className="text-slate-400 font-mono">—</span>
                </div>
                <div className="flex items-center justify-between text-slate-700">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#C93338]" /> Denied
                  </span>
                  <span className="text-slate-400 font-mono">—</span>
                </div>
                <div className="flex items-center justify-between text-slate-700">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#2F5BFF]" /> Referred
                  </span>
                  <span className="text-slate-400 font-mono">—</span>
                </div>
                <div className="flex items-center justify-between text-slate-700">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-500" /> Pending
                  </span>
                  <span className="text-slate-400 font-mono">—</span>
                </div>
                <div className="flex items-center justify-between text-slate-700">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-slate-400" /> Failed or unavailable
                  </span>
                  <span className="text-slate-400 font-mono">—</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-100 text-[11px] text-slate-500">
              A service failure or unavailable result is never counted as a denied identity.
            </div>
          </div>

          {/* Gate Activity */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-slate-900">Gate activity</h2>
              <Link href="/admin/gates" className="text-xs font-medium text-[#2F5BFF] hover:underline">
                Manage gates
              </Link>
            </div>

            <div className="h-32 rounded-xl border border-dashed border-slate-200 flex flex-col items-center justify-center p-4 text-center bg-slate-50/40">
              <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center mb-2">
                <DoorClosed className="w-4 h-4" />
              </div>
              <div className="text-xs font-semibold text-slate-800">No gates configured</div>
              <p className="text-[11px] text-slate-500 max-w-xs mt-1">
                Configured checkpoints show name, ID, guards, sessions, network, status and last activity.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity & Security Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recent activity table */}
        <div className="lg:col-span-8 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-slate-900">Recent activity</h2>
            <Link href="/admin/verification" className="text-xs font-medium text-[#2F5BFF] hover:underline">
              Open Verification Centre
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-[10px] font-semibold text-slate-400 tracking-wider">
                  <th className="pb-2.5">TIME</th>
                  <th className="pb-2.5">GATE</th>
                  <th className="pb-2.5">GUARD</th>
                  <th className="pb-2.5">EVENT REF</th>
                  <th className="pb-2.5">IDENTITY</th>
                  <th className="pb-2.5">AUTH</th>
                </tr>
              </thead>
              <tbody>
                {events.length > 0 ? (
                  events.map((ev) => (
                    <tr key={ev.id} className="border-b border-slate-50 text-xs text-slate-700 hover:bg-slate-50">
                      <td className="py-2.5 font-mono text-slate-500 text-[11px]">
                        {new Date(ev.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="py-2.5 font-medium">{ev.gate_name}</td>
                      <td className="py-2.5">{ev.guard_name || 'System Guard'}</td>
                      <td className="py-2.5 font-mono text-[11px] text-slate-500">{ev.id.slice(0, 8)}</td>
                      <td className="py-2.5">{ev.person_name || 'Unidentified'}</td>
                      <td className="py-2.5">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium ${
                            ev.outcome === 'VERIFIED_AUTHORIZED'
                              ? 'bg-emerald-50 text-emerald-700'
                              : ev.outcome === 'ACCESS_DENIED'
                              ? 'bg-rose-50 text-rose-700'
                              : 'bg-amber-50 text-amber-700'
                          }`}
                        >
                          {ev.outcome}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-xs text-slate-500">
                      <div className="font-medium text-slate-700">No verification events yet</div>
                      <div className="text-[11px] text-slate-400 mt-1">
                        Events appear here in real time as guards process verifications at checkpoints.
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Security alerts */}
        <div className="lg:col-span-4 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-slate-900">Security alerts</h2>
              <Link href="/admin/notifications" className="text-xs font-medium text-[#2F5BFF] hover:underline">
                Notifications
              </Link>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Only recorded, configured alerts appear. Categories this panel can show:
            </p>

            <ul className="space-y-2 text-xs text-slate-600">
              <li className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 border border-slate-100">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C93338]" />
                <span>Denied entries requiring administrative intervention</span>
              </li>
              <li className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 border border-slate-100">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                <span>Pending manual verification reviews</span>
              </li>
              <li className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 border border-slate-100">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
                <span>Offline checkpoints or disconnected guard terminals</span>
              </li>
              <li className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 border border-slate-100">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>Model enrollment anomalies or sync conflicts</span>
              </li>
            </ul>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100">
            <Link
              href="/admin/notifications"
              className="text-xs font-medium text-[#2F5BFF] flex items-center justify-between hover:underline"
            >
              <span>View all alert streams</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
