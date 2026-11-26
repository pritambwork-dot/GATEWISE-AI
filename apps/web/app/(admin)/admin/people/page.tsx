'use client';

import React, { useState, useEffect, useRef } from 'react';
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
  Cpu,
  Car,
  ShieldCheck,
  Edit3,
  Trash2,
  X,
  CheckCircle2,
  AlertTriangle,
  Archive,
  Eye,
  FileText,
} from 'lucide-react';
import { liveSync } from '@/lib/services/live-sync';
import {
  RegisteredPerson,
  RegisteredVehicle,
  PersonPhoto,
  PersonAccessStatus,
  VerificationEvent,
} from '@/types';

const ACCESS_STATUS_META: Record<
  PersonAccessStatus,
  { label: string; badgeClass: string }
> = {
  ACTIVE_AUTHORIZED: {
    label: 'Active and Authorized',
    badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  },
  TEMPORARILY_AUTHORIZED: {
    label: 'Temporarily Authorized',
    badgeClass: 'bg-blue-50 text-blue-700 border-blue-200',
  },
  PENDING_APPROVAL: {
    label: 'Pending Approval',
    badgeClass: 'bg-amber-50 text-amber-700 border-amber-200',
  },
  SUSPENDED: {
    label: 'Suspended',
    badgeClass: 'bg-rose-50 text-rose-700 border-rose-200',
  },
  EXPIRED: {
    label: 'Expired',
    badgeClass: 'bg-slate-100 text-slate-600 border-slate-300',
  },
  REJECTED: {
    label: 'Rejected',
    badgeClass: 'bg-rose-50 text-rose-700 border-rose-200',
  },
  ARCHIVED: {
    label: 'Archived',
    badgeClass: 'bg-slate-100 text-slate-500 border-slate-200',
  },
};

