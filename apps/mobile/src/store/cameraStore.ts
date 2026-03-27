import { create } from 'zustand';

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
  removeCamera: (id: string) => Promise<void>;
}

export const useCameraStore = create<CameraState>((set, get) => ({
  cameras: [],

  addCamera: async (data) => {
    // POST /api/v1/cameras
    const camera: Camera = { id: Date.now().toString(), ...data, isConnected: true };
    set({ cameras: [...get().cameras, camera] });
  },

  removeCamera: async (id) => {
    set({ cameras: get().cameras.filter(c => c.id !== id) });
  },
}));
