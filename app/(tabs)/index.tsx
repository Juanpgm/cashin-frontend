import { EstadoBadge } from "@/components/cuenta-cobro/EstadoBadge";
import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { useAuth } from "@/hooks/useAuth";
import { useContratos } from "@/hooks/useContratos";
import { useCuentasCobro } from "@/hooks/useCuentasCobro";
import { colors } from "@/theme/colors";
import { borderRadius, spacing } from "@/theme/spacing";
import { typography } from "@/theme/typography";
import { formatCOP, formatPeriodo } from "@/utils/formatters";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { contratos, isLoading: loadingC, loadContratos } = useContratos();
  const { cuentas, isLoading: loadingCC, loadCuentas } = useCuentasCobro();
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;
  const [refreshing, setRefreshing] = React.useState(false);

  useEffect(() => {
    loadContratos();
    loadCuentas();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([loadContratos(), loadCuentas()]);
    setRefreshing(false);
  };

  const isLoading = loadingC || loadingCC;
  const contratosActivos = contratos.filter((c) => c.activo).length;
  const cuentasPendientes = cuentas.filter((c) =>
    ["borrador", "enviada", "en_revision"].includes(c.estado)
  ).length;
  const cuentasRechazadas = cuentas.filter((c) => c.estado === "rechazada").length;
  const ultimaCuenta = cuentas[0];

  const quickActions = [
    {
      icon: "receipt-outline" as const,
      label: "Nueva cuenta",
      color: colors.primary,
      onPress: () => router.push("/cuenta-cobro/wizard/paso1-contrato" as never),
    },
    {
      icon: "document-text-outline" as const,
      label: "Contratos",
      color: colors.secondary,
      onPress: () => router.push("/(tabs)/contratos" as never),
    },
    {
      icon: "cloud-download-outline" as const,
      label: "SECOP",
      color: colors.info,
      onPress: () => router.push("/secop" as never),
    },
    {
      icon: "chatbubble-ellipses-outline" as const,
      label: "Asistente",
      color: colors.success,
      onPress: () => router.push("/(tabs)/chat" as never),
    },
  ];

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[styles.content, isTablet && styles.contentTablet]}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={handleRefresh}
          colors={[colors.primary]}
        />
      }
    >
      {/* Greeting */}
      <View style={styles.greetingRow}>
        <View>
          <Text style={styles.greeting}>
            Hola, {user?.nombre?.split(" ")[0] ?? "Contratista"} 👋
          </Text>
          <Text style={styles.subGreeting}>Aquí tienes tu resumen</Text>
        </View>
        <TouchableOpacity
          onPress={() => router.push("/(tabs)/chat" as never)}
          style={styles.aiBtn}
        >
          <Ionicons name="sparkles" size={20} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Stats */}
      {isLoading && contratos.length === 0 ? (
        <View style={styles.statsRow}>
          <Skeleton height={90} style={{ flex: 1 }} />
          <Skeleton height={90} style={{ flex: 1 }} />
          {cuentasRechazadas > 0 && <Skeleton height={90} style={{ flex: 1 }} />}
        </View>
      ) : (
        <View style={styles.statsRow}>
          <Card style={styles.statCard}>
            <Ionicons name="document-text" size={26} color={colors.primary} />
            <Text style={styles.statNumber}>{contratosActivos}</Text>
            <Text style={styles.statLabel}>Contratos{"\n"}activos</Text>
          </Card>
          <Card style={styles.statCard}>
            <Ionicons name="time" size={26} color={colors.warning} />
            <Text style={[styles.statNumber, { color: colors.warning }]}>
              {cuentasPendientes}
            </Text>
            <Text style={styles.statLabel}>Cuentas{"\n"}pendientes</Text>
          </Card>
          {cuentasRechazadas > 0 && (
            <Card style={styles.statCard}>
              <Ionicons name="close-circle" size={26} color={colors.error} />
              <Text style={[styles.statNumber, { color: colors.error }]}>
                {cuentasRechazadas}
              </Text>
              <Text style={styles.statLabel}>Rechazadas{"\n"}a corregir</Text>
            </Card>
          )}
        </View>
      )}

      {/* Alert: rechazadas */}
      {cuentasRechazadas > 0 && (
        <TouchableOpacity
          style={styles.alertBanner}
          onPress={() => router.push("/(tabs)/cuentas" as never)}
        >
          <Ionicons name="alert-circle" size={18} color={colors.error} />
          <Text style={styles.alertText}>
            Tienes {cuentasRechazadas} cuenta
            {cuentasRechazadas !== 1 ? "s" : ""} rechazada
            {cuentasRechazadas !== 1 ? "s" : ""} que necesita
            {cuentasRechazadas !== 1 ? "n" : ""} corrección
          </Text>
          <Ionicons name="chevron-forward" size={16} color={colors.error} />
        </TouchableOpacity>
      )}

      {/* Quick actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Accesos rápidos</Text>
        <View style={[styles.quickGrid, isTablet && styles.quickGridTablet]}>
          {quickActions.map((action) => (
            <TouchableOpacity
              key={action.label}
              style={styles.quickAction}
              onPress={action.onPress}
              activeOpacity={0.7}
            >
              <View
                style={[
                  styles.quickIcon,
                  { backgroundColor: action.color + "15" },
                ]}
              >
                <Ionicons name={action.icon} size={24} color={action.color} />
              </View>
              <Text style={styles.quickLabel}>{action.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Última cuenta */}
      {ultimaCuenta && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Última cuenta de cobro</Text>
          <Card
            onPress={() =>
              router.push(`/cuenta-cobro/${ultimaCuenta.id}` as never)
            }
          >
            <View style={styles.lastCuentaHeader}>
              <Text style={styles.lastCuentaContrato}>
                {ultimaCuenta.contrato_numero ?? "—"}
              </Text>
              <EstadoBadge estado={ultimaCuenta.estado} />
            </View>
            <Text style={styles.lastCuentaPeriodo}>
              {formatPeriodo(ultimaCuenta.mes, ultimaCuenta.anio)}
            </Text>
            {ultimaCuenta.valor != null && (
              <Text style={styles.lastCuentaValor}>
                {formatCOP(ultimaCuenta.valor)}
              </Text>
            )}
          </Card>
        </View>
      )}

      {/* Empty state */}
      {!isLoading && contratos.length === 0 && (
        <Card style={styles.onboardingCard}>
          <Ionicons name="rocket-outline" size={36} color={colors.primary} />
          <Text style={styles.onboardingTitle}>¡Bienvenido a CashIn!</Text>
          <Text style={styles.onboardingDesc}>
            Importa tus contratos desde SECOP para empezar a generar cuentas de cobro con IA.
          </Text>
          <TouchableOpacity
            style={styles.onboardingBtn}
            onPress={() => router.push("/secop" as never)}
          >
            <Text style={styles.onboardingBtnText}>Importar contratos de SECOP</Text>
            <Ionicons name="arrow-forward" size={16} color={colors.primary} />
          </TouchableOpacity>
        </Card>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingBottom: spacing.xxxl },
  contentTablet: { maxWidth: 720, alignSelf: "center", width: "100%" },
  greetingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: spacing.xl,
  },
  greeting: { ...typography.h2, color: colors.text },
  subGreeting: { ...typography.body, color: colors.textSecondary, marginTop: 2 },
  aiBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary + "15",
    alignItems: "center",
    justifyContent: "center",
  },
  statsRow: { flexDirection: "row", gap: spacing.md, marginBottom: spacing.lg },
  statCard: { flex: 1, alignItems: "center", padding: spacing.md, gap: spacing.xs },
  statNumber: { ...typography.h1, color: colors.text },
  statLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    textAlign: "center",
  },
  alertBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    backgroundColor: colors.error + "10",
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.error + "30",
  },
  alertText: { ...typography.caption, color: colors.error, flex: 1 },
  section: { marginBottom: spacing.xl },
  sectionTitle: {
    ...typography.h3,
    color: colors.text,
    marginBottom: spacing.md,
  },
  quickGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.md,
  },
  quickGridTablet: { gap: spacing.lg },
  quickAction: {
    width: "22%",
    minWidth: 72,
    alignItems: "center",
    gap: spacing.sm,
  },
  quickIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  quickLabel: {
    ...typography.caption,
    color: colors.text,
    textAlign: "center",
    fontWeight: "500",
  },
  lastCuentaHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.xs,
  },
  lastCuentaContrato: { ...typography.bodyBold, color: colors.primary },
  lastCuentaPeriodo: { ...typography.body, color: colors.text },
  lastCuentaValor: {
    ...typography.h3,
    color: colors.text,
    marginTop: spacing.xs,
  },
  onboardingCard: {
    alignItems: "center",
    gap: spacing.md,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: colors.primary + "30",
    borderStyle: "dashed",
  },
  onboardingTitle: { ...typography.h3, color: colors.text },
  onboardingDesc: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: 22,
  },
  onboardingBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  onboardingBtnText: { ...typography.bodyBold, color: colors.primary },
});
