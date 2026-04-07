import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useCuentaCobroStore } from "@/store/cuenta-cobro.store";
import { useUIStore } from "@/store/ui.store";
import { colors } from "@/theme/colors";
import { borderRadius, spacing } from "@/theme/spacing";
import { typography } from "@/theme/typography";
import type { Actividad } from "@/types/models";
import cuentasCobroService from "@/utils/services/cuentas-cobro.service";
import contratosService from "@/utils/services/contratos.service";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function WizardPaso2Screen() {
  const router = useRouter();
  const { wizard, setWizardActividades, addWizardActividad, removeWizardActividad } =
    useCuentaCobroStore();
  const showToast = useUIStore((s) => s.showToast);

  const [obligaciones, setObligaciones] = useState<
    { id: string; descripcion: string; tipo: string; orden: number }[]
  >([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isAddingManual, setIsAddingManual] = useState(false);
  const [showTextModal, setShowTextModal] = useState(false);
  const [textoActividades, setTextoActividades] = useState("");
  const [isParsingText, setIsParsingText] = useState(false);
  const [newDesc, setNewDesc] = useState("");
  const [newObligId, setNewObligId] = useState<string>("");

  const cuentaId = wizard.cuentaId;

  useEffect(() => {
    if (wizard.contratoId) {
      contratosService.getById(wizard.contratoId).then((c) => {
        setObligaciones(c.obligaciones ?? []);
        if (c.obligaciones?.length > 0) setNewObligId(c.obligaciones[0].id);
      });
    }
  }, [wizard.contratoId]);

  if (!cuentaId) {
    return (
      <View style={styles.centered}>
        <Text style={styles.error}>No hay cuenta creada. Vuelve al paso anterior.</Text>
        <Button title="Volver" onPress={() => router.back()} variant="outline" />
      </View>
    );
  }

  const handleGenerarIA = async () => {
    setIsGenerating(true);
    try {
      const actividades = await cuentasCobroService.generarActividades(cuentaId);
      setWizardActividades(actividades);
      showToast({
        message: `IA generó ${actividades.length} actividades`,
        type: "success",
      });
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { detail?: string } } })?.response?.data
          ?.detail ?? "Error al generar actividades con IA";
      showToast({ message: msg, type: "error" });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDesdeTexto = async () => {
    if (!textoActividades.trim()) return;
    setIsParsingText(true);
    try {
      const actividades = await cuentasCobroService.actividadesDesdeTexto(
        cuentaId,
        { texto: textoActividades.trim() }
      );
      actividades.forEach((a) => addWizardActividad(a));
      showToast({
        message: `Se crearon ${actividades.length} actividades`,
        type: "success",
      });
      setShowTextModal(false);
      setTextoActividades("");
    } catch {
      showToast({ message: "Error al procesar el texto", type: "error" });
    } finally {
      setIsParsingText(false);
    }
  };

  const handleAddManual = async () => {
    if (!newDesc.trim()) {
      showToast({ message: "La descripción es requerida", type: "error" });
      return;
    }
    setIsAddingManual(true);
    try {
      const act = await cuentasCobroService.addActividad(cuentaId, {
        descripcion: newDesc.trim(),
        obligacion_id: newObligId || undefined,
      });
      addWizardActividad(act);
      setNewDesc("");
      showToast({ message: "Actividad agregada", type: "success" });
    } catch {
      showToast({ message: "Error al agregar actividad", type: "error" });
    } finally {
      setIsAddingManual(false);
    }
  };

  const handleRemove = async (act: Actividad) => {
    if (!cuentaId) return;
    // Optimistically remove from UI
    removeWizardActividad(act.id);
    // Persist to backend (activity has a real id if it was saved server-side)
    if (act.id) {
      try {
        await cuentasCobroService.deleteActividad(cuentaId, act.id);
      } catch (err) {
        console.warn("Failed to delete actividad from server:", err);
        // Restore the activity in local state on failure
        addWizardActividad(act);
        showToast({ message: "No se pudo eliminar la actividad", type: "error" });
      }
    }
  };

  const handleNext = () => {
    if (wizard.actividades.length === 0) {
      showToast({ message: "Agrega al menos una actividad", type: "warning" });
      return;
    }
    router.push("/cuenta-cobro/wizard/paso3-evidencias" as never);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Registra tus actividades</Text>
      <Text style={styles.description}>
        Agrega las actividades realizadas durante el período de cobro
      </Text>

      {/* AI generation */}
      <Card style={styles.aiCard}>
        <View style={styles.aiHeader}>
          <Ionicons name="sparkles" size={20} color={colors.primary} />
          <Text style={styles.aiTitle}>Generar con Inteligencia Artificial</Text>
        </View>
        <Text style={styles.aiDesc}>
          La IA analizará tu contrato y generará actividades relevantes automáticamente.
        </Text>
        <Button
          title={isGenerating ? "Generando..." : "Generar actividades con IA"}
          onPress={handleGenerarIA}
          loading={isGenerating}
          fullWidth
          icon={<Ionicons name="sparkles" size={18} color={colors.textInverse} />}
        />
      </Card>

      {/* From text */}
      <View style={styles.altActions}>
        <Button
          title="Desde lista de texto"
          variant="outline"
          size="sm"
          onPress={() => setShowTextModal(true)}
          icon={<Ionicons name="list" size={16} color={colors.primary} />}
        />
        <Text style={styles.altSep}>o</Text>
        <Button
          title="Agregar manual"
          variant="outline"
          size="sm"
          onPress={() => {}}
          icon={<Ionicons name="add" size={16} color={colors.primary} />}
        />
      </View>

      {/* Manual form */}
      <Card style={styles.manualCard}>
        <Text style={styles.manualTitle}>Agregar actividad manualmente</Text>

        {obligaciones.length > 0 && (
          <View style={styles.obligRow}>
            <Text style={styles.inputLabel}>Obligación:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {obligaciones.map((obl) => (
                <TouchableOpacity
                  key={obl.id}
                  style={[
                    styles.obligChip,
                    newObligId === obl.id && styles.obligChipSelected,
                  ]}
                  onPress={() => setNewObligId(obl.id)}
                >
                  <Text
                    style={[
                      styles.obligChipText,
                      newObligId === obl.id && styles.obligChipTextSelected,
                    ]}
                  >
                    Obl. {obl.orden}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        <Text style={styles.inputLabel}>Descripción:</Text>
        <TextInput
          style={styles.input}
          placeholder="Describe la actividad realizada..."
          placeholderTextColor={colors.disabled}
          value={newDesc}
          onChangeText={setNewDesc}
          multiline
          numberOfLines={3}
        />
        <Button
          title="Agregar"
          onPress={handleAddManual}
          loading={isAddingManual}
          variant="outline"
          fullWidth
          size="sm"
        />
      </Card>

      {/* Activities list */}
      {wizard.actividades.length > 0 && (
        <Card style={styles.listCard}>
          <View style={styles.listHeader}>
            <Text style={styles.listTitle}>
              Actividades ({wizard.actividades.length})
            </Text>
            <TouchableOpacity
              onPress={() => setWizardActividades([])}
              style={styles.clearBtn}
            >
              <Text style={styles.clearText}>Limpiar todo</Text>
            </TouchableOpacity>
          </View>
          {wizard.actividades.map((act, idx) => {
            const obl = obligaciones.find((o) => o.id === act.obligacion_id);
            return (
              <View key={act.id ?? idx} style={styles.actItem}>
                <View style={styles.actInfo}>
                  {obl && (
                    <Badge
                      label={`Obl. ${obl.orden}`}
                      color={colors.primary}
                    />
                  )}
                  <Text style={styles.actDesc}>{act.descripcion}</Text>
                </View>
                <TouchableOpacity onPress={() => handleRemove(act)}>
                  <Ionicons name="close-circle" size={22} color={colors.error} />
                </TouchableOpacity>
              </View>
            );
          })}
        </Card>
      )}

      <View style={styles.footer}>
        <Button title="Atrás" variant="ghost" onPress={() => router.back()} />
        <Button
          title="Siguiente"
          onPress={handleNext}
          disabled={wizard.actividades.length === 0}
          icon={
            <Ionicons
              name="arrow-forward"
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

      {/* Text modal */}
      <Modal
        visible={showTextModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowTextModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Actividades desde texto</Text>
              <TouchableOpacity onPress={() => setShowTextModal(false)}>
                <Ionicons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>
            <Text style={styles.modalDesc}>
              Escribe o pega tu lista de actividades (una por línea o numerada). La IA las procesará automáticamente.
            </Text>
            <TextInput
              style={styles.textArea}
              placeholder={"1. Asistí a reunión de seguimiento...\n2. Desarrollé módulo de autenticación...\n3. Entregué informe mensual..."}
              placeholderTextColor={colors.disabled}
              value={textoActividades}
              onChangeText={setTextoActividades}
              multiline
              numberOfLines={8}
              textAlignVertical="top"
            />
            <View style={styles.modalActions}>
              <Button
                title="Cancelar"
                variant="ghost"
                onPress={() => setShowTextModal(false)}
              />
              <Button
                title={isParsingText ? "Procesando..." : "Procesar"}
                onPress={handleDesdeTexto}
                loading={isParsingText}
                disabled={!textoActividades.trim()}
              />
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingBottom: spacing.xxxl },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.xl,
    gap: spacing.lg,
  },
  error: { ...typography.h3, color: colors.error, textAlign: "center" },
  title: { ...typography.h3, color: colors.text, marginBottom: spacing.xs },
  description: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
  },
  aiCard: {
    borderWidth: 1,
    borderColor: colors.primary + "40",
    backgroundColor: colors.primary + "06",
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  aiHeader: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  aiTitle: { ...typography.bodyBold, color: colors.primary },
  aiDesc: { ...typography.caption, color: colors.textSecondary, lineHeight: 18 },
  altActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  altSep: { ...typography.caption, color: colors.textSecondary },
  manualCard: { marginBottom: spacing.md, gap: spacing.sm },
  manualTitle: { ...typography.bodyBold, color: colors.text },
  inputLabel: { ...typography.caption, color: colors.textSecondary, marginBottom: spacing.xs },
  obligRow: { gap: spacing.xs },
  obligChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    marginRight: spacing.sm,
  },
  obligChipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  obligChipText: { ...typography.caption, color: colors.text },
  obligChipTextSelected: { color: colors.textInverse },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    ...typography.body,
    color: colors.text,
    backgroundColor: colors.surface,
    minHeight: 80,
    textAlignVertical: "top",
  },
  listCard: { marginBottom: spacing.md },
  listHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  listTitle: { ...typography.bodyBold, color: colors.text },
  clearBtn: {},
  clearText: { ...typography.caption, color: colors.error },
  actItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    gap: spacing.sm,
  },
  actInfo: { flex: 1, gap: spacing.xs },
  actDesc: { ...typography.body, color: colors.text },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: spacing.xl,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: spacing.xl,
    gap: spacing.md,
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  modalTitle: { ...typography.h3, color: colors.text },
  modalDesc: { ...typography.body, color: colors.textSecondary },
  textArea: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    ...typography.body,
    color: colors.text,
    backgroundColor: colors.background,
    height: 180,
    textAlignVertical: "top",
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: spacing.sm,
  },
});
