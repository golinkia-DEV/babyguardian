import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, useColorScheme,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Colors } from '../../theme/colors';

type AccessMode = 'only_me' | 'family' | null;

export const AccountOwnershipScreen: React.FC = () => {
  const navigation = useNavigation();
  const isDark = useColorScheme() === 'dark';
  const theme = isDark ? Colors.dark : Colors.light;
  const [selected, setSelected] = useState<AccessMode>(null);

  const options = [
    {
      id: 'only_me' as AccessMode,
      icon: 'person',
      title: 'Solo yo',
      description: 'Solo tu cuenta Google puede acceder al monitoreo del bebé.',
      color: Colors.turquoise,
    },
    {
      id: 'family' as AccessMode,
      icon: 'family-restroom',
      title: 'Mi familia',
      description: 'Puedes dar acceso temporal a tu pareja, niñera o familiar.',
      color: Colors.warmAmber,
    },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Text style={[styles.step, { color: Colors.turquoise }]}>Paso 1 de 5</Text>
        <Text style={[styles.title, { color: theme.textPrimary }]}>
          ¿Quién puede ver el monitoreo del bebé?
        </Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
          Tu cuenta Google es la principal. Puedes cambiar esto después.
        </Text>
      </View>

      <View style={styles.options}>
        {options.map(opt => (
          <TouchableOpacity
            key={opt.id}
            style={[
              styles.optionCard,
              { backgroundColor: theme.surface, borderColor: selected === opt.id ? opt.color : 'transparent' },
              selected === opt.id && styles.optionCardSelected,
            ]}
            onPress={() => setSelected(opt.id)}
            activeOpacity={0.85}
          >
            <View style={[styles.optionIcon, { backgroundColor: opt.color + '20' }]}>
              <Icon name={opt.icon} size={32} color={opt.color} />
            </View>
            <View style={styles.optionText}>
              <Text style={[styles.optionTitle, { color: theme.textPrimary }]}>{opt.title}</Text>
              <Text style={[styles.optionDesc, { color: theme.textSecondary }]}>{opt.description}</Text>
            </View>
            {selected === opt.id && (
              <Icon name="check-circle" size={24} color={opt.color} />
            )}
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.continueBtn, { backgroundColor: selected ? Colors.turquoise : theme.surface, opacity: selected ? 1 : 0.5 }]}
          onPress={() => selected && navigation.navigate('CreateHome' as never)}
          disabled={!selected}
        >
          <Text style={[styles.continueBtnText, { color: selected ? 'white' : theme.textSecondary }]}>
            Continuar
          </Text>
          <Icon name="arrow-forward" size={20} color={selected ? 'white' : theme.textSecondary} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 24 },
  header: { paddingTop: 32, paddingBottom: 24, gap: 8 },
  step: { fontSize: 13, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 1 },
  title: { fontSize: 26, fontWeight: '800', lineHeight: 32 },
  subtitle: { fontSize: 15, lineHeight: 22 },
  options: { gap: 16, flex: 1 },
  optionCard: {
    flexDirection: 'row', alignItems: 'center', padding: 20,
    borderRadius: 16, gap: 16, borderWidth: 2,
    elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08, shadowRadius: 4,
  },
  optionCardSelected: { elevation: 4 },
  optionIcon: { width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center' },
  optionText: { flex: 1 },
  optionTitle: { fontSize: 17, fontWeight: '700', marginBottom: 4 },
  optionDesc: { fontSize: 13, lineHeight: 18 },
  footer: { paddingBottom: 32 },
  continueBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    paddingVertical: 16, borderRadius: 12, gap: 8,
  },
  continueBtnText: { fontSize: 17, fontWeight: '700' },
});
