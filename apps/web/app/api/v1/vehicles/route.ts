import { NextResponse } from 'next/server';

interface VehicleEntry {
  id: string;
  license_plate: string;
  normalized_plate: string;
  vehicle_type: 'Car' | 'Two-Wheeler' | 'Bus' | 'Commercial' | 'Emergency';
  make_model: string;
  color: string;
  owner_id?: string;
  owner_name: string;
  is_authorized: boolean;
  registration_date: string;
}

let VEHICLES_STORE: VehicleEntry[] = [
  {
    id: 'veh-001',
    license_plate: 'OD-15-AB-1234',
    normalized_plate: 'OD15AB1234',
    vehicle_type: 'Car',
    make_model: 'Tata Safari XZA+',
    color: 'Orcus White',
    owner_id: 'per-001',
    owner_name: 'Dr. Rahul Sharma (Faculty)',
    is_authorized: true,
    registration_date: '2023-07-20T10:00:00Z',
  },
  {
    id: 'veh-002',
    license_plate: 'OD-15-K-5521',
    normalized_plate: 'OD15K5521',
    vehicle_type: 'Car',
    make_model: 'Honda City ZX',
    color: 'Lunar Silver',
    owner_id: 'per-002',
    owner_name: 'Dr. Ananya Sharma (Dean Academics)',
    is_authorized: true,
    registration_date: '2022-08-10T11:00:00Z',
  },
  {
    id: 'veh-003',
    license_plate: 'OD-15-M-4012',
    normalized_plate: 'OD15M4012',
    vehicle_type: 'Two-Wheeler',
    make_model: 'Yamaha FZ-S V4',
    color: 'Racing Blue',
    owner_id: 'per-003',
    owner_name: 'Rahul Verma (Student)',
    is_authorized: true,
    registration_date: '2024-06-25T14:30:00Z',
  },
];

function normalizePlate(plate: string): string {
  return plate.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
}

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('authorization') || '';
    if (authHeader.toLowerCase().includes('guard')) {
      return NextResponse.json(
        { detail: 'Access Denied: Guards cannot browse the master vehicle database.' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const type = searchParams.get('type');

    let list = [...VEHICLES_STORE];
    if (type && type !== 'all') {
      list = list.filter((v) => v.vehicle_type.toLowerCase() === type.toLowerCase());
    }
    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (v) =>
          v.license_plate.toLowerCase().includes(q) ||
          v.owner_name.toLowerCase().includes(q) ||
          v.make_model.toLowerCase().includes(q)
      );
    }

    return NextResponse.json({
      success: true,
      total: list.length,
      data: list,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, detail: error.message || 'Failed to list vehicles' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      license_plate,
      vehicle_type = 'Car',
      make_model = 'Standard Vehicle',
      color = 'White',
      owner_id,
      owner_name = 'Campus Resident',
      is_authorized = true,
    } = body;

    if (!license_plate || !license_plate.trim()) {
      return NextResponse.json(
        { success: false, detail: 'license_plate is required' },
        { status: 400 }
      );
    }

    const normalized = normalizePlate(license_plate);

    const newVehicle: VehicleEntry = {
      id: `veh-${Date.now()}`,
      license_plate: license_plate.trim().toUpperCase(),
      normalized_plate: normalized,
      vehicle_type,
      make_model,
      color,
      owner_id,
      owner_name,
      is_authorized,
      registration_date: new Date().toISOString(),
    };

    VEHICLES_STORE = [newVehicle, ...VEHICLES_STORE];

    return NextResponse.json(
      {
        success: true,
        message: `Registered vehicle ${newVehicle.license_plate} for ${owner_name}`,
        data: newVehicle,
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, detail: error.message || 'Failed to register vehicle' },
      { status: 500 }
    );
  }
}
