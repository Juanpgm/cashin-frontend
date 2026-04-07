import { WizardProgress } from "@/components/cuenta-cobro/WizardProgress";
import { colors } from "@/theme/colors";
import { Stack, usePathname } from "expo-router";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

function getStep(pathname: string): number {
  if (pathname.includes("paso1")) return 1;
  if (pathname.includes("paso2")) return 2;
  if (pathname.includes("paso3")) return 3;
  if (pathname.includes("paso4")) return 4;
  if (pathname.includes("paso5")) return 5;
  return 1;
}

export default function WizardLayout() {
  const pathname = usePathname();
  const currentStep = getStep(pathname);

  return (
    <View style={styles.container}>
      <SafeAreaView edges={["top"]} style={styles.header}>
        <WizardProgress currentStep={currentStep} />
      </SafeAreaView>
      <Stack screenOptions={{ headerShown: false, animation: "none" }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { backgroundColor: colors.surface },
});
