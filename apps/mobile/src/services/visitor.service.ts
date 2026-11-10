import { apiClient } from './api-client';
import { VisitorPass, VisitorIntakePayload } from '../types';
import { FIXTURE_VISITORS } from './fixtures';

let localVisitorsMemory: VisitorPass[] = [...FIXTURE_VISITORS];

export const VisitorService = {
  async getVisitors(status?: string, limit: number = 50): Promise<VisitorPass[]> {
    if (apiClient.isDemoMode()) {
      if (status) {
        return localVisitorsMemory.filter((v) => v.status === status);
      }
      return localVisitorsMemory;
    }

    try {
      const endpoint = status
        ? `/visitors/?status=${encodeURIComponent(status)}&limit=${limit}`
        : `/visitors/?limit=${limit}`;

      const response = await apiClient.request<
        Array<{
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
          status: any;
          check_in_time?: string;
          check_out_time?: string;
        }>
      >(endpoint);

      if (!response || response.length === 0) {
        return localVisitorsMemory;
      }

      return response.map((v) => ({
        id: v.id,
        passCode: v.pass_code,
        visitorName: v.visitor_name,
        phone: v.phone,
        idType: v.id_type,
        idNumber: v.id_number,
        hostName: v.host_name,
        hostDepartment: v.host_department,
        purpose: v.purpose,
        validDate: v.valid_date,
        validUntilTime: v.valid_until_time,
        status: v.status,
        checkInTime: v.check_in_time,
        checkOutTime: v.check_out_time,
      }));
    } catch {
      if (status) {
        return localVisitorsMemory.filter((v) => v.status === status);
      }
      return localVisitorsMemory;
    }
  },

  async getVisitorByPassCode(passCode: string): Promise<VisitorPass | null> {
    const list = await this.getVisitors();
    const cleanQuery = passCode.trim().toUpperCase();
    const found = list.find(
      (v) =>
        v.passCode.toUpperCase() === cleanQuery ||
        v.passCode.replace('-', '').toUpperCase() === cleanQuery.replace('-', '') ||
        v.id === cleanQuery
    );
    return found || null;
  },

  async checkInVisitor(passCode: string): Promise<VisitorPass> {
    try {
      const response = await apiClient.request<any>(
        `/visitors/${encodeURIComponent(passCode)}/check-in`,
        { method: 'POST' }
      );
      return {
        id: response.id,
        passCode: response.pass_code,
        visitorName: response.visitor_name,
        phone: response.phone,
        idType: response.id_type,
        idNumber: response.id_number,
        hostName: response.host_name,
        hostDepartment: response.host_department,
        purpose: response.purpose,
        validDate: response.valid_date,
        validUntilTime: response.valid_until_time,
        status: 'CHECKED_IN',
        checkInTime: response.check_in_time || new Date().toISOString(),
      };
    } catch {
      // Local memory update fallback
      const idx = localVisitorsMemory.findIndex(
        (v) => v.passCode.toUpperCase() === passCode.toUpperCase() || v.id === passCode
      );
      if (idx !== -1) {
        localVisitorsMemory[idx] = {
          ...localVisitorsMemory[idx],
          status: 'CHECKED_IN',
          checkInTime: new Date().toISOString(),
        };
        return localVisitorsMemory[idx];
      }
      throw new Error(`Pass ${passCode} not found.`);
    }
  },

  async checkOutVisitor(passCode: string): Promise<VisitorPass> {
    try {
      const response = await apiClient.request<any>(
        `/visitors/${encodeURIComponent(passCode)}/check-out`,
        { method: 'POST' }
      );
      return {
        id: response.id,
        passCode: response.pass_code,
        visitorName: response.visitor_name,
        phone: response.phone,
        idType: response.id_type,
        idNumber: response.id_number,
        hostName: response.host_name,
        hostDepartment: response.host_department,
        purpose: response.purpose,
        validDate: response.valid_date,
        validUntilTime: response.valid_until_time,
        status: 'CHECKED_OUT',
        checkOutTime: response.check_out_time || new Date().toISOString(),
      };
    } catch {
      const idx = localVisitorsMemory.findIndex(
        (v) => v.passCode.toUpperCase() === passCode.toUpperCase() || v.id === passCode
      );
      if (idx !== -1) {
        localVisitorsMemory[idx] = {
          ...localVisitorsMemory[idx],
          status: 'CHECKED_OUT',
          checkOutTime: new Date().toISOString(),
        };
        return localVisitorsMemory[idx];
      }
      throw new Error(`Pass ${passCode} not found.`);
    }
  },

  async registerIntake(payload: VisitorIntakePayload): Promise<VisitorPass> {
    try {
      const response = await apiClient.request<any>('/visitors/intake', {
        method: 'POST',
        body: {
          visitor_name: payload.visitorName,
          phone: payload.phone,
          id_type: payload.idType,
          id_number: payload.idNumber,
          host_name: payload.hostName,
          host_department: payload.hostDepartment,
          purpose: payload.purpose,
          gate_id: payload.gateId,
        },
      });

      const newPass: VisitorPass = {
        id: response.id,
        passCode: response.pass_code,
        visitorName: response.visitor_name,
        phone: response.phone,
        idType: response.id_type,
        idNumber: response.id_number,
        hostName: response.host_name,
        hostDepartment: response.host_department,
        purpose: response.purpose,
        validDate: response.valid_date,
        validUntilTime: response.valid_until_time,
        status: response.status || 'CHECKED_IN',
        checkInTime: response.check_in_time || new Date().toISOString(),
      };

      localVisitorsMemory.unshift(newPass);
      return newPass;
    } catch {
      const mockCode = `PASS-${Math.floor(1000 + Math.random() * 9000)}`;
      const newPass: VisitorPass = {
        id: `vis-${Date.now()}`,
        passCode: mockCode,
        visitorName: payload.visitorName,
        phone: payload.phone,
        idType: payload.idType,
        idNumber: payload.idNumber,
        hostName: payload.hostName,
        hostDepartment: payload.hostDepartment,
        purpose: payload.purpose,
        validDate: new Date().toISOString().split('T')[0],
        validUntilTime: '20:00',
        status: 'CHECKED_IN',
        checkInTime: new Date().toISOString(),
      };
      localVisitorsMemory.unshift(newPass);
      return newPass;
    }
  },
};
