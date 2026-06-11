export interface Medal {
  id_medalla: number;
  nombre_estudiante: string;
  carrera: string;
  disciplina: string;
  fecha: string; // "YYYY-MM-DD"
  evento: string;
  ciudad_evento: string;
  modalidad: string;
  tipo_medalla: string;
}

export interface MedalCreateRequest {
  nombre_estudiante: string;
  carrera: string;
  disciplina: string;
  fecha: string;
  evento: string;
  ciudad_evento: string;
  modalidad: string;
  tipo_medalla: string;
}

export interface MedalUpdateRequest {
  nombre_estudiante?: string;
  carrera?: string;
  disciplina?: string;
  fecha?: string;
  evento?: string;
  ciudad_evento?: string;
  modalidad?: string;
  tipo_medalla?: string;
}