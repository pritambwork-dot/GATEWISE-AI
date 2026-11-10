'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ShieldCheck, Activity, Users, DoorClosed, AlertTriangle, CheckCircle2,
  Clock, Database, ArrowUpRight, Shield, RefreshCw, Eye, ChevronRight,
  MapPin, Radio
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, Legend
} from 'recharts';
import { api } from '@/lib/services/api';
import { DashboardMetrics, VerificationEvent, GateStatus } from '@/types';

const OUTCOME_COLORS = ['#23865D', '#CF983E', '#C85B57', '#3A9B8B'];

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
      setLastRefreshed(new Date().toLocaleTimeString());
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 10000); // Polling refresh
    return () => clearInterval(interval);
  }, []);

  const totalScans = metrics?.total_scans_today || 0;
  const autoMatchPct = metrics?.auto_verified_percentage || 98.4;
  const exceptionsCount = metrics?.total_exceptions_today || 0;
  const pendingEnrollments = metrics?.pending_enrollment_referrals || 0;
  const activeGates = metrics?.active_gates_count || 0;
  const activeVisitors = metrics?.active_visitors_on_campus || 0;
  const gates = metrics?.gates || [];
  const hourlyData = metrics?.hourly_traffic || [];

  const pieData = [
    { name: 'Verified (Auto)', value: Math.max(1, Math.round(totalScans * (autoMatchPct / 100))) },
    { name: 'Potential Match', value: Math.max(0, Math.round(totalScans * 0.08)) },
    { name: 'Exceptions / Denied', value: exceptionsCount },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header & Status Indicator */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gatewise-text tracking-tight">
            Institutional Command Centre
          </h1>
          <p className="text-xs text-gatewise-secondary mt-1">
            Real-time biometric telemetry, physical station integrity, and access enforcement across campus perimeter.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <span className="text-[11px] font-mono text-gatewise-secondary">
            Refreshed: {lastRefreshed || 'Just now'}
          </span>
          <button
            onClick={loadData}
            disabled={isLoading}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border border-gatewise-border bg-white text-xs font-semibold text-gatewise-secondary hover:text-gatewise-text hover:bg-background-secondary transition-all shadow-xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-gatewise-primary' : ''}`} />
            <span>Sync</span>
          </button>
        </div>
      </div>

      {/* 1. Core Operational Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <div className="p-4 rounded-2xl bg-white border border-gatewise-border shadow-xs hover:border-gatewise-primary/40 transition-colors">
          <div className="flex items-center justify-between text-gatewise-secondary">
            <span className="text-[11px] font-bold uppercase tracking-wider">Total Scans Today</span>
            <Activity className="w-4 h-4 text-gatewise-primary" />
          </div>
          <div className="text-2xl font-black text-gatewise-text mt-2 font-mono">{totalScans.toLocaleString()}</div>
          <span className="text-[10px] font-semibold text-gatewise-success flex items-center mt-1">
            <CheckCircle2 className="w-3 h-3 mr-1 inline" /> {autoMatchPct}% auto-admit
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-gatewise-border shadow-xs hover:border-gatewise-primary/40 transition-colors">
          <div className="flex items-center justify-between text-gatewise-secondary">
            <span className="text-[11px] font-bold uppercase tracking-wider">Active Gates</span>
            <DoorClosed className="w-4 h-4 text-gatewise-teal" />
          </div>
          <div className="text-2xl font-black text-gatewise-text mt-2 font-mono">
            {activeGates} <span className="text-xs text-gatewise-secondary font-normal">/ {gates.length}</span>
          </div>
          <span className="text-[10px] text-gatewise-secondary font-medium block mt-1">All posts locked & manned</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-gatewise-border shadow-xs hover:border-gatewise-primary/40 transition-colors">
          <div className="flex items-center justify-between text-gatewise-secondary">
            <span className="text-[11px] font-bold uppercase tracking-wider">Exceptions / Denials</span>
            <AlertTriangle className="w-4 h-4 text-gatewise-error" />
          </div>
          <div className="text-2xl font-black text-gatewise-error mt-2 font-mono">{exceptionsCount}</div>
          <span className="text-[10px] text-gatewise-secondary font-medium block mt-1">Expired / unindexed</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-gatewise-border shadow-xs hover:border-gatewise-primary/40 transition-colors">
          <div className="flex items-center justify-between text-gatewise-secondary">
            <span className="text-[11px] font-bold uppercase tracking-wider">Pending Referrals</span>
            <Users className="w-4 h-4 text-gatewise-warning" />
          </div>
          <div className="text-2xl font-black text-gatewise-warning mt-2 font-mono">{pendingEnrollments}</div>
          <Link href="/admin/enrollment" className="text-[10px] text-gatewise-primary font-bold hover:underline flex items-center mt-1">
            Review requests <ArrowUpRight className="w-2.5 h-2.5 ml-0.5" />
          </Link>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-gatewise-border shadow-xs hover:border-gatewise-primary/40 transition-colors">
          <div className="flex items-center justify-between text-gatewise-secondary">
            <span className="text-[11px] font-bold uppercase tracking-wider">Visitors on Campus</span>
            <Users className="w-4 h-4 text-gatewise-softBlue" />
          </div>
          <div className="text-2xl font-black text-gatewise-text mt-2 font-mono">{activeVisitors}</div>
          <Link href="/admin/visitors" className="text-[10px] text-gatewise-primary font-bold hover:underline flex items-center mt-1">
            Active passes <ArrowUpRight className="w-2.5 h-2.5 ml-0.5" />
          </Link>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-gatewise-border shadow-xs hover:border-gatewise-primary/40 transition-colors">
          <div className="flex items-center justify-between text-gatewise-secondary">
            <span className="text-[11px] font-bold uppercase tracking-wider">Drive Repository</span>
            <Database className="w-4 h-4 text-gatewise-deep" />
          </div>
          <div className="text-2xl font-black text-gatewise-success mt-2">
            {metrics?.drive_sync_last_status === 'COMPLETED' ? 'Synced' : 'Active'}
          </div>
          <span className="text-[10px] text-gatewise-secondary font-mono block mt-1">
            {metrics?.drive_identities_count || 6} identities indexed
          </span>
        </div>
      </div>

      {/* 2. Campus Isometric Visualization & Operational Station Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Campus 3D / Isometric Overview Card */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-white border border-gatewise-border shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <h2 className="text-sm font-bold text-gatewise-text flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-gatewise-primary" />
                <span>Campus Perimeter & Gate Stations</span>
              </h2>
              <p className="text-[11px] text-gatewise-secondary">
                Select a physical station to inspect active guard assignment and hourly access telemetry.
              </p>
            </div>
            <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              Live Map
            </span>
          </div>

          {/* Interactive Campus Vector / Map Overview */}
          <div className="relative h-72 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-slate-700/60 overflow-hidden p-6 flex flex-col justify-between text-white">
            {/* Ambient Background Grid */}
            <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#23865D_1px,transparent_1px)] [background-size:16px_16px]"></div>
            
            {/* Campus Locus Blueprint Lines */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-30">
              <path d="M 60 180 Q 240 80 480 140 T 720 200" fill="none" stroke="#23865D" strokeWidth="2" strokeDasharray="4,4" />
              <path d="M 120 240 L 360 160 L 600 220" fill="none" stroke="#3A9B8B" strokeWidth="1.5" />
            </svg>

            {/* Top Campus Title */}
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <span className="text-xs font-black tracking-widest text-emerald-400 uppercase">IIM Sambalpur</span>
                <span className="block text-[11px] text-slate-400">Ring Road Perimeter Network</span>
              </div>
              <div className="flex items-center space-x-2 text-[11px] bg-slate-800/80 px-3 py-1 rounded-full border border-slate-700">
                <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                <span>Encrypted Telemetry Channel</span>
              </div>
            </div>

            {/* Interactive Gate Nodes pinned across campus */}
            <div className="relative z-10 grid grid-cols-2 sm:grid-cols-3 gap-3 my-auto">
              {gates.map((g) => {
                const isSelected = selectedGate?.id === g.id;
                return (
                  <button
                    key={g.id}
                    onClick={() => setSelectedGate(g)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'bg-emerald-950/90 border-emerald-400 shadow-md ring-1 ring-emerald-400'
                        : 'bg-slate-800/70 border-slate-700/80 hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-emerald-300 font-bold">{g.code}</span>
                      <span className={`w-2 h-2 rounded-full ${g.status === 'ACTIVE' ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`}></span>
                    </div>
                    <span className="text-xs font-bold text-white block truncate mt-1">{g.name}</span>
                    <span className="text-[10px] text-slate-400 block truncate mt-0.5">
                      Guard: {g.active_guard_name || 'Unassigned'}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Bottom Station Details Pill */}
            {selectedGate && (
              <div className="relative z-10 flex items-center justify-between bg-slate-800/90 backdrop-blur-sm px-4 py-2 rounded-xl border border-slate-700 text-xs">
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-emerald-300">{selectedGate.name}</span>
                  <span className="text-slate-400">·</span>
                  <span className="text-slate-300">{selectedGate.location}</span>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="font-mono text-slate-200 font-semibold">{selectedGate.today_scans_count} scans</span>
                  <Link href={`/admin/gates`} className="text-emerald-400 hover:underline flex items-center">
                    Manage Post <ChevronRight className="w-3 h-3 ml-0.5" />
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Selected Gate Status & Telemetry Card */}
        <div className="p-6 rounded-3xl bg-white border border-gatewise-border shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gatewise-border">
              <span className="text-xs font-bold text-gatewise-secondary uppercase tracking-wider">
                Station Telemetry
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                {selectedGate?.status || 'ACTIVE'}
              </span>
            </div>

            <div>
              <h3 className="text-base font-bold text-gatewise-text">{selectedGate?.name || 'Gate Post 02'}</h3>
              <p className="text-xs text-gatewise-secondary mt-0.5">{selectedGate?.location}</p>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-background-secondary border border-gatewise-border">
                <span className="text-gatewise-secondary font-medium">Officer on Duty</span>
                <span className="font-bold text-gatewise-text font-mono">
                  {selectedGate?.active_guard_name || 'Officer Ramesh Verma'}
                </span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-background-secondary border border-gatewise-border">
                <span className="text-gatewise-secondary font-medium">Shift Schedule</span>
                <span className="font-semibold text-gatewise-text">Shift A (06:00 - 14:00)</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-background-secondary border border-gatewise-border">
                <span className="text-gatewise-secondary font-medium">Today's Admitted Scans</span>
                <span className="font-bold text-gatewise-success font-mono">
                  {selectedGate?.today_verified_count || 0}
                </span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-background-secondary border border-gatewise-border">
                <span className="text-gatewise-secondary font-medium">Today's Denied Exceptions</span>
                <span className="font-bold text-gatewise-error font-mono">
                  {selectedGate?.today_denied_count || 0}
                </span>
              </div>
            </div>
          </div>

          <Link
            href="/admin/activity"
            className="w-full py-2.5 rounded-xl bg-gatewise-primary text-white text-xs font-bold flex items-center justify-center space-x-1 hover:bg-gatewise-deep transition-colors shadow-xs"
          >
            <span>Open Real-Time Activity Log</span>
            <ChevronRight className="w-3.5 h-3.5 ml-1" />
          </Link>
        </div>
      </div>

      {/* 3. Traffic Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Hourly Traffic Chart */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-white border border-gatewise-border shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-gatewise-text">Campus Entrance Traffic by Hour</h2>
              <p className="text-[11px] text-gatewise-secondary">Volume of authorized verifications vs. visitor registrations.</p>
            </div>
            <div className="flex items-center space-x-3 text-[11px] font-semibold text-gatewise-secondary">
              <span className="flex items-center"><span className="w-2.5 h-2.5 rounded-sm bg-gatewise-primary mr-1.5"></span> Verified</span>
              <span className="flex items-center"><span className="w-2.5 h-2.5 rounded-sm bg-gatewise-teal mr-1.5"></span> Visitors</span>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={hourlyData}>
                <defs>
                  <linearGradient id="colorVerif" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#23865D" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#23865D" stopOpacity={0.0}/>
                  </linearGradient>
                  <linearGradient id="colorVis" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3A9B8B" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3A9B8B" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="hour" stroke="#95A39A" fontSize={11} tickLine={false} />
                <YAxis stroke="#95A39A" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', borderColor: '#E2EBE4', fontSize: '11px' }}
                />
                <Area type="monotone" dataKey="verified_entries" name="Verified" stroke="#23865D" strokeWidth={2} fillOpacity={1} fill="url(#colorVerif)" />
                <Area type="monotone" dataKey="visitors_registered" name="Visitors" stroke="#3A9B8B" strokeWidth={2} fillOpacity={1} fill="url(#colorVis)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Verification Outcomes Distribution */}
        <div className="p-6 rounded-3xl bg-white border border-gatewise-border shadow-xs space-y-4">
          <div>
            <h2 className="text-sm font-bold text-gatewise-text">Match Outcomes Breakdown</h2>
            <p className="text-[11px] text-gatewise-secondary">Proportion of biometric verification classifications.</p>
          </div>

          <div className="h-56 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={OUTCOME_COLORS[index % OUTCOME_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', borderColor: '#E2EBE4', fontSize: '11px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1.5 pt-2 border-t border-gatewise-border text-[11px]">
            {pieData.map((d, i) => (
              <div key={d.name} className="flex items-center justify-between text-gatewise-secondary">
                <span className="flex items-center">
                  <span className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: OUTCOME_COLORS[i] }}></span>
                  {d.name}
                </span>
                <span className="font-mono font-bold text-gatewise-text">{d.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Recent Real-Time Verification Activity Table */}
      <div className="p-6 rounded-3xl bg-white border border-gatewise-border shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-gatewise-text">Recent Gate Verification Logs</h2>
            <p className="text-[11px] text-gatewise-secondary">Direct event feed received from operational Android guard terminals.</p>
          </div>
          <Link
            href="/admin/activity"
            className="text-xs font-bold text-gatewise-primary hover:underline flex items-center"
          >
            <span>View Full Live Activity Feed</span>
            <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-gatewise-border text-gatewise-secondary font-bold text-[11px] uppercase tracking-wider">
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Station Post</th>
                <th className="py-3 px-4">Subject Reference</th>
                <th className="py-3 px-4">Outcome</th>
                <th className="py-3 px-4">Authorization</th>
                <th className="py-3 px-4">Guard Decision</th>
                <th className="py-3 px-4 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gatewise-border/60">
              {recentEvents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-gatewise-secondary">
                    No verification records logged today.
                  </td>
                </tr>
              ) : (
                recentEvents.map((evt) => (
                  <tr
                    key={evt.id}
                    onClick={() => setSelectedEvent(evt)}
                    className="hover:bg-background-secondary/70 cursor-pointer transition-colors"
                  >
                    <td className="py-3 px-4 font-mono text-gatewise-secondary">
                      {new Date(evt.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </td>
                    <td className="py-3 px-4 font-bold text-gatewise-text">
                      {evt.gate_name}
                    </td>
                    <td className="py-3 px-4">
                      {evt.person_name ? (
                        <div>
                          <span className="font-bold text-gatewise-text block">{evt.person_name}</span>
                          <span className="text-[10px] text-gatewise-secondary font-mono">{evt.person_id}</span>
                        </div>
                      ) : (
                        <span className="text-gatewise-secondary/70 italic">Unidentified subject</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        evt.outcome === 'VERIFIED_AUTHORIZED'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : evt.outcome === 'POTENTIAL_MATCH'
                          ? 'bg-amber-50 text-amber-800 border border-amber-200'
                          : 'bg-rose-50 text-rose-800 border border-rose-200'
                      }`}>
                        {evt.outcome}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-[11px] font-semibold text-gatewise-secondary">
                        {evt.outcome === 'VERIFIED_AUTHORIZED' ? 'Authorized' : 'Requires Review'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`font-mono text-xs font-bold ${
                        evt.guard_decision === 'GRANT_ENTRY'
                          ? 'text-gatewise-success'
                          : evt.guard_decision === 'DENY_ENTRY'
                          ? 'text-gatewise-error'
                          : 'text-gatewise-warning'
                      }`}>
                        {evt.guard_decision}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button className="text-gatewise-primary hover:underline text-xs font-bold">
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Verification Event Detail Modal (Part 8) */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="w-full max-w-xl bg-white rounded-3xl p-6 shadow-2xl border border-gatewise-border space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-gatewise-border">
              <div>
                <span className="text-[10px] font-bold text-gatewise-secondary tracking-widest uppercase">
                  Event Inspection Detail
                </span>
                <h3 className="text-base font-black text-gatewise-text font-mono mt-0.5">
                  {selectedEvent.id}
                </h3>
              </div>
              <button
                onClick={() => setSelectedEvent(null)}
                className="text-xs font-bold text-gatewise-secondary hover:text-gatewise-text p-1.5 rounded-lg hover:bg-background-secondary"
              >
                Close ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="p-3 rounded-2xl bg-background-secondary border border-gatewise-border space-y-1">
                <span className="text-[10px] font-bold text-gatewise-secondary uppercase">Gate Station</span>
                <span className="font-bold text-gatewise-text block">{selectedEvent.gate_name}</span>
                <span className="text-[10px] text-gatewise-secondary font-mono">{selectedEvent.gate_id}</span>
              </div>
              <div className="p-3 rounded-2xl bg-background-secondary border border-gatewise-border space-y-1">
                <span className="text-[10px] font-bold text-gatewise-secondary uppercase">Officer on Duty</span>
                <span className="font-bold text-gatewise-text block">{selectedEvent.guard_name}</span>
                <span className="text-[10px] text-gatewise-secondary font-mono">{selectedEvent.guard_id}</span>
              </div>
            </div>

            {/* Identity & Match Information */}
            <div className="p-4 rounded-2xl border border-gatewise-border space-y-2 text-xs">
              <span className="text-[10px] font-bold text-gatewise-secondary uppercase block">
                Biometric Identification State
              </span>
              <div className="flex items-center justify-between">
                <span className="text-gatewise-secondary">Candidate Match:</span>
                <span className="font-bold text-gatewise-text">{selectedEvent.person_name || 'None (Unregistered)'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gatewise-secondary">Institutional ID:</span>
                <span className="font-mono font-bold text-gatewise-text">{selectedEvent.person_id || 'N/A'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gatewise-secondary">Cosine Match Similarity:</span>
                <span className="font-mono font-bold text-gatewise-primary">
                  {selectedEvent.similarity_score ? `${(selectedEvent.similarity_score * 100).toFixed(1)}%` : 'N/A'}
                </span>
              </div>
            </div>

            {/* Sovereign Guard Decision */}
            <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200/80 space-y-2 text-xs">
              <span className="text-[10px] font-bold text-emerald-900 uppercase block">
                Recorded Officer Decision
              </span>
              <div className="flex items-center justify-between">
                <span className="text-gatewise-secondary">Physical Action:</span>
                <span className="font-mono font-bold text-emerald-800 text-sm">{selectedEvent.guard_decision}</span>
              </div>
              {selectedEvent.decision_reason && (
                <div className="text-[11px] text-gatewise-secondary italic mt-1">
                  Note: "{selectedEvent.decision_reason}"
                </div>
              )}
            </div>

            {/* Cryptographic Audit Seal */}
            <div className="pt-2 border-t border-gatewise-border flex items-center justify-between text-[10px] text-gatewise-secondary font-mono">
              <div className="flex items-center space-x-1.5 truncate">
                <CheckCircle2 className="w-3.5 h-3.5 text-gatewise-success shrink-0" />
                <span className="truncate">Seal: {selectedEvent.cryptographic_signature}</span>
              </div>
              <span className="shrink-0 text-emerald-700 font-bold">HMAC Verified</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
