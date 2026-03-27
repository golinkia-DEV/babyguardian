import { create } from 'zustand';
import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import * as Keychain from 'react-native-keychain';
import { authApi } from '../api/authApi';

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
    });
  },

  signOut: async () => {
    await GoogleSignin.signOut().catch(() => undefined);
    await auth().signOut().catch(() => undefined);
    await Keychain.resetGenericPassword({ service: 'babyguardian.jwt' }).catch(() => undefined);
    set({ user: null, token: null, isAuthenticated: false });
  },
}));
