import { useAuthStore } from "@/store/auth.store";

// The API doesn't expose user roles; this hook provides basic auth state helpers
export function usePermissions() {
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return {
    isAuthenticated,
    isLoggedIn: !!user,
    user,
  };
}
