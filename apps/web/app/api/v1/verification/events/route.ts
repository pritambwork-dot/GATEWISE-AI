import { NextResponse } from 'next/server';

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
      // Fallback
    }
  }

  const events = [
    {
      id: 'evt-101',
      event_timestamp: new Date().toISOString(),
      gate_id: 'gate-01',
      gate_name: 'Main Ingress Post Alpha',
      person_id: 'FAC-2024-089',
      person_name: 'Prof. Ananya Sen',
      person_category: 'FACULTY',
      decision: 'GRANTED',
      confidence_score: 0.988,
      latency_ms: 128,
      actor_guard_id: 'GRD-102',
      guard_name: 'Officer Rajesh Verma',
      match_type: 'ON_DEVICE_EDGE',
      hmac_signature: '7a8f90bc12...49e1',
    },
    {
      id: 'evt-102',
      event_timestamp: new Date(Date.now() - 45000).toISOString(),
      gate_id: 'gate-01',
      gate_name: 'Main Ingress Post Alpha',
      person_id: 'STU-2023-412',
      person_name: 'Marcus Vance',
      person_category: 'STUDENT',
      decision: 'GRANTED',
      confidence_score: 0.974,
      latency_ms: 142,
      actor_guard_id: 'GRD-102',
      guard_name: 'Officer Rajesh Verma',
      match_type: 'ON_DEVICE_EDGE',
      hmac_signature: '3b1c89fe45...20d9',
    },
    {
      id: 'evt-103',
      event_timestamp: new Date(Date.now() - 95000).toISOString(),
      gate_id: 'gate-02',
      gate_name: 'Executive & Faculty Barrier Beta',
      person_id: 'VIS-2024-042',
      person_name: 'Sunil Rao',
      person_category: 'VISITOR',
      decision: 'GRANTED',
      confidence_score: 0.962,
      latency_ms: 156,
      actor_guard_id: 'GRD-105',
      guard_name: 'Officer Meera Patel',
      match_type: 'PASS_VERIFIED',
      hmac_signature: '9e4a123f88...77a1',
    },
    {
      id: 'evt-104',
      event_timestamp: new Date(Date.now() - 150000).toISOString(),
      gate_id: 'gate-01',
      gate_name: 'Main Ingress Post Alpha',
      person_id: 'UNK-009',
      person_name: 'Unrecognized Subject',
      person_category: 'UNKNOWN',
      decision: 'FLAGGED_MANUAL',
      confidence_score: 0.482,
      latency_ms: 139,
      actor_guard_id: 'GRD-102',
      guard_name: 'Officer Rajesh Verma',
      match_type: 'REFERRAL_REQUIRED',
      hmac_signature: '1c09ab82de...ff34',
    },
  ];

  return NextResponse.json(events);
}
