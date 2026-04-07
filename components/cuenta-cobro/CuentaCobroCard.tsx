import { Card } from "@/components/ui/Card";
import { colors } from "@/theme/colors";
import { spacing } from "@/theme/spacing";
import { typography } from "@/theme/typography";
import type { CuentaCobroListItem } from "@/types/models";
import { formatCOP, formatPeriodo } from "@/utils/formatters";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { EstadoBadge } from "./EstadoBadge";

interface CuentaCobroCardProps {
  cuenta: CuentaCobroListItem;
  onPress: () => void;
}

export function CuentaCobroCard({ cuenta, onPress }: CuentaCobroCardProps) {
  const actCount = cuenta.actividades_count ?? (cuenta as { actividades?: unknown[] }).actividades?.length ?? 0;

  return (
    <Card onPress={onPress} style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.contrato} numberOfLines={1}>
          {cuenta.contrato_numero ?? "—"}
        </Text>
        <EstadoBadge estado={cuenta.estado} />
      </View>
      <Text style={styles.periodo}>
        {formatPeriodo(cuenta.mes, cuenta.anio)}
      </Text>
      {cuenta.valor != null && (
        <Text style={styles.valor}>{formatCOP(cuenta.valor)}</Text>
      )}
      {actCount > 0 && (
        <Text style={styles.actividades}>
          {actCount} actividad{actCount !== 1 ? "es" : ""} registrada
          {actCount !== 1 ? "s" : ""}
        </Text>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { marginBottom: spacing.md },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  contrato: { ...typography.bodyBold, color: colors.text, flex: 1, marginRight: spacing.sm },
  periodo: {
    ...typography.subtitle,
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  valor: { ...typography.h3, color: colors.text, marginBottom: spacing.xs },
  actividades: { ...typography.caption, color: colors.textSecondary },
});
