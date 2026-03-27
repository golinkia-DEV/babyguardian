import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  useColorScheme,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { useBabyStore } from '../store/babyStore';
import { useMonitorStore } from '../store/monitorStore';
import { Colors } from '../theme/colors';

const { width, height } = Dimensions.get('window');

type BabyState = 'calm' | 'restless' | 'crying';

export const DashboardScreen: React.FC = () => {
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const theme = isDark ? Colors.dark : Colors.light;

  const { baby } = useBabyStore();
  const { babyState, lastCryEvent, cameraConnected } = useMonitorStore();

  const pulseAnim = new Animated.Value(1);

  useEffect(() => {
    if (babyState === 'crying') {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.2, duration: 500, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
        ])
      ).start();
    }
  }, [babyState]);

  const getStateColor = (): string => {
    switch (babyState) {
      case 'calm': return Colors.calmGreen;
      case 'restless': return Colors.warmAmber;
      case 'crying': return Colors.softRed;
    }
  };

  const getStateLabel = (): string => {
    switch (babyState) {
      case 'calm': return 'Tranquilo/a';
      case 'restless': return 'Inquieto/a';
      case 'crying': return 'Llorando';
    }
  };

  const getBabyAge = (): string => {
    if (!baby?.birthDate) return '';
    const now = new Date();
    const birth = new Date(baby.birthDate);
    const months = (now.getFullYear() - birth.getFullYear()) * 12 +
      (now.getMonth() - birth.getMonth());
    if (months < 1) return 'Recién nacido/a';
    if (months < 12) return `${months} ${months === 1 ? 'mes' : 'meses'}`;
    const years = Math.floor(months / 12);
    const remMonths = months % 12;
    return `${years} año${years > 1 ? 's' : ''}${remMonths > 0 ? ` ${remMonths}m` : ''}`;
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={theme.surface}
      />

      {/* Header - Baby info + status */}
      <View style={[styles.header, { backgroundColor: theme.surface }]}>
        <View>
          <Text style={[styles.babyName, { color: theme.textPrimary }]}>
            {baby?.name || 'Mi Bebé'}
          </Text>
          <Text style={[styles.babyAge, { color: theme.textSecondary }]}>
            {getBabyAge()}
          </Text>
        </View>

        <Animated.View
          style={[
            styles.statusIndicator,
            {
              backgroundColor: getStateColor() + '33',
              transform: [{ scale: pulseAnim }]
            }
          ]}
        >
          <View style={[styles.statusDot, { backgroundColor: getStateColor() }]} />
        </Animated.View>

        <Text style={[styles.statusLabel, { color: getStateColor() }]}>
          {getStateLabel()}
        </Text>
      </View>

      {/* Camera feed - main area */}
      <View style={styles.cameraContainer}>
        {cameraConnected ? (
          // VLCPlayer component for RTSP stream
          <View style={styles.cameraPlaceholder}>
            <Icon name="videocam" size={48} color={Colors.turquoise} />
            <Text style={styles.cameraConnectedText}>Cámara conectada</Text>
          </View>
        ) : (
          <View style={styles.cameraPlaceholder}>
            <Icon name="videocam-off" size={48} color="#666" />
            <Text style={styles.cameraOffText}>Sin cámara conectada</Text>
            <TouchableOpacity
              style={styles.connectButton}
              onPress={() => navigation.navigate('Settings' as never)}
            >
              <Text style={styles.connectButtonText}>Conectar cámara</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Floating calm button when crying */}
        {babyState === 'crying' && (
          <TouchableOpacity
            style={styles.calmButton}
            onPress={() => navigation.navigate('WhiteNoise' as never)}
          >
            <Icon name="headphones" size={24} color="white" />
            <Text style={styles.calmButtonText}>Activar ruido blanco</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Bottom action bar */}
      <View style={[styles.actionBar, { backgroundColor: theme.surface }]}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('WhiteNoise' as never)}
        >
          <Icon name="headphones" size={28} color={Colors.turquoise} />
          <Text style={[styles.actionLabel, { color: theme.textSecondary }]}>
            Ruido Blanco
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButtonPrimary, { backgroundColor: Colors.turquoise }]}
          onPress={() => navigation.navigate('Feeding' as never)}
        >
          <Icon name="local-drink" size={32} color="white" />
          <Text style={styles.actionLabelPrimary}>Registrar Toma</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('Settings' as never)}
        >
          <Icon name="settings" size={28} color={theme.textSecondary} />
          <Text style={[styles.actionLabel, { color: theme.textSecondary }]}>
            Config
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  babyName: { fontSize: 20, fontWeight: '700' },
  babyAge: { fontSize: 14, marginTop: 2 },
  statusIndicator: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusDot: { width: 32, height: 32, borderRadius: 16 },
  statusLabel: { fontSize: 14, fontWeight: '600' },
  cameraContainer: {
    flex: 1,
    backgroundColor: '#000',
    position: 'relative',
  },
  cameraPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  cameraConnectedText: { color: Colors.turquoise, fontSize: 16 },
  cameraOffText: { color: '#666', fontSize: 16 },
  connectButton: {
    backgroundColor: Colors.turquoise,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  connectButtonText: { color: 'white', fontWeight: '600', fontSize: 15 },
  calmButton: {
    position: 'absolute',
    bottom: 24,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.turquoise,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 28,
    gap: 8,
    elevation: 4,
  },
  calmButtonText: { color: 'white', fontSize: 16, fontWeight: '600' },
  actionBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  actionButton: { alignItems: 'center', gap: 4, paddingVertical: 8 },
  actionButtonPrimary: {
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 16,
  },
  actionLabel: { fontSize: 12 },
  actionLabelPrimary: { color: 'white', fontSize: 12, fontWeight: '600' },
});
