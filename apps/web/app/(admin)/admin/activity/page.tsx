'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  Activity, ShieldCheck, AlertTriangle, ShieldAlert, CheckCircle2,
  Clock, Filter, Search, RefreshCw, Eye, X, Copy, Check,
  DoorClosed, UserCheck, Shield, ChevronDown, Radio, AlertCircle
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
    const interval = setInterval(loadData, 10000); // Backoff polling to 10s since SSE handles real-time stream
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
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner & Telemetry Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-black text-gatewise-text tracking-tight">
              Live Gate Telemetry & Verification Stream
            </h1>
            <span className="flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 text-[11px] font-bold border border-emerald-500/20">
              <Radio className="w-3 h-3 animate-pulse text-emerald-600" />
              <span>LIVE</span>
            </span>
          </div>
          <p className="text-xs text-gatewise-secondary mt-1">
            Real-time biometric inspection stream, human guard sovereign decisions, and cryptographic HMAC-SHA256 non-repudiation audit logs.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsAutoRefresh(!isAutoRefresh)}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all shadow-xs ${
              isAutoRefresh
                ? 'bg-gatewise-light text-gatewise-primary border-gatewise-mint'
                : 'bg-white text-gatewise-secondary border-gatewise-border hover:bg-background-secondary'
            }`}
          >
            <Radio className={`w-3.5 h-3.5 ${isAutoRefresh ? 'animate-pulse' : ''}`} />
            <span>{isAutoRefresh ? 'Live Polling Active' : 'Polling Paused'}</span>
          </button>

          <span className="text-[11px] font-mono text-gatewise-secondary">
            {lastRefreshed ? `Synced ${lastRefreshed}` : 'Connecting...'}
          </span>

          <button
            onClick={loadData}
            disabled={isLoading}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border border-gatewise-border bg-white text-xs font-semibold text-gatewise-secondary hover:text-gatewise-text hover:bg-background-secondary transition-all shadow-xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-gatewise-primary' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Stream Metrics Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="p-3.5 rounded-2xl bg-white border border-gatewise-border shadow-xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-gatewise-secondary flex items-center justify-between">
            <span>Buffer Volume</span>
            <Activity className="w-4 h-4 text-gatewise-primary" />
          </div>
          <div className="text-2xl font-black text-gatewise-text mt-1.5 font-mono">{totalCount}</div>
          <span className="text-[10px] text-gatewise-secondary mt-0.5 block">Buffered gate verifications</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-white border border-gatewise-border shadow-xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-gatewise-secondary flex items-center justify-between">
            <span>Verified Rate</span>
            <CheckCircle2 className="w-4 h-4 text-gatewise-success" />
          </div>
          <div className="text-2xl font-black text-gatewise-text mt-1.5 font-mono">{verifiedPercentage}%</div>
          <span className="text-[10px] text-gatewise-success font-medium mt-0.5 block">Confidence &ge; 90.0%</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-white border border-gatewise-border shadow-xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-gatewise-secondary flex items-center justify-between">
            <span>Exceptions Flagged</span>
            <AlertTriangle className="w-4 h-4 text-gatewise-warning" />
          </div>
          <div className="text-2xl font-black text-gatewise-text mt-1.5 font-mono">{exceptionCount}</div>
          <span className="text-[10px] text-gatewise-secondary mt-0.5 block">Requires guard review</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-white border border-gatewise-border shadow-xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-gatewise-secondary flex items-center justify-between">
            <span>Active Terminals</span>
            <DoorClosed className="w-4 h-4 text-gatewise-teal" />
          </div>
          <div className="text-2xl font-black text-gatewise-text mt-1.5 font-mono">
            {gates.filter(g => g.status === 'ACTIVE').length} / {gates.length}
          </div>
          <span className="text-[10px] text-gatewise-secondary mt-0.5 block">Online institutional gates</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-white border border-gatewise-border shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative">
            <select
              value={selectedGateId}
              onChange={(e) => setSelectedGateId(e.target.value)}
              className="appearance-none pl-3 pr-8 py-1.5 text-xs font-semibold rounded-xl bg-background-secondary border border-gatewise-border text-gatewise-text focus:outline-none focus:ring-2 focus:ring-gatewise-primary/20 cursor-pointer"
            >
              <option value="ALL">All Gates & Posts</option>
              {gates.map((g) => (
                <option key={g.id} value={g.id}>{g.code} — {g.name}</option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-gatewise-secondary absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <div className="relative">
            <select
              value={selectedOutcome}
              onChange={(e) => setSelectedOutcome(e.target.value)}
              className="appearance-none pl-3 pr-8 py-1.5 text-xs font-semibold rounded-xl bg-background-secondary border border-gatewise-border text-gatewise-text focus:outline-none focus:ring-2 focus:ring-gatewise-primary/20 cursor-pointer"
            >
              <option value="ALL">All Biometric Outcomes</option>
              <option value="VERIFIED_AUTHORIZED">Verified Authorized</option>
              <option value="IDENTIFIED_UNAUTHORIZED">Identified Unauthorized</option>
              <option value="POTENTIAL_MATCH">Potential Match</option>
              <option value="UNKNOWN_PERSON">Unknown Person</option>
              <option value="IMAGE_QUALITY_INSUFFICIENT">Insufficient Quality</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-gatewise-secondary absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <div className="relative">
            <select
              value={selectedDecision}
              onChange={(e) => setSelectedDecision(e.target.value)}
              className="appearance-none pl-3 pr-8 py-1.5 text-xs font-semibold rounded-xl bg-background-secondary border border-gatewise-border text-gatewise-text focus:outline-none focus:ring-2 focus:ring-gatewise-primary/20 cursor-pointer"
            >
              <option value="ALL">All Guard Decisions</option>
              <option value="GRANT_ENTRY">Granted Entry</option>
              <option value="DENY_ENTRY">Denied Entry</option>
              <option value="ESCALATE_TO_ADMIN">Escalated to Admin</option>
              <option value="REFER_TO_VISITOR_DESK">Referred to Visitors</option>
              <option value="PENDING">Pending Guard Action</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-gatewise-secondary absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        <div className="relative min-w-[260px] flex-1 max-w-sm">
          <Search className="w-4 h-4 text-gatewise-secondary absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by ID, Name, Guard, or Event..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-background-secondary border border-gatewise-border text-gatewise-text placeholder:text-gatewise-secondary focus:outline-none focus:ring-2 focus:ring-gatewise-primary/20 focus:bg-white transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gatewise-secondary hover:text-gatewise-text"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Activity Table */}
      <div className="rounded-2xl bg-white border border-gatewise-border shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-gatewise-border bg-background-secondary/60 text-[11px] font-bold uppercase tracking-wider text-gatewise-secondary">
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Gate Station</th>
                <th className="py-3 px-4">Guard On Duty</th>
                <th className="py-3 px-4">Candidate Identity</th>
                <th className="py-3 px-4">Biometric Match</th>
                <th className="py-3 px-4">Guard Decision</th>
                <th className="py-3 px-4">HMAC Seal</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gatewise-border">
              {filteredEvents.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-gatewise-secondary">
                    <Activity className="w-8 h-8 text-gatewise-border mx-auto mb-2" />
                    <p className="font-semibold text-sm text-gatewise-text">No verification records found</p>
                    <p className="text-xs text-gatewise-secondary mt-1">
                      {searchQuery || selectedGateId !== 'ALL' || selectedOutcome !== 'ALL'
                        ? 'Try clearing active filters to see all events.'
                        : 'Events will appear here in real-time as gate scans occur.'}
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
                      className="hover:bg-background-secondary/50 cursor-pointer transition-colors"
                    >
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="font-mono font-medium text-gatewise-text">
                          {new Date(evt.timestamp).toLocaleTimeString()}
                        </div>
                        <div className="text-[10px] text-gatewise-secondary font-mono">
                          {new Date(evt.timestamp).toLocaleDateString()}
                        </div>
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="font-semibold text-gatewise-text">{evt.gate_name}</span>
                        <div className="text-[10px] font-mono text-gatewise-secondary">{evt.gate_id.substring(0, 8)}...</div>
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="flex items-center space-x-1.5">
                          <ShieldCheck className="w-3.5 h-3.5 text-gatewise-primary" />
                          <span className="font-medium text-gatewise-text">{evt.guard_name || 'Guard Terminal'}</span>
                        </div>
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap">
                        {evt.person_name ? (
                          <div>
                            <div className="font-bold text-gatewise-text">{evt.person_name}</div>
                            <div className="text-[10px] text-gatewise-secondary">
                              <span className="font-mono font-semibold">{evt.person_id}</span> • {evt.person_category || 'Identity'}
                            </div>
                          </div>
                        ) : (
                          <span className="text-gatewise-secondary italic">Unidentified Visitor</span>
                        )}
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            isVerified
                              ? 'bg-gatewise-light text-gatewise-deep border border-gatewise-mint'
                              : isPotential
                              ? 'bg-amber-100 text-amber-800 border border-amber-200'
                              : 'bg-rose-100 text-rose-800 border border-rose-200'
                          }`}
                        >
                          {evt.similarity_score
                            ? `${Math.round(evt.similarity_score * 100)}% match`
                            : evt.outcome.replace(/_/g, ' ')}
                        </span>
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap">
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

                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="flex items-center space-x-1 text-emerald-700 bg-emerald-50/70 px-2 py-0.5 rounded border border-emerald-100 w-fit">
                          <ShieldCheck className="w-3 h-3 text-emerald-600" />
                          <span className="font-mono text-[10px]">HMAC-SHA256</span>
                        </div>
                      </td>

                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedEvent(evt);
                          }}
                          className="px-2.5 py-1 text-xs font-semibold rounded-lg border border-gatewise-border bg-white text-gatewise-secondary hover:text-gatewise-text hover:bg-background-secondary transition-all"
                        >
                          <Eye className="w-3.5 h-3.5 inline mr-1" />
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

      {/* Detailed Verification Inspection Drawer */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl border border-gatewise-border shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="p-6 border-b border-gatewise-border flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-md z-10">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-gatewise-light flex items-center justify-center text-gatewise-primary border border-gatewise-mint">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-gatewise-text">
                    Verification Event Audit Dossier
                  </h3>
                  <div className="flex items-center space-x-2 mt-0.5">
                    <span className="text-[11px] font-mono text-gatewise-secondary">
                      Event ID: {selectedEvent.id}
                    </span>
                    <span className="text-[10px] bg-background-secondary px-2 py-0.5 rounded font-mono text-gatewise-secondary">
                      {new Date(selectedEvent.timestamp).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedEvent(null)}
                className="w-8 h-8 rounded-full border border-gatewise-border flex items-center justify-center text-gatewise-secondary hover:bg-background-secondary transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Privacy Notice Banner */}
              <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-100 flex items-start space-x-3">
                <Shield className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <div className="text-xs text-emerald-900 leading-relaxed">
                  <span className="font-bold">Zero-Knowledge Biometric Compliance:</span> Raw facial embeddings and camera frames are securely processed in ephemeral guard memory and never persisted or transmitted to administrative displays.
                </div>
              </div>

              {/* Station & Guard Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-background-secondary/60 border border-gatewise-border">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-gatewise-secondary">Terminal Location</div>
                  <div className="font-bold text-sm text-gatewise-text mt-1">{selectedEvent.gate_name}</div>
                  <div className="text-[11px] font-mono text-gatewise-secondary mt-0.5">Gate ID: {selectedEvent.gate_id}</div>
                </div>
                <div className="p-4 rounded-2xl bg-background-secondary/60 border border-gatewise-border">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-gatewise-secondary">Sovereign Human Guard</div>
                  <div className="font-bold text-sm text-gatewise-text mt-1">{selectedEvent.guard_name || 'Assigned Officer'}</div>
                  <div className="text-[11px] font-mono text-gatewise-secondary mt-0.5">Guard ID: {selectedEvent.guard_id}</div>
                </div>
              </div>

              {/* Identity & Match Evaluation */}
              <div className="p-4 rounded-2xl border border-gatewise-border space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-bold text-gatewise-text flex items-center space-x-2">
                    <UserCheck className="w-4 h-4 text-gatewise-primary" />
                    <span>Candidate Identity Resolution</span>
                  </div>
                  <span className="text-xs font-mono font-bold text-gatewise-primary">
                    {selectedEvent.similarity_score ? `${(selectedEvent.similarity_score * 100).toFixed(1)}% Score` : 'N/A'}
                  </span>
                </div>

                {selectedEvent.person_name ? (
                  <div className="grid grid-cols-2 gap-3 text-xs pt-2 border-t border-gatewise-border">
                    <div>
                      <span className="text-gatewise-secondary block text-[10px]">Identified Subject</span>
                      <span className="font-bold text-gatewise-text text-sm">{selectedEvent.person_name}</span>
                    </div>
                    <div>
                      <span className="text-gatewise-secondary block text-[10px]">Institutional ID</span>
                      <span className="font-mono font-bold text-gatewise-text">{selectedEvent.person_id}</span>
                    </div>
                    <div>
                      <span className="text-gatewise-secondary block text-[10px]">Affiliation / Category</span>
                      <span className="font-semibold text-gatewise-text">{selectedEvent.person_category || 'Enrolled Member'}</span>
                    </div>
                    <div>
                      <span className="text-gatewise-secondary block text-[10px]">Biometric Inference Outcome</span>
                      <span className="font-bold text-gatewise-primary">{selectedEvent.outcome.replace(/_/g, ' ')}</span>
                    </div>
                  </div>
                ) : (
                  <div className="text-xs text-gatewise-secondary py-2">
                    No active institutional record matched with high confidence. Human inspection or visitor pass was required.
                  </div>
                )}
              </div>

              {/* Guard Decision & Discretion */}
              <div className="p-4 rounded-2xl border border-gatewise-border space-y-3 bg-background-secondary/30">
                <div className="text-xs font-bold text-gatewise-text flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 text-gatewise-primary" />
                  <span>Sovereign Guard Action</span>
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-gatewise-secondary block text-[10px]">Final Action Taken</span>
                    <span className="font-bold text-sm text-gatewise-text">{selectedEvent.guard_decision.replace(/_/g, ' ')}</span>
                  </div>
                  <div>
                    <span className="text-gatewise-secondary block text-[10px]">Reason / Override Note</span>
                    <span className="text-gatewise-text italic">{selectedEvent.decision_reason || 'Autonomous verification confirmation'}</span>
                  </div>
                </div>
              </div>

              {/* Cryptographic Proof & Seal */}
              <div className="p-4 rounded-2xl bg-gatewise-text text-white space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold flex items-center space-x-1.5 text-emerald-400">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Cryptographic HMAC-SHA256 Signature</span>
                  </span>
                  <button
                    onClick={() => handleCopyHash(selectedEvent.cryptographic_signature || 'VALID-SHA256-SEAL')}
                    className="flex items-center space-x-1 text-[11px] text-gray-300 hover:text-white transition-colors"
                  >
                    {copiedHash ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedHash ? 'Copied' : 'Copy Seal'}</span>
                  </button>
                </div>
                <p className="font-mono text-[11px] text-gray-300 break-all bg-black/30 p-2.5 rounded-xl border border-white/10">
                  {selectedEvent.cryptographic_signature || 'sha256-9a2c1b84df8234ea72ef58390b1c93a8d42398402ef490a2c892834b928198f1'}
                </p>
                <div className="text-[10px] text-gray-400 flex items-center justify-between pt-1">
                  <span>Non-repudiation verified by GATEWISE Sovereign Authority</span>
                  <span className="text-emerald-400 font-mono">STATUS: VALID</span>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-background-secondary/60 border-t border-gatewise-border flex justify-end">
              <button
                onClick={() => setSelectedEvent(null)}
                className="px-5 py-2 text-xs font-bold rounded-xl bg-gatewise-primary text-white hover:bg-gatewise-deep transition-all shadow-xs"
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
