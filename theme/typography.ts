import { Platform } from "react-native";

const fontFamily = Platform.select({
  web: "Inter, system-ui, -apple-system, sans-serif",
  default: undefined,
});

export const typography = {
  h1: { fontSize: 28, fontWeight: "700" as const, lineHeight: 36, fontFamily },
  h2: { fontSize: 24, fontWeight: "700" as const, lineHeight: 32, fontFamily },
  h3: { fontSize: 20, fontWeight: "600" as const, lineHeight: 28, fontFamily },
  subtitle: {
    fontSize: 16,
    fontWeight: "600" as const,
    lineHeight: 24,
    fontFamily,
  },
  body: {
    fontSize: 14,
    fontWeight: "400" as const,
    lineHeight: 22,
    fontFamily,
  },
  bodyBold: {
    fontSize: 14,
    fontWeight: "600" as const,
    lineHeight: 22,
    fontFamily,
  },
  caption: {
    fontSize: 12,
    fontWeight: "400" as const,
    lineHeight: 18,
    fontFamily,
  },
  button: {
    fontSize: 14,
    fontWeight: "600" as const,
    lineHeight: 20,
    fontFamily,
    letterSpacing: 0.5,
  },
} as const;
