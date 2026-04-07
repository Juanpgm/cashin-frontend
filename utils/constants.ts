export const ESTADOS_CUENTA = {
  borrador: { label: "Borrador", color: "#757575" },
  enviada: { label: "Enviada", color: "#1976D2" },
  en_revision: { label: "En revisión", color: "#F57C00" },
  aprobada: { label: "Aprobada", color: "#388E3C" },
  rechazada: { label: "Rechazada", color: "#D32F2F" },
  pagada: { label: "Pagada", color: "#1B5E20" },
} as const;

export const MESES = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

export const MAX_FILE_SIZE = 10 * 1024 * 1024;
export const ALLOWED_FILE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
];
export const MAX_EVIDENCIAS_POR_ACTIVIDAD = 10;
export const CUENTAS_GRATIS = 3;
