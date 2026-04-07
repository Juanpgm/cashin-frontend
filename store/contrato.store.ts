import type { Contrato, ContratoListItem } from "@/types/models";
import { create } from "zustand";

interface ContratoState {
  contratos: ContratoListItem[];
  selectedContrato: Contrato | null;
  isLoading: boolean;
  error: string | null;
  setContratos: (contratos: ContratoListItem[]) => void;
  addContrato: (contrato: ContratoListItem) => void;
  updateContrato: (id: string, data: Partial<ContratoListItem>) => void;
  removeContrato: (id: string) => void;
  setSelectedContrato: (contrato: Contrato | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useContratoStore = create<ContratoState>((set) => ({
  contratos: [],
  selectedContrato: null,
  isLoading: false,
  error: null,
  setContratos: (contratos) => set({ contratos }),
  addContrato: (contrato) =>
    set((state) => ({ contratos: [contrato, ...state.contratos] })),
  updateContrato: (id, data) =>
    set((state) => ({
      contratos: state.contratos.map((c) =>
        c.id === id ? { ...c, ...data } : c
      ),
    })),
  removeContrato: (id) =>
    set((state) => ({
      contratos: state.contratos.filter((c) => c.id !== id),
    })),
  setSelectedContrato: (contrato) => set({ selectedContrato: contrato }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
}));
