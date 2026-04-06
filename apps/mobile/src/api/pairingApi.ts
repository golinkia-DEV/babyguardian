import { apiClient } from './apiClient';

// Legacy pairing (for backwards compatibility)
export interface PairingTokenResponse {
  code: string;
  qrData: string;
  expiresAt: string;
}

export interface PairingStatusResponse {
  status: 'waiting' | 'linked' | 'expired';
}

// New hub-first pairing
export interface ClaimPairingSessionRequest {
  code?: string;
  pairingToken?: string;
}

export interface ClaimPairingSessionResponse {
  success: boolean;
  homeId?: string;
  reason?: string;
}

export const pairingApi = {
  // Legacy methods (keep for backwards compatibility)
  async generate(homeId: string): Promise<PairingTokenResponse> {
    const { data } = await apiClient.post<PairingTokenResponse>('/devices/pairing-token', { homeId });
    return data;
  },

  async status(code: string): Promise<PairingStatusResponse> {
    const { data } = await apiClient.get<PairingStatusResponse>(`/devices/pairing-status/${code}`);
    return data;
  },

  // New hub-first pairing flow
  async claimSession(request: ClaimPairingSessionRequest): Promise<ClaimPairingSessionResponse> {
    const { data } = await apiClient.post<ClaimPairingSessionResponse>('/devices/pairing/claim', request);
    return data;
  },
};
