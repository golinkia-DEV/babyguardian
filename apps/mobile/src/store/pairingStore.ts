import { create } from 'zustand';
import { pairingApi } from '../api/pairingApi';
import { useHomeStore } from './homeStore';

type PairingStatus = 'idle' | 'waiting' | 'linked' | 'expired' | 'error';

interface PairingState {
  pairingCode: string | null;
  qrData: string | null;
  pairingStatus: PairingStatus;
  generatePairingCode: () => Promise<void>;
  checkPairingStatus: () => Promise<void>;
}

export const usePairingStore = create<PairingState>((set, get) => ({
  pairingCode: null,
  qrData: null,
  pairingStatus: 'idle',

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

  checkPairingStatus: async () => {
    const code = get().pairingCode;
    if (!code) return;
    const status = await pairingApi.status(code);
    set({ pairingStatus: status.status });
  },
}));
