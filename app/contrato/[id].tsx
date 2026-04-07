import { EstadoBadge } from "@/components/cuenta-cobro/EstadoBadge";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { useUIStore } from "@/store/ui.store";
import { colors } from "@/theme/colors";
import { borderRadius, spacing } from "@/theme/spacing";
import { typography } from "@/theme/typography";
import type {
  Contrato,
  ContratoConfiguracion,
  Documento,
  PeriodoPendiente,
} from "@/types/models";
import { formatCOP, formatDate, formatPeriodo } from "@/utils/formatters";
import contratosService from "@/utils/services/contratos.service";
import documentosService from "@/utils/services/documentos.service";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as DocumentPicker from "expo-document-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";

const TIPO_DOC_LABELS: Record<string, string> = {
  contrato: "Contrato firmado",
  instrucciones: "Instrucciones",
  plantilla: "Plantilla HTML",
};

const TIPO_DOC_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  contrato: "document",
  instrucciones: "list",
  plantilla: "code-slash",
};

export default function ContratoDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const showToast = useUIStore((s) => s.showToast);
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;

  const [contrato, setContrato] = useState<Contrato | null>(null);
  const [configuracion, setConfiguracion] =
    useState<ContratoConfiguracion | null>(null);
  const [documentos, setDocumentos] = useState<Documento[]>([]);
  const [periodos, setPeriodos] = useState<PeriodoPendiente[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [uploadingTipo, setUploadingTipo] = useState<string | null>(null);
  const [showPeriodos, setShowPeriodos] = useState(false);

  const load = useCallback(
    async (silent = false) => {
      if (!silent) setIsLoading(true);
      try {
        const [c, cfg, docs, per] = await Promise.all([
          contratosService.getById(id),
          contratosService.getConfiguracion(id),
          documentosService.listByContrato(id),
          contratosService.getPeriodosPendientes(id),
        ]);
        setContrato(c);
        setConfiguracion(cfg);
        setDocumentos(docs);
        setPeriodos(per);
      } catch {
        showToast({ message: "Error al cargar el contrato", type: "error" });
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

  const handleDeleteObligacion = async (obligId: string, desc: string) => {
    Alert.alert(
      "Eliminar obligación",
      `¿Eliminar "${desc.substring(0, 60)}..."?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              await contratosService.deleteObligacion(id, obligId);
              setContrato((prev) =>
                prev
                  ? {
                      ...prev,
                      obligaciones: prev.obligaciones.filter(
                        (o) => o.id !== obligId
                      ),
                    }
                  : prev
              );
              showToast({ message: "Obligación eliminada", type: "success" });
            } catch {
              showToast({ message: "No se puede eliminar esta obligación", type: "error" });
            }
          },
        },
      ]
    );
  };

  const handleUploadDoc = async (tipo: string) => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["application/pdf", "text/html", "text/plain", "application/msword",
               "application/vnd.openxmlformats-officedocument.wordprocessingml.document"],
        copyToCacheDirectory: true,
      });
      if (result.canceled) return;
      const file = result.assets[0];
      setUploadingTipo(tipo);
      const uploaded = await documentosService.upload(
        { uri: file.uri, name: file.name, type: file.mimeType ?? "application/octet-stream" },
        tipo as "contrato" | "instrucciones" | "plantilla",
        id
      );
      setDocumentos((prev) => [...prev, uploaded]);
      // Refresh configuracion
      const cfg = await contratosService.getConfiguracion(id);
      setConfiguracion(cfg);
      showToast({ message: "Documento subido exitosamente", type: "success" });
    } catch {
      showToast({ message: "Error al subir el documento", type: "error" });
    } finally {
      setUploadingTipo(null);
    }
  };

  if (isLoading) {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Skeleton height={32} width="60%" style={{ marginBottom: spacing.md }} />
        <Skeleton height={120} style={{ marginBottom: spacing.md }} />
        <Skeleton height={180} style={{ marginBottom: spacing.md }} />
        <Skeleton height={120} />
      </ScrollView>
    );
  }

  if (!contrato) {
    return (
      <View style={styles.centered}>
        <Ionicons name="alert-circle-outline" size={48} color={colors.disabled} />
        <Text style={styles.notFound}>Contrato no encontrado</Text>
      </View>
    );
  }

  const periodosPendientes = periodos.filter((p) => !p.tiene_cuenta);

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
        <Text style={styles.numero}>{contrato.numero_contrato}</Text>
        <Badge
          label={contrato.activo ? "Vigente" : "Vencido"}
          color={contrato.activo ? colors.success : colors.error}
        />
      </View>

      {/* Configuración status */}
      {configuracion && (
        <View
          style={[
            styles.configBanner,
            configuracion.lista_para_generar
              ? styles.configReady
              : styles.configPending,
          ]}
        >
          <Ionicons
            name={
              configuracion.lista_para_generar
                ? "checkmark-circle"
                : "warning"
            }
            size={18}
            color={
              configuracion.lista_para_generar ? colors.success : colors.warning
            }
          />
          <Text
            style={[
              styles.configText,
              {
                color: configuracion.lista_para_generar
                  ? colors.success
                  : colors.warning,
              },
            ]}
          >
            {configuracion.lista_para_generar
              ? "Listo para generar cuentas con IA"
              : "Faltan documentos para generación con IA"}
          </Text>
        </View>
      )}

      {/* Objeto */}
      <Card style={styles.section}>
        <Text style={styles.sectionTitle}>Objeto del contrato</Text>
        <Text style={styles.objeto}>{contrato.objeto}</Text>
      </Card>

      {/* Info grid */}
      <Card style={styles.section}>
        <Text style={styles.sectionTitle}>Información general</Text>
        <InfoItem label="Valor total" value={formatCOP(contrato.valor_total)} />
        <InfoItem
          label="Valor mensual"
          value={formatCOP(contrato.valor_mensual)}
        />
        <InfoItem label="Fecha inicio" value={formatDate(contrato.fecha_inicio)} />
        <InfoItem label="Fecha fin" value={formatDate(contrato.fecha_fin)} />
        {contrato.supervisor_nombre && (
          <InfoItem label="Supervisor" value={contrato.supervisor_nombre} />
        )}
        {contrato.dependencia && (
          <InfoItem label="Dependencia" value={contrato.dependencia} />
        )}
      </Card>

      {/* Obligaciones */}
      <Card style={styles.section}>
        <Text style={styles.sectionTitle}>
          Obligaciones ({contrato.obligaciones.length})
        </Text>
        {contrato.obligaciones.length === 0 ? (
          <Text style={styles.emptyText}>Sin obligaciones registradas</Text>
        ) : (
          contrato.obligaciones.map((obl) => (
            <View key={obl.id} style={styles.obligacion}>
              <View style={styles.oblRow}>
                <View style={styles.oblLeft}>
                  <View style={styles.oblNumber}>
                    <Text style={styles.oblNumberText}>{obl.orden}</Text>
                  </View>
                  <Badge
                    label={obl.tipo === "general" ? "General" : "Específica"}
                    color={obl.tipo === "general" ? colors.info : colors.secondary}
                  />
                </View>
                <TouchableOpacity
                  onPress={() =>
                    handleDeleteObligacion(obl.id, obl.descripcion)
                  }
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Ionicons
                    name="trash-outline"
                    size={16}
                    color={colors.error}
                  />
                </TouchableOpacity>
              </View>
              <Text style={styles.oblDesc}>{obl.descripcion}</Text>
            </View>
          ))
        )}
      </Card>

      {/* Documentos */}
      <Card style={styles.section}>
        <Text style={styles.sectionTitle}>Documentos</Text>
        {(["contrato", "instrucciones", "plantilla"] as const).map((tipo) => {
          const doc = documentos.find((d) => d.tipo === tipo);
          const isUploading = uploadingTipo === tipo;
          return (
            <View key={tipo} style={styles.docRow}>
              <View style={styles.docLeft}>
                <Ionicons
                  name={TIPO_DOC_ICONS[tipo]}
                  size={20}
                  color={doc ? colors.success : colors.disabled}
                />
                <View>
                  <Text style={styles.docLabel}>{TIPO_DOC_LABELS[tipo]}</Text>
                  {doc?.nombre_archivo && (
                    <Text style={styles.docFileName} numberOfLines={1}>
                      {doc.nombre_archivo}
                    </Text>
                  )}
                </View>
              </View>
              {isUploading ? (
                <ActivityIndicator size="small" color={colors.primary} />
              ) : (
                <TouchableOpacity
                  onPress={() => handleUploadDoc(tipo)}
                  style={styles.uploadBtn}
                >
                  <Ionicons
                    name={doc ? "refresh-outline" : "cloud-upload-outline"}
                    size={18}
                    color={colors.primary}
                  />
                  <Text style={styles.uploadBtnText}>
                    {doc ? "Reemplazar" : "Subir"}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          );
        })}
      </Card>

      {/* Periodos pendientes */}
      {periodosPendientes.length > 0 && (
        <Card style={styles.section}>
          <TouchableOpacity
            style={styles.periodosHeader}
            onPress={() => setShowPeriodos((v) => !v)}
          >
            <View style={styles.periodosLeft}>
              <Ionicons name="time-outline" size={18} color={colors.warning} />
              <Text style={styles.periodosTitle}>
                {periodosPendientes.length} período
                {periodosPendientes.length !== 1 ? "s" : ""} sin cuenta de cobro
              </Text>
            </View>
            <Ionicons
              name={showPeriodos ? "chevron-up" : "chevron-down"}
              size={18}
              color={colors.textSecondary}
            />
          </TouchableOpacity>
          {showPeriodos && (
            <View style={styles.periodosList}>
              {periodosPendientes.map((p) => (
                <TouchableOpacity
                  key={`${p.anio}-${p.mes}`}
                  style={styles.periodoItem}
                  onPress={() =>
                    router.push(
                      "/cuenta-cobro/wizard/paso1-contrato" as never
                    )
                  }
                >
                  <Text style={styles.periodoText}>
                    {formatPeriodo(p.mes, p.anio)}
                  </Text>
                  <Ionicons
                    name="add-circle-outline"
                    size={18}
                    color={colors.primary}
                  />
                </TouchableOpacity>
              ))}
            </View>
          )}
        </Card>
      )}

      {/* Actions */}
      <View style={styles.actions}>
        <Button
          title="Generar cuenta de cobro"
          onPress={() =>
            router.push("/cuenta-cobro/wizard/paso1-contrato" as never)
          }
          fullWidth
          icon={
            <Ionicons
              name="receipt-outline"
              size={18}
              color={colors.textInverse}
            />
          }
        />
      </View>
    </ScrollView>
  );
}

function InfoItem({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <View style={styles.infoItem}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
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
    alignItems: "center",
    marginBottom: spacing.md,
  },
  numero: { ...typography.h2, color: colors.primary },
  configBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  configReady: { backgroundColor: "#E8F5E9" },
  configPending: { backgroundColor: "#FFF8E1" },
  configText: { ...typography.caption, flex: 1 },
  section: { marginBottom: spacing.lg },
  sectionTitle: {
    ...typography.subtitle,
    color: colors.text,
    marginBottom: spacing.md,
  },
  objeto: { ...typography.body, color: colors.text, lineHeight: 22 },
  infoItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  infoLabel: { ...typography.body, color: colors.textSecondary },
  infoValue: {
    ...typography.bodyBold,
    color: colors.text,
    maxWidth: "55%",
    textAlign: "right",
  },
  obligacion: {
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    gap: spacing.xs,
  },
  oblRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  oblLeft: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  oblNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  oblNumberText: {
    ...typography.caption,
    color: colors.textInverse,
    fontWeight: "700",
  },
  oblDesc: { ...typography.body, color: colors.text },
  docRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  docLeft: { flexDirection: "row", alignItems: "center", gap: spacing.md, flex: 1 },
  docLabel: { ...typography.body, color: colors.text },
  docFileName: { ...typography.caption, color: colors.textSecondary, maxWidth: 160 },
  uploadBtn: { flexDirection: "row", alignItems: "center", gap: 4 },
  uploadBtnText: { ...typography.caption, color: colors.primary },
  periodosHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  periodosLeft: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  periodosTitle: { ...typography.body, color: colors.warning },
  periodosList: { marginTop: spacing.md, gap: spacing.sm },
  periodoItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.background,
    borderRadius: borderRadius.sm,
  },
  periodoText: { ...typography.body, color: colors.text },
  emptyText: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: "center",
    padding: spacing.lg,
  },
  actions: { marginTop: spacing.md },
});
