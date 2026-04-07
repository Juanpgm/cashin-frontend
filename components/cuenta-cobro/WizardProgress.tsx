import { colors } from "@/theme/colors";
import { spacing } from "@/theme/spacing";
import { typography } from "@/theme/typography";
import Ionicons from "@expo/vector-icons/Ionicons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface WizardProgressProps {
  currentStep: number;
  onStepPress?: (step: number) => void;
}

const STEPS = ["Contrato", "Actividades", "Preview", "Opciones", "Listo"];

export function WizardProgress({
  currentStep,
  onStepPress,
}: WizardProgressProps) {
  return (
    <View style={styles.container}>
      {STEPS.map((label, index) => {
        const stepNumber = index + 1;
        const isCompleted = stepNumber < currentStep;
        const isCurrent = stepNumber === currentStep;
        const isClickable = isCompleted && onStepPress != null;

        return (
          <React.Fragment key={label}>
            {index > 0 && (
              <View
                style={[styles.line, isCompleted && styles.lineCompleted]}
              />
            )}
            <TouchableOpacity
              style={[
                styles.step,
                isCompleted && styles.stepCompleted,
                isCurrent && styles.stepCurrent,
              ]}
              onPress={() => isClickable && onStepPress?.(stepNumber)}
              disabled={!isClickable}
            >
              {isCompleted ? (
                <Ionicons
                  name="checkmark"
                  size={14}
                  color={colors.textInverse}
                />
              ) : (
                <Text
                  style={[styles.stepText, isCurrent && styles.stepTextCurrent]}
                >
                  {stepNumber}
                </Text>
              )}
            </TouchableOpacity>
          </React.Fragment>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.surface,
  },
  step: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.border,
  },
  stepCompleted: { backgroundColor: colors.primary },
  stepCurrent: {
    backgroundColor: colors.primary,
    borderWidth: 2,
    borderColor: colors.primaryDark,
  },
  stepText: {
    ...typography.caption,
    fontWeight: "700",
    color: colors.textSecondary,
  },
  stepTextCurrent: { color: colors.textInverse },
  line: {
    flex: 1,
    height: 2,
    backgroundColor: colors.border,
    marginHorizontal: spacing.xs,
  },
  lineCompleted: { backgroundColor: colors.primary },
});
