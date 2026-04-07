import { colors } from "@/theme/colors";
import { borderRadius } from "@/theme/spacing";
import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, ViewStyle } from "react-native";

interface SkeletonProps {
  width?: number | string;
  height?: number;
  style?: ViewStyle;
}

export function Skeleton({
  width = "100%",
  height = 16,
  style,
}: SkeletonProps) {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.7,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
    );
    animation.start();
    return () => animation.stop();
  }, []);

  return (
    <Animated.View
      style={[
        styles.skeleton,
        {
          width: width as number,
          height,
          borderRadius: borderRadius.md,
          opacity,
        },
        style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  skeleton: { backgroundColor: colors.border },
});
