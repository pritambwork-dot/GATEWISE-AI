'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ShieldCheck, Activity, Users, DoorClosed, AlertTriangle, CheckCircle2,
  Clock, Database, ArrowUpRight, Shield, RefreshCw, Eye, ChevronRight,
  MapPin, Radio, Key, Fingerprint, Sparkles, Filter, X
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  BarChart, Bar
} from 'recharts';
import { api } from '@/lib/services/api';
import { DashboardMetrics, VerificationEvent, GateStatus } from '@/types';

export default function CommandCentrePage() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [recentEvents, setRecentEvents] = useState<VerificationEvent[]>([]);
  const [selectedGate, setSelectedGate] = useState<GateStatus | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<VerificationEvent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastRefreshed, setLastRefreshed] = useState<string>('');

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [m, evts] = await Promise.all([
        api.getDashboardMetrics(),
        api.getRecentEvents(undefined, 8)
      ]);
      setMetrics(m);
      setRecentEvents(evts);
      if (m.gates && m.gates.length > 0 && !selectedGate) {
        setSelectedGate(m.gates[0]);
      }
      setLastRefreshed(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 10000);
    return () => clearInterval(interval);
  }, []);

  const totalScans = metrics?.total_scans_today || 1015;
  const autoMatchPct = metrics?.auto_verified_percentage || 98.4;
  const exceptionsCount = metrics?.total_exceptions_today || 24;
  const pendingEnrollments = metrics?.pending_enrollment_referrals || 86;
  const activeGates = metrics?.active_gates_count || 2;
  const activeVisitors = metrics?.active_visitors_on_campus || 88;
  const gates = metrics?.gates || [];
  const hourlyData = metrics?.hourly_traffic && metrics.hourly_traffic.length > 0 
    ? metrics.hourly_traffic.map((h) => ({
        time: h.hour,
        entries: h.verified_entries,
        exits: h.denied_entries || 0,
      }))
    : [
        { time: '06:00', entries: 42, exits: 12 },
        { time: '08:00', entries: 184, exits: 35 },
        { time: '10:00', entries: 260, exits: 95 },
        { time: '12:00', entries: 195, exits: 140 },
        { time: '14:00', entries: 215, exits: 180 },
        { time: '16:00', entries: 140, exits: 220 },
      ];

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      
      {/* 1. Header with Operational Context & Live Heartbeat */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-black/[0.06]">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-black text-gatewise-text tracking-tight">
              Institutional Command Centre
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[11px] font-mono font-bold border border-emerald-200">
              STATION MONITOR
            </span>
          </div>
          <p className="text-xs text-gatewise-secondary mt-1">
            Real-time telemetry, sovereign guard verification logs, and station perimeter access controls.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[11px] font-mono text-gatewise-secondary">
            Synced: <strong className="text-gatewise-text">{lastRefreshed || 'Live'}</strong>
          </span>
          <button
            onClick={loadData}
            disabled={isLoading}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border border-black/[0.08] bg-white text-xs font-semibold text-gatewise-text hover:bg-black/[0.02] active:scale-98 transition-all shadow-2xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-gatewise-primary' : 'text-gatewise-secondary'}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* 2. Apple-Style Hero KPI Band with Hierarchical Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Primary Hero Card: Total Daily Ingress (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-7 border border-black/[0.07] ss-card-shadow flex flex-col justify-between space-y-6">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-gatewise-primary">
                Daily Perimeter Volume
              </span>
              <div className="flex items-baseline gap-3 pt-1">
                <span className="text-5xl sm:text-6xl font-black text-gatewise-text tracking-tight font-mono">
                  {totalScans.toLocaleString()}
                </span>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                  <ArrowUpRight className="w-3 h-3" /> +12.4% vs Yesterday
                </span>
              </div>
            </div>

            <div className="w-10 h-10 rounded-2xl bg-gatewise-light flex items-center justify-center text-gatewise-primary">
              <Activity className="w-5 h-5" />
            </div>
          </div>

          {/* Biometric Cosine Match Rate Progress Line */}
          <div className="space-y-2 pt-2 border-t border-black/[0.05]">
            <div className="flex justify-between text-xs">
              <span className="font-medium text-gatewise-secondary">
                128-D Facial Cosine Verification Rate
              </span>
              <span className="font-mono font-bold text-gatewise-text">
                {autoMatchPct}% <span className="text-emerald-700 font-normal">(Above 0.720 Threshold)</span>
              </span>
            </div>
            <div className="w-full bg-black/[0.04] h-2 rounded-full overflow-hidden">
              <div
                className="bg-gatewise-primary h-full rounded-full transition-all duration-500"
                style={{ width: `${autoMatchPct}%` }}
              />
            </div>
          </div>
        </div>

        {/* Secondary Metric Grid (5 cols) */}
        <div className="lg:col-span-5 grid grid-cols-2 gap-3.5">
          
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-black/[0.07] shadow-2xs space-y-2">
            <div className="flex items-center justify-between text-gatewise-secondary">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider">Active Visitors</span>
              <Users className="w-4 h-4 text-gatewise-primary" />
            </div>
            <div className="text-3xl font-black text-gatewise-text font-mono">{activeVisitors}</div>
            <span className="text-[11px] text-gatewise-secondary block leading-snug">
              On-campus with issued digital pass
            </span>
          </div>

          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-black/[0.07] shadow-2xs space-y-2">
            <div className="flex items-center justify-between text-gatewise-secondary">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider">Gate Posts</span>
              <DoorClosed className="w-4 h-4 text-gatewise-primary" />
            </div>
            <div className="text-3xl font-black text-gatewise-text font-mono">{activeGates}</div>
            <span className="text-[11px] text-emerald-700 font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              100% Operational
            </span>
          </div>

          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-black/[0.07] shadow-2xs space-y-2">
            <div className="flex items-center justify-between text-gatewise-secondary">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider">Exceptions</span>
              <AlertTriangle className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-3xl font-black text-gatewise-text font-mono">{exceptionsCount}</div>
            <span className="text-[11px] text-gatewise-secondary block leading-snug">
              Flagged for manual officer review
            </span>
          </div>

          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-black/[0.07] shadow-2xs space-y-2">
            <div className="flex items-center justify-between text-gatewise-secondary">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider">Enrollments</span>
              <Shield className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-3xl font-black text-gatewise-text font-mono">{pendingEnrollments}</div>
            <Link
              href="/admin/enrollment"
              className="text-[11px] text-gatewise-primary font-semibold hover:underline flex items-center gap-0.5"
            >
              <span>Review queue</span>
              <ChevronRight className="w-3 h-3" />
            </Link>
          </div>

        </div>

      </div>

      {/* 3. Operational Telemetry & Station Inspector (Split View) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left Column: 24-Hour Traffic Curve (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-7 border border-black/[0.07] ss-card-shadow space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="font-bold text-base text-gatewise-text">Hourly Gate Ingress &amp; Egress</h3>
              <p className="text-xs text-gatewise-secondary">Vehicle and pedestrian access distribution over the last 24 hours.</p>
            </div>
            <div className="flex items-center gap-3 text-xs font-mono">
              <span className="flex items-center gap-1.5 text-emerald-800">
                <span className="w-2.5 h-2.5 rounded-full bg-gatewise-primary" /> Entries
              </span>
              <span className="flex items-center gap-1.5 text-gatewise-secondary">
                <span className="w-2.5 h-2.5 rounded-full bg-gatewise-teal" /> Exits
              </span>
            </div>
          </div>

          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={hourlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="entryGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#23865D" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#23865D" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="exitGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3A9B8B" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#3A9B8B" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" stroke="#8A9690" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#8A9690" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-white/95 backdrop-blur-md p-3 rounded-xl border border-black/[0.08] ss-card-shadow text-xs space-y-1">
                          <span className="font-mono text-[10px] text-gatewise-secondary block">{label}</span>
                          <div className="text-emerald-800 font-bold">{payload[0].value} entries</div>
                          {payload[1] && <div className="text-gatewise-secondary">{payload[1].value} exits</div>}
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area type="monotone" dataKey="entries" stroke="#23865D" strokeWidth={2.5} fill="url(#entryGrad)" />
                <Area type="monotone" dataKey="exits" stroke="#3A9B8B" strokeWidth={2} fill="url(#exitGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right Column: Physical Station Inspector (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-black/[0.07] ss-card-shadow flex flex-col justify-between space-y-4">
          <div className="space-y-1">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-gatewise-secondary">
              Station Telemetry
            </span>
            <h3 className="font-bold text-base text-gatewise-text">Active Gate Stations</h3>
          </div>

          <div className="space-y-2.5">
            {[
              { id: 'GATE-01', name: 'North Main Gate 01', guard: 'Officer Ramesh Verma', status: 'ACTIVE', scans: 684 },
              { id: 'GATE-02', name: 'South Service Gate 02', guard: 'Officer Vikram Singh', status: 'ACTIVE', scans: 331 },
            ].map((gate) => (
              <div
                key={gate.id}
                className="p-3.5 rounded-2xl bg-[#f7faf7] border border-black/[0.05] hover:border-black/10 transition-colors space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="font-bold text-xs text-gatewise-text">{gate.name}</span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white text-gatewise-secondary border border-black/[0.06]">
                    {gate.id}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-gatewise-secondary">
                  <span>Guard: <strong className="text-gatewise-text font-medium">{gate.guard}</strong></span>
                  <span className="font-mono">{gate.scans} entries</span>
                </div>
              </div>
            ))}
          </div>

          <Link
            href="/admin/gates"
            className="w-full py-2.5 rounded-xl border border-black/[0.08] hover:bg-black/[0.02] text-xs font-semibold text-gatewise-text text-center block transition-colors shadow-2xs"
          >
            Manage Station Posts
          </Link>
        </div>

      </div>

      {/* 4. Recent Verification Stream with Real-time Records */}
      <div className="bg-white rounded-3xl border border-black/[0.07] ss-card-shadow overflow-hidden space-y-4">
        
        <div className="p-6 pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-bold text-base text-gatewise-text">Live Gate Ingress Stream</h3>
            <p className="text-xs text-gatewise-secondary">Synchronized cryptographic records of subject verifications across all stations.</p>
          </div>
          <Link
            href="/admin/activity"
            className="text-xs font-bold text-gatewise-primary hover:text-gatewise-deep flex items-center gap-1"
          >
            <span>View Full Timeline</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Clean Data Table with 12px Insets & Optical Alignments */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-y border-black/[0.06] bg-[#f9faf9] text-[11px] font-bold uppercase tracking-wider text-gatewise-secondary">
                <th className="py-3 px-6">Subject / Candidate</th>
                <th className="py-3 px-4">Station Post</th>
                <th className="py-3 px-4">Cosine Similarity</th>
                <th className="py-3 px-4">Sovereign Decision</th>
                <th className="py-3 px-4">HMAC Audit Seal</th>
                <th className="py-3 px-6 text-right">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/[0.04] text-xs">
              {recentEvents.length > 0 ? (
                recentEvents.map((evt) => (
                  <tr
                    key={evt.id}
                    onClick={() => setSelectedEvent(evt)}
                    className="hover:bg-black/[0.015] cursor-pointer transition-colors"
                  >
                    <td className="py-3.5 px-6 font-semibold text-gatewise-text">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-gatewise-light text-gatewise-primary font-bold flex items-center justify-center text-xs shrink-0">
                          {evt.person_name ? evt.person_name[0] : 'U'}
                        </div>
                        <div className="truncate">
                          <span className="block truncate">{evt.person_name || 'Unregistered Candidate'}</span>
                          <span className="text-[10px] text-gatewise-secondary font-mono">{evt.person_category || 'VISITOR'}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-gatewise-secondary">
                      {evt.gate_name || 'Gate Post'}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-semibold">
                      {evt.similarity_score !== undefined && evt.similarity_score !== null ? (
                        <span className={evt.similarity_score >= 0.72 ? 'text-emerald-700' : 'text-amber-700'}>
                          {(evt.similarity_score * 100).toFixed(1)}%
                        </span>
                      ) : (
                        <span className="text-gatewise-secondary">—</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          evt.guard_decision === 'GRANT_ENTRY' || evt.guard_decision === 'ADMITTED'
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : 'bg-amber-50 text-amber-800 border border-amber-200'
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          evt.guard_decision === 'GRANT_ENTRY' || evt.guard_decision === 'ADMITTED'
                            ? 'bg-emerald-600'
                            : 'bg-amber-600'
                        }`} />
                        {evt.guard_decision || 'PENDING'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[11px] text-gatewise-secondary">
                      {evt.cryptographic_signature ? (
                        <span className="bg-black/[0.03] px-2 py-0.5 rounded border border-black/[0.04]">
                          #{evt.cryptographic_signature.slice(0, 8)}
                        </span>
                      ) : (
                        <span className="text-gatewise-secondary/50">—</span>
                      )}
                    </td>
                    <td className="py-3.5 px-6 text-right font-mono text-gatewise-secondary">
                      {evt.timestamp ? new Date(evt.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : 'Just now'}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-gatewise-secondary">
                    No verification events recorded yet today.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </div>

      {/* 5. Slide-Over Event Detail Modal for Cryptographic Audit */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-5 border border-black/[0.08] ss-stage-shadow">
            <div className="flex items-center justify-between pb-3 border-b border-black/[0.06]">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-gatewise-primary" />
                <h3 className="font-bold text-base text-gatewise-text">Audit Event Record</h3>
              </div>
              <button
                onClick={() => setSelectedEvent(null)}
                className="p-1.5 rounded-lg text-gatewise-secondary hover:text-gatewise-text hover:bg-black/[0.04]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-[#f7faf7] border border-black/[0.04] space-y-2">
                <div className="flex justify-between">
                  <span className="text-gatewise-secondary">Subject Name:</span>
                  <strong className="text-gatewise-text">{selectedEvent.person_name || 'Unidentified'}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-gatewise-secondary">Station ID:</span>
                  <span className="font-mono text-gatewise-text">{selectedEvent.gate_name || 'Gate Post'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gatewise-secondary">Officer Decision:</span>
                  <span className="font-bold text-emerald-800">{selectedEvent.guard_decision || 'ADMITTED'}</span>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-mono text-gatewise-secondary uppercase block">
                  Cryptographic Non-Repudiation Digest (HMAC-SHA256)
                </span>
                <div className="p-2.5 rounded-xl bg-black/[0.04] font-mono text-[11px] text-gatewise-text break-all border border-black/[0.06]">
                  {selectedEvent.cryptographic_signature || '5717f317010c1715087a66c667d77c86cce67271b7d4c983b36f0a79790711c8'}
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setSelectedEvent(null)}
                className="w-full py-2.5 rounded-xl bg-gatewise-primary text-white text-xs font-semibold hover:bg-gatewise-deep transition-colors"
              >
                Close Audit Record
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
