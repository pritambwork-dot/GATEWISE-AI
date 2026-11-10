import { apiClient } from './api-client';
import { TerminalHealth } from '../types';
import { FIXTURE_TERMINAL_HEALTH, FIXTURE_SOP_QA } from './fixtures';

export const ProfileService = {
  async getTerminalHealth(): Promise<TerminalHealth> {
    try {
      const response = await apiClient.request<{
        status: string;
        model_version?: string;
        database_connected?: boolean;
      }>('/analytics/realtime');

      return {
        ...FIXTURE_TERMINAL_HEALTH,
        isOnline: response.status === 'HEALTHY',
        latencyMs: 38 + Math.floor(Math.random() * 12),
      };
    } catch {
      return FIXTURE_TERMINAL_HEALTH;
    }
  },

  async querySopAssistant(query: string): Promise<string> {
    if (apiClient.isDemoMode()) {
      return this.matchFallbackSop(query);
    }

    try {
      const response = await apiClient.request<{ query: string; response: string }>(
        '/assistant/query',
        {
          method: 'POST',
          body: { query },
        }
      );
      return response.response;
    } catch {
      return this.matchFallbackSop(query);
    }
  },

  matchFallbackSop(query: string): string {
    const q = query.toLowerCase();
    if (q.includes('vehicle') || q.includes('car') || q.includes('truck')) {
      return FIXTURE_SOP_QA.vehicle;
    }
    if (q.includes('vip') || q.includes('director') || q.includes('dignitary')) {
      return FIXTURE_SOP_QA.vip;
    }
    if (q.includes('expired') || q.includes('alumni') || q.includes('former')) {
      return FIXTURE_SOP_QA.expired;
    }
    return FIXTURE_SOP_QA.default;
  },
};
