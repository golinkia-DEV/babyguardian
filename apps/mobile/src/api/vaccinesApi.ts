import { apiClient } from './apiClient';

export interface VaccineRecord {
  id: string;
  babyId: string;
  vaccineName: string;
  scheduledDate?: string;
  appliedDate?: string;
  status: 'applied' | 'pending' | 'upcoming';
}

export interface RecordVaccinePayload {
  babyId: string;
  vaccineName: string;
  appliedDate: string;
  status?: 'applied' | 'pending';
  notes?: string;
  catalogId?: string;
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

  async recordVaccine(payload: RecordVaccinePayload): Promise<VaccineRecord> {
    const { data } = await apiClient.post<VaccineRecord>('/vaccines', {
      babyId: payload.babyId,
      vaccineName: payload.vaccineName,
      appliedDate: payload.appliedDate,
      status: payload.status || 'applied',
      notes: payload.notes,
      catalogId: payload.catalogId,
    });
    return data;
  },

  async generateSchedule(babyId: string, birthDate: string, countryCode?: string): Promise<VaccineRecord[]> {
    const { data } = await apiClient.post<VaccineRecord[]>(
      `/vaccines/baby/${babyId}/generate-schedule`,
      { birthDate, countryCode },
    );
    return data;
  },
};
