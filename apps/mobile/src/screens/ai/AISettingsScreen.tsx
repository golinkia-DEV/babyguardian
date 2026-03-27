import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Colors } from '../../theme/colors';

export const AISettingsScreen: React.FC = () => {
  const navigation = useNavigation();
  const isDark = useColorScheme() === 'dark';
  const theme = isDark ? Colors.dark : Colors.light;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color={theme.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.textPrimary }]}>Ajustes de IA</Text>
      </View>

      <View style={[styles.card, { backgroundColor: theme.surface }]}>
        <Text style={[styles.label, { color: theme.textPrimary }]}>Proveedor actual</Text>
        <Text style={[styles.value, { color: Colors.turquoise }]}>Auto</Text>
        <Text style={[styles.help, { color: theme.textSecondary }]}>
          Este modulo queda listo para conectar seleccion de proveedor y claves API seguras.
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 },
  title: { fontSize: 20, fontWeight: '700' },
  card: { borderRadius: 14, padding: 16, gap: 8 },
  label: { fontSize: 14, fontWeight: '700' },
  value: { fontSize: 18, fontWeight: '800' },
  help: { fontSize: 13, lineHeight: 18 },
});
