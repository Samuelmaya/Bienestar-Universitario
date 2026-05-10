export type Rol = {
  id: number;
  nombre: string;
  descripcion: string;
  creado_en: string;
};

export type RolCreateRequest = {
  nombre: string;
  descripcion: string;
};

export type RolUpdateRequest = {
  nombre?: string;
  descripcion?: string;
};
