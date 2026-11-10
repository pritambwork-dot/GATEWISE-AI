import {
  DashboardMetrics, VerificationEvent, InstitutionalIdentity,
  VisitorPass, EnrollmentReferral, GuardUser, UserProfile,
  AuditLogEntry, NotificationItem, RepositoryStatus, GateStatus
} from '../../types';

const API_BASE = '/api/v1';

class ApiClient {
  private token: string | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('gatewise_admin_token');
    }
  }

  setToken(token: string | null) {
    this.token = token;
    if (typeof window !== 'undefined') {
      if (token) {
        localStorage.setItem('gatewise_admin_token', token);
      } else {
        localStorage.removeItem('gatewise_admin_token');
        localStorage.removeItem('gatewise_admin_user');
      }
    }
  }

  getToken(): string | null {
    if (!this.token && typeof window !== 'undefined') {
      this.token = localStorage.getItem('gatewise_admin_token');
    }
    return this.token;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = this.getToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...(options.headers as Record<string, string> || {}),
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
    });

    if (!res.ok) {
      let errMsg = `Request failed: ${res.status} ${res.statusText}`;
      try {
        const errJson = await res.json();
        errMsg = errJson.detail || errMsg;
      } catch {}
      throw new Error(errMsg);
    }

    return (await res.json()) as T;
  }

  // ==========================================
  // AUTHENTICATION
  // ==========================================
  async login(employee_id: string, password: string): Promise<{ access_token: string; refresh_token: string; user: UserProfile }> {
    const data = await this.request<{ access_token: string; refresh_token: string; user: UserProfile }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ employee_id, password })
    });
    this.setToken(data.access_token);
    if (typeof window !== 'undefined') {
      localStorage.setItem('gatewise_admin_user', JSON.stringify(data.user));
    }
    return data;
  }

  async logout(): Promise<void> {
    try {
      await this.request('/auth/logout', { method: 'POST', body: JSON.stringify({}) });
    } catch {}
    this.setToken(null);
  }

  async getMe(): Promise<UserProfile> {
    return this.request<UserProfile>('/auth/me');
  }

  // ==========================================
  // DASHBOARD & ANALYTICS
  // ==========================================
  async getDashboardMetrics(): Promise<DashboardMetrics> {
    return this.request<DashboardMetrics>('/analytics/dashboard');
  }

  // ==========================================
  // VERIFICATION EVENTS (LIVE & HISTORICAL)
  // ==========================================
  async getRecentEvents(gateId?: string, limit: number = 50): Promise<VerificationEvent[]> {
    const query = gateId ? `?gate_id=${gateId}&limit=${limit}` : `?limit=${limit}`;
    return this.request<VerificationEvent[]>(`/verification/events${query}`);
  }

  async getEventDetail(eventId: string): Promise<VerificationEvent> {
    return this.request<VerificationEvent>(`/verification/events/${eventId}`);
  }

  // ==========================================
  // PEOPLE & IDENTITIES
  // ==========================================
  async listIdentities(params: { category?: string; search?: string; limit?: number } = {}): Promise<InstitutionalIdentity[]> {
    const searchParams = new URLSearchParams();
    if (params.category) searchParams.set('category', params.category);
    if (params.search) searchParams.set('search', params.search);
    if (params.limit) searchParams.set('limit', params.limit.toString());
    const qs = searchParams.toString();
    return this.request<InstitutionalIdentity[]>(`/identities/${qs ? `?${qs}` : ''}`);
  }

  async getIdentity(idOrPersonId: string): Promise<InstitutionalIdentity> {
    return this.request<InstitutionalIdentity>(`/identities/${idOrPersonId}`);
  }

  async createIdentity(payload: {
    person_id: string;
    full_name: string;
    category: string;
    department: string;
    designation?: string;
    email?: string;
    phone?: string;
    valid_from?: string;
    valid_until?: string;
    clearance_level?: string;
  }): Promise<InstitutionalIdentity> {
    return this.request<InstitutionalIdentity>('/identities/', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  }

  // ==========================================
  // ENROLLMENT REFERRALS
  // ==========================================
  async listEnrollmentRequests(status?: string, limit: number = 50): Promise<EnrollmentReferral[]> {
    const qs = status ? `?status=${status}&limit=${limit}` : `?limit=${limit}`;
    return this.request<EnrollmentReferral[]>(`/enrollment-requests${qs}`);
  }

  async approveEnrollmentRequest(requestId: string, adminNotes?: string): Promise<EnrollmentReferral> {
    return this.request<EnrollmentReferral>(`/enrollment-requests/${requestId}/approve`, {
      method: 'POST',
      body: JSON.stringify({ admin_notes: adminNotes })
    });
  }

  async rejectEnrollmentRequest(requestId: string, adminNotes?: string): Promise<EnrollmentReferral> {
    return this.request<EnrollmentReferral>(`/enrollment-requests/${requestId}/reject`, {
      method: 'POST',
      body: JSON.stringify({ admin_notes: adminNotes })
    });
  }

  // ==========================================
  // VISITOR PASSES
  // ==========================================
  async listVisitors(status?: string, limit: number = 50): Promise<VisitorPass[]> {
    const qs = status ? `?status=${status}&limit=${limit}` : `?limit=${limit}`;
    return this.request<VisitorPass[]>(`/visitors/${qs}`);
  }

  async createVisitorPass(payload: {
    visitor_name: string;
    phone: string;
    id_type: string;
    id_number: string;
    host_name: string;
    host_department: string;
    purpose: string;
    valid_date: string;
    valid_until_time: string;
  }): Promise<VisitorPass> {
    return this.request<VisitorPass>('/visitors/create-pass', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  }

  async checkInVisitor(passCode: string): Promise<VisitorPass> {
    return this.request<VisitorPass>(`/visitors/${passCode}/check-in`, { method: 'POST' });
  }

  async checkOutVisitor(passCode: string): Promise<VisitorPass> {
    return this.request<VisitorPass>(`/visitors/${passCode}/check-out`, { method: 'POST' });
  }

  // ==========================================
  // GATES & ASSIGNMENTS
  // ==========================================
  async listGates(): Promise<GateStatus[]> {
    return this.request<GateStatus[]>('/gates/');
  }

  async createGate(payload: { gate_code: string; gate_name: string; location: string; operating_hours?: string; status?: string }): Promise<GateStatus> {
    return this.request<GateStatus>('/gates/', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  }

  async updateGate(gateId: string, payload: { gate_name?: string; location?: string; status?: string; operating_hours?: string }): Promise<GateStatus> {
    return this.request<GateStatus>(`/gates/${gateId}`, {
      method: 'PATCH',
      body: JSON.stringify(payload)
    });
  }

  async assignGuardToGate(payload: { guard_id: string; gate_id: string; shift_name?: string }): Promise<any> {
    return this.request('/gates/assignments', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  }

  async getAssignmentHistory(guardId?: string): Promise<any[]> {
    const qs = guardId ? `?guard_id=${guardId}` : '';
    return this.request<any[]>(`/gates/assignments/history${qs}`);
  }

  // ==========================================
  // GUARD MANAGEMENT
  // ==========================================
  async listGuards(status?: string): Promise<GuardUser[]> {
    const qs = status ? `?status=${status}` : '';
    return this.request<GuardUser[]>(`/guards/${qs}`);
  }

  async inviteGuard(payload: { employee_id: string; email: string; full_name: string; password?: string; avatar_url?: string }): Promise<any> {
    return this.request('/guards/', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  }

  async updateGuardStatus(guardId: string, payload: { account_status?: string; full_name?: string }): Promise<any> {
    return this.request(`/guards/${guardId}`, {
      method: 'PATCH',
      body: JSON.stringify(payload)
    });
  }

  async revokeGuardSessions(guardId: string): Promise<any> {
    return this.request(`/guards/${guardId}/revoke-sessions`, { method: 'POST' });
  }

  // ==========================================
  // REPOSITORY & DRIVE SYNC
  // ==========================================
  async getRepositoryStatus(): Promise<RepositoryStatus> {
    return this.request<RepositoryStatus>('/repository/status');
  }

  async triggerSync(folderId?: string, forceFull: boolean = false): Promise<any> {
    return this.request('/repository/sync', {
      method: 'POST',
      body: JSON.stringify({ folder_id: folderId, force_full: forceFull })
    });
  }

  async getUnmappedFiles(): Promise<any[]> {
    return this.request<any[]>('/repository/unmapped-files');
  }

  // ==========================================
  // AUDIT & NOTIFICATIONS
  // ==========================================
  async getAuditLogs(params: { action?: string; resource_type?: string; limit?: number; offset?: number } = {}): Promise<{ total: number; items: AuditLogEntry[] }> {
    const searchParams = new URLSearchParams();
    if (params.action) searchParams.set('action', params.action);
    if (params.resource_type) searchParams.set('resource_type', params.resource_type);
    if (params.limit) searchParams.set('limit', params.limit.toString());
    if (params.offset) searchParams.set('offset', params.offset.toString());
    const qs = searchParams.toString();
    return this.request<{ total: number; items: AuditLogEntry[] }>(`/audit/logs${qs ? `?${qs}` : ''}`);
  }

  async getNotifications(): Promise<NotificationItem[]> {
    return this.request<NotificationItem[]>('/notifications/');
  }

  // ==========================================
  // AI ASSISTANT (AGENT)
  // ==========================================
  async queryAssistantSync(query: string, sessionId?: string): Promise<{
    session_id: string;
    response: string;
    tools_executed: any[];
    proposals: any[];
  }> {
    return this.request('/agent/message', {
      method: 'POST',
      body: JSON.stringify({ query, session_id: sessionId })
    });
  }

  async getAssistantSessions(): Promise<any[]> {
    return this.request<any[]>('/agent/sessions');
  }

  async deleteAssistantSession(sessionId: string): Promise<any> {
    return this.request(`/agent/sessions/${sessionId}`, { method: 'DELETE' });
  }

  async getAssistantTools(): Promise<{ role: string; authorized_tools: string[] }> {
    return this.request('/agent/tools');
  }

  async *streamAssistantChat(query: string, sessionId?: string): AsyncGenerator<{
    type: string;
    delta?: string;
    tool_name?: string;
    arguments?: any;
    result?: any;
    proposal?: any;
    target_page?: string;
    page_title?: string;
    session_id?: string;
    message?: string;
  }> {
    const token = this.getToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'text/event-stream',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch(`${API_BASE}/agent/chat`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ query, session_id: sessionId })
    });

    if (!res.ok) {
      let errMsg = `Assistant error: ${res.status}`;
      try {
        const errJson = await res.json();
        errMsg = errJson.detail || errMsg;
      } catch {}
      throw new Error(errMsg);
    }

    if (!res.body) {
      throw new Error('No response body returned from stream');
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed.startsWith('data: ')) {
          try {
            const event = JSON.parse(trimmed.slice(6));
            yield event;
          } catch {}
        }
      }
    }
  }
}

export const api = new ApiClient();
