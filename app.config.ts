import type { ConfigContext, ExpoConfig } from "expo/config";
import { z } from "zod";

const envSchema = z.object({
  EXPO_PUBLIC_API_URL: z.string().url().default("https://cashin-api-production.up.railway.app"),
});

function getValidatedEnv() {
  const parsed = envSchema.safeParse(process.env);
  if (!parsed.success) {
    // Use production API as default if env var not set
    return { EXPO_PUBLIC_API_URL: "https://cashin-api-production.up.railway.app" };
  }
  return parsed.data;
}

export default ({ config }: ConfigContext): ExpoConfig => {
  const env = getValidatedEnv();
  const appEnv = process.env.APP_ENV ?? process.env.NODE_ENV ?? "development";

  return {
    ...config,
    name: "CashIn",
    slug: "cashin-frontend",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "cashin",
    userInterfaceStyle: "automatic",
    splash: {
      image: "./assets/images/splash-icon.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },
    ios: {
      supportsTablet: true,
    },
    android: {
      adaptiveIcon: {
        backgroundColor: "#E6F4FE",
        foregroundImage: "./assets/images/android-icon-foreground.png",
        backgroundImage: "./assets/images/android-icon-background.png",
        monochromeImage: "./assets/images/android-icon-monochrome.png",
      },
      predictiveBackGestureEnabled: false,
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/favicon.png",
    },
    plugins: ["expo-router", "expo-secure-store"],
    experiments: {
      typedRoutes: true,
    },
    extra: {
      apiUrl: env.EXPO_PUBLIC_API_URL,
      appEnv,
    },
  };
};
