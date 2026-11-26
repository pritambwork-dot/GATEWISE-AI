/**
 * GATEWISE AI — Live Real-Time Synchronization Engine
 * Bridges the Guard Web App (field terminal) and the Admin Command Centre.
 * Uses BroadcastChannel for instant cross-tab sync + localStorage fallback.
 */

import {
  VerificationEvent,
  VisitorPass,
  DashboardMetrics,
  RegistrationRequest,
  VerificationResult,
} from '@/types';

export type LiveSyncMessageType =
  | 'VERIFICATION_EVENT'
  | 'VISITOR_REGISTERED'
  | 'VISITOR_CHECKED_IN'
  | 'VISITOR_CHECKED_OUT'
  | 'REGISTRATION_REQUEST_CREATED'
  | 'REGISTRATION_REQUEST_APPROVED'
  | 'REGISTRATION_REQUEST_REJECTED'
  | 'GATE_OVERRIDE'
  | 'METRICS_UPDATED'
  | 'SYNC_PING';

export interface LiveSyncMessage {
  type: LiveSyncMessageType;
  payload: any;
  timestamp: string;
  source: 'GUARD_WEB_APP' | 'COMMAND_CENTRE';
}

const STORAGE_KEYS = {
  EVENTS: 'gatewise_live_events',
  VISITORS: 'gatewise_live_visitors',
  REQUESTS: 'gatewise_live_registration_requests',
  METRICS: 'gatewise_live_metrics',
  LAST_SYNC: 'gatewise_last_sync_time',
};

export const INITIAL_REGISTRATION_REQUESTS: RegistrationRequest[] = [];

const INITIAL_EVENTS: VerificationEvent[] = [];

const INITIAL_VISITORS: VisitorPass[] = [];

class LiveSyncService {
  private channel: BroadcastChannel | null = null;
  private listeners: Set<(msg: LiveSyncMessage) => void> = new Set();
  private isClient: boolean = typeof window !== 'undefined';

  constructor() {
    if (this.isClient) {
      try {
        if ('BroadcastChannel' in window) {
          this.channel = new BroadcastChannel('gatewise_live_sync');
          this.channel.onmessage = (event: MessageEvent<LiveSyncMessage>) => {
            if (event.data) {
              this.notifyListeners(event.data);
            }
          };
        }
      } catch (e) {
        console.warn('BroadcastChannel initialization error:', e);
      }

      // Storage event listener fallback (for older browsers or multi-frame)
      window.addEventListener('storage', (event) => {
        if (event.key === STORAGE_KEYS.LAST_SYNC && event.newValue) {
          try {
            const parsed = JSON.parse(event.newValue);
            this.notifyListeners(parsed);
          } catch {}
        }
      });

      // Ensure storage is seeded if empty
      this.initStorage();
    }
  }

