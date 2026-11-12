'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  Upload,
  FileSpreadsheet,
  CheckCircle2,
  AlertOctagon,
  Clock,
  Cpu,
  UserCheck,
  ChevronRight,
  Hexagon,
  Search,
  Download,
  Paperclip
} from 'lucide-react';

function EnrollmentContent() {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') || 'new';
  const [activeTab, setActiveTab] = useState<'new' | 'bulk' | 'approvals' | 'model'>(
    initialTab === 'bulk' || initialTab === 'approvals' || initialTab === 'model' ? initialTab : 'new'
  );
  const [regCategory, setRegCategory] = useState<'Student' | 'Faculty' | 'Worker' | 'Visiting person' | 'Campus vehicle'>('Student');

  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam === 'bulk' || tabParam === 'approvals' || tabParam === 'model') {
      setActiveTab(tabParam);
    } else {
      setActiveTab('new');
    }
  }, [searchParams]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Tab Switcher */}
      <div className="inline-flex items-center p-1 bg-white border border-slate-200 rounded-full shadow-xs text-xs font-medium text-slate-600">
        <button
          onClick={() => setActiveTab('new')}
          className={`px-4 py-1.5 rounded-full transition-colors ${
            activeTab === 'new'
              ? 'bg-[#2F5BFF] text-white shadow-xs font-semibold'
              : 'hover:text-slate-900 text-slate-600'
          }`}
        >
          New registration
        </button>
        <button
          onClick={() => setActiveTab('bulk')}
          className={`px-4 py-1.5 rounded-full transition-colors ${
            activeTab === 'bulk'
              ? 'bg-[#2F5BFF] text-white shadow-xs font-semibold'
              : 'hover:text-slate-900 text-slate-600'
          }`}
        >
          Bulk XLSX Import
        </button>
        <button
          onClick={() => setActiveTab('approvals')}
          className={`px-4 py-1.5 rounded-full transition-colors ${
            activeTab === 'approvals'
              ? 'bg-[#2F5BFF] text-white shadow-xs font-semibold'
              : 'hover:text-slate-900 text-slate-600'
          }`}
        >
          Registration Approval
        </button>
        <button
          onClick={() => setActiveTab('model')}
          className={`px-4 py-1.5 rounded-full transition-colors ${
            activeTab === 'model'
              ? 'bg-[#2F5BFF] text-white shadow-xs font-semibold'
              : 'hover:text-slate-900 text-slate-600'
          }`}
        >
          Model Enrollment
        </button>
      </div>

      {/* VIEW 1: New Registration (Page 15) */}
      {activeTab === 'new' && (
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                  New registration
                </h1>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#EBF0FF] text-[#2F5BFF]">
                  Confirmed core capability
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Choose a category and complete only the fields it needs. New records are never approved automatically.
              </p>
            </div>

            <button
              onClick={() => setActiveTab('bulk')}
              className="px-4 py-2 rounded-full text-xs font-medium bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors shadow-xs"
            >
              Bulk import
            </button>
          </div>

          {/* Category Tabs */}
          <div className="inline-flex items-center p-1 bg-white border border-slate-200 rounded-full shadow-xs text-xs font-medium text-slate-600">
            {(['Student', 'Faculty', 'Worker', 'Visiting person', 'Campus vehicle'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setRegCategory(cat)}
                className={`px-4 py-1.5 rounded-full transition-colors ${
                  regCategory === cat
                    ? 'bg-[#2F5BFF] text-white shadow-xs font-semibold'
                    : 'hover:text-slate-900 text-slate-600'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* 9-Step Stepper (Page 15) */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs overflow-x-auto">
            <div className="flex items-center gap-2 text-xs text-slate-500 min-w-max">
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#2F5BFF] text-white text-[11px] font-bold">1</span>
              <span className="font-semibold text-slate-900">Enter details</span>
              <span className="text-slate-300">›</span>
              <span>2 Attach photograph</span>
              <span className="text-slate-300">›</span>
              <span>3 Preview</span>
              <span className="text-slate-300">›</span>
              <span>4 Validate</span>
              <span className="text-slate-300">›</span>
              <span>5 Check duplicates</span>
              <span className="text-slate-300">›</span>
              <span>6 Submit</span>
              <span className="text-slate-300">›</span>
              <span>7 Await approval</span>
              <span className="text-slate-300">›</span>
              <span>8 Add to registry</span>
              <span className="text-slate-300">›</span>
              <span>9 Prepare for enrollment</span>
            </div>
          </div>

          {/* Student Registration Form (Page 15) */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
            <h2 className="text-base font-bold text-slate-900">{regCategory} registration</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-2">{regCategory} ID</label>
                <input
                  type="text"
                  placeholder={`[${regCategory.toLowerCase()} id]`}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-hidden focus:border-[#2F5BFF]"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-2">Full name</label>
                <input
                  type="text"
                  placeholder="[full name]"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-hidden focus:border-[#2F5BFF]"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-2">Roll number</label>
                <input
                  type="text"
                  placeholder="[roll number]"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-hidden focus:border-[#2F5BFF]"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-2">Department</label>
                <select className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-600 focus:outline-hidden focus:border-[#2F5BFF]">
                  <option>Select...</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-2">Programme</label>
                <select className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-600 focus:outline-hidden focus:border-[#2F5BFF]">
                  <option>Select...</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-2">Academic year</label>
                <select className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-600 focus:outline-hidden focus:border-[#2F5BFF]">
                  <option>Select...</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-2">Semester</label>
                <select className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-600 focus:outline-hidden focus:border-[#2F5BFF]">
                  <option>Select...</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-2">Institution</label>
                <select className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-600 focus:outline-hidden focus:border-[#2F5BFF]">
                  <option>Select...</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-2">Email</label>
                <input
                  type="email"
                  placeholder="[email]"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-hidden focus:border-[#2F5BFF]"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-2">Photograph</label>
                <button
                  type="button"
                  className="w-full py-2.5 px-3.5 rounded-xl border border-dashed border-[#2F5BFF] text-[#2F5BFF] bg-[#EBF0FF]/40 text-center hover:bg-[#EBF0FF] transition-colors font-medium"
                >
                  Attach file · stored privately
                </button>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-2">Validity</label>
                <select className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-600 focus:outline-hidden focus:border-[#2F5BFF]">
                  <option>Select...</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-2">Access group</label>
                <select className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-600 focus:outline-hidden focus:border-[#2F5BFF]">
                  <option>Select...</option>
                </select>
              </div>
            </div>

            {/* Actions & Note */}
            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  className="px-5 py-2.5 rounded-full text-xs font-semibold bg-[#2F5BFF] text-white hover:bg-[#254EDB] transition-colors shadow-xs"
                >
                  Submit for approval
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
        </div>
      )}

      {/* VIEW 2: Bulk XLSX Import (Page 18) */}
      {activeTab === 'bulk' && (
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                  Bulk registration and XLSX import
                </h1>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#FFF4E5] text-[#B45309]">
                  Backend-dependent
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Import records from an institution-approved XLSX or CSV template.
              </p>
            </div>

            <button
              onClick={() => setActiveTab('approvals')}
              className="px-4 py-2 rounded-full text-xs font-medium bg-[#2F5BFF] text-white hover:bg-[#254EDB] transition-colors shadow-xs"
            >
              Continue to approval
            </button>
          </div>

          {/* Amber Banner (Page 18) */}
          <div className="bg-[#FFF9EE] border border-[#FDE68A] text-[#92400E] rounded-2xl p-4 text-xs flex items-center gap-3 shadow-2xs">
            <Hexagon className="w-4 h-4 text-[#D97706] shrink-0" />
            <p className="leading-relaxed">
              An imported workbook never enrols unapproved photographs. Unmatched photographs are never assigned to anyone automatically. Invalid rows are always listed.
            </p>
          </div>

          {/* 11-Step Stepper (Page 18) */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs overflow-x-auto">
            <div className="flex items-center gap-2 text-xs text-slate-500 min-w-max">
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#2F5BFF] text-white text-[11px] font-bold">1</span>
              <span className="font-semibold text-slate-900">Download template</span>
              <span className="text-slate-300">›</span>
              <span>2 Upload workbook</span>
              <span className="text-slate-300">›</span>
              <span>3 Select category</span>
              <span className="text-slate-300">›</span>
              <span>4 Extract records</span>
              <span className="text-slate-300">›</span>
              <span>5 Associate images</span>
              <span className="text-slate-300">›</span>
              <span>6 Validate</span>
              <span className="text-slate-300">›</span>
              <span>7 Check duplicates</span>
              <span className="text-slate-300">›</span>
              <span>8 Review mapping</span>
              <span className="text-slate-300">›</span>
              <span>9 Preview batch</span>
              <span className="text-slate-300">›</span>
              <span>10 Submit for approval</span>
              <span className="text-slate-300">›</span>
              <span>11 Import report</span>
            </div>
          </div>

          {/* 7 Stat Cards Grid (Page 18) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-slate-400" />
                <span className="text-xs font-medium text-slate-700">Total rows</span>
              </div>
              <div className="my-3 text-2xl font-bold text-slate-900">—</div>
              <div><span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-[#FFF4E5] text-[#B45309]">Awaiting backend</span></div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#1FB36B]" />
                <span className="text-xs font-medium text-slate-700">Valid rows</span>
              </div>
              <div className="my-3 text-2xl font-bold text-slate-900">—</div>
              <div><span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-[#FFF4E5] text-[#B45309]">Awaiting backend</span></div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#C93338]" />
                <span className="text-xs font-medium text-slate-700">Invalid rows</span>
              </div>
              <div className="my-3 text-2xl font-bold text-slate-900">—</div>
              <div><span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-[#FFF4E5] text-[#B45309]">Awaiting backend</span></div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                <span className="text-xs font-medium text-slate-700">Duplicate rows</span>
              </div>
              <div className="my-3 text-2xl font-bold text-slate-900">—</div>
              <div><span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-[#FFF4E5] text-[#B45309]">Awaiting backend</span></div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                <span className="text-xs font-medium text-slate-700">Missing photographs</span>
              </div>
              <div className="my-3 text-2xl font-bold text-slate-900">—</div>
              <div><span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-[#FFF4E5] text-[#B45309]">Awaiting backend</span></div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                <span className="text-xs font-medium text-slate-700">Unmapped photographs</span>
              </div>
              <div className="my-3 text-2xl font-bold text-slate-900">—</div>
              <div><span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-[#FFF4E5] text-[#B45309]">Awaiting backend</span></div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#2F5BFF]" />
                <span className="text-xs font-medium text-slate-700">Pending decisions</span>
              </div>
              <div className="my-3 text-2xl font-bold text-slate-900">—</div>
              <div><span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-[#FFF4E5] text-[#B45309]">Awaiting backend</span></div>
            </div>
          </div>

          {/* Search Errors Row */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search errors by row"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-[#2F5BFF]"
              />
            </div>
            <select className="px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-700 focus:outline-hidden focus:border-[#2F5BFF]">
              <option value="">Problem type</option>
              <option value="Format">Format error</option>
              <option value="Duplicate">Duplicate key</option>
            </select>
          </div>

          {/* Table Container */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/60 border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                    <th className="px-5 py-3">ROW</th>
                    <th className="px-5 py-3">FIELD</th>
                    <th className="px-5 py-3">PROBLEM</th>
                    <th className="px-5 py-3">SUGGESTED FIX</th>
                    <th className="px-5 py-3">STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td colSpan={5} className="py-20 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <div className="w-12 h-12 rounded-2xl bg-[#EBF0FF] text-[#2F5BFF] flex items-center justify-center mb-3">
                          <FileSpreadsheet className="w-6 h-6" />
                        </div>
                        <h3 className="text-base font-bold text-slate-900 mb-1">No import batch</h3>
                        <p className="text-xs text-slate-500 max-w-sm">
                          Row-specific errors list here after a workbook is validated.
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

          {/* Upload Workbook Card (Page 18 Bottom) */}
          <div className="bg-white rounded-2xl p-8 border border-dashed border-slate-300 text-center space-y-4">
            <h3 className="text-base font-bold text-slate-900">
              Upload an institution-approved XLSX or CSV workbook
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
              Rows are validated, checked for duplicates and mapped to photographs. Invalid rows are listed with their row number and reason. Nothing is skipped silently and nothing enrols automatically.
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button className="px-5 py-2.5 rounded-full text-xs font-semibold bg-[#2F5BFF] text-white hover:bg-[#254EDB] transition-colors shadow-xs">
                Choose workbook
              </button>
              <button className="px-4 py-2.5 rounded-full text-xs font-medium bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors shadow-xs">
                Download blank template
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 3: Registration Approval (Page 19) */}
      {activeTab === 'approvals' && (
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                  Registration approval
                </h1>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#EBF0FF] text-[#2F5BFF]">
                  Confirmed core capability
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Approve or reject submitted records before they join the master registry.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button className="px-4 py-2 rounded-full text-xs font-medium bg-[#C93338] text-white hover:bg-[#B3262B] transition-colors shadow-xs">
                Reject selected
              </button>
              <button className="px-4 py-2 rounded-full text-xs font-medium bg-[#2F5BFF] text-white hover:bg-[#254EDB] transition-colors shadow-xs">
                Approve selected
              </button>
            </div>
          </div>

          {/* Filters Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search submissions"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-[#2F5BFF]"
              />
            </div>
            <select className="px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-700 focus:outline-hidden focus:border-[#2F5BFF]">
              <option value="">Category</option>
              <option value="Student">Student</option>
              <option value="Faculty">Faculty</option>
            </select>
            <select className="px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-700 focus:outline-hidden focus:border-[#2F5BFF]">
              <option value="">Status</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
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
                    <th className="px-5 py-3">RECORD ID</th>
                    <th className="px-5 py-3">NAME</th>
                    <th className="px-5 py-3">CATEGORY</th>
                    <th className="px-5 py-3">SUBMITTED BY</th>
                    <th className="px-5 py-3">SUBMITTED</th>
                    <th className="px-5 py-3">DUPLICATE CHECK</th>
                    <th className="px-5 py-3">PHOTOGRAPH</th>
                    <th className="px-5 py-3">STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td colSpan={8} className="py-20 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <div className="w-12 h-12 rounded-2xl bg-[#EBF0FF] text-[#2F5BFF] flex items-center justify-center mb-3">
                          <CheckCircle2 className="w-6 h-6" />
                        </div>
                        <h3 className="text-base font-bold text-slate-900 mb-1">No pending approvals</h3>
                        <p className="text-xs text-slate-500 max-w-sm mb-4">
                          Submitted records wait here for an administrator. Nothing is approved automatically.
                        </p>
                        <button
                          onClick={() => setActiveTab('new')}
                          className="px-4 py-2 rounded-full text-xs font-medium bg-[#2F5BFF] text-white hover:bg-[#254EDB] transition-colors shadow-xs"
                        >
                          Start a registration
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

      {/* VIEW 4: Model Enrollment (Page 20) */}
      {activeTab === 'model' && (
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                  Model enrollment
                </h1>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#FFF4E5] text-[#B45309]">
                  Backend-dependent
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Approved identities submitted to the institution's own GATEWISE AI model.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button className="px-3.5 py-1.5 rounded-full text-xs font-medium bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors shadow-xs">
                View model status
              </button>
              <button className="px-3.5 py-1.5 rounded-full text-xs font-medium bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors shadow-xs">
                Retry failed enrollment
              </button>
              <button className="px-4 py-1.5 rounded-full text-xs font-medium bg-[#2F5BFF] text-white hover:bg-[#254EDB] transition-colors shadow-xs">
                Submit approved enrollment
              </button>
            </div>
          </div>

          {/* Blue Banner (Page 20) */}
          <div className="bg-[#EBF0FF] border border-[#D0DEFF] text-[#1E3A8A] rounded-2xl p-4 text-xs flex items-center gap-3 shadow-2xs">
            <Hexagon className="w-4 h-4 text-[#2F5BFF] shrink-0" />
            <p className="leading-relaxed">
              The institution's backend and existing model are authoritative. No model response is simulated here.
            </p>
          </div>

          {/* 6 Stat Cards Grid (Page 20) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#2F5BFF]" />
                <span className="text-xs font-medium text-slate-700">Eligible records</span>
              </div>
              <div className="my-3 text-2xl font-bold text-slate-900">—</div>
              <div><span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-[#FFF4E5] text-[#B45309]">Awaiting backend</span></div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                <span className="text-xs font-medium text-slate-700">Pending submissions</span>
              </div>
              <div className="my-3 text-2xl font-bold text-slate-900">—</div>
              <div><span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-[#FFF4E5] text-[#B45309]">Awaiting backend</span></div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-teal-500" />
                <span className="text-xs font-medium text-slate-700">Processing</span>
              </div>
              <div className="my-3 text-2xl font-bold text-slate-900">—</div>
              <div><span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-[#FFF4E5] text-[#B45309]">Awaiting backend</span></div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#1FB36B]" />
                <span className="text-xs font-medium text-slate-700">Successfully enrolled</span>
              </div>
              <div className="my-3 text-2xl font-bold text-slate-900">—</div>
              <div><span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-[#FFF4E5] text-[#B45309]">Awaiting backend</span></div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#C93338]" />
                <span className="text-xs font-medium text-slate-700">Failed</span>
              </div>
              <div className="my-3 text-2xl font-bold text-slate-900">—</div>
              <div><span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-[#FFF4E5] text-[#B45309]">Awaiting backend</span></div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                <span className="text-xs font-medium text-slate-700">Needs review</span>
              </div>
              <div className="my-3 text-2xl font-bold text-slate-900">—</div>
              <div><span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-[#FFF4E5] text-[#B45309]">Awaiting backend</span></div>
            </div>
          </div>

          {/* Search Row */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search enrollment requests"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-[#2F5BFF]"
              />
            </div>
            <select className="px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-700 focus:outline-hidden focus:border-[#2F5BFF]">
              <option value="">Status</option>
              <option value="Ready">Ready</option>
              <option value="Failed">Failed</option>
            </select>
            <select className="px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-700 focus:outline-hidden focus:border-[#2F5BFF]">
              <option value="">Registration type</option>
              <option value="Single">Single</option>
              <option value="Batch">Batch</option>
            </select>
          </div>

          {/* Table Container */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/60 border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                    <th className="px-5 py-3">REQUEST ID</th>
                    <th className="px-5 py-3">PERSON ID</th>
                    <th className="px-5 py-3">NAME</th>
                    <th className="px-5 py-3">REGISTRATION TYPE</th>
                    <th className="px-5 py-3">APPROVED PHOTO REF</th>
                    <th className="px-5 py-3">APPROVAL</th>
                    <th className="px-5 py-3">SUBMITTED</th>
                    <th className="px-5 py-3">MODEL RESPONSE</th>
                    <th className="px-5 py-3">ENROLLMENT</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td colSpan={9} className="py-20 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <div className="w-12 h-12 rounded-2xl bg-[#EBF0FF] text-[#2F5BFF] flex items-center justify-center mb-3">
                          <Cpu className="w-6 h-6" />
                        </div>
                        <h3 className="text-base font-bold text-slate-900 mb-1">Enrollment queue is empty</h3>
                        <p className="text-xs text-slate-500 max-w-sm">
                          Approved photographs ready for the model appear here.
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

          {/* Enrollment Details List (Page 20 Bottom) */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Enrollment details</h3>
            <div className="space-y-3 text-xs divide-y divide-slate-100">
              <div className="flex items-center justify-between pt-2"><span className="text-slate-500">Person mapping</span><span className="font-mono text-slate-700">—</span></div>
              <div className="flex items-center justify-between pt-2"><span className="text-slate-500">Photograph mapping</span><span className="font-mono text-slate-700">—</span></div>
              <div className="flex items-center justify-between pt-2"><span className="text-slate-500">Approval history</span><span className="font-mono text-slate-700">—</span></div>
              <div className="flex items-center justify-between pt-2"><span className="text-slate-500">Backend submission reference</span><span className="font-mono text-slate-700">—</span></div>
              <div className="flex items-center justify-between pt-2"><span className="text-slate-500">Actual model response</span><span className="font-mono text-slate-700">—</span></div>
              <div className="flex items-center justify-between pt-2"><span className="text-slate-500">Error details</span><span className="font-mono text-slate-700">—</span></div>
              <div className="flex items-center justify-between pt-2"><span className="text-slate-500">Retry eligibility</span><span className="font-mono text-slate-700">—</span></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function EnrollmentPage() {
  return (
    <React.Suspense fallback={<div className="p-8 text-xs text-slate-500">Loading registrations...</div>}>
      <EnrollmentContent />
    </React.Suspense>
  );
}
