import { create } from "zustand";

interface ToastData {
  message: string;
  type: "success" | "error" | "info" | "warning";
}

interface UIState {
  toast: ToastData | null;
  isGlobalLoading: boolean;
  showToast: (data: ToastData) => void;
  hideToast: () => void;
  setGlobalLoading: (loading: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  toast: null,
  isGlobalLoading: false,
  showToast: (data) => {
    set({ toast: data });
    setTimeout(() => set({ toast: null }), 3000);
  },
  hideToast: () => set({ toast: null }),
  setGlobalLoading: (isGlobalLoading) => set({ isGlobalLoading }),
}));
