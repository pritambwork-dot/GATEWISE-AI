'use client';

import React, { useState } from 'react';
import {
  Car,
  Search,
  Plus,
  Hexagon,
  CheckCircle2,
  AlertOctagon,
  Clock,
  ShieldCheck
} from 'lucide-react';

export default function CampusVehiclesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [gateFilter, setGateFilter] = useState('');

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Page Title & Controls */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              Campus vehicles
            </h1>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#FFF4E5] text-[#B45309]">
              Backend-dependent
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Vehicles are managed as their own identity category, separate from people.
          </p>
        </div>

        <button className="px-4 py-2 rounded-full text-xs font-medium bg-[#2F5BFF] text-white hover:bg-[#254EDB] transition-colors shadow-xs">
          Register vehicle
        </button>
      </div>

      {/* Blue Banner */}
      <div className="bg-[#EBF0FF] border border-[#D0DEFF] text-[#1E3A8A] rounded-2xl p-4 text-xs flex items-center gap-3 shadow-2xs">
        <Hexagon className="w-4 h-4 text-[#2F5BFF] shrink-0" />
        <p className="leading-relaxed">
          Number-plate recognition is not implied. It would be shown only if a real model integration existed.
        </p>
      </div>

      {/* 5 Stat Cards Grid (Page 23) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#1FB36B]" />
            <span className="text-xs font-medium text-slate-700">Registered vehicles</span>
          </div>
          <div className="my-3 text-2xl font-bold text-slate-900">—</div>
          <div><span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-[#FFF4E5] text-[#B45309]">Awaiting backend</span></div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#12B5A6]" />
            <span className="text-xs font-medium text-slate-700">Active vehicles</span>
          </div>
          <div className="my-3 text-2xl font-bold text-slate-900">—</div>
          <div><span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-[#FFF4E5] text-[#B45309]">Awaiting backend</span></div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-slate-400" />
            <span className="text-xs font-medium text-slate-700">Expired permissions</span>
          </div>
          <div className="my-3 text-2xl font-bold text-slate-900">—</div>
          <div><span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-[#FFF4E5] text-[#B45309]">Awaiting backend</span></div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <span className="text-xs font-medium text-slate-700">Pending approvals</span>
          </div>
          <div className="my-3 text-2xl font-bold text-slate-900">—</div>
          <div><span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-[#FFF4E5] text-[#B45309]">Awaiting backend</span></div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-slate-400" />
            <span className="text-xs font-medium text-slate-700">Currently inside</span>
          </div>
          <div className="my-3 text-2xl font-bold text-slate-900">—</div>
          <div className="space-y-1">
            <p className="text-[11px] text-slate-500">Shown only if real movement data exists.</p>
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-[#FFF4E5] text-[#B45309]">Awaiting backend</span>
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by registration number"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-[#2F5BFF]"
          />
        </div>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-700 focus:outline-hidden focus:border-[#2F5BFF]"
        >
          <option value="">Type</option>
          <option value="Four Wheeler">Four Wheeler</option>
          <option value="Two Wheeler">Two Wheeler</option>
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-700 focus:outline-hidden focus:border-[#2F5BFF]"
        >
          <option value="">Status</option>
          <option value="Active">Active</option>
          <option value="Expired">Expired</option>
        </select>
        <select
          value={gateFilter}
          onChange={(e) => setGateFilter(e.target.value)}
          className="px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-700 focus:outline-hidden focus:border-[#2F5BFF]"
        >
          <option value="">Gate</option>
          <option value="Main Gate">Main Gate</option>
        </select>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/60 border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                <th className="px-5 py-3">REGISTRATION NO.</th>
                <th className="px-5 py-3">VEHICLE ID</th>
                <th className="px-5 py-3">TYPE</th>
                <th className="px-5 py-3">OWNER</th>
                <th className="px-5 py-3">LINKED PERSON</th>
                <th className="px-5 py-3">DEPARTMENT</th>
                <th className="px-5 py-3">ACCESS GROUP</th>
                <th className="px-5 py-3">VALIDITY</th>
                <th className="px-5 py-3">STATUS</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={9} className="py-20 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <div className="w-12 h-12 rounded-2xl bg-[#EBF0FF] text-[#2F5BFF] flex items-center justify-center mb-3">
                      <Car className="w-6 h-6" />
                    </div>
                    <h3 className="text-base font-bold text-slate-900 mb-1">No vehicles registered</h3>
                    <p className="text-xs text-slate-500 max-w-sm mb-4">
                      Registered campus vehicles will appear here.
                    </p>
                    <button className="px-4 py-2 rounded-full text-xs font-medium bg-[#2F5BFF] text-white hover:bg-[#254EDB] transition-colors shadow-xs">
                      Preview vehicle record
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
