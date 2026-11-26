import { NextResponse } from 'next/server';
import { GuardPermissions } from '@/types';

let PERMISSIONS_STORE: Record<string, GuardPermissions> = {};

function isGuardCaller(request: Request): boolean {
  const authHeader = request.headers.get('authorization') || '';
  const roleHeader = request.headers.get('x-user-role') || '';
  return authHeader.toLowerCase().includes('guard') || roleHeader.toUpperCase() === 'SECURITY_GUARD';
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const guardId = searchParams.get('guard_id');

  // If guard requests ONLY their own permissions, allow narrow response; block full roster dump
  if (isGuardCaller(request)) {
    if (!guardId) {
      return NextResponse.json(
        { detail: 'Forbidden: Guards cannot enumerate all guard accounts.' },
        { status: 403 }
      );
    }
    const own = PERMISSIONS_STORE[guardId] || {
      guard_id: guardId,
      registration_mode: 'APPROVAL_REQUIRED',
      direct_record_policy: 'TEMPORARY_ONLY',
      can_submit_registration_requests: true,
      can_create_person_directly: false,
      can_register_vehicles: false,
      can_capture_upload_photos: true,
      can_edit_own_created_records: false,
      can_record_entry_exit: true,
      can_view_limited_history: true,
      updated_at: new Date().toISOString(),
    };
    return NextResponse.json({ success: true, data: own });
  }

  return NextResponse.json({
    success: true,
    data: Object.values(PERMISSIONS_STORE),
  });
}

export async function PATCH(request: Request) {
  if (isGuardCaller(request)) {
    return NextResponse.json(
      { detail: 'Access Denied: Only Administrators may configure guard permissions.' },
      { status: 403 }
    );
  }

  try {
    const body = await request.json();
    const { guard_id, ...patch } = body;
    if (!guard_id) {
      return NextResponse.json({ detail: 'guard_id is required' }, { status: 400 });
    }

    const prev: GuardPermissions = PERMISSIONS_STORE[guard_id] || {
      guard_id,
      registration_mode: 'APPROVAL_REQUIRED',
      direct_record_policy: 'TEMPORARY_ONLY',
      can_submit_registration_requests: true,
      can_create_person_directly: false,
      can_register_vehicles: false,
      can_capture_upload_photos: true,
      can_edit_own_created_records: false,
      can_record_entry_exit: true,
      can_view_limited_history: true,
      updated_at: new Date().toISOString(),
    };

    const next: GuardPermissions = {
      ...prev,
      ...patch,
      guard_id,
      updated_at: new Date().toISOString(),
    };
    PERMISSIONS_STORE[guard_id] = next;

    return NextResponse.json({ success: true, data: next });
  } catch (err: any) {
    return NextResponse.json({ detail: err.message || 'Invalid request' }, { status: 400 });
  }
}
