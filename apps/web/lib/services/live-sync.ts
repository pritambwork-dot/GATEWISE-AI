/**
 * GATEWISE AI — Centralized Cloud Synchronization & Real-Time API Bridge
 * Zero device-local database storage (`localStorage` is ONLY for session token + language UI pref).
 * Zero client-side verification decisions — all matching, RBAC, storage & logging live in Supabase PostgreSQL.
 */

import { RealtimeChannel } from '@supabase/supabase-js';
import {
  VerificationEvent,
  GuardAccount,
  GuardPermissions,
  RegisteredPerson,
  RegisteredVehicle,
  RegistrationRequest,
  VerificationResult,
  AuditLogEntry,
  NotificationItem,
  PersonAccessStatus,
} from '../../types';
import { getSupabaseClient } from '../supabase/client';
import { extractFaceDescriptorFromDataUrl } from '../biometrics';

export type LiveSyncMessageType =
  | 'STATE_REFRESHED'
  | 'PERSON_CREATED'
  | 'PERSON_UPDATED'
  | 'PERSON_DELETED'
  | 'VEHICLE_CREATED'
  | 'VERIFICATION_RESULT_LOGGED'
  | 'GATE_EVENT_RECORDED'
  | 'REGISTRATION_REQUEST_CREATED'
  | 'REGISTRATION_REQUEST_UPDATED'
  | 'GUARD_CREATED'
  | 'GUARD_PERMISSIONS_UPDATED'
  | 'AUDIT_LOGGED'
  | 'NOTIFICATION_ADDED'
  | 'SYSTEM_ALERT';

export interface LiveSyncMessage {
  type: LiveSyncMessageType;
  source: 'COMMAND_CENTRE' | 'GUARD_WEB_APP' | 'SUPABASE_REALTIME';
  payload: any;
  timestamp: string;
}

export function normalizePlate(plate?: string): string {
  if (!plate) return '';
  return plate.toUpperCase().replace(/[^A-Z0-9]/g, '').trim();
}

function mapDbAccessToUiStatus(
  accessStatus?: string,
  regStatus?: string,
): PersonAccessStatus {
  if (regStatus === 'PENDING_REVIEW') return 'PENDING_APPROVAL';
  if (regStatus === 'REJECTED') return 'REJECTED';
  if (regStatus === 'ARCHIVED') return 'ARCHIVED';
  switch (accessStatus) {
    case 'TEMPORARY':
      return 'TEMPORARILY_AUTHORIZED';
    case 'SUSPENDED':
    case 'DENIED':
      return 'SUSPENDED';
    case 'EXPIRED':
      return 'EXPIRED';
    case 'AUTHORIZED':
    default:
      return 'ACTIVE_AUTHORIZED';
  }
}

export function mapUiStatusToDb(uiStatus?: PersonAccessStatus): {
  access_status: 'AUTHORIZED' | 'TEMPORARY' | 'SUSPENDED' | 'EXPIRED' | 'DENIED';
  registration_status?: 'REGISTERED' | 'PENDING_REVIEW' | 'REJECTED' | 'ARCHIVED';
} {
  switch (uiStatus) {
    case 'TEMPORARILY_AUTHORIZED':
      return { access_status: 'TEMPORARY', registration_status: 'REGISTERED' };
    case 'SUSPENDED':
      return { access_status: 'SUSPENDED', registration_status: 'REGISTERED' };
    case 'EXPIRED':
      return { access_status: 'EXPIRED', registration_status: 'REGISTERED' };
    case 'REJECTED':
      return { access_status: 'DENIED', registration_status: 'REJECTED' };
    case 'PENDING_APPROVAL':
      return { access_status: 'AUTHORIZED', registration_status: 'PENDING_REVIEW' };
    case 'ARCHIVED':
      return { access_status: 'DENIED', registration_status: 'ARCHIVED' };
    case 'ACTIVE_AUTHORIZED':
    default:
      return { access_status: 'AUTHORIZED', registration_status: 'REGISTERED' };
  }
}

function mapDbPerson(p: any): RegisteredPerson {
  const vehicles = Array.isArray(p.vehicles)
    ? p.vehicles.map((v: any) => ({
        id: v.id,
        license_plate: v.license_plate,
        normalized_plate: v.normalized_plate,
        vehicle_type: v.vehicle_type || 'Car',
        make_model: v.make_model || '',
        color: v.color || '',
        ownership_details: v.ownership_details || '',
        is_authorized: v.is_authorized !== false,
        person_id: p.id,
        owner_name: p.full_name,
        registration_date: v.registration_date || v.created_at,
        valid_until: v.valid_until || p.valid_until,
      }))
    : [];

  return {
    id: p.id,
    person_code: p.person_code,
    full_name: p.full_name,
    category: p.category || 'Visitor',
    department: p.department || '',
    designation: p.designation || '',
    email: p.email || '',
    phone: p.phone || '',
    residential_address: p.residential_address || '',
    id_document_type: p.id_document_type || '',
    id_document_number: p.id_document_number || '',
    photo_url: p.primary_photo_url || '',
    photos: Array.isArray(p.photos)
      ? p.photos.map((ph: any) => ({
          id: ph.id,
          url: ph.signed_url || ph.storage_path || '',
          is_primary: Boolean(ph.is_primary),
          quality_score: Number(ph.quality_score ?? 85),
          capture_method: ph.capture_method || 'UPLOAD',
          uploaded_at: ph.created_at || new Date().toISOString(),
        }))
      : [],
    biometric_template_hash: p.enrollment_status === 'COMPLETED' ? 'GATEWISE-DESC-128V1' : undefined,
    account_status: mapDbAccessToUiStatus(p.access_status, p.registration_status),
    registration_status: p.registration_status || 'REGISTERED',
    access_status: p.access_status || 'AUTHORIZED',
    enrollment_status: p.enrollment_status || 'PENDING',
    enrollment_error: p.enrollment_error || undefined,
    biometrics_count: Number(p.biometrics_count ?? 0),
    creation_source: p.creation_source === 'GUARD_CREATED' ? 'GUARD_CREATED' : 'ADMIN_CREATED',
    created_by_id: p.created_by_id || 'ADM-001',
    created_by_name: p.created_by_name || 'Administrator',
    authorized_gates: Array.isArray(p.access_permission?.permitted_gates)
      ? p.access_permission.permitted_gates
      : ['G-01', 'G-02', 'G-03', 'G-04'],
    access_restrictions: p.access_permission?.special_conditions || '',
    registration_notes: p.registration_notes || '',
    registration_date: p.registration_date || p.created_at || new Date().toISOString(),
    valid_from: p.valid_from || new Date().toISOString(),
    valid_until: p.valid_until || '',
    associated_vehicles: vehicles,
  };
}

