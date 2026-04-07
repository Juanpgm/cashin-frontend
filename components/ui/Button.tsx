import { colors } from "@/theme/colors";
import { borderRadius, spacing } from "@/theme/spacing";
import { typography } from "@/theme/typography";
import React from "react";
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    TextStyle,
    TouchableOpacity,
    ViewStyle,
} from "react-native";

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
}

const variantBg: Record<string, ViewStyle> = {
  primary: { backgroundColor: colors.primary },
  secondary: { backgroundColor: colors.secondary },
  outline: {
    backgroundColor: "transparent",
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  ghost: { backgroundColor: "transparent" },
  danger: { backgroundColor: colors.error },
};

const variantText: Record<string, TextStyle> = {
  primary: { color: colors.textInverse },
  secondary: { color: colors.textInverse },
  outline: { color: colors.primary },
  ghost: { color: colors.primary },
  danger: { color: colors.textInverse },
};

const sizePad: Record<string, ViewStyle> = {
  sm: { paddingVertical: spacing.sm, paddingHorizontal: spacing.md },
  md: { paddingVertical: spacing.md, paddingHorizontal: spacing.lg },
  lg: { paddingVertical: spacing.lg, paddingHorizontal: spacing.xl },
};

const sizeFont: Record<string, TextStyle> = {
  sm: { fontSize: 12 },
  md: { fontSize: 14 },
  lg: { fontSize: 16 },
};

export function Button({
  title,
  onPress,
  variant = "primary",
  size = "md",
  loading,
  disabled,
  fullWidth,
  icon,
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      style={[
        styles.base,
        variantBg[variant],
        sizePad[size],
        fullWidth && styles.fullWidth,
        isDisabled && styles.disabled,
      ]}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator
          color={
            variant === "outline" || variant === "ghost"
              ? colors.primary
              : colors.textInverse
          }
          size="small"
        />
      ) : (
        <>
          {icon}
          <Text
            style={[
              styles.text,
              variantText[variant],
              sizeFont[size],
              icon != null && { marginLeft: spacing.sm },
            ]}
          >
            {title}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: borderRadius.md,
  },
  fullWidth: { width: "100%" },
  disabled: { opacity: 0.5 },
  text: { ...typography.button, textAlign: "center" },
});
