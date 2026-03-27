import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  FlatList, ActivityIndicator, useColorScheme, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Colors } from '../../theme/colors';
import { useDeviceDiscovery, DiscoveredCamera } from '../../hooks/useDeviceDiscovery';

export const CameraDetectionScreen: React.FC = () => {
  const navigation = useNavigation();
  const isDark = useColorScheme() === 'dark';
  const theme = isDark ? Colors.dark : Colors.light;
  const { cameras, scanning, scanForCameras } = useDeviceDiscovery();
  const [step, setStep] = useState<'intro' | 'scanning' | 'results'>('intro');

  const handleStartScan = async () => {
    setStep('scanning');
    await scanForCameras();
    setStep('results');
  };

  const BRAND_TIPS: Record<string, string> = {
    EZVIZ: 'En la app EZVIZ: Ajustes > Vista en directo LAN > Habilitar RTSP.',
    Tapo: 'En la app TP-Link Tapo: Ajustes de la cámara > Streaming > Habilitar RTSP.',
    Hikvision: 'En el portal web de Hikvision: Configuración > Red > RTSP > Habilitar.',
    Generic: 'Consulta el manual de tu cámara para activar RTSP en el puerto 554.',
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Icon name="arrow-back" size={24} color={theme.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.textPrimary }]}>Detección de cámaras</Text>
      </View>

      {step === 'intro' && (
        <View style={styles.intro}>
          <View style={[styles.iconBig, { backgroundColor: Colors.turquoise + '15' }]}>
            <Icon name="videocam" size={64} color={Colors.turquoise} />
          </View>
          <Text style={[styles.introTitle, { color: theme.textPrimary }]}>
            Buscar cámaras en tu red
          </Text>
          <Text style={[styles.introDesc, { color: theme.textSecondary }]}>
            La app escaneará tu red WiFi buscando cámaras con puertos RTSP (554) y HTTP (80/443).{'\n\n'}
            Asegúrate de que la cámara está encendida y conectada a la misma red WiFi.
          </Text>

          {/* Brand tips */}
          <View style={[styles.tipsCard, { backgroundColor: theme.surface }]}>
            <Text style={[styles.tipsTitle, { color: theme.textPrimary }]}>
              ¿Tu cámara no aparece?
            </Text>
            {Object.entries(BRAND_TIPS).map(([brand, tip]) => (
              <View key={brand} style={styles.tip}>
                <Text style={[styles.tipBrand, { color: Colors.turquoise }]}>{brand}: </Text>
                <Text style={[styles.tipText, { color: theme.textSecondary }]}>{tip}</Text>
              </View>
            ))}
          </View>

          <TouchableOpacity style={[styles.primaryBtn, { backgroundColor: Colors.turquoise }]} onPress={handleStartScan}>
            <Icon name="search" size={22} color="white" />
            <Text style={styles.primaryBtnText}>Iniciar detección de cámaras</Text>
          </TouchableOpacity>
        </View>
      )}

      {step === 'scanning' && (
        <View style={styles.scanning}>
          <ActivityIndicator size="large" color={Colors.turquoise} />
          <Text style={[styles.scanningTitle, { color: theme.textPrimary }]}>Escaneando la red...</Text>
          <Text style={[styles.scanningDesc, { color: theme.textSecondary }]}>
            Esto puede tardar hasta 30 segundos
          </Text>
          <View style={[styles.progressCard, { backgroundColor: theme.surface }]}>
            {['Detectando dispositivos en 192.168.1.x', 'Verificando puertos RTSP (554)', 'Probando protocolo ONVIF'].map((s, i) => (
              <View key={i} style={styles.progressStep}>
                <ActivityIndicator size="small" color={Colors.turquoise} />
                <Text style={[styles.progressText, { color: theme.textSecondary }]}>{s}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {step === 'results' && (
        <View style={styles.results}>
          {cameras.length === 0 ? (
            <View style={styles.empty}>
              <Icon name="videocam-off" size={64} color={theme.textSecondary} />
              <Text style={[styles.emptyTitle, { color: theme.textPrimary }]}>No se encontraron cámaras</Text>
              <Text style={[styles.emptyDesc, { color: theme.textSecondary }]}>
                Asegúrate de que la cámara está encendida, conectada a la misma red WiFi y tiene RTSP habilitado.
              </Text>
              <TouchableOpacity style={[styles.primaryBtn, { backgroundColor: Colors.turquoise }]} onPress={handleStartScan}>
                <Icon name="refresh" size={22} color="white" />
                <Text style={styles.primaryBtnText}>Volver a escanear</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.secondaryBtn, { borderColor: Colors.turquoise }]}
                onPress={() => navigation.navigate('CameraSetup', { manual: true } as never)}
              >
                <Text style={[styles.secondaryBtnText, { color: Colors.turquoise }]}>Configurar manualmente</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              <Text style={[styles.resultsTitle, { color: theme.textPrimary }]}>
                {cameras.length} cámara{cameras.length > 1 ? 's' : ''} encontrada{cameras.length > 1 ? 's' : ''}
              </Text>
              <FlatList
                data={cameras}
                keyExtractor={item => item.ip}
                contentContainerStyle={styles.cameraList}
                renderItem={({ item }) => (
                  <CameraItem
                    camera={item}
                    theme={theme}
                    onSync={() => navigation.navigate('CameraSetup', { camera: item } as never)}
                  />
                )}
              />
              <TouchableOpacity style={[styles.outlineBtn, { borderColor: theme.border }]} onPress={handleStartScan}>
                <Icon name="refresh" size={18} color={theme.textSecondary} />
                <Text style={[styles.outlineBtnText, { color: theme.textSecondary }]}>Volver a escanear</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      )}
    </SafeAreaView>
  );
};

const CameraItem: React.FC<{ camera: DiscoveredCamera; theme: any; onSync: () => void }> = ({ camera, theme, onSync }) => (
  <View style={[styles.cameraCard, { backgroundColor: theme.surface }]}>
    <View style={[styles.cameraIcon, { backgroundColor: Colors.turquoise + '15' }]}>
      <Icon name="videocam" size={28} color={Colors.turquoise} />
    </View>
    <View style={styles.cameraInfo}>
      <Text style={[styles.cameraName, { color: theme.textPrimary }]}>{camera.brand || 'Cámara IP'}</Text>
      <Text style={[styles.cameraIp, { color: theme.textSecondary }]}>{camera.ip}:{camera.port}</Text>
      {camera.model && <Text style={[styles.cameraModel, { color: theme.textSecondary }]}>{camera.model}</Text>}
    </View>
    <TouchableOpacity style={[styles.syncBtn, { backgroundColor: Colors.turquoise }]} onPress={onSync}>
      <Icon name="add" size={20} color="white" />
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', padding: 24, gap: 16 },
  backBtn: { padding: 4 },
  title: { fontSize: 22, fontWeight: '800', flex: 1 },
  intro: { flex: 1, padding: 24, gap: 16, alignItems: 'center' },
  iconBig: { width: 100, height: 100, borderRadius: 50, alignItems: 'center', justifyContent: 'center' },
  introTitle: { fontSize: 22, fontWeight: '700', textAlign: 'center' },
  introDesc: { fontSize: 14, textAlign: 'center', lineHeight: 22 },
  tipsCard: { borderRadius: 12, padding: 16, width: '100%', gap: 8 },
  tipsTitle: { fontSize: 14, fontWeight: '700', marginBottom: 4 },
  tip: { flexDirection: 'row', flexWrap: 'wrap' },
  tipBrand: { fontSize: 13, fontWeight: '700' },
  tipText: { fontSize: 13, flex: 1, lineHeight: 18 },
  primaryBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 16, paddingHorizontal: 24, borderRadius: 12, gap: 8, width: '100%' },
  primaryBtnText: { color: 'white', fontSize: 16, fontWeight: '700' },
  secondaryBtn: { borderWidth: 2, paddingVertical: 14, paddingHorizontal: 24, borderRadius: 12, width: '100%', alignItems: 'center' },
  secondaryBtnText: { fontSize: 16, fontWeight: '600' },
  outlineBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderWidth: 1.5, paddingVertical: 12, borderRadius: 10, gap: 6 },
  outlineBtnText: { fontSize: 14 },
  scanning: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, gap: 16 },
  scanningTitle: { fontSize: 20, fontWeight: '700' },
  scanningDesc: { fontSize: 14 },
  progressCard: { borderRadius: 12, padding: 16, width: '100%', gap: 12 },
  progressStep: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  progressText: { fontSize: 13, flex: 1 },
  results: { flex: 1, padding: 24 },
  resultsTitle: { fontSize: 18, fontWeight: '700', marginBottom: 16 },
  cameraList: { gap: 12 },
  cameraCard: { flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 12, gap: 12, elevation: 2, shadowColor:'#000', shadowOffset:{width:0,height:1}, shadowOpacity:0.06, shadowRadius:3 },
  cameraIcon: { width: 52, height: 52, borderRadius: 26, alignItems: 'center', justifyContent: 'center' },
  cameraInfo: { flex: 1 },
  cameraName: { fontSize: 16, fontWeight: '700' },
  cameraIp: { fontSize: 13, marginTop: 2 },
  cameraModel: { fontSize: 12, marginTop: 1 },
  syncBtn: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16 },
  emptyTitle: { fontSize: 20, fontWeight: '700' },
  emptyDesc: { fontSize: 14, textAlign: 'center', lineHeight: 20 },
});
