import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { DashboardScreen } from './screens/DashboardScreen';
import { FeedingScreen } from './screens/feeding/FeedingScreen';
import { VaccinesScreen } from './screens/vaccines/VaccinesScreen';
import { AddVaccineScreen } from './screens/vaccines/AddVaccineScreen';
import { MilestonesScreen } from './screens/milestones/MilestonesScreen';
import { OnboardingNavigator } from './navigation/OnboardingNavigator';
import { DevicesNavigator } from './navigation/DevicesNavigator';
import { SettingsScreen } from './screens/settings/SettingsScreen';
import { WhiteNoiseScreen } from './screens/whitenoise/WhiteNoiseScreen';
import { PrivacyCenterScreen } from './screens/privacy/PrivacyCenterScreen';
import { AIChatScreen } from './screens/ai/AIChatScreen';
import { AISettingsScreen } from './screens/ai/AISettingsScreen';
import { useAuthStore } from './store/authStore';
import { useHomeStore } from './store/homeStore';
import { useCameraStore } from './store/cameraStore';
import { useSmartDeviceStore } from './store/smartDeviceStore';
import { useAIStore } from './store/aiStore';

const Stack = createNativeStackNavigator();
const queryClient = new QueryClient();

function AppContent() {
  const { isAuthenticated, hydrated, hydrate } = useAuthStore();
  const { loadMyHome } = useHomeStore();
  const { loadCameras } = useCameraStore();
  const { loadDevices } = useSmartDeviceStore();
  const { hydrateProvider } = useAIStore();
  const [bootReady, setBootReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      await hydrate();
      await hydrateProvider();
      if (!cancelled) setBootReady(true);
    })();
    return () => {
      cancelled = true;
    };
  }, [hydrate, hydrateProvider]);

  useEffect(() => {
    if (!isAuthenticated || !hydrated) return;
    loadMyHome()
      .then(async () => {
        await Promise.all([loadCameras(), loadDevices()]);
      })
      .catch(() => undefined);
  }, [isAuthenticated, hydrated, loadMyHome, loadCameras, loadDevices]);

  if (!bootReady || !hydrated) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
      <NavigationContainer>
        <Stack.Navigator
          key={isAuthenticated ? 'authed' : 'guest'}
          screenOptions={{ headerShown: false }}
          initialRouteName={isAuthenticated ? 'Main' : 'Onboarding'}
        >
          <Stack.Screen name="Onboarding" component={OnboardingNavigator} />
          <Stack.Screen name="Main" component={DashboardScreen} />
          <Stack.Screen name="Dashboard" component={DashboardScreen} />
          <Stack.Screen name="Feeding" component={FeedingScreen} />
          <Stack.Screen name="Vaccines" component={VaccinesScreen} />
          <Stack.Screen name="AddVaccine" component={AddVaccineScreen} />
          <Stack.Screen name="Milestones" component={MilestonesScreen} />
          <Stack.Screen name="Settings" component={SettingsScreen} />
          <Stack.Screen name="Devices" component={DevicesNavigator} />
          <Stack.Screen name="WhiteNoise" component={WhiteNoiseScreen} />
          <Stack.Screen name="PrivacyCenter" component={PrivacyCenterScreen} />
          <Stack.Screen name="AIChat" component={AIChatScreen} />
          <Stack.Screen name="AISettings" component={AISettingsScreen} />
        </Stack.Navigator>
      </NavigationContainer>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  );
}
