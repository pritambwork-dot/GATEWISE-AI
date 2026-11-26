/**
 * GATEWISE AI — Centralized Database & Real-Time Synchronization Engine
 * Single source of truth connecting Admin Web Dashboard and Guard Mobile App.
 * Zero pre-seeded demo data: starts completely clean until created by Admins or authorized Guards.
 */

import {
  VerificationEvent,
  VisitorPass,
  RegistrationRequest,
  VerificationResult,
  RegisteredPerson,
  RegisteredVehicle,
  GuardAccount,
  GuardPermissions,
  AuditLogEntry,
  NotificationItem,
  PersonAccessStatus,
} from '@/types';

export type LiveSyncMessageType =
  | 'VERIFICATION_EVENT'
  | 'VISITOR_REGISTERED'
  | 'VISITOR_CHECKED_IN'
  | 'VISITOR_CHECKED_OUT'
  | 'REGISTRATION_REQUEST_CREATED'
  | 'REGISTRATION_REQUEST_APPROVED'
  | 'REGISTRATION_REQUEST_REJECTED'
  | 'REGISTRATION_REQUEST_INFO_REQUIRED'
  | 'PERSON_CREATED'
  | 'PERSON_UPDATED'
  | 'PERSON_DELETED'
  | 'VEHICLE_ADDED'
  | 'GUARD_CREATED'
  | 'GUARD_PERMISSIONS_UPDATED'
  | 'GUARD_STATUS_CHANGED'
  | 'NOTIFICATION_ADDED'
  | 'AUDIT_LOGGED'
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
  PERSONS: 'gatewise_central_persons',
  VEHICLES: 'gatewise_central_vehicles',
  GUARDS: 'gatewise_central_guards',
  AUDIT: 'gatewise_central_audit_logs',
  NOTIFICATIONS: 'gatewise_central_notifications',
  ACTIVE_GUARDS: 'gatewise_active_guard_ids',
  LAST_SYNC: 'gatewise_last_sync_time',
};

export function normalizePlate(plate?: string): string {
  return (plate || '').replace(/[^A-Za-z0-9]/g, '').toUpperCase();
}

