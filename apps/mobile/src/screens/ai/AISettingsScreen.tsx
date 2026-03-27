import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Colors } from '../../theme/colors';
import { useAIStore } from '../../store/aiStore';

const OPTIONS: Array<{ id: 'groq' | 'openai' | 'anthropic' | 'gemini'; label: string; hint: string }> = [
  { id: 'groq', label: 'Groq', hint: 'Rápido, recomendado' },
  { id: 'openai', label: 'OpenAI', hint: 'gpt-4o-mini en servidor' },
  { id: 'anthropic', label: 'Anthropic', hint: 'Claude en servidor' },
  { id: 'gemini', label: 'Gemini (usa Groq en servidor)', hint: 'Placeholder hasta integrar Gemini' },
];

export const AISettingsScreen: React.FC = () => {
  const navigation = useNavigation();
  const isDark = useColorScheme() === 'dark';
  const theme = isDark ? Colors.dark : Colors.light;
  const { provider, setProvider, hydrateProvider } = useAIStore();

  useEffect(() => {
    hydrateProvider().catch(() => undefined);
  }, [hydrateProvider]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color={theme.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.textPrimary }]}>Ajustes de IA</Text>
      </View>

      <Text style={[styles.intro, { color: theme.textSecondary }]}>
        Elige el proveedor. Las API keys viven en el servidor (backend), no en el móvil.
      </Text>

      <View style={styles.list}>
        {OPTIONS.map((opt) => {
          const active = provider === opt.id;
          return (
            <TouchableOpacity
              key={opt.id}
              style={[
                styles.row,
                { backgroundColor: theme.surface, borderColor: active ? Colors.turquoise : theme.border },
              ]}
              onPress={() => setProvider(opt.id)}
            >
              <View style={{ flex: 1 }}>
                <Text style={[styles.rowTitle, { color: theme.textPrimary }]}>{opt.label}</Text>
                <Text style={[styles.hint, { color: theme.textSecondary }]}>{opt.hint}</Text>
              </View>
              {active && <Icon name="check-circle" size={22} color={Colors.turquoise} />}
            </TouchableOpacity>
          );
        })}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  title: { fontSize: 20, fontWeight: '700' },
  intro: { fontSize: 13, lineHeight: 18, marginBottom: 16 },
  list: { gap: 10 },
  row: {
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
  },
  rowTitle: { fontSize: 16, fontWeight: '700' },
  hint: { fontSize: 12, marginTop: 2 },
});
