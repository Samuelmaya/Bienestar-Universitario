export type Deporte = {
  cod_deporte: number;
  nom_deporte: string;
  descripcion: string;
  cupo_maximo?: number | null;
  estado?: boolean;
};

export type DeporteCreateRequest = {
  nom_deporte: string;
  descripcion: string;
  cupo_maximo?: number | null;
};

export type DeporteUpdateRequest = {
  nom_deporte?: string;
  descripcion?: string;
  cupo_maximo?: number | null;
  estado?: boolean;
};
