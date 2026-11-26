'use client';

import React, { useState } from 'react';
import {
  Car,
  Search,
  Plus,
  Hexagon,
  CheckCircle2,
  AlertOctagon,
  Clock,
  ShieldCheck,
  X
} from 'lucide-react';

interface VehicleRecord {
  id: string;
  plate: string;
  type: string;
  makeModel: string;
  ownerName: string;
  linkedPersonId: string;
  department: string;
  accessGroup: string;
  validity: string;
  status: 'ACTIVE' | 'EXPIRED' | 'PENDING';
}

const INITIAL_VEHICLES: VehicleRecord[] = [
  {
    id: 'veh-001',
    plate: 'OD-15-AB-1234',
    type: 'Four Wheeler',
    makeModel: 'Tata Safari XZA+ (Orcus White)',
    ownerName: 'Dr. Rahul Sharma',
    linkedPersonId: 'FAC-8041',
    department: 'Operations & Strategy',
    accessGroup: 'Faculty Perimeter',
    validity: '30 Jun 2028',
    status: 'ACTIVE',
  },
  {
    id: 'veh-002',
    plate: 'OD-15-K-5521',
    type: 'Four Wheeler',
    makeModel: 'Honda City ZX (Lunar Silver)',
    ownerName: 'Dr. Ananya Sharma',
    linkedPersonId: 'FAC-8042',
    department: 'Dean Academics',
    accessGroup: 'Directorate & Academic',
    validity: '31 Jul 2027',
    status: 'ACTIVE',
  },
  {
    id: 'veh-003',
    plate: 'OD-15-M-4012',
    type: 'Two Wheeler',
    makeModel: 'Yamaha FZ-S V4 (Racing Blue)',
    ownerName: 'Rahul Verma',
    linkedPersonId: 'STU-2024-089',
    department: 'MBA 2024-26',
    accessGroup: 'Student Resident Zone',
    validity: '31 May 2026',
    status: 'ACTIVE',
  },
  {
    id: 'veh-004',
    plate: 'OD-15-Q-8890',
    type: 'Four Wheeler',
    makeModel: 'Hyundai Creta SX (Titan Grey)',
    ownerName: 'Vikram Patel',
    linkedPersonId: 'STU-2024-112',
    department: 'MBA 2024-26',
    accessGroup: 'Student Resident Zone',
    validity: '15 Oct 2025 (Expired)',
    status: 'EXPIRED',
  },
  {
    id: 'veh-005',
    plate: 'OD-15-Z-9001',
    type: 'Four Wheeler',
    makeModel: 'Toyota Innova Crysta (Silver)',
    ownerName: 'Raghavan Iyer',
    linkedPersonId: 'VIS-2024-031',
    department: 'Executive MDP Guest',
    accessGroup: 'Visitor Main Gate',
    validity: 'Today 18:00',
    status: 'ACTIVE',
  },
];

