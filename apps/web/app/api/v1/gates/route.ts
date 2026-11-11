import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json([
    {
      id: 'gate-01',
      gate_code: 'GATE-01',
      name: 'Main Ingress Post Alpha',
      gate_type: 'PEDESTRIAN',
      location: 'Admin Quad North',
      is_active: true,
      today_scans: 642,
      today_granted: 631,
      today_denied: 11,
    },
    {
      id: 'gate-02',
      gate_code: 'GATE-02',
      name: 'Executive & Faculty Barrier Beta',
      gate_type: 'VEHICLE',
      location: 'Perimeter West Highway',
      is_active: true,
      today_scans: 373,
      today_granted: 368,
      today_denied: 5,
    },
  ]);
}
