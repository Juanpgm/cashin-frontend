import { useUIStore } from "@/store/ui.store";
import { colors } from "@/theme/colors";
import { borderRadius, spacing } from "@/theme/spacing";
import { typography } from "@/theme/typography";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

const toastColors = {
  success: colors.success,
  error: colors.error,
  info: colors.info,
  warning: colors.warning,
};

export function Toast() {
  const toast = useUIStore((s) => s.toast);

  if (!toast) return null;

  return (
    <View style={styles.wrapper} pointerEvents="none">
      <View
        style={[styles.toast, { backgroundColor: toastColors[toast.type] }]}
      >
        <Text style={styles.text}>{toast.message}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    top: 60,
    left: spacing.lg,
    right: spacing.lg,
    zIndex: 9999,
    alignItems: "center",
  },
  toast: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  text: { ...typography.body, color: colors.textInverse, textAlign: "center" },
});
