import { apiClient } from './apiClient';

export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
}

export interface AuthResponse {
  user: AuthUser;
  token: string;
}

export const authApi = {
  async googleLogin(idToken: string): Promise<AuthResponse> {
    const { data } = await apiClient.post<AuthResponse>('/auth/google', { idToken });
    return data;
  },
};
