import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  useColorScheme, Alert, Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Colors } from '../../theme/colors';

export const PrivacyCenterScreen: React.FC = () => {
  const navigation = useNavigation();
  const isDark = useColorScheme() === 'dark';
  const theme = isDark ? Colors.dark : Colors.light;
  const [faceStorageEnabled, setFaceStorageEnabled] = useState(true);
  const [eventMetadataEnabled, setEventMetadataEnabled] = useState(true);
  const [analyticsEnabled, setAnalyticsEnabled] = useState(false);

  const handleDeleteAllData = () => {
    Alert.alert(
      'Eliminar todos los datos',
      'Esta acción es IRREVERSIBLE. Se eliminarán:\n\n• Embeddings de rostros\n• Historial de eventos\n• Registro de tomas y vacunas\n• Tu cuenta\n\n¿Estás seguro?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar todo',
          style: 'destructive',
          onPress: () => {
            Alert.alert(
              '¿Confirmación final?',
              'Esta acción no se puede deshacer.',
              [
                { text: 'Cancelar', style: 'cancel' },
                { text: 'ELIMINAR', style: 'destructive', onPress: () => { /* call delete API */ } }
              ]
            );
          }
        }
      ]
    );
  };

  const handleDeleteFaceData = () => {
    Alert.alert(
      'Eliminar datos faciales',
      'Se borrarán todos los embeddings de reconocimiento facial. Los grupos de personas se perderán.',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Eliminar', style: 'destructive', onPress: () => { /* delete embeddings */ } }
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color={theme.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.textPrimary }]}>Centro de privacidad</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        {/* What stays local */}
        <View style={[styles.section, { backgroundColor: Colors.calmGreen + '15', borderColor: Colors.calmGreen + '40' }]}>
          <View style={styles.sectionHeader}>
            <Icon name="lock" size={20} color={Colors.calmGreen} />
            <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Siempre local — nunca en la nube</Text>
          </View>
          {['Video y audio de la cámara', 'Embeddings de reconocimiento facial', 'Audio de detección de llanto', 'Datos biométricos de tu bebé'].map((item, i) => (
            <View key={i} style={styles.listItem}>
              <Icon name="check" size={16} color={Colors.calmGreen} />
              <Text style={[styles.listItemText, { color: theme.textPrimary }]}>{item}</Text>
            </View>
          ))}
        </View>

        {/* Controls */}
        <View style={[styles.section, { backgroundColor: theme.surface }]}>
          <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Controles de privacidad</Text>

          <View style={styles.toggle}>
            <View style={styles.toggleInfo}>
              <Text style={[styles.toggleLabel, { color: theme.textPrimary }]}>Almacenar embeddings faciales</Text>
              <Text style={[styles.toggleDesc, { color: theme.textSecondary }]}>
                Permite reconocer a las mismas personas entre sesiones
              </Text>
            </View>
            <Switch value={faceStorageEnabled} onValueChange={setFaceStorageEnabled} trackColor={{ true: Colors.turquoise }} />
          </View>

          <View style={[styles.divider, { backgroundColor: theme.border }]} />

          <View style={styles.toggle}>
            <View style={styles.toggleInfo}>
              <Text style={[styles.toggleLabel, { color: theme.textPrimary }]}>Metadatos de eventos al servidor</Text>
              <Text style={[styles.toggleDesc, { color: theme.textSecondary }]}>
                Hora y tipo de evento (sin video/audio). Necesario para push notifications.
              </Text>
            </View>
            <Switch value={eventMetadataEnabled} onValueChange={setEventMetadataEnabled} trackColor={{ true: Colors.turquoise }} />
          </View>

          <View style={[styles.divider, { backgroundColor: theme.border }]} />

          <View style={styles.toggle}>
            <View style={styles.toggleInfo}>
              <Text style={[styles.toggleLabel, { color: theme.textPrimary }]}>Análisis de uso anónimo</Text>
              <Text style={[styles.toggleDesc, { color: theme.textSecondary }]}>
                Métricas anónimas para mejorar la app. Sin datos personales.
              </Text>
            </View>
            <Switch value={analyticsEnabled} onValueChange={setAnalyticsEnabled} trackColor={{ true: Colors.turquoise }} />
          </View>
        </View>

        {/* Data deletion */}
        <View style={[styles.section, { backgroundColor: theme.surface }]}>
          <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Eliminar datos</Text>

          <TouchableOpacity
            style={[styles.deleteBtn, { borderColor: Colors.warmAmber }]}
            onPress={handleDeleteFaceData}
          >
            <Icon name="face" size={20} color={Colors.warmAmber} />
            <View style={styles.deleteBtnInfo}>
              <Text style={[styles.deleteBtnLabel, { color: Colors.warmAmber }]}>Borrar datos faciales</Text>
              <Text style={[styles.deleteBtnDesc, { color: theme.textSecondary }]}>
                Elimina todos los grupos de reconocimiento facial
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.deleteBtn, { borderColor: Colors.softRed }]}
            onPress={handleDeleteAllData}
          >
            <Icon name="delete-forever" size={20} color={Colors.softRed} />
            <View style={styles.deleteBtnInfo}>
              <Text style={[styles.deleteBtnLabel, { color: Colors.softRed }]}>Eliminar todos mis datos</Text>
              <Text style={[styles.deleteBtnDesc, { color: theme.textSecondary }]}>
                Borra cuenta, historial, vacunas, tomas. IRREVERSIBLE.
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Rights */}
        <View style={[styles.section, { backgroundColor: theme.surface }]}>
          <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Tus derechos (Ley 19.628 Chile)</Text>
          {[
            { icon: 'visibility', label: 'Ver tus datos', action: 'Exportar' },
            { icon: 'edit', label: 'Rectificar información', action: 'Editar' },
            { icon: 'download', label: 'Portabilidad de datos', action: 'Exportar CSV' },
          ].map((r, i) => (
            <TouchableOpacity key={i} style={styles.rightItem}>
              <Icon name={r.icon} size={18} color={Colors.turquoise} />
              <Text style={[styles.rightLabel, { color: theme.textPrimary }]}>{r.label}</Text>
              <Text style={[styles.rightAction, { color: Colors.turquoise }]}>{r.action}</Text>
              <Icon name="chevron-right" size={16} color={theme.textSecondary} />
            </TouchableOpacity>
          ))}
        </View>

        <Text style={[styles.contact, { color: theme.textSecondary }]}>
          Consultas de privacidad: privacy@babyguardian.cl{'\n'}
          Ley 19.628 sobre protección de datos personales
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', padding: 20, gap: 12 },
  title: { fontSize: 20, fontWeight: '700', flex: 1 },
  scroll: { padding: 16, gap: 16, paddingBottom: 48 },
  section: { borderRadius: 16, padding: 16, gap: 12, borderWidth: 1, borderColor: 'transparent', elevation: 1, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  sectionTitle: { fontSize: 16, fontWeight: '700' },
  listItem: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  listItemText: { fontSize: 14 },
  toggle: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  toggleInfo: { flex: 1 },
  toggleLabel: { fontSize: 15, fontWeight: '600' },
  toggleDesc: { fontSize: 12, marginTop: 2, lineHeight: 16 },
  divider: { height: 1 },
  deleteBtn: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderRadius: 10, borderWidth: 1.5 },
  deleteBtnInfo: { flex: 1 },
  deleteBtnLabel: { fontSize: 15, fontWeight: '600' },
  deleteBtnDesc: { fontSize: 12, marginTop: 2 },
  rightItem: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 10 },
  rightLabel: { fontSize: 14, flex: 1 },
  rightAction: { fontSize: 13, fontWeight: '600' },
  contact: { fontSize: 12, textAlign: 'center', lineHeight: 20 },
});
