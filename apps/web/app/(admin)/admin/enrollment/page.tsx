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
  Paperclip,
  Check,
  X,
  Car
} from 'lucide-react';
import { liveSync } from '@/lib/services/live-sync';
import { RegistrationRequest } from '@/types';

function EnrollmentContent() {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') || 'new';
  const [activeTab, setActiveTab] = useState<'new' | 'bulk' | 'approvals' | 'model'>(
    initialTab === 'bulk' || initialTab === 'approvals' || initialTab === 'model' ? initialTab : 'new'
  );
  const [regCategory, setRegCategory] = useState<'Student' | 'Faculty' | 'Worker' | 'Visiting person' | 'Campus vehicle'>('Student');

  // Real-time registration requests state
  const [requests, setRequests] = useState<RegistrationRequest[]>(() => liveSync.getRegistrationRequests());
  const [approvalSearch, setApprovalSearch] = useState('');
  const [approvalCategory, setApprovalCategory] = useState('');
  const [approvalStatus, setApprovalStatus] = useState('');

  // Edit-before-approval & Request-Info Modals
  const [editingRequest, setEditingRequest] = useState<RegistrationRequest | null>(null);
  const [editName, setEditName] = useState('');
  const [editCategory, setEditCategory] = useState<RegistrationRequest['category']>('Visitor');
  const [editPlate, setEditPlate] = useState('');
  const [editStatus, setEditStatus] = useState<'ACTIVE_AUTHORIZED' | 'TEMPORARILY_AUTHORIZED'>('TEMPORARILY_AUTHORIZED');
  const [editNotes, setEditNotes] = useState('');

  const [infoModalReq, setInfoModalReq] = useState<RegistrationRequest | null>(null);
  const [infoPrompt, setInfoPrompt] = useState('');

  // Bulk CSV Import state
  const [bulkRows, setBulkRows] = useState<
    Array<{
      rowNum: number;
      full_name: string;
      category: string;
      department: string;
      phone: string;
      vehicle_plate: string;
      issue?: string;
    }>
  >([]);
  const [bulkMessage, setBulkMessage] = useState<string | null>(null);

  useEffect(() => {
    const unsub = liveSync.subscribe((msg) => {
      if (
        msg.type === 'REGISTRATION_REQUEST_CREATED' ||
        msg.type === 'REGISTRATION_REQUEST_APPROVED' ||
        msg.type === 'REGISTRATION_REQUEST_REJECTED' ||
        msg.type === 'REGISTRATION_REQUEST_INFO_REQUIRED'
      ) {
        setRequests(liveSync.getRegistrationRequests());
      }
    });
    return () => unsub();
  }, []);

  const handleApproveRequest = (id: string) => {
    liveSync.approveRegistrationRequest(id, 'Approved & Added to Central People Database');
    setRequests(liveSync.getRegistrationRequests());
  };

  const handleRejectRequest = (id: string) => {
    liveSync.rejectRegistrationRequest(id, 'Rejected by Institutional Policy');
    setRequests(liveSync.getRegistrationRequests());
  };

  const openEditApproveModal = (req: RegistrationRequest) => {
    setEditingRequest(req);
    setEditName(req.full_name);
    setEditCategory(req.category);
    setEditPlate(req.vehicle_plate || '');
    setEditStatus('TEMPORARILY_AUTHORIZED');
    setEditNotes(req.review_notes || '');
  };

  const submitEditApprove = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRequest) return;
    liveSync.approveRegistrationRequest(editingRequest.id, editNotes || 'Edited & Approved by Admin', {
      full_name: editName.trim(),
      category: editCategory,
      vehicle_plate: editPlate.trim() ? editPlate.trim().toUpperCase() : undefined,
      access_status: editStatus,
    });
    setRequests(liveSync.getRegistrationRequests());
    setEditingRequest(null);
  };

  const submitInfoRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!infoModalReq || !infoPrompt.trim()) return;
    liveSync.requestMoreInfoRegistrationRequest(infoModalReq.id, infoPrompt.trim());
    setRequests(liveSync.getRegistrationRequests());
    setInfoModalReq(null);
    setInfoPrompt('');
  };

  const handleBulkCsvUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setBulkMessage(null);
    const reader = new FileReader();
    reader.onload = () => {
      const text = (reader.result as string) || '';
      const lines = text.split(/\r?\n/).filter((l) => l.trim());
      const parsed = lines.slice(1).map((line, i) => {
        const cols = line.split(',').map((c) => c.trim());
        const full_name = cols[0] || '';
        const category = cols[1] || 'Visitor';
        const department = cols[2] || 'General Campus';
        const phone = cols[3] || '';
        const vehicle_plate = cols[4] || '';
        let issue = !full_name ? 'Missing full name' : liveSync.checkDuplicates(full_name, phone, vehicle_plate);
        return { rowNum: i + 2, full_name, category, department, phone, vehicle_plate, issue };
      });
      setBulkRows(parsed);
    };
    reader.readAsText(file);
  };

  const confirmBulkImport = () => {
    const valid = bulkRows.filter((r) => !r.issue);
    valid.forEach((r) => {
      liveSync.addPerson(
        {
          full_name: r.full_name,
          category: (['Faculty', 'Student', 'Staff', 'Contractor', 'Visitor', 'VIP', 'Delivery'].includes(r.category)
            ? r.category
            : 'Visitor') as any,
          department: r.department,
          phone: r.phone,
          account_status: 'ACTIVE_AUTHORIZED',
          creation_source: 'ADMIN_CREATED',
          created_by_id: 'ADM-001',
          created_by_name: 'Bulk CSV Import',
          authorized_gates: ['ALL'],
          valid_from: new Date().toISOString(),
          valid_until: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
          associated_vehicles: r.vehicle_plate
            ? [
                {
                  id: `veh-bulk-${Date.now()}-${r.rowNum}`,
                  license_plate: r.vehicle_plate.toUpperCase(),
                  normalized_plate: r.vehicle_plate.replace(/[^A-Za-z0-9]/g, '').toUpperCase(),
                  vehicle_type: 'Car',
                  is_authorized: true,
                },
              ]
            : [],
        },
        'COMMAND_CENTRE'
      );
    });
    setBulkMessage(`Imported ${valid.length} validated records into People Database (skipped ${bulkRows.length - valid.length} duplicates/errors).`);
    setBulkRows([]);
  };

  const filteredRequests = requests.filter((r) => {
    if (approvalStatus && approvalStatus !== 'all') {
      if (approvalStatus === 'Pending' && r.status !== 'PENDING_APPROVAL') return false;
      if (approvalStatus === 'Approved' && r.status !== 'APPROVED') return false;
      if (approvalStatus === 'Rejected' && r.status !== 'REJECTED') return false;
      if (approvalStatus === 'InfoRequired' && r.status !== 'ADDITIONAL_INFO_REQUIRED') return false;
    }
    if (approvalCategory && approvalCategory !== 'all') {
      if (r.category.toLowerCase() !== approvalCategory.toLowerCase()) return false;
    }
    if (approvalSearch.trim()) {
      const q = approvalSearch.toLowerCase();
      return (
        r.full_name.toLowerCase().includes(q) ||
        r.request_code.toLowerCase().includes(q) ||
        (r.vehicle_plate || '').toLowerCase().includes(q)
      );
    }
    return true;
  });

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
                  {bulkRows.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-20 text-center">
                        <div className="flex flex-col items-center justify-center">
                          <div className="w-12 h-12 rounded-2xl bg-[#EBF0FF] text-[#2F5BFF] flex items-center justify-center mb-3">
                            <FileSpreadsheet className="w-6 h-6" />
                          </div>
                          <h3 className="text-base font-bold text-slate-900 mb-1">No import batch</h3>
                          <p className="text-xs text-slate-500 max-w-sm">
                            Upload a CSV file below (columns: Full Name, Category, Department, Phone, Vehicle Plate) to preview and validate duplicates.
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    bulkRows.map((row) => (
                      <tr key={row.rowNum} className="border-b border-slate-100 text-xs">
                        <td className="px-5 py-3 font-mono font-bold text-slate-700">#{row.rowNum}</td>
                        <td className="px-5 py-3 font-semibold text-slate-900">{row.full_name || '—'}</td>
                        <td className="px-5 py-3 text-slate-600">
                          {row.issue ? <span className="text-rose-600 font-semibold">{row.issue}</span> : 'Valid row'}
                        </td>
                        <td className="px-5 py-3 text-slate-500">
                          {row.vehicle_plate || 'No vehicle'} · {row.category}
                        </td>
                        <td className="px-5 py-3">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              row.issue ? 'bg-rose-50 text-rose-700' : 'bg-emerald-50 text-emerald-700'
                            }`}
                          >
                            {row.issue ? 'WARNING' : 'READY'}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            <div className="px-5 py-3.5 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 bg-white">
              <span>{bulkRows.length} rows staged for validation</span>
              {bulkRows.length > 0 && (
                <button
                  type="button"
                  onClick={confirmBulkImport}
                  className="px-4 py-1.5 rounded-full text-xs font-bold bg-[#1FB36B] text-white hover:bg-emerald-700 cursor-pointer"
                >
                  Confirm Import ({bulkRows.filter((r) => !r.issue).length} Valid)
                </button>
              )}
            </div>
          </div>

          {bulkMessage && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800">
              {bulkMessage}
            </div>
          )}

          {/* Upload Workbook Card */}
          <div className="bg-white rounded-2xl p-8 border border-dashed border-slate-300 text-center space-y-4">
            <h3 className="text-base font-bold text-slate-900">
              Upload an institution-approved CSV workbook
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
              Rows are validated, checked for duplicates against existing People Database records, and staged for confirmation. Existing records are never overwritten silently.
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <label className="px-5 py-2.5 rounded-full text-xs font-semibold bg-[#2F5BFF] text-white hover:bg-[#254EDB] transition-colors shadow-xs cursor-pointer">
                <span>Choose CSV File</span>
                <input type="file" accept=".csv" onChange={handleBulkCsvUpload} className="hidden" />
              </label>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 3: NEW REGISTRATION REQUESTS */}
      {activeTab === 'approvals' && (
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                  NEW REGISTRATION REQUESTS
                </h1>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#EBF0FF] text-[#2F5BFF]">
                  Guard Workflow A Queue
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Review guard-submitted person photographs and vehicle details. Approved requests automatically create authorized records in People Database.
              </p>
            </div>
          </div>

          {/* Filters Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={approvalSearch}
                onChange={(e) => setApprovalSearch(e.target.value)}
                placeholder="Search submissions by name, request ID, or plate"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-[#2F5BFF]"
              />
            </div>
            <select
              value={approvalCategory}
              onChange={(e) => setApprovalCategory(e.target.value)}
              className="px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-700 focus:outline-hidden focus:border-[#2F5BFF]"
            >
              <option value="">All Categories</option>
              <option value="Visitor">Visitor</option>
              <option value="Contractor">Contractor</option>
              <option value="VIP">VIP</option>
              <option value="Delivery">Delivery</option>
              <option value="Temporary Staff">Temporary Staff</option>
            </select>
            <select
              value={approvalStatus}
              onChange={(e) => setApprovalStatus(e.target.value)}
              className="px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-700 focus:outline-hidden focus:border-[#2F5BFF]"
            >
              <option value="">All Statuses</option>
              <option value="Pending">Pending Approval</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
              <option value="InfoRequired">More Information Required</option>
            </select>
          </div>

          {/* Table Container */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/60 border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                    <th className="px-5 py-3">REQUEST ID</th>
                    <th className="px-5 py-3">NAME, PHOTO &amp; DETAILS</th>
                    <th className="px-5 py-3">CATEGORY</th>
                    <th className="px-5 py-3">SUBMITTED BY</th>
                    <th className="px-5 py-3">VEHICLE</th>
                    <th className="px-5 py-3">STATUS</th>
                    <th className="px-5 py-3 text-right">ADMIN ACTIONS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {filteredRequests.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-16 text-center">
                        <div className="flex flex-col items-center justify-center">
                          <div className="w-12 h-12 rounded-2xl bg-[#EBF0FF] text-[#2F5BFF] flex items-center justify-center mb-3">
                            <CheckCircle2 className="w-6 h-6" />
                          </div>
                          <h3 className="text-base font-bold text-slate-900 mb-1">No registration requests found</h3>
                          <p className="text-xs text-slate-500 max-w-sm mb-2">
                            Requests submitted by guards from mobile gate terminals appear here live for administrator review.
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredRequests.map((req) => (
                      <tr key={req.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="px-5 py-3.5 font-mono text-xs font-semibold text-slate-900">
                          <div>{req.request_code}</div>
                          <div className="text-[10px] text-slate-400 font-normal">
                            {new Date(req.submitted_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-2.5">
                            {req.face_photo_url ? (
                              <img src={req.face_photo_url} alt="" className="w-9 h-9 rounded-full object-cover border border-slate-200" />
                            ) : (
                              <div className="w-9 h-9 rounded-full bg-slate-100 text-slate-600 font-bold flex items-center justify-center text-xs">
                                {req.full_name.charAt(0)}
                              </div>
                            )}
                            <div>
                              <div className="font-semibold text-slate-900">{req.full_name}</div>
                              <div className="text-[11px] text-slate-500 mt-0.5">
                                {req.purpose} · {req.expected_duration}
                              </div>
                              {req.phone && <div className="text-[10px] text-slate-400 font-mono">{req.phone}</div>}
                              {req.duplicate_warning && (
                                <div className="mt-1 inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-50 border border-amber-200 text-[10px] font-bold text-amber-800">
                                  ⚠ {req.duplicate_warning}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-3.5">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                            {req.category}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-slate-600">
                          <div className="font-medium text-slate-800">{req.submitted_by_guard_name}</div>
                          <div className="text-[10px] text-slate-400">{req.submitted_by_guard_id} · {req.gate_id || 'GATE-01'}</div>
                        </td>
                        <td className="px-5 py-3.5">
                          {req.vehicle_plate ? (
                            <div className="flex items-center gap-1.5 font-mono font-semibold text-slate-800">
                              <Car className="w-3.5 h-3.5 text-[#12B5A6]" />
                              <span>{req.vehicle_plate}</span>
                            </div>
                          ) : (
                            <span className="text-slate-400">—</span>
                          )}
                        </td>
                        <td className="px-5 py-3.5">
                          <span
                            className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold uppercase ${
                              req.status === 'APPROVED'
                                ? 'bg-[#E6F8F0] text-[#1FB36B] border border-[#1FB36B]/30'
                                : req.status === 'REJECTED'
                                ? 'bg-[#FDF2F2] text-[#C93338] border border-[#C93338]/30'
                                : req.status === 'ADDITIONAL_INFO_REQUIRED'
                                ? 'bg-[#EBF0FF] text-[#2F5BFF] border border-[#2F5BFF]/30'
                                : 'bg-[#FFF8E6] text-[#D97706] border border-[#FFB547]/30'
                            }`}
                          >
                            {req.status === 'APPROVED'
                              ? 'Approved'
                              : req.status === 'REJECTED'
                              ? 'Rejected'
                              : req.status === 'ADDITIONAL_INFO_REQUIRED'
                              ? 'Info Required'
                              : 'Pending Approval'}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-right">
                          {req.status === 'PENDING_APPROVAL' || req.status === 'ADDITIONAL_INFO_REQUIRED' ? (
                            <div className="inline-flex flex-wrap justify-end items-center gap-1.5">
                              <button
                                onClick={() => handleApproveRequest(req.id)}
                                className="px-2.5 py-1.5 rounded-lg bg-[#1FB36B] hover:bg-[#199457] text-white text-[11px] font-semibold shadow-xs flex items-center gap-1 cursor-pointer"
                              >
                                <Check className="w-3 h-3" />
                                <span>Approve &amp; Create</span>
                              </button>
                              <button
                                onClick={() => openEditApproveModal(req)}
                                className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-semibold cursor-pointer"
                              >
                                Edit &amp; Approve
                              </button>
                              <button
                                onClick={() => {
                                  setInfoModalReq(req);
                                  setInfoPrompt('');
                                }}
                                className="px-2.5 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-[#2F5BFF] text-[11px] font-semibold cursor-pointer"
                              >
                                Request Info
                              </button>
                              <button
                                onClick={() => handleRejectRequest(req.id)}
                                className="px-2.5 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-[#C93338] border border-red-200 text-[11px] font-semibold cursor-pointer"
                              >
                                Reject
                              </button>
                            </div>
                          ) : (
                            <span className="text-[11px] text-slate-400 italic">
                              {req.review_notes || 'Decision recorded'}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            <div className="px-5 py-3.5 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 bg-white">
              <span>{filteredRequests.length} requests in queue</span>
            </div>
          </div>

          {/* Edit Details Before Approval Modal */}
          {editingRequest && (
            <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
              <form onSubmit={submitEditApprove} className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200 text-xs">
                <h3 className="font-bold text-base text-slate-900">Edit Details Before Approval ({editingRequest.request_code})</h3>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Full Name</label>
                  <input type="text" required value={editName} onChange={(e) => setEditName(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-slate-200" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Category</label>
                    <select value={editCategory} onChange={(e) => setEditCategory(e.target.value as any)} className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white">
                      <option value="Visitor">Visitor</option>
                      <option value="Contractor">Contractor</option>
                      <option value="VIP">VIP</option>
                      <option value="Delivery">Delivery</option>
                      <option value="Temporary Staff">Temporary Staff</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Vehicle Plate</label>
                    <input type="text" value={editPlate} onChange={(e) => setEditPlate(e.target.value.toUpperCase())} className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono" />
                  </div>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Access Permission Granted</label>
                  <select value={editStatus} onChange={(e) => setEditStatus(e.target.value as any)} className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white">
                    <option value="TEMPORARILY_AUTHORIZED">Temporarily Authorized (7 Days)</option>
                    <option value="ACTIVE_AUTHORIZED">Active and Authorized</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Approval Notes</label>
                  <input type="text" value={editNotes} onChange={(e) => setEditNotes(e.target.value)} placeholder="Administrative verification note" className="w-full px-3 py-2 rounded-xl border border-slate-200" />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button type="button" onClick={() => setEditingRequest(null)} className="px-4 py-2 rounded-full border border-slate-200 font-semibold cursor-pointer">Cancel</button>
                  <button type="submit" className="px-5 py-2 rounded-full bg-[#1FB36B] text-white font-bold cursor-pointer">Approve &amp; Create Record</button>
                </div>
              </form>
            </div>
          )}

          {/* Request More Info Modal */}
          {infoModalReq && (
            <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
              <form onSubmit={submitInfoRequest} className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200 text-xs">
                <h3 className="font-bold text-base text-slate-900">Request Additional Information</h3>
                <p className="text-slate-500">Ask guard {infoModalReq.submitted_by_guard_id} for missing documents or clearer photographs for {infoModalReq.full_name}.</p>
                <textarea required rows={3} value={infoPrompt} onChange={(e) => setInfoPrompt(e.target.value)} placeholder="e.g. Please re-capture vehicle RC / clearer front photograph..." className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none" />
                <div className="flex justify-end gap-2">
                  <button type="button" onClick={() => setInfoModalReq(null)} className="px-4 py-2 rounded-full border border-slate-200 font-semibold cursor-pointer">Cancel</button>
                  <button type="submit" className="px-5 py-2 rounded-full bg-[#2F5BFF] text-white font-bold cursor-pointer">Send Info Request</button>
                </div>
              </form>
            </div>
          )}
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
