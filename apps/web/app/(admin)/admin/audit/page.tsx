'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  FileText,
  Search,
  Hexagon,
  Calendar,
  Filter,
  CheckCircle2,
  AlertOctagon,
  Clock,
  ShieldAlert
} from 'lucide-react';

export default function ActivityAndAuditLogsPage() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Page Title & Controls */}
      <div>
        <div className="flex items-center gap-2.5">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Activity & audit logs
          </h1>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#FFF4E5] text-[#B45309]">
            Backend-dependent
          </span>
        </div>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          A searchable administrative record of gate activity.
        </p>
      </div>

      {/* Blue Banner */}
      <div className="bg-[#EBF0FF] border border-[#D0DEFF] text-[#1E3A8A] rounded-2xl p-4 text-xs flex items-center gap-3 shadow-2xs">
        <Hexagon className="w-4 h-4 text-[#2F5BFF] shrink-0" />
        <p className="leading-relaxed">
          Cryptographic verification details display only if the production backend provides them. A table row alone is not proof of immutability.
        </p>
      </div>

      {/* 6 Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-slate-500" />
            <span className="text-xs font-medium text-slate-700">Total events</span>
          </div>
          <div className="my-3 text-2xl font-bold text-slate-900">—</div>
          <div>
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-[#FFF4E5] text-[#B45309]">
              Awaiting backend
            </span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#1FB36B]" />
            <span className="text-xs font-medium text-slate-700">Permitted</span>
          </div>
          <div className="my-3 text-2xl font-bold text-slate-900">—</div>
          <div>
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-[#FFF4E5] text-[#B45309]">
              Awaiting backend
            </span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#C93338]" />
            <span className="text-xs font-medium text-slate-700">Denied</span>
          </div>
          <div className="my-3 text-2xl font-bold text-slate-900">—</div>
          <div>
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-[#FFF4E5] text-[#B45309]">
              Awaiting backend
            </span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <span className="text-xs font-medium text-slate-700">Pending</span>
          </div>
          <div className="my-3 text-2xl font-bold text-slate-900">—</div>
          <div>
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-[#FFF4E5] text-[#B45309]">
              Awaiting backend
            </span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#2F5BFF]" />
            <span className="text-xs font-medium text-slate-700">Referred</span>
          </div>
          <div className="my-3 text-2xl font-bold text-slate-900">—</div>
          <div>
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-[#FFF4E5] text-[#B45309]">
              Awaiting backend
            </span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-slate-400" />
            <span className="text-xs font-medium text-slate-700">Failed requests</span>
          </div>
          <div className="my-3 text-2xl font-bold text-slate-900">—</div>
          <div>
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-[#FFF4E5] text-[#B45309]">
              Awaiting backend
            </span>
          </div>
        </div>
      </div>

      {/* Filter Row */}
      <div className="space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <div className="lg:col-span-2 relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by event ID or person ID"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-[#2F5BFF]"
            />
          </div>
          <select className="px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-700 focus:outline-hidden focus:border-[#2F5BFF]">
            <option value="">Date</option>
            <option value="Today">Today</option>
            <option value="Yesterday">Yesterday</option>
          </select>
          <select className="px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-700 focus:outline-hidden focus:border-[#2F5BFF]">
            <option value="">Gate</option>
            <option value="North">North Gate</option>
            <option value="South">South Gate</option>
          </select>
          <select className="px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-700 focus:outline-hidden focus:border-[#2F5BFF]">
            <option value="">Guard</option>
            <option value="All">All guards</option>
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <select className="px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-700 focus:outline-hidden focus:border-[#2F5BFF]">
            <option value="">Outcome</option>
            <option value="Permitted">Permitted</option>
            <option value="Denied">Denied</option>
          </select>
          <select className="px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-700 focus:outline-hidden focus:border-[#2F5BFF]">
            <option value="">Category</option>
            <option value="Student">Student</option>
            <option value="Faculty">Faculty</option>
            <option value="Worker">Worker</option>
            <option value="Visitor">Visitor</option>
          </select>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/60 border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                <th className="px-5 py-3">TIMESTAMP</th>
                <th className="px-5 py-3">EVENT ID</th>
                <th className="px-5 py-3">GATE</th>
                <th className="px-5 py-3">GUARD</th>
                <th className="px-5 py-3">PERSON REF</th>
                <th className="px-5 py-3">IDENTITY STATUS</th>
                <th className="px-5 py-3">AUTHORISATION</th>
                <th className="px-5 py-3">FINAL DECISION</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={8} className="py-20 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <div className="w-12 h-12 rounded-2xl bg-[#EBF0FF] text-[#2F5BFF] flex items-center justify-center mb-3">
                      <FileText className="w-6 h-6" />
                    </div>
                    <h3 className="text-base font-bold text-slate-900 mb-1">No audit events</h3>
                    <p className="text-xs text-slate-500 max-w-sm mb-4">
                      Opening an event shows its timeline, original request reference, decision history, acting user and related guard session.
                    </p>
                    <Link
                      href="/admin/verification"
                      className="px-4 py-2 rounded-full text-xs font-medium bg-[#2F5BFF] text-white hover:bg-[#254EDB] transition-colors shadow-xs"
                    >
                      Preview verification event
                    </Link>
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
