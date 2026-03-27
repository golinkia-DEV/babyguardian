import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  FlatList, KeyboardAvoidingView, Platform, useColorScheme,
  ActivityIndicator, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Colors } from '../../theme/colors';
import { useAIStore } from '../../store/aiStore';
import { useBabyStore } from '../../store/babyStore';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const QUICK_PROMPTS = [
  '¿Qué alimentos puedo introducir?',
  '¿Cómo mejorar el sueño del bebé?',
  '¿Cuándo es la próxima vacuna?',
  '¿Qué hitos esperar este mes?',
];

export const AIChatScreen: React.FC = () => {
  const navigation = useNavigation();
  const isDark = useColorScheme() === 'dark';
  const theme = isDark ? Colors.dark : Colors.light;
  const { baby } = useBabyStore();
  const { sendMessage, messages, loading, provider } = useAIStore();
  const flatListRef = useRef<FlatList>(null);
  const [input, setInput] = useState('');

  const getBabyAgeMonths = (): number => {
    if (!baby?.birthDate) return 0;
    const birth = new Date(baby.birthDate);
    const now = new Date();
    return (now.getFullYear() - birth.getFullYear()) * 12 + now.getMonth() - birth.getMonth();
  };

  const handleSend = async (text?: string) => {
    const message = text || input.trim();
    if (!message) return;
    setInput('');
    try {
      await sendMessage(message);
      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
    } catch {
      Alert.alert('Error', 'No se pudo conectar con el asistente. Verifica tu API key en Configuración.');
    }
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <View style={[
      styles.messageBubble,
      item.role === 'user' ? styles.userBubble : styles.assistantBubble,
      {
        backgroundColor: item.role === 'user' ? Colors.turquoise : theme.surface,
        alignSelf: item.role === 'user' ? 'flex-end' : 'flex-start',
      }
    ]}>
      {item.role === 'assistant' && (
        <View style={styles.assistantHeader}>
          <Icon name="psychology" size={14} color={Colors.turquoise} />
          <Text style={[styles.assistantLabel, { color: Colors.turquoise }]}>Asistente de crianza</Text>
        </View>
      )}
      <Text style={[
        styles.messageText,
        { color: item.role === 'user' ? 'white' : theme.textPrimary }
      ]}>
        {item.content}
      </Text>
      <Text style={[styles.messageTime, { color: item.role === 'user' ? 'rgba(255,255,255,0.6)' : theme.textSecondary }]}>
        {item.timestamp.toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color={theme.textPrimary} />
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>Asistente de crianza</Text>
          <Text style={[styles.headerSub, { color: Colors.turquoise }]}>
            {baby?.name} · {getBabyAgeMonths()} meses · {provider}
          </Text>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('AISettings' as never)}>
          <Icon name="tune" size={24} color={theme.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* Context chip */}
      <View style={[styles.contextChip, { backgroundColor: Colors.turquoise + '10' }]}>
        <Icon name="info" size={14} color={Colors.turquoise} />
        <Text style={[styles.contextText, { color: Colors.turquoise }]}>
          El asistente conoce el perfil de {baby?.name}: vacunas, hitos y rutinas
        </Text>
      </View>

      <KeyboardAvoidingView
        style={styles.chatContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={90}
      >
        {messages.length === 0 ? (
          <View style={styles.emptyState}>
            <Icon name="psychology" size={48} color={Colors.turquoise} />
            <Text style={[styles.emptyTitle, { color: theme.textPrimary }]}>
              ¿En qué puedo ayudarte?
            </Text>
            <Text style={[styles.emptyDesc, { color: theme.textSecondary }]}>
              Tengo acceso al perfil completo de {baby?.name || 'tu bebé'}, incluyendo vacunas, hitos y registro de tomas.
            </Text>
            <View style={styles.quickPrompts}>
              {QUICK_PROMPTS.map((p, i) => (
                <TouchableOpacity
                  key={i}
                  style={[styles.quickPrompt, { backgroundColor: theme.surface, borderColor: Colors.turquoise + '40' }]}
                  onPress={() => handleSend(p)}
                >
                  <Text style={[styles.quickPromptText, { color: Colors.turquoise }]}>{p}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ) : (
          <FlatList
            ref={flatListRef}
            data={messages as Message[]}
            keyExtractor={item => item.id}
            renderItem={renderMessage}
            contentContainerStyle={styles.messageList}
            onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
          />
        )}

        {loading && (
          <View style={[styles.typingIndicator, { backgroundColor: theme.surface }]}>
            <ActivityIndicator size="small" color={Colors.turquoise} />
            <Text style={[styles.typingText, { color: theme.textSecondary }]}>El asistente está escribiendo...</Text>
          </View>
        )}

        {/* Disclaimer */}
        <View style={[styles.disclaimer, { backgroundColor: theme.surface }]}>
          <Icon name="medical-services" size={12} color={theme.textSecondary} />
          <Text style={[styles.disclaimerText, { color: theme.textSecondary }]}>
            Este asistente es informativo. Consulta siempre a tu pediatra para decisiones médicas.
          </Text>
        </View>

        {/* Input */}
        <View style={[styles.inputContainer, { backgroundColor: theme.surface, borderTopColor: theme.border }]}>
          <TextInput
            style={[styles.chatInput, { backgroundColor: theme.background, color: theme.textPrimary }]}
            value={input}
            onChangeText={setInput}
            placeholder={`Pregúntame sobre ${baby?.name || 'el bebé'}...`}
            placeholderTextColor={theme.textSecondary}
            multiline
            maxLength={500}
          />
          <TouchableOpacity
            style={[styles.sendBtn, { backgroundColor: input.trim() ? Colors.turquoise : theme.background, opacity: input.trim() ? 1 : 0.4 }]}
            onPress={() => handleSend()}
            disabled={!input.trim() || loading}
          >
            <Icon name="send" size={20} color={input.trim() ? 'white' : theme.textSecondary} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', padding: 16, gap: 12, borderBottomWidth: 1 },
  headerInfo: { flex: 1 },
  headerTitle: { fontSize: 16, fontWeight: '700' },
  headerSub: { fontSize: 12 },
  contextChip: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 16, paddingVertical: 8 },
  contextText: { fontSize: 12, flex: 1 },
  chatContainer: { flex: 1 },
  messageList: { padding: 16, gap: 12, paddingBottom: 8 },
  messageBubble: { maxWidth: '85%', padding: 14, borderRadius: 18, gap: 4 },
  userBubble: { borderBottomRightRadius: 4 },
  assistantBubble: { borderBottomLeftRadius: 4 },
  assistantHeader: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 4 },
  assistantLabel: { fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
  messageText: { fontSize: 15, lineHeight: 22 },
  messageTime: { fontSize: 11, alignSelf: 'flex-end' },
  typingIndicator: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 20, paddingVertical: 10 },
  typingText: { fontSize: 13 },
  disclaimer: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 16, paddingVertical: 8 },
  disclaimerText: { fontSize: 11, flex: 1, lineHeight: 16 },
  inputContainer: { flexDirection: 'row', alignItems: 'flex-end', padding: 12, gap: 10, borderTopWidth: 1 },
  chatInput: { flex: 1, borderRadius: 20, paddingHorizontal: 16, paddingVertical: 10, fontSize: 15, maxHeight: 100 },
  sendBtn: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32, gap: 16 },
  emptyTitle: { fontSize: 20, fontWeight: '700', textAlign: 'center' },
  emptyDesc: { fontSize: 14, textAlign: 'center', lineHeight: 22 },
  quickPrompts: { width: '100%', gap: 8 },
  quickPrompt: { padding: 14, borderRadius: 12, borderWidth: 1 },
  quickPromptText: { fontSize: 14, fontWeight: '500' },
});
