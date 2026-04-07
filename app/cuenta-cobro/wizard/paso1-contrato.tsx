import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useContratos } from "@/hooks/useContratos";
import { useCuentasCobro } from "@/hooks/useCuentasCobro";
import { useCuentaCobroStore } from "@/store/cuenta-cobro.store";
import { useUIStore } from "@/store/ui.store";
import { colors } from "@/theme/colors";
import { borderRadius, spacing } from "@/theme/spacing";
import { typography } from "@/theme/typography";
import { MESES } from "@/utils/constants";
import { formatCOP } from "@/utils/formatters";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function WizardPaso1Screen() {
  const router = useRouter();
  const { contratos, loadContratos } = useContratos();
  const { createCuenta } = useCuentasCobro();
  const { wizard, setWizardContrato, setWizardCuentaId, resetWizard } =
    useCuentaCobroStore();
  const showToast = useUIStore((s) => s.showToast);

  const [selectedContratoId, setSelectedContratoId] = useState<string | null>(
    wizard.contratoId
  );
  const [selectedMes, setSelectedMes] = useState<number>(
    wizard.mes ?? new Date().getMonth() + 1
  );
  const [selectedAnio, setSelectedAnio] = useState<number>(
    wizard.anio ?? new Date().getFullYear()
  );
  const [isCreating, setIsCreating] = useState(false);

  const contratosActivos = contratos.filter((c) => c.activo);
  const currentYear = new Date().getFullYear();
  const years = [currentYear - 1, currentYear, currentYear + 1];

  useEffect(() => {
    if (contratos.length === 0) loadContratos();
    resetWizard();
  }, []);

  const handleNext = async () => {
    if (!selectedContratoId) return;

    // If we already created an account for this wizard session, reuse it
    if (wizard.cuentaId) {
      setWizardContrato(selectedContratoId, selectedMes, selectedAnio);
      router.push("/cuenta-cobro/wizard/paso2-actividades" as never);
      return;
    }

    setIsCreating(true);
    try {
      setWizardContrato(selectedContratoId, selectedMes, selectedAnio);
      const nueva = await createCuenta({
        contrato_id: selectedContratoId,
        mes: selectedMes,
        anio: selectedAnio,
      });
      setWizardCuentaId(nueva.id);
      router.push("/cuenta-cobro/wizard/paso2-actividades" as never);
    } catch {
      showToast({
        message: "Error al crear la cuenta de cobro",
        type: "error",
      });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Selecciona el contrato</Text>
      <Text style={styles.description}>
        Elige el contrato para el cual vas a generar la cuenta de cobro
      </Text>

      {contratosActivos.length === 0 ? (
        <Card style={styles.emptyCard}>
          <Ionicons name="document-text-outline" size={32} color={colors.disabled} />
          <Text style={styles.emptyText}>No tienes contratos activos</Text>
          <Button
            title="Importar de SECOP"
            variant="outline"
            size="sm"
            onPress={() => router.push("/secop" as never)}
          />
        </Card>
      ) : (
        contratosActivos.map((contrato) => {
          const isSelected = selectedContratoId === contrato.id;
          return (
            <TouchableOpacity
              key={contrato.id}
              onPress={() => setSelectedContratoId(contrato.id)}
              activeOpacity={0.7}
            >
              <Card
                style={[
                  styles.contratoCard,
                  isSelected && styles.contratoCardSelected,
                ]}
              >
                <View style={styles.contratoHeader}>
                  <Text style={styles.contratoNumero}>
                    {contrato.numero_contrato}
                  </Text>
                  {isSelected && (
                    <Ionicons
                      name="checkmark-circle"
                      size={22}
                      color={colors.primary}
                    />
                  )}
                </View>
                <Text style={styles.contratoObjeto} numberOfLines={2}>
                  {contrato.objeto}
                </Text>
                {contrato.valor_mensual != null && (
                  <Text style={styles.contratoValor}>
                    {formatCOP(contrato.valor_mensual)}/mes
                  </Text>
                )}
              </Card>
            </TouchableOpacity>
          );
        })
      )}

      <Text style={[styles.title, { marginTop: spacing.xl }]}>
        Período de cobro
      </Text>

      <Text style={styles.label}>Mes</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.chipScroll}
      >
        {MESES.map((mes, i) => {
          const mesNum = i + 1;
          const isSelected = selectedMes === mesNum;
          return (
            <TouchableOpacity
              key={mesNum}
              style={[styles.chip, isSelected && styles.chipSelected]}
              onPress={() => setSelectedMes(mesNum)}
            >
              <Text
                style={[styles.chipText, isSelected && styles.chipTextSelected]}
              >
                {mes.substring(0, 3)}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <Text style={styles.label}>Año</Text>
      <View style={styles.yearRow}>
        {years.map((year) => {
          const isSelected = selectedAnio === year;
          return (
            <TouchableOpacity
              key={year}
              style={[styles.yearChip, isSelected && styles.chipSelected]}
              onPress={() => setSelectedAnio(year)}
            >
              <Text
                style={[styles.chipText, isSelected && styles.chipTextSelected]}
              >
                {year}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={styles.creditNotice}>
        <Ionicons name="information-circle-outline" size={16} color={colors.info} />
        <Text style={styles.creditText}>
          Crear una cuenta de cobro consume 10 créditos
        </Text>
      </View>

      <View style={styles.footer}>
        <Button
          title="Cancelar"
          variant="ghost"
          onPress={() => router.back()}
        />
        <Button
          title="Crear y continuar"
          onPress={handleNext}
          disabled={!selectedContratoId}
          loading={isCreating}
          icon={
            <Ionicons
              name="arrow-forward"
              size={18}
              color={selectedContratoId ? colors.textInverse : colors.disabled}
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
  emptyCard: {
    padding: spacing.xl,
    alignItems: "center",
    gap: spacing.md,
  },
  emptyText: { ...typography.body, color: colors.textSecondary },
  contratoCard: {
    marginBottom: spacing.md,
    borderWidth: 2,
    borderColor: "transparent",
  },
  contratoCardSelected: { borderColor: colors.primary },
  contratoHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.xs,
  },
  contratoNumero: { ...typography.bodyBold, color: colors.primary },
  contratoObjeto: {
    ...typography.body,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  contratoValor: { ...typography.bodyBold, color: colors.text },
  label: {
    ...typography.bodyBold,
    color: colors.text,
    marginBottom: spacing.sm,
    marginTop: spacing.md,
  },
  chipScroll: { marginBottom: spacing.md },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    backgroundColor: colors.surface,
    marginRight: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipText: { ...typography.caption, fontWeight: "600", color: colors.text },
  chipTextSelected: { color: colors.textInverse },
  yearRow: { flexDirection: "row", gap: spacing.md },
  yearChip: {
    flex: 1,
    paddingVertical: spacing.md,
    alignItems: "center",
    borderRadius: borderRadius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  creditNotice: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    marginTop: spacing.lg,
    padding: spacing.md,
    backgroundColor: colors.info + "15",
    borderRadius: borderRadius.md,
  },
  creditText: { ...typography.caption, color: colors.info },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: spacing.xxl,
  },
});
