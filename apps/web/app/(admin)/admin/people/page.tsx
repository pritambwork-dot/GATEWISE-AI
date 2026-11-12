'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Users,
  Search,
  Plus,
  Upload,
  UserCheck,
  UserX,
  Clock,
  Camera,
  Cpu
} from 'lucide-react';

export default function IdentityRegistryPage() {
  const [activeCategory, setActiveCategory] = useState<'Students' | 'Faculty' | 'Workers' | 'Visiting Persons' | 'Campus Vehicles'>('Students');
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Page Title & Controls */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              Identity Registry
            </h1>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#EBF0FF] text-[#2F5BFF]">
              Confirmed core capability
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            The institutional record of students, faculty, workers, visiting persons and campus vehicles.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin/enrollment?tab=bulk"
            className="px-4 py-2 rounded-full text-xs font-medium bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors shadow-xs"
          >
            Bulk import
          </Link>
          <Link
            href="/admin/enrollment"
            className="px-4 py-2 rounded-full text-xs font-medium bg-[#2F5BFF] text-white hover:bg-[#254EDB] transition-colors shadow-xs"
          >
            New registration
          </Link>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="inline-flex items-center p-1 bg-white border border-slate-200 rounded-full shadow-xs text-xs font-medium text-slate-600">
        {(['Students', 'Faculty', 'Workers', 'Visiting Persons', 'Campus Vehicles'] as const).map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-1.5 rounded-full transition-colors ${
              activeCategory === cat
                ? 'bg-[#2F5BFF] text-white shadow-xs font-semibold'
                : 'hover:text-slate-900 text-slate-600'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* 7 Stat Cards Grid (Page 14) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#2F5BFF]" />
            <span className="text-xs font-medium text-slate-700">Total approved records</span>
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
            <span className="text-xs font-medium text-slate-700">Active</span>
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
            <span className="text-xs font-medium text-slate-700">Pending approvals</span>
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
            <span className="text-xs font-medium text-slate-700">Expired</span>
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
            <span className="text-xs font-medium text-slate-700">Suspended</span>
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
            <span className="text-xs font-medium text-slate-700">Photograph approval</span>
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
            <span className="w-2 h-2 rounded-full bg-teal-500" />
            <span className="text-xs font-medium text-slate-700">Model enrollment</span>
          </div>
          <div className="my-3 text-2xl font-bold text-slate-900">—</div>
          <div>
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-[#FFF4E5] text-[#B45309]">
              Awaiting backend
            </span>
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder={`Search ${activeCategory.toLowerCase()}`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-[#2F5BFF]"
          />
        </div>
        <select className="px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-700 focus:outline-hidden focus:border-[#2F5BFF]">
          <option value="">Department</option>
          <option value="Computer Science">Computer Science</option>
          <option value="Mechanical">Mechanical</option>
        </select>
        <select className="px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-700 focus:outline-hidden focus:border-[#2F5BFF]">
          <option value="">Status</option>
          <option value="Active">Active</option>
          <option value="Pending">Pending</option>
        </select>
        <select className="px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-700 focus:outline-hidden focus:border-[#2F5BFF]">
          <option value="">Validity</option>
          <option value="Current">Current session</option>
          <option value="Expired">Expired</option>
        </select>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/60 border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                <th className="px-5 py-3">RECORD ID</th>
                <th className="px-5 py-3">FULL NAME</th>
                <th className="px-5 py-3">CATEGORY</th>
                <th className="px-5 py-3">PHOTOGRAPH</th>
                <th className="px-5 py-3">OFFICIAL ID</th>
                <th className="px-5 py-3">DEPARTMENT</th>
                <th className="px-5 py-3">ACCESS GROUP</th>
                <th className="px-5 py-3">VALIDITY</th>
                <th className="px-5 py-3">APPROVAL</th>
                <th className="px-5 py-3">ENROLLMENT</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={10} className="py-20 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <div className="w-12 h-12 rounded-2xl bg-[#EBF0FF] text-[#2F5BFF] flex items-center justify-center mb-3">
                      <Users className="w-6 h-6" />
                    </div>
                    <h3 className="text-base font-bold text-slate-900 mb-1">
                      No registered {activeCategory.toLowerCase()}
                    </h3>
                    <p className="text-xs text-slate-500 max-w-sm mb-4">
                      Approved {activeCategory.toLowerCase()} appear here with photograph and enrollment status.
                    </p>
                    <Link
                      href="/admin/enrollment"
                      className="px-4 py-2 rounded-full text-xs font-medium bg-[#2F5BFF] text-white hover:bg-[#254EDB] transition-colors shadow-xs"
                    >
                      Register a {activeCategory.toLowerCase().replace(/s$/, '')}
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
