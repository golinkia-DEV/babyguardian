import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  ActivityIndicator, Alert, useColorScheme,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Colors } from '../../theme/colors';
import { useAuthStore } from '../../store/authStore';

export const GoogleLoginScreen: React.FC = () => {
  const navigation = useNavigation();
  const isDark = useColorScheme() === 'dark';
  const theme = isDark ? Colors.dark : Colors.light;
  const [loading, setLoading] = useState(false);
  const { signInWithGoogle } = useAuthStore();

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      await signInWithGoogle();
      navigation.navigate('AccountOwnership' as never);
    } catch (err: any) {
      Alert.alert(
        'Error al iniciar sesión',
        err.message || 'No se pudo conectar con Google. Intenta de nuevo.',
        [{ text: 'Reintentar', onPress: handleGoogleLogin }, { text: 'Cancelar', style: 'cancel' }]
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.content}>
        <View style={[styles.logoContainer, { backgroundColor: Colors.turquoise + '15' }]}>
          <Icon name="shield" size={64} color={Colors.turquoise} />
        </View>

        {loading ? (
          <>
            <ActivityIndicator size="large" color={Colors.turquoise} style={styles.loader} />
            <Text style={[styles.loadingText, { color: theme.textPrimary }]}>
              Iniciando sesión con tu cuenta Google...
            </Text>
            <Text style={[styles.loadingSubtext, { color: theme.textSecondary }]}>
              Esto puede tardar unos segundos
            </Text>
          </>
        ) : (
          <>
            <Text style={[styles.title, { color: theme.textPrimary }]}>
              Registro o acceso con Google
            </Text>
            <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
              Si aún no tienes cuenta, la creamos con tu cuenta Google. Así sincronizamos dispositivos y alertas.
            </Text>
            <TouchableOpacity
              style={styles.googleBtn}
              onPress={handleGoogleLogin}
              activeOpacity={0.85}
            >
              <Icon name="login" size={22} color="white" />
              <Text style={styles.googleBtnText}>Continuar con Google</Text>
            </TouchableOpacity>
          </>
        )}

        {!loading && (
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
          >
            <Text style={[styles.backBtnText, { color: theme.textSecondary }]}>Cancelar</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={[styles.privacyNote, { backgroundColor: theme.surfaceVariant }]}>
        <Icon name="lock" size={16} color={Colors.turquoise} />
        <Text style={[styles.privacyText, { color: theme.textSecondary }]}>
          Solo usamos tu email y nombre. Nunca compartimos ni vendemos tus datos.
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 24 },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16 },
  logoContainer: { width: 100, height: 100, borderRadius: 50, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  loader: { marginVertical: 16 },
  loadingText: { fontSize: 18, fontWeight: '600', textAlign: 'center' },
  loadingSubtext: { fontSize: 14, textAlign: 'center' },
  title: { fontSize: 24, fontWeight: '700', textAlign: 'center' },
  subtitle: { fontSize: 15, textAlign: 'center', lineHeight: 22 },
  googleBtn: {
    backgroundColor: '#4285F4', flexDirection: 'row', alignItems: 'center',
    justifyContent: 'center', paddingVertical: 16, paddingHorizontal: 32,
    borderRadius: 12, gap: 10, marginTop: 8, width: '100%',
  },
  googleBtnText: { color: 'white', fontSize: 17, fontWeight: '700' },
  backBtn: { marginTop: 8, padding: 12 },
  backBtnText: { fontSize: 15 },
  privacyNote: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    padding: 16, borderRadius: 12, marginBottom: 24,
  },
  privacyText: { fontSize: 13, flex: 1, lineHeight: 18 },
});
