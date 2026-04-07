import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { useAuth } from "@/hooks/useAuth";
import { colors } from "@/theme/colors";
import { borderRadius, spacing } from "@/theme/spacing";
import { typography } from "@/theme/typography";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";

export default function PerfilScreen() {
  const { user, logout, updateProfile, isLoading } = useAuth();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;

  const [editModal, setEditModal] = useState(false);
  const [nombre, setNombre] = useState(user?.nombre ?? "");
  const [telefono, setTelefono] = useState(user?.telefono ?? "");

  const initials =
    user?.nombre
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() ?? "US";

  const handleSaveProfile = async () => {
    try {
      await updateProfile({ nombre, telefono });
      setEditModal(false);
    } catch {}
  };

  const handleLogout = () => {
    Alert.alert("Cerrar sesión", "¿Estás seguro de que quieres cerrar sesión?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Cerrar sesión",
        style: "destructive",
        onPress: logout,
      },
    ]);
  };

  const menuItems = [
    {
      icon: "cloud-download-outline" as const,
      label: "Importar contratos de SECOP",
      description: "Busca y sincroniza tus contratos",
      onPress: () => router.push("/secop" as never),
    },
    {
      icon: "chatbubble-ellipses-outline" as const,
      label: "Asistente IA",
      description: "Habla con el asistente de CashIn",
      onPress: () => router.push("/(tabs)/chat" as never),
    },
    {
      icon: "pencil-outline" as const,
      label: "Editar perfil",
      description: "Actualiza tu nombre y teléfono",
      onPress: () => {
        setNombre(user?.nombre ?? "");
        setTelefono(user?.telefono ?? "");
        setEditModal(true);
      },
    },
    {
      icon: "help-circle-outline" as const,
      label: "Ayuda y soporte",
      description: "Consulta la documentación",
      onPress: () => {},
    },
  ];

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[styles.content, isTablet && styles.contentTablet]}
    >
      {/* Avatar + info */}
      <Card style={styles.profileCard}>
        <View style={styles.avatarWrapper}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <TouchableOpacity
            style={styles.editAvatarBtn}
            onPress={() => {
              setNombre(user?.nombre ?? "");
              setTelefono(user?.telefono ?? "");
              setEditModal(true);
            }}
          >
            <Ionicons name="pencil" size={14} color={colors.textInverse} />
          </TouchableOpacity>
        </View>

        <Text style={styles.name}>{user?.nombre ?? "—"}</Text>
        <Text style={styles.email}>{user?.email ?? "—"}</Text>

        <View style={styles.pillsRow}>
          {user?.cedula && (
            <View style={styles.pill}>
              <Ionicons name="id-card-outline" size={13} color={colors.primary} />
              <Text style={styles.pillText}>CC {user.cedula}</Text>
            </View>
          )}
          {user?.telefono && (
            <View style={styles.pill}>
              <Ionicons name="call-outline" size={13} color={colors.primary} />
              <Text style={styles.pillText}>{user.telefono}</Text>
            </View>
          )}
        </View>
      </Card>

      {/* Menu */}
      <View style={styles.menuSection}>
        {menuItems.map((item) => (
          <TouchableOpacity
            key={item.label}
            style={styles.menuItem}
            onPress={item.onPress}
            activeOpacity={0.7}
          >
            <View style={styles.menuIcon}>
              <Ionicons name={item.icon} size={20} color={colors.primary} />
            </View>
            <View style={styles.menuInfo}>
              <Text style={styles.menuLabel}>{item.label}</Text>
              <Text style={styles.menuDesc}>{item.description}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.disabled} />
          </TouchableOpacity>
        ))}
      </View>

      {/* Logout */}
      <View style={styles.logoutSection}>
        <Button
          title="Cerrar sesión"
          onPress={handleLogout}
          variant="danger"
          fullWidth
          icon={
            <Ionicons name="log-out-outline" size={20} color={colors.textInverse} />
          }
        />
      </View>

      <Text style={styles.version}>CashIn v1.0.0</Text>

      {/* Edit profile modal */}
      <Modal
        visible={editModal}
        transparent
        animationType="slide"
        onRequestClose={() => setEditModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Editar perfil</Text>
              <TouchableOpacity onPress={() => setEditModal(false)}>
                <Ionicons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            <Input
              label="Nombre completo"
              value={nombre}
              onChangeText={setNombre}
              placeholder="Tu nombre completo"
            />
            <Input
              label="Teléfono"
              value={telefono}
              onChangeText={setTelefono}
              placeholder="3001234567"
              keyboardType="phone-pad"
            />

            <View style={styles.modalActions}>
              <Button
                title="Cancelar"
                variant="ghost"
                onPress={() => setEditModal(false)}
              />
              <Button
                title="Guardar"
                onPress={handleSaveProfile}
                loading={isLoading}
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
  contentTablet: { maxWidth: 600, alignSelf: "center", width: "100%" },
  profileCard: { alignItems: "center", padding: spacing.xl, gap: spacing.sm },
  avatarWrapper: { position: "relative", marginBottom: spacing.sm },
  avatar: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { ...typography.h2, color: colors.textInverse, fontWeight: "700" },
  editAvatarBtn: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.secondary,
    alignItems: "center",
    justifyContent: "center",
  },
  name: { ...typography.h3, color: colors.text },
  email: { ...typography.body, color: colors.textSecondary },
  pillsRow: { flexDirection: "row", gap: spacing.sm, flexWrap: "wrap", justifyContent: "center" },
  pill: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.border,
  },
  pillText: { ...typography.caption, color: colors.text },
  menuSection: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    marginTop: spacing.xl,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.border,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    gap: spacing.md,
  },
  menuIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary + "12",
    alignItems: "center",
    justifyContent: "center",
  },
  menuInfo: { flex: 1 },
  menuLabel: { ...typography.bodyBold, color: colors.text },
  menuDesc: { ...typography.caption, color: colors.textSecondary, marginTop: 2 },
  logoutSection: { marginTop: spacing.xl },
  version: {
    ...typography.caption,
    color: colors.disabled,
    textAlign: "center",
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
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  modalTitle: { ...typography.h3, color: colors.text },
  modalActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
});
