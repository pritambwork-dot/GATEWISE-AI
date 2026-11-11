import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json([
    {
      id: 'n-1',
      type: 'ENROLLMENT',
      title: 'New Field Referral',
      message: 'Officer submitted referral for visitor at Main Gate.',
      severity: 'WARNING',
      timestamp: new Date().toISOString(),
      target_url: '/admin/enrollment',
      is_read: false,
    },
    {
      id: 'n-2',
      type: 'DRIVE_SYNC',
      title: 'Drive Sync Operational',
      message: 'Approved reference photo repository verified.',
      severity: 'INFO',
      timestamp: new Date().toISOString(),
      target_url: '/admin/repository',
      is_read: true,
    },
  ]);
}
