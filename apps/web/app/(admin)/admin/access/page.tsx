'use client';

import React, { useState } from 'react';
import {
  UserCog,
  Search,
  UserPlus,
  Shield,
  Key,
  CheckCircle2,
  Lock
} from 'lucide-react';

export default function AccessManagementPage() {
  const [activeTab, setActiveTab] = useState<'admins' | 'roles'>('admins');
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Page Title & Controls */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              Access management
            </h1>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#FFF4E5] text-[#B45309]">
              Backend-dependent
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Administrator accounts, roles and permissions. All privileged actions are confirmed and audited.
          </p>
        </div>

        <button className="px-4 py-2 rounded-full text-xs font-medium bg-[#2F5BFF] text-white hover:bg-[#254EDB] transition-colors shadow-xs">
          Invite administrator
        </button>
      </div>

      {/* Tabs */}
      <div className="inline-flex items-center p-1 bg-white border border-slate-200 rounded-full shadow-xs text-xs font-medium text-slate-600">
        <button
          onClick={() => setActiveTab('admins')}
          className={`px-4 py-1.5 rounded-full transition-colors ${
            activeTab === 'admins'
              ? 'bg-[#2F5BFF] text-white shadow-xs font-semibold'
              : 'hover:text-slate-900 text-slate-600'
          }`}
        >
          Administrators
        </button>
        <button
          onClick={() => setActiveTab('roles')}
          className={`px-4 py-1.5 rounded-full transition-colors ${
            activeTab === 'roles'
              ? 'bg-[#2F5BFF] text-white shadow-xs font-semibold'
              : 'hover:text-slate-900 text-slate-600'
          }`}
        >
          Roles & permissions
        </button>
      </div>

      {/* Filters Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="lg:col-span-2 relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search administrators"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-[#2F5BFF]"
          />
        </div>
        <select className="px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-700 focus:outline-hidden focus:border-[#2F5BFF]">
          <option value="">Role</option>
          <option value="Super Admin">Super Administrator</option>
          <option value="Admin">Administrator</option>
          <option value="Auditor">Auditor</option>
        </select>
        <select className="px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-700 focus:outline-hidden focus:border-[#2F5BFF]">
          <option value="">Status</option>
          <option value="Active">Active</option>
          <option value="Suspended">Suspended</option>
        </select>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/60 border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                <th className="px-5 py-3">NAME</th>
                <th className="px-5 py-3">ACCOUNT ID</th>
                <th className="px-5 py-3">ROLE</th>
                <th className="px-5 py-3">INSTITUTION</th>
                <th className="px-5 py-3">STATUS</th>
                <th className="px-5 py-3">LAST LOGIN</th>
                <th className="px-5 py-3">PERMISSION SUMMARY</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={7} className="py-20 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <div className="w-12 h-12 rounded-2xl bg-[#EBF0FF] text-[#2F5BFF] flex items-center justify-center mb-3">
                      <UserCog className="w-6 h-6" />
                    </div>
                    <h3 className="text-base font-bold text-slate-900 mb-1">No administrators listed</h3>
                    <p className="text-xs text-slate-500 max-w-sm mb-4">
                      Accounts appear here. Change role, suspend and revoke access are confirmed and logged.
                    </p>
                    <button
                      onClick={() => setActiveTab('roles')}
                      className="px-4 py-2 rounded-full text-xs font-medium bg-[#2F5BFF] text-white hover:bg-[#254EDB] transition-colors shadow-xs"
                    >
                      View roles and permissions
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
