import { useContratoStore } from "@/store/contrato.store";
import { useUIStore } from "@/store/ui.store";
import contratosService from "@/utils/services/contratos.service";
import type { ContratoCreate, ContratoUpdate } from "@/types/models";
import { useCallback } from "react";

export function useContratos() {
  const {
    contratos,
    isLoading,
    error,
    setContratos,
    addContrato,
    updateContrato,
    removeContrato,
    setLoading,
    setError,
  } = useContratoStore();
  const showToast = useUIStore((s) => s.showToast);

  const loadContratos = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await contratosService.list();
      setContratos(data);
    } catch {
      setError("No se pudieron cargar los contratos.");
      showToast({ message: "Error al cargar contratos", type: "error" });
    } finally {
      setLoading(false);
    }
  }, [setContratos, setLoading, setError, showToast]);

  const createContrato = async (data: ContratoCreate) => {
    setLoading(true);
    try {
      const nuevo = await contratosService.create(data);
      addContrato(nuevo);
      showToast({ message: "Contrato creado exitosamente", type: "success" });
      return nuevo;
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail ??
        "Error al crear el contrato";
      showToast({ message: msg, type: "error" });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const editContrato = async (id: string, data: ContratoUpdate) => {
    try {
      const updated = await contratosService.update(id, data);
      updateContrato(id, updated);
      showToast({ message: "Contrato actualizado", type: "success" });
      return updated;
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail ??
        "Error al actualizar contrato";
      showToast({ message: msg, type: "error" });
      throw err;
    }
  };

  const deleteContrato = async (id: string) => {
    try {
      await contratosService.delete(id);
      removeContrato(id);
      showToast({ message: "Contrato eliminado", type: "success" });
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail ??
        "No se puede eliminar: tiene cuentas activas";
      showToast({ message: msg, type: "error" });
      throw err;
    }
  };

  return {
    contratos,
    isLoading,
    error,
    loadContratos,
    createContrato,
    editContrato,
    deleteContrato,
  };
}
