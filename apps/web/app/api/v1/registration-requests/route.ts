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

// In-memory store (starts clean with zero demo records)
let REQUESTS_STORE: RegistrationRequestRecord[] = [];

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