function mapDbGuard(g: any): GuardAccount {
  const perm = g.permissions || {};
  const mode =
    perm.registration_mode === 'DIRECT_REGISTRATION' || perm.registration_mode === 'DIRECT_PERMISSION'
      ? 'DIRECT_PERMISSION'
      : 'APPROVAL_REQUIRED';
  const policy =
    perm.direct_record_policy === 'TEMP_PASS' || perm.direct_record_policy === 'TEMPORARY_ONLY'
      ? 'TEMPORARY_ONLY'
      : perm.direct_record_policy === 'PENDING_FINAL_REVIEW'
      ? 'PENDING_FINAL_REVIEW'
      : 'ACTIVE_LIMITED';

  return {
    id: g.id,
    badge_number: g.guard_badge_id,
    username: g.username,
    full_name: g.full_name,
    assigned_gate_code: g.assigned_gate_code || 'G-01',
    assigned_gate_name: g.assigned_gate_name || 'Main Campus Gate',
    shift_name: g.shift_name || 'Day Shift',
    account_status: g.is_active === false || g.account_status === 'SUSPENDED' ? 'SUSPENDED' : 'ACTIVE',
    permissions: {
      guard_id: g.guard_badge_id,
      registration_mode: mode,
      direct_record_policy: policy,
      can_submit_registration_requests: perm.can_submit_registration_requests ?? true,
      can_create_person_directly: perm.can_create_person_directly ?? mode === 'DIRECT_PERMISSION',
      can_register_vehicles: perm.can_register_vehicles ?? false,
      can_capture_upload_photos: perm.can_capture_upload_photos ?? true,
      can_edit_own_created_records: perm.can_edit_own_created_records ?? false,
      can_record_entry_exit: perm.can_record_entry_exit ?? true,
      can_view_limited_history: perm.can_view_limited_history ?? true,
      updated_by_admin_id: perm.updated_by_admin_id || 'ADM-001',
      updated_at: perm.updated_at || new Date().toISOString(),
    },
    created_at: g.created_at || new Date().toISOString(),
  };
}

function mapDbVehicle(v: any): RegisteredVehicle {
  const mappings = Array.isArray(v.person_vehicle_mapping) ? v.person_vehicle_mapping : [];
  const primary = mappings.find((m: any) => m.is_primary) || mappings[0];
  const owner = primary?.persons || null;
  return {
    id: v.id,
    license_plate: v.license_plate,
    normalized_plate: v.normalized_plate,
    vehicle_type: v.vehicle_type || 'Car',
    make_model: v.make_model || '',
    color: v.color || '',
    ownership_details: v.ownership_details || (owner ? `${owner.full_name} (${owner.person_code})` : ''),
    is_authorized: v.is_authorized !== false,
    person_id: owner?.id,
    owner_name: owner?.full_name,
    registration_date: v.registration_date || v.created_at,
    valid_until: v.valid_until,
  };
}

function mapDbRequest(r: any): RegistrationRequest {
  let cleanNotes = r.additional_notes || '';
  try {
    if (cleanNotes.startsWith('{')) {
      const parsed = JSON.parse(cleanNotes);
      cleanNotes = parsed.text || '';
    }
  } catch {}
  return {
    id: r.id,
    request_code: r.request_code,
    submitted_by_guard_id: r.submitted_by_guard_id,
    submitted_by_guard_name: r.submitted_by_guard_name,
    gate_id: r.gate_id || 'G-01',
    full_name: r.full_name,
    phone: r.phone || '',
    category: r.category || 'Visitor',
    purpose: r.purpose || '',
    expected_duration: r.expected_duration || '4 Hours',
    face_photo_url: r.face_photo_url || '',
    vehicle_plate: r.vehicle_plate || '',
    vehicle_type: r.vehicle_type || 'Car',
    vehicle_photo_url: r.vehicle_photo_url || '',
    additional_notes: cleanNotes,
    duplicate_warning: r.duplicate_warning || undefined,
    requested_info_prompt: r.requested_info_prompt || undefined,
    status: r.status === 'MORE_INFO_REQUIRED' ? 'ADDITIONAL_INFO_REQUIRED' : r.status || 'PENDING_APPROVAL',
    reviewed_by_admin_id: r.reviewed_by_admin_id || undefined,
    review_notes: r.review_notes || undefined,
    submitted_at: r.submitted_at || new Date().toISOString(),
    reviewed_at: r.reviewed_at || undefined,
  };
}

