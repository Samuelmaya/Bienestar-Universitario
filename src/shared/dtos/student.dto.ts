// =====================================================
// REQUESTS
// =====================================================

export interface StudentInfo {
  id_estudiante: number;
  nombre: string;
  tipo_documento: "RC" | "TI" | "CC" | "CE" | "PEP";
  sexo: "M" | "F";
  fecha_nacimiento: string; // "YYYY-MM-DD"
  lugar_nacimiento?: string;
  estado_civil?: "SOLTERO" | "CASADO" | "UNION LIBRE" | "VIUDO";
  direccion_residencial?: string;
  barrio?: string;
  num_celular?: string;
  email?: string;
}

export interface AcademicInfo {
  nom_colegio?: string;
  jornada_colegio?: "MAÑANA" | "TARDE" | "JORNADA UNICA";
  anio_promocion?: number;
  carrera?: string;
  jornada_uni?: "MAÑANA" | "TARDE" | "UNICA" | "NOCTURNA";
  promedio?: number;
  permanencia?: "ACTIVO" | "INACTIVO" | "SUSPENDIDO" | "TRANSFERIDO";
}

export interface GeneralInfo {
  nivel_deportivo?: "NINGUNO" | "RECREATIVO" | "COMPETITIVO";
  torneo_participado?: string;
  club_perteneciente?: string;
  peso?: number;
  estatura?: number;
  enfermedad_padecida?: string;
  eps?: string;
  rh?: "A+" | "O+" | "B+" | "AB+" | "A-" | "O-" | "B-" | "AB-";
  trabaja_estudiante?: boolean;
  lugar_trabajo?: string;
  cargo_de_trabajo?: string;
}

export interface FamilyInfo {
  nom_madre?: string;
  dir_madre?: string;
  ciudad_madre?: string;
  cel_madre?: number;
  ocup_madre?: string;
  nom_padre?: string;
  dir_padre?: string;
  ciudad_padre?: string;
  cel_padre?: number;
  ocup_padre?: string;
  observaciones?: string;
}

export interface SportRegistrationInfo {
  cod_deporte: number;
  estado?: "PENDIENTE" | "APROBADA" | "RECHAZADA" | "CANCELADA";
}

export interface StudentDocument {
  tipo_documento:
    | "FOTO_ESTUDIANTE"
    | "DOCUMENTO_IDENTIDAD"
    | "HORARIO_CLASES"
    | "VALORACION_MEDICA"
    | "VALORACION_ODONTOLOGICA"
    | "VALORACION_PSICOLOGICA";
  nombre_archivo: string;
  url_archivo: string;
}

export interface StudentProfileCreate {
  estudiante: StudentInfo;
  informacion_academica: AcademicInfo;
  datos_generales: GeneralInfo;
  datos_familiares: FamilyInfo;
  inscripcion: SportRegistrationInfo;
  documentos: StudentDocument[];
}

// =====================================================
// RESPONSES
// =====================================================

export interface StudentResponse {
  id_estudiante: number;
  nombre: string;
  tipo_documento: string;
  sexo: string;
  email: string | null;
  num_celular: string | null;
}

export interface StudentProfile {
  estudiante: StudentInfo & { barrio?: string; estado_civil?: string };
  informacion_academica: AcademicInfo & { anio_promocion?: number };
  datos_generales: GeneralInfo;
  datos_familiares: FamilyInfo;
  inscripcion: {
    id_inscripcion: number;
    fecha: string;
    estado: string;
    cod_deporte: number;
    nombre_deporte: string;
  } | null;
  inscripciones: {
    id_inscripcion: number;
    id_estudiante: number;
    cod_deporte: number;
    fecha: string;
    estado: string;
    deporte?: {
      cod_deporte: number;
      nom_deporte: string;
    };
  }[];
  documentos: {
    id_documento: number;
    id_estudiante: number;
    tipo_documento: string;
    nombre_archivo: string;
    url_archivo: string;
    fecha_carga: string;
    download_url: string;
  }[];
}

export interface StudentOperationResponse {
  success: boolean;
  id_estudiante: number;
}