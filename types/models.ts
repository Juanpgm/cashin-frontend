// ─── Auth ────────────────────────────────────────────────────────────────────

export interface UserResponse {
  id: string;
  email: string;
  nombre: string;
  cedula: string;
  telefono: string;
  activo: boolean;
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export interface UpdateUserRequest {
  nombre?: string;
  cedula?: string;
  telefono?: string;
}

// Legacy alias kept for store compatibility
export type User = UserResponse;

// ─── Contratos ───────────────────────────────────────────────────────────────

export interface Obligacion {
  id: string;
  contrato_id: string;
  descripcion: string;
  tipo: "general" | "especifica";
  orden: number;
}

export interface ObligacionCreate {
  descripcion: string;
  tipo: "general" | "especifica";
  orden?: number;
}

export interface Contrato {
  id: string;
  numero_contrato: string;
  objeto: string;
  valor_total: number;
  valor_mensual: number;
  fecha_inicio: string;
  fecha_fin: string;
  supervisor_nombre?: string;
  dependencia?: string;
  activo: boolean;
  obligaciones: Obligacion[];
}

export type ContratoListItem = Omit<Contrato, "obligaciones"> & {
  obligaciones_count?: number;
};

export interface ContratoCreate {
  numero_contrato: string;
  objeto: string;
  valor_total: number;
  valor_mensual: number;
  fecha_inicio: string;
  fecha_fin: string;
  supervisor_nombre?: string;
  dependencia?: string;
  obligaciones?: ObligacionCreate[];
}

export type ContratoUpdate = Partial<
  Omit<ContratoCreate, "obligaciones">
>;

export interface ContratoConfiguracion {
  tiene_contrato: boolean;
  tiene_plantilla: boolean;
  tiene_instrucciones: boolean;
  lista_para_generar: boolean;
}

export interface PeriodoPendiente {
  mes: number;
  anio: number;
  tiene_cuenta: boolean;
  cuenta_id?: string;
}

// ─── Cuentas de Cobro ─────────────────────────────────────────────────────────

export type EstadoCuentaCobro =
  | "borrador"
  | "enviada"
  | "en_revision"
  | "aprobada"
  | "rechazada"
  | "pagada";

export interface Actividad {
  id: string;
  cuenta_cobro_id: string;
  obligacion_id?: string;
  descripcion: string;
  fecha_realizacion?: string;
}

export interface ActividadCreate {
  descripcion: string;
  obligacion_id?: string;
  fecha_realizacion?: string;
}

export interface CuentaCobro {
  id: string;
  contrato_id: string;
  contrato_numero?: string;
  mes: number;
  anio: number;
  estado: EstadoCuentaCobro;
  valor?: number;
  fecha_creacion: string;
  fecha_envio?: string;
  fecha_aprobacion?: string;
  observaciones_rechazo?: string;
  actividades: Actividad[];
  pdf_url?: string;
}

export type CuentaCobroListItem = Omit<CuentaCobro, "actividades"> & {
  actividades_count?: number;
};

export interface CuentaCobroCreate {
  contrato_id: string;
  mes: number;
  anio: number;
}

export interface PDFUrlResponse {
  url: string;
  expires_at?: string;
}

export interface GenerarPDFResponse {
  pdf_url: string;
  message?: string;
}

// ─── Documentos ──────────────────────────────────────────────────────────────

export type TipoDocumento = "contrato" | "instrucciones" | "plantilla";

export interface Documento {
  id: string;
  nombre?: string;
  nombre_archivo?: string;
  tipo: TipoDocumento;
  url?: string;
  contrato_id?: string;
  created_at?: string;
  procesado?: boolean;
}

// ─── Chat ─────────────────────────────────────────────────────────────────────

export interface ChatMessage {
  id?: string;
  role: "user" | "assistant";
  content: string;
  created_at?: string;
}

export interface ConversationHistory {
  session_id: string;
  messages: ChatMessage[];
}

// ─── SECOP ────────────────────────────────────────────────────────────────────

export interface SecopContrato {
  id_proceso?: string;
  numero_contrato?: string;
  objeto?: string;
  valor_contrato?: number;
  fecha_inicio?: string;
  fecha_fin?: string;
  nombre_entidad?: string;
  estado_contrato?: string;
  tipo_contrato?: string;
  documento_proveedor?: string;
  nombre_proveedor?: string;
  [key: string]: unknown;
}

export interface SecopProceso {
  id_proceso: string;
  nombre_entidad?: string;
  objeto?: string;
  estado?: string;
  [key: string]: unknown;
}

export interface SecopDocumento {
  id?: string;
  nombre?: string;
  url?: string;
  tipo?: string;
  fecha?: string;
  [key: string]: unknown;
}

export interface SecopImportResult {
  importados: number;
  omitidos: number;
  contratos?: SecopContrato[];
  preview?: SecopContrato[];
  message?: string;
}

export interface SecopConsultaCompleta {
  contratos: SecopContrato[];
  total: number;
  cedula: string;
}

// ─── UI / Notifications ──────────────────────────────────────────────────────

export interface Notificacion {
  id: string;
  titulo: string;
  mensaje: string;
  leida: boolean;
  fecha: string;
  tipo: "aprobada" | "rechazada" | "recordatorio" | "info";
}