function mapDbGateEventToVerificationEvent(e: any): VerificationEvent {
  const rawScore = Number(e.similarity_score ?? e.face_confidence ?? 0);
  const sim = rawScore > 1 ? rawScore / 100 : rawScore;
  const gateId = e.gate_code || e.gate_id || 'G-01';
  const gateName =
    gateId === 'G-02' || gateId === 'GATE-02'
      ? 'North Vehicle Gate'
      : gateId === 'G-03'
      ? 'Executive Hostel Gate'
      : 'Main Gate 01';

  const isDeny =
    e.guard_decision === 'REJECT' ||
    e.guard_decision === 'DENY_ENTRY' ||
    e.access_decision === 'DENIED' ||
    e.status === 'ACCESS_DENIED' ||
    e.status === 'ACCESS_EXPIRED';
  const isPendingReview =
    e.guard_decision === 'MANUAL_REVIEW' ||
    e.access_decision === 'MANUAL_REVIEW_REQUIRED' ||
    e.status === 'PARTIALLY_VERIFIED' ||
    e.status === 'NOT_VERIFIED';

  const guardDecision = isDeny ? 'DENY_ENTRY' : isPendingReview ? 'PENDING' : 'GRANT_ENTRY';
  const outcome =
    e.status === 'ACCESS_DENIED'
      ? 'ACCESS_DENIED'
      : e.status === 'VERIFIED' || e.verification_outcome === 'VERIFIED'
      ? 'VERIFIED_AUTHORIZED'
      : e.status === 'PARTIALLY_VERIFIED'
      ? 'POTENTIAL_MATCH'
      : e.status === 'NOT_VERIFIED'
      ? 'UNKNOWN_PERSON'
      : e.verification_outcome || 'VERIFIED_AUTHORIZED';

  return {
    id: String(e.id || e.event_id || e.verification_code || crypto.randomUUID()),
    timestamp: e.timestamp || e.created_at || new Date().toISOString(),
    gate_id: gateId,
    gate_name: gateName,
    guard_id: e.guard_id || 'GRD-101',
    guard_name: e.guard_name || 'Security Guard',
    person_id: e.person_code || e.person_id || undefined,
    person_name: e.person_name || e.payload_json?.person?.full_name || 'Unidentified Subject',
    person_category: e.payload_json?.person?.category || e.registration_source || 'Visitor',
    outcome,
    guard_decision: guardDecision,
    similarity_score: sim,
    decision_reason: e.rejection_reason || e.failure_reason || undefined,
    cryptographic_signature: e.cryptographic_signature || e.verification_code || 'HMAC-SHA256',
    sync_status: 'SYNCED',
  };
}

export interface DashboardLiveMetrics {
  total_registered_people: number;
  authorized_people: number;
  suspended_people: number;
  failed_enrollments: number;
  total_vehicles: number;
  active_guards: number;
  pending_registration_requests: number;
  entries_today: number;
  exits_today: number;
  verifications_today: number;
  verified_today: number;
  failed_verification_attempts: number;
  gates: any[];
  recent_verifications: any[];
}

class LiveSyncService {
  private listeners: Set<(msg: LiveSyncMessage) => void> = new Set();
  private realtimeChannel: RealtimeChannel | null = null;
  private isClient = typeof window !== 'undefined';
  private refreshInFlight: Promise<void> | null = null;

  // In-memory live mirrors (populated strictly from backend API, never localStorage fake DB)
  private personsCache: RegisteredPerson[] = [];
  private vehiclesCache: RegisteredVehicle[] = [];
  private guardsCache: GuardAccount[] = [];
  private requestsCache: RegistrationRequest[] = [];
  private eventsCache: VerificationEvent[] = [];
  private logsCache: AuditLogEntry[] = [];
  private notificationsCache: NotificationItem[] = [];
  private metricsCache: DashboardLiveMetrics | null = null;
  private currentGuardPermissions: GuardPermissions | null = null;

  constructor() {
    if (this.isClient) {
      this.initRealtime();
    }
  }

  private getAuthToken(preferredRole?: 'ADMIN' | 'GUARD'): string | null {
    if (!this.isClient) return null;
    if (preferredRole === 'GUARD') {
      return sessionStorage.getItem('gatewise_guard_token') || null;
    }
    if (preferredRole === 'ADMIN') {
      return localStorage.getItem('gatewise_admin_token') || null;
    }
    // Strict context separation based on current route
    const isGuardRoute = window.location.pathname.startsWith('/guard') || window.location.pathname.startsWith('/app');
    if (isGuardRoute) {
      return sessionStorage.getItem('gatewise_guard_token');
    }
    return localStorage.getItem('gatewise_admin_token') || sessionStorage.getItem('gatewise_guard_token');
  }

