import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  ScrollView, useColorScheme, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Colors } from '../../theme/colors';
import { useHomeStore } from '../../store/homeStore';

const COUNTRIES = [
  { code: 'CL', name: 'Chile', flag: '🇨🇱' },
  { code: 'AR', name: 'Argentina', flag: '🇦🇷' },
  { code: 'MX', name: 'México', flag: '🇲🇽' },
  { code: 'CO', name: 'Colombia', flag: '🇨🇴' },
  { code: 'PE', name: 'Perú', flag: '🇵🇪' },
  { code: 'US', name: 'Estados Unidos', flag: '🇺🇸' },
];

export const CreateHomeScreen: React.FC = () => {
  const navigation = useNavigation();
  const isDark = useColorScheme() === 'dark';
  const theme = isDark ? Colors.dark : Colors.light;
  const { createHome } = useHomeStore();

  const [homeName, setHomeName] = useState('');
  const [babyName, setBabyName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [country, setCountry] = useState('CL');
  const [gender, setGender] = useState<'male' | 'female' | null>(null);
  const [loading, setLoading] = useState(false);
  const [showCountries, setShowCountries] = useState(false);

  const isValid = homeName.length > 1 && babyName.length > 1 && birthDate.length === 10;

  const handleSave = async () => {
    if (!isValid) return;
    setLoading(true);
    try {
      await createHome({ homeName, babyName, birthDate, country, gender });
      navigation.navigate('LinkTablet' as never);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <Text style={[styles.step, { color: Colors.turquoise }]}>Paso 2 de 5</Text>
        <Text style={[styles.title, { color: theme.textPrimary }]}>Crea tu hogar y registra al bebé</Text>

        {/* Home name */}
        <View style={styles.section}>
          <Text style={[styles.label, { color: theme.textSecondary }]}>Nombre del hogar</Text>
          <TextInput
            style={[styles.input, { backgroundColor: theme.surface, color: theme.textPrimary, borderColor: theme.border }]}
            placeholder="Ej: Hogar González-López"
            placeholderTextColor={theme.textSecondary}
            value={homeName}
            onChangeText={setHomeName}
          />
        </View>

        {/* Baby section */}
        <View style={[styles.babyCard, { backgroundColor: theme.surface }]}>
          <View style={styles.babyCardHeader}>
            <Icon name="child-care" size={24} color={Colors.turquoise} />
            <Text style={[styles.babyCardTitle, { color: theme.textPrimary }]}>Datos del bebé</Text>
          </View>

          <Text style={[styles.label, { color: theme.textSecondary }]}>Nombre del bebé</Text>
          <TextInput
            style={[styles.input, { backgroundColor: theme.background, color: theme.textPrimary, borderColor: theme.border }]}
            placeholder="Ej: Lucía"
            placeholderTextColor={theme.textSecondary}
            value={babyName}
            onChangeText={setBabyName}
          />

          <Text style={[styles.label, { color: theme.textSecondary }]}>Fecha de nacimiento</Text>
          <TextInput
            style={[styles.input, { backgroundColor: theme.background, color: theme.textPrimary, borderColor: theme.border }]}
            placeholder="DD/MM/AAAA"
            placeholderTextColor={theme.textSecondary}
            value={birthDate}
            onChangeText={text => {
              const cleaned = text.replace(/\D/g, '');
              let formatted = cleaned;
              if (cleaned.length > 2) formatted = cleaned.slice(0,2) + '/' + cleaned.slice(2);
              if (cleaned.length > 4) formatted = cleaned.slice(0,2) + '/' + cleaned.slice(2,4) + '/' + cleaned.slice(4,8);
              setBirthDate(formatted);
            }}
            keyboardType="numeric"
            maxLength={10}
          />

          <Text style={[styles.label, { color: theme.textSecondary }]}>Género (opcional)</Text>
          <View style={styles.genderRow}>
            {[{ id: 'female', label: '👧 Niña' }, { id: 'male', label: '👦 Niño' }].map(g => (
              <TouchableOpacity
                key={g.id}
                style={[
                  styles.genderBtn,
                  { backgroundColor: theme.background, borderColor: gender === g.id ? Colors.turquoise : theme.border },
                ]}
                onPress={() => setGender(g.id as any)}
              >
                <Text style={[styles.genderBtnText, { color: gender === g.id ? Colors.turquoise : theme.textPrimary }]}>
                  {g.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={[styles.label, { color: theme.textSecondary }]}>País (calendario de vacunas)</Text>
          <TouchableOpacity
            style={[styles.countrySelector, { backgroundColor: theme.background, borderColor: theme.border }]}
            onPress={() => setShowCountries(!showCountries)}
          >
            <Text style={[styles.countrySelectorText, { color: theme.textPrimary }]}>
              {COUNTRIES.find(c => c.code === country)?.flag} {COUNTRIES.find(c => c.code === country)?.name}
            </Text>
            <Icon name={showCountries ? 'expand-less' : 'expand-more'} size={24} color={theme.textSecondary} />
          </TouchableOpacity>
          {showCountries && (
            <View style={[styles.countryList, { backgroundColor: theme.surface, borderColor: theme.border }]}>
              {COUNTRIES.map(c => (
                <TouchableOpacity
                  key={c.code}
                  style={[styles.countryItem, { borderBottomColor: theme.border }]}
                  onPress={() => { setCountry(c.code); setShowCountries(false); }}
                >
                  <Text style={[styles.countryItemText, { color: theme.textPrimary }]}>
                    {c.flag} {c.name}
                  </Text>
                  {country === c.code && <Icon name="check" size={18} color={Colors.turquoise} />}
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        <TouchableOpacity
          style={[styles.continueBtn, { backgroundColor: isValid ? Colors.turquoise : theme.surface, opacity: isValid ? 1 : 0.5 }]}
          onPress={handleSave}
          disabled={!isValid || loading}
        >
          <Text style={[styles.continueBtnText, { color: isValid ? 'white' : theme.textSecondary }]}>
            {loading ? 'Guardando...' : 'Continuar'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { padding: 24, gap: 16, paddingBottom: 48 },
  step: { fontSize: 13, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 1 },
  title: { fontSize: 26, fontWeight: '800', lineHeight: 32, marginBottom: 8 },
  section: { gap: 8 },
  label: { fontSize: 13, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 },
  input: {
    borderWidth: 1.5, borderRadius: 10, paddingHorizontal: 16,
    paddingVertical: 14, fontSize: 16,
  },
  babyCard: { borderRadius: 16, padding: 16, gap: 10, elevation: 2, shadowColor: '#000', shadowOffset: { width:0, height:2 }, shadowOpacity:0.06, shadowRadius:4 },
  babyCardHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  babyCardTitle: { fontSize: 17, fontWeight: '700' },
  genderRow: { flexDirection: 'row', gap: 12 },
  genderBtn: { flex: 1, borderWidth: 2, borderRadius: 10, paddingVertical: 14, alignItems: 'center' },
  genderBtnText: { fontSize: 15, fontWeight: '600' },
  countrySelector: {
    borderWidth: 1.5, borderRadius: 10, paddingHorizontal: 16,
    paddingVertical: 14, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  countrySelectorText: { fontSize: 16 },
  countryList: { borderWidth: 1.5, borderRadius: 10, overflow: 'hidden' },
  countryItem: { paddingHorizontal: 16, paddingVertical: 14, flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 1 },
  countryItemText: { fontSize: 15 },
  continueBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 16, borderRadius: 12, marginTop: 8 },
  continueBtnText: { fontSize: 17, fontWeight: '700' },
});
