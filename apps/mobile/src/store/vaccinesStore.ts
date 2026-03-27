import { create } from 'zustand';
import { vaccinesApi, VaccineRecord } from '../api/vaccinesApi';
import { useBabyStore } from './babyStore';

function normalizeStatus(raw: VaccineRecord): VaccineRecord['status'] {
  const s = raw.status as string;
  if (s === 'applied') return 'applied';
  if (s === 'pending' && raw.scheduledDate) {
    const d = new Date(raw.scheduledDate);
    if (!Number.isNaN(d.getTime()) && d > new Date()) return 'upcoming';
  }
  if (s === 'pending') return 'pending';
  return 'pending';
}

function mapApiToUi(v: VaccineRecord): VaccineRecord {
  return { ...v, status: normalizeStatus(v) };
}

interface VaccinesState {
  vaccines: VaccineRecord[];
  loading: boolean;
  loadVaccines: () => Promise<void>;
  markAsApplied: (id: string, appliedDate?: string) => Promise<void>;
  addManualVaccine: (payload: { vaccineName: string; appliedDate: string; notes?: string }) => Promise<void>;
}

export const useVaccinesStore = create<VaccinesState>((set, get) => ({
  vaccines: [],
  loading: false,

  loadVaccines: async () => {
    const babyId = useBabyStore.getState().baby?.id;
    if (!babyId) return;

    set({ loading: true });
    try {
      const list = await vaccinesApi.getBabyVaccines(babyId);
      set({ vaccines: list.map(mapApiToUi) });
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
      vaccines: get().vaccines.map((v) => (v.id === id ? mapApiToUi(updated) : v)),
    });
  },

  addManualVaccine: async ({ vaccineName, appliedDate, notes }) => {
    const babyId = useBabyStore.getState().baby?.id;
    if (!babyId) throw new Error('No hay bebé seleccionado');
    const created = await vaccinesApi.recordVaccine({
      babyId,
      vaccineName,
      appliedDate,
      status: 'applied',
      notes,
    });
    set({ vaccines: [mapApiToUi(created), ...get().vaccines] });
  },
}));
