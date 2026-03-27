import { create } from 'zustand';

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
    // POST /api/v1/devices/pairing-token
    // Returns: { code: 'ABC-123', qrData: 'babyguardian://pair?token=...', expiresAt }
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    set({
      pairingCode: code,
      qrData: `babyguardian://pair?token=${code}`,
      pairingStatus: 'waiting',
    });

    // Start polling for pairing confirmation
    const poll = setInterval(async () => {
      await get().checkPairingStatus();
      if (get().pairingStatus !== 'waiting') clearInterval(poll);
    }, 3000);
  },

  checkPairingStatus: async () => {
    // GET /api/v1/devices/pairing-status?code=...
    // For demo purposes only
  },
}));
