import { create } from 'zustand';

interface User {
  id: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  setAuth: (user: User, token: string) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,

  setAuth: (user, token) => set({ user, token, isAuthenticated: true }),

  signInWithGoogle: async () => {
    // In production:
    // 1. Call Google Sign-In SDK
    // 2. Get idToken
    // 3. POST to /api/v1/auth/google with idToken
    // 4. Store JWT in Keychain (react-native-keychain)
    // 5. set({ user, token, isAuthenticated: true })
    throw new Error('Implement Google Sign-In with Firebase Auth SDK');
  },

  signOut: async () => {
    // Clear Keychain, clear store
    set({ user: null, token: null, isAuthenticated: false });
  },
}));
