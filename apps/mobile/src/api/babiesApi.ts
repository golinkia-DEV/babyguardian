import { apiClient } from './apiClient';

export interface BabyResponse {
  id: string;
  homeId: string;
  name: string;
  birthDate: string;
  gender?: 'male' | 'female' | 'other';
  countryCode: string;
}

export const babiesApi = {
  async createBaby(payload: {
    homeId: string;
    name: string;
    birthDate: string;
    countryCode: string;
    gender?: 'male' | 'female';
  }): Promise<BabyResponse> {
    const { data } = await apiClient.post<BabyResponse>('/babies', payload);
    return data;
  },

  async getBabiesByHome(homeId: string): Promise<BabyResponse[]> {
    const { data } = await apiClient.get<BabyResponse[]>(`/babies/home/${homeId}`);
    return data;
  },
};
