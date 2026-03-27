import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  useColorScheme, ActivityIndicator, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Colors } from '../../theme/colors';
import { usePairingStore } from '../../store/pairingStore';

export const LinkTabletScreen: React.FC = () => {
  const navigation = useNavigation();
  const isDark = useColorScheme() === 'dark';
  const theme = isDark ? Colors.dark : Colors.light;
  const { pairingCode, qrData, generatePairingCode, pairingStatus } = usePairingStore();
  const [generating, setGenerating] = useState(false);
  const [countdown, setCountdown] = useState(300); // 5 min

  useEffect(() => {
    if (pairingCode) {
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) { clearInterval(timer); return 0; }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [pairingCode]);

  useEffect(() => {
    if (pairingStatus === 'linked') {
      navigation.navigate('SetupDevices' as never);
    }
  }, [pairingStatus]);

  const handleGenerateCode = async () => {
    setGenerating(true);
    setCountdown(300);
    try {
      await generatePairingCode();
    } catch (e) {
      Alert.alert('Error', 'No se pudo generar el código. Verifica tu conexión.');
    } finally {
      setGenerating(false);
    }
  };

  const formatCountdown = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.step, { color: Colors.turquoise }]}>Paso 3 de 5</Text>
      <Text style={[styles.title, { color: theme.textPrimary }]}>Vincular la tablet hub</Text>
      <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
        La tablet es el cerebro local de BabyGuardian. Necesitas vincularla con tu hogar.
      </Text>

      {!pairingCode ? (
        <View style={styles.options}>
          <TouchableOpacity
            style={[styles.optionCard, { backgroundColor: theme.surface }]}
            onPress={handleGenerateCode}
            disabled={generating}
          >
            <View style={[styles.optionIcon, { backgroundColor: Colors.turquoise + '15' }]}>
              <Icon name="tablet-android" size={32} color={Colors.turquoise} />
            </View>
            <View style={styles.optionText}>
              <Text style={[styles.optionTitle, { color: theme.textPrimary }]}>Configurar nueva tablet</Text>
              <Text style={[styles.optionDesc, { color: theme.textSecondary }]}>
                Genera un código QR y escanéalo desde la app BabyGuardian Hub en la tablet.
              </Text>
            </View>
            {generating ? <ActivityIndicator color={Colors.turquoise} /> : <Icon name="arrow-forward-ios" size={18} color={theme.textSecondary} />}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.optionCard, { backgroundColor: theme.surface }]}
            onPress={() => navigation.navigate('SetupDevices' as never)}
          >
            <View style={[styles.optionIcon, { backgroundColor: Colors.warmAmber + '15' }]}>
              <Icon name="check-circle" size={32} color={Colors.warmAmber} />
            </View>
            <View style={styles.optionText}>
              <Text style={[styles.optionTitle, { color: theme.textPrimary }]}>Ya tengo la tablet configurada</Text>
              <Text style={[styles.optionDesc, { color: theme.textSecondary }]}>
                Salta este paso si la tablet ya está vinculada.
              </Text>
            </View>
            <Icon name="arrow-forward-ios" size={18} color={theme.textSecondary} />
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.qrSection}>
          {pairingStatus === 'waiting' && (
            <View style={[styles.qrContainer, { backgroundColor: theme.surface }]}>
              {/* QR Code - replace with actual QRCode component */}
              <View style={styles.qrPlaceholder}>
                <Icon name="qr-code-2" size={120} color={theme.textPrimary} />
              </View>
              <View style={[styles.codeBox, { backgroundColor: Colors.turquoise + '15' }]}>
                <Text style={[styles.codeLabel, { color: theme.textSecondary }]}>Código manual</Text>
                <Text style={[styles.codeText, { color: Colors.turquoise }]}>{pairingCode}</Text>
              </View>
              <View style={[styles.countdownBox, { backgroundColor: countdown < 60 ? Colors.softRed + '15' : theme.surfaceVariant }]}>
                <Icon name="timer" size={16} color={countdown < 60 ? Colors.softRed : theme.textSecondary} />
                <Text style={[styles.countdownText, { color: countdown < 60 ? Colors.softRed : theme.textSecondary }]}>
                  Válido por {formatCountdown(countdown)}
                </Text>
              </View>
            </View>
          )}

          <View style={[styles.instructions, { backgroundColor: theme.surface }]}>
            <Text style={[styles.instructionsTitle, { color: theme.textPrimary }]}>En la tablet:</Text>
            {[
              'Abre BabyGuardian Hub',
              'Toca "Vincular con la app"',
              'Escanea el código QR o ingresa el código manual',
            ].map((step, i) => (
              <View key={i} style={styles.instructionStep}>
                <View style={[styles.stepNumber, { backgroundColor: Colors.turquoise }]}>
                  <Text style={styles.stepNumberText}>{i + 1}</Text>
                </View>
                <Text style={[styles.stepText, { color: theme.textPrimary }]}>{step}</Text>
              </View>
            ))}
          </View>

          {countdown === 0 && (
            <TouchableOpacity style={[styles.continueBtn, { backgroundColor: Colors.turquoise }]} onPress={handleGenerateCode}>
              <Text style={styles.continueBtnText}>Generar nuevo código</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      <TouchableOpacity
        style={styles.skipBtn}
        onPress={() => navigation.navigate('SetupDevices' as never)}
      >
        <Text style={[styles.skipBtnText, { color: theme.textSecondary }]}>Hacer esto después</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 24, paddingTop: 32 },
  step: { fontSize: 13, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 },
  title: { fontSize: 26, fontWeight: '800', lineHeight: 32, marginBottom: 8 },
  subtitle: { fontSize: 15, lineHeight: 22, marginBottom: 24 },
  options: { gap: 16 },
  optionCard: { flexDirection: 'row', alignItems: 'center', padding: 20, borderRadius: 16, gap: 16, elevation: 2, shadowColor: '#000', shadowOffset:{width:0,height:2}, shadowOpacity:0.08, shadowRadius:4 },
  optionIcon: { width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center' },
  optionText: { flex: 1 },
  optionTitle: { fontSize: 16, fontWeight: '700', marginBottom: 4 },
  optionDesc: { fontSize: 13, lineHeight: 18 },
  qrSection: { gap: 16 },
  qrContainer: { borderRadius: 16, padding: 24, alignItems: 'center', gap: 16, elevation: 2, shadowColor:'#000',shadowOffset:{width:0,height:2},shadowOpacity:0.08,shadowRadius:4 },
  qrPlaceholder: { width: 160, height: 160, alignItems: 'center', justifyContent: 'center' },
  codeBox: { paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12, alignItems: 'center' },
  codeLabel: { fontSize: 12, marginBottom: 4 },
  codeText: { fontSize: 28, fontWeight: '800', letterSpacing: 4 },
  countdownBox: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  countdownText: { fontSize: 13, fontWeight: '600' },
  instructions: { borderRadius: 16, padding: 16, gap: 12, elevation: 1, shadowColor:'#000',shadowOffset:{width:0,height:1},shadowOpacity:0.05,shadowRadius:2 },
  instructionsTitle: { fontSize: 15, fontWeight: '700', marginBottom: 4 },
  instructionStep: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  stepNumber: { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  stepNumberText: { color: 'white', fontWeight: '700', fontSize: 13 },
  stepText: { fontSize: 14, flex: 1 },
  continueBtn: { paddingVertical: 16, borderRadius: 12, alignItems: 'center' },
  continueBtnText: { color: 'white', fontSize: 17, fontWeight: '700' },
  skipBtn: { marginTop: 'auto', paddingBottom: 32, alignItems: 'center' },
  skipBtnText: { fontSize: 15 },
});
