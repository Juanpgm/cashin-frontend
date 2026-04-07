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

interface RegisterForm {
  nombre: string;
  cedula: string;
  email: string;
  telefono: string;
  password: string;
  confirmPassword: string;
}

export default function RegisterScreen() {
  const { register: registerUser, isLoading } = useAuth();
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<RegisterForm>({
    defaultValues: {
      nombre: "",
      cedula: "",
      email: "",
      telefono: "",
      password: "",
      confirmPassword: "",
    },
  });

  const password = watch("password");

  const onSubmit = async (data: RegisterForm) => {
    await registerUser(data);
    // Navigation to login is handled inside useAuth.register
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
        </View>

        <Text style={styles.title}>Crear cuenta</Text>

        <Controller
          control={control}
          name="nombre"
          rules={{
            required: "El nombre es requerido",
            minLength: { value: 3, message: "Mínimo 3 caracteres" },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="Nombre completo"
              placeholder="Carlos Andrés Muñoz"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.nombre?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="cedula"
          rules={{
            required: "La cédula es requerida",
            minLength: { value: 6, message: "Cédula inválida" },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="Número de cédula"
              placeholder="1144567890"
              keyboardType="numeric"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.cedula?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="email"
          rules={{
            required: "El correo es requerido",
            pattern: { value: /^\S+@\S+\.\S+$/, message: "Correo inválido" },
          }}
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
          name="telefono"
          rules={{
            required: "El teléfono es requerido",
            minLength: { value: 10, message: "Teléfono inválido" },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="Teléfono"
              placeholder="3001234567"
              keyboardType="phone-pad"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.telefono?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="password"
          rules={{
            required: "La contraseña es requerida",
            minLength: { value: 8, message: "Mínimo 8 caracteres" },
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

        <Controller
          control={control}
          name="confirmPassword"
          rules={{
            required: "Confirma tu contraseña",
            validate: (v) => v === password || "Las contraseñas no coinciden",
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="Confirmar contraseña"
              placeholder="••••••••"
              secureTextEntry
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.confirmPassword?.message}
            />
          )}
        />

        <Button
          title="Registrarse"
          onPress={handleSubmit(onSubmit)}
          loading={isLoading}
          fullWidth
          size="lg"
        />

        <View style={styles.footer}>
          <Text style={styles.footerText}>¿Ya tienes cuenta? </Text>
          <Link href={"/(auth)/login" as never} style={styles.link}>
            Inicia sesión
          </Link>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surface },
  scroll: {
    flexGrow: 1,
    padding: spacing.xl,
    maxWidth: 440,
    width: "100%",
    alignSelf: "center",
    paddingTop: spacing.xxxl,
  },
  header: { alignItems: "center", marginBottom: spacing.xl },
  logo: { fontSize: 36, fontWeight: "700", color: colors.primary },
  title: { ...typography.h2, color: colors.text, marginBottom: spacing.xl },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: spacing.xl,
    paddingBottom: spacing.xxl,
  },
  footerText: { ...typography.body, color: colors.textSecondary },
  link: { ...typography.bodyBold, color: colors.primary },
});
