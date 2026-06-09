// ─── Configuración del formulario vacacional ──────────────────────────────────

export type VacacionalConfig = {
  id_config: number;
  activo: boolean;
  created_at: string;
  updated_at: string;
};
export type deporte ={
  cod_deporte: number;
  nom_deporte: string;
}

// ─── Enum de referencia ───────────────────────────────────────────────────────

export type InformacionReferencia =
  | "Hijo de Docente"
  | "Hijo de Contratista"
  | "Hijo de Funcionario"
  | "Hijo de Egresado"
  | "Particular"
  | "Estudiante"
  | "Egresado"
  | "Entrenador"
  | "Hija de Estudiante"
  | "Nieto de Funcionario"
  | "Amigo de Funcionario"
  | "Sobrino de Estudiante";

export const INFORMACION_REFERENCIA_OPTIONS: InformacionReferencia[] = [
  "Hijo de Docente",
  "Hijo de Contratista",
  "Hijo de Funcionario",
  "Hijo de Egresado",
  "Particular",
  "Estudiante",
  "Egresado",
  "Entrenador",
  "Hija de Estudiante",
  "Nieto de Funcionario",
  "Amigo de Funcionario",
  "Sobrino de Estudiante",
];

/** Referencia que exime del comprobante de póliza de seguro */
export const REFERENCIA_SIN_COMPROBANTE: InformacionReferencia = "Hijo de Funcionario";

// ─── Inscripción vacacional ───────────────────────────────────────────────────

export type VacacionalInscripcion = {
  id_vacacional: number;
  nombre_completo: string;
  edad: number;
  numero_documento: string;
  telefono: string;
  informacion_referencia: InformacionReferencia;
  comprobante_url: string | null;
  comprobante_file_id: string | null;
  disciplina_deportiva_id: number;
  deporte:deporte;
  created_at: string;
  updated_at: string;
};

// ─── Payload de creación ──────────────────────────────────────────────────────

export type VacacionalCreatePayload = {
  nombre_completo: string;
  edad: number;
  numero_documento: string;
  telefono: string;
  informacion_referencia: InformacionReferencia;
  disciplina_deportiva_id: number;
  comprobante?: File;
};
