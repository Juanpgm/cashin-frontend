import { borderRadius, spacing } from "@/theme/spacing";
import { typography } from "@/theme/typography";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface BadgeProps {
  label: string;
  color: string;
}

export function Badge({ label, color }: BadgeProps) {
  return (
    <View style={[styles.badge, { backgroundColor: color + "20" }]}>
      <Text style={[styles.text, { color }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    alignSelf: "flex-start",
  },
  text: {
    ...typography.caption,
    fontWeight: "600",
  },
});
