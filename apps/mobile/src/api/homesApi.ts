import { apiClient } from './apiClient';

export interface HomeResponse {
  id: string;
  name: string;
  ownerId: string;
  countryCode: string;
  timezone: string;
}

export const homesApi = {
  async createHome(payload: { name: string; countryCode: string; timezone?: string }): Promise<HomeResponse> {
    const { data } = await apiClient.post<HomeResponse>('/homes', payload);
    return data;
  },
  async getMyHomes(): Promise<HomeResponse[]> {
    const { data } = await apiClient.get<HomeResponse[]>('/homes/mine');
    return data;
  },
};
