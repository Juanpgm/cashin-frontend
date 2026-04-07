import { Button } from "@/components/ui/Button";
import { useCuentaCobroStore } from "@/store/cuenta-cobro.store";
import { colors } from "@/theme/colors";
import { spacing } from "@/theme/spacing";
import { typography } from "@/theme/typography";
import { formatPeriodo } from "@/utils/formatters";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";

export default function WizardPaso5Screen() {
  const router = useRouter();
  const { wizard, resetWizard } = useCuentaCobroStore();

  useEffect(() => {
    // Cleanup wizard state when leaving success screen
    return () => {
      resetWizard();
    };
  }, []);

  const handleVerCuentas = () => {
    resetWizard();
    router.replace("/(tabs)/cuentas" as never);
  };

  const handleVerCuenta = () => {
    const id = wizard.cuentaId;
    resetWizard();
    if (id) {
      router.replace(`/cuenta-cobro/${id}` as never);
    } else {
      router.replace("/(tabs)/cuentas" as never);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.successIcon}>
          <Ionicons name="checkmark-circle" size={88} color={colors.success} />
        </View>

        <Text style={styles.title}>¡Cuenta enviada!</Text>

        {wizard.mes && wizard.anio && (
          <Text style={styles.periodo}>
            {formatPeriodo(wizard.mes, wizard.anio)}
          </Text>
        )}

        <Text style={styles.description}>
          Tu cuenta de cobro fue enviada para revisión. El supervisor recibirá
          notificación y revisará tus actividades.
        </Text>

        <View style={styles.stepsBox}>
          <StepItem icon="time" label="Revisión del supervisor" done={false} />
          <StepItem icon="checkmark-circle-outline" label="Aprobación" done={false} />
          <StepItem icon="cash-outline" label="Pago" done={false} />
        </View>
      </View>

      <View style={styles.footer}>
        <Button
          title="Ver detalle de la cuenta"
          onPress={handleVerCuenta}
          fullWidth
          size="lg"
          icon={<Ionicons name="eye-outline" size={20} color={colors.textInverse} />}
        />
        <View style={{ height: spacing.md }} />
        <Button
          title="Ver todas mis cuentas"
          onPress={handleVerCuentas}
          fullWidth
          variant="outline"
        />
      </View>
    </View>
  );
}

function StepItem({
  icon,
  label,
  done,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  done: boolean;
}) {
  return (
    <View style={stepStyles.item}>
      <Ionicons
        name={done ? "checkmark-circle" : icon}
        size={20}
        color={done ? colors.success : colors.textSecondary}
      />
      <Text style={[stepStyles.label, done && stepStyles.labelDone]}>{label}</Text>
    </View>
  );
}

const stepStyles = StyleSheet.create({
  item: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  label: { ...typography.body, color: colors.textSecondary },
  labelDone: { color: colors.success },
});

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.xl,
    gap: spacing.md,
  },
  successIcon: { marginBottom: spacing.md },
  title: { ...typography.h1, color: colors.text, textAlign: "center" },
  periodo: { ...typography.h3, color: colors.primary },
  description: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: 22,
    maxWidth: 320,
  },
  stepsBox: {
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.lg,
    width: "100%",
    marginTop: spacing.md,
  },
  footer: {
    padding: spacing.xl,
    paddingBottom: spacing.xxxl,
  },
});
