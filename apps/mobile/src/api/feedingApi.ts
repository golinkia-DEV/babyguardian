import { apiClient } from './apiClient';

export interface FeedingPayload {
  babyId: string;
  feedingType: string;
  startTime: string;
  durationMinutes?: number;
  amountMl?: number;
  breastSide?: string;
  notes?: string;
}

export interface FeedingRecord {
  id: string;
  babyId: string;
  feedingType: string;
  startTime: string;
  durationMinutes?: number;
  amountMl?: number;
  breastSide?: string;
  notes?: string;
}

export const feedingApi = {
  async createFeeding(payload: FeedingPayload): Promise<FeedingRecord> {
    const { data } = await apiClient.post<FeedingRecord>('/feeding', payload);
    return data;
  },

  async getFeedingsByBaby(babyId: string, limit = 10): Promise<FeedingRecord[]> {
    const { data } = await apiClient.get<FeedingRecord[]>(`/feeding/baby/${babyId}`, {
      params: { limit },
    });
    return data;
  },
};
