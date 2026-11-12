'use client';

import React, { useState } from 'react';
import {
  DoorClosed,
  Search,
  Plus,
  Hexagon,
  CheckCircle2,
  AlertOctagon,
  Clock,
  Wifi,
  SlidersHorizontal
} from 'lucide-react';

export default function GatesPage() {
  const [activeTab, setActiveTab] = useState<'list' | 'detail'>('list');
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Page Title & Controls */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              Gates & checkpoints
            </h1>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#E6F8F6] text-[#0F766E]">
              Hardware-dependent
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Checkpoint configuration, assignments and status.
          </p>
        </div>

        <button className="px-4 py-2 rounded-full text-xs font-medium bg-[#2F5BFF] text-white hover:bg-[#254EDB] transition-colors shadow-xs">
          Add gate
        </button>
      </div>

      {/* Blue Hardware Banner (Page 27) */}
      <div className="bg-[#EBF0FF] border border-[#D0DEFF] text-[#1E3A8A] rounded-2xl p-4 text-xs flex items-center gap-3 shadow-2xs">
        <Hexagon className="w-4 h-4 text-[#2F5BFF] shrink-0" />
        <p className="leading-relaxed">
          The portal does not control physical barriers unless a real, authorised hardware integration exists.
        </p>
      </div>

      {/* Subtabs */}
      <div className="inline-flex items-center p-1 bg-white border border-slate-200 rounded-full shadow-xs text-xs font-medium text-slate-600">
        <button
          onClick={() => setActiveTab('list')}
          className={`px-4 py-1.5 rounded-full transition-colors ${
            activeTab === 'list'
              ? 'bg-[#2F5BFF] text-white shadow-xs font-semibold'
              : 'hover:text-slate-900 text-slate-600'
          }`}
        >
          Gate list
        </button>
        <button
          onClick={() => setActiveTab('detail')}
          className={`px-4 py-1.5 rounded-full transition-colors ${
            activeTab === 'detail'
              ? 'bg-[#2F5BFF] text-white shadow-xs font-semibold'
              : 'hover:text-slate-900 text-slate-600'
          }`}
        >
          Gate detail
        </button>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search gates"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-[#2F5BFF]"
          />
        </div>
        <select className="px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-700 focus:outline-hidden focus:border-[#2F5BFF]">
          <option value="">Status</option>
          <option value="Active">Active</option>
          <option value="Offline">Offline</option>
        </select>
        <select className="px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-700 focus:outline-hidden focus:border-[#2F5BFF]">
          <option value="">Network</option>
          <option value="Online">Online</option>
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
                <th className="px-5 py-3">LOCATION</th>
                <th className="px-5 py-3">ASSIGNED GUARDS</th>
                <th className="px-5 py-3">STATUS</th>
                <th className="px-5 py-3">LAST ACTIVITY</th>
                <th className="px-5 py-3">NETWORK</th>
                <th className="px-5 py-3">SERVICE STATUS</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={8} className="py-20 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <div className="w-12 h-12 rounded-2xl bg-[#EBF0FF] text-[#2F5BFF] flex items-center justify-center mb-3">
                      <DoorClosed className="w-6 h-6" />
                    </div>
                    <h3 className="text-base font-bold text-slate-900 mb-1">No gates configured</h3>
                    <p className="text-xs text-slate-500 max-w-sm mb-4">
                      Gates you configure appear here.
                    </p>
                    <button className="px-4 py-2 rounded-full text-xs font-medium bg-[#2F5BFF] text-white hover:bg-[#254EDB] transition-colors shadow-xs">
                      Learn about gates
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="px-5 py-3.5 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 bg-white">
          <span>0 shown · count unavailable until the backend responds</span>
          <div className="flex items-center gap-2">
            <button disabled className="px-3 py-1 rounded-lg border border-slate-200 text-slate-300 text-xs bg-slate-50 cursor-not-allowed">Previous</button>
            <button disabled className="px-3 py-1 rounded-lg border border-slate-200 text-slate-300 text-xs bg-slate-50 cursor-not-allowed">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
