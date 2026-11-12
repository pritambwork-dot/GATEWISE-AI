'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  UserCheck,
  Search,
  Plus,
  Clock,
  CheckCircle2,
  AlertOctagon,
  Calendar,
  Building,
  User,
  DoorClosed
} from 'lucide-react';

export default function VisitorManagementPage() {
  const [activeTab, setActiveTab] = useState<'register' | 'history' | 'record'>('register');
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      {activeTab === 'record' ? (
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                Visitor record
              </h1>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#EBF0FF] text-[#2F5BFF]">
                Confirmed core capability
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Identity, visit details and movement for one visitor.
            </p>
          </div>

          <button
            onClick={() => setActiveTab('register')}
            className="px-4 py-2 rounded-full text-xs font-medium bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors shadow-xs"
          >
            Back to visitors
          </button>
        </div>
      ) : (
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                Visitor management
              </h1>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#EBF0FF] text-[#2F5BFF]">
                Confirmed core capability
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Expected, current and past visitors, with a real movement history.
            </p>
          </div>

          <button className="px-4 py-2 rounded-full text-xs font-medium bg-[#2F5BFF] text-white hover:bg-[#254EDB] transition-colors shadow-xs">
            Register visitor
          </button>
        </div>
      )}

      {/* Subtabs for register vs history */}
      {activeTab !== 'record' && (
        <div className="inline-flex items-center p-1 bg-white border border-slate-200 rounded-full shadow-xs text-xs font-medium text-slate-600">
          <button
            onClick={() => setActiveTab('register')}
            className={`px-4 py-1.5 rounded-full transition-colors ${
              activeTab === 'register'
                ? 'bg-[#2F5BFF] text-white shadow-xs font-semibold'
                : 'hover:text-slate-900 text-slate-600'
            }`}
          >
            Visitor register
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-4 py-1.5 rounded-full transition-colors ${
              activeTab === 'history'
                ? 'bg-[#2F5BFF] text-white shadow-xs font-semibold'
                : 'hover:text-slate-900 text-slate-600'
            }`}
          >
            Movement history
          </button>
        </div>
      )}

      {/* VIEW: Visitor Record (Page 22) */}
      {activeTab === 'record' && (
        <div className="space-y-6">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search movement"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-[#2F5BFF]"
            />
          </div>

          {/* Table Container */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/60 border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                    <th className="px-5 py-3">TIME</th>
                    <th className="px-5 py-3">STATUS</th>
                    <th className="px-5 py-3">GATE</th>
                    <th className="px-5 py-3">RECORDED BY</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td colSpan={4} className="py-20 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <div className="w-12 h-12 rounded-2xl bg-[#EBF0FF] text-[#2F5BFF] flex items-center justify-center mb-3">
                          <UserCheck className="w-6 h-6" />
                        </div>
                        <h3 className="text-base font-bold text-slate-900 mb-1">No movement recorded</h3>
                        <p className="text-xs text-slate-500 max-w-sm">
                          The timeline shows Expected, Checked In, Checked Out, Cancelled and Expired, only if they happened.
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

          {/* 3 Detail Cards (Page 22 Bottom) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900">Visitor identity</h3>
              <div className="space-y-3 text-xs divide-y divide-slate-100">
                <div className="flex items-center justify-between pt-2"><span className="text-slate-500">Visitor ID</span><span className="font-mono text-slate-700">—</span></div>
                <div className="flex items-center justify-between pt-2"><span className="text-slate-500">Name</span><span className="font-mono text-slate-700">—</span></div>
                <div className="flex items-center justify-between pt-2"><span className="text-slate-500">Organisation</span><span className="font-mono text-slate-700">—</span></div>
                <div className="flex items-center justify-between pt-2"><span className="text-slate-500">Linked person reference</span><span className="font-mono text-slate-700">—</span></div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900">Visit information</h3>
              <div className="space-y-3 text-xs divide-y divide-slate-100">
                <div className="flex items-center justify-between pt-2"><span className="text-slate-500">Host</span><span className="font-mono text-slate-700">—</span></div>
                <div className="flex items-center justify-between pt-2"><span className="text-slate-500">Department</span><span className="font-mono text-slate-700">—</span></div>
                <div className="flex items-center justify-between pt-2"><span className="text-slate-500">Purpose</span><span className="font-mono text-slate-700">—</span></div>
                <div className="flex items-center justify-between pt-2"><span className="text-slate-500">Gate</span><span className="font-mono text-slate-700">—</span></div>
                <div className="flex items-center justify-between pt-2"><span className="text-slate-500">Expected arrival</span><span className="font-mono text-slate-700">—</span></div>
                <div className="flex items-center justify-between pt-2"><span className="text-slate-500">Expected departure</span><span className="font-mono text-slate-700">—</span></div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900">Approval and photograph</h3>
              <div className="space-y-3 text-xs divide-y divide-slate-100">
                <div className="flex items-center justify-between pt-2"><span className="text-slate-500">Approval state</span><span className="font-mono text-slate-700">—</span></div>
                <div className="flex items-center justify-between pt-2"><span className="text-slate-500">Photograph (if authorised)</span><span className="font-mono text-slate-700">—</span></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW: Visitor Register (Page 21) */}
      {activeTab !== 'record' && (
        <div className="space-y-6">
          {/* 5 Stat Cards Grid (Page 21) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#1FB36B]" />
                <span className="text-xs font-medium text-slate-700">Expected visitors</span>
              </div>
              <div className="my-3 text-2xl font-bold text-slate-900">—</div>
              <div><span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-[#FFF4E5] text-[#B45309]">Awaiting backend</span></div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#1FB36B]" />
                <span className="text-xs font-medium text-slate-700">Currently inside</span>
              </div>
              <div className="my-3 text-2xl font-bold text-slate-900">—</div>
              <div><span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-[#FFF4E5] text-[#B45309]">Awaiting backend</span></div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-slate-400" />
                <span className="text-xs font-medium text-slate-700">Checked out</span>
              </div>
              <div className="my-3 text-2xl font-bold text-slate-900">—</div>
              <div><span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-[#FFF4E5] text-[#B45309]">Awaiting backend</span></div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-slate-400" />
                <span className="text-xs font-medium text-slate-700">Expired visits</span>
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
          </div>

          {/* Filters Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search visitors"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-[#2F5BFF]"
              />
            </div>
            <select className="px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-700 focus:outline-hidden focus:border-[#2F5BFF]">
              <option value="">Status</option>
              <option value="Expected">Expected</option>
              <option value="Inside">Inside</option>
            </select>
            <select className="px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-700 focus:outline-hidden focus:border-[#2F5BFF]">
              <option value="">Host</option>
              <option value="Dean">Dean Office</option>
            </select>
            <select className="px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-700 focus:outline-hidden focus:border-[#2F5BFF]">
              <option value="">Date</option>
              <option value="Today">Today</option>
            </select>
          </div>

          {/* Table Container */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/60 border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                    <th className="px-5 py-3">VISITOR ID</th>
                    <th className="px-5 py-3">NAME</th>
                    <th className="px-5 py-3">HOST</th>
                    <th className="px-5 py-3">ORGANISATION</th>
                    <th className="px-5 py-3">PURPOSE</th>
                    <th className="px-5 py-3">EXPECTED ARRIVAL</th>
                    <th className="px-5 py-3">EXPECTED DEPARTURE</th>
                    <th className="px-5 py-3">CHECK-IN</th>
                    <th className="px-5 py-3">CHECK-OUT</th>
                    <th className="px-5 py-3">STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td colSpan={10} className="py-20 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <div className="w-12 h-12 rounded-2xl bg-[#EBF0FF] text-[#2F5BFF] flex items-center justify-center mb-3">
                          <UserCheck className="w-6 h-6" />
                        </div>
                        <h3 className="text-base font-bold text-slate-900 mb-1">No visitors</h3>
                        <p className="text-xs text-slate-500 max-w-sm mb-4">
                          Registered visitors will appear here.
                        </p>
                        <button
                          onClick={() => setActiveTab('record')}
                          className="px-4 py-2 rounded-full text-xs font-medium bg-[#2F5BFF] text-white hover:bg-[#254EDB] transition-colors shadow-xs"
                        >
                          Preview visitor record
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
      )}
    </div>
  );
}
