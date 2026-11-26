import { NextResponse } from 'next/server';

let serverVisitors: any[] = [];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');
  if (status) {
    return NextResponse.json(serverVisitors.filter((v) => v.status === status));
  }
  return NextResponse.json(serverVisitors);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newVisitor = {
      id: `vis-${Date.now()}`,
      pass_code: `IIM-VP-${Math.floor(1000 + Math.random() * 9000)}`,
      visitor_name: body.visitor_name,
      phone: body.phone,
      id_type: body.id_type || 'Government ID',
      id_number: body.id_number || 'ID-VERIFIED',
      host_name: body.host_name,
      host_department: body.host_department,
      purpose: body.purpose,
      valid_date: body.valid_date || new Date().toISOString().split('T')[0],
      valid_until_time: body.valid_until_time || '18:00',
      status: 'EXPECTED',
      gate_id: body.gate_id || 'gate-01',
      created_at: new Date().toISOString(),
    };
    serverVisitors = [newVisitor, ...serverVisitors];
    return NextResponse.json({ success: true, visitor: newVisitor }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ success: false, error: 'Invalid payload' }, { status: 400 });
  }
}
