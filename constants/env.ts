// API URL is hardcoded to production; override with EXPO_PUBLIC_API_URL env var
export const env = {
  API_URL: process.env.EXPO_PUBLIC_API_URL || "https://cashin-api-production.up.railway.app",
  APP_ENV: process.env.APP_ENV ?? "development",
} as const;
