import { create } from 'zustand';

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
    // POST /api/v1/feeding
    const record: FeedingRecord = { id: Date.now().toString(), ...data, timeAgo: 'Ahora' };
    set({ recentFeedings: [record, ...get().recentFeedings].slice(0, 20) });
  },

  loadRecentFeedings: async (_babyId) => {
    // GET /api/v1/feeding?babyId=...&limit=10
  },
}));
