import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Colors } from '../../theme/colors';

type MilestoneStatus = 'pending' | 'completed';

interface Milestone {
  id: string;
  title: string;
  ageLabel: string;
  status: MilestoneStatus;
}

const INITIAL_MILESTONES: Milestone[] = [
  { id: 'm1', title: 'Sostiene la cabeza', ageLabel: '2 meses', status: 'pending' },
  { id: 'm2', title: 'Sonríe socialmente', ageLabel: '2 meses', status: 'completed' },
  { id: 'm3', title: 'Se da vuelta', ageLabel: '4 meses', status: 'pending' },
  { id: 'm4', title: 'Se sienta con apoyo', ageLabel: '6 meses', status: 'pending' },
];

export const MilestonesScreen: React.FC = () => {
  const navigation = useNavigation();
  const isDark = useColorScheme() === 'dark';
  const theme = isDark ? Colors.dark : Colors.light;
  const [milestones, setMilestones] = useState<Milestone[]>(INITIAL_MILESTONES);
  const [filter, setFilter] = useState<'all' | MilestoneStatus>('all');

  const filtered = useMemo(
    () => milestones.filter((m) => filter === 'all' || m.status === filter),
    [milestones, filter],
  );

  const toggleStatus = (id: string) => {
    setMilestones((prev) =>
      prev.map((m) =>
        m.id === id ? { ...m, status: m.status === 'completed' ? 'pending' : 'completed' } : m,
      ),
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { backgroundColor: theme.surface }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color={theme.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.textPrimary }]}>Hitos</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.filters}>
        {[
          { key: 'all', label: 'Todos' },
          { key: 'pending', label: 'Pendientes' },
          { key: 'completed', label: 'Completados' },
        ].map((item) => (
          <TouchableOpacity
            key={item.key}
            style={[
              styles.filterChip,
              {
                backgroundColor: filter === item.key ? Colors.turquoise : theme.surface,
              },
            ]}
            onPress={() => setFilter(item.key as 'all' | MilestoneStatus)}
          >
            <Text style={{ color: filter === item.key ? 'white' : theme.textSecondary }}>
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => {
          const done = item.status === 'completed';
          return (
            <TouchableOpacity
              style={[styles.card, { backgroundColor: theme.surface }]}
              onPress={() => toggleStatus(item.id)}
            >
              <View style={[styles.iconWrap, { backgroundColor: done ? Colors.calmGreen + '20' : theme.surfaceVariant }]}>
                <Icon
                  name={done ? 'check-circle' : 'radio-button-unchecked'}
                  size={22}
                  color={done ? Colors.calmGreen : theme.textSecondary}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.itemTitle, { color: theme.textPrimary }]}>{item.title}</Text>
                <Text style={[styles.itemSubtitle, { color: theme.textSecondary }]}>
                  Edad estimada: {item.ageLabel}
                </Text>
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.08)',
  },
  title: { fontSize: 20, fontWeight: '700' },
  filters: { flexDirection: 'row', gap: 8, padding: 16 },
  filterChip: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 999 },
  list: { paddingHorizontal: 16, paddingBottom: 24, gap: 8 },
  card: { flexDirection: 'row', alignItems: 'center', gap: 12, borderRadius: 12, padding: 14 },
  iconWrap: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  itemTitle: { fontSize: 15, fontWeight: '600' },
  itemSubtitle: { marginTop: 2, fontSize: 12 },
});
