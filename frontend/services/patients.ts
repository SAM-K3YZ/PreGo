import apiClient from '@/services/apiClient';
import { ENDPOINTS } from '@/constants/apiEndpoints';
import type { PatientProfile } from '@/types';

export async function getMyPatientProfile(): Promise<PatientProfile> {
  const { data } = await apiClient.get(ENDPOINTS.PATIENTS.ME);
  return data;
}
