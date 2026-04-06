import { useEffect, useState } from 'react';
import { useHomeStore } from '../store/homeStore';

/**
 * Hook to check if the current user has paired with a home
 * Returns true if paired, false if not paired
 */
export const usePairingCheck = () => {
  const [isPaired, setIsPaired] = useState<boolean | null>(null);
  const { homes, fetchHomes } = useHomeStore();

  useEffect(() => {
    const checkPairing = async () => {
      try {
        // Fetch homes to see if user has any
        await fetchHomes();
        // If we have homes, user is paired
        setIsPaired((homes && homes.length > 0) ? true : false);
      } catch (error) {
        console.error('Error checking pairing:', error);
        setIsPaired(false);
      }
    };

    checkPairing();
  }, []);

  return { isPaired };
};
