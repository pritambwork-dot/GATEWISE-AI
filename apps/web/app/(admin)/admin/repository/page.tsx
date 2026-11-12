'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Image as ImageIcon,
  Search,
  Upload,
  Hexagon,
  CheckCircle2,
  AlertOctagon,
  Clock,
  Eye,
  ShieldCheck,
  Cpu,
  UserCheck
} from 'lucide-react';

export default function PhotographLibraryPage() {
  const [viewMode, setViewMode] = useState<'library' | 'detail'>('library');
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Page Title & Controls */}
      {viewMode === 'detail' ? (
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                Photograph details
              </h1>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#EBF0FF] text-[#2F5BFF]">
                Confirmed core capability
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              One photograph, its linked person and its approval and enrollment status.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setViewMode('library')}
              className="px-3.5 py-1.5 rounded-full text-xs font-medium bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors shadow-xs"
            >
              Back to library
            </button>
            <button className="px-3.5 py-1.5 rounded-full text-xs font-medium bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors shadow-xs">
              View enrollment status
            </button>
            <button className="px-3.5 py-1.5 rounded-full text-xs font-medium bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors shadow-xs">
              Review mapping
            </button>
            <button className="px-3.5 py-1.5 rounded-full text-xs font-medium bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors shadow-xs">
              Mark primary
            </button>
            <button className="px-3.5 py-1.5 rounded-full text-xs font-medium bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors shadow-xs">
              Add additional
            </button>
            <button className="px-3.5 py-1.5 rounded-full text-xs font-medium bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors shadow-xs">
              Replace
            </button>
            <button className="px-4 py-1.5 rounded-full text-xs font-medium bg-[#C93338] text-white hover:bg-[#B3262B] transition-colors shadow-xs">
              Reject
            </button>
            <button className="px-4 py-1.5 rounded-full text-xs font-medium bg-[#2F5BFF] text-white hover:bg-[#254EDB] transition-colors shadow-xs">
              Approve
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                Photograph & Identity Library
              </h1>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#EBF0FF] text-[#2F5BFF]">
                Confirmed core capability
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Manage institutional photographs with role-based access.
            </p>
          </div>

          <button className="px-4 py-2 rounded-full text-xs font-medium bg-[#2F5BFF] text-white hover:bg-[#254EDB] transition-colors shadow-xs">
            Upload photograph
          </button>
        </div>
      )}

      {/* Dark Biometric Warning Banner (Pages 16 & 17) */}
      <div className="bg-[#0B0F19] text-white rounded-2xl p-4 text-xs flex items-center gap-3 shadow-md">
        <Hexagon className="w-4 h-4 text-white shrink-0" />
        <p className="leading-relaxed text-slate-200">
          Biometric images are role-gated, never public, and every view is written to the audit log. Face embeddings are never displayed. Images are never sent to a general-purpose AI.
        </p>
      </div>

      {/* VIEW: Photograph Details (Page 17) */}
      {viewMode === 'detail' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: Photograph */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Photograph</h3>
            <div className="space-y-3 text-xs divide-y divide-slate-100">
              <div className="flex items-center justify-between pt-2">
                <span className="text-slate-500">Secure preview</span>
                <span className="font-mono text-slate-700">—</span>
              </div>
              <div className="flex items-center justify-between pt-2">
                <span className="text-slate-500">Photograph record ID</span>
                <span className="font-mono text-slate-700">—</span>
              </div>
              <div className="flex items-center justify-between pt-2">
                <span className="text-slate-500">Original filename</span>
                <span className="font-mono text-slate-700">—</span>
              </div>
              <div className="flex items-center justify-between pt-2">
                <span className="text-slate-500">Upload date</span>
                <span className="font-mono text-slate-700">—</span>
              </div>
              <div className="flex items-center justify-between pt-2">
                <span className="text-slate-500">Uploaded by</span>
                <span className="font-mono text-slate-700">—</span>
              </div>
            </div>
          </div>

          {/* Right Column: Linked person & Status */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900">Linked person</h3>
              <div className="space-y-3 text-xs divide-y divide-slate-100">
                <div className="flex items-center justify-between pt-2">
                  <span className="text-slate-500">Linked person ID</span>
                  <span className="font-mono text-slate-700">—</span>
                </div>
                <div className="flex items-center justify-between pt-2">
                  <span className="text-slate-500">Full name</span>
                  <span className="font-mono text-slate-700">—</span>
                </div>
                <div className="flex items-center justify-between pt-2">
                  <span className="text-slate-500">Category</span>
                  <span className="font-mono text-slate-700">—</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900">Status</h3>
              <div className="space-y-3 text-xs divide-y divide-slate-100">
                <div className="flex items-center justify-between pt-2">
                  <span className="text-slate-500">Approval status</span>
                  <span className="font-mono text-slate-700">—</span>
                </div>
                <div className="flex items-center justify-between pt-2">
                  <span className="text-slate-500">Model enrollment status</span>
                  <span className="font-mono text-slate-700">—</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW: Photograph Library Grid & Table (Page 16) */}
      {viewMode === 'library' && (
        <div className="space-y-6">
          {/* 7 Stat Cards Grid (Page 16) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-slate-400" />
                <span className="text-xs font-medium text-slate-700">Total photographs</span>
              </div>
              <div className="my-3 text-2xl font-bold text-slate-900">—</div>
              <div><span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-[#FFF4E5] text-[#B45309]">Awaiting backend</span></div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#1FB36B]" />
                <span className="text-xs font-medium text-slate-700">Approved</span>
              </div>
              <div className="my-3 text-2xl font-bold text-slate-900">—</div>
              <div><span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-[#FFF4E5] text-[#B45309]">Awaiting backend</span></div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                <span className="text-xs font-medium text-slate-700">Pending</span>
              </div>
              <div className="my-3 text-2xl font-bold text-slate-900">—</div>
              <div><span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-[#FFF4E5] text-[#B45309]">Awaiting backend</span></div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#C93338]" />
                <span className="text-xs font-medium text-slate-700">Rejected</span>
              </div>
              <div className="my-3 text-2xl font-bold text-slate-900">—</div>
              <div><span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-[#FFF4E5] text-[#B45309]">Awaiting backend</span></div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-slate-400" />
                <span className="text-xs font-medium text-slate-700">Unassigned</span>
              </div>
              <div className="my-3 text-2xl font-bold text-slate-900">—</div>
              <div><span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-[#FFF4E5] text-[#B45309]">Awaiting backend</span></div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#12B5A6]" />
                <span className="text-xs font-medium text-slate-700">Enrollment-ready</span>
              </div>
              <div className="my-3 text-2xl font-bold text-slate-900">—</div>
              <div><span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-[#FFF4E5] text-[#B45309]">Awaiting backend</span></div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#C93338]" />
                <span className="text-xs font-medium text-slate-700">Failed enrollment</span>
              </div>
              <div className="my-3 text-2xl font-bold text-slate-900">—</div>
              <div><span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-[#FFF4E5] text-[#B45309]">Awaiting backend</span></div>
            </div>
          </div>

          {/* Filters Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search by name or person ID"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-[#2F5BFF]"
              />
            </div>
            <select className="px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-700 focus:outline-hidden focus:border-[#2F5BFF]">
              <option value="">Category</option>
              <option value="Student">Student</option>
              <option value="Faculty">Faculty</option>
            </select>
            <select className="px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-700 focus:outline-hidden focus:border-[#2F5BFF]">
              <option value="">Approval</option>
              <option value="Approved">Approved</option>
              <option value="Pending">Pending</option>
            </select>
            <select className="px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-700 focus:outline-hidden focus:border-[#2F5BFF]">
              <option value="">Enrollment</option>
              <option value="Ready">Ready</option>
              <option value="Enrolled">Enrolled</option>
            </select>
            <select className="px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-700 focus:outline-hidden focus:border-[#2F5BFF]">
              <option value="">Department</option>
              <option value="Computer Science">Computer Science</option>
            </select>
          </div>

          {/* Table Container */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/60 border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                    <th className="px-5 py-3">PHOTOGRAPH</th>
                    <th className="px-5 py-3">FULL NAME</th>
                    <th className="px-5 py-3">PERSON ID</th>
                    <th className="px-5 py-3">CATEGORY</th>
                    <th className="px-5 py-3">DEPARTMENT</th>
                    <th className="px-5 py-3">APPROVAL</th>
                    <th className="px-5 py-3">ENROLLMENT</th>
                    <th className="px-5 py-3">PRIMARY</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td colSpan={8} className="py-20 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <div className="w-12 h-12 rounded-2xl bg-[#EBF0FF] text-[#2F5BFF] flex items-center justify-center mb-3">
                          <ImageIcon className="w-6 h-6" />
                        </div>
                        <h3 className="text-base font-bold text-slate-900 mb-1">No photographs yet</h3>
                        <p className="text-xs text-slate-500 max-w-sm mb-4">
                          Only photographs supplied through the approved registry appear, in grid or list view. Nothing is shown publicly.
                        </p>
                        <button
                          onClick={() => setViewMode('detail')}
                          className="px-4 py-2 rounded-full text-xs font-medium bg-[#2F5BFF] text-white hover:bg-[#254EDB] transition-colors shadow-xs"
                        >
                          Preview photograph detail layout
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
