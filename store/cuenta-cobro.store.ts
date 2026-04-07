import type { CuentaCobro, CuentaCobroListItem, Actividad } from "@/types/models";
import { create } from "zustand";

interface WizardState {
  paso: number;
  cuentaId: string | null;
  contratoId: string | null;
  mes: number | null;
  anio: number | null;
  actividades: Actividad[];
}

interface CuentaCobroState {
  cuentas: CuentaCobroListItem[];
  selectedCuenta: CuentaCobro | null;
  isLoading: boolean;
  error: string | null;
  wizard: WizardState;
  setCuentas: (cuentas: CuentaCobroListItem[]) => void;
  addCuenta: (cuenta: CuentaCobroListItem) => void;
  updateCuenta: (id: string, data: Partial<CuentaCobro>) => void;
  removeCuenta: (id: string) => void;
  setSelectedCuenta: (cuenta: CuentaCobro | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setWizardPaso: (paso: number) => void;
  setWizardContrato: (contratoId: string, mes: number, anio: number) => void;
  setWizardCuentaId: (cuentaId: string) => void;
  setWizardActividades: (actividades: Actividad[]) => void;
  addWizardActividad: (actividad: Actividad) => void;
  removeWizardActividad: (actividadId: string) => void;
  resetWizard: () => void;
}

const initialWizard: WizardState = {
  paso: 1,
  cuentaId: null,
  contratoId: null,
  mes: null,
  anio: null,
  actividades: [],
};

export const useCuentaCobroStore = create<CuentaCobroState>((set) => ({
  cuentas: [],
  selectedCuenta: null,
  isLoading: false,
  error: null,
  wizard: initialWizard,
  setCuentas: (cuentas) => set({ cuentas }),
  addCuenta: (cuenta) =>
    set((state) => ({ cuentas: [cuenta, ...state.cuentas] })),
  updateCuenta: (id, data) =>
    set((state) => ({
      cuentas: state.cuentas.map((c) =>
        c.id === id ? { ...c, ...data } : c
      ),
      selectedCuenta:
        state.selectedCuenta?.id === id
          ? { ...state.selectedCuenta, ...data }
          : state.selectedCuenta,
    })),
  removeCuenta: (id) =>
    set((state) => ({
      cuentas: state.cuentas.filter((c) => c.id !== id),
    })),
  setSelectedCuenta: (cuenta) => set({ selectedCuenta: cuenta }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  setWizardPaso: (paso) =>
    set((state) => ({ wizard: { ...state.wizard, paso } })),
  setWizardContrato: (contratoId, mes, anio) =>
    set((state) => ({ wizard: { ...state.wizard, contratoId, mes, anio } })),
  setWizardCuentaId: (cuentaId) =>
    set((state) => ({ wizard: { ...state.wizard, cuentaId } })),
  setWizardActividades: (actividades) =>
    set((state) => ({ wizard: { ...state.wizard, actividades } })),
  addWizardActividad: (actividad) =>
    set((state) => ({
      wizard: {
        ...state.wizard,
        actividades: [...state.wizard.actividades, actividad],
      },
    })),
  removeWizardActividad: (actividadId) =>
    set((state) => ({
      wizard: {
        ...state.wizard,
        actividades: state.wizard.actividades.filter(
          (a) => a.id !== actividadId
        ),
      },
    })),
  resetWizard: () => set({ wizard: initialWizard }),
}));
