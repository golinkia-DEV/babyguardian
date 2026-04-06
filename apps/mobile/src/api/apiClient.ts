import axios from 'axios';
import { useAuthStore } from '../store/authStore';

const API_URL = 'https://babyguardian.golinkia.com/api/v1';

export const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 15000,
});

apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
