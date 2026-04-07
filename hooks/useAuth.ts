import { useAuthStore } from "@/store/auth.store";
import { useUIStore } from "@/store/ui.store";
import { tokenStorage, ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY, registerLogoutCallback } from "@/utils/api";
import authService from "@/utils/services/auth.service";
import { router } from "expo-router";
import { useCallback, useEffect } from "react";

export function useAuth() {
  const {
    user,
    isAuthenticated,
    isLoading,
    isHydrating,
    setUser,
    logout: storeLogout,
    setLoading,
    setHydrating,
  } = useAuthStore();
  const showToast = useUIStore((s) => s.showToast);

  // Register logout callback for axios interceptor
  useEffect(() => {
    registerLogoutCallback(() => {
      storeLogout();
      router.replace("/(auth)/login" as never);
    });
  }, [storeLogout]);

  // Hydrate session from stored tokens on mount
  const hydrateSession = useCallback(async () => {
    try {
      const token = await tokenStorage.get(ACCESS_TOKEN_KEY);
      if (!token) return;
      const me = await authService.getMe();
      const refreshToken = await tokenStorage.get(REFRESH_TOKEN_KEY);
      setUser(me, token, refreshToken ?? undefined);
    } catch {
      await tokenStorage.del(ACCESS_TOKEN_KEY);
      await tokenStorage.del(REFRESH_TOKEN_KEY);
    } finally {
      setHydrating(false);
    }
  }, [setUser, setHydrating]);

  useEffect(() => {
    hydrateSession();
  }, [hydrateSession]);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const tokens = await authService.login({ email, password });
      await tokenStorage.set(ACCESS_TOKEN_KEY, tokens.access_token);
      await tokenStorage.set(REFRESH_TOKEN_KEY, tokens.refresh_token);
      const me = await authService.getMe();
      setUser(me, tokens.access_token, tokens.refresh_token);
      showToast({ message: `¡Bienvenido, ${me.nombre.split(" ")[0]}!`, type: "success" });
      router.replace("/(tabs)" as never);
    } catch (err: unknown) {
      const detail = (err as { response?: { data?: { detail?: string | { msg: string }[] } } })
        ?.response?.data?.detail;
      const message =
        typeof detail === "string"
          ? detail
          : Array.isArray(detail)
          ? detail.map((d) => d.msg).join(", ")
          : "Credenciales incorrectas. Verifica tu email y contraseña.";
      showToast({ message, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: {
    nombre: string;
    email: string;
    cedula: string;
    telefono: string;
    password: string;
  }) => {
    setLoading(true);
    try {
      await authService.register(data);
      showToast({
        message: "Cuenta creada. Ya puedes iniciar sesión.",
        type: "success",
      });
      router.replace("/(auth)/login" as never);
    } catch (err: unknown) {
      const detail = (err as { response?: { data?: { detail?: string | { msg: string }[] } } })
        ?.response?.data?.detail;
      const message =
        typeof detail === "string"
          ? detail
          : Array.isArray(detail)
          ? detail.map((d) => d.msg).join(", ")
          : "Error al registrar. Intenta de nuevo.";
      showToast({ message, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (data: {
    nombre?: string;
    cedula?: string;
    telefono?: string;
  }) => {
    setLoading(true);
    try {
      const updated = await authService.updateMe(data);
      const token = await tokenStorage.get(ACCESS_TOKEN_KEY);
      const refreshToken = await tokenStorage.get(REFRESH_TOKEN_KEY);
      setUser(updated, token ?? "", refreshToken ?? undefined);
      showToast({ message: "Perfil actualizado", type: "success" });
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail ??
        "Error al actualizar perfil.";
      showToast({ message, type: "error" });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch {
      // ignore — logout anyway
    }
    await tokenStorage.del(ACCESS_TOKEN_KEY);
    await tokenStorage.del(REFRESH_TOKEN_KEY);
    storeLogout();
    router.replace("/(auth)/login" as never);
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    isHydrating,
    login,
    register,
    updateProfile,
    logout,
  };
}
