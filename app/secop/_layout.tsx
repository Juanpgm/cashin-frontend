import { Stack } from "expo-router";
import { colors } from "@/theme/colors";

export default function SecopLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.primary },
        headerTintColor: colors.textInverse,
        headerTitleStyle: { fontWeight: "600" },
      }}
    >
      <Stack.Screen name="index" options={{ title: "Importar de SECOP" }} />
    </Stack>
  );
}
