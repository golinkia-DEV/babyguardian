import React, { useMemo, useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator, useColorScheme,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Colors } from '../../theme/colors';
import { useDeviceDiscovery } from '../../hooks/useDeviceDiscovery';
import { devicesApi } from '../../api/devicesApi';

type DeviceType = 'light' | 'router' | 'sensor';

interface DiscoveredItem {
  ip: string;
  port: number;
  brand: string;
  model?: string;
  protocol?: string;
}

const DEVICE_CONFIG = {
  light: {
    icon: 'lightbulb',
    title: 'Deteccion de luces inteligentes',
    scanLabel: 'Iniciar deteccion de luces',
    emptyLabel: 'No se encontraron luces en la red.',
    setupRoute: 'LightSetup',
  },
  router: {
    icon: 'router',
    title: 'Deteccion de routers / ampolletas WiFi',
    scanLabel: 'Iniciar deteccion de routers',
    emptyLabel: 'No se encontraron routers en la red.',
    setupRoute: 'RouterSetup',
  },
  sensor: {
    icon: 'thermostat',
    title: 'Deteccion de sensores',
    scanLabel: 'Iniciar deteccion de sensores',
    emptyLabel: 'No se encontraron sensores en la red.',
    setupRoute: 'SensorSetup',
  },
} as const;

export const GenericDeviceDetectionScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const params = (route.params || {}) as { deviceType?: DeviceType };
  const deviceType = params.deviceType || 'light';
  const config = DEVICE_CONFIG[deviceType];

  const isDark = useColorScheme() === 'dark';
  const theme = isDark ? Colors.dark : Colors.light;
  const { scanForLights } = useDeviceDiscovery();
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<DiscoveredItem[]>([]);

  const helpText = useMemo(() => {
    if (deviceType === 'light') {
      return 'Asegurate de que la luz este encendida y conectada a la misma red WiFi.';
    }
    if (deviceType === 'router') {
      return 'Asegurate de que el router/ampolleta esta encendido y en la misma red.';
    }
    return 'Asegurate de que el sensor esta encendido y en la misma red WiFi.';
  }, [deviceType]);

  const scan = async () => {
    setLoading(true);
    try {
      if (deviceType === 'light') {
        const lights = await scanForLights();
        setResults(
          lights.map((l) => ({
            ip: l.ip,
            port: l.port,
            brand: l.brand,
            model: l.model,
            protocol: l.protocol,
          })),
        );
      } else if (deviceType === 'router') {
        const routers = await devicesApi.discover({ deviceType: 'router' });
        setResults(routers);
      } else {
        const sensors = await devicesApi.discover({ deviceType: 'sensor' });
        setResults(sensors);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color={theme.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.textPrimary }]}>{config.title}</Text>
      </View>

      <View style={[styles.tip, { backgroundColor: theme.surface }]}>
        <Icon name={config.icon} size={20} color={Colors.turquoise} />
        <Text style={[styles.tipText, { color: theme.textSecondary }]}>{helpText}</Text>
      </View>

      <TouchableOpacity style={styles.scanBtn} onPress={scan} disabled={loading}>
        {loading ? (
          <ActivityIndicator size="small" color="white" />
        ) : (
          <Icon name="search" size={18} color="white" />
        )}
        <Text style={styles.scanBtnText}>{config.scanLabel}</Text>
      </TouchableOpacity>

      <FlatList
        data={results}
        keyExtractor={(item) => `${item.ip}-${item.port}`}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Text style={[styles.empty, { color: theme.textSecondary }]}>
            {loading ? 'Buscando dispositivos...' : config.emptyLabel}
          </Text>
        }
        renderItem={({ item }) => (
          <View style={[styles.card, { backgroundColor: theme.surface }]}>
            <View style={styles.cardInfo}>
              <Text style={[styles.cardTitle, { color: theme.textPrimary }]}>
                {item.brand} {item.model ? `- ${item.model}` : ''}
              </Text>
              <Text style={[styles.cardSub, { color: theme.textSecondary }]}>
                {item.ip}:{item.port} {item.protocol ? `(${item.protocol})` : ''}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.addBtn}
              onPress={() =>
                navigation.navigate(
                  config.setupRoute as never,
                  { deviceType, device: item } as never,
                )
              }
            >
              <Icon name="add" size={20} color="white" />
            </TouchableOpacity>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  title: { fontSize: 20, fontWeight: '700', flex: 1 },
  tip: { borderRadius: 12, padding: 12, flexDirection: 'row', gap: 8, marginBottom: 12 },
  tipText: { flex: 1, fontSize: 13, lineHeight: 18 },
  scanBtn: {
    backgroundColor: Colors.turquoise,
    borderRadius: 10,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 12,
  },
  scanBtnText: { color: 'white', fontWeight: '700', fontSize: 15 },
  list: { gap: 10, paddingBottom: 24, flexGrow: 1 },
  empty: { textAlign: 'center', marginTop: 24, fontSize: 14 },
  card: { borderRadius: 12, padding: 14, flexDirection: 'row', alignItems: 'center' },
  cardInfo: { flex: 1 },
  cardTitle: { fontSize: 15, fontWeight: '700' },
  cardSub: { fontSize: 12, marginTop: 2 },
  addBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.turquoise,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
