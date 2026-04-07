import type { ChatMessage } from "@/types/models";
import { create } from "zustand";

interface ChatState {
  sessions: Record<string, ChatMessage[]>;
  currentSessionId: string | null;
  isStreaming: boolean;
  setCurrentSession: (sessionId: string) => void;
  addMessage: (sessionId: string, message: ChatMessage) => void;
  appendToLastMessage: (sessionId: string, token: string) => void;
  setStreaming: (streaming: boolean) => void;
  clearSession: (sessionId: string) => void;
  newSession: () => string;
}

function generateSessionId(): string {
  return `session-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export const useChatStore = create<ChatState>((set, get) => ({
  sessions: {},
  currentSessionId: null,
  isStreaming: false,

  setCurrentSession: (sessionId) => set({ currentSessionId: sessionId }),

  addMessage: (sessionId, message) =>
    set((state) => ({
      sessions: {
        ...state.sessions,
        [sessionId]: [...(state.sessions[sessionId] ?? []), message],
      },
    })),

  appendToLastMessage: (sessionId, token) =>
    set((state) => {
      const msgs = state.sessions[sessionId] ?? [];
      if (msgs.length === 0) return state;
      const updated = [...msgs];
      const last = updated[updated.length - 1];
      updated[updated.length - 1] = {
        ...last,
        content: last.content + token,
      };
      return { sessions: { ...state.sessions, [sessionId]: updated } };
    }),

  setStreaming: (isStreaming) => set({ isStreaming }),

  clearSession: (sessionId) =>
    set((state) => {
      const { [sessionId]: _, ...rest } = state.sessions;
      return { sessions: rest };
    }),

  newSession: () => {
    const id = generateSessionId();
    set((state) => ({
      currentSessionId: id,
      sessions: { ...state.sessions, [id]: [] },
    }));
    return id;
  },
}));
