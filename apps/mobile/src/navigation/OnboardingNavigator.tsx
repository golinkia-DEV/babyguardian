import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { WelcomeScreen } from '../screens/onboarding/WelcomeScreen';
import { GoogleLoginScreen } from '../screens/onboarding/GoogleLoginScreen';
import { AccountOwnershipScreen } from '../screens/onboarding/AccountOwnershipScreen';
import { CreateHomeScreen } from '../screens/onboarding/CreateHomeScreen';
import { LinkTabletScreen } from '../screens/onboarding/LinkTabletScreen';
import { SetupAlertsScreen } from '../screens/onboarding/SetupAlertsScreen';

const Stack = createNativeStackNavigator();

export const OnboardingNavigator: React.FC = () => (
  <Stack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
    <Stack.Screen name="Welcome" component={WelcomeScreen} />
    <Stack.Screen name="GoogleLogin" component={GoogleLoginScreen} />
    <Stack.Screen name="AccountOwnership" component={AccountOwnershipScreen} />
    <Stack.Screen name="CreateHome" component={CreateHomeScreen} />
    <Stack.Screen name="LinkTablet" component={LinkTabletScreen} />
    <Stack.Screen name="SetupDevices" component={() => null} />
    <Stack.Screen name="SetupAlerts" component={SetupAlertsScreen} />
  </Stack.Navigator>
);
