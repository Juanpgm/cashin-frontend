import { Toast } from "@/components/layout/Toast";
import { useAuthStore } from "@/store/auth.store";
import { useAuth } from "@/hooks/useAuth";
import { useFonts } from "expo-font";
import { Stack, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import "react-native-reanimated";
import { colors } from "@/theme/colors";

export { ErrorBoundary } from "expo-router";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  // Trigger auth hydration
  useAuth();

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) SplashScreen.hideAsync();
  }, [loaded]);

  if (!loaded) return null;

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const router = useRouter();
  const segments = useSegments();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isHydrating = useAuthStore((s) => s.isHydrating);

  useEffect(() => {
    if (isHydrating) return;

    const inAuthGroup = segments[0] === "(auth)";
    if (!isAuthenticated && !inAuthGroup) {
      router.replace("/(auth)/login" as never);
    } else if (isAuthenticated && inAuthGroup) {
      router.replace("/(tabs)" as never);
    }
  }, [isAuthenticated, isHydrating, segments]);

  if (isHydrating) {
    return (
      <View
        style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: colors.background }}
      >
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="contrato" />
        <Stack.Screen name="cuenta-cobro" />
        <Stack.Screen name="secop" />
        <Stack.Screen name="+not-found" />
      </Stack>
      <Toast />
    </View>
  );
}
