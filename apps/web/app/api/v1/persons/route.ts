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

let PERSONS_STORE: PersonEntry[] = [];

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
    const authHeader = request.headers.get('authorization') || '';
    const isGuard = authHeader.toLowerCase().includes('guard');
    const body = await request.json();

    if (isGuard && body.direct_permission_verified !== true) {
      return NextResponse.json(
        { success: false, detail: 'Forbidden: Guard requires Admin Direct Registration Permission.' },
        { status: 403 }
      );
    }

    const {
      full_name,
      category = 'Visitor',
      department = 'General Campus',
      designation,
      email,
      phone,
      photo_url = '',
      valid_until = new Date(Date.now() + 1000 * 60 * 60 * 24 * 365).toISOString(),
      associated_vehicles = [],
      account_status = 'ACTIVE',
      creation_source = isGuard ? 'GUARD_CREATED' : 'ADMIN_CREATED',
    } = body;

    if (!full_name || !full_name.trim()) {
      return NextResponse.json(
        { success: false, detail: 'full_name is required' },
        { status: 400 }
      );
    }

    const personCode = `PER-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const newPerson: any = {
      id: `per-${Date.now()}`,
      person_code: personCode,
      full_name: full_name.trim(),
      category,
      department,
      designation,
      email,
      phone,
      photo_url,
      account_status,
      creation_source,
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

export async function PATCH(request: Request) {
  const authHeader = request.headers.get('authorization') || '';
  if (authHeader.toLowerCase().includes('guard')) {
    return NextResponse.json({ detail: 'Forbidden: Guards cannot modify master database records.' }, { status: 403 });
  }
  const body = await request.json();
  const { id, ...patch } = body;
  PERSONS_STORE = PERSONS_STORE.map((p) => (p.id === id || p.person_code === id ? { ...p, ...patch } : p));
  return NextResponse.json({ success: true });
}

export async function DELETE(request: Request) {
  const authHeader = request.headers.get('authorization') || '';
  if (authHeader.toLowerCase().includes('guard')) {
    return NextResponse.json({ detail: 'Forbidden: Guards cannot delete records.' }, { status: 403 });
  }
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  PERSONS_STORE = PERSONS_STORE.filter((p) => p.id !== id && p.person_code !== id);
  return NextResponse.json({ success: true });
}
