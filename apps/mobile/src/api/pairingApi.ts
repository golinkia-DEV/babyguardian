import { apiClient } from './apiClient';

export interface PairingTokenResponse {
  code: string;
  qrData: string;
  expiresAt: string;
}

export interface PairingStatusResponse {
  status: 'waiting' | 'linked' | 'expired';
}

export const pairingApi = {
  async generate(homeId: string): Promise<PairingTokenResponse> {
    const { data } = await apiClient.post<PairingTokenResponse>('/devices/pairing-token', { homeId });
    return data;
  },

  async status(code: string): Promise<PairingStatusResponse> {
    const { data } = await apiClient.get<PairingStatusResponse>(`/devices/pairing-status/${code}`);
    return data;
  },
};
