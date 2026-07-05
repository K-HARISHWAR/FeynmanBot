import { api } from '../../config/api';
import type { ReportResponse } from '../../types/report';

export const reportApi = {
  getReport: async (reportId: string): Promise<ReportResponse> => {
    const response = await api.get(`/reports/${reportId}`);
    return response.data;
  }
};
