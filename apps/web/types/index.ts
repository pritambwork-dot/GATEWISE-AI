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

export type PersonAccessStatus =
  | 'ACTIVE_AUTHORIZED'
  | 'PENDING_APPROVAL'
  | 'TEMPORARILY_AUTHORIZED'
  | 'SUSPENDED'
  | 'EXPIRED'
  | 'REJECTED'
  | 'ARCHIVED';

export interface PersonPhoto {
  id: string;
  url: string;
  is_primary: boolean;
  quality_score: number;
  capture_method: 'UPLOAD' | 'WEBCAM' | 'MOBILE_GUARD';
  uploaded_at: string;
}

export interface RegisteredVehicle {
  id: string;
  license_plate: string;
  normalized_plate: string;
  vehicle_type: 'Car' | 'Two-Wheeler' | 'Bus' | 'Commercial' | 'Emergency';
  make_model?: string;
  color?: string;
  photo_url?: string;
  ownership_details?: string;
  is_authorized: boolean;
  person_id?: string;
  owner_name?: string;
  registration_date?: string;
  valid_until?: string;
}

export interface RegisteredPerson {
  id: string;
  person_code: string;
  full_name: string;
  category: 'Faculty' | 'Student' | 'Staff' | 'Contractor' | 'Visitor' | 'VIP' | 'Delivery' | 'Temporary Staff';
  department: string;
  designation?: string;
  email?: string;
  phone?: string;
  residential_address?: string;
  id_document_type?: string;
  id_document_number?: string;
  photo_url?: string;
  photos?: PersonPhoto[];
  biometric_template_hash?: string;
  account_status: PersonAccessStatus;
  registration_status?: 'DRAFT' | 'PENDING_REVIEW' | 'REGISTERED' | 'REJECTED' | 'ARCHIVED';
  access_status?: 'AUTHORIZED' | 'TEMPORARY' | 'SUSPENDED' | 'EXPIRED' | 'DENIED';
  enrollment_status?: 'PENDING' | 'COMPLETED' | 'FAILED';
  enrollment_error?: string;
  biometrics_count?: number;
  creation_source: 'ADMIN_CREATED' | 'GUARD_CREATED';
  created_by_id: string;
  created_by_name: string;
  authorized_gates: string[];
  allowed_entry_categories?: string[];
  access_restrictions?: string;
  registration_notes?: string;
  registration_date: string;
  valid_from: string;
  valid_until: string;
  associated_vehicles?: RegisteredVehicle[];
}

export interface GuardPermissions {
  guard_id: string;
  registration_mode: 'APPROVAL_REQUIRED' | 'DIRECT_PERMISSION';
  direct_record_policy: 'ACTIVE_LIMITED' | 'TEMPORARY_ONLY' | 'PENDING_FINAL_REVIEW';
  can_submit_registration_requests: boolean;
  can_create_person_directly: boolean;
  can_register_vehicles: boolean;
  can_capture_upload_photos: boolean;
  can_edit_own_created_records: boolean;
  can_record_entry_exit: boolean;
  can_view_limited_history: boolean;
  updated_by_admin_id?: string;
  updated_at: string;
}

export interface GuardAccount {
  id: string;
  badge_number: string;
  username: string;
  full_name: string;
  full_name_hi?: string;
  assigned_gate_code: string;
  assigned_gate_name: string;
  shift_name: string;
  account_status: 'ACTIVE' | 'SUSPENDED' | 'DEACTIVATED';
  permissions: GuardPermissions;
  created_at: string;
}

export interface RegistrationRequest {
  id: string;
  request_code: string;
  submitted_by_guard_id: string;
  submitted_by_guard_name: string;
  gate_id?: string;
  full_name: string;
  phone?: string;
  category: 'Visitor' | 'Contractor' | 'VIP' | 'Delivery' | 'Temporary Staff' | 'Student' | 'Faculty' | 'Staff';
  purpose: string;
  expected_duration: string;
  face_photo_url?: string;
  face_embedding?: number[];
  quality_score?: number;
  vehicle_plate?: string;
  vehicle_type?: 'Car' | 'Two-Wheeler' | 'Bus' | 'Commercial' | 'Emergency';
  vehicle_photo_url?: string;
  additional_notes?: string;
  duplicate_warning?: string;
  requested_info_prompt?: string;
  status: 'PENDING_APPROVAL' | 'APPROVED' | 'REJECTED' | 'ADDITIONAL_INFO_REQUIRED' | 'MORE_INFO_REQUIRED';
  reviewed_by_admin_id?: string;
  review_notes?: string;
  submitted_at: string;
  reviewed_at?: string;
}

export type VerificationOutcomeCase =
  | 'CASE_1_VERIFIED'
  | 'CASE_2_PARTIALLY_VERIFIED'
  | 'CASE_3_NOT_VERIFIED'
  | 'ACCESS_EXPIRED'
  | 'ACCESS_DENIED'
  | 'MANUAL_REVIEW_REQUIRED';

export interface VerificationResult {
  verification_code?: string;
  case_outcome: VerificationOutcomeCase;
  status_title: 'VERIFIED' | 'PARTIALLY VERIFIED' | 'NOT VERIFIED' | 'ACCESS EXPIRED' | 'ACCESS DENIED' | 'MANUAL REVIEW REQUIRED';
  person?: {
    id: string;
    name: string;
    category: string;
    department?: string;
    photo_url?: string;
    face_matched: boolean;
    confidence_score: number;
    creation_source?: 'ADMIN_CREATED' | 'GUARD_CREATED';
    access_status?: PersonAccessStatus;
  };
  vehicle?: {
    license_plate: string;
    normalized_plate: string;
    vehicle_matched: boolean;
    is_associated_with_person: boolean;
    vehicle_type?: string;
  };
  access_decision:
    | 'AUTHORIZED'
    | 'PARTIALLY_AUTHORIZED'
    | 'NOT_AUTHORIZED'
    | 'ACCESS_EXPIRED'
    | 'ACCESS_DENIED'
    | 'MANUAL_REVIEW_REQUIRED';
  timestamp: string;
  failure_reason?: string;
}

