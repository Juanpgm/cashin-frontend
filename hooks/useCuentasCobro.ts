import { useCuentaCobroStore } from "@/store/cuenta-cobro.store";
import { useUIStore } from "@/store/ui.store";
import cuentasCobroService from "@/utils/services/cuentas-cobro.service";
import type { CuentaCobroCreate, EstadoCuentaCobro } from "@/types/models";
import { useCallback } from "react";

export function useCuentasCobro() {
  const {
    cuentas,
    isLoading,
    error,
    setCuentas,
    addCuenta,
    updateCuenta,
    removeCuenta,
    setLoading,
    setError,
  } = useCuentaCobroStore();
  const showToast = useUIStore((s) => s.showToast);

  const loadCuentas = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await cuentasCobroService.list();
      setCuentas(data);
    } catch {
      setError("No se pudieron cargar las cuentas de cobro.");
      showToast({ message: "Error al cargar cuentas", type: "error" });
    } finally {
      setLoading(false);
    }
  }, [setCuentas, setLoading, setError, showToast]);

  const createCuenta = async (data: CuentaCobroCreate) => {
    setLoading(true);
    try {
      const nueva = await cuentasCobroService.create(data);
      addCuenta(nueva);
      showToast({ message: "Cuenta de cobro creada (10 créditos usados)", type: "success" });
      return nueva;
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail ??
        "Error al crear la cuenta de cobro";
      showToast({ message: msg, type: "error" });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const cambiarEstado = async (
    id: string,
    estado: EstadoCuentaCobro,
    observaciones?: string
  ) => {
    try {
      const updated = await cuentasCobroService.cambiarEstado(
        id,
        estado,
        observaciones
      );
      updateCuenta(id, updated);
      showToast({
        message: `Estado cambiado a: ${estado}`,
        type: "success",
      });
      return updated;
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail ??
        "Error al cambiar estado";
      showToast({ message: msg, type: "error" });
      throw err;
    }
  };

  const eliminarCuenta = async (id: string) => {
    try {
      await cuentasCobroService.delete(id);
      removeCuenta(id);
      showToast({ message: "Cuenta eliminada", type: "success" });
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail ??
        "Solo se pueden eliminar cuentas en borrador";
      showToast({ message: msg, type: "error" });
      throw err;
    }
  };

  const generarPDF = async (id: string) => {
    try {
      const result = await cuentasCobroService.generarPDF(id);
      updateCuenta(id, { pdf_url: result.pdf_url });
      showToast({ message: "PDF generado exitosamente", type: "success" });
      return result;
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail ??
        "Error al generar el PDF";
      showToast({ message: msg, type: "error" });
      throw err;
    }
  };

  const getPDFUrl = async (id: string) => {
    try {
      return await cuentasCobroService.getPDFUrl(id);
    } catch {
      showToast({ message: "Error al obtener URL del PDF", type: "error" });
      throw new Error("PDF not available");
    }
  };

  return {
    cuentas,
    isLoading,
    error,
    loadCuentas,
    createCuenta,
    cambiarEstado,
    eliminarCuenta,
    generarPDF,
    getPDFUrl,
  };
}
