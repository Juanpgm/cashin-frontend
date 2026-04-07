import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useUIStore } from "@/store/ui.store";
import { colors } from "@/theme/colors";
import { borderRadius, spacing } from "@/theme/spacing";
import { typography } from "@/theme/typography";
import type { SecopContrato, SecopImportResult } from "@/types/models";
import { formatCOP } from "@/utils/formatters";
import secopService from "@/utils/services/secop.service";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";

export default function SecopScreen() {
  const router = useRouter();
  const showToast = useUIStore((s) => s.showToast);
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;

  const [cedula, setCedula] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [contratos, setContratos] = useState<SecopContrato[]>([]);
  const [preview, setPreview] = useState<SecopImportResult | null>(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = async () => {
    if (!cedula || cedula.length < 5) {
      showToast({ message: "Ingresa un número de cédula válido", type: "error" });
      return;
    }
    setIsSearching(true);
    setSearched(false);
    setContratos([]);
    setPreview(null);
    try {
      const data = await secopService.buscarContratos(cedula);
      setContratos(data);
      setSearched(true);
    } catch {
      showToast({ message: "Error al consultar SECOP", type: "error" });
    } finally {
      setIsSearching(false);
    }
  };

  const handlePreviewImport = async () => {
    if (!cedula) return;
    setIsImporting(true);
    try {
      const result = await secopService.importar(cedula, false);
      setPreview(result);
    } catch {
      showToast({ message: "Error al previsualizar importación", type: "error" });
    } finally {
      setIsImporting(false);
    }
  };

  const handleConfirmImport = async () => {
    if (!cedula) return;
    Alert.alert(
      "Confirmar importación",
      `Se importarán ${preview?.importados ?? contratos.length} contratos a tu cuenta. ¿Continuar?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Importar",
          style: "default",
          onPress: async () => {
            setIsImporting(true);
            try {
              await secopService.importar(cedula, true);
              showToast({
                message: `Contratos importados exitosamente`,
                type: "success",
              });
              setPreview(null);
              router.back();
            } catch (err: unknown) {
              const msg =
                (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail ??
                "Error al importar contratos";
              showToast({ message: msg, type: "error" });
            } finally {
              setIsImporting(false);
            }
          },
        },
      ]
    );
  };

  const renderContrato = ({ item }: { item: SecopContrato }) => (
    <Card style={styles.contratoCard}>
      <View style={styles.contratoHeader}>
        <Text style={styles.contratoNumero} numberOfLines={1}>
          {item.numero_contrato ?? item.id_proceso ?? "Sin número"}
        </Text>
        {item.estado_contrato && (
          <View style={styles.estadoBadge}>
            <Text style={styles.estadoText}>{item.estado_contrato}</Text>
          </View>
        )}
      </View>
      {item.nombre_entidad && (
        <Text style={styles.entidad} numberOfLines={1}>
          {item.nombre_entidad}
        </Text>
      )}
      <Text style={styles.objeto} numberOfLines={2}>
        {item.objeto ?? "Sin descripción"}
      </Text>
      <View style={styles.contratoFooter}>
        {item.valor_contrato != null && (
          <Text style={styles.valor}>{formatCOP(item.valor_contrato)}</Text>
        )}
        {item.fecha_inicio && (
          <Text style={styles.fecha}>
            {item.fecha_inicio} – {item.fecha_fin ?? "..."}
          </Text>
        )}
      </View>
    </Card>
  );

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      <View style={[styles.content, isTablet && styles.contentTablet]}>
        {/* Info banner */}
        <View style={styles.infoBanner}>
          <Ionicons name="information-circle" size={20} color={colors.info} />
          <Text style={styles.infoText}>
            Busca tus contratos en SECOP II usando tu número de cédula e impórtalos directamente a CashIn.
          </Text>
        </View>

        {/* Search */}
        <View style={styles.searchRow}>
          <TextInput
            style={styles.searchInput}
            value={cedula}
            onChangeText={(t) => setCedula(t.replace(/\D/g, ""))}
            placeholder="Número de cédula"
            placeholderTextColor={colors.disabled}
            keyboardType="numeric"
            maxLength={15}
          />
          <Button
            title="Buscar"
            onPress={handleSearch}
            loading={isSearching}
            icon={<Ionicons name="search" size={18} color={colors.textInverse} />}
          />
        </View>

        {/* Results */}
        {isSearching && (
          <View style={styles.loadingCenter}>
            <ActivityIndicator color={colors.primary} size="large" />
            <Text style={styles.loadingText}>Consultando SECOP...</Text>
          </View>
        )}

        {searched && !isSearching && (
          <>
            <View style={styles.resultsHeader}>
              <Text style={styles.resultsCount}>
                {contratos.length} contrato{contratos.length !== 1 ? "s" : ""} encontrado
                {contratos.length !== 1 ? "s" : ""}
              </Text>
              {contratos.length > 0 && (
                <TouchableOpacity onPress={handleSearch} style={styles.refreshBtn}>
                  <Ionicons name="refresh" size={16} color={colors.primary} />
                </TouchableOpacity>
              )}
            </View>

            {contratos.length === 0 ? (
              <View style={styles.emptyState}>
                <Ionicons name="search-outline" size={48} color={colors.disabled} />
                <Text style={styles.emptyTitle}>Sin resultados</Text>
                <Text style={styles.emptyDesc}>
                  No se encontraron contratos en SECOP para esa cédula.
                </Text>
              </View>
            ) : (
              <>
                <FlatList
                  data={contratos}
                  keyExtractor={(_, i) => i.toString()}
                  renderItem={renderContrato}
                  scrollEnabled={false}
                  ItemSeparatorComponent={() => <View style={{ height: spacing.sm }} />}
                />

                {/* Import actions */}
                <View style={styles.importSection}>
                  {!preview ? (
                    <Button
                      title="Previsualizar importación"
                      onPress={handlePreviewImport}
                      loading={isImporting}
                      variant="outline"
                      fullWidth
                      icon={<Ionicons name="eye-outline" size={18} color={colors.primary} />}
                    />
                  ) : (
                    <View style={styles.previewBox}>
                      <Text style={styles.previewTitle}>Resumen de importación</Text>
                      <View style={styles.previewRow}>
                        <Text style={styles.previewLabel}>A importar:</Text>
                        <Text style={styles.previewValue}>{preview.importados}</Text>
                      </View>
                      <View style={styles.previewRow}>
                        <Text style={styles.previewLabel}>Ya existentes:</Text>
                        <Text style={styles.previewValue}>{preview.omitidos}</Text>
                      </View>
                      {preview.message && (
                        <Text style={styles.previewMsg}>{preview.message}</Text>
                      )}
                      <View style={styles.previewActions}>
                        <Button
                          title="Cancelar"
                          variant="ghost"
                          onPress={() => setPreview(null)}
                        />
                        <Button
                          title="Confirmar importación"
                          onPress={handleConfirmImport}
                          loading={isImporting}
                          icon={<Ionicons name="download" size={18} color={colors.textInverse} />}
                        />
                      </View>
                    </View>
                  )}
                </View>
              </>
            )}
          </>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, gap: spacing.lg },
  contentTablet: { maxWidth: 720, alignSelf: "center", width: "100%" },
  infoBanner: {
    flexDirection: "row",
    gap: spacing.sm,
    backgroundColor: colors.infoLight ?? "#E3F2FD",
    borderRadius: borderRadius.md,
    padding: spacing.md,
    alignItems: "flex-start",
  },
  infoText: { ...typography.caption, color: colors.text, flex: 1, lineHeight: 18 },
  searchRow: {
    flexDirection: "row",
    gap: spacing.sm,
    alignItems: "center",
  },
  searchInput: {
    flex: 1,
    ...typography.body,
    color: colors.text,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  loadingCenter: { alignItems: "center", gap: spacing.md, paddingVertical: spacing.xxl },
  loadingText: { ...typography.body, color: colors.textSecondary },
  resultsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  resultsCount: { ...typography.bodyBold, color: colors.text },
  refreshBtn: { padding: spacing.xs },
  contratoCard: { padding: spacing.md, gap: spacing.xs },
  contratoHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: spacing.sm,
  },
  contratoNumero: { ...typography.bodyBold, color: colors.primary, flex: 1 },
  estadoBadge: {
    backgroundColor: colors.primaryLight ?? "#E8F5E9",
    borderRadius: borderRadius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
  estadoText: { ...typography.caption, color: colors.primary },
  entidad: { ...typography.caption, color: colors.textSecondary },
  objeto: { ...typography.body, color: colors.text },
  contratoFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: spacing.xs,
  },
  valor: { ...typography.bodyBold, color: colors.success },
  fecha: { ...typography.caption, color: colors.textSecondary },
  emptyState: { alignItems: "center", gap: spacing.md, paddingVertical: spacing.xxxl },
  emptyTitle: { ...typography.h3, color: colors.textSecondary },
  emptyDesc: { ...typography.body, color: colors.textSecondary, textAlign: "center" },
  importSection: { marginTop: spacing.md },
  previewBox: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  previewTitle: { ...typography.bodyBold, color: colors.text },
  previewRow: { flexDirection: "row", justifyContent: "space-between" },
  previewLabel: { ...typography.body, color: colors.textSecondary },
  previewValue: { ...typography.bodyBold, color: colors.text },
  previewMsg: { ...typography.caption, color: colors.textSecondary, fontStyle: "italic" },
  previewActions: { flexDirection: "row", gap: spacing.sm, justifyContent: "flex-end", marginTop: spacing.sm },
});
