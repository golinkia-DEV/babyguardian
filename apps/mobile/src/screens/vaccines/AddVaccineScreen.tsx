import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Colors } from '../../theme/colors';

export const AddVaccineScreen: React.FC = () => {
  const navigation = useNavigation();
  const isDark = useColorScheme() === 'dark';
  const theme = isDark ? Colors.dark : Colors.light;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color={theme.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.textPrimary }]}>Agregar vacuna</Text>
      </View>

      <View style={[styles.card, { backgroundColor: theme.surface }]}>
        <Icon name="medical-services" size={42} color={Colors.turquoise} />
        <Text style={[styles.text, { color: theme.textPrimary }]}>
          Registro manual de vacuna listo para conectar con formulario clinico.
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 },
  title: { fontSize: 20, fontWeight: '700' },
  card: { borderRadius: 12, padding: 16, alignItems: 'center', gap: 10 },
  text: { fontSize: 14, textAlign: 'center', lineHeight: 20 },
});
