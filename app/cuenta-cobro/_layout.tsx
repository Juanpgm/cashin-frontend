import { colors } from "@/theme/colors";
import { Stack } from "expo-router";

export default function CuentaCobroLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.primary },
        headerTintColor: colors.textInverse,
        headerTitleStyle: { fontWeight: "600" },
      }}
    >
      <Stack.Screen
        name="[id]"
        options={{ title: "Detalle cuenta de cobro" }}
      />
      <Stack.Screen name="wizard" options={{ headerShown: false }} />
    </Stack>
  );
}
