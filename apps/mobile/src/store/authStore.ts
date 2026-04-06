import { create } from 'zustand';
import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import * as Keychain from 'react-native-keychain';
import { authApi } from '../api/authApi';
import { usersApi } from '../api/usersApi';

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
  hydrated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, fullName: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  setAuth: (user: User, token: string) => void;
  hydrate: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  hydrated: false,

  setAuth: (user, token) => set({ user, token, isAuthenticated: true }),

  login: async (email, password) => {
    const backendAuth = await authApi.login(email, password);
    await Keychain.setGenericPassword(
      backendAuth.user.email,
      backendAuth.token,
      { service: 'babyguardian.jwt' },
    );
    set({
      user: {
        id: backendAuth.user.id,
        email: backendAuth.user.email,
        fullName: backendAuth.user.fullName,
        avatarUrl: backendAuth.user.avatarUrl,
      },
      token: backendAuth.token,
      isAuthenticated: true,
      hydrated: true,
    });
  },

  register: async (email, password, fullName) => {
    const backendAuth = await authApi.register(email, password, fullName);
    await Keychain.setGenericPassword(
      backendAuth.user.email,
      backendAuth.token,
      { service: 'babyguardian.jwt' },
    );
    set({
      user: {
        id: backendAuth.user.id,
        email: backendAuth.user.email,
        fullName: backendAuth.user.fullName,
        avatarUrl: backendAuth.user.avatarUrl,
      },
      token: backendAuth.token,
      isAuthenticated: true,
      hydrated: true,
    });
  },

  hydrate: async () => {
    if (get().hydrated) return;
    const devBypass = process.env.REACT_NATIVE_AUTH_DEV_BYPASS === 'true';
    if (devBypass) {
      set({
        user: {
          id: 'dev-bypass',
          email: 'dev@local',
          fullName: 'Dev (sin auth)',
        },
        token: null,
        isAuthenticated: true,
        hydrated: true,
      });
      return;
    }
    try {
      const creds = await Keychain.getGenericPassword({ service: 'babyguardian.jwt' });
      if (!creds?.password) {
        set({ hydrated: true });
        return;
      }
      set({ token: creds.password });
      const me = await usersApi.getMe();
      set({
        user: {
          id: me.id,
          email: me.email,
          fullName: me.fullName,
          avatarUrl: me.avatarUrl,
        },
        token: creds.password,
        isAuthenticated: true,
        hydrated: true,
      });
    } catch {
      await Keychain.resetGenericPassword({ service: 'babyguardian.jwt' }).catch(() => undefined);
      set({ user: null, token: null, isAuthenticated: false, hydrated: true });
    }
  },

  signInWithGoogle: async () => {
    const webClientId = process.env.REACT_NATIVE_GOOGLE_WEB_CLIENT_ID;
    if (!webClientId) {
      throw new Error('Falta REACT_NATIVE_GOOGLE_WEB_CLIENT_ID en configuración');
    }

    GoogleSignin.configure({
      webClientId,
      offlineAccess: false,
    });

    await GoogleSignin.hasPlayServices();
    const signInResult = await GoogleSignin.signIn();
    const idToken = signInResult?.data?.idToken;

    if (!idToken) {
      throw new Error('No fue posible obtener idToken de Google');
    }

    const googleCredential = auth.GoogleAuthProvider.credential(idToken);
    await auth().signInWithCredential(googleCredential);

    const backendAuth = await authApi.googleLogin(idToken);
    await Keychain.setGenericPassword(
      backendAuth.user.email,
      backendAuth.token,
      { service: 'babyguardian.jwt' },
    );

    set({
      user: {
        id: backendAuth.user.id,
        email: backendAuth.user.email,
        fullName: backendAuth.user.fullName,
        avatarUrl: backendAuth.user.avatarUrl,
      },
      token: backendAuth.token,
      isAuthenticated: true,
      hydrated: true,
    });
  },

  signOut: async () => {
    await GoogleSignin.signOut().catch(() => undefined);
    await auth().signOut().catch(() => undefined);
    await Keychain.resetGenericPassword({ service: 'babyguardian.jwt' }).catch(() => undefined);
    set({ user: null, token: null, isAuthenticated: false });
  },
}));
