import { useChatStore } from "@/store/chat.store";
import { useUIStore } from "@/store/ui.store";
import chatService from "@/utils/services/chat.service";
import { useCallback, useRef } from "react";

export function useChat() {
  const {
    sessions,
    currentSessionId,
    isStreaming,
    setCurrentSession,
    addMessage,
    appendToLastMessage,
    setStreaming,
    newSession,
    clearSession,
  } = useChatStore();
  const showToast = useUIStore((s) => s.showToast);
  const abortRef = useRef<AbortController | null>(null);

  const currentMessages = currentSessionId
    ? (sessions[currentSessionId] ?? [])
    : [];

  const startNewSession = useCallback(() => {
    const id = newSession();
    return id;
  }, [newSession]);

  const ensureSession = useCallback(() => {
    if (currentSessionId) return currentSessionId;
    return newSession();
  }, [currentSessionId, newSession]);

  const sendMessage = useCallback(
    async (text: string) => {
      if (isStreaming) return;

      const sessionId = ensureSession();
      setCurrentSession(sessionId);

      // Add user message immediately
      addMessage(sessionId, {
        role: "user",
        content: text,
        created_at: new Date().toISOString(),
      });

      // Add empty assistant message to stream into
      addMessage(sessionId, {
        role: "assistant",
        content: "",
        created_at: new Date().toISOString(),
      });

      setStreaming(true);
      abortRef.current = new AbortController();

      try {
        const generator = chatService.streamMessage(
          { message: text, session_id: sessionId },
          abortRef.current.signal
        );

        for await (const token of generator) {
          appendToLastMessage(sessionId, token);
        }
      } catch (err: unknown) {
        if ((err as { name?: string })?.name === "AbortError") return;

        // Fallback to non-streaming
        try {
          const res = await chatService.sendMessage({
            message: text,
            session_id: sessionId,
          });
          // Replace empty assistant message with full response
          const msgs = useChatStore.getState().sessions[sessionId] ?? [];
          const updated = [...msgs];
          if (updated.length > 0) {
            updated[updated.length - 1] = {
              ...updated[updated.length - 1],
              content: res.response,
            };
          }
          useChatStore.setState((state) => ({
            sessions: { ...state.sessions, [sessionId]: updated },
          }));
        } catch {
          showToast({ message: "Error al contactar el asistente", type: "error" });
        }
      } finally {
        setStreaming(false);
        abortRef.current = null;
      }
    },
    [
      isStreaming,
      ensureSession,
      setCurrentSession,
      addMessage,
      appendToLastMessage,
      setStreaming,
      showToast,
    ]
  );

  const stopStreaming = useCallback(() => {
    abortRef.current?.abort();
  }, []);

  const resetSession = useCallback(() => {
    if (currentSessionId) clearSession(currentSessionId);
    newSession();
  }, [currentSessionId, clearSession, newSession]);

  return {
    messages: currentMessages,
    currentSessionId,
    isStreaming,
    sendMessage,
    stopStreaming,
    startNewSession,
    resetSession,
  };
}