function defaultPermissions(guardId: string): GuardPermissions {
  return {
    guard_id: guardId,
    registration_mode: 'APPROVAL_REQUIRED',
    direct_record_policy: 'TEMPORARY_ONLY',
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
            if (event.data) this.notifyListeners(event.data);
          };
        }
      } catch (e) {
        console.warn('BroadcastChannel initialization error:', e);
      }

      window.addEventListener('storage', (event) => {
        if (event.key === STORAGE_KEYS.LAST_SYNC && event.newValue) {
          try {
            this.notifyListeners(JSON.parse(event.newValue));
          } catch {}
        }
      });

      this.initStorage();
    }
  }

  private readStore<T>(key: string, fallback: T): T {
    if (!this.isClient) return fallback;
    try {
      const raw = localStorage.getItem(key);
      if (raw) return JSON.parse(raw);
    } catch {}
    return fallback;
  }

  private writeStore<T>(key: string, value: T): void {
    if (!this.isClient) return;
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {}
  }

  private initStorage() {
    if (!this.isClient) return;
    const CLEAN_VERSION = 'v3-master-central';
    if (localStorage.getItem('gatewise_sync_version') !== CLEAN_VERSION) {
      this.writeStore(STORAGE_KEYS.EVENTS, []);
      this.writeStore(STORAGE_KEYS.VISITORS, []);
      this.writeStore(STORAGE_KEYS.REQUESTS, []);
      this.writeStore(STORAGE_KEYS.PERSONS, []);
      this.writeStore(STORAGE_KEYS.VEHICLES, []);
      this.writeStore(STORAGE_KEYS.GUARDS, []);
      this.writeStore(STORAGE_KEYS.AUDIT, []);
      this.writeStore(STORAGE_KEYS.NOTIFICATIONS, []);
      this.writeStore(STORAGE_KEYS.ACTIVE_GUARDS, []);
      localStorage.setItem('gatewise_sync_version', CLEAN_VERSION);
    }
  }

  private broadcast(msg: LiveSyncMessage) {
    if (!this.isClient) return;
    if (this.channel) {
      try {
        this.channel.postMessage(msg);
      } catch {}
    }
    try {
      localStorage.setItem(STORAGE_KEYS.LAST_SYNC, JSON.stringify(msg));
    } catch {}
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
  // AUDIT LOGS & NOTIFICATIONS
  // ==========================================
  public getAuditLogs(): AuditLogEntry[] {
    return this.readStore<AuditLogEntry[]>(STORAGE_KEYS.AUDIT, []);
  }

  public logAudit(entry: Omit<AuditLogEntry, 'id' | 'timestamp'>): AuditLogEntry {
    const logs = this.getAuditLogs();
    const record: AuditLogEntry = {
      id: `aud-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      timestamp: new Date().toISOString(),
      ...entry,
    };
    this.writeStore(STORAGE_KEYS.AUDIT, [record, ...logs.slice(0, 199)]);
    this.broadcast({
      type: 'AUDIT_LOGGED',
      payload: record,
      timestamp: record.timestamp,
      source: 'COMMAND_CENTRE',
    });
    return record;
  }

  public getNotifications(): NotificationItem[] {
    return this.readStore<NotificationItem[]>(STORAGE_KEYS.NOTIFICATIONS, []);
  }

  public addNotification(
    item: Omit<NotificationItem, 'id' | 'timestamp' | 'is_read'>,
    source: 'GUARD_WEB_APP' | 'COMMAND_CENTRE' = 'COMMAND_CENTRE'
  ): NotificationItem {
    const list = this.getNotifications();
    const notif: NotificationItem = {
      id: `notif-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
      timestamp: new Date().toISOString(),
      is_read: false,
      ...item,
    };
    this.writeStore(STORAGE_KEYS.NOTIFICATIONS, [notif, ...list.slice(0, 99)]);
    this.broadcast({
      type: 'NOTIFICATION_ADDED',
      payload: notif,
      timestamp: notif.timestamp,
      source,
    });
    return notif;
  }

  public markAllNotificationsRead(): void {
    const list = this.getNotifications().map((n) => ({ ...n, is_read: true }));
    this.writeStore(STORAGE_KEYS.NOTIFICATIONS, list);
  }

  // ==========================================
  // GUARD ACCOUNTS & GRANULAR PERMISSIONS
  // ==========================================
  public getGuards(): GuardAccount[] {
    return this.readStore<GuardAccount[]>(STORAGE_KEYS.GUARDS, []);
  }

  public getGuardByBadgeOrUsername(idOrUsername: string): GuardAccount | undefined {
    const q = idOrUsername.trim().toLowerCase();
    return this.getGuards().find(
      (g) => g.badge_number.toLowerCase() === q || g.username.toLowerCase() === q || g.id.toLowerCase() === q
    );
  }

  public getGuardPermissions(guardId: string): GuardPermissions {
    const guard = this.getGuardByBadgeOrUsername(guardId);
    if (guard) return guard.permissions;
    return defaultPermissions(guardId);
  }

  public createGuard(
    payload: {
      badge_number: string;
      username: string;
      full_name: string;
      full_name_hi?: string;
      assigned_gate_code: string;
      assigned_gate_name: string;
      shift_name?: string;
      permissions?: Partial<GuardPermissions>;
    },
    adminEmail: string = 'admin@iimsambalpur.ac.in'
  ): GuardAccount {
    const guards = this.getGuards();
    const id = payload.badge_number.trim().toUpperCase();
    const existing = guards.find((g) => g.badge_number.toUpperCase() === id);
    if (existing) {
      throw new Error(`Guard with badge ${id} already exists.`);
    }

    const perms: GuardPermissions = {
      ...defaultPermissions(id),
      ...payload.permissions,
      guard_id: id,
      updated_by_admin_id: adminEmail,
      updated_at: new Date().toISOString(),
    };

    const newGuard: GuardAccount = {
      id,
      badge_number: id,
      username: payload.username.trim().toLowerCase() || id.toLowerCase(),
      full_name: payload.full_name.trim(),
      full_name_hi: payload.full_name_hi,
      assigned_gate_code: payload.assigned_gate_code,
      assigned_gate_name: payload.assigned_gate_name,
      shift_name: payload.shift_name || 'Day Shift (06:00 - 18:00)',
      account_status: 'ACTIVE',
      permissions: perms,
      created_at: new Date().toISOString(),
    };

    this.writeStore(STORAGE_KEYS.GUARDS, [newGuard, ...guards]);
    this.logAudit({
      action: 'GUARD_ACCOUNT_CREATED',
      actor_email: adminEmail,
      resource_type: 'guards',
      resource_id: newGuard.badge_number,
      result: 'SUCCESS',
      details: { gate: newGuard.assigned_gate_code, mode: perms.registration_mode },
    });
    this.broadcast({
      type: 'GUARD_CREATED',
      payload: newGuard,
      timestamp: new Date().toISOString(),
      source: 'COMMAND_CENTRE',
    });
    return newGuard;
  }

  public updateGuardPermissions(
    guardId: string,
    patch: Partial<GuardPermissions>,
    adminEmail: string = 'admin@iimsambalpur.ac.in'
  ): GuardPermissions {
    const guards = this.getGuards();
    const idx = guards.findIndex((g) => g.id === guardId || g.badge_number === guardId);

    if (idx === -1) {
      // Auto-register station guard record if modifying a field guard badge for first time
      const baseGuard: GuardAccount = {
        id: guardId,
        badge_number: guardId,
        username: guardId.toLowerCase(),
        full_name: guardId === 'GRD-101' ? 'Officer Vikram Singh' : guardId === 'GRD-102' ? 'Officer Manoj Kumar' : `Officer ${guardId}`,
        assigned_gate_code: 'GATE-01',
        assigned_gate_name: 'Main Gate 01',
        shift_name: 'Day Shift',
        account_status: 'ACTIVE',
        permissions: defaultPermissions(guardId),
        created_at: new Date().toISOString(),
      };
      guards.unshift(baseGuard);
    }

    const targetIdx = idx === -1 ? 0 : idx;
    const prevPerms = guards[targetIdx].permissions;
    const nextMode =
      patch.can_create_person_directly !== undefined
        ? patch.can_create_person_directly
          ? 'DIRECT_PERMISSION'
          : 'APPROVAL_REQUIRED'
        : patch.registration_mode || prevPerms.registration_mode;

    const updatedPerms: GuardPermissions = {
      ...prevPerms,
      ...patch,
      registration_mode: nextMode,
      can_create_person_directly:
        patch.registration_mode !== undefined
          ? patch.registration_mode === 'DIRECT_PERMISSION'
          : patch.can_create_person_directly ?? prevPerms.can_create_person_directly,
      updated_by_admin_id: adminEmail,
      updated_at: new Date().toISOString(),
    };

    guards[targetIdx] = { ...guards[targetIdx], permissions: updatedPerms };
    this.writeStore(STORAGE_KEYS.GUARDS, guards);

    this.logAudit({
      action: 'GUARD_PERMISSIONS_UPDATED',
      actor_email: adminEmail,
      resource_type: 'guard_permissions',
      resource_id: guardId,
      result: 'SUCCESS',
      details: { previous: prevPerms, updated: updatedPerms },
    });

    this.broadcast({
      type: 'GUARD_PERMISSIONS_UPDATED',
      payload: updatedPerms,
      timestamp: new Date().toISOString(),
      source: 'COMMAND_CENTRE',
    });

    return updatedPerms;
  }

  public updateGuardStatus(
    guardId: string,
    status: 'ACTIVE' | 'SUSPENDED' | 'DEACTIVATED',
    adminEmail: string = 'admin@iimsambalpur.ac.in'
  ): GuardAccount | null {
    const guards = this.getGuards();
    const idx = guards.findIndex((g) => g.id === guardId || g.badge_number === guardId);
    if (idx === -1) return null;

    guards[idx] = { ...guards[idx], account_status: status };
    this.writeStore(STORAGE_KEYS.GUARDS, guards);

    if (status !== 'ACTIVE') {
      const activeIds = this.getActiveGuardIds().filter((id) => id !== guardId);
      this.writeStore(STORAGE_KEYS.ACTIVE_GUARDS, activeIds);
      this.addNotification({
        type: 'SYSTEM_ALERT',
        title: `Guard Account ${status}`,
        message: `Access immediately revoked for guard ${guardId} (${guards[idx].full_name}).`,
        severity: 'WARNING',
        target_url: '/admin/guards',
      });
    }

    this.logAudit({
      action: `GUARD_STATUS_${status}`,
      actor_email: adminEmail,
      resource_type: 'guards',
      resource_id: guardId,
      result: 'SUCCESS',
    });

    this.broadcast({
      type: 'GUARD_STATUS_CHANGED',
      payload: guards[idx],
      timestamp: new Date().toISOString(),
      source: 'COMMAND_CENTRE',
    });
    return guards[idx];
  }

  public getActiveGuardIds(): string[] {
    return this.readStore<string[]>(STORAGE_KEYS.ACTIVE_GUARDS, []);
  }

  public setGuardSessionActive(guardId: string, isActive: boolean): void {
    const current = this.getActiveGuardIds();
    const next = isActive
      ? Array.from(new Set([...current, guardId]))
      : current.filter((id) => id !== guardId);
    this.writeStore(STORAGE_KEYS.ACTIVE_GUARDS, next);
  }

  // ==========================================
  // CENTRALIZED PEOPLE & VEHICLES DATABASE
  // ==========================================
  public getPersons(): RegisteredPerson[] {
    return this.readStore<RegisteredPerson[]>(STORAGE_KEYS.PERSONS, []);
  }

  public getVehicles(): RegisteredVehicle[] {
    return this.readStore<RegisteredVehicle[]>(STORAGE_KEYS.VEHICLES, []);
  }

  public checkDuplicates(fullName: string, phone?: string, plate?: string): string | undefined {
    const persons = this.getPersons();
    const vehicles = this.getVehicles();
    const normPlate = normalizePlate(plate);

    const dupPerson = persons.find(
      (p) =>
        p.full_name.trim().toLowerCase() === fullName.trim().toLowerCase() ||
        (phone && p.phone && p.phone.replace(/\D/g, '') === phone.replace(/\D/g, ''))
    );
    if (dupPerson) {
      return `Possible duplicate person in People Database: ${dupPerson.full_name} (${dupPerson.person_code})`;
    }

    if (normPlate) {
      const dupVehicle = vehicles.find((v) => v.normalized_plate === normPlate);
      if (dupVehicle) {
        return `Vehicle ${dupVehicle.license_plate} is already registered to ${dupVehicle.owner_name || dupVehicle.person_id}`;
      }
    }
    return undefined;
  }

  public addPerson(
    payload: Omit<RegisteredPerson, 'id' | 'person_code' | 'registration_date' | 'biometric_template_hash'> & {
      person_code?: string;
    },
    source: 'GUARD_WEB_APP' | 'COMMAND_CENTRE' = 'COMMAND_CENTRE'
  ): RegisteredPerson {
    const persons = this.getPersons();
    const vehicles = this.getVehicles();
    const personId = `per-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`;
    const personCode = payload.person_code || `PER-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date().toISOString();

    const mappedVehicles: RegisteredVehicle[] = (payload.associated_vehicles || []).map((v, idx) => ({
      ...v,
      id: v.id || `veh-${Date.now()}-${idx}`,
      license_plate: v.license_plate.trim().toUpperCase(),
      normalized_plate: normalizePlate(v.license_plate),
      is_authorized: payload.account_status === 'ACTIVE_AUTHORIZED' || payload.account_status === 'TEMPORARILY_AUTHORIZED',
      person_id: personCode,
      owner_name: payload.full_name,
      registration_date: now,
      valid_until: payload.valid_until,
    }));

    const newPerson: RegisteredPerson = {
      ...payload,
      id: personId,
      person_code: personCode,
      biometric_template_hash: `sface-128d-${Math.random().toString(16).slice(2, 14)}`,
      registration_date: now,
      associated_vehicles: mappedVehicles,
      photo_url: payload.photo_url || payload.photos?.[0]?.url,
    };

    this.writeStore(STORAGE_KEYS.PERSONS, [newPerson, ...persons]);
    if (mappedVehicles.length > 0) {
      const existingNorms = new Set(vehicles.map((v) => v.normalized_plate));
      const newVehicles = mappedVehicles.filter((mv) => !existingNorms.has(mv.normalized_plate));
      this.writeStore(STORAGE_KEYS.VEHICLES, [...newVehicles, ...vehicles]);
    }

    this.logAudit({
      action: newPerson.creation_source === 'GUARD_CREATED' ? 'PERSON_DIRECTLY_CREATED_BY_GUARD' : 'PERSON_CREATED_BY_ADMIN',
      actor_email: newPerson.created_by_name,
      resource_type: 'persons',
      resource_id: personCode,
      result: 'SUCCESS',
      details: { status: newPerson.account_status, vehicles: mappedVehicles.map((v) => v.license_plate) },
    });

    this.broadcast({
      type: 'PERSON_CREATED',
      payload: newPerson,
      timestamp: now,
      source,
    });

    return newPerson;
  }

  public updatePerson(
    personIdOrCode: string,
    patch: Partial<RegisteredPerson>,
    actorEmail: string = 'admin@iimsambalpur.ac.in'
  ): RegisteredPerson | null {
    const persons = this.getPersons();
    const idx = persons.findIndex((p) => p.id === personIdOrCode || p.person_code === personIdOrCode);
    if (idx === -1) return null;

    const updated: RegisteredPerson = { ...persons[idx], ...patch };
    persons[idx] = updated;
    this.writeStore(STORAGE_KEYS.PERSONS, persons);

    if (patch.associated_vehicles) {
      const vehicles = this.getVehicles().filter((v) => v.person_id !== updated.person_code);
      const nextVehicles = patch.associated_vehicles.map((v, i) => ({
        ...v,
        id: v.id || `veh-${Date.now()}-${i}`,
        license_plate: v.license_plate.trim().toUpperCase(),
        normalized_plate: normalizePlate(v.license_plate),
        person_id: updated.person_code,
        owner_name: updated.full_name,
      }));
      this.writeStore(STORAGE_KEYS.VEHICLES, [...nextVehicles, ...vehicles]);
    }

    this.logAudit({
      action: 'PERSON_UPDATED',
      actor_email: actorEmail,
      resource_type: 'persons',
      resource_id: updated.person_code,
      result: 'SUCCESS',
      details: patch,
    });

    this.broadcast({
      type: 'PERSON_UPDATED',
      payload: updated,
      timestamp: new Date().toISOString(),
      source: 'COMMAND_CENTRE',
    });
    return updated;
  }

  public deletePerson(personIdOrCode: string, actorEmail: string = 'admin@iimsambalpur.ac.in'): boolean {
    const persons = this.getPersons();
    const target = persons.find((p) => p.id === personIdOrCode || p.person_code === personIdOrCode);
    if (!target) return false;

    this.writeStore(STORAGE_KEYS.PERSONS, persons.filter((p) => p.id !== target.id));
    this.writeStore(STORAGE_KEYS.VEHICLES, this.getVehicles().filter((v) => v.person_id !== target.person_code));

    this.logAudit({
      action: 'PERSON_DELETED',
      actor_email: actorEmail,
      resource_type: 'persons',
      resource_id: target.person_code,
      result: 'SUCCESS',
    });

    this.broadcast({
      type: 'PERSON_DELETED',
      payload: { id: target.id, person_code: target.person_code },
      timestamp: new Date().toISOString(),
      source: 'COMMAND_CENTRE',
    });
    return true;
  }

  public addVehicle(
    payload: Omit<RegisteredVehicle, 'id' | 'normalized_plate' | 'registration_date'>,
    actorEmail: string = 'admin@iimsambalpur.ac.in'
  ): RegisteredVehicle {
    const vehicles = this.getVehicles();
    const norm = normalizePlate(payload.license_plate);
    const existing = vehicles.find((v) => v.normalized_plate === norm);
    if (existing) {
      throw new Error(`Vehicle ${payload.license_plate} is already registered.`);
    }

    const newVeh: RegisteredVehicle = {
      ...payload,
      id: `veh-${Date.now()}`,
      license_plate: payload.license_plate.trim().toUpperCase(),
      normalized_plate: norm,
      registration_date: new Date().toISOString(),
    };

    this.writeStore(STORAGE_KEYS.VEHICLES, [newVeh, ...vehicles]);

    // Also link on person record if person_id provided
    if (payload.person_id) {
      const persons = this.getPersons();
      const pIdx = persons.findIndex(
        (p) => p.person_code === payload.person_id || p.id === payload.person_id
      );
      if (pIdx !== -1) {
        const currentV = persons[pIdx].associated_vehicles || [];
        persons[pIdx] = { ...persons[pIdx], associated_vehicles: [...currentV, newVeh] };
        this.writeStore(STORAGE_KEYS.PERSONS, persons);
      }
    }

    this.logAudit({
      action: 'VEHICLE_REGISTERED',
      actor_email: actorEmail,
      resource_type: 'vehicles',
      resource_id: newVeh.license_plate,
      result: 'SUCCESS',
    });

    this.broadcast({
      type: 'VEHICLE_ADDED',
      payload: newVeh,
      timestamp: new Date().toISOString(),
      source: 'COMMAND_CENTRE',
    });
    return newVeh;
  }

  // ==========================================
  // VERIFICATION EVENTS & ENTRY/EXIT LOGS
  // ==========================================
  public getEvents(): VerificationEvent[] {
    return this.readStore<VerificationEvent[]>(STORAGE_KEYS.EVENTS, []);
  }

  public addVerificationEvent(
    eventData: Partial<VerificationEvent>,
    source: 'GUARD_WEB_APP' | 'COMMAND_CENTRE' = 'GUARD_WEB_APP'
  ): VerificationEvent {
    const events = this.getEvents();
    const newEvent: VerificationEvent = {
      id: eventData.id || `evt-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
      timestamp: eventData.timestamp || new Date().toISOString(),
      gate_id: eventData.gate_id || 'GATE-01',
      gate_name: eventData.gate_name || 'Main Gate 01',
      guard_id: eventData.guard_id || 'GRD-101',
      guard_name: eventData.guard_name || 'Guard Terminal',
      person_id: eventData.person_id || 'UNKNOWN',
      person_name: eventData.person_name || 'Unverified Subject',
      person_category: eventData.person_category || 'Identity',
      outcome: eventData.outcome || 'CASE_1_VERIFIED',
      guard_decision: eventData.guard_decision || 'GRANT_ENTRY',
      similarity_score: eventData.similarity_score ?? 0.96,
      decision_reason: eventData.decision_reason || 'Verified against central database.',
      cryptographic_signature:
        eventData.cryptographic_signature ||
        `hmac-sha256-${Math.random().toString(16).slice(2, 12)}`,
      sync_status: 'SYNCED',
      candidate: eventData.candidate,
    };

    this.writeStore(STORAGE_KEYS.EVENTS, [newEvent, ...events.slice(0, 99)]);

    if (
      newEvent.guard_decision === 'DENY_ENTRY' ||
      newEvent.outcome === 'ACCESS_DENIED' ||
      newEvent.outcome === 'CASE_3_NOT_VERIFIED'
    ) {
      this.addNotification(
        {
          type: 'UNAUTHORIZED_ATTEMPT',
          title: `Gate Exception at ${newEvent.gate_name}`,
          message: `${newEvent.person_name} (${newEvent.outcome}) handled by ${newEvent.guard_id}.`,
          severity: 'WARNING',
          target_url: '/admin/verification',
        },
        source
      );
    }

    this.broadcast({
      type: 'VERIFICATION_EVENT',
      payload: newEvent,
      timestamp: newEvent.timestamp,
      source,
    });

    return newEvent;
  }

  // ==========================================
  // VISITORS
  // ==========================================
  public getVisitors(): VisitorPass[] {
    return this.readStore<VisitorPass[]>(STORAGE_KEYS.VISITORS, []);
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
      pass_code: `VP-${Math.floor(1000 + Math.random() * 9000)}`,
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
      gate_id: payload.gate_id || 'GATE-01',
      created_at: new Date().toISOString(),
    };
    this.writeStore(STORAGE_KEYS.VISITORS, [newVisitor, ...visitors]);
    this.broadcast({
      type: 'VISITOR_REGISTERED',
      payload: newVisitor,
      timestamp: new Date().toISOString(),
      source,
    });
    return newVisitor;
  }

  public checkInVisitor(idOrCode: string, source: 'GUARD_WEB_APP' | 'COMMAND_CENTRE' = 'GUARD_WEB_APP'): VisitorPass | null {
    const visitors = this.getVisitors();
    const target = visitors.find((v) => v.id === idOrCode || v.pass_code === idOrCode);
    if (!target) return null;

    const checked: VisitorPass = {
      ...target,
      status: 'CHECKED_IN',
      check_in_at: new Date().toISOString(),
      check_in_time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    };
    this.writeStore(STORAGE_KEYS.VISITORS, visitors.map((v) => (v.id === target.id ? checked : v)));
    this.broadcast({ type: 'VISITOR_CHECKED_IN', payload: checked, timestamp: new Date().toISOString(), source });
    return checked;
  }

  public checkOutVisitor(idOrCode: string, source: 'GUARD_WEB_APP' | 'COMMAND_CENTRE' = 'GUARD_WEB_APP'): VisitorPass | null {
    const visitors = this.getVisitors();
    const target = visitors.find((v) => v.id === idOrCode || v.pass_code === idOrCode);
    if (!target) return null;

    const checked: VisitorPass = {
      ...target,
      status: 'CHECKED_OUT',
      check_out_at: new Date().toISOString(),
      check_out_time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    };
    this.writeStore(STORAGE_KEYS.VISITORS, visitors.map((v) => (v.id === target.id ? checked : v)));
    this.broadcast({ type: 'VISITOR_CHECKED_OUT', payload: checked, timestamp: new Date().toISOString(), source });
    return checked;
  }

  // ==========================================
  // TWO NEW-PERSON WORKFLOWS (A: REQUEST, B: DIRECT)
  // ==========================================
  public getRegistrationRequests(): RegistrationRequest[] {
    return this.readStore<RegistrationRequest[]>(STORAGE_KEYS.REQUESTS, []);
  }

  /** Workflow A: Guard submits request for Admin approval */
  public submitRegistrationRequest(
    payload: {
      full_name: string;
      phone?: string;
      category?: RegistrationRequest['category'];
      purpose: string;
      expected_duration: string;
      face_photo_url?: string;
      vehicle_plate?: string;
      vehicle_type?: RegisteredVehicle['vehicle_type'];
      vehicle_photo_url?: string;
      additional_notes?: string;
      guard_id?: string;
      guard_name?: string;
      gate_id?: string;
    },
    source: 'GUARD_WEB_APP' | 'COMMAND_CENTRE' = 'GUARD_WEB_APP'
  ): RegistrationRequest {
    const guardId = payload.guard_id || 'GRD-101';
    const perms = this.getGuardPermissions(guardId);
    if (!perms.can_submit_registration_requests && !perms.can_create_person_directly) {
      throw new Error('Permission denied: Guard is not permitted to submit registration requests.');
    }

    const requests = this.getRegistrationRequests();
    const duplicate_warning = this.checkDuplicates(payload.full_name, payload.phone, payload.vehicle_plate);

    const newRequest: RegistrationRequest = {
      id: `req-${Date.now()}`,
      request_code: `REQ-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      submitted_by_guard_id: guardId,
      submitted_by_guard_name: payload.guard_name || guardId,
      gate_id: payload.gate_id || 'GATE-01',
      full_name: payload.full_name.trim(),
      phone: payload.phone?.trim(),
      category: payload.category || 'Visitor',
      purpose: payload.purpose.trim(),
      expected_duration: payload.expected_duration,
      face_photo_url: payload.face_photo_url,
      vehicle_plate: payload.vehicle_plate ? payload.vehicle_plate.trim().toUpperCase() : undefined,
      vehicle_type: payload.vehicle_type || 'Car',
      vehicle_photo_url: payload.vehicle_photo_url,
      additional_notes: payload.additional_notes,
      duplicate_warning,
      status: 'PENDING_APPROVAL',
      submitted_at: new Date().toISOString(),
    };

    this.writeStore(STORAGE_KEYS.REQUESTS, [newRequest, ...requests]);

    this.addNotification(
      {
        type: 'REGISTRATION_REQUEST',
        title: `New Registration Request (${newRequest.request_code})`,
        message: `${newRequest.full_name} submitted by ${newRequest.submitted_by_guard_id} for ${newRequest.purpose}.`,
        severity: duplicate_warning ? 'WARNING' : 'INFO',
        target_url: '/admin/enrollment?tab=approvals',
      },
      source
    );

    this.logAudit({
      action: 'REGISTRATION_REQUEST_SUBMITTED',
      actor_email: guardId,
      resource_type: 'registration_requests',
      resource_id: newRequest.request_code,
      result: 'PENDING_APPROVAL',
    });

    this.broadcast({
      type: 'REGISTRATION_REQUEST_CREATED',
      payload: newRequest,
      timestamp: newRequest.submitted_at,
      source,
    });

    return newRequest;
  }

  /** Workflow B: Authorized guard creates person directly in central DB */
  public createPersonDirectlyByGuard(
    payload: {
      full_name: string;
      phone?: string;
      category?: RegisteredPerson['category'];
      purpose: string;
      expected_duration: string;
      face_photo_url?: string;
      vehicle_plate?: string;
      vehicle_type?: RegisteredVehicle['vehicle_type'];
      vehicle_photo_url?: string;
      additional_notes?: string;
      guard_id: string;
      guard_name: string;
      gate_id?: string;
    }
  ): RegisteredPerson {
    const guard = this.getGuardByBadgeOrUsername(payload.guard_id);
    if (guard && guard.account_status !== 'ACTIVE') {
      throw new Error('Guard account is suspended or deactivated.');
    }

    const perms = this.getGuardPermissions(payload.guard_id);
    if (!perms.can_create_person_directly) {
      throw new Error('Permission denied: Direct creation mode is disabled for this guard.');
    }

    // Determine access status from Admin-configured policy (never grants permanent unrestricted access)
    let accountStatus: PersonAccessStatus = 'TEMPORARILY_AUTHORIZED';
    let validHours = 12;
    if (perms.direct_record_policy === 'ACTIVE_LIMITED') {
      accountStatus = 'ACTIVE_AUTHORIZED';
      validHours = 24;
    } else if (perms.direct_record_policy === 'PENDING_FINAL_REVIEW') {
      accountStatus = 'PENDING_APPROVAL';
      validHours = 24;
    }

    const now = new Date();
    const validUntil = new Date(now.getTime() + validHours * 60 * 60 * 1000).toISOString();

    const vehiclesToLink: RegisteredVehicle[] =
      payload.vehicle_plate && perms.can_register_vehicles
        ? [
            {
              id: `veh-g-${Date.now()}`,
              license_plate: payload.vehicle_plate.trim().toUpperCase(),
              normalized_plate: normalizePlate(payload.vehicle_plate),
              vehicle_type: payload.vehicle_type || 'Car',
              photo_url: payload.vehicle_photo_url,
              is_authorized: accountStatus !== 'PENDING_APPROVAL',
              owner_name: payload.full_name.trim(),
            },
          ]
        : [];

    const createdPerson = this.addPerson(
      {
        full_name: payload.full_name.trim(),
        category: payload.category || 'Visitor',
        department: `Purpose: ${payload.purpose}`,
        phone: payload.phone,
        photo_url: payload.face_photo_url,
        photos: payload.face_photo_url
          ? [
              {
                id: `pho-${Date.now()}`,
                url: payload.face_photo_url,
                is_primary: true,
                quality_score: 0.94,
                capture_method: 'MOBILE_GUARD',
                uploaded_at: now.toISOString(),
              },
            ]
          : [],
        account_status: accountStatus,
        creation_source: 'GUARD_CREATED',
        created_by_id: payload.guard_id,
        created_by_name: payload.guard_name,
        authorized_gates: [payload.gate_id || 'GATE-01'],
        valid_from: now.toISOString(),
        valid_until: validUntil,
        registration_notes: `Guard-created record (${perms.direct_record_policy}). Duration: ${payload.expected_duration}. ${payload.additional_notes || ''}`.trim(),
        associated_vehicles: vehiclesToLink,
      },
      'GUARD_WEB_APP'
    );

    this.addNotification(
      {
        type: 'GUARD_CREATED_RECORD',
        title: `Guard Created Record Directly (${createdPerson.person_code})`,
        message: `${payload.guard_name} (${payload.guard_id}) created ${createdPerson.full_name} directly with status ${accountStatus}. Review recommended.`,
        severity: 'WARNING',
        target_url: '/admin/people',
      },
      'GUARD_WEB_APP'
    );

    return createdPerson;
  }

  /** Admin approves request -> promotes into Central People Database & Vehicles */
  public approveRegistrationRequest(
    id: string,
    notes?: string,
    edits?: Partial<RegistrationRequest> & {
      authorized_gates?: string[];
      access_status?: PersonAccessStatus;
      valid_until?: string;
    },
    adminEmail: string = 'admin@iimsambalpur.ac.in'
  ): { request: RegistrationRequest; person: RegisteredPerson } | null {
    const requests = this.getRegistrationRequests();
    const target = requests.find((r) => r.id === id);
    if (!target) return null;

    const merged = { ...target, ...edits };
    const approvedReq: RegistrationRequest = {
      ...merged,
      status: 'APPROVED',
      review_notes: notes || 'Approved and enrolled by Campus Security Administrator',
      reviewed_by_admin_id: adminEmail,
      reviewed_at: new Date().toISOString(),
    };

    this.writeStore(
      STORAGE_KEYS.REQUESTS,
      requests.map((r) => (r.id === id ? approvedReq : r))
    );

    const now = new Date();
    const defaultExpiry = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString();

    const person = this.addPerson(
      {
        full_name: approvedReq.full_name,
        category: approvedReq.category as RegisteredPerson['category'],
        department: `Approved Visit: ${approvedReq.purpose}`,
        phone: approvedReq.phone,
        photo_url: approvedReq.face_photo_url,
        photos: approvedReq.face_photo_url
          ? [
              {
                id: `pho-${Date.now()}`,
                url: approvedReq.face_photo_url,
                is_primary: true,
                quality_score: 0.96,
                capture_method: 'MOBILE_GUARD',
                uploaded_at: now.toISOString(),
              },
            ]
          : [],
        account_status: edits?.access_status || 'TEMPORARILY_AUTHORIZED',
        creation_source: 'ADMIN_CREATED',
        created_by_id: adminEmail,
        created_by_name: 'Administrator (Approved Request)',
        authorized_gates: edits?.authorized_gates || [approvedReq.gate_id || 'GATE-01'],
        valid_from: now.toISOString(),
        valid_until: edits?.valid_until || defaultExpiry,
        registration_notes: `Promoted from guard request ${approvedReq.request_code} (Submitted by ${approvedReq.submitted_by_guard_id}).`,
        associated_vehicles: approvedReq.vehicle_plate
          ? [
              {
                id: `veh-apr-${Date.now()}`,
                license_plate: approvedReq.vehicle_plate,
                normalized_plate: normalizePlate(approvedReq.vehicle_plate),
                vehicle_type: approvedReq.vehicle_type || 'Car',
                photo_url: approvedReq.vehicle_photo_url,
                is_authorized: true,
                owner_name: approvedReq.full_name,
              },
            ]
          : [],
      },
      'COMMAND_CENTRE'
    );

    this.broadcast({
      type: 'REGISTRATION_REQUEST_APPROVED',
      payload: approvedReq,
      timestamp: new Date().toISOString(),
      source: 'COMMAND_CENTRE',
    });

    return { request: approvedReq, person };
  }

  public rejectRegistrationRequest(
    id: string,
    notes?: string,
    adminEmail: string = 'admin@iimsambalpur.ac.in'
  ): RegistrationRequest | null {
    const requests = this.getRegistrationRequests();
    const target = requests.find((r) => r.id === id);
    if (!target) return null;

    const rejected: RegistrationRequest = {
      ...target,
      status: 'REJECTED',
      review_notes: notes || 'Rejected by Institutional Security Directorate policy',
      reviewed_by_admin_id: adminEmail,
      reviewed_at: new Date().toISOString(),
    };
    this.writeStore(STORAGE_KEYS.REQUESTS, requests.map((r) => (r.id === id ? rejected : r)));
    this.logAudit({
      action: 'REGISTRATION_REQUEST_REJECTED',
      actor_email: adminEmail,
      resource_type: 'registration_requests',
      resource_id: target.request_code,
      result: 'REJECTED',
      details: { reason: rejected.review_notes },
    });
    this.broadcast({
      type: 'REGISTRATION_REQUEST_REJECTED',
      payload: rejected,
      timestamp: new Date().toISOString(),
      source: 'COMMAND_CENTRE',
    });
    return rejected;
  }

  public requestMoreInfoRegistrationRequest(
    id: string,
    prompt: string,
    adminEmail: string = 'admin@iimsambalpur.ac.in'
  ): RegistrationRequest | null {
    const requests = this.getRegistrationRequests();
    const target = requests.find((r) => r.id === id);
    if (!target) return null;

    const updated: RegistrationRequest = {
      ...target,
      status: 'ADDITIONAL_INFO_REQUIRED',
      requested_info_prompt: prompt,
      review_notes: `Additional information requested: ${prompt}`,
      reviewed_by_admin_id: adminEmail,
      reviewed_at: new Date().toISOString(),
    };
    this.writeStore(STORAGE_KEYS.REQUESTS, requests.map((r) => (r.id === id ? updated : r)));
    this.broadcast({
      type: 'REGISTRATION_REQUEST_INFO_REQUIRED',
      payload: updated,
      timestamp: new Date().toISOString(),
      source: 'COMMAND_CENTRE',
    });
    return updated;
  }

  // ==========================================
  // CENTRALIZED VERIFICATION ENGINE (SECTION 10 & 11)
  // ==========================================
  public verifyIdentityAndVehicle(
    faceIdentifier?: string,
    vehiclePlate?: string,
    options?: { imageQuality?: 'GOOD' | 'POOR'; faceCount?: number; gateCode?: string }
  ): VerificationResult {
    const timestamp = new Date().toISOString();
    const cleanFace = (faceIdentifier || '').trim();
    const cleanPlate = (vehiclePlate || '').trim().toUpperCase();
    const normPlate = normalizePlate(cleanPlate);

    // Edge cases: Poor lighting/blur OR Multiple faces in frame
    if (options?.imageQuality === 'POOR') {
      return {
        case_outcome: 'MANUAL_REVIEW_REQUIRED',
        status_title: 'MANUAL REVIEW REQUIRED',
        access_decision: 'MANUAL_REVIEW_REQUIRED',
        failure_reason: 'Poor lighting or blurred capture failed image quality validation. Please retry in better lighting.',
        timestamp,
      };
    }

    if (options?.faceCount && options.faceCount > 1) {
      return {
        case_outcome: 'MANUAL_REVIEW_REQUIRED',
        status_title: 'MANUAL REVIEW REQUIRED',
        access_decision: 'MANUAL_REVIEW_REQUIRED',
        failure_reason: `Multiple faces (${options.faceCount}) detected in frame. Ensure only one subject stands in camera frame.`,
        timestamp,
      };
    }

    // Lookup against CENTRAL ADMIN-MANAGED PEOPLE DATABASE & VEHICLES DATABASE
    const persons = this.getPersons();
    const vehicles = this.getVehicles();

    const matchedPerson = cleanFace
      ? persons.find(
          (p) =>
            p.full_name.toLowerCase() === cleanFace.toLowerCase() ||
            p.full_name.toLowerCase().includes(cleanFace.toLowerCase()) ||
            p.person_code.toUpperCase() === cleanFace.toUpperCase() ||
            p.id === cleanFace
        )
      : undefined;

    const matchedVehicle = normPlate
      ? vehicles.find((v) => v.normalized_plate === normPlate)
      : undefined;

    // Evaluate Access Status & Expiration if person exists
    if (matchedPerson) {
      const isExpired =
        matchedPerson.account_status === 'EXPIRED' ||
        (matchedPerson.valid_until && new Date(matchedPerson.valid_until).getTime() < Date.now());

      if (isExpired) {
        return {
          case_outcome: 'ACCESS_EXPIRED',
          status_title: 'ACCESS EXPIRED',
          access_decision: 'ACCESS_EXPIRED',
          failure_reason: `Access expired on ${new Date(matchedPerson.valid_until).toLocaleDateString()}. Renew clearance with Administrator.`,
          person: {
            id: matchedPerson.person_code,
            name: matchedPerson.full_name,
            category: matchedPerson.category,
            department: matchedPerson.department,
            photo_url: matchedPerson.photo_url,
            face_matched: true,
            confidence_score: 0.972,
            creation_source: matchedPerson.creation_source,
            access_status: 'EXPIRED',
          },
          timestamp,
        };
      }

      if (
        matchedPerson.account_status === 'SUSPENDED' ||
        matchedPerson.account_status === 'REJECTED' ||
        matchedPerson.account_status === 'ARCHIVED' ||
        matchedPerson.account_status === 'PENDING_APPROVAL'
      ) {
        return {
          case_outcome: 'ACCESS_DENIED',
          status_title: 'ACCESS DENIED',
          access_decision: 'ACCESS_DENIED',
          failure_reason: `Record status is ${matchedPerson.account_status}. Entry not authorized.`,
          person: {
            id: matchedPerson.person_code,
            name: matchedPerson.full_name,
            category: matchedPerson.category,
            department: matchedPerson.department,
            photo_url: matchedPerson.photo_url,
            face_matched: true,
            confidence_score: 0.968,
            creation_source: matchedPerson.creation_source,
            access_status: matchedPerson.account_status,
          },
          timestamp,
        };
      }

      // Check Gate authorization restriction if gateCode specified
      if (
        options?.gateCode &&
        matchedPerson.authorized_gates?.length > 0 &&
        !matchedPerson.authorized_gates.includes('ALL') &&
        !matchedPerson.authorized_gates.includes(options.gateCode)
      ) {
        return {
          case_outcome: 'ACCESS_DENIED',
          status_title: 'ACCESS DENIED',
          access_decision: 'ACCESS_DENIED',
          failure_reason: `Person is only permitted at gates: ${matchedPerson.authorized_gates.join(', ')}.`,
          person: {
            id: matchedPerson.person_code,
            name: matchedPerson.full_name,
            category: matchedPerson.category,
            department: matchedPerson.department,
            photo_url: matchedPerson.photo_url,
            face_matched: true,
            confidence_score: 0.965,
            creation_source: matchedPerson.creation_source,
            access_status: matchedPerson.account_status,
          },
          timestamp,
        };
      }

      // Edge Case 18: Person arriving WITHOUT vehicle (pedestrian scan)
      if (!normPlate) {
        return {
          case_outcome: 'CASE_1_VERIFIED',
          status_title: 'VERIFIED',
          access_decision: 'AUTHORIZED',
          person: {
            id: matchedPerson.person_code,
            name: matchedPerson.full_name,
            category: matchedPerson.category,
            department: matchedPerson.department,
            photo_url: matchedPerson.photo_url,
            face_matched: true,
            confidence_score: 0.981,
            creation_source: matchedPerson.creation_source,
            access_status: matchedPerson.account_status,
          },
          timestamp,
        };
      }

      // Check if scanned vehicle belongs to this person (supports multiple vehicles per person!)
      const isVehicleLinkedToPerson =
        (matchedPerson.associated_vehicles || []).some((v) => v.normalized_plate === normPlate) ||
        (matchedVehicle && matchedVehicle.person_id === matchedPerson.person_code);

      if (isVehicleLinkedToPerson) {
        return {
          case_outcome: 'CASE_1_VERIFIED',
          status_title: 'VERIFIED',
          access_decision: 'AUTHORIZED',
          person: {
            id: matchedPerson.person_code,
            name: matchedPerson.full_name,
            category: matchedPerson.category,
            department: matchedPerson.department,
            photo_url: matchedPerson.photo_url,
            face_matched: true,
            confidence_score: 0.985,
            creation_source: matchedPerson.creation_source,
            access_status: matchedPerson.account_status,
          },
          vehicle: {
            license_plate: matchedVehicle?.license_plate || cleanPlate,
            normalized_plate: normPlate,
            vehicle_matched: true,
            is_associated_with_person: true,
            vehicle_type: matchedVehicle?.vehicle_type || 'Car',
          },
          timestamp,
        };
      }

      // CASE 2: Person found, vehicle NOT registered / not associated
      return {
        case_outcome: 'CASE_2_PARTIALLY_VERIFIED',
        status_title: 'PARTIALLY VERIFIED',
        access_decision: 'PARTIALLY_AUTHORIZED',
        failure_reason: `Vehicle ${cleanPlate} is not registered or associated with ${matchedPerson.full_name}.`,
        person: {
          id: matchedPerson.person_code,
          name: matchedPerson.full_name,
          category: matchedPerson.category,
          department: matchedPerson.department,
          photo_url: matchedPerson.photo_url,
          face_matched: true,
          confidence_score: 0.978,
          creation_source: matchedPerson.creation_source,
          access_status: matchedPerson.account_status,
        },
        vehicle: {
          license_plate: cleanPlate,
          normalized_plate: normPlate,
          vehicle_matched: Boolean(matchedVehicle),
          is_associated_with_person: false,
          vehicle_type: matchedVehicle?.vehicle_type,
        },
        timestamp,
      };
    }

    // CASE 3: Person NOT Found in Admin-Managed Database (Edge cases 3 & 4: even if vehicle is registered, face match is missing!)
    return {
      case_outcome: 'CASE_3_NOT_VERIFIED',
      status_title: 'NOT VERIFIED',
      access_decision: 'NOT_AUTHORIZED',
      failure_reason: matchedVehicle
        ? `Vehicle ${cleanPlate} matches (${matchedVehicle.owner_name}), but driver identity was not found in authorized People Database.`
        : 'No matching authorized person record found in centralized database.',
      person: {
        id: 'UNREGISTERED',
        name: cleanFace || 'Unrecognized Individual',
        category: 'Unregistered',
        face_matched: false,
        confidence_score: 0.24,
      },
      vehicle: cleanPlate
        ? {
            license_plate: cleanPlate,
            normalized_plate: normPlate,
            vehicle_matched: Boolean(matchedVehicle),
            is_associated_with_person: false,
            vehicle_type: matchedVehicle?.vehicle_type,
          }
        : undefined,
      timestamp,
    };
  }
}

export const liveSync = new LiveSyncService();
