import { create } from 'zustand';
import { pairingApi, ClaimPairingSessionRequest } from '../api/pairingApi';
import { useHomeStore } from './homeStore';

type PairingStatus = 'idle' | 'waiting' | 'linked' | 'expired' | 'error';

interface PairingState {
  // Legacy attributes (keep for backwards compatibility)
  pairingCode: string | null;
  qrData: string | null;
  pairingStatus: PairingStatus;

  // New claim flow
  isClaimingSession: boolean;
  claimError: string | null;

  // Methods
  generatePairingCode: () => Promise<void>;
  checkPairingStatus: () => Promise<void>;
  claimPairingSession: (request: ClaimPairingSessionRequest) => Promise<boolean>;
  clearClaimError: () => void;
}

export const usePairingStore = create<PairingState>((set, get) => ({
  // Initial state
  pairingCode: null,
  qrData: null,
  pairingStatus: 'idle',
  isClaimingSession: false,
  claimError: null,

  // Legacy method (for backwards compatibility)
  generatePairingCode: async () => {
    const homeId = useHomeStore.getState().home?.id;
    if (!homeId) throw new Error('No hay hogar activo para vincular');
    const pairing = await pairingApi.generate(homeId);
    set({
      pairingCode: pairing.code,
      qrData: pairing.qrData,
      pairingStatus: 'waiting',
    });

    // Start polling for pairing confirmation
    const poll = setInterval(async () => {
      await get().checkPairingStatus();
      if (get().pairingStatus !== 'waiting') clearInterval(poll);
    }, 3000);
  },

  // Legacy method (for backwards compatibility)
  checkPairingStatus: async () => {
    const code = get().pairingCode;
    if (!code) return;
    const status = await pairingApi.status(code);
    set({ pairingStatus: status.status });
  },

  // New claim flow: mobile receives code or token from hub and claims it
  claimPairingSession: async (request: ClaimPairingSessionRequest) => {
    set({ isClaimingSession: true, claimError: null });
    try {
      const response = await pairingApi.claimSession(request);

      if (response.success && response.homeId) {
        // Link user to this home
        const homeStore = useHomeStore.getState();
        // Refetch homes to include the newly paired home
        await homeStore.fetchHomes();

        set({
          isClaimingSession: false,
          pairingStatus: 'linked',
        });
        return true;
      } else {
        const reason = response.reason || 'No se pudo vincular el código';
        set({
          isClaimingSession: false,
          claimError: reason,
          pairingStatus: 'error',
        });
        return false;
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error de conexión';
      set({
        isClaimingSession: false,
        claimError: message,
        pairingStatus: 'error',
      });
      return false;
    }
  },

  clearClaimError: () => {
    set({ claimError: null });
  },
}));
