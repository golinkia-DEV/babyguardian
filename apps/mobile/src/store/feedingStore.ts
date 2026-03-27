import { create } from 'zustand';
import { feedingApi } from '../api/feedingApi';
import { useBabyStore } from './babyStore';

interface FeedingRecord {
  id: string;
  feedingType: string;
  startTime: string;
  durationMinutes?: number;
  amountMl?: number;
  breastSide?: string;
  notes?: string;
  timeAgo: string;
}

interface FeedingState {
  recentFeedings: FeedingRecord[];
  addFeeding: (data: Omit<FeedingRecord, 'id' | 'timeAgo'>) => Promise<void>;
  loadRecentFeedings: (babyId: string) => Promise<void>;
}

const getTimeAgo = (isoDate: string): string => {
  const diff = Date.now() - new Date(isoDate).getTime();
  const hours = Math.floor(diff / 3600000);
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'Ahora';
  if (minutes < 60) return `Hace ${minutes}min`;
  return `Hace ${hours}h`;
};

export const useFeedingStore = create<FeedingState>((set, get) => ({
  recentFeedings: [],

  addFeeding: async (data) => {
    const babyId = useBabyStore.getState().baby?.id;
    if (!babyId) {
      throw new Error('No hay bebé seleccionado para registrar la toma');
    }

    const created = await feedingApi.createFeeding({
      ...data,
      babyId,
    });

    const record: FeedingRecord = {
      ...created,
      timeAgo: getTimeAgo(created.startTime),
    };
    set({ recentFeedings: [record, ...get().recentFeedings].slice(0, 20) });
  },

  loadRecentFeedings: async (babyId) => {
    const feedings = await feedingApi.getFeedingsByBaby(babyId, 10);
    set({
      recentFeedings: feedings.map((f) => ({
        ...f,
        timeAgo: getTimeAgo(f.startTime),
      })),
    });
  },
}));
