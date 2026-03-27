import { apiClient } from './apiClient';

export interface SmartDevicePayload {
  homeId: string;
  name: string;
  deviceType: string;
  protocol?: string;
  ipAddress?: string;
  currentState?: Record<string, unknown>;
}

export interface SmartDeviceResponse {
  id: string;
  homeId: string;
  name: string;
  deviceType: string;
  protocol?: string;
  ipAddress?: string;
  currentState: Record<string, unknown>;
  isActive: boolean;
}

export interface DiscoveryResult {
  ip: string;
  port: number;
  brand: string;
  model?: string;
  protocol: 'rtsp' | 'onvif' | 'http' | 'mqtt' | 'yeelight' | 'hue';
}

export const devicesApi = {
  async createDevice(payload: SmartDevicePayload): Promise<SmartDeviceResponse> {
    const { data } = await apiClient.post<SmartDeviceResponse>('/devices', payload);
    return data;
  },

  async getByHome(homeId: string): Promise<SmartDeviceResponse[]> {
    const { data } = await apiClient.get<SmartDeviceResponse[]>(`/devices/home/${homeId}`);
    return data;
  },

  async discover(payload: {
    deviceType: 'camera' | 'light' | 'router' | 'sensor';
    subnet?: string;
  }): Promise<DiscoveryResult[]> {
    const { data } = await apiClient.post<DiscoveryResult[]>('/devices/discover', payload);
    return data;
  },
};