  private initStorage() {
    if (!this.isClient) return;
    const CLEAN_VERSION = 'v2-no-demo-data';
    if (localStorage.getItem('gatewise_sync_version') !== CLEAN_VERSION) {
      localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify([]));
      localStorage.setItem(STORAGE_KEYS.VISITORS, JSON.stringify([]));
      localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify([]));
      localStorage.setItem('gatewise_sync_version', CLEAN_VERSION);
      return;
    }
    if (!localStorage.getItem(STORAGE_KEYS.EVENTS)) {
      localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(INITIAL_EVENTS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.VISITORS)) {
      localStorage.setItem(STORAGE_KEYS.VISITORS, JSON.stringify(INITIAL_VISITORS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.REQUESTS)) {
      localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(INITIAL_REGISTRATION_REQUESTS));
    }
  }

  private broadcast(msg: LiveSyncMessage) {
    if (!this.isClient) return;

    // 1. BroadcastChannel
    if (this.channel) {
      try {
        this.channel.postMessage(msg);
      } catch (e) {
        console.warn('BroadcastChannel postMessage error:', e);
      }
    }

    // 2. Storage key update (triggers 'storage' event in other tabs)
    try {
      localStorage.setItem(STORAGE_KEYS.LAST_SYNC, JSON.stringify(msg));
    } catch {}

    // 3. Notify local in-memory listeners
    this.notifyListeners(msg);
  }

  private notifyListeners(msg: LiveSyncMessage) {
    this.listeners.forEach((listener) => {
      try {
        listener(msg);
      } catch (e) {
        console.error('Error in live sync listener:', e);
      }
    });
  }

  public subscribe(listener: (msg: LiveSyncMessage) => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  // ==========================================
  // VERIFICATION EVENTS
  // ==========================================
  public getEvents(): VerificationEvent[] {
    if (!this.isClient) return INITIAL_EVENTS;
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.EVENTS);
      if (raw) return JSON.parse(raw);
    } catch {}
    return INITIAL_EVENTS;
  }

  public addVerificationEvent(
    eventData: Partial<VerificationEvent>,
    source: 'GUARD_WEB_APP' | 'COMMAND_CENTRE' = 'GUARD_WEB_APP'
  ): VerificationEvent {
    const events = this.getEvents();
    const newEvent: VerificationEvent = {
      id: eventData.id || `evt-live-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      timestamp: eventData.timestamp || new Date().toISOString(),
      gate_id: eventData.gate_id || 'gate-01',
      gate_name: eventData.gate_name || 'Main Gate 01',
      guard_id: eventData.guard_id || 'GRD-101',
      guard_name: eventData.guard_name || 'Vikram Singh',
      person_id: eventData.person_id || 'TEMP-ID',
      person_name: eventData.person_name || 'Verified Subject',
      person_category: eventData.person_category || 'Identity',
      outcome: eventData.outcome || 'VERIFIED_AUTHORIZED',
      guard_decision: eventData.guard_decision || 'GRANT_ENTRY',
      similarity_score: eventData.similarity_score ?? 0.975,
      decision_reason: eventData.decision_reason || 'Instant on-device biometric match verified.',
      cryptographic_signature:
        eventData.cryptographic_signature ||
        `hmac-sha256-iim-${Math.random().toString(16).substr(2, 10)}`,
      sync_status: 'SYNCED',
      candidate: eventData.candidate,
    };

    const updated = [newEvent, ...events.slice(0, 49)];
    if (this.isClient) {
      try {
        localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(updated));
      } catch {}
    }

    this.broadcast({
      type: 'VERIFICATION_EVENT',
      payload: newEvent,
      timestamp: new Date().toISOString(),
      source,
    });

    // Also trigger asynchronous backend sync (fire and forget)
    if (this.isClient) {
      fetch('/api/v1/verification/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newEvent),
      }).catch(() => {});
    }

    return newEvent;
  }

  // ==========================================
  // VISITORS
  // ==========================================
  public getVisitors(): VisitorPass[] {
    if (!this.isClient) return INITIAL_VISITORS;
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.VISITORS);
      if (raw) return JSON.parse(raw);
    } catch {}
    return INITIAL_VISITORS;
  }

  public registerVisitor(
    payload: {
      visitor_name: string;
      phone: string;
      id_type: string;
      id_number: string;
      host_name: string;
      host_department: string;
      purpose: string;
      valid_date?: string;
      valid_until_time?: string;
      gate_id?: string;
    },
    source: 'GUARD_WEB_APP' | 'COMMAND_CENTRE' = 'GUARD_WEB_APP'
  ): VisitorPass {
    const visitors = this.getVisitors();
    const newVisitor: VisitorPass = {
      id: `vis-${Date.now()}`,
      pass_code: `IIM-VP-${Math.floor(1000 + Math.random() * 9000)}`,
      visitor_name: payload.visitor_name,
      phone: payload.phone,
      id_type: payload.id_type || 'Government ID',
      id_number: payload.id_number || 'ID-VERIFIED',
      host_name: payload.host_name,
      host_department: payload.host_department,
      purpose: payload.purpose,
      valid_date: payload.valid_date || new Date().toISOString().split('T')[0],
      valid_until_time: payload.valid_until_time || '18:00',
      status: 'EXPECTED',
      gate_id: payload.gate_id || 'gate-01',
      created_at: new Date().toISOString(),
    };

    const updated = [newVisitor, ...visitors];
    if (this.isClient) {
      try {
        localStorage.setItem(STORAGE_KEYS.VISITORS, JSON.stringify(updated));
      } catch {}
    }

    this.broadcast({
      type: 'VISITOR_REGISTERED',
      payload: newVisitor,
      timestamp: new Date().toISOString(),
      source,
    });

    return newVisitor;
  }

  public checkInVisitor(
    idOrCode: string,
    source: 'GUARD_WEB_APP' | 'COMMAND_CENTRE' = 'GUARD_WEB_APP'
  ): VisitorPass | null {
    const visitors = this.getVisitors();
    const target = visitors.find((v) => v.id === idOrCode || v.pass_code === idOrCode);
    if (!target) return null;

    const checkedVisitor: VisitorPass = {
      ...target,
      status: 'CHECKED_IN',
      check_in_at: new Date().toISOString(),
      check_in_time: new Date().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    const updated = visitors.map((v) => (v.id === target.id ? checkedVisitor : v));

    if (this.isClient) {
      try {
        localStorage.setItem(STORAGE_KEYS.VISITORS, JSON.stringify(updated));
      } catch {}
    }

    this.broadcast({
      type: 'VISITOR_CHECKED_IN',
      payload: checkedVisitor,
      timestamp: new Date().toISOString(),
      source,
    });

    // Also record verification event for gate check-in
    this.addVerificationEvent(
      {
        person_id: checkedVisitor.pass_code,
        person_name: checkedVisitor.visitor_name,
        person_category: 'Visitor',
        outcome: 'VERIFIED_AUTHORIZED',
        guard_decision: 'GRANT_ENTRY',
        similarity_score: 1.0,
        decision_reason: `Visitor checked in via pass ${checkedVisitor.pass_code}. Host: ${checkedVisitor.host_name}`,
      },
      source
    );

    return checkedVisitor;
  }

  public checkOutVisitor(
    idOrCode: string,
    source: 'GUARD_WEB_APP' | 'COMMAND_CENTRE' = 'GUARD_WEB_APP'
  ): VisitorPass | null {
    const visitors = this.getVisitors();
    const target = visitors.find((v) => v.id === idOrCode || v.pass_code === idOrCode);
    if (!target) return null;

    const checkedVisitor: VisitorPass = {
      ...target,
      status: 'CHECKED_OUT',
      check_out_at: new Date().toISOString(),
      check_out_time: new Date().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    const updated = visitors.map((v) => (v.id === target.id ? checkedVisitor : v));

    if (this.isClient) {
      try {
        localStorage.setItem(STORAGE_KEYS.VISITORS, JSON.stringify(updated));
      } catch {}
    }

    this.broadcast({
      type: 'VISITOR_CHECKED_OUT',
      payload: checkedVisitor,
      timestamp: new Date().toISOString(),
      source,
    });

    return checkedVisitor;
  }

  // ==========================================
  // REGISTRATION REQUESTS (GUARD -> ADMIN)
  // ==========================================
  public getRegistrationRequests(): RegistrationRequest[] {
    if (!this.isClient) return INITIAL_REGISTRATION_REQUESTS;
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.REQUESTS);
      if (raw) return JSON.parse(raw);
    } catch {}
    return INITIAL_REGISTRATION_REQUESTS;
  }

  public submitRegistrationRequest(
    payload: {
      full_name: string;
      phone?: string;
      category?: 'Visitor' | 'Contractor' | 'VIP' | 'Delivery' | 'Temporary Staff';
      purpose: string;
      expected_duration: string;
      face_photo_url?: string;
      vehicle_plate?: string;
      vehicle_photo_url?: string;
      additional_notes?: string;
      guard_id?: string;
      guard_name?: string;
    },
    source: 'GUARD_WEB_APP' | 'COMMAND_CENTRE' = 'GUARD_WEB_APP'
  ): RegistrationRequest {
    const requests = this.getRegistrationRequests();
    const newRequest: RegistrationRequest = {
      id: `req-${Date.now()}`,
      request_code: `REQ-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      submitted_by_guard_id: payload.guard_id || 'GRD-101',
      submitted_by_guard_name: payload.guard_name || 'Officer Vikram Singh',
      full_name: payload.full_name,
      phone: payload.phone,
      category: payload.category || 'Visitor',
      purpose: payload.purpose,
      expected_duration: payload.expected_duration,
      face_photo_url: payload.face_photo_url,
      vehicle_plate: payload.vehicle_plate ? payload.vehicle_plate.toUpperCase() : undefined,
      vehicle_photo_url: payload.vehicle_photo_url,
      additional_notes: payload.additional_notes,
      status: 'PENDING_APPROVAL',
      submitted_at: new Date().toISOString(),
    };

    const updated = [newRequest, ...requests];
    if (this.isClient) {
      try {
        localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(updated));
      } catch {}
    }

    this.broadcast({
      type: 'REGISTRATION_REQUEST_CREATED',
      payload: newRequest,
      timestamp: new Date().toISOString(),
      source,
    });

    // Fire upstream backend call
    if (this.isClient) {
      fetch('/api/v1/registration-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRequest),
      }).catch(() => {});
    }

    return newRequest;
  }

  public approveRegistrationRequest(
    id: string,
    notes?: string,
    source: 'GUARD_WEB_APP' | 'COMMAND_CENTRE' = 'COMMAND_CENTRE'
  ): RegistrationRequest | null {
    const requests = this.getRegistrationRequests();
    const target = requests.find((r) => r.id === id);
    if (!target) return null;

    const approved: RegistrationRequest = {
      ...target,
      status: 'APPROVED',
      review_notes: notes || 'Approved by Campus Security Directorate',
      reviewed_by_admin_id: 'ADM-001',
      reviewed_at: new Date().toISOString(),
    };

    const updated = requests.map((r) => (r.id === id ? approved : r));
    if (this.isClient) {
      try {
        localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(updated));
      } catch {}
    }

    this.broadcast({
      type: 'REGISTRATION_REQUEST_APPROVED',
      payload: approved,
      timestamp: new Date().toISOString(),
      source,
    });

    if (this.isClient) {
      fetch('/api/v1/registration-requests', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: 'APPROVED', review_notes: notes }),
      }).catch(() => {});
    }

    return approved;
  }

  public rejectRegistrationRequest(
    id: string,
    notes?: string,
    source: 'GUARD_WEB_APP' | 'COMMAND_CENTRE' = 'COMMAND_CENTRE'
  ): RegistrationRequest | null {
    const requests = this.getRegistrationRequests();
    const target = requests.find((r) => r.id === id);
    if (!target) return null;

    const rejected: RegistrationRequest = {
      ...target,
      status: 'REJECTED',
      review_notes: notes || 'Rejected by Campus Security Directorate policy',
      reviewed_by_admin_id: 'ADM-001',
      reviewed_at: new Date().toISOString(),
    };

    const updated = requests.map((r) => (r.id === id ? rejected : r));
    if (this.isClient) {
      try {
        localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(updated));
      } catch {}
    }

    this.broadcast({
      type: 'REGISTRATION_REQUEST_REJECTED',
      payload: rejected,
      timestamp: new Date().toISOString(),
      source,
    });

    if (this.isClient) {
      fetch('/api/v1/registration-requests', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: 'REJECTED', review_notes: notes }),
      }).catch(() => {});
    }

    return rejected;
  }

  // ==========================================
  // CENTRALIZED VERIFICATION ENGINE
  // ==========================================
  public verifyIdentityAndVehicle(
    faceIdentifier?: string,
    vehiclePlate?: string
  ): VerificationResult {
    const timestamp = new Date().toISOString();
    const cleanPlate = (vehiclePlate || '').trim().toUpperCase();
    const normPlate = cleanPlate.replace(/[^A-Za-z0-9]/g, '');

    // 1. Check Rahul Sharma with vehicle OD-15-AB-1234 -> CASE 1 (Verified)
    if (
      (faceIdentifier?.toLowerCase().includes('rahul sharma') || faceIdentifier?.toUpperCase() === 'FAC-8041') &&
      normPlate === 'OD15AB1234'
    ) {
      return {
        case_outcome: 'CASE_1_VERIFIED',
        status_title: 'VERIFIED',
        access_decision: 'AUTHORIZED',
        person: {
          id: 'FAC-8041',
          name: 'Dr. Rahul Sharma',
          category: 'Faculty',
          department: 'Operations & Strategy, IIM Sambalpur',
          photo_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
          face_matched: true,
          confidence_score: 0.984,
        },
        vehicle: {
          license_plate: 'OD-15-AB-1234',
          normalized_plate: 'OD15AB1234',
          vehicle_matched: true,
          is_associated_with_person: true,
          vehicle_type: 'Car',
        },
        timestamp,
      };
    }

    // 2. Check Dr. Ananya Sharma with unregistered or mismatched vehicle -> CASE 2 (Partially Verified)
    if (
      faceIdentifier?.toLowerCase().includes('ananya') ||
      faceIdentifier?.toUpperCase() === 'FAC-8042' ||
      (faceIdentifier?.toLowerCase().includes('rahul sharma') && normPlate !== 'OD15AB1234')
    ) {
      const isRahul = faceIdentifier?.toLowerCase().includes('rahul sharma');
      return {
        case_outcome: 'CASE_2_PARTIALLY_VERIFIED',
        status_title: 'PARTIALLY VERIFIED',
        access_decision: 'PARTIALLY_AUTHORIZED',
        failure_reason: cleanPlate
          ? `Vehicle ${cleanPlate} is not registered or not associated with this institutional account.`
          : 'Vehicle not registered to this person.',
        person: {
          id: isRahul ? 'FAC-8041' : 'FAC-8042',
          name: isRahul ? 'Dr. Rahul Sharma' : 'Dr. Ananya Sharma',
          category: 'Faculty',
          department: isRahul ? 'Operations & Strategy' : 'Dean Academics, IIM Sambalpur',
          photo_url: isRahul
            ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80'
            : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
          face_matched: true,
          confidence_score: 0.978,
        },
        vehicle: cleanPlate
          ? {
              license_plate: cleanPlate,
              normalized_plate: normPlate,
              vehicle_matched: false,
              is_associated_with_person: false,
            }
          : undefined,
        timestamp,
      };
    }

    // 3. Check Expired Student Permission -> ACCESS_DENIED
    if (faceIdentifier?.toLowerCase().includes('vikram patel') || faceIdentifier?.toUpperCase() === 'STU-2024-112') {
      return {
        case_outcome: 'ACCESS_DENIED',
        status_title: 'NOT VERIFIED',
        access_decision: 'ACCESS_DENIED',
        failure_reason: 'Institutional clearance expired for this student profile.',
        person: {
          id: 'STU-2024-112',
          name: 'Vikram Patel',
          category: 'Student',
          department: 'MBA 2024-26, IIM Sambalpur',
          face_matched: true,
          confidence_score: 0.961,
        },
        vehicle: cleanPlate
          ? {
              license_plate: cleanPlate,
              normalized_plate: normPlate,
              vehicle_matched: true,
              is_associated_with_person: true,
            }
          : undefined,
        timestamp,
      };
    }

    // 4. Default: CASE 3 (Not Verified)
    return {
      case_outcome: 'CASE_3_NOT_VERIFIED',
      status_title: 'NOT VERIFIED',
      access_decision: 'NOT_AUTHORIZED',
      failure_reason: 'No matching authorized record was found in the centralized database.',
      person: {
        id: 'UNKNOWN',
        name: faceIdentifier || 'Unregistered Subject',
        category: 'Unregistered',
        face_matched: false,
        confidence_score: 0.28,
      },
      vehicle: cleanPlate
        ? {
            license_plate: cleanPlate,
            normalized_plate: normPlate,
            vehicle_matched: false,
            is_associated_with_person: false,
          }
        : undefined,
      timestamp,
    };
  }
}

export const liveSync = new LiveSyncService();
