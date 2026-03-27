import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { DeviceTypeScreen } from '../screens/devices/DeviceTypeScreen';
import { CameraDetectionScreen } from '../screens/devices/CameraDetectionScreen';
import { CameraSetupScreen } from '../screens/devices/CameraSetupScreen';
import { GenericDeviceDetectionScreen } from '../screens/devices/GenericDeviceDetectionScreen';
import { GenericDeviceSetupScreen } from '../screens/devices/GenericDeviceSetupScreen';

const Stack = createNativeStackNavigator();

export const DevicesNavigator: React.FC = () => (
  <Stack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
    <Stack.Screen name="DeviceType" component={DeviceTypeScreen} />
    <Stack.Screen name="CameraDetection" component={CameraDetectionScreen} />
    <Stack.Screen name="CameraSetup" component={CameraSetupScreen} />
    <Stack.Screen
      name="LightDetection"
      component={GenericDeviceDetectionScreen}
      initialParams={{ deviceType: 'light' }}
    />
    <Stack.Screen
      name="RouterDetection"
      component={GenericDeviceDetectionScreen}
      initialParams={{ deviceType: 'router' }}
    />
    <Stack.Screen
      name="SensorDetection"
      component={GenericDeviceDetectionScreen}
      initialParams={{ deviceType: 'sensor' }}
    />
    <Stack.Screen
      name="LightSetup"
      component={GenericDeviceSetupScreen}
      initialParams={{ deviceType: 'light' }}
    />
    <Stack.Screen
      name="RouterSetup"
      component={GenericDeviceSetupScreen}
      initialParams={{ deviceType: 'router' }}
    />
    <Stack.Screen
      name="SensorSetup"
      component={GenericDeviceSetupScreen}
      initialParams={{ deviceType: 'sensor' }}
    />
  </Stack.Navigator>
);
