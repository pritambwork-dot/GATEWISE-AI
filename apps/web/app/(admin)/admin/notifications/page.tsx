'use client';

import React, { useState } from 'react';
import {
  Bell,
  Search,
  Hexagon,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Filter
} from 'lucide-react';

export default function NotificationsPage() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Page Title & Controls */}
      <div>
        <div className="flex items-center gap-2.5">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Notifications & alerts
          </h1>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#FFF4E5] text-[#B45309]">
            Backend-dependent
          </span>
        </div>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Security alerts, reviews, registrations, enrollment failures and gate connectivity.
        </p>
      </div>

      {/* Amber Banner (Page 25) */}
      <div className="bg-[#FFF9EE] border border-[#FDE68A] text-[#92400E] rounded-2xl p-4 text-xs flex items-center gap-3 shadow-2xs">
        <Hexagon className="w-4 h-4 text-[#D97706] shrink-0" />
        <p className="leading-relaxed">
          Notification features render only when a genuine notification service is configured.
        </p>
      </div>

      {/* Filters Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search notifications"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-[#2F5BFF]"
          />
        </div>
        <select className="px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-700 focus:outline-hidden focus:border-[#2F5BFF]">
          <option value="">Category</option>
          <option value="Security">Security</option>
          <option value="System">System</option>
        </select>
        <select className="px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-700 focus:outline-hidden focus:border-[#2F5BFF]">
          <option value="">Severity</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
        <select className="px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-700 focus:outline-hidden focus:border-[#2F5BFF]">
          <option value="">Read status</option>
          <option value="Unread">Unread</option>
          <option value="Read">Read</option>
        </select>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/60 border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                <th className="px-5 py-3">SEVERITY</th>
                <th className="px-5 py-3">TITLE</th>
                <th className="px-5 py-3">SOURCE</th>
                <th className="px-5 py-3">RELATED EVENT</th>
                <th className="px-5 py-3">TIME</th>
                <th className="px-5 py-3">STATUS</th>
                <th className="px-5 py-3">ACTION</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={7} className="py-20 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <div className="w-12 h-12 rounded-2xl bg-[#EBF0FF] text-[#2F5BFF] flex items-center justify-center mb-3">
                      <Bell className="w-6 h-6" />
                    </div>
                    <h3 className="text-base font-bold text-slate-900 mb-1">No notifications</h3>
                    <p className="text-xs text-slate-500 max-w-sm">
                      Each alert will show severity, time, source, related event, read status and a relevant action.
                    </p>
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
