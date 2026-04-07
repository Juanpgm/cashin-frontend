import api from "@/utils/api";
import type {
  Contrato,
  ContratoListItem,
  ContratoCreate,
  ContratoUpdate,
  ContratoConfiguracion,
  PeriodoPendiente,
  Obligacion,
  ObligacionCreate,
} from "@/types/models";

const contratosService = {
  async list(): Promise<ContratoListItem[]> {
    const res = await api.get<ContratoListItem[]>("/api/v1/contratos/");
    return res.data;
  },

  async create(data: ContratoCreate): Promise<Contrato> {
    const res = await api.post<Contrato>("/api/v1/contratos/", data);
    return res.data;
  },

  async getById(id: string): Promise<Contrato> {
    const res = await api.get<Contrato>(`/api/v1/contratos/${id}`);
    return res.data;
  },

  async update(id: string, data: ContratoUpdate): Promise<Contrato> {
    const res = await api.patch<Contrato>(`/api/v1/contratos/${id}`, data);
    return res.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/api/v1/contratos/${id}`);
  },

  async getConfiguracion(id: string): Promise<ContratoConfiguracion> {
    const res = await api.get<ContratoConfiguracion>(
      `/api/v1/contratos/${id}/configuracion`
    );
    return res.data;
  },

  async getPeriodosPendientes(id: string): Promise<PeriodoPendiente[]> {
    const res = await api.get<PeriodoPendiente[]>(
      `/api/v1/contratos/${id}/periodos-pendientes`
    );
    return res.data;
  },

  async addObligacion(
    contratoId: string,
    data: ObligacionCreate
  ): Promise<Obligacion> {
    const res = await api.post<Obligacion>(
      `/api/v1/contratos/${contratoId}/obligaciones`,
      data
    );
    return res.data;
  },

  async deleteObligacion(
    contratoId: string,
    obligacionId: string
  ): Promise<void> {
    await api.delete(
      `/api/v1/contratos/${contratoId}/obligaciones/${obligacionId}`
    );
  },
};

export default contratosService;
