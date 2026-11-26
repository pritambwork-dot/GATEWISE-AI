import { NextResponse } from 'next/server';

// Server-side in-memory event buffer (starts empty until real terminal events arrive)
let serverEvents: any[] = [];

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
