'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  Shield,
  Search,
  Plus,
  Download,
  Hexagon,
  Clock,
  User,
  DoorClosed,
  CheckCircle2,
  AlertOctagon,
  Eye,
  SlidersHorizontal,
  ChevronRight,
  UserX,
  FileText
} from 'lucide-react';

function SecurityGuardsContent() {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') === 'analytics' ? 'analytics' : 'list';
  const [activeTab, setActiveTab] = useState<'list' | 'history' | 'profile' | 'analytics'>(initialTab);

  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam === 'analytics') {
      setActiveTab('analytics');
    }
  }, [searchParams]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Page Header */}
      {activeTab === 'profile' ? (
        /* Guard Profile Header (Page 9) */
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                Guard profile
              </h1>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#EBF0FF] text-[#2F5BFF]">
                Confirmed core capability
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Identity, assignment, current session and performance for one guard.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setActiveTab('analytics')}
              className="px-3.5 py-1.5 rounded-full text-xs font-medium bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors shadow-xs"
            >
              View sessions
            </button>
            <button
              onClick={() => setActiveTab('list')}
              className="px-3.5 py-1.5 rounded-full text-xs font-medium bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors shadow-xs"
            >
              Review activity
            </button>
            <button className="px-3.5 py-1.5 rounded-full text-xs font-medium bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors shadow-xs">
              Assign or change gate
            </button>
            <button className="px-3.5 py-1.5 rounded-full text-xs font-medium bg-[#C93338] text-white hover:bg-[#B3262B] transition-colors shadow-xs">
              Suspend account
            </button>
          </div>
        </div>
      ) : activeTab === 'analytics' ? (
        /* Guard Session Analytics Header (Page 10) */
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                Guard session analytics
              </h1>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#FFF4E5] text-[#B45309]">
                Backend-dependent
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              How much work a guard completed in one session. Each metric has a precise definition.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setActiveTab('list')}
              className="px-3.5 py-1.5 rounded-full text-xs font-medium bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors shadow-xs"
            >
              Compare sessions
            </button>
            <Link
              href="/admin/verification"
              className="px-4 py-1.5 rounded-full text-xs font-medium bg-[#2F5BFF] text-white hover:bg-[#254EDB] transition-colors shadow-xs"
            >
              Open event detail
            </Link>
          </div>
        </div>
      ) : (
        /* Standard Security Guards Header (Page 8) */
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                Security Guards
              </h1>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#EBF0FF] text-[#2F5BFF]">
                Confirmed core capability
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Manage guards, gate assignments and working sessions.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button className="px-4 py-2 rounded-full text-xs font-medium bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors shadow-xs">
              Export
            </button>
            <button className="px-4 py-2 rounded-full text-xs font-medium bg-[#2F5BFF] text-white hover:bg-[#254EDB] transition-colors shadow-xs">
              Add Guard
            </button>
          </div>
        </div>
      )}

      {/* Blue Informational Banner (Page 9 & 10) */}
      {activeTab === 'profile' && (
        <div className="bg-[#EBF0FF] border border-[#D0DEFF] text-[#1E3A8A] rounded-2xl p-4 text-xs flex items-center gap-3 shadow-2xs">
          <Hexagon className="w-4 h-4 text-[#2F5BFF] shrink-0" />
          <p className="leading-relaxed">
            Administrative actions appear only when your role permits them. Every change is authenticated and auditable.
          </p>
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="bg-[#EBF0FF] border border-[#D0DEFF] text-[#1E3A8A] rounded-2xl p-4 text-xs flex items-center gap-3 shadow-2xs">
          <Hexagon className="w-4 h-4 text-[#2F5BFF] shrink-0" />
          <p className="leading-relaxed">
            The session summary is not calculated until the backend session state is final.
          </p>
        </div>
      )}

      {/* Sub-Tabs (Page 8) */}
      {(activeTab === 'list' || activeTab === 'history') && (
        <div className="inline-flex items-center p-1 bg-white border border-slate-200 rounded-full shadow-xs text-xs font-medium text-slate-600">
          <button
            onClick={() => setActiveTab('list')}
            className={`px-4 py-1.5 rounded-full transition-colors ${
              activeTab === 'list'
                ? 'bg-[#2F5BFF] text-white shadow-xs font-semibold'
                : 'hover:text-slate-900 text-slate-600'
            }`}
          >
            Guard list
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-4 py-1.5 rounded-full transition-colors ${
              activeTab === 'history'
                ? 'bg-[#2F5BFF] text-white shadow-xs font-semibold'
                : 'hover:text-slate-900 text-slate-600'
            }`}
          >
            Session history
          </button>
        </div>
      )}

      {/* VIEW: Standard Guard List (Page 8) */}
      {(activeTab === 'list' || activeTab === 'history') && (
        <div className="space-y-4">
          {/* Filters Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
            <div className="lg:col-span-2 relative">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search guards by name, ID or email"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-[#2F5BFF]"
              />
            </div>
            <select className="px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-700 focus:outline-hidden focus:border-[#2F5BFF]">
              <option value="">Account status</option>
              <option value="Active">Active</option>
              <option value="Suspended">Suspended</option>
            </select>
            <select className="px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-700 focus:outline-hidden focus:border-[#2F5BFF]">
              <option value="">Shift</option>
              <option value="Morning">Morning</option>
              <option value="Evening">Evening</option>
              <option value="Night">Night</option>
            </select>
            <select className="px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-700 focus:outline-hidden focus:border-[#2F5BFF]">
              <option value="">Connection</option>
              <option value="Online">Online</option>
              <option value="Offline">Offline</option>
            </select>
            <select className="px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-700 focus:outline-hidden focus:border-[#2F5BFF]">
              <option value="">Assigned gate</option>
              <option value="North Gate">North Gate</option>
              <option value="South Gate">South Gate</option>
            </select>
          </div>

          {/* Table Container */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/60 border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                    <th className="px-5 py-3">GUARD</th>
                    <th className="px-5 py-3">GUARD ID</th>
                    <th className="px-5 py-3">INSTITUTIONAL EMAIL</th>
                    <th className="px-5 py-3">ASSIGNED GATE</th>
                    <th className="px-5 py-3">SHIFT STATUS</th>
                    <th className="px-5 py-3">SESSION STATUS</th>
                    <th className="px-5 py-3">LAST ACTIVITY</th>
                    <th className="px-5 py-3">ACCOUNT STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td colSpan={8} className="py-20 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <div className="w-12 h-12 rounded-2xl bg-[#EBF0FF] text-[#2F5BFF] flex items-center justify-center mb-3">
                          <Shield className="w-6 h-6" />
                        </div>
                        <h3 className="text-base font-bold text-slate-900 mb-1">No security guards yet</h3>
                        <p className="text-xs text-slate-500 max-w-md mb-4">
                          Guards appear here once registered. Filters cover Active, Inactive, On duty, Off duty, Online, Offline, Suspended and Pending approval.
                        </p>
                        <button
                          onClick={() => setActiveTab('profile')}
                          className="px-4 py-2 rounded-full text-xs font-medium bg-[#2F5BFF] text-white hover:bg-[#254EDB] transition-colors shadow-xs"
                        >
                          Preview guard profile layout
                        </button>
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
      )}

      {/* VIEW: Guard Profile Preview (Page 9) */}
      {activeTab === 'profile' && (
        <div className="space-y-6">
          {/* 7 Stat Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#2F5BFF]" />
                <span className="text-xs font-medium text-slate-700">Total scans</span>
              </div>
              <div className="my-3 text-2xl font-bold text-slate-900">—</div>
              <div>
                <p className="text-[11px] text-slate-500 mb-1">Scan attempts initiated.</p>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-[#FFF4E5] text-[#B45309]">
                  Awaiting backend
                </span>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#2F5BFF]" />
                <span className="text-xs font-medium text-slate-700">Completed verifications</span>
              </div>
              <div className="my-3 text-2xl font-bold text-slate-900">—</div>
              <div>
                <p className="text-[11px] text-slate-500 mb-1">Finished requests.</p>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-[#FFF4E5] text-[#B45309]">
                  Awaiting backend
                </span>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#12B5A6]" />
                <span className="text-xs font-medium text-slate-700">Verified identities</span>
              </div>
              <div className="my-3 text-2xl font-bold text-slate-900">—</div>
              <div>
                <p className="text-[11px] text-slate-500 mb-1">Successful matches.</p>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-[#FFF4E5] text-[#B45309]">
                  Awaiting backend
                </span>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#1FB36B]" />
                <span className="text-xs font-medium text-slate-700">Authorised entries</span>
              </div>
              <div className="my-3 text-2xl font-bold text-slate-900">—</div>
              <div>
                <p className="text-[11px] text-slate-500 mb-1">Policy allowed.</p>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-[#FFF4E5] text-[#B45309]">
                  Awaiting backend
                </span>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#C93338]" />
                <span className="text-xs font-medium text-slate-700">Denied entries</span>
              </div>
              <div className="my-3 text-2xl font-bold text-slate-900">—</div>
              <div>
                <p className="text-[11px] text-slate-500 mb-1">Policy denied.</p>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-[#FFF4E5] text-[#B45309]">
                  Awaiting backend
                </span>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                <span className="text-xs font-medium text-slate-700">Pending reviews</span>
              </div>
              <div className="my-3 text-2xl font-bold text-slate-900">—</div>
              <div>
                <p className="text-[11px] text-slate-500 mb-1">Unresolved.</p>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-[#FFF4E5] text-[#B45309]">
                  Awaiting backend
                </span>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-slate-500" />
                <span className="text-xs font-medium text-slate-700">Failed or interrupted</span>
              </div>
              <div className="my-3 text-2xl font-bold text-slate-900">—</div>
              <div>
                <p className="text-[11px] text-slate-500 mb-1">Attempts that did not complete.</p>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-[#FFF4E5] text-[#B45309]">
                  Awaiting backend
                </span>
              </div>
            </div>
          </div>

          {/* Guard activity search and empty table */}
          <div className="space-y-4">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search this guard's activity"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-[#2F5BFF]"
              />
            </div>

            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/60 border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                      <th className="px-5 py-3">TIMESTAMP</th>
                      <th className="px-5 py-3">EVENT ID</th>
                      <th className="px-5 py-3">GATE</th>
                      <th className="px-5 py-3">RESULT</th>
                      <th className="px-5 py-3">OUTCOME</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td colSpan={5} className="py-20 text-center">
                        <div className="flex flex-col items-center justify-center">
                          <div className="w-12 h-12 rounded-2xl bg-[#EBF0FF] text-[#2F5BFF] flex items-center justify-center mb-3">
                            <Shield className="w-6 h-6" />
                          </div>
                          <h3 className="text-base font-bold text-slate-900 mb-1">No activity recorded for this guard</h3>
                          <p className="text-xs text-slate-500 max-w-sm mb-4">
                            The chronological timeline lists the guard's real events only.
                          </p>
                          <button
                            onClick={() => setActiveTab('analytics')}
                            className="px-4 py-2 rounded-full text-xs font-medium bg-[#2F5BFF] text-white hover:bg-[#254EDB] transition-colors shadow-xs"
                          >
                            Open session analytics
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

          {/* 3 Detail Cards (Page 9 Bottom) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Identity Card */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900">Identity</h3>
              <div className="space-y-3 text-xs divide-y divide-slate-100">
                <div className="flex items-center justify-between pt-2">
                  <span className="text-slate-500">Photograph</span>
                  <span className="font-mono text-slate-700">—</span>
                </div>
                <div className="flex items-center justify-between pt-2">
                  <span className="text-slate-500">Name</span>
                  <span className="font-mono text-slate-700">—</span>
                </div>
                <div className="flex items-center justify-between pt-2">
                  <span className="text-slate-500">Guard ID</span>
                  <span className="font-mono text-slate-700">—</span>
                </div>
                <div className="flex items-center justify-between pt-2">
                  <span className="text-slate-500">Role</span>
                  <span className="font-mono text-slate-700">—</span>
                </div>
                <div className="flex items-center justify-between pt-2">
                  <span className="text-slate-500">Institution</span>
                  <span className="font-mono text-slate-700">—</span>
                </div>
                <div className="flex items-center justify-between pt-2">
                  <span className="text-slate-500">Account status</span>
                  <span className="font-mono text-slate-700">—</span>
                </div>
              </div>
            </div>

            {/* Assignment Card */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900">Assignment</h3>
              <div className="space-y-3 text-xs divide-y divide-slate-100">
                <div className="flex items-center justify-between pt-2">
                  <span className="text-slate-500">Assigned gate</span>
                  <span className="font-mono text-slate-700">—</span>
                </div>
                <div className="flex items-center justify-between pt-2">
                  <span className="text-slate-500">Gate ID</span>
                  <span className="font-mono text-slate-700">—</span>
                </div>
                <div className="flex items-center justify-between pt-2">
                  <span className="text-slate-500">Assignment start</span>
                  <span className="font-mono text-slate-700">—</span>
                </div>
                <div className="flex items-center justify-between pt-2">
                  <span className="text-slate-500">Assignment status</span>
                  <span className="font-mono text-slate-700">—</span>
                </div>
              </div>
            </div>

            {/* Current Session Card */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900">Current session</h3>
              <div className="space-y-3 text-xs divide-y divide-slate-100">
                <div className="flex items-center justify-between pt-2">
                  <span className="text-slate-500">Session ID</span>
                  <span className="font-mono text-slate-700">—</span>
                </div>
                <div className="flex items-center justify-between pt-2">
                  <span className="text-slate-500">Start time</span>
                  <span className="font-mono text-slate-700">—</span>
                </div>
                <div className="flex items-center justify-between pt-2">
                  <span className="text-slate-500">Duration</span>
                  <span className="font-mono text-slate-700">—</span>
                </div>
                <div className="flex items-center justify-between pt-2">
                  <span className="text-slate-500">Device information</span>
                  <span className="font-mono text-slate-700">—</span>
                </div>
                <div className="flex items-center justify-between pt-2">
                  <span className="text-slate-500">Network status</span>
                  <span className="font-mono text-slate-700">—</span>
                </div>
              </div>
              <p className="text-[11px] text-slate-400 pt-2">Device details appear only where permitted.</p>
            </div>
          </div>
        </div>
      )}

      {/* VIEW: Guard Session Analytics (Page 10) */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          {/* 8 Stat Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#2F5BFF]" />
                <span className="text-xs font-medium text-slate-700">Total scans</span>
              </div>
              <div className="my-3 text-2xl font-bold text-slate-900">—</div>
              <div>
                <p className="text-[11px] text-slate-500 mb-1">Individual attempts.</p>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-[#FFF4E5] text-[#B45309]">
                  Awaiting backend
                </span>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#2F5BFF]" />
                <span className="text-xs font-medium text-slate-700">Completed verifications</span>
              </div>
              <div className="my-3 text-2xl font-bold text-slate-900">—</div>
              <div>
                <p className="text-[11px] text-slate-500 mb-1">Completed requests.</p>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-[#FFF4E5] text-[#B45309]">
                  Awaiting backend
                </span>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#12B5A6]" />
                <span className="text-xs font-medium text-slate-700">Verified identities</span>
              </div>
              <div className="my-3 text-2xl font-bold text-slate-900">—</div>
              <div>
                <p className="text-[11px] text-slate-500 mb-1">Successful identity matches.</p>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-[#FFF4E5] text-[#B45309]">
                  Awaiting backend
                </span>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#1FB36B]" />
                <span className="text-xs font-medium text-slate-700">Authorised entries</span>
              </div>
              <div className="my-3 text-2xl font-bold text-slate-900">—</div>
              <div>
                <p className="text-[11px] text-slate-500 mb-1">Policy-approved events.</p>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-[#FFF4E5] text-[#B45309]">
                  Awaiting backend
                </span>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#C93338]" />
                <span className="text-xs font-medium text-slate-700">Denied entries</span>
              </div>
              <div className="my-3 text-2xl font-bold text-slate-900">—</div>
              <div>
                <p className="text-[11px] text-slate-500 mb-1">Policy-denied events.</p>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-[#FFF4E5] text-[#B45309]">
                  Awaiting backend
                </span>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                <span className="text-xs font-medium text-slate-700">Pending reviews</span>
              </div>
              <div className="my-3 text-2xl font-bold text-slate-900">—</div>
              <div>
                <p className="text-[11px] text-slate-500 mb-1">Unresolved reviews.</p>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-[#FFF4E5] text-[#B45309]">
                  Awaiting backend
                </span>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-slate-400" />
                <span className="text-xs font-medium text-slate-700">Failed attempts</span>
              </div>
              <div className="my-3 text-2xl font-bold text-slate-900">—</div>
              <div>
                <p className="text-[11px] text-slate-500 mb-1">Did not complete.</p>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-[#FFF4E5] text-[#B45309]">
                  Awaiting backend
                </span>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-teal-500" />
                <span className="text-xs font-medium text-slate-700">Unique individuals</span>
              </div>
              <div className="my-3 text-2xl font-bold text-slate-900">—</div>
              <div>
                <p className="text-[11px] text-slate-500 mb-1">Shown only if reliably available.</p>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-[#FFF4E5] text-[#B45309]">
                  Awaiting backend
                </span>
              </div>
            </div>
          </div>

          {/* Session Activity Chart */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
              <div>
                <h2 className="text-base font-bold text-slate-900">Session activity</h2>
                <p className="text-xs text-slate-500 mt-0.5">Scans by hour, outcomes and gate activity across the session</p>
              </div>

              <div className="inline-flex items-center p-1 bg-slate-50 border border-slate-200 rounded-full text-xs">
                {['Today', 'Last 7 days', 'Last 30 days', 'Custom range'].map((r, i) => (
                  <button
                    key={r}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                      i === 0 ? 'bg-white text-slate-900 shadow-2xs font-semibold' : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] text-slate-600 mb-6">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#2F5BFF]" /> Total scans</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#7DA4FF]" /> Completed verifications</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#12B5A6]" /> Verified identities</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#1FB36B]" /> Authorised</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#C93338]" /> Denied</span>
            </div>

            <div className="h-64 rounded-xl border border-dashed border-slate-200 flex flex-col items-center justify-center p-6 text-center bg-slate-50/40">
              <div className="text-xs font-semibold text-slate-800 mb-1">No chart data yet</div>
              <p className="text-[11px] text-slate-500 max-w-md leading-relaxed">
                Series appear only from recorded events. A successful response with no records shows a true zero. A failed request shows an error, and a missing endpoint shows "not configured".
              </p>
            </div>
          </div>

          {/* Session Events Table */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search session events"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-[#2F5BFF]"
                />
              </div>
              <select className="px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-700 focus:outline-hidden focus:border-[#2F5BFF]">
                <option value="">Outcome</option>
                <option value="Permitted">Permitted</option>
                <option value="Denied">Denied</option>
              </select>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/60 border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                      <th className="px-5 py-3">TIMESTAMP</th>
                      <th className="px-5 py-3">EVENT ID</th>
                      <th className="px-5 py-3">IDENTITY REFERENCE</th>
                      <th className="px-5 py-3">SCAN RESULT</th>
                      <th className="px-5 py-3">IDENTITY STATUS</th>
                      <th className="px-5 py-3">AUTHORISATION</th>
                      <th className="px-5 py-3">GUARD ACTION</th>
                      <th className="px-5 py-3">FINAL OUTCOME</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td colSpan={8} className="py-20 text-center">
                        <div className="flex flex-col items-center justify-center">
                          <div className="w-12 h-12 rounded-2xl bg-[#EBF0FF] text-[#2F5BFF] flex items-center justify-center mb-3">
                            <Shield className="w-6 h-6" />
                          </div>
                          <h3 className="text-base font-bold text-slate-900 mb-1">No events in this session</h3>
                          <p className="text-xs text-slate-500 max-w-sm mb-4">
                            Events list chronologically. Select a row for its detail page.
                          </p>
                          <Link
                            href="/admin/verification"
                            className="px-4 py-2 rounded-full text-xs font-medium bg-[#2F5BFF] text-white hover:bg-[#254EDB] transition-colors shadow-xs"
                          >
                            Open event detail
                          </Link>
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

          {/* Metric definitions */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 mb-4">Metric definitions</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-600">
              <div>
                <strong className="block text-slate-900 font-semibold mb-1">Total scans</strong>
                Counts individual attempts. A repeat scan of one person is another scan.
              </div>
              <div>
                <strong className="block text-slate-900 font-semibold mb-1">Completed verifications</strong>
                Counts requests that finished the workflow.
              </div>
              <div>
                <strong className="block text-slate-900 font-semibold mb-1">Verified identities</strong>
                Counts successful identity matches.
              </div>
              <div>
                <strong className="block text-slate-900 font-semibold mb-1">Authorised / denied</strong>
                Count policy decisions, separate from identity.
              </div>
              <div>
                <strong className="block text-slate-900 font-semibold mb-1">Unique individuals</strong>
                Distinct people. Repeat scans do not add people.
              </div>
              <div>
                <strong className="block text-slate-900 font-semibold mb-1">Pending reviews</strong>
                Counts unresolved reviews.
              </div>
            </div>
          </div>

          {/* Session Header & Session Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900">Session header</h3>
              <div className="space-y-3 text-xs divide-y divide-slate-100">
                <div className="flex items-center justify-between pt-2"><span className="text-slate-500">Guard name</span><span className="font-mono text-slate-700">—</span></div>
                <div className="flex items-center justify-between pt-2"><span className="text-slate-500">Guard ID</span><span className="font-mono text-slate-700">—</span></div>
                <div className="flex items-center justify-between pt-2"><span className="text-slate-500">Session ID</span><span className="font-mono text-slate-700">—</span></div>
                <div className="flex items-center justify-between pt-2"><span className="text-slate-500">Assigned gate</span><span className="font-mono text-slate-700">—</span></div>
                <div className="flex items-center justify-between pt-2"><span className="text-slate-500">Session date</span><span className="font-mono text-slate-700">—</span></div>
                <div className="flex items-center justify-between pt-2"><span className="text-slate-500">Start timestamp</span><span className="font-mono text-slate-700">—</span></div>
                <div className="flex items-center justify-between pt-2"><span className="text-slate-500">End timestamp</span><span className="font-mono text-slate-700">—</span></div>
                <div className="flex items-center justify-between pt-2"><span className="text-slate-500">Session duration</span><span className="font-mono text-slate-700">—</span></div>
                <div className="flex items-center justify-between pt-2"><span className="text-slate-500">Session status</span><span className="font-mono text-slate-700">—</span></div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900">Session summary</h3>
              <div className="space-y-3 text-xs divide-y divide-slate-100">
                <div className="flex items-center justify-between pt-2"><span className="text-slate-500">First recorded event</span><span className="font-mono text-slate-700">—</span></div>
                <div className="flex items-center justify-between pt-2"><span className="text-slate-500">Last recorded event</span><span className="font-mono text-slate-700">—</span></div>
                <div className="flex items-center justify-between pt-2"><span className="text-slate-500">Total scan attempts</span><span className="font-mono text-slate-700">—</span></div>
                <div className="flex items-center justify-between pt-2"><span className="text-slate-500">Completed requests</span><span className="font-mono text-slate-700">—</span></div>
                <div className="flex items-center justify-between pt-2"><span className="text-slate-500">Outstanding reviews</span><span className="font-mono text-slate-700">—</span></div>
                <div className="flex items-center justify-between pt-2"><span className="text-slate-500">Interruptions</span><span className="font-mono text-slate-700">—</span></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function SecurityGuardsPage() {
  return (
    <React.Suspense fallback={<div className="p-8 text-xs text-slate-500">Loading security guards...</div>}>
      <SecurityGuardsContent />
    </React.Suspense>
  );
}