  private async apiFetch<T = any>(
    path: string,
    options: RequestInit = {},
    preferredRole?: 'ADMIN' | 'GUARD',
  ): Promise<T> {
    const token = this.getAuthToken(preferredRole);
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string> | undefined),
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
      headers['x-gatewise-token'] = token;
    }
    const res = await fetch(`/api/v1${path}`, {
      ...options,
      headers,
      cache: 'no-store',
    });
    const text = await res.text();
    let json: any = {};
    try {
      json = text ? JSON.parse(text) : {};
    } catch {}
    if (!res.ok) {
      throw new Error(json.error || json.detail || `API error ${res.status}`);
    }
    return json as T;
  }

  private initRealtime() {
    if (this.realtimeChannel) return;
    try {
      const supabase = getSupabaseClient();
      const ch = supabase.channel('gatewise-live');

      const handleRemoteChange = (eventName: string, payload?: any) => {
        this.refreshActiveContext().finally(() => {
          this.notifyListeners({
            type: this.mapEventNameToType(eventName),
            source: 'SUPABASE_REALTIME',
            payload: payload || {},
            timestamp: new Date().toISOString(),
          });
        });
      };

      ch.on('broadcast', { event: '*' }, (msg) => {
        handleRemoteChange(msg.event, msg.payload);
      });

      const tables = [
        'persons',
        'vehicles',
        'registration_requests',
        'verification_results',
        'entry_exit_logs',
        'guard_permissions',
        'guards',
        'notifications',
      ];
      tables.forEach((table) => {
        ch.on(
          'postgres_changes',
          { event: '*', schema: 'public', table },
          (payload) => handleRemoteChange(table, payload),
        );
      });

      ch.subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          this.refreshActiveContext();
        }
      });

      this.realtimeChannel = ch;

      window.addEventListener('online', () => {
        this.refreshActiveContext();
      });
      window.addEventListener('focus', () => {
        this.refreshActiveContext();
      });
    } catch (err) {
      console.warn('Supabase Realtime unavailable:', err);
    }
  }

  private mapEventNameToType(eventName: string): LiveSyncMessageType {
    if (eventName.includes('verification')) return 'VERIFICATION_RESULT_LOGGED';
    if (eventName.includes('entry') || eventName.includes('exit')) return 'GATE_EVENT_RECORDED';
    if (eventName.includes('registration')) return 'REGISTRATION_REQUEST_UPDATED';
    if (eventName.includes('guard')) return 'GUARD_PERMISSIONS_UPDATED';
    if (eventName.includes('person')) return 'PERSON_UPDATED';
    if (eventName.includes('vehicle')) return 'VEHICLE_CREATED';
    if (eventName.includes('notification')) return 'NOTIFICATION_ADDED';
    return 'STATE_REFRESHED';
  }

  private notifyListeners(msg: LiveSyncMessage) {
    this.listeners.forEach((cb) => {
      try {
        cb(msg);
      } catch (err) {
        console.error('LiveSync listener error:', err);
      }
    });
  }

  public subscribe(listener: (msg: LiveSyncMessage) => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  public async refreshActiveContext(): Promise<void> {
    if (!this.isClient) return;
    if (this.refreshInFlight) return this.refreshInFlight;

    const isGuardRoute = window.location.pathname.startsWith('/guard') || window.location.pathname.startsWith('/app');
    const guardToken = sessionStorage.getItem('gatewise_guard_token');
    const adminToken = localStorage.getItem('gatewise_admin_token');

    this.refreshInFlight = (async () => {
      try {
        if (isGuardRoute && guardToken) {
          await this.refreshGuardState();
        } else if (adminToken) {
          await this.refreshAdminState();
        } else if (guardToken) {
          await this.refreshGuardState();
        }
      } catch (err) {
        console.warn('LiveSync refresh deferred:', err);
      } finally {
        this.refreshInFlight = null;
      }
    })();

    return this.refreshInFlight;
  }

  public async refreshAdminState(): Promise<void> {
    if (!this.getAuthToken('ADMIN')) return;
    const [personsRes, vehiclesRes, guardsRes, reqRes, eventsRes, verifRes, metricsRes, notifRes, auditRes] =
      await Promise.allSettled([
        this.apiFetch<{ items: any[] }>('/persons', {}, 'ADMIN'),
        this.apiFetch<{ items: any[] }>('/vehicles', {}, 'ADMIN'),
        this.apiFetch<{ items: any[] }>('/guards', {}, 'ADMIN'),
        this.apiFetch<{ items: any[] }>('/registration-requests', {}, 'ADMIN'),
        this.apiFetch<{ items: any[] }>('/gate-events?limit=100', {}, 'ADMIN'),
        this.apiFetch<{ items: any[] }>('/verifications/history?limit=100', {}, 'ADMIN'),
        this.apiFetch<DashboardLiveMetrics>('/analytics/dashboard', {}, 'ADMIN'),
        this.apiFetch<{ items: any[] }>('/notifications', {}, 'ADMIN'),
        this.apiFetch<{ items: any[] }>('/audit-logs?limit=100', {}, 'ADMIN'),
      ]);

    if (personsRes.status === 'fulfilled') {
      this.personsCache = (personsRes.value.items || []).map(mapDbPerson);
    }
    if (vehiclesRes.status === 'fulfilled') {
      this.vehiclesCache = (vehiclesRes.value.items || []).map(mapDbVehicle);
    }
    if (guardsRes.status === 'fulfilled') {
      this.guardsCache = (guardsRes.value.items || []).map(mapDbGuard);
    }
    if (reqRes.status === 'fulfilled') {
      this.requestsCache = (reqRes.value.items || []).map(mapDbRequest);
    }

    const gateEvts = eventsRes.status === 'fulfilled' ? (eventsRes.value.items || []).map(mapDbGateEventToVerificationEvent) : [];
    const verifEvts = verifRes.status === 'fulfilled' ? (verifRes.value.items || []).map(mapDbGateEventToVerificationEvent) : [];
    const merged = [...gateEvts, ...verifEvts].sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
    );
    if (eventsRes.status === 'fulfilled' || verifRes.status === 'fulfilled') {
      this.eventsCache = merged;
    }

    if (metricsRes.status === 'fulfilled') {
      this.metricsCache = metricsRes.value;
    }
    if (notifRes.status === 'fulfilled') {
      this.notificationsCache = (notifRes.value.items || []).map((n: any) => ({
        id: n.id,
        type: n.type,
        title: n.title,
        message: n.message,
        severity: n.severity === 'CRITICAL' || n.severity === 'HIGH' ? 'WARNING' : 'INFO',
        timestamp: n.created_at,
        target_url: n.target_url || '/admin',
        is_read: Boolean(n.is_read),
      }));
    }
    if (auditRes.status === 'fulfilled') {
      this.logsCache = (auditRes.value.items || []).map((l: any) => ({
        id: l.id,
        actor_id: l.actor_id,
        actor_email: l.actor_email || '',
        actor_role: l.actor_role,
        action: l.action,
        resource_type: l.target_table,
        resource_id: l.target_id,
        result: String(l.action || '').includes('FAIL') || String(l.action || '').includes('DENIED') || String(l.action || '').includes('UNAUTHORIZED') ? 'DENIED' : 'SUCCESS',
        timestamp: l.timestamp,
        details: l.changes || {},
      }));
    }

    this.notifyListeners({
      type: 'STATE_REFRESHED',
      source: 'COMMAND_CENTRE',
      payload: {},
      timestamp: new Date().toISOString(),
    });
  }

  public async refreshGuardState(): Promise<void> {
    if (!this.getAuthToken('GUARD')) return;
    const [permRes, reqRes, verifRes, ownPersonsRes] = await Promise.allSettled([
      this.apiFetch<{ guard: any; permissions: any }>('/guards/me/permissions', {}, 'GUARD'),
      this.apiFetch<{ items: any[] }>('/registration-requests', {}, 'GUARD'),
      this.apiFetch<{ items: any[] }>('/verifications/history?limit=40', {}, 'GUARD'),
      this.apiFetch<{ items: any[] }>('/persons', {}, 'GUARD'),
    ]);

    if (permRes.status === 'fulfilled' && permRes.value.guard) {
      const mapped = mapDbGuard({ ...permRes.value.guard, permissions: permRes.value.permissions });
      this.currentGuardPermissions = mapped.permissions;
      this.guardsCache = [mapped];
    }
    if (reqRes.status === 'fulfilled') {
      this.requestsCache = (reqRes.value.items || []).map(mapDbRequest);
    }
    if (verifRes.status === 'fulfilled') {
      this.eventsCache = (verifRes.value.items || []).map(mapDbGateEventToVerificationEvent);
    }
    if (ownPersonsRes.status === 'fulfilled') {
      this.personsCache = (ownPersonsRes.value.items || []).map(mapDbPerson);
    }

    this.notifyListeners({
      type: 'STATE_REFRESHED',
      source: 'GUARD_WEB_APP',
      payload: {},
      timestamp: new Date().toISOString(),
    });
  }

  // Synchronous getters read exclusively from hydrated cloud cache
  public getMetrics(): DashboardLiveMetrics | null {
    return this.metricsCache;
  }

  public getPersons(): RegisteredPerson[] {
    return this.personsCache;
  }

  public getVehicles(): RegisteredVehicle[] {
    return this.vehiclesCache;
  }

  public getGuards(): GuardAccount[] {
    return this.guardsCache;
  }

  public getRegistrationRequests(): RegistrationRequest[] {
    return this.requestsCache;
  }

  public getEvents(): VerificationEvent[] {
    return this.eventsCache;
  }

  public getAuditLogs(): AuditLogEntry[] {
    return this.logsCache;
  }

  public getNotifications(): NotificationItem[] {
    return this.notificationsCache;
  }

  public getGuardPermissions(guardId: string): GuardPermissions {
    const match = this.guardsCache.find(
      (g) =>
        g.id === guardId ||
        g.badge_number?.toLowerCase() === guardId.toLowerCase() ||
        g.username?.toLowerCase() === guardId.toLowerCase(),
    );
    if (match?.permissions) return match.permissions;
    if (this.currentGuardPermissions && this.currentGuardPermissions.guard_id === guardId) {
      return this.currentGuardPermissions;
    }
    return {
      guard_id: guardId,
      registration_mode: 'APPROVAL_REQUIRED',
      direct_record_policy: 'ACTIVE_LIMITED',
      can_submit_registration_requests: true,
      can_create_person_directly: false,
      can_register_vehicles: false,
      can_capture_upload_photos: true,
      can_edit_own_created_records: false,
      can_record_entry_exit: true,
      can_view_limited_history: true,
      updated_at: new Date().toISOString(),
    };
  }

  public getActiveGuardIds(): string[] {
    return this.guardsCache.filter((g) => g.account_status === 'ACTIVE').map((g) => g.badge_number);
  }

  // ==========================================
  // MUTATIONS — DIRECTLY TO CENTRAL BACKEND
  // ==========================================
  public async addPerson(
    payload: Omit<RegisteredPerson, 'id' | 'registration_date' | 'person_code'> & {
      person_code?: string;
      face_embedding?: number[];
      quality_score?: number;
      photo_width?: number;
      photo_height?: number;
      vehicles_input?: Array<{ license_plate: string; vehicle_type?: string; make_model?: string; color?: string }>;
    },
  ): Promise<RegisteredPerson> {
    const { access_status, registration_status } = mapUiStatusToDb(payload.account_status);

    let embedding = payload.face_embedding;
    let qualityScore = payload.quality_score;
    let width = payload.photo_width;
    let height = payload.photo_height;

    if (payload.photo_url && payload.photo_url.startsWith('data:image/') && !embedding) {
      const extracted = await extractFaceDescriptorFromDataUrl(payload.photo_url);
      if (extracted.ok) {
        embedding = extracted.embedding;
        qualityScore = extracted.qualityScore;
        width = extracted.width;
        height = extracted.height;
      } else {
        qualityScore = extracted.qualityScore ?? 15;
      }
    }

    const res = await this.apiFetch<{ person: any; enrollment_error?: string }>(
      '/persons',
      {
        method: 'POST',
        body: JSON.stringify({
          person_code: payload.person_code,
          full_name: payload.full_name,
          category: payload.category,
          department: payload.department,
          designation: payload.designation,
          email: payload.email,
          phone: payload.phone,
          residential_address: payload.residential_address,
          id_document_type: payload.id_document_type,
          id_document_number: payload.id_document_number,
          registration_status,
          access_status,
          valid_from: payload.valid_from,
          valid_until: payload.valid_until,
          permitted_gates: payload.authorized_gates,
          registration_notes: payload.registration_notes,
          face_image: payload.photo_url || undefined,
          face_embedding: embedding,
          quality_score: qualityScore,
          photo_width: width,
          photo_height: height,
          vehicles:
            payload.vehicles_input ||
            (payload.associated_vehicles || []).map((v) => ({
              license_plate: v.license_plate,
              vehicle_type: v.vehicle_type,
              make_model: v.make_model,
              color: v.color,
            })),
        }),
      },
      'ADMIN',
    );

    const mapped = mapDbPerson(res.person);
    await this.refreshAdminState();
    this.notifyListeners({
      type: 'PERSON_CREATED',
      source: 'COMMAND_CENTRE',
      payload: mapped,
      timestamp: new Date().toISOString(),
    });
    return mapped;
  }

  public async uploadPersonPhoto(
    personId: string,
    imageData: string,
    captureMethod: 'UPLOAD' | 'WEBCAM' | 'MOBILE_GUARD' = 'UPLOAD',
  ): Promise<{ ok: boolean; enrollment_status?: string; error?: string }> {
    const extracted = imageData.startsWith('data:image/')
      ? await extractFaceDescriptorFromDataUrl(imageData)
      : { ok: false, error: 'Unsupported or corrupted image payload', qualityScore: 10 };

    const res = await this.apiFetch<any>(
      `/persons/${encodeURIComponent(personId)}/photos`,
      {
        method: 'POST',
        body: JSON.stringify({
          image_data: imageData,
          embedding: extracted.embedding,
          quality_score: extracted.qualityScore ?? 10,
          width: extracted.width ?? 0,
          height: extracted.height ?? 0,
          capture_method: captureMethod,
          is_primary: true,
        }),
      },
      'ADMIN',
    );
    await this.refreshAdminState();
    return res;
  }

  public async updatePerson(
    personId: string,
    updates: Partial<RegisteredPerson>,
  ): Promise<RegisteredPerson | null> {
    const dbPayload: Record<string, any> = {};
    if ('full_name' in updates) dbPayload.full_name = updates.full_name;
    if ('category' in updates) dbPayload.category = updates.category;
    if ('department' in updates) dbPayload.department = updates.department;
    if ('designation' in updates) dbPayload.designation = updates.designation;
    if ('phone' in updates) dbPayload.phone = updates.phone;
    if ('email' in updates) dbPayload.email = updates.email;
    if ('valid_until' in updates) dbPayload.valid_until = updates.valid_until;
    if ('registration_notes' in updates) dbPayload.registration_notes = updates.registration_notes;
    if ('authorized_gates' in updates) dbPayload.permitted_gates = updates.authorized_gates;
    if (updates.account_status) {
      const mapped = mapUiStatusToDb(updates.account_status);
      dbPayload.access_status = mapped.access_status;
      if (mapped.registration_status) dbPayload.registration_status = mapped.registration_status;
    }

    const res = await this.apiFetch<{ person: any }>(
      `/persons/${encodeURIComponent(personId)}`,
      {
        method: 'PATCH',
        body: JSON.stringify(dbPayload),
      },
      'ADMIN',
    );
    await this.refreshAdminState();
    const mapped = mapDbPerson(res.person);
    this.notifyListeners({
      type: 'PERSON_UPDATED',
      source: 'COMMAND_CENTRE',
      payload: mapped,
      timestamp: new Date().toISOString(),
    });
    return mapped;
  }

  public async deletePerson(personIdOrCode: string): Promise<boolean> {
    await this.apiFetch(`/persons/${encodeURIComponent(personIdOrCode)}`, { method: 'DELETE' }, 'ADMIN');
    await this.refreshAdminState();
    this.notifyListeners({
      type: 'PERSON_DELETED',
      source: 'COMMAND_CENTRE',
      payload: { personIdOrCode },
      timestamp: new Date().toISOString(),
    });
    return true;
  }

  public async addVehicle(
    vehiclePayload: Omit<RegisteredVehicle, 'id' | 'normalized_plate' | 'registration_date'> & {
      person_id?: string;
    },
  ): Promise<RegisteredVehicle> {
    const res = await this.apiFetch<{ vehicle: any }>(
      '/vehicles',
      {
        method: 'POST',
        body: JSON.stringify({
          license_plate: vehiclePayload.license_plate,
          vehicle_type: vehiclePayload.vehicle_type,
          make_model: vehiclePayload.make_model,
          color: vehiclePayload.color,
          ownership_details: vehiclePayload.ownership_details,
          is_authorized: vehiclePayload.is_authorized ?? true,
          valid_until: vehiclePayload.valid_until,
          person_id: vehiclePayload.person_id,
        }),
      },
      'ADMIN',
    );
    await this.refreshAdminState();
    return mapDbVehicle(res.vehicle);
  }

  public async createGuard(payload: {
    badge_number: string;
    username: string;
    full_name: string;
    password?: string;
    assigned_gate_code: string;
    assigned_gate_name: string;
    shift_name?: string;
    registration_mode?: 'APPROVAL_REQUIRED' | 'DIRECT_PERMISSION';
  }): Promise<GuardAccount | null> {
    await this.apiFetch(
      '/guards',
      {
        method: 'POST',
        body: JSON.stringify({
          guard_badge_id: payload.badge_number,
          username: payload.username,
          full_name: payload.full_name,
          password: payload.password || 'guard123',
          assigned_gate_code: payload.assigned_gate_code,
          assigned_gate_name: payload.assigned_gate_name,
          shift_name: payload.shift_name || 'Day Shift',
          registration_mode:
            payload.registration_mode === 'DIRECT_PERMISSION'
              ? 'DIRECT_REGISTRATION'
              : 'APPROVAL_REQUIRED',
        }),
      },
      'ADMIN',
    );
    await this.refreshAdminState();
    return this.guardsCache.find((g) => g.badge_number === payload.badge_number.toUpperCase()) || null;
  }

  public async updateGuardPermissions(
    guardId: string,
    updates: Partial<GuardPermissions>,
  ): Promise<GuardPermissions> {
    const payload: Record<string, any> = { ...updates };
    if (updates.registration_mode) {
      payload.registration_mode =
        updates.registration_mode === 'DIRECT_PERMISSION'
          ? 'DIRECT_REGISTRATION'
          : 'APPROVAL_REQUIRED';
    }
    if (updates.direct_record_policy) {
      payload.direct_record_policy =
        updates.direct_record_policy === 'TEMPORARY_ONLY' ? 'TEMP_PASS' : updates.direct_record_policy;
    }

    await this.apiFetch(
      `/guards/${encodeURIComponent(guardId)}/permissions`,
      {
        method: 'PATCH',
        body: JSON.stringify(payload),
      },
      'ADMIN',
    );
    await this.refreshAdminState();
    return this.getGuardPermissions(guardId);
  }

  public async updateGuardStatus(
    guardId: string,
    status: 'ACTIVE' | 'SUSPENDED' | 'DEACTIVATED',
  ): Promise<void> {
    await this.apiFetch(
      `/guards/${encodeURIComponent(guardId)}`,
      {
        method: 'PATCH',
        body: JSON.stringify({
          is_active: status === 'ACTIVE',
          account_status: status === 'ACTIVE' ? 'ACTIVE' : 'SUSPENDED',
        }),
      },
      'ADMIN',
    );
    await this.refreshAdminState();
  }

  // Guard Mode 1 Submission
  public async submitRegistrationRequest(
    payload: Omit<RegistrationRequest, 'id' | 'request_code' | 'status' | 'submitted_at'>,
  ): Promise<RegistrationRequest> {
    let embedding = payload.face_embedding;
    let quality = payload.quality_score;
    let width = 640;
    let height = 640;

    if (payload.face_photo_url && payload.face_photo_url.startsWith('data:image/') && !embedding) {
      const ext = await extractFaceDescriptorFromDataUrl(payload.face_photo_url);
      if (ext.ok) {
        embedding = ext.embedding;
        quality = ext.qualityScore;
        width = ext.width ?? 640;
        height = ext.height ?? 640;
      }
    }

    const res = await this.apiFetch<{ request: any }>(
      '/registration-requests',
      {
        method: 'POST',
        body: JSON.stringify({
          full_name: payload.full_name,
          phone: payload.phone,
          category: payload.category,
          purpose: payload.purpose,
          expected_duration: payload.expected_duration,
          gate_id: payload.gate_id,
          face_image: payload.face_photo_url || undefined,
          face_embedding: embedding,
          quality_score: quality,
          photo_width: width,
          photo_height: height,
          vehicle_plate: payload.vehicle_plate,
          vehicle_type: payload.vehicle_type,
          vehicle_image: payload.vehicle_photo_url || undefined,
          additional_notes: payload.additional_notes,
        }),
      },
      'GUARD',
    );
    await this.refreshGuardState();
    return mapDbRequest(res.request);
  }

  // Guard Mode 2 Direct Creation (Backend enforces 403 if Mode 2 disabled!)
  public async createPersonDirectlyByGuard(payload: {
    guard_id: string;
    guard_name: string;
    full_name: string;
    phone?: string;
    category: RegisteredPerson['category'];
    department?: string;
    purpose?: string;
    face_photo_url?: string;
    face_embedding?: number[];
    vehicle_plate?: string;
    vehicle_type?: RegisteredVehicle['vehicle_type'];
    valid_until?: string;
    authorized_gates?: string[];
  }): Promise<RegisteredPerson> {
    let embedding = payload.face_embedding;
    let qualityScore = 88;
    let width = 640;
    let height = 640;

    if (payload.face_photo_url && payload.face_photo_url.startsWith('data:image/') && !embedding) {
      const ext = await extractFaceDescriptorFromDataUrl(payload.face_photo_url);
      if (ext.ok) {
        embedding = ext.embedding;
        qualityScore = ext.qualityScore ?? 88;
        width = ext.width ?? 640;
        height = ext.height ?? 640;
      }
    }

    const res = await this.apiFetch<{ person: any }>(
      '/persons',
      {
        method: 'POST',
        body: JSON.stringify({
          full_name: payload.full_name,
          phone: payload.phone,
          category: payload.category,
          department: payload.department || 'Guard Direct Pass',
          registration_notes: payload.purpose || 'Created directly at Gate',
          face_image: payload.face_photo_url || undefined,
          face_embedding: embedding,
          quality_score: qualityScore,
          photo_width: width,
          photo_height: height,
          vehicle_plate: payload.vehicle_plate,
          vehicle_type: payload.vehicle_type,
          valid_until: payload.valid_until,
          permitted_gates: payload.authorized_gates,
        }),
      },
      'GUARD',
    );
    await this.refreshGuardState();
    return mapDbPerson(res.person);
  }

  public async approveRegistrationRequest(
    requestId: string,
    adminOverrides?: {
      full_name?: string;
      category?: string;
      department?: string;
      access_status?: 'AUTHORIZED' | 'TEMPORARY';
      permitted_gates?: string[];
      valid_until?: string;
      review_notes?: string;
    },
  ): Promise<RegisteredPerson | null> {
    const res = await this.apiFetch<{ person: any }>(
      `/registration-requests/${encodeURIComponent(requestId)}/approve`,
      {
        method: 'POST',
        body: JSON.stringify(adminOverrides || {}),
      },
      'ADMIN',
    );
    await this.refreshAdminState();
    return res.person ? mapDbPerson(res.person) : null;
  }

  public async rejectRegistrationRequest(requestId: string, reviewNotes: string): Promise<void> {
    await this.apiFetch(
      `/registration-requests/${encodeURIComponent(requestId)}/reject`,
      {
        method: 'POST',
        body: JSON.stringify({ review_notes: reviewNotes }),
      },
      'ADMIN',
    );
    await this.refreshAdminState();
  }

  public async requestMoreInfoRegistrationRequest(requestId: string, promptText: string): Promise<void> {
    await this.apiFetch(
      `/registration-requests/${encodeURIComponent(requestId)}/request-info`,
      {
        method: 'POST',
        body: JSON.stringify({ prompt: promptText }),
      },
      'ADMIN',
    );
    await this.refreshAdminState();
  }

  // Server-Side Verification Engine (NEVER decides client-side)
  public async verifyIdentityAndVehicle(params: {
    face_image?: string;
    face_embedding?: number[];
    vehicle_plate?: string;
    guard_id?: string;
    guard_name?: string;
    gate_id?: string;
    direction?: 'ENTRY' | 'EXIT';
  }): Promise<VerificationResult> {
    let embedding = params.face_embedding;
    if (params.face_image && params.face_image.startsWith('data:image/') && !embedding) {
      const ext = await extractFaceDescriptorFromDataUrl(params.face_image);
      if (ext.ok) {
        embedding = ext.embedding;
      }
    }

    const res = await this.apiFetch<any>(
      '/verifications',
      {
        method: 'POST',
        body: JSON.stringify({
          face_image: params.face_image,
          face_embedding: embedding,
          vehicle_number_raw: params.vehicle_plate,
          gate_id: params.gate_id || 'G-01',
          direction: params.direction || 'ENTRY',
        }),
      },
      'GUARD',
    );

    const status = String(res.status || 'NOT_VERIFIED');
    let caseOutcome: VerificationResult['case_outcome'] = 'CASE_3_NOT_VERIFIED';
    let statusTitle: VerificationResult['status_title'] = 'NOT VERIFIED';
    let accessDecision: VerificationResult['access_decision'] = 'MANUAL_REVIEW_REQUIRED';

    if (status === 'VERIFIED') {
      caseOutcome = 'CASE_1_VERIFIED';
      statusTitle = 'VERIFIED';
      accessDecision = 'AUTHORIZED';
    } else if (status === 'PARTIALLY_VERIFIED') {
      caseOutcome = 'CASE_2_PARTIALLY_VERIFIED';
      statusTitle = 'PARTIALLY VERIFIED';
      accessDecision = 'PARTIALLY_AUTHORIZED';
    } else if (status === 'ACCESS_DENIED') {
      caseOutcome = 'ACCESS_DENIED';
      statusTitle = 'ACCESS DENIED';
      accessDecision = 'ACCESS_DENIED';
    } else if (status === 'ACCESS_EXPIRED') {
      caseOutcome = 'ACCESS_EXPIRED';
      statusTitle = 'ACCESS EXPIRED';
      accessDecision = 'ACCESS_EXPIRED';
    } else if (status === 'MANUAL_REVIEW_REQUIRED') {
      caseOutcome = 'MANUAL_REVIEW_REQUIRED';
      statusTitle = 'MANUAL REVIEW REQUIRED';
      accessDecision = 'MANUAL_REVIEW_REQUIRED';
    }

    await this.refreshGuardState();

    return {
      verification_code: res.verification_code,
      case_outcome: caseOutcome,
      status_title: statusTitle,
      person: res.person
        ? {
            id: res.person.person_code || res.person.id,
            name: res.person.full_name,
            category: res.person.category || 'Visitor',
            department: res.person.department || '',
            photo_url: res.person.photo_url || '',
            face_matched: res.face_status === 'MATCHED',
            confidence_score: Number(res.face_confidence ?? 0),
            creation_source: res.person.creation_source,
            access_status: mapDbAccessToUiStatus(res.person.access_status, res.person.registration_status),
          }
        : undefined,
      vehicle: res.vehicle
        ? {
            license_plate: res.vehicle.license_plate,
            normalized_plate: res.vehicle.normalized_plate,
            vehicle_matched: res.vehicle_status === 'VERIFIED',
            is_associated_with_person: status === 'VERIFIED',
            vehicle_type: res.vehicle.vehicle_type,
          }
        : undefined,
      access_decision: accessDecision,
      timestamp: res.created_at || new Date().toISOString(),
      failure_reason: res.failure_reason || undefined,
    };
  }

  public async recordGateEvent(payload: {
    verification_code?: string;
    event_type: 'ENTRY' | 'EXIT';
    person_id?: string;
    person_code?: string;
    person_name?: string;
    vehicle_plate?: string;
    gate_code?: string;
    verification_outcome?: string;
    guard_decision: 'ALLOW' | 'REJECT' | 'MANUAL_REVIEW';
    similarity_score?: number;
    rejection_reason?: string;
  }): Promise<any> {
    const res = await this.apiFetch(
      '/gate-events',
      {
        method: 'POST',
        body: JSON.stringify(payload),
      },
      'GUARD',
    );
    await this.refreshGuardState();
    return res;
  }

  public async fetchDashboardMetrics(): Promise<DashboardLiveMetrics | null> {
    try {
      const m = await this.apiFetch<DashboardLiveMetrics>('/analytics/dashboard', {}, 'ADMIN');
      this.metricsCache = m;
      return m;
    } catch {
      return this.metricsCache;
    }
  }

  public async markAllNotificationsRead(): Promise<void> {
    await this.apiFetch('/notifications/read-all', { method: 'PATCH', body: JSON.stringify({}) });
    this.notificationsCache = this.notificationsCache.map((n) => ({ ...n, is_read: true }));
    this.notifyListeners({
      type: 'NOTIFICATION_ADDED',
      source: 'COMMAND_CENTRE',
      payload: {},
      timestamp: new Date().toISOString(),
    });
  }
}

export const liveSync = new LiveSyncService();
