export type Usuario = {
  id: number;
  primer_nombre: string;
  segundo_nombre?: string | null;
  primer_apellido: string;
  segundo_apellido?: string | null;
  email: string;
  role_id?: number | null;
  activo: boolean;
  creando_en: string;
};

export type UsuarioCreateRequest = {
  primer_nombre: string;
  segundo_nombre?: string | null;
  primer_apellido: string;
  segundo_apellido?: string | null;
  email: string;
  contrasena: string;
  role_id: number;
  activo: boolean;
};

export type UsuarioUpdateRequest = {
  primer_nombre?: string;
  segundo_nombre?: string | null;
  primer_apellido?: string;
  segundo_apellido?: string | null;
  email?: string;
  role_id?: number | null;
  activo?: boolean;
};
