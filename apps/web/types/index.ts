export interface GateStatus {
  id: string;
  name: string;
  code: string;
  location: string;
  status: 'ACTIVE' | 'MAINTENANCE' | 'OFFLINE';
  active_guard_name?: string;
  active_guard_employee_id?: string;
  today_scans_count: number;
  today_verified_count: number;
  today_denied_count: number;
  last_event_time?: string;
}

export interface HourlyTraffic {
  hour: string;
  verified_entries: number;
  denied_entries: number;
  visitors_registered: number;
}

export interface DashboardMetrics {
  active_gates_count: number;
  total_scans_today: number;
  auto_verified_percentage: number;
  total_exceptions_today: number;
  active_visitors_on_campus: number;
  pending_enrollment_referrals: number;
  system_health_status: 'HEALTHY' | 'DEGRADED' | 'OFFLINE';
  drive_sync_last_status: string;
  drive_sync_last_time?: string;
  drive_identities_count: number;
  gates: GateStatus[];
  hourly_traffic: HourlyTraffic[];
}

export interface VerificationEvent {
  id: string;
  timestamp: string;
  gate_id: string;
  gate_name: string;
  guard_id: string;
  guard_name: string;
  person_id?: string;
  person_name?: string;
  person_category?: string;
  outcome: string;
  guard_decision: string;
  similarity_score?: number;
  decision_reason?: string;
  cryptographic_signature: string;
  sync_status: string;
}

export interface InstitutionalIdentity {
  id: string;
  person_id: string;
  full_name: string;
  category: string;
  department: string;
  email?: string;
  phone?: string;
  valid_from: string;
  valid_until: string;
  clearance_level: string;
  is_active: boolean;
  reference_photos: Array<{
    id: string;
    file_name: string;
    file_path: string;
    checksum: string;
    is_approved: boolean;
  }>;
}

export interface VisitorPass {
  id: string;
  pass_code: string;
  visitor_name: string;
  phone: string;
  id_type: string;
  id_number: string;
  host_name: string;
  host_department: string;
  purpose: string;
  valid_date: string;
  valid_until_time: string;
  status: 'EXPECTED' | 'CHECKED_IN' | 'CHECKED_OUT' | 'EXPIRED';
  check_in_time?: string;
  check_out_time?: string;
}

export interface EnrollmentReferral {
  id: string;
  person_name: string;
  proposed_category: string;
  department: string;
  captured_image_path: string;
  submitted_by_guard_id: string;
  gate_id: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  admin_notes?: string;
  submitted_at: string;
  reviewed_at?: string;
  reviewed_by?: string;
}
