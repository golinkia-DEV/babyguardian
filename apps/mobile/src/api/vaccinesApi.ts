import { apiClient } from './apiClient';

export interface VaccineRecord {
  id: string;
  babyId: string;
  vaccineName: string;
  scheduledDate?: string;
  appliedDate?: string;
  status: 'applied' | 'pending' | 'upcoming';
}

export const vaccinesApi = {
  async getBabyVaccines(babyId: string): Promise<VaccineRecord[]> {
    const { data } = await apiClient.get<VaccineRecord[]>(`/vaccines/baby/${babyId}`);
    return data;
  },

  async updateVaccineStatus(id: string, status: 'applied' | 'pending' | 'upcoming', appliedDate?: string): Promise<VaccineRecord> {
    const { data } = await apiClient.patch<VaccineRecord>(`/vaccines/${id}/status`, { status, appliedDate });
    return data;
  },
};
