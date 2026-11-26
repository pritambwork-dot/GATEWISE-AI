import { NextResponse } from 'next/server';

// Server-side in-memory event buffer (persists across requests during server lifetime)
let serverEvents = [
  {
    id: 'evt-101',
    event_timestamp: new Date().toISOString(),
    gate_id: 'gate-01',
    gate_name: 'Main Gate 01',
    person_id: 'FAC-8041',
    person_name: 'Dr. Ananya Sharma',
    person_category: 'FACULTY',
    decision: 'GRANTED',
    confidence_score: 0.988,
    latency_ms: 128,
    actor_guard_id: 'GRD-101',
    guard_name: 'Vikram Singh',
    match_type: 'ON_DEVICE_EDGE',
    hmac_signature: '7a8f90bc12...49e1',
  },
  {
    id: 'evt-102',
    event_timestamp: new Date(Date.now() - 45000).toISOString(),
    gate_id: 'gate-02',
    gate_name: 'Academic Core Gate 02',
    person_id: 'STU-2024-089',
    person_name: 'Rahul Verma',
    person_category: 'STUDENT',
    decision: 'GRANTED',
    confidence_score: 0.974,
    latency_ms: 142,
    actor_guard_id: 'GRD-102',
    guard_name: 'Manoj Kumar',
    match_type: 'ON_DEVICE_EDGE',
    hmac_signature: '3b1c89fe45...20d9',
  },
  {
    id: 'evt-103',
    event_timestamp: new Date(Date.now() - 95000).toISOString(),
    gate_id: 'gate-01',
    gate_name: 'Main Gate 01',
    person_id: 'VIS-2024-031',
    person_name: 'Raghavan Iyer',
    person_category: 'VISITOR',
    decision: 'GRANTED',
    confidence_score: 0.962,
    latency_ms: 156,
    actor_guard_id: 'GRD-101',
    guard_name: 'Vikram Singh',
    match_type: 'PASS_VERIFIED',
    hmac_signature: '9e4a123f88...77a1',
  },
  {
    id: 'evt-104',
    event_timestamp: new Date(Date.now() - 150000).toISOString(),
    gate_id: 'gate-03',
    gate_name: 'Executive Housing Gate',
    person_id: 'UNK-9102',
    person_name: 'Unrecognized Subject',
    person_category: 'UNKNOWN',
    decision: 'FLAGGED_MANUAL',
    confidence_score: 0.312,
    latency_ms: 139,
    actor_guard_id: 'GRD-103',
    guard_name: 'Sunil Pradhan',
    match_type: 'REFERRAL_REQUIRED',
    hmac_signature: '1c09ab82de...ff34',
  },
];

export async function GET(request: Request) {
  const backendUrl = process.env.INTERNAL_BACKEND_URL;
  if (backendUrl) {
    try {
      const { search } = new URL(request.url);
      const res = await fetch(`${backendUrl}/api/v1/verification/events${search}`, {
        headers: { Accept: 'application/json' },
      });
      if (res.ok) {
        return NextResponse.json(await res.json());
      }
    } catch (e) {
      // Fallback to local server buffer
    }
  }

  return NextResponse.json(serverEvents);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const event = {
      id: body.id || `evt-${Date.now()}`,
      event_timestamp: body.timestamp || new Date().toISOString(),
      gate_id: body.gate_id || 'gate-01',
      gate_name: body.gate_name || 'Main Gate 01',
      person_id: body.person_id || 'TEMP-ID',
      person_name: body.person_name || 'Verified Subject',
      person_category: (body.person_category || 'IDENTITY').toUpperCase(),
      decision: body.guard_decision === 'GRANT_ENTRY' || body.outcome === 'VERIFIED_AUTHORIZED' ? 'GRANTED' : 'DENIED',
      confidence_score: body.similarity_score ?? 0.98,
      latency_ms: Math.floor(90 + Math.random() * 80),
      actor_guard_id: body.guard_id || 'GRD-101',
      guard_name: body.guard_name || 'Vikram Singh',
      match_type: 'ON_DEVICE_EDGE',
      hmac_signature: body.cryptographic_signature || 'hmac-sha256-edge',
    };

    serverEvents = [event, ...serverEvents.slice(0, 49)];
    return NextResponse.json({ success: true, event }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ success: false, error: 'Invalid payload' }, { status: 400 });
  }
}
