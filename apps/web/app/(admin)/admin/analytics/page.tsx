'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  BarChart3,
  Download,
  FileText,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
} from 'lucide-react';
import { liveSync } from '@/lib/services/live-sync';

type ReportCategory =
  | 'Institutional overview'
  | 'Guard performance'
  | 'Verification outcomes';

type DateRangeOption = 'Today' | 'Last 7 days' | 'Last 30 days' | 'All time';

export default function ReportsAndAnalyticsPage() {
  const [activeTab, setActiveTab] = useState<'builder' | 'guard' | 'gate' | 'export'>('builder');
  const [category, setCategory] = useState<ReportCategory>('Institutional overview');
  const [dateRange, setDateRange] = useState<DateRangeOption>('Last 7 days');
  const [gateFilter, setGateFilter] = useState<string>('ALL');
  const [guardFilter, setGuardFilter] = useState<string>('ALL');

  const [people, setPeople] = useState(() => liveSync.getPersons());
  const [vehicles, setVehicles] = useState(() => liveSync.getVehicles());
  const [guards, setGuards] = useState(() => liveSync.getGuards());
  const [events, setEvents] = useState(() => liveSync.getEvents());
  const [generatedAt, setGeneratedAt] = useState<string | null>(null);
  const [duplicateNotice, setDuplicateNotice] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const sync = () => {
      setPeople([...liveSync.getPersons()]);
      setVehicles([...liveSync.getVehicles()]);
      setGuards([...liveSync.getGuards()]);
      setEvents([...liveSync.getEvents()]);
    };
    sync();
    const unsub = liveSync.subscribe(sync);
    liveSync.refreshAdminState().catch(() => {});
    return () => unsub();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await liveSync.refreshAdminState();
    } finally {
      setRefreshing(false);
    }
  };

  const filteredEvents = useMemo(() => {
    const now = Date.now();
    const cutoffMs =
      dateRange === 'Today'
        ? 24 * 60 * 60 * 1000
        : dateRange === 'Last 7 days'
        ? 7 * 24 * 60 * 60 * 1000
        : dateRange === 'Last 30 days'
        ? 30 * 24 * 60 * 60 * 1000
        : Infinity;

    return events.filter((ev) => {
      if (cutoffMs !== Infinity && ev.timestamp) {
        const age = now - new Date(ev.timestamp).getTime();
        if (age > cutoffMs) return false;
      }
      if (gateFilter !== 'ALL' && ev.gate_id !== gateFilter) return false;
      if (guardFilter !== 'ALL' && ev.guard_id !== guardFilter) return false;
      return true;
    });
  }, [events, dateRange, gateFilter, guardFilter]);

  const reportRows = useMemo(() => {
    if (category === 'Guard performance') {
      return guards.map((g) => {
        const guardEvents = filteredEvents.filter((e) => e.guard_id === g.id || e.guard_name === g.full_name);
        const verified = guardEvents.filter((e) => String(e.outcome || '').includes('VERIFIED')).length;
        return {
          col1: g.full_name,
          col2: (g as any).assigned_gate_code || 'GATE-01',
          col3: `${guardEvents.length} scans (${verified} verified)`,
          col4: (g as any).permissions?.registration_mode || 'APPROVAL_REQUIRED',
        };
      });
    }
    if (category === 'Verification outcomes') {
      return filteredEvents.slice(0, 50).map((e) => ({
        col1: e.person_name || (e as any).vehicle_plate || (e as any).plate_number || 'Unknown Subject',
        col2: e.gate_id || 'GATE-01',
        col3: e.outcome,
        col4: e.timestamp ? new Date(e.timestamp).toLocaleString('en-IN') : '—',
      }));
    }
    return [
      { col1: 'Authorized People', col2: 'Central DB', col3: `${people.length} records`, col4: 'Active' },
      { col1: 'Registered Vehicles', col2: 'ANPR Registry', col3: `${vehicles.length} vehicles`, col4: 'Active' },
      { col1: 'Active Security Guards', col2: 'Field Terminals', col3: `${guards.length} officers`, col4: 'RBAC Enforced' },
      { col1: `Verification Events (${dateRange})`, col2: gateFilter === 'ALL' ? 'All Gates' : gateFilter, col3: `${filteredEvents.length} scans`, col4: 'Logged' },
    ];
  }, [category, guards, filteredEvents, people.length, vehicles.length, dateRange, gateFilter]);

  const handleGenerateReport = () => {
    setGeneratedAt(new Date().toLocaleTimeString('en-IN'));
    setDuplicateNotice(null);
  };

  const handleCheckDuplicates = () => {
    const plates = vehicles.map((v) => v.normalized_plate).filter(Boolean);
    const dupPlates = plates.filter((p, idx) => plates.indexOf(p) !== idx);
    const phones = people.map((p) => p.phone).filter(Boolean);
    const dupPhones = phones.filter((p, idx) => phones.indexOf(p) !== idx);
    if (dupPlates.length === 0 && dupPhones.length === 0) {
      setDuplicateNotice(`Validation passed: 0 duplicate plates across ${vehicles.length} vehicles and 0 duplicate phones across ${people.length} people.`);
    } else {
      setDuplicateNotice(`Found ${dupPlates.length} duplicate plate(s) and ${dupPhones.length} duplicate phone(s).`);
    }
  };

  const handleDownloadCsv = () => {
    const header = ['Metric / Subject', 'Scope / Gate', 'Result / Count', 'Status / Timestamp'];
    const lines = [
      header.join(','),
      ...reportRows.map((r) =>
        [r.col1, r.col2, r.col3, r.col4]
          .map((cell) => `"${String(cell).replace(/"/g, '""')}"`)
          .join(','),
      ),
    ];
    const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `gatewise-${category.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Reports &amp; Analytics
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Generate live operational reports from centralized PostgreSQL telemetry.
          </p>
        </div>
        <button
          type="button"
          onClick={handleRefresh}
          disabled={refreshing}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 hover:border-[#2F5BFF] text-xs font-semibold text-slate-700 cursor-pointer self-start"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-[#2F5BFF] ${refreshing ? 'animate-spin' : ''}`} />
          <span>Sync Telemetry</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200/80 pb-3">
        {[
          { id: 'builder' as const, label: 'Report builder', icon: FileText },
          { id: 'guard' as const, label: 'Guard performance', icon: ShieldCheck },
          { id: 'gate' as const, label: 'Gate telemetry', icon: BarChart3 },
          { id: 'export' as const, label: 'Export centre', icon: Download },
        ].map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                setActiveTab(tab.id);
                if (tab.id === 'guard') setCategory('Guard performance');
                if (tab.id === 'gate') setCategory('Verification outcomes');
                if (tab.id === 'builder') setCategory('Institutional overview');
              }}
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                active
                  ? 'bg-[#2F5BFF] text-white shadow-xs'
                  : 'text-slate-600 hover:bg-white hover:text-slate-900'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Generate a Report Card */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
        <h2 className="text-base font-bold text-slate-900">Generate a report</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 text-xs">
          <div>
            <label className="block font-medium text-slate-700 mb-2">Report category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as ReportCategory)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-none focus:border-[#2F5BFF]"
            >
              <option value="Institutional overview">Institutional overview</option>
              <option value="Guard performance">Guard performance</option>
              <option value="Verification outcomes">Verification outcomes</option>
            </select>
          </div>

          <div>
            <label className="block font-medium text-slate-700 mb-2">Date range</label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value as DateRangeOption)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-none focus:border-[#2F5BFF]"
            >
              <option value="Today">Today</option>
              <option value="Last 7 days">Last 7 days</option>
              <option value="Last 30 days">Last 30 days</option>
              <option value="All time">All time</option>
            </select>
          </div>

          <div>
            <label className="block font-medium text-slate-700 mb-2">Gate</label>
            <select
              value={gateFilter}
              onChange={(e) => setGateFilter(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-none focus:border-[#2F5BFF]"
            >
              <option value="ALL">All gates</option>
              <option value="GATE-01">GATE-01</option>
              <option value="GATE-02">GATE-02</option>
            </select>
          </div>

          <div>
            <label className="block font-medium text-slate-700 mb-2">Guard</label>
            <select
              value={guardFilter}
              onChange={(e) => setGuardFilter(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-none focus:border-[#2F5BFF]"
            >
              <option value="ALL">All guards</option>
              {guards.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.full_name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleGenerateReport}
              className="px-5 py-2.5 rounded-full text-xs font-semibold bg-[#2F5BFF] text-white hover:bg-[#254EDB] transition-colors shadow-xs cursor-pointer"
            >
              Generate report
            </button>
            <button
              type="button"
              onClick={handleCheckDuplicates}
              className="px-4 py-2.5 rounded-full text-xs font-medium bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors shadow-xs cursor-pointer"
            >
              Validate and check duplicates
            </button>
            <button
              type="button"
              onClick={handleDownloadCsv}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full text-xs font-semibold bg-slate-900 text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download CSV</span>
            </button>
          </div>
          {generatedAt && (
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#2F5BFF]">
              <CheckCircle2 className="w-4 h-4" />
              Report generated at {generatedAt}
            </span>
          )}
        </div>

        {duplicateNotice && (
          <div className="p-3.5 rounded-xl bg-[#EEF2FF] border border-[#2F5BFF]/20 text-xs font-medium text-[#1E3A8A] flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-[#2F5BFF] shrink-0" />
            <span>{duplicateNotice}</span>
          </div>
        )}
      </div>

      {/* Live Generated Report Preview Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900">
            {category} ({reportRows.length} rows)
          </h3>
          <span className="font-mono text-[11px] text-slate-500">Live PostgreSQL Data</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-mono uppercase text-slate-500">
                <th className="py-3 px-4">Item / Subject</th>
                <th className="py-3 px-4">Scope / Gate</th>
                <th className="py-3 px-4">Metric / Outcome</th>
                <th className="py-3 px-4">Status / Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {reportRows.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-slate-400">
                    No records match the selected filters.
                  </td>
                </tr>
              ) : (
                reportRows.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/70">
                    <td className="py-3 px-4 font-semibold text-slate-900">{row.col1}</td>
                    <td className="py-3 px-4 font-mono text-slate-600">{row.col2}</td>
                    <td className="py-3 px-4 font-mono text-[#2F5BFF] font-semibold">{row.col3}</td>
                    <td className="py-3 px-4 font-mono text-slate-600">{row.col4}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
