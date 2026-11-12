'use client';

import React, { useState } from 'react';
import {
  BarChart3,
  Calendar,
  Filter,
  Download,
  FileSpreadsheet,
  CheckCircle2,
  Clock,
  Shield,
  DoorClosed,
  Car,
  Image as ImageIcon,
  FileText
} from 'lucide-react';

export default function ReportsAndAnalyticsPage() {
  const [activeTab, setActiveTab] = useState<'builder' | 'guard' | 'gate' | 'export'>('builder');

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Page Title & Controls */}
      <div>
        <div className="flex items-center gap-2.5">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Reports & analytics
          </h1>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#FFF4E5] text-[#B45309]">
            Backend-dependent
          </span>
        </div>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Generate operational reports. Raw scan counts are never used as a stand-in for verified people.
        </p>
      </div>

      {/* Tabs */}
      <div className="inline-flex items-center p-1 bg-white border border-slate-200 rounded-full shadow-xs text-xs font-medium text-slate-600">
        <button
          onClick={() => setActiveTab('builder')}
          className={`px-4 py-1.5 rounded-full transition-colors ${
            activeTab === 'builder'
              ? 'bg-[#2F5BFF] text-white shadow-xs font-semibold'
              : 'hover:text-slate-900 text-slate-600'
          }`}
        >
          Report builder
        </button>
        <button
          onClick={() => setActiveTab('guard')}
          className={`px-4 py-1.5 rounded-full transition-colors ${
            activeTab === 'guard'
              ? 'bg-[#2F5BFF] text-white shadow-xs font-semibold'
              : 'hover:text-slate-900 text-slate-600'
          }`}
        >
          Guard performance
        </button>
        <button
          onClick={() => setActiveTab('gate')}
          className={`px-4 py-1.5 rounded-full transition-colors ${
            activeTab === 'gate'
              ? 'bg-[#2F5BFF] text-white shadow-xs font-semibold'
              : 'hover:text-slate-900 text-slate-600'
          }`}
        >
          Gate analytics
        </button>
        <button
          onClick={() => setActiveTab('export')}
          className={`px-4 py-1.5 rounded-full transition-colors ${
            activeTab === 'export'
              ? 'bg-[#2F5BFF] text-white shadow-xs font-semibold'
              : 'hover:text-slate-900 text-slate-600'
          }`}
        >
          Export centre
        </button>
      </div>

      {/* Generate a Report Card (Page 24) */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
        <h2 className="text-base font-bold text-slate-900">Generate a report</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-xs">
          <div>
            <label className="block font-medium text-slate-700 mb-2">Report category</label>
            <select className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-600 focus:outline-hidden focus:border-[#2F5BFF]">
              <option>Select...</option>
              <option>Institutional overview</option>
              <option>Guard performance</option>
              <option>Verification outcomes</option>
            </select>
          </div>

          <div>
            <label className="block font-medium text-slate-700 mb-2">Date range</label>
            <select className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-600 focus:outline-hidden focus:border-[#2F5BFF]">
              <option>Select...</option>
              <option>Today</option>
              <option>Last 7 days</option>
              <option>Last 30 days</option>
            </select>
          </div>

          <div>
            <label className="block font-medium text-slate-700 mb-2">Gate</label>
            <select className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-600 focus:outline-hidden focus:border-[#2F5BFF]">
              <option>Select...</option>
              <option>All gates</option>
            </select>
          </div>

          <div>
            <label className="block font-medium text-slate-700 mb-2">Guard</label>
            <select className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-600 focus:outline-hidden focus:border-[#2F5BFF]">
              <option>Select...</option>
              <option>All guards</option>
            </select>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="px-5 py-2.5 rounded-full text-xs font-semibold bg-[#2F5BFF] text-white hover:bg-[#254EDB] transition-colors shadow-xs"
            >
              Generate report
            </button>
            <button
              type="button"
              className="px-4 py-2.5 rounded-full text-xs font-medium bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors shadow-xs"
            >
              Validate and check duplicates
            </button>
          </div>
          <p className="text-[11px] text-slate-500">
            Records are never auto-approved. Vehicle photos are never sent to the face model.
          </p>
        </div>
      </div>

      {/* 10 Category Overview Cards (Page 24) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Card 1 */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-2">
          <h3 className="text-xs font-bold text-slate-900">Institutional overview</h3>
          <p className="text-[11px] text-slate-500">Totals across gates and categories.</p>
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-[#FFF4E5] text-[#B45309]">
            Backend-dependent
          </span>
        </div>

        {/* Card 2 */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-2">
          <h3 className="text-xs font-bold text-slate-900">Guard performance</h3>
          <p className="text-[11px] text-slate-500">Compare activity by date and gate.</p>
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-[#FFF4E5] text-[#B45309]">
            Backend-dependent
          </span>
        </div>

        {/* Card 3 */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-2">
          <h3 className="text-xs font-bold text-slate-900">Guard session analysis</h3>
          <p className="text-[11px] text-slate-500">Per-session metrics, normalised for length.</p>
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-[#FFF4E5] text-[#B45309]">
            Backend-dependent
          </span>
        </div>

        {/* Card 4 */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-2">
          <h3 className="text-xs font-bold text-slate-900">Verification outcomes</h3>
          <p className="text-[11px] text-slate-500">Permitted, denied, referred, pending, failed.</p>
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-[#FFF4E5] text-[#B45309]">
            Backend-dependent
          </span>
        </div>

        {/* Card 5 */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-2">
          <h3 className="text-xs font-bold text-slate-900">Gate-level performance</h3>
          <p className="text-[11px] text-slate-500">Scans, outcomes and peak periods per gate.</p>
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-[#FFF4E5] text-[#B45309]">
            Backend-dependent
          </span>
        </div>

        {/* Card 6 */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-2">
          <h3 className="text-xs font-bold text-slate-900">Visitor activity</h3>
          <p className="text-[11px] text-slate-500">Visits, check-ins and check-outs.</p>
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-[#FFF4E5] text-[#B45309]">
            Backend-dependent
          </span>
        </div>

        {/* Card 7 */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-2">
          <h3 className="text-xs font-bold text-slate-900">Campus vehicle movement</h3>
          <p className="text-[11px] text-slate-500">Only where movement is recorded.</p>
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-600">
            Future capability
          </span>
        </div>

        {/* Card 8 */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-2">
          <h3 className="text-xs font-bold text-slate-900">Registration overview</h3>
          <p className="text-[11px] text-slate-500">Records by category and status.</p>
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-[#FFF4E5] text-[#B45309]">
            Backend-dependent
          </span>
        </div>

        {/* Card 9 */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-2">
          <h3 className="text-xs font-bold text-slate-900">Photograph enrollment</h3>
          <p className="text-[11px] text-slate-500">Approval and enrollment status.</p>
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-[#FFF4E5] text-[#B45309]">
            Backend-dependent
          </span>
        </div>

        {/* Card 10 */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-2">
          <h3 className="text-xs font-bold text-slate-900">Audit history</h3>
          <p className="text-[11px] text-slate-500">Administrative events.</p>
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-[#FFF4E5] text-[#B45309]">
            Backend-dependent
          </span>
        </div>
      </div>
    </div>
  );
}
