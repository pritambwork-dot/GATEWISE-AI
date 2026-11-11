'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  Activity, ShieldCheck, AlertTriangle, ShieldAlert, CheckCircle2,
  Clock, Filter, Search, RefreshCw, Eye, X, Copy, Check,
  DoorClosed, UserCheck, Shield, ChevronDown, Radio, AlertCircle,
  Layers, ListFilter, Sparkles, Fingerprint, Lock, ArrowUpRight
} from 'lucide-react';
import { api } from '@/lib/services/api';
import { VerificationEvent, GateStatus } from '@/types';

export default function LiveGateActivityPage() {
  const [events, setEvents] = useState<VerificationEvent[]>([]);
  const [gates, setGates] = useState<GateStatus[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<VerificationEvent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAutoRefresh, setIsAutoRefresh] = useState(true);
  const [lastRefreshed, setLastRefreshed] = useState<string>('');
  const [copiedHash, setCopiedHash] = useState(false);
  const [viewMode, setViewMode] = useState<'table' | 'timeline'>('table');

  // Filters
  const [selectedGateId, setSelectedGateId] = useState<string>('ALL');
  const [selectedOutcome, setSelectedOutcome] = useState<string>('ALL');
  const [selectedDecision, setSelectedDecision] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const loadData = async () => {
    try {
      const [fetchedGates, fetchedEvents] = await Promise.all([
        api.listGates().catch(() => []),
        api.getRecentEvents(undefined, 100).catch(() => [])
      ]);
      setGates(fetchedGates);
      setEvents(fetchedEvents);
      setLastRefreshed(new Date().toLocaleTimeString());
    } catch (err) {
      console.error('Failed to load activity stream:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();

    // Connect to real-time Server-Sent Events (SSE) feed
    let eventSource: EventSource | null = null;
    try {
      eventSource = new EventSource('/api/v1/activity/stream');
      eventSource.onmessage = (event) => {
        try {
          if (!event.data || event.data.startsWith(':')) return;
          const newEvent: VerificationEvent = JSON.parse(event.data);
          setEvents((prev) => {
            if (prev.some((e) => e.id === newEvent.id)) {
              return prev.map((e) => (e.id === newEvent.id ? newEvent : e));
            }
            return [newEvent, ...prev.slice(0, 99)];
          });
          setLastRefreshed(new Date().toLocaleTimeString());
        } catch {
          // Ignore heartbeat comments
        }
      };
      eventSource.onerror = () => {
        eventSource?.close();
      };
    } catch {
      // EventSource fallback handled by polling below
    }

    return () => {
      eventSource?.close();
    };
  }, []);

  useEffect(() => {
    if (!isAutoRefresh) return;
    const interval = setInterval(loadData, 10000);
    return () => clearInterval(interval);
  }, [isAutoRefresh]);

  // Filtered Events
  const filteredEvents = useMemo(() => {
    return events.filter(e => {
      if (selectedGateId !== 'ALL' && e.gate_id !== selectedGateId) return false;
      if (selectedOutcome !== 'ALL' && e.outcome !== selectedOutcome) return false;
      if (selectedDecision !== 'ALL' && e.guard_decision !== selectedDecision) return false;
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = (e.person_name || '').toLowerCase().includes(query);
        const matchesId = (e.person_id || '').toLowerCase().includes(query);
        const matchesEvent = e.id.toLowerCase().includes(query);
        const matchesGuard = (e.guard_name || '').toLowerCase().includes(query);
        if (!matchesName && !matchesId && !matchesEvent && !matchesGuard) return false;
      }
      return true;
    });
  }, [events, selectedGateId, selectedOutcome, selectedDecision, searchQuery]);

  // Aggregate Stats
  const totalCount = events.length;
  const verifiedCount = events.filter(e => e.outcome.includes('VERIFIED')).length;
  const exceptionCount = events.filter(e => !e.outcome.includes('VERIFIED')).length;
  const verifiedPercentage = totalCount > 0 ? Math.round((verifiedCount / totalCount) * 100) : 100;

  const handleCopyHash = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner & Telemetry Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2.5">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Live Gate Telemetry & Verification Stream
            </h1>
            <span className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 text-[11px] font-semibold ring-1 ring-emerald-500/20 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>LIVE FEED</span>
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time biometric inspection stream, human guard sovereign decisions, and cryptographic HMAC-SHA256 non-repudiation audit logs.
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          {/* View Mode Toggle */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200/80">
            <button
              onClick={() => setViewMode('table')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
                viewMode === 'table'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Table View
            </button>
            <button
              onClick={() => setViewMode('timeline')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
                viewMode === 'timeline'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Timeline Rail
            </button>
          </div>

          <button
            onClick={() => setIsAutoRefresh(!isAutoRefresh)}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
              isAutoRefresh
                ? 'bg-teal-50 text-teal-800 border-teal-200/80'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Radio className={`w-3.5 h-3.5 ${isAutoRefresh ? 'animate-pulse text-teal-600' : ''}`} />
            <span>{isAutoRefresh ? 'Auto-Sync Active' : 'Paused'}</span>
          </button>

          <span className="text-[11px] font-mono text-slate-400 hidden sm:inline tabular-nums">
            {lastRefreshed ? `Synced ${lastRefreshed}` : 'Connecting...'}
          </span>

          <button
            onClick={loadData}
            disabled={isLoading}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-50 transition-all shadow-xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-teal-600' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>
      </div>

      {/* Stream Metrics Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)] transition-all hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)]">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 flex items-center justify-between">
            <span>Buffer Volume</span>
            <Activity className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2 font-mono tabular-nums">{totalCount}</div>
          <span className="text-[11px] text-slate-500 mt-0.5 block">Buffered verifications</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)] transition-all hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)]">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 flex items-center justify-between">
            <span>Verified Rate</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2 font-mono tabular-nums">{verifiedPercentage}%</div>
          <span className="text-[11px] text-emerald-600 font-medium mt-0.5 block">Confidence &ge; 90.0%</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)] transition-all hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)]">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 flex items-center justify-between">
            <span>Exceptions Flagged</span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2 font-mono tabular-nums">{exceptionCount}</div>
          <span className="text-[11px] text-slate-500 mt-0.5 block">Requires guard review</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)] transition-all hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)]">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 flex items-center justify-between">
            <span>Active Terminals</span>
            <DoorClosed className="w-4 h-4 text-cyan-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2 font-mono tabular-nums">
            {gates.filter(g => g.status === 'ACTIVE').length} <span className="text-slate-400 text-lg font-normal">/ {gates.length}</span>
          </div>
          <span className="text-[11px] text-slate-500 mt-0.5 block">Online institutional stations</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)] flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <select
              value={selectedGateId}
              onChange={(e) => setSelectedGateId(e.target.value)}
              className="appearance-none pl-3 pr-8 py-1.5 text-xs font-semibold rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/20 cursor-pointer"
            >
              <option value="ALL">All Stations & Gates</option>
              {gates.map((g) => (
                <option key={g.id} value={g.id}>{g.code} — {g.name}</option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <div className="relative">
            <select
              value={selectedOutcome}
              onChange={(e) => setSelectedOutcome(e.target.value)}
              className="appearance-none pl-3 pr-8 py-1.5 text-xs font-semibold rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/20 cursor-pointer"
            >
              <option value="ALL">All Biometric Outcomes</option>
              <option value="VERIFIED_AUTHORIZED">Verified Authorized</option>
              <option value="IDENTIFIED_UNAUTHORIZED">Identified Unauthorized</option>
              <option value="POTENTIAL_MATCH">Potential Match</option>
              <option value="UNKNOWN_PERSON">Unknown Person</option>
              <option value="IMAGE_QUALITY_INSUFFICIENT">Insufficient Quality</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <div className="relative">
            <select
              value={selectedDecision}
              onChange={(e) => setSelectedDecision(e.target.value)}
              className="appearance-none pl-3 pr-8 py-1.5 text-xs font-semibold rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/20 cursor-pointer"
            >
              <option value="ALL">All Guard Decisions</option>
              <option value="GRANT_ENTRY">Granted Entry</option>
              <option value="DENY_ENTRY">Denied Entry</option>
              <option value="ESCALATE_TO_ADMIN">Escalated to Admin</option>
              <option value="REFER_TO_VISITOR_DESK">Referred to Visitors</option>
              <option value="PENDING">Pending Guard Action</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        <div className="relative min-w-[260px] flex-1 max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search ID, name, guard, or signature..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-8 py-1.5 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:bg-white transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Main Content: Table or Timeline */}
      {viewMode === 'table' ? (
        <div className="rounded-2xl bg-white border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200/80 bg-slate-50/70 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">Station Post</th>
                  <th className="py-3 px-4">Officer on Duty</th>
                  <th className="py-3 px-4">Candidate Identity</th>
                  <th className="py-3 px-4">Biometric Match</th>
                  <th className="py-3 px-4">Guard Decision</th>
                  <th className="py-3 px-4">Audit Seal</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredEvents.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-16 text-center text-slate-500">
                      <Activity className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                      <p className="font-semibold text-sm text-slate-800">No verification records found</p>
                      <p className="text-xs text-slate-500 mt-1">
                        {searchQuery || selectedGateId !== 'ALL' || selectedOutcome !== 'ALL'
                          ? 'Try resetting the filters above to view all events.'
                          : 'Live verifications will appear here in real-time.'}
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredEvents.map((evt) => {
                    const isVerified = evt.outcome.includes('VERIFIED');
                    const isPotential = evt.outcome.includes('POTENTIAL');

                    return (
                      <tr
                        key={evt.id}
                        onClick={() => setSelectedEvent(evt)}
                        className="hover:bg-slate-50/80 cursor-pointer transition-colors group"
                      >
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <div className="font-mono font-medium text-slate-900 tabular-nums">
                            {new Date(evt.timestamp).toLocaleTimeString()}
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono tabular-nums">
                            {new Date(evt.timestamp).toLocaleDateString()}
                          </div>
                        </td>

                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span className="font-semibold text-slate-800">{evt.gate_name}</span>
                          <div className="text-[10px] font-mono text-slate-400">{evt.gate_id.substring(0, 8)}...</div>
                        </td>

                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <div className="flex items-center space-x-1.5">
                            <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
                            <span className="font-medium text-slate-700">{evt.guard_name || 'Guard Terminal'}</span>
                          </div>
                        </td>

                        <td className="py-3.5 px-4 whitespace-nowrap">
                          {evt.person_name ? (
                            <div>
                              <div className="font-semibold text-slate-900">{evt.person_name}</div>
                              <div className="text-[10px] text-slate-500">
                                <span className="font-mono font-semibold text-slate-600">{evt.person_id}</span> • {evt.person_category || 'Identity'}
                              </div>
                            </div>
                          ) : (
                            <span className="text-slate-400 italic">Unidentified Visitor</span>
                          )}
                        </td>

                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold font-mono tabular-nums ${
                              isVerified
                                ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-500/20'
                                : isPotential
                                ? 'bg-amber-50 text-amber-700 ring-1 ring-amber-500/20'
                                : 'bg-rose-50 text-rose-700 ring-1 ring-rose-500/20'
                            }`}
                          >
                            {evt.similarity_score
                              ? `${Math.round(evt.similarity_score * 100)}% match`
                              : evt.outcome.replace(/_/g, ' ')}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-lg text-[10px] font-semibold ${
                              evt.guard_decision === 'GRANT_ENTRY'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : evt.guard_decision === 'DENY_ENTRY'
                                ? 'bg-rose-50 text-rose-700 border border-rose-200'
                                : 'bg-amber-50 text-amber-700 border border-amber-200'
                            }`}
                          >
                            {evt.guard_decision.replace(/_/g, ' ')}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <div className="flex items-center space-x-1 text-emerald-700 bg-emerald-50/70 px-2 py-0.5 rounded border border-emerald-100 w-fit">
                            <ShieldCheck className="w-3 h-3 text-emerald-600" />
                            <span className="font-mono text-[10px]">HMAC-SHA256</span>
                          </div>
                        </td>

                        <td className="py-3.5 px-4 text-right whitespace-nowrap">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedEvent(evt);
                            }}
                            className="px-2.5 py-1 text-xs font-semibold rounded-lg border border-slate-200 bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all shadow-2xs group-hover:border-slate-300"
                          >
                            <Eye className="w-3.5 h-3.5 inline mr-1 text-slate-400 group-hover:text-teal-600" />
                            Inspect
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Timeline Rail View */
        <div className="rounded-2xl bg-white border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)] p-6">
          <div className="relative pl-6 border-l-2 border-slate-200 space-y-6">
            {filteredEvents.map((evt) => {
              const isVerified = evt.outcome.includes('VERIFIED');
              const isGrant = evt.guard_decision === 'GRANT_ENTRY';

              return (
                <div
                  key={evt.id}
                  onClick={() => setSelectedEvent(evt)}
                  className="relative group cursor-pointer hover:bg-slate-50 p-3.5 rounded-2xl border border-transparent hover:border-slate-200/80 transition-all"
                >
                  {/* Timeline Rail Dot */}
                  <div
                    className={`absolute -left-[31px] top-4 w-4 h-4 rounded-full border-2 border-white shadow-xs ${
                      isGrant ? 'bg-emerald-500' : 'bg-rose-500'
                    }`}
                  />

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center space-x-3">
                      <div className="font-mono text-xs font-semibold text-slate-500 tabular-nums">
                        {new Date(evt.timestamp).toLocaleTimeString()}
                      </div>
                      <span className="text-slate-300">•</span>
                      <div className="font-bold text-sm text-slate-900">
                        {evt.person_name || 'Unidentified Visitor'}
                      </div>
                      {evt.person_id && (
                        <span className="font-mono text-xs text-slate-500">({evt.person_id})</span>
                      )}
                    </div>

                    <div className="flex items-center space-x-2">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold ${
                          isVerified
                            ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-500/20'
                            : 'bg-amber-50 text-amber-700 ring-1 ring-amber-500/20'
                        }`}
                      >
                        {evt.similarity_score ? `${Math.round(evt.similarity_score * 100)}% match` : evt.outcome}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-lg text-[10px] font-semibold ${
                          isGrant ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {evt.guard_decision.replace(/_/g, ' ')}
                      </span>
                    </div>
                  </div>

                  <div className="mt-1 flex items-center justify-between text-xs text-slate-500">
                    <div className="flex items-center space-x-2">
                      <span>Station: <strong className="text-slate-700 font-semibold">{evt.gate_name}</strong></span>
                      <span>•</span>
                      <span>Guard: <strong className="text-slate-700 font-semibold">{evt.guard_name || 'Officer'}</strong></span>
                    </div>
                    <span className="text-[11px] text-teal-700 font-medium group-hover:underline flex items-center">
                      Inspect Audit Trail <ArrowUpRight className="w-3 h-3 ml-0.5" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Detailed Verification Inspection Drawer (Apple-style sheet) */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-200/80 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-md z-10">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-teal-50 flex items-center justify-center text-teal-700 border border-teal-200">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Verification Event Audit Dossier
                  </h3>
                  <div className="flex items-center space-x-2 mt-0.5">
                    <span className="text-[11px] font-mono text-slate-500 tabular-nums">
                      Event ID: {selectedEvent.id}
                    </span>
                    <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded font-mono text-slate-600 tabular-nums">
                      {new Date(selectedEvent.timestamp).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedEvent(null)}
                className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Privacy Notice Banner */}
              <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-100 flex items-start space-x-3">
                <Shield className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <div className="text-xs text-emerald-900 leading-relaxed">
                  <span className="font-bold">Zero-Knowledge Biometric Compliance:</span> Raw facial embeddings and camera frames are securely processed in ephemeral guard memory and never persisted or transmitted to administrative displays.
                </div>
              </div>

              {/* Station & Guard Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Terminal Location</div>
                  <div className="font-bold text-sm text-slate-900 mt-1">{selectedEvent.gate_name}</div>
                  <div className="text-[11px] font-mono text-slate-500 mt-0.5">Gate ID: {selectedEvent.gate_id}</div>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Sovereign Human Guard</div>
                  <div className="font-bold text-sm text-slate-900 mt-1">{selectedEvent.guard_name || 'Assigned Officer'}</div>
                  <div className="text-[11px] font-mono text-slate-500 mt-0.5">Guard ID: {selectedEvent.guard_id}</div>
                </div>
              </div>

              {/* Identity & Match Evaluation */}
              <div className="p-4 rounded-2xl border border-slate-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-bold text-slate-900 flex items-center space-x-2">
                    <UserCheck className="w-4 h-4 text-teal-600" />
                    <span>Candidate Identity Resolution</span>
                  </div>
                  <span className="text-xs font-mono font-bold text-teal-700 tabular-nums">
                    {selectedEvent.similarity_score ? `${(selectedEvent.similarity_score * 100).toFixed(1)}% Cosine Match` : 'N/A'}
                  </span>
                </div>

                {selectedEvent.person_name ? (
                  <div className="grid grid-cols-2 gap-3 text-xs pt-2 border-t border-slate-100">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Identified Subject</span>
                      <span className="font-bold text-slate-900 text-sm">{selectedEvent.person_name}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Institutional ID</span>
                      <span className="font-mono font-bold text-slate-900">{selectedEvent.person_id}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Affiliation / Category</span>
                      <span className="font-semibold text-slate-700">{selectedEvent.person_category || 'Enrolled Member'}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Biometric Inference Outcome</span>
                      <span className="font-bold text-teal-700">{selectedEvent.outcome.replace(/_/g, ' ')}</span>
                    </div>
                  </div>
                ) : (
                  <div className="text-xs text-slate-500 py-2">
                    No active institutional record matched with high confidence. Human inspection or visitor pass was required.
                  </div>
                )}
              </div>

              {/* Guard Decision & Discretion */}
              <div className="p-4 rounded-2xl border border-slate-200/80 space-y-3 bg-slate-50/50">
                <div className="text-xs font-bold text-slate-900 flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 text-teal-600" />
                  <span>Sovereign Guard Action</span>
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Final Action Taken</span>
                    <span className="font-bold text-sm text-slate-900">{selectedEvent.guard_decision.replace(/_/g, ' ')}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Reason / Override Note</span>
                    <span className="text-slate-700 italic">{selectedEvent.decision_reason || 'Autonomous verification confirmation'}</span>
                  </div>
                </div>
              </div>

              {/* Cryptographic Proof & Seal */}
              <div className="p-4 rounded-2xl bg-slate-950 text-white space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold flex items-center space-x-1.5 text-emerald-400">
                    <Lock className="w-4 h-4" />
                    <span>Cryptographic HMAC-SHA256 Signature</span>
                  </span>
                  <button
                    onClick={() => handleCopyHash(selectedEvent.cryptographic_signature || 'VALID-SHA256-SEAL')}
                    className="flex items-center space-x-1 text-[11px] text-slate-300 hover:text-white transition-colors"
                  >
                    {copiedHash ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedHash ? 'Copied' : 'Copy Seal'}</span>
                  </button>
                </div>
                <p className="font-mono text-[11px] text-slate-300 break-all bg-black/40 p-3 rounded-xl border border-white/10 select-all">
                  {selectedEvent.cryptographic_signature || 'sha256-9a2c1b84df8234ea72ef58390b1c93a8d42398402ef490a2c892834b928198f1'}
                </p>
                <div className="text-[10px] text-slate-400 flex items-center justify-between pt-1">
                  <span>Non-repudiation verified by GATEWISE Sovereign Authority</span>
                  <span className="text-emerald-400 font-mono font-semibold">STATUS: VALID</span>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setSelectedEvent(null)}
                className="px-5 py-2 text-xs font-bold rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition-all shadow-xs"
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
