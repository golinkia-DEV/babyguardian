import { create } from 'zustand';
import { homesApi } from '../api/homesApi';
import { babiesApi } from '../api/babiesApi';
import { useBabyStore } from './babyStore';

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
  loadMyHome: () => Promise<void>;
  setActiveBaby: (baby: Baby) => void;
}

export const useHomeStore = create<HomeState>((set) => ({
  home: null,
  activeBaby: null,

  createHome: async ({ homeName, babyName, birthDate, country, gender }) => {
    const home = await homesApi.createHome({
      name: homeName,
      countryCode: country,
      timezone: 'America/Santiago',
    });

    const [day, month, year] = birthDate.split('/');
    const isoBirthDate = `${year}-${month}-${day}`;
    const baby = await babiesApi.createBaby({
      homeId: home.id,
      name: babyName,
      birthDate: isoBirthDate,
      countryCode: country,
      gender: (gender as 'male' | 'female' | undefined) || undefined,
    });

    const mappedHome: Home = {
      id: home.id,
      name: home.name,
      babies: [{
        id: baby.id,
        name: baby.name,
        birthDate: baby.birthDate,
        gender: baby.gender as 'male' | 'female' | undefined,
        country: baby.countryCode,
      }],
    };
    useBabyStore.getState().setBaby({
      id: mappedHome.babies[0].id,
      name: mappedHome.babies[0].name,
      birthDate: mappedHome.babies[0].birthDate,
      gender: (mappedHome.babies[0].gender as 'male' | 'female' | 'other') || 'other',
      country: mappedHome.babies[0].country,
    });
    set({ home: mappedHome, activeBaby: mappedHome.babies[0] });
  },

  loadMyHome: async () => {
    const homes = await homesApi.getMyHomes();
    if (!homes.length) return;
    const first = homes[0];
    const babies = await babiesApi.getBabiesByHome(first.id);
    const mappedHome: Home = {
      id: first.id,
      name: first.name,
      babies: babies.map((b) => ({
        id: b.id,
        name: b.name,
        birthDate: b.birthDate,
        gender: b.gender as 'male' | 'female' | undefined,
        country: b.countryCode,
      })),
    };
    if (mappedHome.babies[0]) {
      useBabyStore.getState().setBaby({
        id: mappedHome.babies[0].id,
        name: mappedHome.babies[0].name,
        birthDate: mappedHome.babies[0].birthDate,
        gender: (mappedHome.babies[0].gender as 'male' | 'female' | 'other') || 'other',
        country: mappedHome.babies[0].country,
      });
    } else {
      useBabyStore.getState().setBaby(null);
    }
    set({ home: mappedHome, activeBaby: mappedHome.babies[0] || null });
  },

  setActiveBaby: (baby) => {
    useBabyStore.getState().setBaby({
      id: baby.id,
      name: baby.name,
      birthDate: baby.birthDate,
      gender: (baby.gender as 'male' | 'female' | 'other') || 'other',
      country: baby.country,
    });
    set({ activeBaby: baby });
  },
}));
