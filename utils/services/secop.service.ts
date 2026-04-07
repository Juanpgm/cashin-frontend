import api from "@/utils/api";
import type {
  SecopContrato,
  SecopProceso,
  SecopDocumento,
  SecopImportResult,
  SecopConsultaCompleta,
} from "@/types/models";

const secopService = {
  async buscarContratos(
    cedula: string,
    refresh = false
  ): Promise<SecopContrato[]> {
    const res = await api.get<SecopContrato[]>("/api/v1/secop/contratos", {
      params: { cedula, refresh },
    });
    return res.data;
  },

  async getProceso(
    id_proceso: string,
    refresh = false
  ): Promise<SecopProceso | null> {
    const res = await api.get<SecopProceso | null>(
      `/api/v1/secop/procesos/${id_proceso}`,
      { params: { refresh } }
    );
    return res.data;
  },

  async getDocumentos(
    numero_contrato: string,
    refresh = false
  ): Promise<SecopDocumento[]> {
    const res = await api.get<SecopDocumento[]>(
      `/api/v1/secop/documentos/${numero_contrato}`,
      { params: { refresh } }
    );
    return res.data;
  },

  async importar(
    documento_proveedor: string,
    confirmar = false
  ): Promise<SecopImportResult> {
    const res = await api.post<SecopImportResult>("/api/v1/secop/importar", null, {
      params: { documento_proveedor, confirmar },
    });
    return res.data;
  },

  async sincronizarDocumentos(
    cedula: string,
    confirmar = false
  ): Promise<{ sincronizados: number; errores: number }> {
    const res = await api.post(
      "/api/v1/secop/sincronizar-documentos",
      null,
      { params: { cedula, confirmar } }
    );
    return res.data;
  },

  async consultaCompleta(
    cedula: string,
    refresh = false
  ): Promise<SecopConsultaCompleta> {
    const res = await api.get<SecopConsultaCompleta>("/api/v1/secop/consulta", {
      params: { cedula, refresh },
    });
    return res.data;
  },
};

export default secopService;
