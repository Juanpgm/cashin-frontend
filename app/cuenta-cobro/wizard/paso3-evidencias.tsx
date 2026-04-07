import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useContratos } from "@/hooks/useContratos";
import { useCuentaCobroStore } from "@/store/cuenta-cobro.store";
import { colors } from "@/theme/colors";
import { spacing } from "@/theme/spacing";
import { typography } from "@/theme/typography";
import { formatPeriodo } from "@/utils/formatters";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

export default function WizardPaso3Screen() {
  const router = useRouter();
  const { contratos } = useContratos();
  const { wizard } = useCuentaCobroStore();

  const contrato = contratos.find((c) => c.id === wizard.contratoId);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Vista previa</Text>
      <Text style={styles.description}>
        Revisa las actividades antes de confirmar tu cuenta de cobro
      </Text>

      {/* Período y contrato */}
      <Card style={styles.section}>
        <Text style={styles.sectionTitle}>Período y contrato</Text>
        {wizard.mes && wizard.anio && (
          <Text style={styles.periodo}>
            {formatPeriodo(wizard.mes, wizard.anio)}
          </Text>
        )}
        {contrato && (
          <Text style={styles.contratoNum}>{contrato.numero_contrato}</Text>
        )}
      </Card>

      {/* Actividades */}
      <Card style={styles.section}>
        <Text style={styles.sectionTitle}>
          Actividades registradas ({wizard.actividades.length})
        </Text>
        {wizard.actividades.length === 0 ? (
          <View style={styles.empty}>
            <Ionicons name="clipboard-outline" size={36} color={colors.disabled} />
            <Text style={styles.emptyText}>Sin actividades. Vuelve al paso anterior.</Text>
          </View>
        ) : (
          wizard.actividades.map((act, idx) => {
            type OblItem = { id: number; orden: number; tipo: string };
            const obl = (contrato as unknown as { obligaciones?: OblItem[] })
              ?.obligaciones?.find((o) => String(o.id) === act.obligacion_id);
            return (
              <View key={act.id ?? idx} style={styles.actItem}>
                <Text style={styles.actNum}>{idx + 1}.</Text>
                <View style={styles.actInfo}>
                  {obl && (
                    <Badge
                      label={`Obl. ${obl.orden} — ${obl.tipo}`}
                      color={obl.tipo === "general" ? colors.info : colors.secondary}
                    />
                  )}
                  <Text style={styles.actDesc}>{act.descripcion}</Text>
                  {act.fecha_realizacion && (
                    <Text style={styles.actDate}>{act.fecha_realizacion}</Text>
                  )}
                </View>
              </View>
            );
          })
        )}
      </Card>

      {/* Resumen */}
      <Card style={[styles.section, styles.summaryCard]}>
        <View style={styles.summaryRow}>
          <Ionicons name="clipboard-outline" size={18} color={colors.primary} />
          <Text style={styles.summaryText}>
            {wizard.actividades.length} actividades listas para enviar
          </Text>
        </View>
        <View style={styles.summaryRow}>
          <Ionicons name="checkmark-circle-outline" size={18} color={colors.success} />
          <Text style={styles.summaryText}>
            La cuenta quedará en estado{" "}
            <Text style={{ fontWeight: "700" }}>Borrador</Text> hasta que la envíes
          </Text>
        </View>
      </Card>

      <View style={styles.footer}>
        <Button title="Atrás" variant="ghost" onPress={() => router.back()} />
        <Button
          title="Confirmar"
          onPress={() =>
            router.push("/cuenta-cobro/wizard/paso4-preview" as never)
          }
          disabled={wizard.actividades.length === 0}
          icon={
            <Ionicons
              name="checkmark-circle"
              size={18}
              color={
                wizard.actividades.length > 0
                  ? colors.textInverse
                  : colors.disabled
              }
            />
          }
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingBottom: spacing.xxxl },
  title: { ...typography.h3, color: colors.text, marginBottom: spacing.xs },
  description: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
  },
  section: { marginBottom: spacing.lg },
  sectionTitle: {
    ...typography.subtitle,
    color: colors.text,
    marginBottom: spacing.md,
  },
  periodo: { ...typography.h3, color: colors.primary },
  contratoNum: { ...typography.body, color: colors.textSecondary, marginTop: 4 },
  empty: { alignItems: "center", gap: spacing.sm, paddingVertical: spacing.lg },
  emptyText: { ...typography.body, color: colors.textSecondary, textAlign: "center" },
  actItem: {
    flexDirection: "row",
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    gap: spacing.sm,
  },
  actNum: { ...typography.bodyBold, color: colors.textSecondary, width: 22 },
  actInfo: { flex: 1, gap: spacing.xs },
  actDesc: { ...typography.body, color: colors.text },
  actDate: { ...typography.caption, color: colors.textSecondary },
  summaryCard: {
    backgroundColor: colors.primary + "08",
    gap: spacing.sm,
  },
  summaryRow: { flexDirection: "row", alignItems: "flex-start", gap: spacing.sm },
  summaryText: { ...typography.body, color: colors.text, flex: 1 },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: spacing.xxl,
  },
});
