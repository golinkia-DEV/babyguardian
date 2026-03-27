import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  TextInput, useColorScheme, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Colors } from '../../theme/colors';
import { useFeedingStore } from '../../store/feedingStore';

type FeedingType = 'breastfeeding' | 'formula' | 'mixed' | 'solids';
type BreastSide = 'left' | 'right' | 'both';

const FEEDING_TYPES = [
  { id: 'breastfeeding' as FeedingType, icon: 'child-care', label: 'Lactancia\nMaterna', color: Colors.turquoise },
  { id: 'formula' as FeedingType, icon: 'local-drink', label: 'Fórmula', color: Colors.warmAmber },
  { id: 'mixed' as FeedingType, icon: 'blend', label: 'Mixta', color: '#9C6FDE' },
  { id: 'solids' as FeedingType, icon: 'restaurant', label: 'Sólidos', color: Colors.calmGreen },
];

export const FeedingScreen: React.FC = () => {
  const navigation = useNavigation();
  const isDark = useColorScheme() === 'dark';
  const theme = isDark ? Colors.dark : Colors.light;
  const { addFeeding, recentFeedings } = useFeedingStore();

  const [feedingType, setFeedingType] = useState<FeedingType>('breastfeeding');
  const [durationMinutes, setDurationMinutes] = useState(15);
  const [amountMl, setAmountMl] = useState('');
  const [breastSide, setBreastSide] = useState<BreastSide>('left');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await addFeeding({
        feedingType,
        startTime: new Date().toISOString(),
        durationMinutes,
        amountMl: amountMl ? parseInt(amountMl) : undefined,
        breastSide: feedingType === 'breastfeeding' ? breastSide : undefined,
        notes,
      });
      Alert.alert('Toma registrada', 'La toma se guardó correctamente.', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch {
      Alert.alert('Error', 'No se pudo guardar la toma.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.navHeader}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="close" size={24} color={theme.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.navTitle, { color: theme.textPrimary }]}>Registrar toma</Text>
        <TouchableOpacity
          style={[styles.saveBtn, { backgroundColor: Colors.turquoise }]}
          onPress={handleSave}
          disabled={saving}
        >
          <Text style={styles.saveBtnText}>{saving ? 'Guardando...' : 'Guardar'}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        {/* Type selection */}
        <Text style={[styles.sectionLabel, { color: theme.textSecondary }]}>Tipo de alimentación</Text>
        <View style={styles.typeGrid}>
          {FEEDING_TYPES.map(t => (
            <TouchableOpacity
              key={t.id}
              style={[
                styles.typeCard,
                { backgroundColor: feedingType === t.id ? t.color + '20' : theme.surface, borderColor: feedingType === t.id ? t.color : 'transparent' }
              ]}
              onPress={() => setFeedingType(t.id)}
            >
              <Icon name={t.icon} size={32} color={feedingType === t.id ? t.color : theme.textSecondary} />
              <Text style={[styles.typeLabel, { color: feedingType === t.id ? t.color : theme.textPrimary }]}>
                {t.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Breast side */}
        {feedingType === 'breastfeeding' && (
          <View style={styles.section}>
            <Text style={[styles.sectionLabel, { color: theme.textSecondary }]}>Lado</Text>
            <View style={styles.sideRow}>
              {[
                { id: 'left' as BreastSide, label: 'Izquierdo' },
                { id: 'right' as BreastSide, label: 'Derecho' },
                { id: 'both' as BreastSide, label: 'Ambos' },
              ].map(s => (
                <TouchableOpacity
                  key={s.id}
                  style={[styles.sideBtn, { backgroundColor: breastSide === s.id ? Colors.turquoise + '20' : theme.surface, borderColor: breastSide === s.id ? Colors.turquoise : theme.border }]}
                  onPress={() => setBreastSide(s.id)}
                >
                  <Text style={[styles.sideBtnText, { color: breastSide === s.id ? Colors.turquoise : theme.textPrimary }]}>{s.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Duration */}
        <View style={styles.section}>
          <Text style={[styles.sectionLabel, { color: theme.textSecondary }]}>Duración (minutos)</Text>
          <View style={styles.durationRow}>
            <TouchableOpacity
              style={[styles.durationBtn, { backgroundColor: theme.surface }]}
              onPress={() => setDurationMinutes(Math.max(5, durationMinutes - 5))}
            >
              <Icon name="remove" size={20} color={theme.textPrimary} />
            </TouchableOpacity>
            <View style={[styles.durationDisplay, { backgroundColor: Colors.turquoise + '15' }]}>
              <Text style={[styles.durationValue, { color: Colors.turquoise }]}>{durationMinutes}</Text>
              <Text style={[styles.durationUnit, { color: theme.textSecondary }]}>min</Text>
            </View>
            <TouchableOpacity
              style={[styles.durationBtn, { backgroundColor: theme.surface }]}
              onPress={() => setDurationMinutes(Math.min(120, durationMinutes + 5))}
            >
              <Icon name="add" size={20} color={theme.textPrimary} />
            </TouchableOpacity>
          </View>
          <View style={styles.durationPresets}>
            {[5, 10, 15, 20, 30].map(m => (
              <TouchableOpacity
                key={m}
                style={[styles.preset, { backgroundColor: durationMinutes === m ? Colors.turquoise : theme.surface }]}
                onPress={() => setDurationMinutes(m)}
              >
                <Text style={{ color: durationMinutes === m ? 'white' : theme.textSecondary, fontSize: 13 }}>{m}m</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Amount (formula/mixed) */}
        {(feedingType === 'formula' || feedingType === 'mixed') && (
          <View style={styles.section}>
            <Text style={[styles.sectionLabel, { color: theme.textSecondary }]}>Cantidad (ml, opcional)</Text>
            <TextInput
              style={[styles.input, { backgroundColor: theme.surface, color: theme.textPrimary, borderColor: theme.border }]}
              value={amountMl}
              onChangeText={setAmountMl}
              keyboardType="numeric"
              placeholder="Ej: 120"
              placeholderTextColor={theme.textSecondary}
            />
          </View>
        )}

        {/* Notes */}
        <View style={styles.section}>
          <Text style={[styles.sectionLabel, { color: theme.textSecondary }]}>Notas (opcional)</Text>
          <TextInput
            style={[styles.textarea, { backgroundColor: theme.surface, color: theme.textPrimary, borderColor: theme.border }]}
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={3}
            placeholder="Ej: Se quedó dormida al final"
            placeholderTextColor={theme.textSecondary}
          />
        </View>

        {/* Recent feedings */}
        {recentFeedings.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionLabel, { color: theme.textSecondary }]}>Tomas recientes</Text>
            {recentFeedings.slice(0, 3).map((f, i) => (
              <View key={i} style={[styles.recentItem, { backgroundColor: theme.surface }]}>
                <Icon name="local-drink" size={20} color={Colors.turquoise} />
                <View style={styles.recentInfo}>
                  <Text style={[styles.recentType, { color: theme.textPrimary }]}>
                    {f.feedingType === 'breastfeeding' ? 'Lactancia' : f.feedingType === 'formula' ? 'Fórmula' : 'Mixta'}
                    {f.durationMinutes ? ` · ${f.durationMinutes}min` : ''}
                    {f.amountMl ? ` · ${f.amountMl}ml` : ''}
                  </Text>
                  <Text style={[styles.recentTime, { color: theme.textSecondary }]}>{f.timeAgo}</Text>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  navHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20, borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.08)' },
  navTitle: { fontSize: 20, fontWeight: '700' },
  saveBtn: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8 },
  saveBtnText: { color: 'white', fontWeight: '700', fontSize: 15 },
  scroll: { padding: 20, gap: 20, paddingBottom: 48 },
  sectionLabel: { fontSize: 12, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 },
  typeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  typeCard: { width: '47%', alignItems: 'center', padding: 16, borderRadius: 14, borderWidth: 2, gap: 8 },
  typeLabel: { fontSize: 13, fontWeight: '600', textAlign: 'center' },
  section: { gap: 8 },
  sideRow: { flexDirection: 'row', gap: 8 },
  sideBtn: { flex: 1, paddingVertical: 12, borderRadius: 10, alignItems: 'center', borderWidth: 2 },
  sideBtnText: { fontSize: 13, fontWeight: '600' },
  durationRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 16 },
  durationBtn: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center', elevation: 1 },
  durationDisplay: { paddingHorizontal: 32, paddingVertical: 12, borderRadius: 16, alignItems: 'center' },
  durationValue: { fontSize: 36, fontWeight: '800' },
  durationUnit: { fontSize: 13 },
  durationPresets: { flexDirection: 'row', justifyContent: 'center', gap: 8 },
  preset: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20 },
  input: { borderWidth: 1.5, borderRadius: 10, paddingHorizontal: 16, paddingVertical: 14, fontSize: 16 },
  textarea: { borderWidth: 1.5, borderRadius: 10, paddingHorizontal: 16, paddingVertical: 14, fontSize: 16, minHeight: 80, textAlignVertical: 'top' },
  recentItem: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderRadius: 10 },
  recentInfo: { flex: 1 },
  recentType: { fontSize: 14, fontWeight: '600' },
  recentTime: { fontSize: 12, marginTop: 2 },
});
