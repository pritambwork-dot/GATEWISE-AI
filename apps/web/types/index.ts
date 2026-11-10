export interface GateStatus {
  id: string;
  name: string;
  code: string;
  location: string;
  status: 'ACTIVE' | 'MAINTENANCE' | 'OFFLINE';
  operating_hours?: string;
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
  outcome: string; // VERIFIED_AUTHORIZED, IDENTIFIED_UNAUTHORIZED, POTENTIAL_MATCH, UNKNOWN_PERSON, IMAGE_QUALITY_INSUFFICIENT, ACCESS_DENIED
  guard_decision: string; // PENDING, GRANT_ENTRY, DENY_ENTRY, ESCALATE_TO_ADMIN, REFER_TO_VISITOR_DESK
  similarity_score?: number;
  decision_reason?: string;
  cryptographic_signature: string;
  sync_status: string;
  candidate?: {
    identity_id: string;
    person_name: string;
    person_id: string;
    category: string;
    department: string;
    reference_photo_url: string;
    similarity_score: number;
  };
  authorization?: {
    is_authorized: boolean;
    clearance_level: string;
    valid_from: string;
    valid_until: string;
    permitted_gates: string[];
    restriction_reason?: string;
  };
}

export interface InstitutionalIdentity {
  id: string;
  institutional_id: string;
  person_id: string;
  full_name: string;
  category: string;
  department: string;
  designation?: string;
  email?: string;
  phone?: string;
  identity_status: 'ACTIVE' | 'GRADUATED' | 'SUSPENDED' | 'DEACTIVATED';
  reference_photos: Array<{
    id: string;
    drive_file_id?: string;
    file_checksum?: string;
    checksum?: string;
    review_status?: string;
    source?: string;
    is_approved?: boolean;
    created_at?: string;
  }>;
  access_authorizations?: Array<{
    id: string;
    access_status: 'AUTHORIZED' | 'EXPIRED' | 'SUSPENDED' | 'REVOKED';
    valid_from?: string;
    valid_until?: string;
    permitted_zones?: string[];
    restrictions?: string;
  }>;
  created_at?: string;
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
  status: 'EXPECTED' | 'CHECKED_IN' | 'CHECKED_OUT' | 'EXPIRED' | 'REJECTED';
  check_in_at?: string;
  check_out_at?: string;
  check_in_time?: string;
  check_out_time?: string;
  gate_id?: string;
  created_at?: string;
}

export interface EnrollmentReferral {
  id: string;
  person_name: string;
  proposed_category: string;
  department: string;
  captured_image_path?: string;
  submitted_by_guard_id: string;
  gate_id: string;
  status: 'PENDING' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED';
  request_status?: string;
  admin_notes?: string;
  administrator_notes?: string;
  submitted_at: string;
  created_at?: string;
  reviewed_at?: string;
  reviewed_by?: string;
}

export interface GuardUser {
  id: string;
  employee_id: string;
  email: string;
  full_name: string;
  role: string;
  account_status: 'ACTIVE' | 'SUSPENDED' | 'INACTIVE';
  avatar_url?: string;
  assigned_gate?: {
    id: string;
    code: string;
    name: string;
    shift?: string;
  };
  created_at?: string;
}

export interface UserProfile {
  id: string;
  employee_id: string;
  email: string;
  full_name: string;
  role: 'SUPER_ADMIN' | 'ADMIN' | 'SECURITY_GUARD';
  account_status: string;
  avatar_url?: string;
  mfa_enabled?: boolean;
}

export interface AuditLogEntry {
  id: string;
  action: string;
  actor_id?: string;
  actor_email: string;
  resource_type: string;
  resource_id?: string;
  result: string;
  timestamp: string;
  details?: Record<string, any>;
}

export interface NotificationItem {
  id: string;
  type: string;
  title: string;
  message: string;
  severity: 'INFO' | 'WARNING' | 'ERROR' | 'SUCCESS';
  timestamp: string;
  target_url: string;
  is_read: boolean;
}

export interface RepositoryStatus {
  folder_id: string;
  connection_status: string;
  is_configured: boolean;
  total_approved_identities: number;
  approved_reference_photos: number;
  active_embeddings_indexed: number;
  unmapped_files_count: number;
  last_sync_job?: {
    job_id: string;
    status: string;
    started_at?: string;
    completed_at?: string;
    error?: string;
  };
}
