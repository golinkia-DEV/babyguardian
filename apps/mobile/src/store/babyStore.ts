import { create } from 'zustand';

export interface Baby {
  id: string;
  name: string;
  birthDate: string;
  gender: 'male' | 'female' | 'other';
  photoUrl?: string;
}

interface BabyStore {
  baby: Baby | null;
  setBaby: (baby: Baby | null) => void;
}

export const useBabyStore = create<BabyStore>((set) => ({
  baby: null,
  setBaby: (baby) => set({ baby }),
}));
