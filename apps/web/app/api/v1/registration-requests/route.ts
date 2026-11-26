import { NextResponse } from 'next/server';

interface RegistrationRequestRecord {
  id: string;
  request_code: string;
  submitted_by_guard_id: string;
  submitted_by_guard_name: string;
  full_name: string;
  phone?: string;
  category: 'Visitor' | 'Contractor' | 'VIP' | 'Delivery' | 'Temporary Staff';
  purpose: string;
  expected_duration: string;
  face_photo_url?: string;
  vehicle_plate?: string;
  vehicle_photo_url?: string;
  additional_notes?: string;
  status: 'PENDING_APPROVAL' | 'APPROVED' | 'REJECTED' | 'ADDITIONAL_INFO_REQUIRED';
  reviewed_by_admin_id?: string;
  review_notes?: string;
  submitted_at: string;
  reviewed_at?: string;
}

// In-memory persistent store initialized with sample seed
let REQUESTS_STORE: RegistrationRequestRecord[] = [
  {
    id: 'req-2026-001',
    request_code: 'REQ-2026-0041',
    submitted_by_guard_id: 'GRD-101',
    submitted_by_guard_name: 'Officer Vikram Singh',
    full_name: 'Alok Verma',
    phone: '+91 98450 11200',
    category: 'Visitor',
    purpose: 'Academic Advisory Board Consultation',
    expected_duration: 'Full Day',
    face_photo_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    vehicle_plate: 'OD-15-X-3321',
    vehicle_photo_url: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=200&auto=format&fit=crop&q=80',
    additional_notes: 'Host: Dean Academics Dr. Ananya Sharma. Arrived at Main Gate 01.',
    status: 'PENDING_APPROVAL',
    submitted_at: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
  },
  {
    id: 'req-2026-002',
    request_code: 'REQ-2026-0042',
    submitted_by_guard_id: 'GRD-102',
    submitted_by_guard_name: 'Officer Manoj Kumar',
    full_name: 'Prakash Jena',
    phone: '+91 94371 88921',
    category: 'Contractor',
    purpose: 'Solar Grid Inverter Maintenance',
    expected_duration: '3 Days',
    face_photo_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    vehicle_plate: 'OD-02-B-9988',
    additional_notes: 'Estate Department approved vendor schedule.',
    status: 'APPROVED',
    reviewed_by_admin_id: 'ADM-001',
    review_notes: 'Verified against Estate Directorate work order #EO-4412.',
    submitted_at: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    reviewed_at: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
  },
];

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    let results = [...REQUESTS_STORE];
    if (status && status !== 'all') {
      results = results.filter((r) => r.status.toLowerCase() === status.toLowerCase());
    }

    return NextResponse.json({
      success: true,
      total: results.length,
      data: results,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, detail: error.message || 'Failed to list requests' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      full_name,
      phone,
      category = 'Visitor',
      purpose = 'Campus Visit',
      expected_duration = 'Full Day',
      face_photo_url,
      vehicle_plate,
      vehicle_photo_url,
      additional_notes,
      guard_id = 'GRD-101',
      guard_name = 'Vikram Singh',
    } = body;

    if (!full_name || !full_name.trim()) {
      return NextResponse.json(
        { success: false, detail: 'Full name is required for registration request' },
        { status: 400 }
      );
    }

    const newRequest: RegistrationRequestRecord = {
      id: `req-${Date.now()}`,
      request_code: `REQ-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      submitted_by_guard_id: guard_id,
      submitted_by_guard_name: guard_name,
      full_name: full_name.trim(),
      phone: phone?.trim(),
      category,
      purpose,
      expected_duration,
      face_photo_url,
      vehicle_plate: vehicle_plate ? vehicle_plate.trim().toUpperCase() : undefined,
      vehicle_photo_url,
      additional_notes,
      status: 'PENDING_APPROVAL',
      submitted_at: new Date().toISOString(),
    };

    REQUESTS_STORE = [newRequest, ...REQUESTS_STORE];

    return NextResponse.json(
      {
        success: true,
        message: 'Registration request submitted for administrator approval',
        data: newRequest,
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, detail: error.message || 'Failed to submit registration request' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, status, review_notes, admin_id = 'ADM-001' } = body;

    if (!id || !status) {
      return NextResponse.json(
        { success: false, detail: 'id and status are required' },
        { status: 400 }
      );
    }

    const targetIndex = REQUESTS_STORE.findIndex((r) => r.id === id);
    if (targetIndex === -1) {
      return NextResponse.json(
        { success: false, detail: `Registration request ${id} not found` },
        { status: 404 }
      );
    }

    const updated: RegistrationRequestRecord = {
      ...REQUESTS_STORE[targetIndex],
      status,
      review_notes: review_notes || REQUESTS_STORE[targetIndex].review_notes,
      reviewed_by_admin_id: admin_id,
      reviewed_at: new Date().toISOString(),
    };

    REQUESTS_STORE[targetIndex] = updated;

    return NextResponse.json({
      success: true,
      message: `Request ${updated.request_code} updated to ${status}`,
      data: updated,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, detail: error.message || 'Failed to update request' },
      { status: 500 }
    );
  }
}
