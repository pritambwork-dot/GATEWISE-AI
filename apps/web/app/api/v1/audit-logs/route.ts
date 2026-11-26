import { NextResponse } from 'next/server';

let AUDIT_STORE: any[] = [];

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization') || '';
  if (authHeader.toLowerCase().includes('guard')) {
    return NextResponse.json(
      { detail: 'Forbidden: Guards cannot access administrative audit trails.' },
      { status: 403 }
    );
  }
  return NextResponse.json({ success: true, total: AUDIT_STORE.length, data: AUDIT_STORE });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const entry = {
      id: `aud-${Date.now()}`,
      timestamp: new Date().toISOString(),
      ...body,
    };
    AUDIT_STORE = [entry, ...AUDIT_STORE.slice(0, 199)];
    return NextResponse.json({ success: true, data: entry }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ detail: err.message }, { status: 400 });
  }
}
