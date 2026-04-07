import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { colors } from "@/theme/colors";
import { spacing } from "@/theme/spacing";
import { typography } from "@/theme/typography";
import type { ContratoListItem } from "@/types/models";
import { formatCOP, formatDateShort, truncate } from "@/utils/formatters";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface ContratoCardProps {
  contrato: ContratoListItem;
  onPress: () => void;
}

export function ContratoCard({ contrato, onPress }: ContratoCardProps) {
  return (
    <Card onPress={onPress} style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.numero}>{contrato.numero_contrato}</Text>
        <Badge
          label={contrato.activo ? "Vigente" : "Vencido"}
          color={contrato.activo ? colors.success : colors.error}
        />
      </View>
      <Text style={styles.objeto} numberOfLines={2}>
        {truncate(contrato.objeto, 120)}
      </Text>
      <View style={styles.info}>
        <Text style={styles.infoText}>
          {formatDateShort(contrato.fecha_inicio)} —{" "}
          {formatDateShort(contrato.fecha_fin)}
        </Text>
        {contrato.valor_mensual != null && (
          <Text style={styles.valor}>
            {formatCOP(contrato.valor_mensual)}/mes
          </Text>
        )}
      </View>
      {contrato.supervisor_nombre && (
        <Text style={styles.supervisor}>
          Supervisor: {contrato.supervisor_nombre}
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
  numero: { ...typography.bodyBold, color: colors.primary },
  objeto: { ...typography.body, color: colors.text, marginBottom: spacing.sm },
  info: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.xs,
  },
  infoText: { ...typography.caption, color: colors.textSecondary },
  valor: { ...typography.bodyBold, color: colors.primary },
  supervisor: { ...typography.caption, color: colors.textSecondary },
});
