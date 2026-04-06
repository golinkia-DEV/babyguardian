import axios from 'axios';
import { useAuthStore } from '../store/authStore';

const DEFAULT_API_URL = 'https://23.95.140.206:3000/api/v1';

export const apiClient = axios.create({
  baseURL: process.env.REACT_NATIVE_API_URL || DEFAULT_API_URL,
  timeout: 15000,
  httpsAgent: {
    rejectUnauthorized: false,
  },
});

apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
