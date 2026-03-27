import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Colors } from '../../theme/colors';
import { useAuthStore } from '../../store/authStore';

export const SettingsScreen: React.FC = () => {
  const navigation = useNavigation();
  const isDark = useColorScheme() === 'dark';
  const theme = isDark ? Colors.dark : Colors.light;
  const { signOut } = useAuthStore();

  const items = [
    { icon: 'devices', title: 'Detectar dispositivos', route: 'Devices' },
    { icon: 'privacy-tip', title: 'Centro de privacidad', route: 'PrivacyCenter' },
    { icon: 'smart-toy', title: 'Asistente IA', route: 'AIChat' },
    { icon: 'vaccines', title: 'Vacunas', route: 'Vaccines' },
    { icon: 'insights', title: 'Hitos', route: 'Milestones' },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color={theme.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.textPrimary }]}>Configuracion</Text>
      </View>

      <View style={styles.list}>
        {items.map((item) => (
          <TouchableOpacity
            key={item.title}
            style={[styles.item, { backgroundColor: theme.surface }]}
            onPress={() => navigation.navigate(item.route as never)}
          >
            <Icon name={item.icon} size={22} color={Colors.turquoise} />
            <Text style={[styles.itemText, { color: theme.textPrimary }]}>{item.title}</Text>
            <Icon name="chevron-right" size={18} color={theme.textSecondary} />
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={[styles.logout, { borderColor: Colors.softRed }]}
        onPress={async () => {
          await signOut();
          navigation.navigate('Onboarding' as never);
        }}
      >
        <Icon name="logout" size={18} color={Colors.softRed} />
        <Text style={[styles.logoutText, { color: Colors.softRed }]}>Cerrar sesion</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  title: { fontSize: 20, fontWeight: '700' },
  list: { gap: 10 },
  item: { borderRadius: 12, padding: 14, flexDirection: 'row', alignItems: 'center', gap: 10 },
  itemText: { flex: 1, fontSize: 15, fontWeight: '600' },
  logout: {
    marginTop: 'auto',
    borderWidth: 1.5,
    borderRadius: 10,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  logoutText: { fontWeight: '700' },
});
