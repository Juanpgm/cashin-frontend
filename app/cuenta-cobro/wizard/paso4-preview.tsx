import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useCuentaCobroStore } from "@/store/cuenta-cobro.store";
import { useUIStore } from "@/store/ui.store";
import { colors } from "@/theme/colors";
import { borderRadius, spacing } from "@/theme/spacing";
import { typography } from "@/theme/typography";
import cuentasCobroService from "@/utils/services/cuentas-cobro.service";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function WizardPaso4Screen() {
  const router = useRouter();
  const { wizard, resetWizard } = useCuentaCobroStore();
  const showToast = useUIStore((s) => s.showToast);
  const [isSending, setIsSending] = useState(false);

  const cuentaId = wizard.cuentaId;

  const handleGuardarBorrador = async () => {
    resetWizard();
    showToast({ message: "Cuenta guardada como borrador", type: "success" });
    router.replace("/(tabs)/cuentas" as never);
  };

  const handleEnviar = () => {
    Alert.alert(
      "Enviar cuenta de cobro",
      "¿Enviar la cuenta para revisión? No podrás editarla después.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Enviar",
          onPress: async () => {
            if (!cuentaId) return;
            setIsSending(true);
            try {
              await cuentasCobroService.cambiarEstado(cuentaId, "enviada");
              router.push("/cuenta-cobro/wizard/paso5-confirmar" as never);
            } catch (err: unknown) {
              const msg =
                (err as { response?: { data?: { detail?: string } } })
                  ?.response?.data?.detail ?? "Error al enviar la cuenta";
              showToast({ message: msg, type: "error" });
            } finally {
              setIsSending(false);
            }
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.iconWrapper}>
        <Ionicons name="checkmark-circle" size={72} color={colors.primary} />
      </View>

      <Text style={styles.title}>¡Cuenta creada!</Text>
      <Text style={styles.description}>
        Tu cuenta de cobro fue generada con{" "}
        <Text style={{ fontWeight: "700" }}>{wizard.actividades.length}</Text> actividades.
        ¿Qué deseas hacer ahora?
      </Text>

      <Card style={styles.optionCard} onPress={handleEnviar}>
        <View style={styles.optionIcon}>
          <Ionicons name="send" size={28} color={colors.primary} />
        </View>
        <View style={styles.optionInfo}>
          <Text style={styles.optionTitle}>Enviar para revisión</Text>
          <Text style={styles.optionDesc}>
            Envía la cuenta ahora. El supervisor recibirá tu solicitud inmediatamente.
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
      </Card>

      <Card style={styles.optionCard} onPress={handleGuardarBorrador}>
        <View style={[styles.optionIcon, styles.optionIconSecondary]}>
          <Ionicons name="save-outline" size={28} color={colors.secondary} />
        </View>
        <View style={styles.optionInfo}>
          <Text style={styles.optionTitle}>Guardar como borrador</Text>
          <Text style={styles.optionDesc}>
            Guarda la cuenta y envíala más tarde desde la lista de cuentas.
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
      </Card>

      <View style={styles.footer}>
        <Button
          title="Enviar ahora"
          onPress={handleEnviar}
          loading={isSending}
          fullWidth
          size="lg"
          icon={<Ionicons name="send" size={20} color={colors.textInverse} />}
        />
        <View style={{ height: spacing.sm }} />
        <Button
          title="Guardar borrador"
          onPress={handleGuardarBorrador}
          fullWidth
          variant="outline"
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: {
    padding: spacing.xl,
    paddingBottom: spacing.xxxl,
    alignItems: "center",
  },
  iconWrapper: { marginBottom: spacing.lg, marginTop: spacing.xl },
  title: {
    ...typography.h1,
    color: colors.text,
    textAlign: "center",
    marginBottom: spacing.sm,
  },
  description: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: "center",
    marginBottom: spacing.xxl,
    lineHeight: 22,
  },
  optionCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    marginBottom: spacing.md,
    width: "100%",
    padding: spacing.lg,
  },
  optionIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.primary + "15",
    alignItems: "center",
    justifyContent: "center",
  },
  optionIconSecondary: { backgroundColor: colors.secondary + "15" },
  optionInfo: { flex: 1 },
  optionTitle: { ...typography.bodyBold, color: colors.text },
  optionDesc: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
    lineHeight: 16,
  },
  footer: { width: "100%", marginTop: spacing.xl },
});
