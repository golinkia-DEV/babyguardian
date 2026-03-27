import { create } from 'zustand';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

type AIProvider = 'groq' | 'openai' | 'anthropic' | 'gemini';

interface AIState {
  messages: Message[];
  loading: boolean;
  provider: AIProvider;
  sendMessage: (text: string) => Promise<void>;
  clearHistory: () => void;
  setProvider: (provider: AIProvider) => void;
}

export const useAIStore = create<AIState>((set, get) => ({
  messages: [],
  loading: false,
  provider: 'groq',

  sendMessage: async (text) => {
    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: text, timestamp: new Date() };
    set(s => ({ messages: [...s.messages, userMsg], loading: true }));

    try {
      // Build baby context from stores
      // const babyContext = buildBabyContext();
      // Call AI provider API with baby context + message history
      // Store API key from Keychain (react-native-keychain)

      // Simulated response for dev
      await new Promise(r => setTimeout(r, 1500));
      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `Como asistente de crianza para tu bebé, te recomiendo consultar con tu pediatra. Esta es una respuesta de demostración. En producción, aquí irá la respuesta de ${get().provider} con el contexto completo del bebé.`,
        timestamp: new Date(),
      };
      set(s => ({ messages: [...s.messages, assistantMsg], loading: false }));
    } catch {
      set({ loading: false });
      throw new Error('AI provider unavailable');
    }
  },

  clearHistory: () => set({ messages: [] }),
  setProvider: (provider) => set({ provider }),
}));
