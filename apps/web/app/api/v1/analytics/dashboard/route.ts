import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  // If upstream backend is specified, try to fetch from it
  const backendUrl = process.env.INTERNAL_BACKEND_URL;
  if (backendUrl) {
    try {
      const res = await fetch(`${backendUrl}/api/v1/analytics/dashboard`, {
        headers: { Accept: 'application/json' },
      });
      if (res.ok) {
        return NextResponse.json(await res.json());
      }
    } catch (e) {
      // Fallback
    }
  }

  return NextResponse.json({
    total_scans_today: 0,
    auto_verified_percentage: 0,
    total_exceptions_today: 0,
    pending_enrollment_referrals: 0,
    active_gates_count: 0,
    active_visitors_on_campus: 0,
    mean_verification_latency_ms: 0,
    gates: [],
    hourly_traffic: [],
  });
}
