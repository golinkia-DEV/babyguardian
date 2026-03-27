import { create } from 'zustand';

interface AlertSettings {
  crySensitivity: number;
  escalationMinutes: number;
  nightMode: 'auto' | 'always_on' | 'always_off';
}

interface SettingsState {
  alertSettings: AlertSettings;
  saveAlertSettings: (settings: AlertSettings) => Promise<void>;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  alertSettings: { crySensitivity: 2, escalationMinutes: 3, nightMode: 'auto' },
  saveAlertSettings: async (settings) => {
    // Save to MMKV + sync to backend
    set({ alertSettings: settings });
  },
}));
