import { create } from 'zustand';
import { vaccinesApi, VaccineRecord } from '../api/vaccinesApi';
import { useBabyStore } from './babyStore';

interface VaccinesState {
  vaccines: VaccineRecord[];
  loading: boolean;
  loadVaccines: () => Promise<void>;
  markAsApplied: (id: string, appliedDate?: string) => Promise<void>;
}

export const useVaccinesStore = create<VaccinesState>((set, get) => ({
  vaccines: [],
  loading: false,

  loadVaccines: async () => {
    const babyId = useBabyStore.getState().baby?.id;
    if (!babyId) return;

    set({ loading: true });
    try {
      const vaccines = await vaccinesApi.getBabyVaccines(babyId);
      set({ vaccines });
    } finally {
      set({ loading: false });
    }
  },

  markAsApplied: async (id, appliedDate) => {
    const updated = await vaccinesApi.updateVaccineStatus(
      id,
      'applied',
      appliedDate || new Date().toISOString().split('T')[0],
    );

    set({
      vaccines: get().vaccines.map((v) => (v.id === id ? updated : v)),
    });
  },
}));
