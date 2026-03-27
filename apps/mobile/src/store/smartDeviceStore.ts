import { create } from 'zustand';
import { devicesApi } from '../api/devicesApi';
import { useHomeStore } from './homeStore';

export type SmartDeviceType = 'light' | 'router' | 'sensor';

export interface SmartDevice {
  id: string;
  type: SmartDeviceType;
  name: string;
  model?: string;
  ip: string;
  port: number;
  protocol?: string;
  isConnected: boolean;
  createdAt: string;
}

interface SmartDeviceState {
  devices: SmartDevice[];
  addDevice: (device: Omit<SmartDevice, 'id' | 'createdAt' | 'isConnected'>) => Promise<void>;
  loadDevices: () => Promise<void>;
  removeDevice: (id: string) => Promise<void>;
}

export const useSmartDeviceStore = create<SmartDeviceState>((set, get) => ({
  devices: [],

  addDevice: async (device) => {
    const homeId = useHomeStore.getState().home?.id;
    if (!homeId) throw new Error('No hay hogar activo');
    const created = await devicesApi.createDevice({
      homeId,
      name: device.name,
      deviceType: device.type,
      protocol: device.protocol,
      ipAddress: device.ip,
      currentState: {},
    });
    set({
      devices: [
        {
          id: created.id,
          type: created.deviceType as SmartDeviceType,
          name: created.name,
          model: device.model,
          ip: created.ipAddress || device.ip,
          port: device.port,
          protocol: created.protocol || device.protocol,
          isConnected: created.isActive,
          createdAt: new Date().toISOString(),
        },
        ...get().devices,
      ],
    });
  },

  loadDevices: async () => {
    const homeId = useHomeStore.getState().home?.id;
    if (!homeId) return;
    const devices = await devicesApi.getByHome(homeId);
    set({
      devices: devices.map((d) => ({
        id: d.id,
        type: d.deviceType as SmartDeviceType,
        name: d.name,
        ip: d.ipAddress || '',
        port: d.currentState?.port as number || 0,
        protocol: d.protocol,
        isConnected: d.isActive,
        createdAt: new Date().toISOString(),
      })),
    });
  },

  removeDevice: async (id) => {
    set({ devices: get().devices.filter((d) => d.id !== id) });
  },
}));
