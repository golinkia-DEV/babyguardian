import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { aiApi } from '../api/aiApi';
import { useBabyStore } from './babyStore';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

type AIProvider = 'groq' | 'openai' | 'anthropic' | 'gemini';

const STORAGE_KEY = 'babyguardian.ai.provider';

function monthsFromBirth(isoDate?: string): number {
  if (!isoDate) return 0;
  const birth = new Date(isoDate);
  if (Number.isNaN(birth.getTime())) return 0;
  const now = new Date();
  return (now.getFullYear() - birth.getFullYear()) * 12 + (now.getMonth() - birth.getMonth());
}

function toBackendProvider(p: AIProvider): 'groq' | 'openai' | 'anthropic' {
  if (p === 'gemini') return 'groq';
  return p;
}

interface AIState {
  messages: Message[];
  loading: boolean;
  provider: AIProvider;
  providerHydrated: boolean;
  sendMessage: (text: string) => Promise<void>;
  clearHistory: () => void;
  setProvider: (provider: AIProvider) => Promise<void>;
  hydrateProvider: () => Promise<void>;
}

export const useAIStore = create<AIState>((set, get) => ({
  messages: [],
  loading: false,
  provider: 'groq',
  providerHydrated: false,

  hydrateProvider: async () => {
    if (get().providerHydrated) return;
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      const allowed: AIProvider[] = ['groq', 'openai', 'anthropic', 'gemini'];
      if (raw && allowed.includes(raw as AIProvider)) {
        set({ provider: raw as AIProvider });
      }
    } finally {
      set({ providerHydrated: true });
    }
  },

  sendMessage: async (text) => {
    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date(),
    };
    set((s) => ({ messages: [...s.messages, userMsg], loading: true }));

    try {
      const { baby } = useBabyStore.getState();
      const ageMonths = monthsFromBirth(baby?.birthDate);
      const history = get().messages.slice(-12).map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await aiApi.chat({
        messages: history,
        babyName: baby?.name,
        ageMonths,
        provider: toBackendProvider(get().provider),
      });

      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: res.content || 'Sin respuesta del servidor.',
        timestamp: new Date(),
      };
      set((s) => ({ messages: [...s.messages, assistantMsg], loading: false }));
    } catch {
      set({ loading: false });
      throw new Error('AI provider unavailable');
    }
  },

  clearHistory: () => set({ messages: [] }),

  setProvider: async (provider) => {
    await AsyncStorage.setItem(STORAGE_KEY, provider);
    set({ provider });
  },
}));
