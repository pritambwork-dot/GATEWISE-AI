import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  return NextResponse.json({
    id: 'user-admin-001',
    employee_id: 'ADM-001',
    email: 'admin.security@iimsambalpur.ac.in',
    full_name: 'Dr. Rajesh Iyer',
    role: 'ADMIN',
    account_status: 'ACTIVE',
    avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    mfa_enabled: true,
    assigned_gate: null,
  });
}
