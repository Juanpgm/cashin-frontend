import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { useContratos } from "@/hooks/useContratos";
import { colors } from "@/theme/colors";
import { borderRadius, spacing } from "@/theme/spacing";
import { typography } from "@/theme/typography";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function NuevoContratoScreen() {
  const router = useRouter();
  const { createContrato, isLoading } = useContratos();

  const [form, setForm] = useState({
    numero: "",
    objeto: "",
    valorTotal: "",
    valorMensual: "",
    fechaInicio: "",
    fechaFin: "",
    supervisor: "",
    dependencia: "",
  });

  const [obligaciones, setObligaciones] = useState<
    { descripcion: string; tipo: "general" | "especifica" }[]
  >([]);

  const addObligacion = (tipo: "general" | "especifica") => {
    setObligaciones([...obligaciones, { descripcion: "", tipo }]);
  };

  const updateObligacion = (index: number, descripcion: string) => {
    const updated = [...obligaciones];
    updated[index] = { ...updated[index], descripcion };
    setObligaciones(updated);
  };

  const removeObligacion = (index: number) => {
    setObligaciones(obligaciones.filter((_, i) => i !== index));
  };

  const onSubmit = async () => {
    if (!form.numero || !form.objeto || !form.valorMensual) return;
    try {
      await createContrato({
        numero_contrato: form.numero,
        objeto: form.objeto,
        valor_total: Number(form.valorTotal) || 0,
        valor_mensual: Number(form.valorMensual) || 0,
        fecha_inicio: form.fechaInicio || new Date().toISOString().split("T")[0],
        fecha_fin:
          form.fechaFin ||
          new Date(
            new Date().setFullYear(new Date().getFullYear() + 1)
          )
            .toISOString()
            .split("T")[0],
        supervisor_nombre: form.supervisor || undefined,
        dependencia: form.dependencia || undefined,
        obligaciones: obligaciones
          .filter((o) => o.descripcion.trim())
          .map((o, i) => ({
            descripcion: o.descripcion.trim(),
            tipo: o.tipo,
            orden: i + 1,
          })),
      });
      router.back();
    } catch {}
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.sectionTitle}>Datos del contrato</Text>

      <Input
        label="Número de contrato *"
        placeholder="CTO-2026-XXX"
        value={form.numero}
        onChangeText={(t) => setForm({ ...form, numero: t })}
      />
      <Input
        label="Objeto del contrato *"
        placeholder="Prestación de servicios profesionales..."
        multiline
        numberOfLines={3}
        value={form.objeto}
        onChangeText={(t) => setForm({ ...form, objeto: t })}
      />

      <View style={styles.row}>
        <View style={styles.half}>
          <Input
            label="Valor total"
            placeholder="72000000"
            keyboardType="numeric"
            value={form.valorTotal}
            onChangeText={(t) => setForm({ ...form, valorTotal: t })}
          />
        </View>
        <View style={styles.half}>
          <Input
            label="Valor mensual *"
            placeholder="6000000"
            keyboardType="numeric"
            value={form.valorMensual}
            onChangeText={(t) => setForm({ ...form, valorMensual: t })}
          />
        </View>
      </View>

      <View style={styles.row}>
        <View style={styles.half}>
          <Input
            label="Fecha inicio (YYYY-MM-DD)"
            placeholder="2026-01-01"
            value={form.fechaInicio}
            onChangeText={(t) => setForm({ ...form, fechaInicio: t })}
          />
        </View>
        <View style={styles.half}>
          <Input
            label="Fecha fin (YYYY-MM-DD)"
            placeholder="2026-12-31"
            value={form.fechaFin}
            onChangeText={(t) => setForm({ ...form, fechaFin: t })}
          />
        </View>
      </View>

      <Input
        label="Nombre del supervisor"
        placeholder="María del Carmen López"
        value={form.supervisor}
        onChangeText={(t) => setForm({ ...form, supervisor: t })}
      />
      <Input
        label="Dependencia"
        placeholder="Secretaría TIC"
        value={form.dependencia}
        onChangeText={(t) => setForm({ ...form, dependencia: t })}
      />

      <Text style={styles.sectionTitle}>
        Obligaciones ({obligaciones.length})
      </Text>
      <Text style={styles.sectionHint}>
        Agrega las obligaciones contractuales. Puedes agregarlas después desde el detalle del contrato.
      </Text>

      {obligaciones.map((obl, index) => (
        <Card key={index} style={styles.oblCard}>
          <View style={styles.oblHeader}>
            <Badge
              label={obl.tipo === "general" ? "General" : "Específica"}
              color={obl.tipo === "general" ? colors.info : colors.secondary}
            />
            <TouchableOpacity onPress={() => removeObligacion(index)}>
              <Ionicons name="trash-outline" size={18} color={colors.error} />
            </TouchableOpacity>
          </View>
          <TextInput
            style={styles.oblInput}
            placeholder="Descripción de la obligación..."
            placeholderTextColor={colors.disabled}
            multiline
            value={obl.descripcion}
            onChangeText={(t) => updateObligacion(index, t)}
          />
        </Card>
      ))}

      <View style={styles.oblActions}>
        <Button
          title="+ General"
          variant="outline"
          size="sm"
          onPress={() => addObligacion("general")}
        />
        <Button
          title="+ Específica"
          variant="outline"
          size="sm"
          onPress={() => addObligacion("especifica")}
        />
      </View>

      <View style={styles.submitSection}>
        <Button
          title="Crear contrato"
          onPress={onSubmit}
          loading={isLoading}
          disabled={!form.numero || !form.objeto || !form.valorMensual}
          fullWidth
          size="lg"
          icon={<Ionicons name="checkmark-circle" size={20} color={colors.textInverse} />}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingBottom: spacing.xxxl },
  sectionTitle: {
    ...typography.h3,
    color: colors.text,
    marginBottom: spacing.xs,
    marginTop: spacing.md,
  },
  sectionHint: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
  },
  row: { flexDirection: "row", gap: spacing.md },
  half: { flex: 1 },
  oblCard: { marginBottom: spacing.md, padding: spacing.md },
  oblHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  oblInput: {
    ...typography.body,
    color: colors.text,
    minHeight: 44,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    textAlignVertical: "top",
  },
  oblActions: { flexDirection: "row", gap: spacing.md, marginTop: spacing.sm },
  submitSection: { marginTop: spacing.xxl },
});