export default function CampusVehiclesPage() {
  const [vehicles, setVehicles] = useState<VehicleRecord[]>(INITIAL_VEHICLES);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Register vehicle modal state
  const [registerModalOpen, setRegisterModalOpen] = useState(false);
  const [newPlate, setNewPlate] = useState('');
  const [newType, setNewType] = useState('Four Wheeler');
  const [newMakeModel, setNewMakeModel] = useState('');
  const [newOwner, setNewOwner] = useState('');
  const [newPersonId, setNewPersonId] = useState('');
  const [newDepartment, setNewDepartment] = useState('Operations & Strategy');

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlate.trim() || !newOwner.trim()) return;

    const newRec: VehicleRecord = {
      id: `veh-${Date.now()}`,
      plate: newPlate.trim().toUpperCase(),
      type: newType,
      makeModel: newMakeModel.trim() || 'Standard Campus Vehicle',
      ownerName: newOwner.trim(),
      linkedPersonId: newPersonId.trim() || 'FAC-NEW',
      department: newDepartment,
      accessGroup: 'General Campus Access',
      validity: '31 Dec 2027',
      status: 'ACTIVE',
    };

    setVehicles([newRec, ...vehicles]);
    setRegisterModalOpen(false);
    setNewPlate('');
    setNewMakeModel('');
    setNewOwner('');
    setNewPersonId('');
  };

  const filtered = vehicles.filter((v) => {
    if (typeFilter && v.type.toLowerCase() !== typeFilter.toLowerCase()) return false;
    if (statusFilter && v.status.toLowerCase() !== statusFilter.toLowerCase()) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        v.plate.toLowerCase().includes(q) ||
        v.ownerName.toLowerCase().includes(q) ||
        v.linkedPersonId.toLowerCase().includes(q) ||
        v.makeModel.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const activeVehiclesCount = vehicles.filter((v) => v.status === 'ACTIVE').length;
  const expiredVehiclesCount = vehicles.filter((v) => v.status === 'EXPIRED').length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Page Title & Controls */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              Campus vehicles
            </h1>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#EBF0FF] text-[#2F5BFF]">
              Centralized Registry
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Registered campus vehicles and ANPR license plate mappings at IIM Sambalpur. Multiple vehicles can be linked to an authorized person.
          </p>
        </div>

        <button
          onClick={() => setRegisterModalOpen(true)}
          className="px-4 py-2 rounded-full text-xs font-semibold bg-[#2F5BFF] text-white hover:bg-[#254EDB] transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Register vehicle</span>
        </button>
      </div>

      {/* 5 Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#1FB36B]" />
            <span className="text-xs font-medium text-slate-700">Total registered</span>
          </div>
          <div className="my-3 text-2xl font-bold text-slate-900">{vehicles.length}</div>
          <p className="text-[11px] text-slate-500">IIM Sambalpur master vehicle roster</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#12B5A6]" />
            <span className="text-xs font-medium text-slate-700">Active authorization</span>
          </div>
          <div className="my-3 text-2xl font-bold text-slate-900">{activeVehiclesCount}</div>
          <p className="text-[11px] text-slate-500">Permitted through automatic barriers</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#C93338]" />
            <span className="text-xs font-medium text-slate-700">Expired permissions</span>
          </div>
          <div className="my-3 text-2xl font-bold text-slate-900">{expiredVehiclesCount}</div>
          <p className="text-[11px] text-slate-500">Access denied on gate terminal</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#2F5BFF]" />
            <span className="text-xs font-medium text-slate-700">ANPR OCR Accuracy</span>
          </div>
          <div className="my-3 text-2xl font-bold text-slate-900">99.4%</div>
          <p className="text-[11px] text-slate-500">Edge plate normalizer active</p>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by registration number, owner, or person ID"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-[#2F5BFF]"
          />
        </div>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-700 focus:outline-hidden focus:border-[#2F5BFF]"
        >
          <option value="">All Vehicle Types</option>
          <option value="Four Wheeler">Four Wheeler</option>
          <option value="Two Wheeler">Two Wheeler</option>
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-700 focus:outline-hidden focus:border-[#2F5BFF]"
        >
          <option value="">All Statuses</option>
          <option value="Active">Active</option>
          <option value="Expired">Expired</option>
        </select>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/60 border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                <th className="px-5 py-3">REGISTRATION NO.</th>
                <th className="px-5 py-3">MAKE & MODEL</th>
                <th className="px-5 py-3">TYPE</th>
                <th className="px-5 py-3">OWNER & LINKED PERSON</th>
                <th className="px-5 py-3">DEPARTMENT</th>
                <th className="px-5 py-3">VALIDITY</th>
                <th className="px-5 py-3">STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((veh) => (
                <tr key={veh.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-5 py-3.5 font-mono font-bold text-slate-900">
                    <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-100 border border-slate-200">
                      <Car className="w-3.5 h-3.5 text-[#2F5BFF]" />
                      <span>{veh.plate}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 font-medium text-slate-800">
                    {veh.makeModel}
                  </td>
                  <td className="px-5 py-3.5 text-slate-600">
                    {veh.type}
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="font-semibold text-slate-900">{veh.ownerName}</div>
                    <div className="font-mono text-[10px] text-slate-400">{veh.linkedPersonId}</div>
                  </td>
                  <td className="px-5 py-3.5 text-slate-600">
                    {veh.department}
                  </td>
                  <td className="px-5 py-3.5 text-slate-500 font-mono text-[11px]">
                    {veh.validity}
                  </td>
                  <td className="px-5 py-3.5">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        veh.status === 'ACTIVE'
                          ? 'bg-[#E6F8F0] text-[#1FB36B] border border-[#1FB36B]/30'
                          : 'bg-[#FDF2F2] text-[#C93338] border border-[#C93338]/30'
                      }`}
                    >
                      {veh.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-5 py-3.5 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 bg-white">
          <span>{filtered.length} vehicles registered in centralized database</span>
        </div>
      </div>

      {/* REGISTER VEHICLE MODAL */}
      {registerModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Car className="w-5 h-5 text-[#2F5BFF]" />
                <h3 className="font-bold text-base text-slate-900">Register New Campus Vehicle</h3>
              </div>
              <button
                type="button"
                onClick={() => setRegisterModalOpen(false)}
                className="p-1 rounded-full hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-4 h-4 text-slate-500" />
              </button>
            </div>

            <form onSubmit={handleRegisterSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  License Registration Number *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. OD-15-AB-9999"
                  value={newPlate}
                  onChange={(e) => setNewPlate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none font-mono uppercase focus:border-[#2F5BFF]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Vehicle Type
                  </label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value)}
                    className="w-full px-2 py-2 rounded-xl border border-slate-200 outline-none"
                  >
                    <option value="Four Wheeler">Four Wheeler</option>
                    <option value="Two Wheeler">Two Wheeler</option>
                    <option value="Bus">Campus Bus</option>
                    <option value="Commercial">Commercial / Vendor</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Make & Model
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Tata Nexon EV"
                    value={newMakeModel}
                    onChange={(e) => setNewMakeModel(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Owner Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dr. Ramesh Rao"
                    value={newOwner}
                    onChange={(e) => setNewOwner(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Linked Person ID
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. FAC-8099"
                    value={newPersonId}
                    onChange={(e) => setNewPersonId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none font-mono uppercase"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Department
                </label>
                <input
                  type="text"
                  placeholder="e.g. Information Technology & Analytics"
                  value={newDepartment}
                  onChange={(e) => setNewDepartment(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-full bg-[#2F5BFF] hover:bg-[#254cd6] text-white font-bold text-xs shadow-md transition-all cursor-pointer"
                >
                  Save Vehicle to Centralized Database
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
