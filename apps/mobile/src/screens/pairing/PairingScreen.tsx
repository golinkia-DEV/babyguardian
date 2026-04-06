import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView,
  TextInput,
} from 'react-native';
import { usePairingStore } from '../../store/pairingStore';
import { useHomeStore } from '../../store/homeStore';

const PairingScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const {
    isClaimingSession,
    claimError,
    claimPairingSession,
    clearClaimError,
  } = usePairingStore();

  const [activeTab, setActiveTab] = useState<'qr' | 'manual'>('manual');
  const [manualCode, setManualCode] = useState('');
  const manualInputRef = useRef<TextInput>(null);

  const handleClaimWithCode = async () => {
    const code = manualCode.trim().toUpperCase();

    if (!code || code.length !== 8) {
      Alert.alert('Error', 'El código debe tener 8 caracteres');
      return;
    }

    const success = await claimPairingSession({ code });

    if (success) {
      Alert.alert('Éxito', 'Hub vinculado correctamente', [
        {
          text: 'OK',
          onPress: () => {
            setManualCode('');
            navigation.replace('Dashboard');
          },
        },
      ]);
    }
  };

  const handleClaimWithToken = async (token: string) => {
    const success = await claimPairingSession({ pairingToken: token });

    if (success) {
      Alert.alert('Éxito', 'Hub vinculado correctamente', [
        {
          text: 'OK',
          onPress: () => navigation.replace('Dashboard'),
        },
      ]);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Vincular Hub</Text>
          <Text style={styles.subtitle}>
            Escanea el código QR que aparece en el hub o ingresa el código manual
          </Text>
        </View>

        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'manual' && styles.activeTab]}
            onPress={() => setActiveTab('manual')}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === 'manual' && styles.activeTabText,
              ]}
            >
              Código Manual
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'qr' && styles.activeTab]}
            onPress={() => setActiveTab('qr')}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === 'qr' && styles.activeTabText,
              ]}
            >
              Escanear QR
            </Text>
          </TouchableOpacity>
        </View>

        {activeTab === 'manual' ? (
          <View style={styles.content}>
            <Text style={styles.label}>Ingresa el código de 8 caracteres</Text>
            <TextInput
              ref={manualInputRef}
              style={styles.input}
              placeholder="Ej. K7M4P2Q9"
              placeholderTextColor="#999"
              maxLength={8}
              autoCapitalize="characters"
              value={manualCode}
              onChangeText={setManualCode}
              editable={!isClaimingSession}
            />

            {claimError && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{claimError}</Text>
                <TouchableOpacity onPress={clearClaimError}>
                  <Text style={styles.dismissError}>Descartar</Text>
                </TouchableOpacity>
              </View>
            )}

            <TouchableOpacity
              style={[
                styles.button,
                (isClaimingSession || !manualCode) && styles.buttonDisabled,
              ]}
              onPress={handleClaimWithCode}
              disabled={isClaimingSession || !manualCode}
            >
              {isClaimingSession ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Vincular</Text>
              )}
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.content}>
            <Text style={styles.label}>Escanea el código QR del hub</Text>
            <View style={styles.qrPlaceholder}>
              <Text style={styles.qrPlaceholderText}>
                [Integración de cámara para QR Scanner]
              </Text>
              <Text style={styles.qrPlaceholderSubtext}>
                Usa react-native-camera o similar para capturar QR
              </Text>
            </View>

            {claimError && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{claimError}</Text>
              </View>
            )}
          </View>
        )}

        <View style={styles.infoContainer}>
          <Text style={styles.infoTitle}>¿Cómo funciona?</Text>
          <Text style={styles.infoText}>
            1. El hub genera un código de 8 caracteres{'\n'}
            2. Puedes escanear el QR o ingresar el código manualmente{'\n'}
            3. El móvil se vinculará automáticamente al hogar
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#00bcd4',
  },
  tabText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#00bcd4',
  },
  content: {
    marginVertical: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 24,
    fontFamily: 'monospace',
    letterSpacing: 4,
    textAlign: 'center',
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#00bcd4',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  errorContainer: {
    backgroundColor: '#ffebee',
    borderLeftWidth: 4,
    borderLeftColor: '#f44336',
    padding: 12,
    marginBottom: 16,
    borderRadius: 4,
  },
  errorText: {
    color: '#c62828',
    fontSize: 14,
  },
  dismissError: {
    color: '#f44336',
    fontSize: 12,
    marginTop: 8,
    fontWeight: '600',
  },
  qrPlaceholder: {
    height: 280,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderStyle: 'dashed',
  },
  qrPlaceholderText: {
    fontSize: 16,
    color: '#999',
    fontWeight: '600',
    marginBottom: 8,
  },
  qrPlaceholderSubtext: {
    fontSize: 12,
    color: '#bbb',
  },
  infoContainer: {
    backgroundColor: '#e3f2fd',
    padding: 16,
    borderRadius: 8,
    marginTop: 30,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1976d2',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 12,
    color: '#1565c0',
    lineHeight: 18,
  },
});

export default PairingScreen;
