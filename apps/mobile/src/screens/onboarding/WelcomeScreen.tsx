import React from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  ImageBackground, StatusBar, useColorScheme, Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Colors } from '../../theme/colors';

const { width, height } = Dimensions.get('window');

export const WelcomeScreen: React.FC = () => {
  const navigation = useNavigation();
  const isDark = useColorScheme() === 'dark';
  const theme = isDark ? Colors.dark : Colors.light;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.background} />

      {/* Hero section */}
      <View style={styles.hero}>
        <View style={[styles.iconContainer, { backgroundColor: Colors.turquoise + '20' }]}>
          <Icon name="child-care" size={80} color={Colors.turquoise} />
        </View>
        <Text style={[styles.title, { color: theme.textPrimary }]}>
          BabyGuardian
        </Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
          Tu monitor de bebé,{'\n'}privado y seguro
        </Text>
        <Text style={[styles.description, { color: theme.textSecondary }]}>
          Video local, IA en el dispositivo y alertas inteligentes.{'\n'}
          Tu bebé siempre bajo tu control.
        </Text>
      </View>

      {/* Features list */}
      <View style={styles.features}>
        {[
          { icon: 'lock', label: 'Video 100% privado — nunca sale de tu red' },
          { icon: 'psychology', label: 'IA local que detecta el llanto' },
          { icon: 'face', label: 'Reconocimiento facial sin la nube' },
          { icon: 'notifications-active', label: 'Alertas escaladas en tiempo real' },
        ].map((f, i) => (
          <View key={i} style={styles.featureItem}>
            <View style={[styles.featureIcon, { backgroundColor: Colors.turquoise + '15' }]}>
              <Icon name={f.icon} size={20} color={Colors.turquoise} />
            </View>
            <Text style={[styles.featureText, { color: theme.textPrimary }]}>{f.label}</Text>
          </View>
        ))}
      </View>

      {/* CTA */}
      <View style={styles.cta}>
        <TouchableOpacity
          style={styles.googleButton}
          onPress={() => navigation.navigate('GoogleLogin' as never)}
          activeOpacity={0.85}
        >
          <Icon name="login" size={22} color="white" />
          <Text style={styles.googleButtonText}>Iniciar con Google</Text>
        </TouchableOpacity>
        <Text style={[styles.legalText, { color: theme.textSecondary }]}>
          Con tu cuenta Google sincronizaremos tu perfil y{'\n'}
          dispositivos de forma segura. Sin guardar tu video en la nube.
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 24 },
  hero: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 32 },
  iconContainer: {
    width: 120, height: 120, borderRadius: 60,
    alignItems: 'center', justifyContent: 'center', marginBottom: 16,
  },
  title: { fontSize: 32, fontWeight: '800', letterSpacing: -0.5, marginBottom: 8 },
  subtitle: { fontSize: 20, fontWeight: '600', textAlign: 'center', marginBottom: 12, lineHeight: 28 },
  description: { fontSize: 14, textAlign: 'center', lineHeight: 20, opacity: 0.8 },
  features: { gap: 12, marginVertical: 24 },
  featureItem: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  featureIcon: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  featureText: { fontSize: 14, flex: 1, fontWeight: '500' },
  cta: { paddingBottom: 32, gap: 12 },
  googleButton: {
    backgroundColor: '#4285F4',
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    paddingVertical: 16, borderRadius: 12, gap: 10,
    elevation: 3, shadowColor: '#4285F4', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 8,
  },
  googleButtonText: { color: 'white', fontSize: 17, fontWeight: '700' },
  legalText: { fontSize: 12, textAlign: 'center', lineHeight: 18 },
});
