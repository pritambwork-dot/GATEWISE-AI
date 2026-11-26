import { NextResponse } from 'next/server';

interface PersonEntry {
  id: string;
  person_code: string;
  full_name: string;
  category: 'Faculty' | 'Student' | 'Staff' | 'Contractor' | 'Visitor' | 'VIP';
  department: string;
  designation?: string;
  email?: string;
  phone?: string;
  photo_url: string;
  account_status: 'ACTIVE' | 'SUSPENDED' | 'EXPIRED';
  registration_date: string;
  valid_until: string;
  associated_vehicles: Array<{
    license_plate: string;
    vehicle_type: string;
    make_model: string;
    is_authorized: boolean;
  }>;
}

let PERSONS_STORE: PersonEntry[] = [
  {
    id: 'per-001',
    person_code: 'FAC-8041',
    full_name: 'Dr. Rahul Sharma',
    category: 'Faculty',
    department: 'Operations & Strategy',
    designation: 'Associate Professor',
    email: 'rahul.sharma@iimsambalpur.ac.in',
    phone: '+91 94370 22100',
    photo_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    account_status: 'ACTIVE',
    registration_date: '2023-07-15T09:00:00Z',
    valid_until: '2028-06-30T23:59:59Z',
    associated_vehicles: [
      {
        license_plate: 'OD-15-AB-1234',
        vehicle_type: 'Car',
        make_model: 'Tata Safari XZA+',
        is_authorized: true,
      },
    ],
  },
  {
    id: 'per-002',
    person_code: 'FAC-8042',
    full_name: 'Dr. Ananya Sharma',
    category: 'Faculty',
    department: 'Dean Academics',
    designation: 'Professor & Dean',
    email: 'ananya.sharma@iimsambalpur.ac.in',
    phone: '+91 94370 55122',
    photo_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    account_status: 'ACTIVE',
    registration_date: '2022-08-01T09:00:00Z',
    valid_until: '2027-07-31T23:59:59Z',
    associated_vehicles: [
      {
        license_plate: 'OD-15-K-5521',
        vehicle_type: 'Car',
        make_model: 'Honda City ZX',
        is_authorized: true,
      },
    ],
  },
  {
    id: 'per-003',
    person_code: 'STU-2024-089',
    full_name: 'Rahul Verma',
    category: 'Student',
    department: 'MBA 2024-26',
    designation: 'MBA Scholar',
    email: 'rahul.v24@iimsambalpur.ac.in',
    phone: '+91 98301 44510',
    photo_url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80',
    account_status: 'ACTIVE',
    registration_date: '2024-06-20T09:00:00Z',
    valid_until: '2026-05-31T23:59:59Z',
    associated_vehicles: [
      {
        license_plate: 'OD-15-M-4012',
        vehicle_type: 'Two-Wheeler',
        make_model: 'Yamaha FZ-S V4',
        is_authorized: true,
      },
    ],
  },
];

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('authorization') || '';
    // RBAC: Check if request is attempting guard role access to master database
    if (authHeader.toLowerCase().includes('guard')) {
      return NextResponse.json(
        { detail: 'Access Denied: Guards cannot browse the master registered-person database.' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');

    let list = [...PERSONS_STORE];
    if (category && category !== 'all') {
      list = list.filter((p) => p.category.toLowerCase() === category.toLowerCase());
    }
    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (p) =>
          p.full_name.toLowerCase().includes(q) ||
          p.person_code.toLowerCase().includes(q) ||
          p.department.toLowerCase().includes(q)
      );
    }

    return NextResponse.json({
      success: true,
      total: list.length,
      data: list,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, detail: error.message || 'Failed to list persons' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      full_name,
      category = 'Visitor',
      department = 'General Campus',
      designation,
      email,
      phone,
      photo_url = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
      valid_until = new Date(Date.now() + 1000 * 60 * 60 * 24 * 365).toISOString(),
      associated_vehicles = [],
    } = body;

    if (!full_name || !full_name.trim()) {
      return NextResponse.json(
        { success: false, detail: 'full_name is required' },
        { status: 400 }
      );
    }

    const personCode = `${category.substring(0, 3).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newPerson: PersonEntry = {
      id: `per-${Date.now()}`,
      person_code: personCode,
      full_name: full_name.trim(),
      category,
      department,
      designation,
      email,
      phone,
      photo_url,
      account_status: 'ACTIVE',
      registration_date: new Date().toISOString(),
      valid_until,
      associated_vehicles,
    };

    PERSONS_STORE = [newPerson, ...PERSONS_STORE];

    return NextResponse.json(
      {
        success: true,
        message: `Registered ${newPerson.full_name} (${personCode}) in master database`,
        data: newPerson,
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, detail: error.message || 'Failed to create person' },
      { status: 500 }
    );
  }
}
