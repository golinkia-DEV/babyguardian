import React from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  ScrollView, useColorScheme,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Colors } from '../../theme/colors';

const DEVICE_TYPES = [
  {
    id: 'camera',
    icon: 'videocam',
    title: 'Cámara IP',
    description: 'EZVIZ, Tapo, Hikvision, RTSP/ONVIF',
    color: Colors.turquoise,
    route: 'CameraDetection',
  },
  {
    id: 'light',
    icon: 'lightbulb',
    title: 'Luz inteligente',
    description: 'Yeelight, Philips Hue, LIFX, WiFi/MQTT',
    color: Colors.warmAmber,
    route: 'LightDetection',
  },
  {
    id: 'router',
    icon: 'router',
    title: 'Amolleta WiFi / Router',
    description: 'TP-Link, Xiaomi, dispositivos de red',
    color: '#9C6FDE',
    route: 'RouterDetection',
  },
  {
    id: 'sensor',
    icon: 'thermostat',
    title: 'Sensor temperatura/humedad',
    description: 'Sensores inteligentes para la habitación',
    color: '#4CAF50',
    route: 'SensorDetection',
  },
];

export const DeviceTypeScreen: React.FC = () => {
  const navigation = useNavigation();
  const isDark = useColorScheme() === 'dark';
  const theme = isDark ? Colors.dark : Colors.light;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Icon name="arrow-back" size={24} color={theme.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.textPrimary }]}>Detectar dispositivos</Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
          Selecciona el tipo de dispositivo que deseas conectar a BabyGuardian.
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.list}>
        {DEVICE_TYPES.map(device => (
          <TouchableOpacity
            key={device.id}
            style={[styles.deviceCard, { backgroundColor: theme.surface }]}
            onPress={() => navigation.navigate(device.route as never)}
            activeOpacity={0.85}
          >
            <View style={[styles.deviceIcon, { backgroundColor: device.color + '20' }]}>
              <Icon name={device.icon} size={36} color={device.color} />
            </View>
            <View style={styles.deviceInfo}>
              <Text style={[styles.deviceTitle, { color: theme.textPrimary }]}>{device.title}</Text>
              <Text style={[styles.deviceDesc, { color: theme.textSecondary }]}>{device.description}</Text>
            </View>
            <Icon name="chevron-right" size={24} color={theme.textSecondary} />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { padding: 24, paddingBottom: 16 },
  backBtn: { marginBottom: 16 },
  title: { fontSize: 26, fontWeight: '800', marginBottom: 8 },
  subtitle: { fontSize: 15, lineHeight: 22 },
  list: { paddingHorizontal: 24, gap: 12, paddingBottom: 32 },
  deviceCard: {
    flexDirection: 'row', alignItems: 'center', padding: 20,
    borderRadius: 16, gap: 16, elevation: 2,
    shadowColor: '#000', shadowOffset: { width:0,height:2 }, shadowOpacity:0.08, shadowRadius:4,
  },
  deviceIcon: { width: 64, height: 64, borderRadius: 32, alignItems: 'center', justifyContent: 'center' },
  deviceInfo: { flex: 1 },
  deviceTitle: { fontSize: 17, fontWeight: '700', marginBottom: 4 },
  deviceDesc: { fontSize: 13, lineHeight: 18 },
});
