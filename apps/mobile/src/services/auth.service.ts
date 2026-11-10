import * as SecureStore from 'expo-secure-store';
import { apiClient } from './api-client';
import { UserProfile, AssignedGate, AuthSession } from '../types';
import { DEFAULT_GUARD_PROFILE, DEFAULT_ASSIGNED_GATE } from './fixtures';

const SECURE_USER_KEY = 'gatewise_auth_user_session';

export const AuthService = {
  async login(employeeId: string, password: string): Promise<AuthSession> {
    try {
      if (apiClient.isDemoMode()) {
        const session: AuthSession = {
          accessToken: 'demo-jwt-token-guard-014',
          user: DEFAULT_GUARD_PROFILE,
          assignedGate: DEFAULT_ASSIGNED_GATE,
        };
        await this.saveSession(session);
        apiClient.setToken(session.accessToken);
        return session;
      }

      const response = await apiClient.request<{
        access_token: string;
        token_type: string;
        user: {
          id: string;
          email: string;
          full_name: string;
          role: string;
          employee_id: string;
          avatar_url?: string;
          assigned_gate?: any;
        };
      }>('/auth/login', {
        method: 'POST',
        body: { employee_id: employeeId, password },
      });

      const assignedGate: AssignedGate = response.user.assigned_gate
        ? {
            id: response.user.assigned_gate.id,
            name: response.user.assigned_gate.name,
            code: response.user.assigned_gate.code,
            location: response.user.assigned_gate.location,
            operatingHours: response.user.assigned_gate.operating_hours,
            status: response.user.assigned_gate.status,
            assignedAt: response.user.assigned_gate.assigned_at,
          }
        : DEFAULT_ASSIGNED_GATE;

      const profile: UserProfile = {
        id: response.user.id,
        email: response.user.email,
        fullName: response.user.full_name,
        role: response.user.role as any,
        employeeId: response.user.employee_id,
        avatarUrl: response.user.avatar_url,
        assignedGate,
      };

      const session: AuthSession = {
        accessToken: response.access_token,
        user: profile,
        assignedGate,
      };

      await this.saveSession(session);
      apiClient.setToken(session.accessToken);
      return session;
    } catch (error: any) {
      // In offline / fallback mode, if demo credentials match, return fixture session
      if (employeeId === 'SEC-G014' && password === 'guard123') {
        const session: AuthSession = {
          accessToken: 'offline-jwt-guard-014',
          user: DEFAULT_GUARD_PROFILE,
          assignedGate: DEFAULT_ASSIGNED_GATE,
        };
        await this.saveSession(session);
        apiClient.setToken(session.accessToken);
        return session;
      }
      throw error;
    }
  },

  async saveSession(session: AuthSession): Promise<void> {
    try {
      await SecureStore.setItemAsync(SECURE_USER_KEY, JSON.stringify(session));
    } catch {
      // Non-fatal if storage fails
    }
  },

  async getStoredSession(): Promise<AuthSession | null> {
    try {
      const data = await SecureStore.getItemAsync(SECURE_USER_KEY);
      if (data) {
        const session: AuthSession = JSON.parse(data);
        apiClient.setToken(session.accessToken);
        return session;
      }
    } catch {
      // If corrupted, ignore
    }
    return null;
  },

  async logout(): Promise<void> {
    apiClient.setToken(null);
    try {
      await SecureStore.deleteItemAsync(SECURE_USER_KEY);
    } catch {}
  },
};
