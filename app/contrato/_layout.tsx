import { colors } from "@/theme/colors";
import { Stack } from "expo-router";

export default function ContratoLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.primary },
        headerTintColor: colors.textInverse,
        headerTitleStyle: { fontWeight: "600" },
      }}
    >
      <Stack.Screen name="nuevo" options={{ title: "Nuevo contrato" }} />
      <Stack.Screen name="[id]" options={{ title: "Detalle del contrato" }} />
    </Stack>
  );
}
