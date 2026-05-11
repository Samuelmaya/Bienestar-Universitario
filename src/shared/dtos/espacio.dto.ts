// ── Espacio Deportivo ──

export type EspacioDeportivo = {
  id_espacio: number;
  nombre: string;
  estado: string | null;
  observaciones: string | null;
};

export type EspacioDeportivoCreateRequest = {
  nombre: string;
  estado?: string | null;
  observaciones?: string | null;
};

export type EspacioDeportivoUpdateRequest = {
  nombre?: string | null;
  estado?: string | null;
  observaciones?: string | null;
};

// ── Solicitud de Espacio Deportivo ──

export type SolicitudEspacio = {
  id_solicitud: number;
  solicitante: string;
  entidad: string;
  id_espacio: number;
  fecha: string;       // YYYY-MM-DD
  hora_inicio: string; // HH:MM:SS
  hora_fin: string;    // HH:MM:SS
  motivo: string | null;
  estado: string;
};

export type SolicitudEspacioCreateRequest = {
  solicitante: string;
  entidad: string;
  id_espacio: number;
  fecha: string;       // YYYY-MM-DD
  hora_inicio: string; // HH:MM:SS
  hora_fin: string;    // HH:MM:SS
  motivo?: string | null;
};

export type SolicitudEspacioUpdateRequest = {
  solicitante?: string | null;
  entidad?: string | null;
  id_espacio?: number | null;
  fecha?: string | null;
  hora_inicio?: string | null;
  hora_fin?: string | null;
  motivo?: string | null;
  estado?: string | null;
};

export const ESTADOS_SOLICITUD = ["PENDIENTE", "APROBADA", "RECHAZADA"] as const;
export type EstadoSolicitud = (typeof ESTADOS_SOLICITUD)[number];

export const ESTADOS_ESPACIO = ["DISPONIBLE", "MANTENIMIENTO", "INHABILITADO"] as const;
export type EstadoEspacio = (typeof ESTADOS_ESPACIO)[number];
