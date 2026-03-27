import { apiClient } from './apiClient';

export interface CameraPayload {
  homeId: string;
  name: string;
  brand?: string;
  model?: string;
  ipAddress: string;
  port: number;
  username?: string;
  password?: string;
  verifyCode?: string;
}

export interface CameraResponse {
  id: string;
  homeId: string;
  name: string;
  brand?: string;
  model?: string;
  ipAddress: string;
  port: number;
  isActive: boolean;
}

export const camerasApi = {
  async create(payload: CameraPayload): Promise<CameraResponse> {
    const { data } = await apiClient.post<CameraResponse>('/cameras', payload);
    return data;
  },

  async byHome(homeId: string): Promise<CameraResponse[]> {
    const { data } = await apiClient.get<CameraResponse[]>(`/cameras/home/${homeId}`);
    return data;
  },
};
