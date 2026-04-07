import api from "@/utils/api";
import type { Documento, TipoDocumento } from "@/types/models";

const documentosService = {
  async upload(
    file: { uri: string; name: string; type: string },
    tipo: TipoDocumento = "contrato",
    contrato_id?: string
  ): Promise<Documento> {
    const formData = new FormData();
    formData.append("file", {
      uri: file.uri,
      name: file.name,
      type: file.type,
    } as unknown as Blob);

    const params = new URLSearchParams({ tipo });
    if (contrato_id) params.append("contrato_id", contrato_id);

    const res = await api.post<Documento>(
      `/api/v1/documentos/upload?${params.toString()}`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    return res.data;
  },

  async process(document_id: string): Promise<{ document_id: string; status: string; texto_extraido?: string }> {
    const res = await api.post("/api/v1/documentos/process", { document_id });
    return res.data;
  },

  async listByContrato(contrato_id: string): Promise<Documento[]> {
    const res = await api.get<Documento[]>(
      `/api/v1/documentos/contrato/${contrato_id}`
    );
    return res.data;
  },
};

export default documentosService;
