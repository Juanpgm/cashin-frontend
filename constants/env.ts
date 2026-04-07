// API URL is read from EXPO_PUBLIC_API_URL when set, with a production URL fallback.
// Derives from utils/api.ts as the single source of truth.
import { API_URL } from "@/utils/api";

export const env = {
  API_URL,
  APP_ENV: process.env.APP_ENV ?? "development",
} as const;
