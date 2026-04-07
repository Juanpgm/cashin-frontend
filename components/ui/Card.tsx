import { colors } from "@/theme/colors";
import { borderRadius, spacing } from "@/theme/spacing";
import React from "react";
import {
    StyleProp,
    StyleSheet,
    TouchableOpacity,
    View,
    ViewStyle,
} from "react-native";

interface CardProps {
  children: React.ReactNode;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  padding?: keyof typeof spacing;
}

export function Card({ children, onPress, style, padding = "lg" }: CardProps) {
  const content = (
    <View style={[styles.card, { padding: spacing[padding] }, style]}>
      {children}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        {content}
      </TouchableOpacity>
    );
  }

  return content;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
});
