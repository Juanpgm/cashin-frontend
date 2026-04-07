import type { User } from "@/types/models";
import { create } from "zustand";

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isHydrating: boolean;
  setUser: (user: User, accessToken: string, refreshToken?: string) => void;
  setTokens: (accessToken: string, refreshToken: string) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
  setHydrating: (hydrating: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: false,
  isHydrating: true,
  setUser: (user, accessToken, refreshToken = undefined) =>
    set({ user, accessToken, refreshToken, isAuthenticated: true }),
  setTokens: (accessToken, refreshToken) =>
    set({ accessToken, refreshToken }),
  logout: () =>
    set({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
    }),
  setLoading: (isLoading) => set({ isLoading }),
  setHydrating: (isHydrating) => set({ isHydrating }),
}));
