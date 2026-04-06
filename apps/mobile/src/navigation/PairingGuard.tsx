import React, { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useHomeStore } from '../store/homeStore';
import { useAuthStore } from '../store/authStore';

/**
 * PairingGuard component wraps the main navigation
 * and redirects to PairingScreen if user is not paired with any home
 */
const PairingGuard: React.FC<{
  children: React.ReactNode;
  onPairingRequired: () => void;
  onPairingDone: () => void;
}> = ({ children, onPairingRequired, onPairingDone }) => {
  const { homes, fetchHomes, isLoading } = useHomeStore();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    const checkPairingStatus = async () => {
      if (!isAuthenticated) return;

      try {
        await fetchHomes();
        // If no homes found, user needs to pair
        if (!homes || homes.length === 0) {
          onPairingRequired();
        } else {
          onPairingDone();
        }
      } catch (error) {
        console.error('Error checking pairing status:', error);
      }
    };

    checkPairingStatus();
  }, [isAuthenticated]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#00bcd4" />
      </View>
    );
  }

  return <>{children}</>;
};

export default PairingGuard;
