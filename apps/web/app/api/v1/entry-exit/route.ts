import { NextResponse } from 'next/server';
import crypto from 'crypto';

interface EntryExitLogRecord {
  id: string;
  event_type: 'ENTRY' | 'EXIT';
  person_id?: string;
  person_name?: string;
  vehicle_plate?: string;
  guard_id: string;
  guard_name: string;
  gate_id: string;
  gate_name: string;
  outcome: string;
  decision: 'GRANT_ENTRY' | 'DENY_ENTRY' | 'RECORD_EXIT' | 'ESCALATED';
  confidence_score?: number;
  cryptographic_signature: string;
  timestamp: string;
}

let ENTRY_EXIT_STORE: EntryExitLogRecord[] = [
  {
    id: 'evt-20261126-001',
    event_type: 'ENTRY',
    person_id: 'FAC-8041',
    person_name: 'Dr. Rahul Sharma',
    vehicle_plate: 'OD-15-AB-1234',
    guard_id: 'GRD-101',
    guard_name: 'Vikram Singh',
    gate_id: 'gate-01',
    gate_name: 'Main Gate 01',
    outcome: 'CASE_1_VERIFIED',
    decision: 'GRANT_ENTRY',
    confidence_score: 0.984,
    cryptographic_signature: 'hmac-sha256-iim-9a2c1b48f0e38192a82174c8',
    timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
  },
  {
    id: 'evt-20261126-002',
    event_type: 'ENTRY',
    person_id: 'STU-2024-089',
    person_name: 'Rahul Verma',
    vehicle_plate: 'OD-15-M-4012',
    guard_id: 'GRD-102',
    guard_name: 'Manoj Kumar',
    gate_id: 'gate-02',
    gate_name: 'Academic Core Gate 02',
    outcome: 'CASE_1_VERIFIED',
    decision: 'GRANT_ENTRY',
    confidence_score: 0.962,
    cryptographic_signature: 'hmac-sha256-iim-4c7d8e90a1b892a019482fa1',
    timestamp: new Date(Date.now() - 1000 * 60 * 18).toISOString(),
  },
];

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50', 10);
    const eventType = searchParams.get('type');

    let logs = [...ENTRY_EXIT_STORE];
    if (eventType) {
      logs = logs.filter((l) => l.event_type === eventType.toUpperCase());
    }

    return NextResponse.json({
      success: true,
      total: logs.length,
      data: logs.slice(0, limit),
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, detail: error.message || 'Failed to fetch entry/exit logs' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      event_type = 'ENTRY',
      person_id,
      person_name = 'Subject',
      vehicle_plate,
      guard_id = 'GRD-101',
      guard_name = 'Vikram Singh',
      gate_id = 'gate-01',
      gate_name = 'Main Gate 01',
      outcome = 'CASE_1_VERIFIED',
      decision = 'GRANT_ENTRY',
      confidence_score = 0.98,
    } = body;

    const timestamp = new Date().toISOString();
    const payloadToSign = `${timestamp}:${gate_id}:${guard_id}:${person_id || 'NONE'}:${vehicle_plate || 'NONE'}:${decision}`;
    const hmacSecret = process.env.HMAC_SIGNING_SECRET || 'iim-sambalpur-secure-gate-ledger';
    const signature = crypto.createHmac('sha256', hmacSecret).update(payloadToSign).digest('hex');

    const newRecord: EntryExitLogRecord = {
      id: `evt-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      event_type,
      person_id,
      person_name,
      vehicle_plate,
      guard_id,
      guard_name,
      gate_id,
      gate_name,
      outcome,
      decision,
      confidence_score,
      cryptographic_signature: `hmac-sha256-iim-${signature.substring(0, 24)}`,
      timestamp,
    };

    ENTRY_EXIT_STORE = [newRecord, ...ENTRY_EXIT_STORE];

    return NextResponse.json(
      {
        success: true,
        message: `${event_type} recorded successfully and cryptographically sealed.`,
        data: newRecord,
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, detail: error.message || 'Failed to record entry/exit' },
      { status: 500 }
    );
  }
}
