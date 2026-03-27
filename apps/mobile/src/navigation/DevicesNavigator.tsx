import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { DeviceTypeScreen } from '../screens/devices/DeviceTypeScreen';
import { CameraDetectionScreen } from '../screens/devices/CameraDetectionScreen';
import { CameraSetupScreen } from '../screens/devices/CameraSetupScreen';

const Stack = createNativeStackNavigator();

export const DevicesNavigator: React.FC = () => (
  <Stack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
    <Stack.Screen name="DeviceType" component={DeviceTypeScreen} />
    <Stack.Screen name="CameraDetection" component={CameraDetectionScreen} />
    <Stack.Screen name="CameraSetup" component={CameraSetupScreen} />
    <Stack.Screen name="LightDetection" component={() => null} />
    <Stack.Screen name="RouterDetection" component={() => null} />
    <Stack.Screen name="SensorDetection" component={() => null} />
  </Stack.Navigator>
);
