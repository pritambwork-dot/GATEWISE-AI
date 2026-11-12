'use client';

import React, { useState } from 'react';
import {
  Activity,
  DoorClosed,
  Shield,
  Clock,
  RefreshCw,
  Search,
  Filter,
  CheckCircle2,
  AlertOctagon,
  ChevronRight,
  Hexagon
} from 'lucide-react';

export default function LiveOperationsPage() {
  const [activeTab, setActiveTab] = useState<'gates' | 'guards'>('gates');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [networkFilter, setNetworkFilter] = useState('All');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState<string>('not yet');

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setLastRefreshed(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      setIsRefreshing(false);
    }, 600);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Page Title & Controls */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              Live Operations Centre
            </h1>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#FFF4E5] text-[#B45309]">
              Backend-dependent
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Monitor active gates and guard sessions. Data refreshes by polling, and the last refresh time is always shown.
          </p>
        </div>

        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors shadow-xs w-fit"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-[#2F5BFF]' : 'text-slate-500'}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Blue Banner */}
      <div className="bg-[#EBF0FF] border border-[#D0DEFF] text-[#1E3A8A] rounded-2xl p-4 text-xs flex items-center gap-3 shadow-2xs">
        <Hexagon className="w-4 h-4 text-[#2F5BFF] shrink-0" />
        <p className="leading-relaxed">
          <strong>Last refreshed: {lastRefreshed}.</strong> This screen is not described as live unless the backend streams updates.
        </p>
      </div>

      {/* Tabs */}
      <div className="inline-flex items-center p-1 bg-white border border-slate-200 rounded-full shadow-xs text-xs font-medium text-slate-600">
        <button
          onClick={() => setActiveTab('gates')}
          className={`px-4 py-1.5 rounded-full transition-colors ${
            activeTab === 'gates'
              ? 'bg-[#2F5BFF] text-white shadow-xs font-semibold'
              : 'hover:text-slate-900 text-slate-600'
          }`}
        >
          Gate monitoring
        </button>
        <button
          onClick={() => setActiveTab('guards')}
          className={`px-4 py-1.5 rounded-full transition-colors ${
            activeTab === 'guards'
              ? 'bg-[#2F5BFF] text-white shadow-xs font-semibold'
              : 'hover:text-slate-900 text-slate-600'
          }`}
        >
          Active guard sessions
        </button>
      </div>

      {/* 7 Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Online gates */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#1FB36B]" />
            <span className="text-xs font-medium text-slate-700">Online gates</span>
          </div>
          <div className="my-3">
            <span className="text-2xl font-bold tracking-tight text-slate-900">—</span>
          </div>
          <div className="space-y-2">
            <p className="text-[11px] text-slate-500">Gates reporting a connection.</p>
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-[#FFF4E5] text-[#B45309]">
              Awaiting backend
            </span>
          </div>
        </div>

        {/* Card 2: Offline gates */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#C93338]" />
            <span className="text-xs font-medium text-slate-700">Offline gates</span>
          </div>
          <div className="my-3">
            <span className="text-2xl font-bold tracking-tight text-slate-900">—</span>
          </div>
          <div className="space-y-2">
            <p className="text-[11px] text-slate-500">Gates with no connection.</p>
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-[#FFF4E5] text-[#B45309]">
              Awaiting backend
            </span>
          </div>
        </div>

        {/* Card 3: Active guards */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#2F5BFF]" />
            <span className="text-xs font-medium text-slate-700">Active guards</span>
          </div>
          <div className="my-3">
            <span className="text-2xl font-bold tracking-tight text-slate-900">—</span>
          </div>
          <div className="space-y-2">
            <p className="text-[11px] text-slate-500">Guards with an open session.</p>
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-[#FFF4E5] text-[#B45309]">
              Awaiting backend
            </span>
          </div>
        </div>

        {/* Card 4: Guards on break */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <span className="text-xs font-medium text-slate-700">Guards on break</span>
          </div>
          <div className="my-3">
            <span className="text-2xl font-bold tracking-tight text-slate-900">—</span>
          </div>
          <div className="space-y-2">
            <p className="text-[11px] text-slate-500">Shown only where breaks are recorded.</p>
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-[#FFF4E5] text-[#B45309]">
              Awaiting backend
            </span>
          </div>
        </div>

        {/* Card 5: Active sessions */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#2F5BFF]" />
            <span className="text-xs font-medium text-slate-700">Active sessions</span>
          </div>
          <div className="my-3">
            <span className="text-2xl font-bold tracking-tight text-slate-900">—</span>
          </div>
          <div className="space-y-2">
            <p className="text-[11px] text-slate-500">Open guard sessions.</p>
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-[#FFF4E5] text-[#B45309]">
              Awaiting backend
            </span>
          </div>
        </div>

        {/* Card 6: Pending reviews */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <span className="text-xs font-medium text-slate-700">Pending reviews</span>
          </div>
          <div className="my-3">
            <span className="text-2xl font-bold tracking-tight text-slate-900">—</span>
          </div>
          <div className="space-y-2">
            <p className="text-[11px] text-slate-500">Awaiting an authorised reviewer.</p>
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-[#FFF4E5] text-[#B45309]">
              Awaiting backend
            </span>
          </div>
        </div>

        {/* Card 7: Latest scan activity */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-slate-500" />
            <span className="text-xs font-medium text-slate-700">Latest scan activity</span>
          </div>
          <div className="my-3">
            <span className="text-2xl font-bold tracking-tight text-slate-900">—</span>
          </div>
          <div className="space-y-2">
            <p className="text-[11px] text-slate-500">Time of the most recent scan.</p>
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-[#FFF4E5] text-[#B45309]">
              Awaiting backend
            </span>
          </div>
        </div>
      </div>

      {/* Filter Row */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder={activeTab === 'gates' ? 'Search gates' : 'Search guard sessions'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-[#2F5BFF]"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-700 focus:outline-hidden focus:border-[#2F5BFF]"
        >
          <option value="All">Status</option>
          <option value="Online">Online</option>
          <option value="Offline">Offline</option>
        </select>

        <select
          value={networkFilter}
          onChange={(e) => setNetworkFilter(e.target.value)}
          className="px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-700 focus:outline-hidden focus:border-[#2F5BFF]"
        >
          <option value="All">Network</option>
          <option value="Stable">Stable</option>
          <option value="Degraded">Degraded</option>
        </select>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/60 border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                <th className="px-5 py-3">GATE NAME</th>
                <th className="px-5 py-3">GATE ID</th>
                <th className="px-5 py-3">ASSIGNED GUARD</th>
                <th className="px-5 py-3">CURRENT SESSION</th>
                <th className="px-5 py-3">NETWORK</th>
                <th className="px-5 py-3">VERIFICATION SERVICE</th>
                <th className="px-5 py-3">LAST ACTIVITY</th>
                <th className="px-5 py-3">STATUS</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={8} className="py-20 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <div className="w-12 h-12 rounded-2xl bg-[#EBF0FF] text-[#2F5BFF] flex items-center justify-center mb-3">
                      <DoorClosed className="w-6 h-6" />
                    </div>
                    <h3 className="text-base font-bold text-slate-900 mb-1">No gates to monitor</h3>
                    <p className="text-xs text-slate-500 max-w-sm">
                      Configured gates appear here with their live connection and service status.
                    </p>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="px-5 py-3.5 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 bg-white">
          <span>0 shown · count unavailable until the backend responds</span>
          <div className="flex items-center gap-2">
            <button
              disabled
              className="px-3 py-1 rounded-lg border border-slate-200 text-slate-300 text-xs bg-slate-50 cursor-not-allowed"
            >
              Previous
            </button>
            <button
              disabled
              className="px-3 py-1 rounded-lg border border-slate-200 text-slate-300 text-xs bg-slate-50 cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
