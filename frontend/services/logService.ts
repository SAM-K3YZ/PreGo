import { ENDPOINTS } from '@/constants/apiEndpoints';
import apiClient from './apiClient';
import { SymptomEntryPayload } from '@/types';

// Contract for the future symptoms endpoint: save all selected experiences as one entry.


export const logService = {
  async saveSymptomEntry(payload: SymptomEntryPayload): Promise<void> {
    await apiClient.post(ENDPOINTS.LOGS.SYMPTOMS, payload);
  },
};
