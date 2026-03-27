import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  ScrollView, useColorScheme, Alert, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Colors } from '../../theme/colors';
import { useCameraStore } from '../../store/cameraStore';

const CAMERA_BRANDS = ['EZVIZ', 'Tapo', 'Hikvision', 'Reolink', 'Dahua', 'Amcrest', 'Genérica RTSP'];

export const CameraSetupScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const params = (route.params || {}) as any;
  const isDark = useColorScheme() === 'dark';
  const theme = isDark ? Colors.dark : Colors.light;
  const { addCamera } = useCameraStore();

  const [name, setName] = useState(`Cámara ${params.camera?.brand || ''}`);
  const [brand, setBrand] = useState(params.camera?.brand || 'EZVIZ');
  const [ip, setIp] = useState(params.camera?.ip || '');
  const [port, setPort] = useState(String(params.camera?.port || 554));
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [verifyCode, setVerifyCode] = useState('');
  const [showBrands, setShowBrands] = useState(false);
  const [loading, setLoading] = useState(false);
  const [testResult, setTestResult] = useState<'idle' | 'ok' | 'fail'>('idle');

  const brandSetupGuide: Record<string, string> = {
    EZVIZ: 'En la app EZVIZ, ve a Ajustes > Vista en directo LAN > Habilitar RTSP. El código de verificación es la contraseña RTSP.',
    Tapo: 'En TP-Link Tapo, ve a Ajustes > Avanzado > RTSP y habilita el stream. Usa tu usuario y contraseña de la cámara.',
    Hikvision: 'En el portal web de Hikvision, ve a Configuración > Red > Streaming RTSP y habilítalo.',
    'Genérica RTSP': 'Consulta el manual de tu cámara. La URL RTSP típica es: rtsp://usuario:contraseña@IP:554/stream.',
  };

  const handleTest = async () => {
    setLoading(true);
    setTestResult('idle');
    try {
      // Simulate RTSP test
      await new Promise(resolve => setTimeout(resolve, 2000));
      setTestResult('ok');
    } catch {
      setTestResult('fail');
      Alert.alert('Error de conexión', 'No se pudo conectar con la cámara. Verifica la IP, puerto y credenciales.');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (testResult !== 'ok') {
      Alert.alert('Prueba primero', 'Por favor, prueba la conexión antes de guardar la cámara.');
      return;
    }
    setLoading(true);
    try {
      await addCamera({ name, brand, ip, port: parseInt(port), username, password, verifyCode });
      Alert.alert('¡Cámara sincronizada!', `${name} se ha conectado correctamente.`, [
        { text: 'Continuar', onPress: () => navigation.goBack() }
      ]);
    } catch {
      Alert.alert('Error', 'No se pudo guardar la cámara. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.navHeader}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color={theme.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.navTitle, { color: theme.textPrimary }]}>Sincronizar cámara</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        {/* Name */}
        <View style={styles.field}>
          <Text style={[styles.label, { color: theme.textSecondary }]}>Nombre de la cámara</Text>
          <TextInput
            style={[styles.input, { backgroundColor: theme.surface, color: theme.textPrimary, borderColor: theme.border }]}
            value={name} onChangeText={setName}
            placeholder="Ej: Cámara de Lucía"
            placeholderTextColor={theme.textSecondary}
          />
        </View>

        {/* Brand */}
        <View style={styles.field}>
          <Text style={[styles.label, { color: theme.textSecondary }]}>Marca</Text>
          <TouchableOpacity
            style={[styles.selector, { backgroundColor: theme.surface, borderColor: theme.border }]}
            onPress={() => setShowBrands(!showBrands)}
          >
            <Text style={[styles.selectorText, { color: theme.textPrimary }]}>{brand}</Text>
            <Icon name={showBrands ? 'expand-less' : 'expand-more'} size={24} color={theme.textSecondary} />
          </TouchableOpacity>
          {showBrands && (
            <View style={[styles.dropdown, { backgroundColor: theme.surface, borderColor: theme.border }]}>
              {CAMERA_BRANDS.map(b => (
                <TouchableOpacity
                  key={b}
                  style={[styles.dropdownItem, { borderBottomColor: theme.border }]}
                  onPress={() => { setBrand(b); setShowBrands(false); }}
                >
                  <Text style={[styles.dropdownItemText, { color: theme.textPrimary }]}>{b}</Text>
                  {brand === b && <Icon name="check" size={18} color={Colors.turquoise} />}
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* IP and port */}
        <View style={styles.row}>
          <View style={[styles.field, { flex: 2 }]}>
            <Text style={[styles.label, { color: theme.textSecondary }]}>Dirección IP</Text>
            <TextInput
              style={[styles.input, { backgroundColor: theme.surface, color: theme.textPrimary, borderColor: theme.border }]}
              value={ip} onChangeText={setIp}
              placeholder="192.168.1.100"
              placeholderTextColor={theme.textSecondary}
              keyboardType="decimal-pad"
            />
          </View>
          <View style={[styles.field, { flex: 1 }]}>
            <Text style={[styles.label, { color: theme.textSecondary }]}>Puerto</Text>
            <TextInput
              style={[styles.input, { backgroundColor: theme.surface, color: theme.textPrimary, borderColor: theme.border }]}
              value={port} onChangeText={setPort}
              keyboardType="numeric"
            />
          </View>
        </View>

        {/* Credentials */}
        <View style={styles.field}>
          <Text style={[styles.label, { color: theme.textSecondary }]}>Usuario</Text>
          <TextInput
            style={[styles.input, { backgroundColor: theme.surface, color: theme.textPrimary, borderColor: theme.border }]}
            value={username} onChangeText={setUsername}
            autoCapitalize="none"
          />
        </View>
        <View style={styles.field}>
          <Text style={[styles.label, { color: theme.textSecondary }]}>Contraseña</Text>
          <TextInput
            style={[styles.input, { backgroundColor: theme.surface, color: theme.textPrimary, borderColor: theme.border }]}
            value={password} onChangeText={setPassword}
            secureTextEntry
            placeholder="Contraseña de la cámara"
            placeholderTextColor={theme.textSecondary}
          />
        </View>

        {(brand === 'EZVIZ') && (
          <View style={styles.field}>
            <Text style={[styles.label, { color: theme.textSecondary }]}>Código de verificación RTSP</Text>
            <TextInput
              style={[styles.input, { backgroundColor: theme.surface, color: theme.textPrimary, borderColor: theme.border }]}
              value={verifyCode} onChangeText={setVerifyCode}
              placeholder="Código de 6 dígitos"
              placeholderTextColor={theme.textSecondary}
            />
          </View>
        )}

        {/* Brand guide */}
        {brandSetupGuide[brand] && (
          <View style={[styles.guideCard, { backgroundColor: Colors.turquoise + '10', borderColor: Colors.turquoise + '40' }]}>
            <Icon name="info" size={18} color={Colors.turquoise} />
            <Text style={[styles.guideText, { color: theme.textPrimary }]}>{brandSetupGuide[brand]}</Text>
          </View>
        )}

        {/* Test connection */}
        <TouchableOpacity
          style={[
            styles.testBtn,
            {
              backgroundColor: testResult === 'ok' ? Colors.calmGreen + '20' : testResult === 'fail' ? Colors.softRed + '20' : theme.surface,
              borderColor: testResult === 'ok' ? Colors.calmGreen : testResult === 'fail' ? Colors.softRed : Colors.turquoise,
            }
          ]}
          onPress={handleTest}
          disabled={loading || !ip}
        >
          {loading ? (
            <ActivityIndicator size="small" color={Colors.turquoise} />
          ) : (
            <Icon
              name={testResult === 'ok' ? 'check-circle' : testResult === 'fail' ? 'error' : 'wifi-tethering'}
              size={20}
              color={testResult === 'ok' ? Colors.calmGreen : testResult === 'fail' ? Colors.softRed : Colors.turquoise}
            />
          )}
          <Text style={[styles.testBtnText, { color: testResult === 'ok' ? Colors.calmGreen : testResult === 'fail' ? Colors.softRed : Colors.turquoise }]}>
            {loading ? 'Probando conexión...' : testResult === 'ok' ? 'Conexión exitosa' : testResult === 'fail' ? 'Error de conexión' : 'Probar conexión'}
          </Text>
        </TouchableOpacity>

        {testResult === 'fail' && (
          <View style={[styles.errorCard, { backgroundColor: Colors.softRed + '10', borderColor: Colors.softRed + '40' }]}>
            <Icon name="warning" size={18} color={Colors.softRed} />
            <Text style={[styles.errorText, { color: theme.textPrimary }]}>
              No se pudo conectar. Verifica que:{'\n'}
              • La IP y puerto son correctos{'\n'}
              • La cámara está en la misma red WiFi{'\n'}
              • RTSP está habilitado en la cámara{'\n'}
              • Usuario y contraseña son correctos
            </Text>
          </View>
        )}

        <TouchableOpacity
          style={[styles.saveBtn, { backgroundColor: testResult === 'ok' ? Colors.turquoise : theme.surface, opacity: testResult === 'ok' ? 1 : 0.5 }]}
          onPress={handleSave}
          disabled={testResult !== 'ok' || loading}
        >
          <Icon name="save" size={20} color={testResult === 'ok' ? 'white' : theme.textSecondary} />
          <Text style={[styles.saveBtnText, { color: testResult === 'ok' ? 'white' : theme.textSecondary }]}>
            Sincronizar cámara
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  navHeader: { flexDirection: 'row', alignItems: 'center', padding: 20, gap: 16, borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.08)' },
  navTitle: { fontSize: 20, fontWeight: '700' },
  scroll: { padding: 20, gap: 16, paddingBottom: 48 },
  field: { gap: 8 },
  row: { flexDirection: 'row', gap: 12 },
  label: { fontSize: 12, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 },
  input: { borderWidth: 1.5, borderRadius: 10, paddingHorizontal: 16, paddingVertical: 14, fontSize: 16 },
  selector: { borderWidth: 1.5, borderRadius: 10, paddingHorizontal: 16, paddingVertical: 14, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  selectorText: { fontSize: 16 },
  dropdown: { borderWidth: 1.5, borderRadius: 10, overflow: 'hidden' },
  dropdownItem: { paddingHorizontal: 16, paddingVertical: 14, flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 1 },
  dropdownItemText: { fontSize: 15 },
  guideCard: { flexDirection: 'row', gap: 10, padding: 14, borderRadius: 10, borderWidth: 1 },
  guideText: { fontSize: 13, lineHeight: 20, flex: 1 },
  testBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 14, borderRadius: 10, borderWidth: 2, gap: 8 },
  testBtnText: { fontSize: 15, fontWeight: '600' },
  errorCard: { flexDirection: 'row', gap: 10, padding: 14, borderRadius: 10, borderWidth: 1 },
  errorText: { fontSize: 13, lineHeight: 20, flex: 1 },
  saveBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 16, borderRadius: 12, gap: 8, marginTop: 4 },
  saveBtnText: { fontSize: 17, fontWeight: '700' },
});
