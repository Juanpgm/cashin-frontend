import { CuentaCobroCard } from "@/components/cuenta-cobro/CuentaCobroCard";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/Skeleton";
import { useCuentasCobro } from "@/hooks/useCuentasCobro";
import { colors } from "@/theme/colors";
import { borderRadius, spacing } from "@/theme/spacing";
import { typography } from "@/theme/typography";
import type { EstadoCuentaCobro } from "@/types/models";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type Filtro = "todos" | EstadoCuentaCobro;

const FILTROS: { key: Filtro; label: string }[] = [
  { key: "todos", label: "Todas" },
  { key: "borrador", label: "Borrador" },
  { key: "enviada", label: "Enviada" },
  { key: "en_revision", label: "En revisión" },
  { key: "aprobada", label: "Aprobada" },
  { key: "rechazada", label: "Rechazada" },
  { key: "pagada", label: "Pagada" },
];

export default function CuentasScreen() {
  const router = useRouter();
  const { cuentas, isLoading, loadCuentas } = useCuentasCobro();
  const [filtro, setFiltro] = useState<Filtro>("todos");
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    loadCuentas();
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadCuentas();
    setIsRefreshing(false);
  };

  const cuentasFiltradas =
    filtro === "todos" ? cuentas : cuentas.filter((c) => c.estado === filtro);

  if (isLoading && cuentas.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.skeletonContainer}>
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} height={90} style={{ marginBottom: spacing.md }} />
          ))}
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={cuentasFiltradas}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            colors={[colors.primary]}
          />
        }
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.title}>Mis cuentas de cobro</Text>
            <View style={styles.filterScroll}>
              {FILTROS.map((f) => {
                const count =
                  f.key === "todos"
                    ? cuentas.length
                    : cuentas.filter((c) => c.estado === f.key).length;
                if (count === 0 && f.key !== "todos") return null;
                return (
                  <TouchableOpacity
                    key={f.key}
                    style={[styles.chip, filtro === f.key && styles.chipActive]}
                    onPress={() => setFiltro(f.key)}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        filtro === f.key && styles.chipTextActive,
                      ]}
                    >
                      {f.label}
                    </Text>
                    {count > 0 && (
                      <View
                        style={[
                          styles.countBadge,
                          filtro === f.key && styles.countBadgeActive,
                        ]}
                      >
                        <Text
                          style={[
                            styles.countText,
                            filtro === f.key && styles.countTextActive,
                          ]}
                        >
                          {count}
                        </Text>
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        }
        renderItem={({ item }) => (
          <CuentaCobroCard
            cuenta={item}
            onPress={() => router.push(`/cuenta-cobro/${item.id}` as never)}
          />
        )}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <EmptyState
            icon="receipt-outline"
            title="Sin cuentas de cobro"
            description={
              filtro === "todos"
                ? "Genera tu primera cuenta de cobro"
                : `No tienes cuentas en estado "${filtro}"`
            }
            actionLabel={filtro === "todos" ? "Generar cuenta" : "Ver todas"}
            onAction={
              filtro === "todos"
                ? () => router.push("/cuenta-cobro/wizard/paso1-contrato" as never)
                : () => setFiltro("todos")
            }
          />
        }
      />

      <View style={styles.fab}>
        <Button
          title="Nueva cuenta"
          onPress={() =>
            router.push("/cuenta-cobro/wizard/paso1-contrato" as never)
          }
          icon={<Ionicons name="add" size={20} color={colors.textInverse} />}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  skeletonContainer: { padding: spacing.lg },
  header: { marginBottom: spacing.md },
  title: {
    ...typography.h2,
    color: colors.text,
    marginBottom: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },
  filterScroll: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
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
  countBadge: {
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
  },
  countBadgeActive: { backgroundColor: "rgba(255,255,255,0.3)" },
  countText: { ...typography.caption, fontSize: 10, color: colors.textSecondary },
  countTextActive: { color: colors.textInverse },
  list: { paddingHorizontal: spacing.lg, paddingBottom: 80 },
  fab: {
    position: "absolute",
    bottom: spacing.xl,
    right: spacing.xl,
  },
});
