import { NextResponse } from 'next/server';

let serverVisitors = [
  {
    id: 'vis-01',
    pass_code: 'IIM-VP-4821',
    visitor_name: 'Amitabh Sengupta',
    phone: '+91 98301 22891',
    id_type: 'Aadhaar Card',
    id_number: '•••• •••• 9812',
    host_name: 'Prof. Mahadeo Jaiswal (Director)',
    host_department: 'Directorate, IIM Sambalpur',
    purpose: 'Academic Advisory Board Meeting',
    valid_date: new Date().toISOString().split('T')[0],
    valid_until_time: '18:00',
    status: 'EXPECTED',
    gate_id: 'gate-01',
    created_at: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
  },
  {
    id: 'vis-02',
    pass_code: 'IIM-VP-4822',
    visitor_name: 'Priyanka Nambiar',
    phone: '+91 94370 11204',
    id_type: 'PAN Card',
    id_number: 'ABCDE1234F',
    host_name: 'Dr. Ananya Sharma',
    host_department: 'Strategic Management',
    purpose: 'Executive Research Workshop',
    valid_date: new Date().toISOString().split('T')[0],
    valid_until_time: '17:30',
    status: 'CHECKED_IN',
    check_in_at: new Date(Date.now() - 1000 * 60 * 40).toISOString(),
    check_in_time: '10:15 AM',
    gate_id: 'gate-01',
    created_at: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
  },
  {
    id: 'vis-03',
    pass_code: 'IIM-VP-4823',
    visitor_name: 'Kavita Das',
    phone: '+91 97760 88210',
    id_type: 'Driving License',
    id_number: 'OD-15-2019-0091',
    host_name: 'Campus Infrastructure Dept',
    host_department: 'Estate & Operations',
    purpose: 'Fiber Optic Perimeter Audit',
    valid_date: new Date().toISOString().split('T')[0],
    valid_until_time: '16:00',
    status: 'CHECKED_OUT',
    check_in_at: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    check_in_time: '08:00 AM',
    check_out_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    check_out_time: '10:30 AM',
    gate_id: 'gate-02',
    created_at: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
  },
];

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
