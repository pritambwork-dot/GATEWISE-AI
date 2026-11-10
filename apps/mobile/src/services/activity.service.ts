import { apiClient } from './api-client';
import { VerificationEventRecord } from '../types';
import { FIXTURE_ACTIVITY_RECORDS } from './fixtures';

export const ActivityService = {
  async getRecentActivity(
    gateId?: string,
    limit: number = 50
  ): Promise<VerificationEventRecord[]> {
    if (apiClient.isDemoMode()) {
      return FIXTURE_ACTIVITY_RECORDS;
    }

    try {
      const endpoint = gateId
        ? `/activity/recent?gate_id=${encodeURIComponent(gateId)}&limit=${limit}`
        : `/activity/recent?limit=${limit}`;

      const response = await apiClient.request<
        Array<{
          id: string;
          timestamp: string;
          gate_id: string;
          gate_name: string;
          guard_id: string;
          guard_name: string;
          person_id?: string;
          person_name?: string;
          person_category?: string;
          outcome: any;
          guard_decision?: any;
          similarity_score?: number;
          decision_reason?: string;
          cryptographic_signature: string;
          sync_status?: any;
        }>
      >(endpoint);

      if (!response || response.length === 0) {
        return FIXTURE_ACTIVITY_RECORDS;
      }

      return response.map((item) => ({
        id: item.id,
        timestamp: item.timestamp,
        gateId: item.gate_id,
        gateName: item.gate_name,
        guardId: item.guard_id,
        guardName: item.guard_name,
        personId: item.person_id,
        personName: item.person_name,
        personCategory: item.person_category,
        outcome: item.outcome,
        decision: item.guard_decision,
        similarityScore: item.similarity_score,
        decisionReason: item.decision_reason,
        cryptographicSignature: item.cryptographic_signature,
        syncStatus: item.sync_status || 'SYNCED',
      }));
    } catch {
      return FIXTURE_ACTIVITY_RECORDS;
    }
  },

  async getActivityDetail(eventId: string): Promise<VerificationEventRecord | null> {
    const records = await this.getRecentActivity();
    const found = records.find((r) => r.id === eventId);
    return found || null;
  },
};
