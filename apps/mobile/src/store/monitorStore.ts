import { create } from 'zustand';

type BabyState = 'calm' | 'restless' | 'crying';

interface CryEvent {
  timestamp: string;
  confidence: number;
}

interface MonitorStore {
  babyState: BabyState;
  lastCryEvent: CryEvent | null;
  cameraConnected: boolean;
  setBabyState: (state: BabyState) => void;
  setLastCryEvent: (event: CryEvent | null) => void;
  setCameraConnected: (connected: boolean) => void;
}

export const useMonitorStore = create<MonitorStore>((set) => ({
  babyState: 'calm',
  lastCryEvent: null,
  cameraConnected: false,
  setBabyState: (babyState) => set({ babyState }),
  setLastCryEvent: (lastCryEvent) => set({ lastCryEvent }),
  setCameraConnected: (cameraConnected) => set({ cameraConnected }),
}));
