import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  TextInput,
  Alert,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Colors } from '../../theme/colors';
import { useVaccinesStore } from '../../store/vaccinesStore';

export const AddVaccineScreen: React.FC = () => {
  const navigation = useNavigation();
  const isDark = useColorScheme() === 'dark';
  const theme = isDark ? Colors.dark : Colors.light;
  const { addManualVaccine } = useVaccinesStore();

  const [name, setName] = useState('');
  const [appliedDate, setAppliedDate] = useState(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  });
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Datos incompletos', 'Indica el nombre de la vacuna.');
      return;
    }
    setSaving(true);
    try {
      await addManualVaccine({
        vaccineName: name.trim(),
        appliedDate,
        notes: notes.trim() || undefined,
      });
      Alert.alert('Guardado', 'Vacuna registrada correctamente.', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch {
      Alert.alert('Error', 'No se pudo guardar. Verifica sesión y conexión.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color={theme.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.textPrimary }]}>Agregar vacuna</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <Text style={[styles.label, { color: theme.textSecondary }]}>Nombre de la vacuna</Text>
        <TextInput
          style={[styles.input, { backgroundColor: theme.surface, color: theme.textPrimary, borderColor: theme.border }]}
          value={name}
          onChangeText={setName}
          placeholder="Ej: Influenza"
          placeholderTextColor={theme.textSecondary}
        />

        <Text style={[styles.label, { color: theme.textSecondary }]}>Fecha de aplicación (AAAA-MM-DD)</Text>
        <TextInput
          style={[styles.input, { backgroundColor: theme.surface, color: theme.textPrimary, borderColor: theme.border }]}
          value={appliedDate}
          onChangeText={setAppliedDate}
          placeholder="2026-03-15"
          placeholderTextColor={theme.textSecondary}
          autoCapitalize="none"
        />

        <Text style={[styles.label, { color: theme.textSecondary }]}>Notas (opcional)</Text>
        <TextInput
          style={[styles.textarea, { backgroundColor: theme.surface, color: theme.textPrimary, borderColor: theme.border }]}
          value={notes}
          onChangeText={setNotes}
          placeholder="Centro de salud, lote, etc."
          placeholderTextColor={theme.textSecondary}
          multiline
        />

        <TouchableOpacity
          style={[styles.saveBtn, { backgroundColor: Colors.turquoise, opacity: saving ? 0.7 : 1 }]}
          onPress={handleSave}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator color="white" />
          ) : (
            <>
              <Icon name="save" size={20} color="white" />
              <Text style={styles.saveBtnText}>Guardar</Text>
            </>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 20 },
  title: { fontSize: 20, fontWeight: '700' },
  scroll: { padding: 20, gap: 10, paddingBottom: 40 },
  label: { fontSize: 12, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 },
  input: {
    borderWidth: 1.5,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
  },
  textarea: {
    borderWidth: 1.5,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  saveBtn: {
    marginTop: 16,
    borderRadius: 12,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  saveBtnText: { color: 'white', fontWeight: '700', fontSize: 16 },
});
