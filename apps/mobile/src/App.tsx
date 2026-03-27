import React, { useEffect } from 'react';
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

const Stack = createNativeStackNavigator();
const queryClient = new QueryClient();

export default function App() {
  const { isAuthenticated } = useAuthStore();
  const { loadMyHome } = useHomeStore();
  const { loadCameras } = useCameraStore();
  const { loadDevices } = useSmartDeviceStore();

  useEffect(() => {
    if (!isAuthenticated) return;
    loadMyHome()
      .then(async () => {
        await Promise.all([loadCameras(), loadDevices()]);
      })
      .catch(() => undefined);
  }, [isAuthenticated, loadMyHome, loadCameras, loadDevices]);

  return (
    <QueryClientProvider client={queryClient}>
      <NavigationContainer>
        <Stack.Navigator
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
    </QueryClientProvider>
  );
}
