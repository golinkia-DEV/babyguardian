import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Colors } from '../../theme/colors';

export const WhiteNoiseScreen: React.FC = () => {
  const navigation = useNavigation();
  const isDark = useColorScheme() === 'dark';
  const theme = isDark ? Colors.dark : Colors.light;
  const [enabled, setEnabled] = useState(false);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color={theme.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.textPrimary }]}>Ruido blanco</Text>
      </View>

      <View style={[styles.card, { backgroundColor: theme.surface }]}>
        <Icon name="headphones" size={48} color={Colors.turquoise} />
        <Text style={[styles.text, { color: theme.textPrimary }]}>
          Activa ruido blanco calmante en el Hub.
        </Text>
        <TouchableOpacity
          style={[styles.btn, { backgroundColor: enabled ? Colors.softRed : Colors.turquoise }]}
          onPress={() => setEnabled((v) => !v)}
        >
          <Text style={styles.btnText}>{enabled ? 'Detener' : 'Activar'}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 },
  title: { fontSize: 20, fontWeight: '700' },
  card: { borderRadius: 16, padding: 20, alignItems: 'center', gap: 12 },
  text: { fontSize: 15, textAlign: 'center' },
  btn: { borderRadius: 10, paddingHorizontal: 20, paddingVertical: 12 },
  btnText: { color: 'white', fontWeight: '700' },
});
