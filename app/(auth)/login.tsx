import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAuth } from "@/hooks/useAuth";
import { colors } from "@/theme/colors";
import { spacing } from "@/theme/spacing";
import { typography } from "@/theme/typography";
import { Link } from "expo-router";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";

interface LoginForm {
  email: string;
  password: string;
}

export default function LoginScreen() {
  const { login, isLoading } = useAuth();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data: LoginForm) => {
    if (!data.email || !data.password) return;
    await login(data.email, data.password);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={styles.logo}>💰 CashIn</Text>
          <Text style={styles.subtitle}>Gestión de cuentas de cobro</Text>
        </View>

        <View>
          <Text style={styles.title}>Iniciar sesión</Text>

          <Controller
            control={control}
            name="email"
            rules={{ required: "El correo es requerido" }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Correo electrónico"
                placeholder="tu@correo.com"
                keyboardType="email-address"
                autoCapitalize="none"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.email?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="password"
            rules={{
              required: "La contraseña es requerida",
              minLength: { value: 6, message: "Mínimo 6 caracteres" },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Contraseña"
                placeholder="••••••••"
                secureTextEntry
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.password?.message}
              />
            )}
          />

          <Button
            title="Iniciar sesión"
            onPress={handleSubmit(onSubmit)}
            loading={isLoading}
            fullWidth
            size="lg"
          />

          <View style={styles.footer}>
            <Text style={styles.footerText}>¿No tienes cuenta? </Text>
            <Link href={"/(auth)/register" as never} style={styles.link}>
              Regístrate
            </Link>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surface },
  scroll: {
    flexGrow: 1,
    justifyContent: "center",
    padding: spacing.xl,
    maxWidth: 440,
    width: "100%",
    alignSelf: "center",
  },
  header: { alignItems: "center", marginBottom: spacing.xxxl },
  logo: { fontSize: 40, fontWeight: "700", color: colors.primary },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: spacing.sm,
  },
  title: { ...typography.h2, color: colors.text, marginBottom: spacing.xl },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: spacing.xl,
  },
  footerText: { ...typography.body, color: colors.textSecondary },
  link: { ...typography.bodyBold, color: colors.primary },
});
