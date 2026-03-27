import { create } from 'zustand';
import { camerasApi } from '../api/camerasApi';
import { useHomeStore } from './homeStore';

interface Camera {
  id: string;
  name: string;
  brand: string;
  ip: string;
  port: number;
  isConnected: boolean;
}

interface CameraState {
  cameras: Camera[];
  addCamera: (data: any) => Promise<void>;
  loadCameras: () => Promise<void>;
  removeCamera: (id: string) => Promise<void>;
}

export const useCameraStore = create<CameraState>((set, get) => ({
  cameras: [],

  addCamera: async (data) => {
    const homeId = useHomeStore.getState().home?.id;
    if (!homeId) throw new Error('No hay hogar activo');
    const created = await camerasApi.create({
      homeId,
      name: data.name,
      brand: data.brand,
      model: data.model,
      ipAddress: data.ip,
      port: data.port,
      username: data.username,
      password: data.password,
      verifyCode: data.verifyCode,
    });
    const camera: Camera = {
      id: created.id,
      name: created.name,
      brand: created.brand || data.brand || 'IP Camera',
      ip: created.ipAddress,
      port: created.port,
      isConnected: created.isActive,
    };
    set({ cameras: [...get().cameras, camera] });
  },

  loadCameras: async () => {
    const homeId = useHomeStore.getState().home?.id;
    if (!homeId) return;
    const cameras = await camerasApi.byHome(homeId);
    set({
      cameras: cameras.map((c) => ({
        id: c.id,
        name: c.name,
        brand: c.brand || 'IP Camera',
        ip: c.ipAddress,
        port: c.port,
        isConnected: c.isActive,
      })),
    });
  },

  removeCamera: async (id) => {
    set({ cameras: get().cameras.filter(c => c.id !== id) });
  },
}));
