import React, { useEffect, useMemo, useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  FlatList, useColorScheme,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Colors } from '../../theme/colors';
import { useVaccinesStore } from '../../store/vaccinesStore';

export const VaccinesScreen: React.FC = () => {
  const navigation = useNavigation();
  const isDark = useColorScheme() === 'dark';
  const theme = isDark ? Colors.dark : Colors.light;
  const [filter, setFilter] = useState<'all' | 'applied' | 'upcoming' | 'pending'>('all');
  const { vaccines, loadVaccines, markAsApplied } = useVaccinesStore();

  useEffect(() => {
    loadVaccines().catch(() => undefined);
  }, [loadVaccines]);

  const filtered = useMemo(
    () => vaccines.filter(v => filter === 'all' || v.status === filter),
    [vaccines, filter],
  );

  const statusConfig = {
    applied: { color: Colors.calmGreen, icon: 'check-circle', label: 'Aplicada' },
    upcoming: { color: Colors.warmAmber, icon: 'schedule', label: 'Próxima' },
    pending: { color: theme.textSecondary, icon: 'radio-button-unchecked', label: 'Pendiente' },
  };

  const counts = {
    applied: vaccines.filter(v => v.status === 'applied').length,
    upcoming: vaccines.filter(v => v.status === 'upcoming').length,
    pending: vaccines.filter(v => v.status === 'pending').length,
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { backgroundColor: theme.surface }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color={theme.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.textPrimary }]}>Vacunas</Text>
        <TouchableOpacity onPress={() => navigation.navigate('AddVaccine' as never)}>
          <Icon name="add" size={24} color={Colors.turquoise} />
        </TouchableOpacity>
      </View>

      {/* Summary cards */}
      <View style={styles.summaryRow}>
        {[
          { key: 'applied', label: 'Aplicadas', color: Colors.calmGreen },
          { key: 'upcoming', label: 'Próximas', color: Colors.warmAmber },
          { key: 'pending', label: 'Pendientes', color: theme.textSecondary },
        ].map(s => (
          <TouchableOpacity
            key={s.key}
            style={[styles.summaryCard, { backgroundColor: theme.surface, borderColor: filter === s.key ? s.color : 'transparent' }]}
            onPress={() => setFilter(filter === s.key ? 'all' : s.key as 'applied' | 'upcoming' | 'pending')}
          >
            <Text style={[styles.summaryCount, { color: s.color }]}>{counts[s.key as keyof typeof counts]}</Text>
            <Text style={[styles.summaryLabel, { color: theme.textSecondary }]}>{s.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Upcoming alert */}
      {counts.upcoming > 0 && (
        <View style={[styles.alertBanner, { backgroundColor: Colors.warmAmber + '15', borderColor: Colors.warmAmber + '40' }]}>
          <Icon name="notifications" size={18} color={Colors.warmAmber} />
          <Text style={[styles.alertText, { color: theme.textPrimary }]}>
            Tienes {counts.upcoming} vacuna{counts.upcoming > 1 ? 's' : ''} próxima{counts.upcoming > 1 ? 's' : ''} — revisa el calendario
          </Text>
        </View>
      )}

      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => {
          const cfg = statusConfig[item.status];
          return (
            <View style={[styles.vaccineItem, { backgroundColor: theme.surface }]}>
              <View style={[styles.vaccineIcon, { backgroundColor: cfg.color + '20' }]}>
                <Icon name={cfg.icon} size={24} color={cfg.color} />
              </View>
              <View style={styles.vaccineInfo}>
                <Text style={[styles.vaccineName, { color: theme.textPrimary }]}>{item.vaccineName}</Text>
                <Text style={[styles.vaccineAge, { color: theme.textSecondary }]}>
                  {item.appliedDate ? ` · Aplicada ${item.appliedDate}` : ''}
                  {item.scheduledDate ? ` · ${item.scheduledDate}` : ''}
                </Text>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: cfg.color + '15' }]}>
                <Text style={[styles.statusText, { color: cfg.color }]}>{cfg.label}</Text>
              </View>
              {item.status === 'pending' && (
                <TouchableOpacity
                  style={styles.markBtn}
                  onPress={() => markAsApplied(item.id).catch(() => undefined)}
                >
                  <Icon name="add-circle-outline" size={20} color={Colors.turquoise} />
                </TouchableOpacity>
              )}
            </View>
          );
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', padding: 20, gap: 12, borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.08)' },
  title: { fontSize: 20, fontWeight: '700', flex: 1 },
  summaryRow: { flexDirection: 'row', padding: 16, gap: 10 },
  summaryCard: { flex: 1, padding: 14, borderRadius: 12, alignItems: 'center', borderWidth: 2, elevation: 1 },
  summaryCount: { fontSize: 28, fontWeight: '800' },
  summaryLabel: { fontSize: 12, marginTop: 2 },
  alertBanner: { flexDirection: 'row', alignItems: 'center', gap: 10, marginHorizontal: 16, padding: 14, borderRadius: 10, borderWidth: 1, marginBottom: 8 },
  alertText: { fontSize: 13, flex: 1, lineHeight: 18 },
  list: { padding: 16, gap: 8 },
  vaccineItem: { flexDirection: 'row', alignItems: 'center', padding: 14, borderRadius: 12, gap: 12, elevation: 1, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2 },
  vaccineIcon: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  vaccineInfo: { flex: 1 },
  vaccineName: { fontSize: 15, fontWeight: '600' },
  vaccineAge: { fontSize: 12, marginTop: 2 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  statusText: { fontSize: 12, fontWeight: '600' },
  markBtn: { padding: 4 },
});
