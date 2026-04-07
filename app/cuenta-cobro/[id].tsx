import { EstadoBadge } from "@/components/cuenta-cobro/EstadoBadge";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { useUIStore } from "@/store/ui.store";
import { colors } from "@/theme/colors";
import { borderRadius, spacing } from "@/theme/spacing";
import { typography } from "@/theme/typography";
import type { CuentaCobro, EstadoCuentaCobro } from "@/types/models";
import { formatCOP, formatDate, formatPeriodo } from "@/utils/formatters";
import cuentasCobroService from "@/utils/services/cuentas-cobro.service";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as Linking from "expo-linking";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  Alert,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";

const TIMELINE_STEPS: { estado: EstadoCuentaCobro; label: string }[] = [
  { estado: "borrador", label: "Borrador" },
  { estado: "enviada", label: "Enviada" },
  { estado: "aprobada", label: "Aprobada" },
  { estado: "pagada", label: "Pagada" },
];

const ESTADO_ORDER: Record<EstadoCuentaCobro, number> = {
  borrador: 0,
  enviada: 1,
  en_revision: 1,
  aprobada: 2,
  rechazada: 1,
  pagada: 3,
};

export default function CuentaCobroDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const showToast = useUIStore((s) => s.showToast);
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;

  const [cuenta, setCuenta] = useState<CuentaCobro | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isActioning, setIsActioning] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const load = useCallback(
    async (silent = false) => {
      if (!silent) setIsLoading(true);
      try {
        const data = await cuentasCobroService.getById(id);
        setCuenta(data);
      } catch {
        showToast({ message: "Error al cargar la cuenta de cobro", type: "error" });
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [id, showToast]
  );

  useEffect(() => {
    load();
  }, [load]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    load(true);
  };

  const handleCambiarEstado = async (
    nuevoEstado: EstadoCuentaCobro,
    obs?: string
  ) => {
    setIsActioning(true);
    try {
      const updated = await cuentasCobroService.cambiarEstado(
        id,
        nuevoEstado,
        obs
      );
      setCuenta(updated);
      showToast({ message: `Estado actualizado: ${nuevoEstado}`, type: "success" });
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { detail?: string } } })?.response?.data
          ?.detail ?? "Error al cambiar estado";
      showToast({ message: msg, type: "error" });
    } finally {
      setIsActioning(false);
    }
  };

  const handleEnviar = () => {
    Alert.alert(
      "Enviar cuenta de cobro",
      "¿Estás seguro de enviar esta cuenta para revisión? Una vez enviada no podrás editarla.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Enviar",
          onPress: () => handleCambiarEstado("enviada"),
        },
      ]
    );
  };

  const handleGenerarPDF = async () => {
    setIsGeneratingPDF(true);
    try {
      const result = await cuentasCobroService.generarPDF(id);
      setCuenta((prev) =>
        prev ? { ...prev, pdf_url: result.pdf_url } : prev
      );
      showToast({ message: "PDF generado exitosamente", type: "success" });
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { detail?: string } } })?.response?.data
          ?.detail ?? "Error al generar PDF";
      showToast({ message: msg, type: "error" });
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const handleVerPDF = async () => {
    try {
      const { url } = await cuentasCobroService.getPDFUrl(id);
      await Linking.openURL(url);
    } catch {
      showToast({ message: "No se pudo abrir el PDF", type: "error" });
    }
  };

  const handleEliminar = () => {
    Alert.alert(
      "Eliminar cuenta",
      "¿Eliminar esta cuenta de cobro en borrador?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              await cuentasCobroService.delete(id);
              showToast({ message: "Cuenta eliminada", type: "success" });
              router.back();
            } catch {
              showToast({ message: "Error al eliminar la cuenta", type: "error" });
            }
          },
        },
      ]
    );
  };

  if (isLoading) {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Skeleton height={40} width="70%" style={{ marginBottom: spacing.sm }} />
        <Skeleton height={28} width="40%" style={{ marginBottom: spacing.xl }} />
        <Skeleton height={120} style={{ marginBottom: spacing.md }} />
        <Skeleton height={160} style={{ marginBottom: spacing.md }} />
        <Skeleton height={200} />
      </ScrollView>
    );
  }

  if (!cuenta) {
    return (
      <View style={styles.centered}>
        <Ionicons name="alert-circle-outline" size={48} color={colors.disabled} />
        <Text style={styles.notFound}>Cuenta no encontrada</Text>
      </View>
    );
  }

  const currentOrder = ESTADO_ORDER[cuenta.estado];

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[styles.content, isTablet && styles.contentTablet]}
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={handleRefresh}
          colors={[colors.primary]}
        />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.periodo}>
            {formatPeriodo(cuenta.mes, cuenta.anio)}
          </Text>
          {cuenta.contrato_numero && (
            <Text style={styles.contrato}>{cuenta.contrato_numero}</Text>
          )}
        </View>
        <EstadoBadge estado={cuenta.estado} />
      </View>

      {cuenta.valor != null && (
        <Text style={styles.valor}>{formatCOP(cuenta.valor)}</Text>
      )}

      {/* Timeline */}
      <Card style={styles.section}>
        <Text style={styles.sectionTitle}>Progreso</Text>
        <View style={styles.timeline}>
          {TIMELINE_STEPS.map((step, i) => {
            const isActive = ESTADO_ORDER[step.estado] === currentOrder;
            const isCompleted = ESTADO_ORDER[step.estado] < currentOrder;
            return (
              <View key={step.estado} style={styles.timelineItem}>
                <View
                  style={[
                    styles.timelineDot,
                    isCompleted && styles.timelineDotDone,
                    isActive && styles.timelineDotActive,
                  ]}
                >
                  {isCompleted && (
                    <Ionicons name="checkmark" size={12} color={colors.textInverse} />
                  )}
                  {isActive && (
                    <View style={styles.timelineDotInner} />
                  )}
                </View>
                <Text
                  style={[
                    styles.timelineLabel,
                    (isCompleted || isActive) && styles.timelineLabelActive,
                  ]}
                >
                  {step.label}
                </Text>
                {i < TIMELINE_STEPS.length - 1 && (
                  <View
                    style={[
                      styles.timelineLine,
                      isCompleted && styles.timelineLineActive,
                    ]}
                  />
                )}
              </View>
            );
          })}
        </View>

        {/* Dates */}
        <View style={styles.dates}>
          {cuenta.fecha_creacion && (
            <Text style={styles.dateText}>
              Creada: {formatDate(cuenta.fecha_creacion)}
            </Text>
          )}
          {cuenta.fecha_envio && (
            <Text style={styles.dateText}>
              Enviada: {formatDate(cuenta.fecha_envio)}
            </Text>
          )}
          {cuenta.fecha_aprobacion && (
            <Text style={styles.dateText}>
              Aprobada: {formatDate(cuenta.fecha_aprobacion)}
            </Text>
          )}
        </View>
      </Card>

      {/* Rejection notice */}
      {cuenta.estado === "rechazada" && cuenta.observaciones_rechazo && (
        <Card style={[styles.section, styles.rejectionCard]}>
          <View style={styles.rejectionHeader}>
            <Ionicons name="alert-circle" size={20} color={colors.error} />
            <Text style={styles.rejectionTitle}>Observaciones del supervisor</Text>
          </View>
          <Text style={styles.rejectionText}>{cuenta.observaciones_rechazo}</Text>
        </Card>
      )}

      {/* Activities */}
      <Card style={styles.section}>
        <Text style={styles.sectionTitle}>
          Actividades ({cuenta.actividades?.length ?? 0})
        </Text>
        {(cuenta.actividades?.length ?? 0) === 0 ? (
          <Text style={styles.emptyText}>Sin actividades registradas</Text>
        ) : (
          cuenta.actividades.map((act, idx) => (
            <View key={act.id ?? idx} style={styles.actItem}>
              <View style={styles.actHeader}>
                {act.obligacion_id && (
                  <Badge label="Obligación" color={colors.primary} />
                )}
                {act.fecha_realizacion && (
                  <Text style={styles.actDate}>
                    {formatDate(act.fecha_realizacion)}
                  </Text>
                )}
              </View>
              <Text style={styles.actDesc}>{act.descripcion}</Text>
            </View>
          ))
        )}
      </Card>

      {/* PDF Section */}
      {(cuenta.estado === "aprobada" || cuenta.estado === "pagada" || cuenta.pdf_url) && (
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Documento PDF</Text>
          <View style={styles.pdfRow}>
            <View style={styles.pdfLeft}>
              <Ionicons
                name="document-text"
                size={24}
                color={cuenta.pdf_url ? colors.success : colors.disabled}
              />
              <Text style={styles.pdfStatus}>
                {cuenta.pdf_url ? "PDF disponible" : "PDF no generado aún"}
              </Text>
            </View>
            <View style={styles.pdfActions}>
              {cuenta.pdf_url ? (
                <Button
                  title="Ver PDF"
                  variant="outline"
                  size="sm"
                  onPress={handleVerPDF}
                  icon={<Ionicons name="open-outline" size={16} color={colors.primary} />}
                />
              ) : null}
              <Button
                title={isGeneratingPDF ? "Generando..." : "Generar PDF"}
                size="sm"
                onPress={handleGenerarPDF}
                loading={isGeneratingPDF}
                icon={<Ionicons name="document" size={16} color={colors.textInverse} />}
              />
            </View>
          </View>
        </Card>
      )}

      {/* Actions */}
      <View style={styles.actions}>
        {cuenta.estado === "borrador" && (
          <>
            <Button
              title="Continuar editando"
              onPress={() =>
                router.push("/cuenta-cobro/wizard/paso2-actividades" as never)
              }
              fullWidth
              variant="outline"
              icon={<Ionicons name="pencil" size={18} color={colors.primary} />}
            />
            <View style={{ height: spacing.sm }} />
            <Button
              title="Enviar para revisión"
              onPress={handleEnviar}
              fullWidth
              loading={isActioning}
              icon={<Ionicons name="send" size={18} color={colors.textInverse} />}
            />
            <View style={{ height: spacing.sm }} />
            <Button
              title="Eliminar borrador"
              onPress={handleEliminar}
              fullWidth
              variant="ghost"
              icon={<Ionicons name="trash-outline" size={18} color={colors.error} />}
            />
          </>
        )}
        {cuenta.estado === "rechazada" && (
          <Button
            title="Corregir y reenviar"
            onPress={() =>
              router.push("/cuenta-cobro/wizard/paso2-actividades" as never)
            }
            fullWidth
            icon={<Ionicons name="refresh" size={18} color={colors.textInverse} />}
          />
        )}
        {(cuenta.estado === "aprobada" || cuenta.estado === "pagada") && !cuenta.pdf_url && (
          <Button
            title="Generar PDF"
            onPress={handleGenerarPDF}
            fullWidth
            loading={isGeneratingPDF}
            icon={<Ionicons name="document" size={18} color={colors.textInverse} />}
          />
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingBottom: spacing.xxxl },
  contentTablet: { maxWidth: 720, alignSelf: "center", width: "100%" },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.md,
  },
  notFound: { ...typography.h3, color: colors.textSecondary },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: spacing.sm,
  },
  periodo: { ...typography.h2, color: colors.text },
  contrato: { ...typography.body, color: colors.primary },
  valor: { ...typography.h1, color: colors.primary, marginBottom: spacing.xl },
  section: { marginBottom: spacing.lg },
  sectionTitle: {
    ...typography.subtitle,
    color: colors.text,
    marginBottom: spacing.md,
  },
  timeline: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.md,
  },
  timelineItem: { alignItems: "center", flex: 1 },
  timelineDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  timelineDotDone: { backgroundColor: colors.primary },
  timelineDotActive: {
    backgroundColor: colors.surface,
    borderWidth: 3,
    borderColor: colors.primary,
  },
  timelineDotInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
  timelineLabel: {
    ...typography.caption,
    color: colors.disabled,
    marginTop: spacing.xs,
    textAlign: "center",
  },
  timelineLabelActive: { color: colors.primary, fontWeight: "600" },
  timelineLine: {
    position: "absolute",
    right: -20,
    top: 11,
    width: 40,
    height: 2,
    backgroundColor: colors.border,
  },
  timelineLineActive: { backgroundColor: colors.primary },
  dates: { gap: 2 },
  dateText: { ...typography.caption, color: colors.textSecondary },
  rejectionCard: {
    backgroundColor: colors.error + "08",
    borderWidth: 1,
    borderColor: colors.error + "30",
  },
  rejectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  rejectionTitle: { ...typography.bodyBold, color: colors.error },
  rejectionText: { ...typography.body, color: colors.text },
  emptyText: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: "center",
    padding: spacing.lg,
  },
  actItem: {
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  actHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.xs,
  },
  actDate: { ...typography.caption, color: colors.textSecondary },
  actDesc: { ...typography.body, color: colors.text },
  pdfRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: spacing.md,
  },
  pdfLeft: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  pdfStatus: { ...typography.body, color: colors.text },
  pdfActions: { flexDirection: "row", gap: spacing.sm },
  actions: { marginTop: spacing.md, gap: spacing.sm },
});
