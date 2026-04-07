import api from "@/utils/api";
import { tokenStorage, ACCESS_TOKEN_KEY } from "@/utils/api";
import type { ChatMessage, ConversationHistory } from "@/types/models";

const API_URL = "https://cashin-api-production.up.railway.app";

export interface ChatMessageRequest {
  message: string;
  session_id?: string;
}

export interface ChatMessageResponse {
  response: string;
  session_id: string;
}

const chatService = {
  async sendMessage(data: ChatMessageRequest): Promise<ChatMessageResponse> {
    const res = await api.post<ChatMessageResponse>("/api/v1/chat/", data);
    return res.data;
  },

  async getHistory(session_id: string): Promise<ConversationHistory> {
    const res = await api.get<ConversationHistory>(
      `/api/v1/chat/${session_id}`
    );
    return res.data;
  },

  /**
   * SSE streaming — returns an async generator that yields token strings.
   * Caller is responsible for cleanup (pass AbortController signal).
   */
  async *streamMessage(
    data: ChatMessageRequest,
    signal?: AbortSignal
  ): AsyncGenerator<string, void, unknown> {
    const token = await tokenStorage.get(ACCESS_TOKEN_KEY);

    const response = await fetch(`${API_URL}/api/v1/chat/stream`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(data),
      signal,
    });

    if (!response.ok || !response.body) {
      throw new Error(`Stream error: ${response.status}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const raw = line.slice(6).trim();
            if (raw === "[DONE]") return;
            try {
              const parsed = JSON.parse(raw);
              const token: string =
                parsed.token ?? parsed.content ?? parsed.text ?? parsed ?? "";
              if (token) yield token;
            } catch {
              if (raw) yield raw;
            }
          }
        }
      }
    } finally {
      reader.releaseLock();
    }
  },
};

export default chatService;
