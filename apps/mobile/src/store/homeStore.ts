import { create } from 'zustand';

interface Baby {
  id: string;
  name: string;
  birthDate: string;
  gender?: 'male' | 'female';
  country: string;
}

interface Home {
  id: string;
  name: string;
  babies: Baby[];
}

interface HomeState {
  home: Home | null;
  activeBaby: Baby | null;
  createHome: (data: { homeName: string; babyName: string; birthDate: string; country: string; gender: string | null }) => Promise<void>;
  setActiveBaby: (baby: Baby) => void;
}

export const useHomeStore = create<HomeState>((set) => ({
  home: null,
  activeBaby: null,

  createHome: async ({ homeName, babyName, birthDate, country, gender }) => {
    // POST /api/v1/homes + POST /api/v1/babies
    const mockHome: Home = {
      id: '1',
      name: homeName,
      babies: [{ id: '1', name: babyName, birthDate, gender: gender as any, country }],
    };
    set({ home: mockHome, activeBaby: mockHome.babies[0] });
  },

  setActiveBaby: (baby) => set({ activeBaby: baby }),
}));
