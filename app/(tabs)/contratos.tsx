import { ContratoCard } from "@/components/contrato/ContratoCard";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/Skeleton";
import { useContratos } from "@/hooks/useContratos";
import { colors } from "@/theme/colors";
import { borderRadius, spacing } from "@/theme/spacing";
import { typography } from "@/theme/typography";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type Filtro = "todos" | "activos" | "vencidos";

export default function ContratosScreen() {
  const router = useRouter();
  const { contratos, isLoading, loadContratos } = useContratos();
  const [busqueda, setBusqueda] = useState("");
  const [filtro, setFiltro] = useState<Filtro>("todos");
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    loadContratos();
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadContratos();
    setIsRefreshing(false);
  };

  const contratosFiltrados = contratos
    .filter((c) => {
      if (filtro === "activos") return c.activo;
      if (filtro === "vencidos") return !c.activo;
      return true;
    })
    .filter((c) => {
      if (!busqueda) return true;
      const q = busqueda.toLowerCase();
      return (
        c.numero_contrato.toLowerCase().includes(q) ||
        c.objeto.toLowerCase().includes(q) ||
        (c.supervisor_nombre?.toLowerCase().includes(q) ?? false)
      );
    });

  const filtros: { key: Filtro; label: string }[] = [
    { key: "todos", label: "Todos" },
    { key: "activos", label: "Activos" },
    { key: "vencidos", label: "Vencidos" },
  ];

  if (isLoading && contratos.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.skeletonContainer}>
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} height={100} style={{ marginBottom: spacing.md }} />
          ))}
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Ionicons
          name="search"
          size={20}
          color={colors.textSecondary}
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar por número o nombre..."
          placeholderTextColor={colors.disabled}
          value={busqueda}
          onChangeText={setBusqueda}
        />
        {busqueda.length > 0 && (
          <TouchableOpacity onPress={() => setBusqueda("")}>
            <Ionicons name="close-circle" size={18} color={colors.disabled} />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.filtros}>
        {filtros.map((f) => (
          <TouchableOpacity
            key={f.key}
            style={[styles.chip, filtro === f.key && styles.chipActive]}
            onPress={() => setFiltro(f.key)}
          >
            <Text
              style={[styles.chipText, filtro === f.key && styles.chipTextActive]}
            >
              {f.label}
            </Text>
          </TouchableOpacity>
        ))}

        {/* SECOP import shortcut */}
        <TouchableOpacity
          style={styles.secopBtn}
          onPress={() => router.push("/secop" as never)}
        >
          <Ionicons name="cloud-download-outline" size={16} color={colors.primary} />
          <Text style={styles.secopText}>SECOP</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={contratosFiltrados}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ContratoCard
            contrato={item}
            onPress={() => router.push(`/contrato/${item.id}` as never)}
          />
        )}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            colors={[colors.primary]}
          />
        }
        ListEmptyComponent={
          <EmptyState
            icon="document-text-outline"
            title={busqueda ? "Sin resultados" : "Sin contratos"}
            description={
              busqueda
                ? `No hay contratos que coincidan con "${busqueda}"`
                : "Importa contratos desde SECOP o crea uno manualmente"
            }
            actionLabel={busqueda ? "Limpiar búsqueda" : "Importar de SECOP"}
            onAction={
              busqueda
                ? () => setBusqueda("")
                : () => router.push("/secop" as never)
            }
          />
        }
      />

      <View style={styles.fab}>
        <Button
          title="Nuevo"
          onPress={() => router.push("/contrato/nuevo" as never)}
          icon={<Ionicons name="add" size={20} color={colors.textInverse} />}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  skeletonContainer: { padding: spacing.lg },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    margin: spacing.lg,
    marginBottom: spacing.sm,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchIcon: { marginRight: spacing.sm },
  searchInput: {
    flex: 1,
    ...typography.body,
    color: colors.text,
    paddingVertical: spacing.md,
  },
  filtros: {
    flexDirection: "row",
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
    alignItems: "center",
  },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { ...typography.caption, color: colors.textSecondary },
  chipTextActive: { color: colors.textInverse },
  secopBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginLeft: "auto",
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  secopText: { ...typography.caption, color: colors.primary },
  list: { paddingHorizontal: spacing.lg, paddingBottom: 80 },
  fab: {
    position: "absolute",
    bottom: spacing.xl,
    right: spacing.xl,
  },
});
