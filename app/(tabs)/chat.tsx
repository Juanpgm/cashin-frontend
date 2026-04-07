import { useChat } from "@/hooks/useChat";
import { colors } from "@/theme/colors";
import { borderRadius, spacing } from "@/theme/spacing";
import { typography } from "@/theme/typography";
import type { ChatMessage } from "@/types/models";
import Ionicons from "@expo/vector-icons/Ionicons";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";

export default function ChatScreen() {
  const { messages, isStreaming, sendMessage, stopStreaming, resetSession, startNewSession } =
    useChat();
  const [input, setInput] = useState("");
  const listRef = useRef<FlatList<ChatMessage>>(null);
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;

  useEffect(() => {
    startNewSession();
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 100);
    }
  }, [messages]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || isStreaming) return;
    setInput("");
    await sendMessage(text);
  };

  const renderMessage = ({ item }: { item: ChatMessage }) => {
    const isUser = item.role === "user";
    return (
      <View
        style={[
          styles.messageBubbleContainer,
          isUser ? styles.userContainer : styles.assistantContainer,
        ]}
      >
        {!isUser && (
          <View style={styles.avatarCircle}>
            <Ionicons name="sparkles" size={14} color={colors.textInverse} />
          </View>
        )}
        <View
          style={[
            styles.bubble,
            isUser ? styles.userBubble : styles.assistantBubble,
            isTablet && styles.bubbleTablet,
          ]}
        >
          <Text
            style={[
              styles.bubbleText,
              isUser ? styles.userText : styles.assistantText,
            ]}
          >
            {item.content || (isStreaming && !isUser ? "..." : "")}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      {/* Header actions */}
      <View style={styles.topBar}>
        <View style={styles.topBarLeft}>
          <View style={styles.onlineIndicator} />
          <Text style={styles.topBarTitle}>Asistente CashIn IA</Text>
        </View>
        <TouchableOpacity
          onPress={() => resetSession()}
          style={styles.newChatBtn}
        >
          <Ionicons name="add-circle-outline" size={20} color={colors.primary} />
          <Text style={styles.newChatText}>Nueva</Text>
        </TouchableOpacity>
      </View>

      {/* Messages */}
      <FlatList
        ref={listRef}
        data={messages}
        keyExtractor={(_, i) => i.toString()}
        renderItem={renderMessage}
        contentContainerStyle={[
          styles.messagesList,
          isTablet && styles.messagesListTablet,
        ]}
        ListEmptyComponent={
          <View style={styles.emptyChat}>
            <Ionicons name="sparkles" size={48} color={colors.primary} />
            <Text style={styles.emptyChatTitle}>Asistente de CashIn</Text>
            <Text style={styles.emptyChatSub}>
              Pregúntame sobre tus contratos, cuentas de cobro, o pídeme ayuda para generar actividades.
            </Text>
            <View style={styles.suggestions}>
              {[
                "¿Cuántos contratos tengo activos?",
                "¿Qué es una cuenta de cobro?",
                "Ayúdame a redactar actividades para mi contrato",
              ].map((s) => (
                <Pressable
                  key={s}
                  style={styles.suggestionChip}
                  onPress={() => {
                    setInput(s);
                  }}
                >
                  <Text style={styles.suggestionText}>{s}</Text>
                </Pressable>
              ))}
            </View>
          </View>
        }
      />

      {/* Streaming indicator */}
      {isStreaming && (
        <View style={styles.streamingBar}>
          <ActivityIndicator size="small" color={colors.primary} />
          <Text style={styles.streamingText}>Escribiendo...</Text>
          <TouchableOpacity onPress={stopStreaming} style={styles.stopBtn}>
            <Ionicons name="stop-circle" size={16} color={colors.error} />
            <Text style={styles.stopText}>Detener</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Input */}
      <View
        style={[
          styles.inputRow,
          isTablet && styles.inputRowTablet,
        ]}
      >
        <TextInput
          style={[styles.input, isTablet && styles.inputTablet]}
          value={input}
          onChangeText={setInput}
          placeholder="Escribe tu mensaje..."
          placeholderTextColor={colors.disabled}
          multiline
          maxLength={2000}
          onSubmitEditing={Platform.OS !== "web" ? undefined : handleSend}
          returnKeyType="send"
        />
        <TouchableOpacity
          style={[
            styles.sendBtn,
            (!input.trim() || isStreaming) && styles.sendBtnDisabled,
          ]}
          onPress={handleSend}
          disabled={!input.trim() || isStreaming}
        >
          <Ionicons
            name="send"
            size={20}
            color={!input.trim() || isStreaming ? colors.disabled : colors.textInverse}
          />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  topBarLeft: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  onlineIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.success,
  },
  topBarTitle: { ...typography.bodyBold, color: colors.text },
  newChatBtn: { flexDirection: "row", alignItems: "center", gap: 4 },
  newChatText: { ...typography.caption, color: colors.primary },
  messagesList: {
    padding: spacing.md,
    paddingBottom: spacing.xl,
    flexGrow: 1,
  },
  messagesListTablet: {
    maxWidth: 720,
    alignSelf: "center",
    width: "100%",
  },
  messageBubbleContainer: {
    flexDirection: "row",
    marginVertical: spacing.xs,
    gap: spacing.sm,
  },
  userContainer: { justifyContent: "flex-end" },
  assistantContainer: { justifyContent: "flex-start" },
  avatarCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 2,
  },
  bubble: {
    maxWidth: "80%",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.lg,
  },
  bubbleTablet: { maxWidth: "70%" },
  userBubble: {
    backgroundColor: colors.primary,
    borderBottomRightRadius: 4,
  },
  assistantBubble: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderBottomLeftRadius: 4,
  },
  bubbleText: { ...typography.body, lineHeight: 22 },
  userText: { color: colors.textInverse },
  assistantText: { color: colors.text },
  emptyChat: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xxxl,
    gap: spacing.md,
  },
  emptyChatTitle: { ...typography.h2, color: colors.text, textAlign: "center" },
  emptyChatSub: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: 22,
  },
  suggestions: { gap: spacing.sm, width: "100%", marginTop: spacing.md },
  suggestionChip: {
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  suggestionText: { ...typography.body, color: colors.primary },
  streamingBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  streamingText: { ...typography.caption, color: colors.textSecondary, flex: 1 },
  stopBtn: { flexDirection: "row", alignItems: "center", gap: 4 },
  stopText: { ...typography.caption, color: colors.error },
  inputRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: spacing.sm,
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  inputRowTablet: {
    maxWidth: 720,
    alignSelf: "center",
    width: "100%",
  },
  input: {
    flex: 1,
    ...typography.body,
    color: colors.text,
    backgroundColor: colors.background,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    maxHeight: 120,
    minHeight: 44,
  },
  inputTablet: { fontSize: 16 },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  sendBtnDisabled: { backgroundColor: colors.border },
});
