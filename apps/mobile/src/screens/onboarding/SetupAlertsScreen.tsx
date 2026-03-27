import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  ScrollView, useColorScheme,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Colors } from '../../theme/colors';
import { useSettingsStore } from '../../store/settingsStore';

export const SetupAlertsScreen: React.FC = () => {
  const navigation = useNavigation();
  const isDark = useColorScheme() === 'dark';
  const theme = isDark ? Colors.dark : Colors.light;
  const { saveAlertSettings } = useSettingsStore();

  const [crySensitivity, setCrySensitivity] = useState(2);
  const [escalationMinutes, setEscalationMinutes] = useState(3);
  const [nightMode, setNightMode] = useState<'auto' | 'always_on' | 'always_off'>('auto');

  const handleFinish = async () => {
    await saveAlertSettings({ crySensitivity, escalationMinutes, nightMode });
    navigation.navigate('Main' as never);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={[styles.step, { color: Colors.turquoise }]}>Paso 5 de 5</Text>
        <Text style={[styles.title, { color: theme.textPrimary }]}>Configurar alertas</Text>

        {/* Cry sensitivity */}
        <View style={[styles.section, { backgroundColor: theme.surface }]}>
          <View style={styles.sectionHeader}>
            <Icon name="hearing" size={22} color={Colors.turquoise} />
            <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Sensibilidad de detección de llanto</Text>
          </View>
          <Text style={[styles.sectionDesc, { color: theme.textSecondary }]}>
            Nivel alto: detecta llantos suaves pero puede tener más falsos positivos.
          </Text>
          <View style={styles.levelRow}>
            {[
              { value: 1, label: 'Bajo', desc: 'Solo llanto fuerte', color: Colors.calmGreen },
              { value: 2, label: 'Medio', desc: 'Recomendado', color: Colors.warmAmber },
              { value: 3, label: 'Alto', desc: 'Muy sensible', color: Colors.softRed },
            ].map(l => (
              <TouchableOpacity
                key={l.value}
                style={[styles.levelBtn, { backgroundColor: crySensitivity === l.value ? l.color + '20' : theme.background, borderColor: crySensitivity === l.value ? l.color : theme.border }]}
                onPress={() => setCrySensitivity(l.value)}
              >
                <Text style={[styles.levelBtnLabel, { color: crySensitivity === l.value ? l.color : theme.textPrimary }]}>{l.label}</Text>
                <Text style={[styles.levelBtnDesc, { color: theme.textSecondary }]}>{l.desc}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Escalation time */}
        <View style={[styles.section, { backgroundColor: theme.surface }]}>
          <View style={styles.sectionHeader}>
            <Icon name="timer" size={22} color={Colors.warmAmber} />
            <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Tiempo hasta alerta crítica</Text>
          </View>
          <Text style={[styles.sectionDesc, { color: theme.textSecondary }]}>
            Si el bebé llora sin que nadie lo atienda después de este tiempo, se envía alerta urgente al móvil.
          </Text>
          <View style={styles.minuteRow}>
            {[1, 2, 3, 5, 10].map(m => (
              <TouchableOpacity
                key={m}
                style={[styles.minuteBtn, { backgroundColor: escalationMinutes === m ? Colors.turquoise : theme.background, borderColor: escalationMinutes === m ? Colors.turquoise : theme.border }]}
                onPress={() => setEscalationMinutes(m)}
              >
                <Text style={[styles.minuteBtnText, { color: escalationMinutes === m ? 'white' : theme.textPrimary }]}>{m}m</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Night mode */}
        <View style={[styles.section, { backgroundColor: theme.surface }]}>
          <View style={styles.sectionHeader}>
            <Icon name="dark-mode" size={22} color="#666" />
            <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Modo nocturno</Text>
          </View>
          {[
            { id: 'auto', icon: 'brightness-auto', label: 'Automático', desc: 'Respeta el tema del dispositivo (recomendado)' },
            { id: 'always_on', icon: 'nightlight', label: 'Siempre activo', desc: 'Pantalla oscura 24/7' },
            { id: 'always_off', icon: 'light-mode', label: 'Siempre desactivado', desc: 'Pantalla clara 24/7' },
          ].map(opt => (
            <TouchableOpacity
              key={opt.id}
              style={[styles.nightModeBtn, { borderColor: nightMode === opt.id ? Colors.turquoise : theme.border, backgroundColor: nightMode === opt.id ? Colors.turquoise + '10' : 'transparent' }]}
              onPress={() => setNightMode(opt.id as any)}
            >
              <Icon name={opt.icon} size={20} color={nightMode === opt.id ? Colors.turquoise : theme.textSecondary} />
              <View style={styles.nightModeBtnText}>
                <Text style={[styles.nightModeBtnLabel, { color: nightMode === opt.id ? Colors.turquoise : theme.textPrimary }]}>{opt.label}</Text>
                <Text style={[styles.nightModeBtnDesc, { color: theme.textSecondary }]}>{opt.desc}</Text>
              </View>
              {nightMode === opt.id && <Icon name="radio-button-checked" size={20} color={Colors.turquoise} />}
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={[styles.finishBtn, { backgroundColor: Colors.turquoise }]}
          onPress={handleFinish}
        >
          <Icon name="check" size={22} color="white" />
          <Text style={styles.finishBtnText}>Finalizar configuración</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { padding: 24, gap: 16, paddingBottom: 48 },
  step: { fontSize: 13, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 1 },
  title: { fontSize: 26, fontWeight: '800', lineHeight: 32, marginBottom: 8 },
  section: { borderRadius: 16, padding: 16, gap: 12, elevation: 2, shadowColor: '#000', shadowOffset:{width:0,height:2}, shadowOpacity:0.06, shadowRadius:4 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  sectionTitle: { fontSize: 16, fontWeight: '700', flex: 1 },
  sectionDesc: { fontSize: 13, lineHeight: 18 },
  levelRow: { flexDirection: 'row', gap: 8 },
  levelBtn: { flex: 1, borderWidth: 2, borderRadius: 10, padding: 12, alignItems: 'center' },
  levelBtnLabel: { fontSize: 15, fontWeight: '700', marginBottom: 2 },
  levelBtnDesc: { fontSize: 11, textAlign: 'center' },
  minuteRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  minuteBtn: { borderWidth: 2, borderRadius: 24, paddingHorizontal: 16, paddingVertical: 10 },
  minuteBtnText: { fontSize: 15, fontWeight: '700' },
  nightModeBtn: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderRadius: 10, borderWidth: 2 },
  nightModeBtnText: { flex: 1 },
  nightModeBtnLabel: { fontSize: 15, fontWeight: '600' },
  nightModeBtnDesc: { fontSize: 13 },
  finishBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 16, borderRadius: 12, gap: 8, marginTop: 8 },
  finishBtnText: { color: 'white', fontSize: 17, fontWeight: '700' },
});
