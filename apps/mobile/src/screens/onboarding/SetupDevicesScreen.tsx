import React from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, useColorScheme,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Colors } from '../../theme/colors';

const ITEMS = [
  {
    icon: 'videocam',
    title: 'Camaras IP',
    desc: 'EZVIZ, Tapo, Hikvision y RTSP/ONVIF',
  },
  {
    icon: 'lightbulb',
    title: 'Luces inteligentes',
    desc: 'Automatiza luz calida cuando detecte llanto',
  },
  {
    icon: 'router',
    title: 'Router / ampolletas',
    desc: 'Vincula dispositivos de red compatibles',
  },
  {
    icon: 'thermostat',
    title: 'Sensores',
    desc: 'Temperatura y humedad de la habitacion',
  },
];

export const SetupDevicesScreen: React.FC = () => {
  const navigation = useNavigation();
  const isDark = useColorScheme() === 'dark';
  const theme = isDark ? Colors.dark : Colors.light;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.step, { color: Colors.turquoise }]}>Paso 4 de 5</Text>
      <Text style={[styles.title, { color: theme.textPrimary }]}>Configurar dispositivos</Text>
      <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
        Puedes configurarlos ahora o despues desde Configuracion. Tu Hub seguira funcionando aunque
        agregues dispositivos mas tarde.
      </Text>

      <View style={styles.list}>
        {ITEMS.map((item) => (
          <View key={item.title} style={[styles.card, { backgroundColor: theme.surface }]}>
            <View style={[styles.iconWrap, { backgroundColor: Colors.turquoise + '15' }]}>
              <Icon name={item.icon} size={24} color={Colors.turquoise} />
            </View>
            <View style={styles.cardInfo}>
              <Text style={[styles.cardTitle, { color: theme.textPrimary }]}>{item.title}</Text>
              <Text style={[styles.cardDesc, { color: theme.textSecondary }]}>{item.desc}</Text>
            </View>
          </View>
        ))}
      </View>

      <TouchableOpacity
        style={[styles.primaryBtn, { backgroundColor: Colors.turquoise }]}
        onPress={() => navigation.navigate('SetupAlerts' as never)}
      >
        <Text style={styles.primaryBtnText}>Continuar con alertas</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.linkBtn}
        onPress={() => navigation.navigate('SetupAlerts' as never)}
      >
        <Text style={[styles.linkBtnText, { color: theme.textSecondary }]}>Configurar luego</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24 },
  step: { fontSize: 13, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 },
  title: { fontSize: 26, fontWeight: '800', marginBottom: 8 },
  subtitle: { fontSize: 14, lineHeight: 20, marginBottom: 18 },
  list: { gap: 10, marginBottom: 20 },
  card: { borderRadius: 12, padding: 12, flexDirection: 'row', gap: 10, alignItems: 'center' },
  iconWrap: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  cardInfo: { flex: 1 },
  cardTitle: { fontSize: 15, fontWeight: '700' },
  cardDesc: { fontSize: 12, marginTop: 2 },
  primaryBtn: { borderRadius: 12, paddingVertical: 15, alignItems: 'center' },
  primaryBtnText: { color: 'white', fontSize: 16, fontWeight: '700' },
  linkBtn: { marginTop: 12, alignItems: 'center', padding: 8 },
  linkBtnText: { fontSize: 14 },
});
