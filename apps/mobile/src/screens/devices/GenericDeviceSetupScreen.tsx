import React, { useMemo, useState } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity, useColorScheme, Alert, ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Colors } from '../../theme/colors';
import { SmartDeviceType, useSmartDeviceStore } from '../../store/smartDeviceStore';

const DEFAULT_PORT: Record<SmartDeviceType, number> = {
  light: 80,
  router: 80,
  sensor: 1883,
};

const DEFAULT_PROTOCOL: Record<SmartDeviceType, string> = {
  light: 'http',
  router: 'http',
  sensor: 'mqtt',
};

export const GenericDeviceSetupScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const params = (route.params || {}) as {
    deviceType?: SmartDeviceType;
    device?: { ip?: string; port?: number; brand?: string; model?: string; protocol?: string };
  };
  const deviceType: SmartDeviceType = params.deviceType || 'light';

  const isDark = useColorScheme() === 'dark';
  const theme = isDark ? Colors.dark : Colors.light;
  const { addDevice } = useSmartDeviceStore();

  const [name, setName] = useState(
    deviceType === 'light'
      ? 'Luz de cuna'
      : deviceType === 'router'
        ? 'Router principal'
        : 'Sensor de temperatura',
  );
  const [model, setModel] = useState(params.device?.model || params.device?.brand || '');
  const [ip, setIp] = useState(params.device?.ip || '');
  const [port, setPort] = useState(String(params.device?.port || DEFAULT_PORT[deviceType]));
  const [protocol, setProtocol] = useState(params.device?.protocol || DEFAULT_PROTOCOL[deviceType]);
  const [apiKey, setApiKey] = useState('');

  const title = useMemo(() => {
    if (deviceType === 'light') return 'Sincronizar luz inteligente';
    if (deviceType === 'router') return 'Sincronizar router / ampolleta';
    return 'Sincronizar sensor';
  }, [deviceType]);

  const save = async () => {
    if (!name.trim() || !ip.trim()) {
      Alert.alert('Datos incompletos', 'Completa al menos nombre e IP.');
      return;
    }

    await addDevice({
      type: deviceType,
      name: name.trim(),
      model: model.trim() || undefined,
      ip: ip.trim(),
      port: Number(port) || DEFAULT_PORT[deviceType],
      protocol: protocol.trim() || undefined,
    });

    Alert.alert('Sincronizacion exitosa', 'El dispositivo se vinculo correctamente.', [
      { text: 'OK', onPress: () => navigation.goBack() },
    ]);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color={theme.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.textPrimary }]}>{title}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Field
          label="Nombre"
          value={name}
          onChange={setName}
          theme={theme}
          placeholder="Nombre del dispositivo"
        />
        <Field
          label="Modelo"
          value={model}
          onChange={setModel}
          theme={theme}
          placeholder="Modelo/fabricante"
        />
        <Field
          label="IP"
          value={ip}
          onChange={setIp}
          theme={theme}
          placeholder="192.168.1.x"
        />
        <Field
          label="Puerto"
          value={port}
          onChange={setPort}
          theme={theme}
          placeholder="80"
          keyboardType="numeric"
        />
        <Field
          label="Protocolo"
          value={protocol}
          onChange={setProtocol}
          theme={theme}
          placeholder="http / mqtt / https"
        />
        <Field
          label="API Key (opcional)"
          value={apiKey}
          onChange={setApiKey}
          theme={theme}
          placeholder="Solo si el fabricante lo requiere"
          secureTextEntry
        />

        <TouchableOpacity style={styles.saveBtn} onPress={save}>
          <Icon name="check" size={20} color="white" />
          <Text style={styles.saveBtnText}>Sincronizar</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const Field: React.FC<{
  label: string;
  value: string;
  onChange: (value: string) => void;
  theme: typeof Colors.light;
  placeholder: string;
  keyboardType?: 'default' | 'numeric';
  secureTextEntry?: boolean;
}> = ({ label, value, onChange, theme, placeholder, keyboardType, secureTextEntry }) => (
  <View style={styles.field}>
    <Text style={[styles.label, { color: theme.textSecondary }]}>{label}</Text>
    <TextInput
      style={[styles.input, { backgroundColor: theme.surface, color: theme.textPrimary, borderColor: theme.border }]}
      value={value}
      onChangeText={onChange}
      placeholder={placeholder}
      placeholderTextColor={theme.textSecondary}
      keyboardType={keyboardType}
      secureTextEntry={secureTextEntry}
    />
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  title: { fontSize: 20, fontWeight: '700', flex: 1 },
  content: { gap: 10, paddingBottom: 24 },
  field: { gap: 6 },
  label: { fontSize: 12, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 },
  input: {
    borderWidth: 1.5,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
  },
  saveBtn: {
    marginTop: 8,
    backgroundColor: Colors.turquoise,
    borderRadius: 10,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  saveBtnText: { color: 'white', fontSize: 16, fontWeight: '700' },
});
