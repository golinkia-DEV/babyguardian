import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { DashboardScreen } from './screens/DashboardScreen';

const Stack = createNativeStackNavigator();
const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Dashboard" component={DashboardScreen} />
          {/* Add more screens: Feeding, WhiteNoise, Settings, Milestones, Vaccines, AI */}
        </Stack.Navigator>
      </NavigationContainer>
    </QueryClientProvider>
  );
}
