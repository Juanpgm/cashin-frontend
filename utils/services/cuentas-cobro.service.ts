import api from "@/utils/api";
import type {
  CuentaCobro,
  CuentaCobroListItem,
  CuentaCobroCreate,
  Actividad,
  ActividadCreate,
  EstadoCuentaCobro,
  PDFUrlResponse,
  GenerarPDFResponse,
} from "@/types/models";

export interface ActividadesBulkCreate {
  actividades: ActividadCreate[];
}

export interface ActividadesDesdeTextoRequest {
  texto: string;
  obligacion_id?: string;
}

const cuentasCobroService = {
  async list(): Promise<CuentaCobroListItem[]> {
    const res = await api.get<CuentaCobroListItem[]>("/api/v1/cuentas-cobro/");
    return res.data;
  },

  async create(data: CuentaCobroCreate): Promise<CuentaCobro> {
    const res = await api.post<CuentaCobro>("/api/v1/cuentas-cobro/", data);
    return res.data;
  },

  async getById(id: string): Promise<CuentaCobro> {
    const res = await api.get<CuentaCobro>(`/api/v1/cuentas-cobro/${id}`);
    return res.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/api/v1/cuentas-cobro/${id}`);
  },

  async addActividad(
    cuentaId: string,
    data: ActividadCreate
  ): Promise<Actividad> {
    const res = await api.post<Actividad>(
      `/api/v1/cuentas-cobro/${cuentaId}/actividades`,
      data
    );
    return res.data;
  },

  async bulkActividades(
    cuentaId: string,
    actividades: ActividadCreate[]
  ): Promise<Actividad[]> {
    const res = await api.post<{ actividades: Actividad[] }>(
      `/api/v1/cuentas-cobro/${cuentaId}/actividades/bulk`,
      { actividades }
    );
    return res.data.actividades;
  },

  async actividadesDesdeTexto(
    cuentaId: string,
    data: ActividadesDesdeTextoRequest
  ): Promise<Actividad[]> {
    const res = await api.post<{ actividades: Actividad[] }>(
      `/api/v1/cuentas-cobro/${cuentaId}/actividades/desde-texto`,
      data
    );
    return res.data.actividades;
  },

  async generarActividades(cuentaId: string): Promise<Actividad[]> {
    const res = await api.post<{ actividades: Actividad[] }>(
      `/api/v1/cuentas-cobro/${cuentaId}/actividades/generar`
    );
    return res.data.actividades;
  },

  async cambiarEstado(
    cuentaId: string,
    nuevo_estado: EstadoCuentaCobro,
    observaciones?: string
  ): Promise<CuentaCobro> {
    const res = await api.patch<CuentaCobro>(
      `/api/v1/cuentas-cobro/${cuentaId}/estado`,
      { nuevo_estado, observaciones }
    );
    return res.data;
  },

  async generarPDF(cuentaId: string): Promise<GenerarPDFResponse> {
    const res = await api.post<GenerarPDFResponse>(
      `/api/v1/cuentas-cobro/${cuentaId}/generar-pdf`
    );
    return res.data;
  },

  async getPDFUrl(cuentaId: string): Promise<PDFUrlResponse> {
    const res = await api.get<PDFUrlResponse>(
      `/api/v1/cuentas-cobro/${cuentaId}/pdf`
    );
    return res.data;
  },
};

export default cuentasCobroService;
