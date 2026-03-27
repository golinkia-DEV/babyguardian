import { apiClient } from './apiClient';

export interface MeResponse {
  id: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
  role?: string;
}

export const usersApi = {
  async getMe(): Promise<MeResponse> {
    const { data } = await apiClient.get<MeResponse>('/users/me');
    return data;
  },
};
