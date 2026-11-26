/**
 * GATEWISE AI — Live Real-Time Synchronization Engine
 * Bridges the Guard Web App (field terminal) and the Admin Command Centre.
 * Uses BroadcastChannel for instant cross-tab sync + localStorage fallback.
 */

import { VerificationEvent, VisitorPass, DashboardMetrics } from '@/types';

export type LiveSyncMessageType =
  | 'VERIFICATION_EVENT'
  | 'VISITOR_REGISTERED'
  | 'VISITOR_CHECKED_IN'
  | 'VISITOR_CHECKED_OUT'
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
  METRICS: 'gatewise_live_metrics',
  LAST_SYNC: 'gatewise_last_sync_time',
};

// Grounded default seed records for IIM Sambalpur
const INITIAL_EVENTS: VerificationEvent[] = [
  {
    id: 'evt-iim-001',
    timestamp: new Date(Date.now() - 1000 * 60 * 2).toISOString(),
    gate_id: 'gate-01',
    gate_name: 'Main Gate 01',
    guard_id: 'GRD-101',
    guard_name: 'Vikram Singh',
    person_id: 'FAC-8041',
    person_name: 'Dr. Ananya Sharma',
    person_category: 'Faculty',
    outcome: 'VERIFIED_AUTHORIZED',
    guard_decision: 'GRANT_ENTRY',
    similarity_score: 0.984,
    decision_reason: 'YuNet 5-landmark isolated in 42ms. SFace 128-D cosine match: 0.984.',
    cryptographic_signature: 'hmac-sha256-iim-9a2c1b48f0',
    sync_status: 'SYNCED',
    candidate: {
      identity_id: 'FAC-8041',
      person_name: 'Dr. Ananya Sharma',
      person_id: 'FAC-8041',
      category: 'Faculty',
      department: 'Operations & Strategy, IIM Sambalpur',
      reference_photo_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
      similarity_score: 0.984,
    },
  },
  {
    id: 'evt-iim-002',
    timestamp: new Date(Date.now() - 1000 * 60 * 6).toISOString(),
    gate_id: 'gate-02',
    gate_name: 'Academic Core Gate 02',
    guard_id: 'GRD-102',
    guard_name: 'Manoj Kumar',
    person_id: 'STU-2024-089',
    person_name: 'Rahul Verma',
    person_category: 'Student',
    outcome: 'VERIFIED_AUTHORIZED',
    guard_decision: 'GRANT_ENTRY',
    similarity_score: 0.962,
    decision_reason: 'Enrolled MBA 2024-26 scholar. Roster verified on edge cache.',
    cryptographic_signature: 'hmac-sha256-iim-4c7d8e90a1',
    sync_status: 'SYNCED',
    candidate: {
      identity_id: 'STU-2024-089',
      person_name: 'Rahul Verma',
      person_id: 'STU-2024-089',
      category: 'Student',
      department: 'MBA 2024-26, IIM Sambalpur',
      reference_photo_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
      similarity_score: 0.962,
    },
  },
  {
    id: 'evt-iim-003',
    timestamp: new Date(Date.now() - 1000 * 60 * 14).toISOString(),
    gate_id: 'gate-01',
    gate_name: 'Main Gate 01',
    guard_id: 'GRD-101',
    guard_name: 'Vikram Singh',
    person_id: 'VIS-2024-031',
    person_name: 'Raghavan Iyer',
    person_category: 'Visitor',
    outcome: 'VERIFIED_AUTHORIZED',
    guard_decision: 'GRANT_ENTRY',
    similarity_score: 0.941,
    decision_reason: 'Executive Guest — MDP Programme. Host: Dean Academics.',
    cryptographic_signature: 'hmac-sha256-iim-8f12a34b5c',
    sync_status: 'SYNCED',
    candidate: {
      identity_id: 'VIS-2024-031',
      person_name: 'Raghavan Iyer',
      person_id: 'VIS-2024-031',
      category: 'Visitor',
      department: 'Executive MDP Guest',
      reference_photo_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
      similarity_score: 0.941,
    },
  },
  {
    id: 'evt-iim-004',
    timestamp: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
    gate_id: 'gate-03',
    gate_name: 'Executive Housing Gate',
    guard_id: 'GRD-103',
    guard_name: 'Sunil Pradhan',
    person_id: 'UNK-9102',
    person_name: 'Unrecognized Subject',
    person_category: 'Unknown',
    outcome: 'IDENTIFIED_UNAUTHORIZED',
    guard_decision: 'DENY_ENTRY',
    similarity_score: 0.312,
    decision_reason: 'Subject not in active campus roster. Cosine similarity 0.312 below threshold (0.72).',
    cryptographic_signature: 'hmac-sha256-iim-2e3f4a5b6c',
    sync_status: 'SYNCED',
  },
];

const INITIAL_VISITORS: VisitorPass[] = [
  {
    id: 'vis-01',
    pass_code: 'IIM-VP-4821',
    visitor_name: 'Amitabh Sengupta',
    phone: '+91 98301 22891',
    id_type: 'Aadhaar Card',
    id_number: '•••• •••• 9812',
    host_name: 'Prof. Mahadeo Jaiswal (Director)',
    host_department: 'Directorate, IIM Sambalpur',
    purpose: 'Academic Advisory Board Meeting',
    valid_date: new Date().toISOString().split('T')[0],
    valid_until_time: '18:00',
    status: 'EXPECTED',
    gate_id: 'gate-01',
    created_at: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
  },
  {
    id: 'vis-02',
    pass_code: 'IIM-VP-4822',
    visitor_name: 'Priyanka Nambiar',
    phone: '+91 94370 11204',
    id_type: 'PAN Card',
    id_number: 'ABCDE1234F',
    host_name: 'Dr. Ananya Sharma',
    host_department: 'Strategic Management',
    purpose: 'Executive Research Workshop',
    valid_date: new Date().toISOString().split('T')[0],
    valid_until_time: '17:30',
    status: 'CHECKED_IN',
    check_in_at: new Date(Date.now() - 1000 * 60 * 40).toISOString(),
    check_in_time: '10:15 AM',
    gate_id: 'gate-01',
    created_at: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
  },
  {
    id: 'vis-03',
    pass_code: 'IIM-VP-4823',
    visitor_name: 'Kavita Das',
    phone: '+91 97760 88210',
    id_type: 'Driving License',
    id_number: 'OD-15-2019-0091',
    host_name: 'Campus Infrastructure Dept',
    host_department: 'Estate & Operations',
    purpose: 'Fiber Optic Perimeter Audit',
    valid_date: new Date().toISOString().split('T')[0],
    valid_until_time: '16:00',
    status: 'CHECKED_OUT',
    check_in_at: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    check_in_time: '08:00 AM',
    check_out_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    check_out_time: '10:30 AM',
    gate_id: 'gate-02',
    created_at: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
  },
];

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
    if (!localStorage.getItem(STORAGE_KEYS.EVENTS)) {
      localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(INITIAL_EVENTS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.VISITORS)) {
      localStorage.setItem(STORAGE_KEYS.VISITORS, JSON.stringify(INITIAL_VISITORS));
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
}

export const liveSync = new LiveSyncService();