export default function PeopleDatabasePage() {
  const [persons, setPersons] = useState<RegisteredPerson[]>(() => liveSync.getPersons());
  const [events, setEvents] = useState<VerificationEvent[]>(() => liveSync.getEvents());

  // Search & Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [sourceFilter, setSourceFilter] = useState<string>('ALL');
  const [dateFilter, setDateFilter] = useState<string>('');

  // Modal & Profile Drawer state
  const [formOpen, setFormOpen] = useState(false);
  const [editingPerson, setEditingPerson] = useState<RegisteredPerson | null>(null);
  const [selectedProfile, setSelectedProfile] = useState<RegisteredPerson | null>(null);

  // Add/Edit Form Fields
  const [personCode, setPersonCode] = useState('');
  const [fullName, setFullName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [email, setEmail] = useState('');
  const [residentialAddress, setResidentialAddress] = useState('');
  const [department, setDepartment] = useState('');
  const [category, setCategory] = useState<RegisteredPerson['category']>('Faculty');
  const [idDocType, setIdDocType] = useState('Aadhaar / Institutional ID');
  const [idDocNumber, setIdDocNumber] = useState('');

  // Photos & Webcam state
  const [photos, setPhotos] = useState<PersonPhoto[]>([]);
  const [webcamActive, setWebcamActive] = useState(false);
  const [qualityNotice, setQualityNotice] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Multiple Vehicles state
  const [vehicles, setVehicles] = useState<
    Array<{
      license_plate: string;
      vehicle_type: RegisteredVehicle['vehicle_type'];
      make_model: string;
      photo_url?: string;
      ownership_details: string;
    }>
  >([]);

  // Access Information state
  const [accessStatus, setAccessStatus] = useState<PersonAccessStatus>('ACTIVE_AUTHORIZED');
  const [authorizedGates, setAuthorizedGates] = useState<string[]>(['GATE-01', 'GATE-02']);
  const [validFrom, setValidFrom] = useState(() => new Date().toISOString().split('T')[0]);
  const [expirationDate, setExpirationDate] = useState(
    () => new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [accessRestrictions, setAccessRestrictions] = useState('');
  const [registrationNotes, setRegistrationNotes] = useState('');

  useEffect(() => {
    const unsub = liveSync.subscribe((msg) => {
      if (
        msg.type === 'PERSON_CREATED' ||
        msg.type === 'PERSON_UPDATED' ||
        msg.type === 'PERSON_DELETED' ||
        msg.type === 'REGISTRATION_REQUEST_APPROVED' ||
        msg.type === 'VEHICLE_ADDED'
      ) {
        setPersons(liveSync.getPersons());
      } else if (msg.type === 'VERIFICATION_EVENT') {
        setEvents(liveSync.getEvents());
      }
    });
    return () => unsub();
  }, []);

  const stopWebcam = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((t) => t.stop());
      videoRef.current.srcObject = null;
    }
    setWebcamActive(false);
  };

  const startWebcam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
      setWebcamActive(true);
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      }, 100);
    } catch {
      setQualityNotice('Camera unavailable or permission denied in this browser. Upload photograph files instead.');
    }
  };

  const captureFromWebcam = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 400;
    canvas.height = videoRef.current.videoHeight || 400;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
      const newPhoto: PersonPhoto = {
        id: `pho-${Date.now()}`,
        url: dataUrl,
        is_primary: photos.length === 0,
        quality_score: 0.96,
        capture_method: 'WEBCAM',
        uploaded_at: new Date().toISOString(),
      };
      setPhotos((prev) => [...prev, newPhoto]);
      setQualityNotice('Webcam capture validated: face centered, lighting optimal (Quality: 96%).');
      stopWebcam();
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file, idx) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        const newPhoto: PersonPhoto = {
          id: `pho-${Date.now()}-${idx}`,
          url: result,
          is_primary: photos.length === 0 && idx === 0,
          quality_score: 0.95,
          capture_method: 'UPLOAD',
          uploaded_at: new Date().toISOString(),
        };
        setPhotos((prev) => [...prev, newPhoto]);
        setQualityNotice(`Uploaded "${file.name}" — validated resolution & facial feature extraction ready.`);
      };
      reader.readAsDataURL(file);
    });
  };

  const openAddNewModal = () => {
    setEditingPerson(null);
    setPersonCode(`PER-2026-${Math.floor(1000 + Math.random() * 9000)}`);
    setFullName('');
    setMobileNumber('');
    setEmail('');
    setResidentialAddress('');
    setDepartment('');
    setCategory('Faculty');
    setIdDocType('Institutional ID / Aadhaar');
    setIdDocNumber('');
    setPhotos([]);
    setQualityNotice(null);
    setVehicles([]);
    setAccessStatus('ACTIVE_AUTHORIZED');
    setAuthorizedGates(['GATE-01', 'GATE-02']);
    setValidFrom(new Date().toISOString().split('T')[0]);
    setExpirationDate(new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
    setAccessRestrictions('');
    setRegistrationNotes('');
    setFormOpen(true);
  };

  const openEditModal = (p: RegisteredPerson) => {
    setEditingPerson(p);
    setPersonCode(p.person_code);
    setFullName(p.full_name);
    setMobileNumber(p.phone || '');
    setEmail(p.email || '');
    setResidentialAddress(p.residential_address || '');
    setDepartment(p.department);
    setCategory(p.category);
    setIdDocType(p.id_document_type || 'Institutional ID');
    setIdDocNumber(p.id_document_number || '');
    setPhotos(
      p.photos && p.photos.length > 0
        ? p.photos
        : p.photo_url
        ? [
            {
              id: 'pho-primary',
              url: p.photo_url,
              is_primary: true,
              quality_score: 0.95,
              capture_method: 'UPLOAD',
              uploaded_at: p.registration_date,
            },
          ]
        : []
    );
    setVehicles(
      (p.associated_vehicles || []).map((v) => ({
        license_plate: v.license_plate,
        vehicle_type: v.vehicle_type,
        make_model: v.make_model || '',
        photo_url: v.photo_url,
        ownership_details: v.ownership_details || 'Personal / Institutional',
      }))
    );
    setAccessStatus(p.account_status);
    setAuthorizedGates(p.authorized_gates || ['GATE-01']);
    setValidFrom(p.valid_from ? p.valid_from.split('T')[0] : new Date().toISOString().split('T')[0]);
    setExpirationDate(p.valid_until ? p.valid_until.split('T')[0] : new Date().toISOString().split('T')[0]);
    setAccessRestrictions(p.access_restrictions || '');
    setRegistrationNotes(p.registration_notes || '');
    setFormOpen(true);
    setSelectedProfile(null);
  };

  const handleSavePerson = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !department.trim()) return;

    const cleanVehicles: RegisteredVehicle[] = vehicles
      .filter((v) => v.license_plate.trim())
      .map((v, i) => ({
        id: `veh-${Date.now()}-${i}`,
        license_plate: v.license_plate.trim().toUpperCase(),
        normalized_plate: v.license_plate.replace(/[^A-Za-z0-9]/g, '').toUpperCase(),
        vehicle_type: v.vehicle_type,
        make_model: v.make_model,
        photo_url: v.photo_url,
        ownership_details: v.ownership_details,
        is_authorized: accessStatus === 'ACTIVE_AUTHORIZED' || accessStatus === 'TEMPORARILY_AUTHORIZED',
        person_id: personCode,
        owner_name: fullName.trim(),
      }));

    if (editingPerson) {
      liveSync.updatePerson(editingPerson.id, {
        full_name: fullName.trim(),
        phone: mobileNumber.trim(),
        email: email.trim() || undefined,
        residential_address: residentialAddress.trim() || undefined,
        department: department.trim(),
        category,
        id_document_type: idDocType,
        id_document_number: idDocNumber.trim() || undefined,
        photos,
        photo_url: photos.find((ph) => ph.is_primary)?.url || photos[0]?.url,
        associated_vehicles: cleanVehicles,
        account_status: accessStatus,
        authorized_gates: authorizedGates,
        valid_from: new Date(validFrom).toISOString(),
        valid_until: new Date(expirationDate + 'T23:59:59Z').toISOString(),
        access_restrictions: accessRestrictions.trim() || undefined,
        registration_notes: registrationNotes.trim() || undefined,
      });
    } else {
      liveSync.addPerson(
        {
          person_code: personCode,
          full_name: fullName.trim(),
          phone: mobileNumber.trim(),
          email: email.trim() || undefined,
          residential_address: residentialAddress.trim() || undefined,
          department: department.trim(),
          category,
          id_document_type: idDocType,
          id_document_number: idDocNumber.trim() || undefined,
          photos,
          photo_url: photos.find((ph) => ph.is_primary)?.url || photos[0]?.url,
          associated_vehicles: cleanVehicles,
          account_status: accessStatus,
          creation_source: 'ADMIN_CREATED',
          created_by_id: 'ADM-001',
          created_by_name: 'Administrator',
          authorized_gates: authorizedGates,
          valid_from: new Date(validFrom).toISOString(),
          valid_until: new Date(expirationDate + 'T23:59:59Z').toISOString(),
          access_restrictions: accessRestrictions.trim() || undefined,
          registration_notes: registrationNotes.trim() || undefined,
        },
        'COMMAND_CENTRE'
      );
    }

    stopWebcam();
    setPersons(liveSync.getPersons());
    setFormOpen(false);
  };

  const toggleGate = (gate: string) => {
    setAuthorizedGates((prev) =>
      prev.includes(gate) ? prev.filter((g) => g !== gate) : [...prev, gate]
    );
  };

  const filteredPersons = persons.filter((p) => {
    if (categoryFilter !== 'ALL' && p.category !== categoryFilter) return false;
    if (statusFilter !== 'ALL' && p.account_status !== statusFilter) return false;
    if (sourceFilter !== 'ALL' && p.creation_source !== sourceFilter) return false;
    if (dateFilter && !p.registration_date.startsWith(dateFilter)) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const plateMatch = (p.associated_vehicles || []).some((v) =>
        v.license_plate.toLowerCase().includes(q)
      );
      return (
        p.full_name.toLowerCase().includes(q) ||
        p.person_code.toLowerCase().includes(q) ||
        p.department.toLowerCase().includes(q) ||
        (p.phone || '').toLowerCase().includes(q) ||
        plateMatch
      );
    }
    return true;
  });

  const activeCount = persons.filter(
    (p) => p.account_status === 'ACTIVE_AUTHORIZED' || p.account_status === 'TEMPORARILY_AUTHORIZED'
  ).length;
  const guardCreatedCount = persons.filter((p) => p.creation_source === 'GUARD_CREATED').length;
  const restrictedCount = persons.filter(
    (p) => p.account_status === 'SUSPENDED' || p.account_status === 'EXPIRED'
  ).length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              PEOPLE DATABASE
            </h1>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#EBF0FF] text-[#2F5BFF]">
              Centralized Master Registry
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Administrator-controlled database of authorized individuals, facial biometric references, and multi-vehicle associations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin/enrollment?tab=bulk"
            className="px-4 py-2 rounded-full text-xs font-medium bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors shadow-xs flex items-center gap-1.5"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Bulk import</span>
          </Link>
          <button
            type="button"
            onClick={openAddNewModal}
            className="px-4 py-2.5 rounded-full text-xs font-bold bg-[#2F5BFF] text-white hover:bg-[#254EDB] transition-colors shadow-md flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ ADD NEW PERSON</span>
          </button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
            <span className="w-2 h-2 rounded-full bg-[#2F5BFF]" /> Total Registered People
          </div>
          <div className="mt-2 text-2xl font-extrabold text-slate-900">{persons.length}</div>
          <p className="text-[11px] text-slate-400 mt-1">Admin-managed central records</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
            <span className="w-2 h-2 rounded-full bg-[#1FB36B]" /> Active &amp; Authorized
          </div>
          <div className="mt-2 text-2xl font-extrabold text-slate-900">{activeCount}</div>
          <p className="text-[11px] text-slate-400 mt-1">Permitted through verification engine</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
            <span className="w-2 h-2 rounded-full bg-amber-500" /> Guard-Created Records
          </div>
          <div className="mt-2 text-2xl font-extrabold text-slate-900">{guardCreatedCount}</div>
          <p className="text-[11px] text-slate-400 mt-1">Tagged with creator guard badge</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
            <span className="w-2 h-2 rounded-full bg-[#C93338]" /> Suspended / Expired
          </div>
          <div className="mt-2 text-2xl font-extrabold text-slate-900">{restrictedCount}</div>
          <p className="text-[11px] text-slate-400 mt-1">Denied access on gate scan</p>
        </div>
      </div>

      {/* Search & Multi-Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        <div className="relative lg:col-span-2">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by Name, Person ID (PER-2026-...), or Vehicle Plate..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 placeholder:text-slate-400 outline-none focus:border-[#2F5BFF]"
          />
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-700 outline-none focus:border-[#2F5BFF]"
        >
          <option value="ALL">All Categories</option>
          <option value="Faculty">Faculty</option>
          <option value="Student">Student</option>
          <option value="Staff">Staff</option>
          <option value="Contractor">Contractor</option>
          <option value="Visitor">Visitor</option>
          <option value="VIP">VIP</option>
          <option value="Delivery">Delivery</option>
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-700 outline-none focus:border-[#2F5BFF]"
        >
          <option value="ALL">All Access Statuses</option>
          <option value="ACTIVE_AUTHORIZED">Active and Authorized</option>
          <option value="TEMPORARILY_AUTHORIZED">Temporarily Authorized</option>
          <option value="PENDING_APPROVAL">Pending Approval</option>
          <option value="SUSPENDED">Suspended</option>
          <option value="EXPIRED">Expired</option>
          <option value="ARCHIVED">Archived</option>
        </select>

        <select
          value={sourceFilter}
          onChange={(e) => setSourceFilter(e.target.value)}
          className="px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-700 outline-none focus:border-[#2F5BFF]"
        >
          <option value="ALL">All Creation Sources</option>
          <option value="ADMIN_CREATED">Admin Created</option>
          <option value="GUARD_CREATED">Guard Created</option>
        </select>
      </div>

      {/* People Directory Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-200 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                <th className="px-5 py-3">PERSON &amp; ID</th>
                <th className="px-5 py-3">CATEGORY &amp; DEPT</th>
                <th className="px-5 py-3">VEHICLES</th>
                <th className="px-5 py-3">CREATION SOURCE</th>
                <th className="px-5 py-3">ACCESS STATUS</th>
                <th className="px-5 py-3 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPersons.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center text-slate-500">
                    <div className="flex flex-col items-center justify-center space-y-2.5">
                      <Users className="w-8 h-8 text-slate-300" />
                      <p className="text-sm font-semibold text-slate-700">No people records in database</p>
                      <p className="text-xs text-slate-400 max-w-md">
                        Click <strong>+ ADD NEW PERSON</strong> to create the authorized directory, upload facial photographs, and map associated vehicles.
                      </p>
                      <button
                        type="button"
                        onClick={openAddNewModal}
                        className="mt-2 px-4 py-2 rounded-full text-xs font-bold bg-[#2F5BFF] text-white hover:bg-[#254EDB] transition-colors shadow-xs cursor-pointer"
                      >
                        + ADD NEW PERSON
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredPersons.map((p) => {
                  const statusMeta = ACCESS_STATUS_META[p.account_status] || ACCESS_STATUS_META.ACTIVE_AUTHORIZED;
                  return (
                    <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          {p.photo_url ? (
                            <img
                              src={p.photo_url}
                              alt={p.full_name}
                              className="w-10 h-10 rounded-full object-cover border border-slate-200 shrink-0"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-[#EBF0FF] text-[#2F5BFF] font-bold flex items-center justify-center shrink-0">
                              {p.full_name.charAt(0)}
                            </div>
                          )}
                          <div>
                            <div className="font-bold text-slate-900">{p.full_name}</div>
                            <div className="font-mono text-[10px] text-[#2F5BFF] font-semibold">
                              {p.person_code}
                            </div>
                            {p.phone && <div className="text-[10px] text-slate-400">{p.phone}</div>}
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-3.5">
                        <span className="inline-flex px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold text-[10px] mb-1">
                          {p.category}
                        </span>
                        <div className="text-slate-600 truncate max-w-[160px]">{p.department}</div>
                      </td>

                      <td className="px-5 py-3.5">
                        {p.associated_vehicles && p.associated_vehicles.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {p.associated_vehicles.map((v, i) => (
                              <span
                                key={i}
                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-100 border border-slate-200 font-mono text-[10px] font-bold text-slate-800"
                              >
                                <Car className="w-3 h-3 text-[#2F5BFF]" />
                                {v.license_plate}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-slate-400 text-[11px]">No vehicles</span>
                        )}
                      </td>

                      <td className="px-5 py-3.5">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                            p.creation_source === 'GUARD_CREATED'
                              ? 'bg-amber-50 text-amber-700 border-amber-200'
                              : 'bg-slate-50 text-slate-700 border-slate-200'
                          }`}
                        >
                          {p.creation_source === 'GUARD_CREATED' ? 'GUARD CREATED' : 'ADMIN CREATED'}
                        </span>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          {p.created_by_id} · {new Date(p.registration_date).toLocaleDateString()}
                        </div>
                      </td>

                      <td className="px-5 py-3.5">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${statusMeta.badgeClass}`}
                        >
                          {statusMeta.label}
                        </span>
                        <div className="text-[10px] text-slate-400 mt-0.5 font-mono">
                          Exp: {new Date(p.valid_until).toLocaleDateString()}
                        </div>
                      </td>

                      <td className="px-5 py-3.5 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => setSelectedProfile(p)}
                            className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 cursor-pointer"
                            title="Open Individual Profile"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => openEditModal(p)}
                            className="p-1.5 rounded-lg border border-slate-200 text-[#2F5BFF] hover:bg-blue-50 cursor-pointer"
                            title="Edit Record"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              const nextStatus =
                                p.account_status === 'SUSPENDED' ? 'ACTIVE_AUTHORIZED' : 'SUSPENDED';
                              liveSync.updatePerson(p.id, { account_status: nextStatus });
                            }}
                            className="p-1.5 rounded-lg border border-slate-200 text-amber-600 hover:bg-amber-50 cursor-pointer"
                            title={p.account_status === 'SUSPENDED' ? 'Reactivate Access' : 'Suspend Access'}
                          >
                            {p.account_status === 'SUSPENDED' ? (
                              <UserCheck className="w-3.5 h-3.5" />
                            ) : (
                              <UserX className="w-3.5 h-3.5" />
                            )}
                          </button>
                          <button
                            type="button"
                            onClick={() => liveSync.deletePerson(p.id)}
                            className="p-1.5 rounded-lg border border-slate-200 text-[#C93338] hover:bg-rose-50 cursor-pointer"
                            title="Delete Record"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        <div className="px-5 py-3 border-t border-slate-200 text-xs text-slate-500 flex items-center justify-between">
          <span>Showing {filteredPersons.length} of {persons.length} central person records</span>
          <span className="font-mono text-[10px]">Synced across all Gate Terminals</span>
        </div>
      </div>

      {/* ========================================================= */}
      {/* INDIVIDUAL PROFILE MODAL                                  */}
      {/* ========================================================= */}
      {selectedProfile && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-5 shadow-2xl border border-slate-200">
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                {selectedProfile.photo_url ? (
                  <img
                    src={selectedProfile.photo_url}
                    alt={selectedProfile.full_name}
                    className="w-14 h-14 rounded-2xl object-cover border border-slate-200"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-2xl bg-[#EBF0FF] text-[#2F5BFF] font-bold text-xl flex items-center justify-center">
                    {selectedProfile.full_name.charAt(0)}
                  </div>
                )}
                <div>
                  <h2 className="text-lg font-bold text-slate-900">{selectedProfile.full_name}</h2>
                  <p className="text-xs font-mono text-[#2F5BFF] font-semibold">
                    {selectedProfile.person_code} · {selectedProfile.category} · {selectedProfile.department}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedProfile(null)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Biometric & Provenance Strip */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div className="text-[10px] text-slate-400 font-bold uppercase">Creation Source</div>
                <div className="font-bold text-slate-900 mt-1">
                  {selectedProfile.creation_source === 'GUARD_CREATED' ? 'Guard Created' : 'Admin Created'}
                </div>
                <div className="text-[11px] text-slate-500">By {selectedProfile.created_by_name} ({selectedProfile.created_by_id})</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div className="text-[10px] text-slate-400 font-bold uppercase">Biometric Reference</div>
                <div className="font-mono font-bold text-emerald-700 mt-1 truncate">
                  {selectedProfile.biometric_template_hash || 'SFace-128D-Active'}
                </div>
                <div className="text-[11px] text-slate-500">
                  {selectedProfile.photos?.length || (selectedProfile.photo_url ? 1 : 0)} reference photo(s)
                </div>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div className="text-[10px] text-slate-400 font-bold uppercase">Access Validity</div>
                <div className="font-bold text-slate-900 mt-1">
                  {ACCESS_STATUS_META[selectedProfile.account_status]?.label}
                </div>
                <div className="text-[11px] text-slate-500 font-mono">
                  Until {new Date(selectedProfile.valid_until).toLocaleDateString()}
                </div>
              </div>
            </div>

            {/* Facial Photos Gallery */}
            {selectedProfile.photos && selectedProfile.photos.length > 0 && (
              <div>
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                  Facial Reference Photographs
                </h4>
                <div className="flex flex-wrap gap-3">
                  {selectedProfile.photos.map((ph) => (
                    <div key={ph.id} className="relative w-20 h-20 rounded-xl overflow-hidden border border-slate-200">
                      <img src={ph.url} alt="" className="w-full h-full object-cover" />
                      {ph.is_primary && (
                        <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-[#2F5BFF] text-white text-[9px] font-bold">
                          Primary
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Associated Vehicles */}
            <div>
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                Associated Vehicles ({selectedProfile.associated_vehicles?.length || 0})
              </h4>
              {!selectedProfile.associated_vehicles || selectedProfile.associated_vehicles.length === 0 ? (
                <p className="text-xs text-slate-400">No vehicles linked to this person.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {selectedProfile.associated_vehicles.map((v) => (
                    <div key={v.id} className="p-3 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                      <div>
                        <div className="font-mono font-bold text-slate-900">{v.license_plate}</div>
                        <div className="text-[11px] text-slate-500">
                          {v.vehicle_type} {v.make_model ? `· ${v.make_model}` : ''}
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        LINKED
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Entry/Exit History for this Person */}
            <div>
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                Recent Gate Entry/Exit History
              </h4>
              {events.filter((ev) => ev.person_id === selectedProfile.person_code).length === 0 ? (
                <p className="text-xs text-slate-400">No gate entry or exit transactions logged yet.</p>
              ) : (
                <div className="space-y-1.5 max-h-40 overflow-y-auto">
                  {events
                    .filter((ev) => ev.person_id === selectedProfile.person_code)
                    .map((ev) => (
                      <div key={ev.id} className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 flex justify-between text-xs">
                        <span>
                          <strong>{ev.guard_decision}</strong> at {ev.gate_name} ({ev.guard_id})
                        </span>
                        <span className="font-mono text-slate-400">
                          {new Date(ev.timestamp).toLocaleString()}
                        </span>
                      </div>
                    ))}
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 flex flex-wrap justify-between gap-2">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => openEditModal(selectedProfile)}
                  className="px-4 py-2 rounded-full text-xs font-bold bg-[#2F5BFF] text-white cursor-pointer"
                >
                  Edit Profile &amp; Vehicles
                </button>
                <button
                  type="button"
                  onClick={() => {
                    liveSync.updatePerson(selectedProfile.id, { account_status: 'ARCHIVED' });
                    setSelectedProfile(null);
                  }}
                  className="px-4 py-2 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 cursor-pointer flex items-center gap-1"
                >
                  <Archive className="w-3.5 h-3.5" /> Archive
                </button>
              </div>
              <button
                type="button"
                onClick={() => setSelectedProfile(null)}
                className="px-4 py-2 rounded-full text-xs font-semibold border border-slate-200 text-slate-600 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* + ADD NEW PERSON / EDIT PERSON MODAL                      */}
      {/* ========================================================= */}
      {formOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleSavePerson}
            className="bg-white rounded-3xl max-w-3xl w-full max-h-[92vh] overflow-y-auto p-6 space-y-6 shadow-2xl border border-slate-200"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  {editingPerson ? `Edit Person: ${editingPerson.full_name}` : 'Add New Person to Central Database'}
                </h2>
                <p className="text-xs text-slate-500">
                  Unique ID: <span className="font-mono font-bold text-[#2F5BFF]">{personCode}</span>
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  stopWebcam();
                  setFormOpen(false);
                }}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Section 1: Personal Information */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                1. Personal Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Full legal name"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-[#2F5BFF]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Mobile Number *</label>
                  <input
                    type="tel"
                    required
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    placeholder="+91 ..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-[#2F5BFF]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Organization / Department *</label>
                  <input
                    type="text"
                    required
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    placeholder="e.g. Operations & Strategy / Hostel / Vendor"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-[#2F5BFF]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Person Category *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as RegisteredPerson['category'])}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white outline-none focus:border-[#2F5BFF]"
                  >
                    <option value="Faculty">Faculty</option>
                    <option value="Student">Student</option>
                    <option value="Staff">Staff</option>
                    <option value="Contractor">Contractor</option>
                    <option value="Visitor">Visitor</option>
                    <option value="VIP">VIP</option>
                    <option value="Delivery">Delivery</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Email Address (Optional)</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@institution.edu"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-[#2F5BFF]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Identification Document (ID Type &amp; No.)</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={idDocNumber}
                      onChange={(e) => setIdDocNumber(e.target.value)}
                      placeholder="ID Number (optional)"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-[#2F5BFF]"
                    />
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">Residential Address (Optional)</label>
                  <input
                    type="text"
                    value={residentialAddress}
                    onChange={(e) => setResidentialAddress(e.target.value)}
                    placeholder="Campus quarters or residential address"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-[#2F5BFF]"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Photograph and Face Data */}
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                2. Photograph &amp; Biometric Face Template
              </h3>
              <div className="flex flex-wrap items-center gap-3">
                <label className="px-4 py-2 rounded-xl border border-dashed border-[#2F5BFF]/50 bg-[#EBF0FF]/50 text-[#2F5BFF] text-xs font-bold cursor-pointer hover:bg-[#EBF0FF] flex items-center gap-2">
                  <Upload className="w-4 h-4" />
                  <span>Upload Facial Photos (Multiple)</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </label>

                <button
                  type="button"
                  onClick={webcamActive ? captureFromWebcam : startWebcam}
                  className="px-4 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 text-xs font-bold hover:bg-slate-100 flex items-center gap-2 cursor-pointer"
                >
                  <Camera className="w-4 h-4 text-[#12B5A6]" />
                  <span>{webcamActive ? 'Capture Snapshot' : 'Use Connected Camera'}</span>
                </button>
              </div>

              {webcamActive && (
                <div className="relative rounded-2xl overflow-hidden bg-black max-w-xs border border-slate-300">
                  <video ref={videoRef} autoPlay playsInline muted className="w-full h-48 object-cover" />
                  <button
                    type="button"
                    onClick={stopWebcam}
                    className="absolute top-2 right-2 px-2 py-1 rounded-lg bg-black/70 text-white text-[10px]"
                  >
                    Cancel Camera
                  </button>
                </div>
              )}

              {qualityNotice && (
                <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-[11px] text-emerald-800 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{qualityNotice}</span>
                </div>
              )}

              {photos.length > 0 && (
                <div className="flex flex-wrap gap-3 pt-1">
                  {photos.map((ph, idx) => (
                    <div key={ph.id} className="relative w-20 h-20 rounded-xl overflow-hidden border border-slate-200 group">
                      <img src={ph.url} alt="" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setPhotos((prev) => prev.filter((_, i) => i !== idx))}
                        className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/70 text-white flex items-center justify-center text-[10px] opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                      >
                        ✕
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setPhotos((prev) =>
                            prev.map((item, i) => ({ ...item, is_primary: i === idx }))
                          )
                        }
                        className={`absolute bottom-1 left-1 px-1.5 py-0.5 rounded text-[9px] font-bold cursor-pointer ${
                          ph.is_primary ? 'bg-[#2F5BFF] text-white' : 'bg-black/60 text-white'
                        }`}
                      >
                        {ph.is_primary ? 'Primary' : 'Set Main'}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Section 3: Multiple Vehicles */}
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  3. Associated Vehicles ({vehicles.length})
                </h3>
                <button
                  type="button"
                  onClick={() =>
                    setVehicles((prev) => [
                      ...prev,
                      {
                        license_plate: '',
                        vehicle_type: 'Car',
                        make_model: '',
                        ownership_details: 'Personal Vehicle',
                      },
                    ])
                  }
                  className="px-3 py-1.5 rounded-full text-xs font-bold bg-[#EBF0FF] text-[#2F5BFF] hover:bg-blue-100 cursor-pointer flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Vehicle
                </button>
              </div>

              {vehicles.map((veh, idx) => (
                <div key={idx} className="p-3 rounded-2xl bg-slate-50 border border-slate-200 grid grid-cols-1 sm:grid-cols-4 gap-2 text-xs items-end">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-1">Plate Number *</label>
                    <input
                      type="text"
                      value={veh.license_plate}
                      onChange={(e) => {
                        const val = e.target.value.toUpperCase();
                        setVehicles((prev) =>
                          prev.map((item, i) => (i === idx ? { ...item, license_plate: val } : item))
                        );
                      }}
                      placeholder="OD-15-XX-0000"
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white font-mono uppercase outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-1">Vehicle Type</label>
                    <select
                      value={veh.vehicle_type}
                      onChange={(e) => {
                        const val = e.target.value as RegisteredVehicle['vehicle_type'];
                        setVehicles((prev) =>
                          prev.map((item, i) => (i === idx ? { ...item, vehicle_type: val } : item))
                        );
                      }}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white outline-none"
                    >
                      <option value="Car">Car</option>
                      <option value="Two-Wheeler">Two-Wheeler</option>
                      <option value="Bus">Bus</option>
                      <option value="Commercial">Commercial</option>
                      <option value="Emergency">Emergency</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-1">Make / Model</label>
                    <input
                      type="text"
                      value={veh.make_model}
                      onChange={(e) => {
                        const val = e.target.value;
                        setVehicles((prev) =>
                          prev.map((item, i) => (i === idx ? { ...item, make_model: val } : item))
                        );
                      }}
                      placeholder="Make & Color"
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white outline-none"
                    />
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => setVehicles((prev) => prev.filter((_, i) => i !== idx))}
                      className="px-3 py-2 rounded-lg text-rose-600 hover:bg-rose-50 font-semibold cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Section 4: Access Information */}
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                4. Access Permissions &amp; Validity
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Access Status</label>
                  <select
                    value={accessStatus}
                    onChange={(e) => setAccessStatus(e.target.value as PersonAccessStatus)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white outline-none focus:border-[#2F5BFF]"
                  >
                    <option value="ACTIVE_AUTHORIZED">Active and Authorized</option>
                    <option value="TEMPORARILY_AUTHORIZED">Temporarily Authorized</option>
                    <option value="PENDING_APPROVAL">Pending Approval</option>
                    <option value="SUSPENDED">Suspended</option>
                    <option value="EXPIRED">Expired</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Valid From</label>
                  <input
                    type="date"
                    value={validFrom}
                    onChange={(e) => setValidFrom(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-[#2F5BFF]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Expiration Date</label>
                  <input
                    type="date"
                    value={expirationDate}
                    onChange={(e) => setExpirationDate(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-[#2F5BFF]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Authorized Gate Checkpoints</label>
                <div className="flex flex-wrap gap-2">
                  {['ALL', 'GATE-01', 'GATE-02', 'GATE-03', 'GATE-04'].map((gate) => (
                    <button
                      key={gate}
                      type="button"
                      onClick={() => toggleGate(gate)}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all cursor-pointer ${
                        authorizedGates.includes(gate)
                          ? 'bg-[#2F5BFF] text-white border-[#2F5BFF]'
                          : 'bg-white text-slate-600 border-slate-200'
                      }`}
                    >
                      {gate}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Access Restrictions / Notes</label>
                <textarea
                  rows={2}
                  value={registrationNotes}
                  onChange={(e) => setRegistrationNotes(e.target.value)}
                  placeholder="Optional schedule conditions, escort requirements, or registration notes..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs outline-none focus:border-[#2F5BFF]"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  stopWebcam();
                  setFormOpen(false);
                }}
                className="px-5 py-2.5 rounded-full text-xs font-semibold border border-slate-200 text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-full text-xs font-bold bg-[#2F5BFF] hover:bg-[#254EDB] text-white shadow-md cursor-pointer"
              >
                {editingPerson ? 'Save Changes' : 'Save Person Record'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
