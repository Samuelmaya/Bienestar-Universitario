import { environment } from "@/shared/environments/environment";
import { authFetch } from "@/services/auth.interceptor";
import type { LoginRequest, LoginResponse } from "@/shared/dtos/auth.dto";

const API_BASE = environment.apiUrl;

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const response = await authFetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || `Error ${response.status}`);
  }

  return response.json();
}

// Tipos
export interface Sport {
  cod_deporte: number;
  nom_deporte: string;
  descripcion: string;
  categoria?: number;
  estado?: boolean;
}

export interface CrearDeporte {
  nom_deporte: string;
  descripcion: string;
  categoria?: number;
}

export interface SportUpdate {
  nom_deporte?: string;
  descripcion?: string;
  categoria?: number;
  estado?: boolean;
}

// API de Deportes
export const sportsApi = {
  list: () => request<Sport[]>("/sports"),

  get: (cod_deporte: number) => request<Sport>(`/sports/${cod_deporte}`),

  create: (data: CrearDeporte) =>
    request<Sport>("/sports", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  update: (cod_deporte: number, data: SportUpdate) =>
    request<Sport>(`/sports/${cod_deporte}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  delete: (cod_deporte: number) =>
    request<void>(`/sports/${cod_deporte}`, {
      method: "DELETE",
    }),
};

// API de Autenticacion
export const authApi = {
  login: (data: LoginRequest) =>
    request<LoginResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};

// API de Usuarios
export interface User {
  user_id: number;
  nombre: string;
  email: string;
  role: string;
}

export const usersApi = {
  list: () => request<User[]>("/users"),

  get: (user_id: number) => request<User>(`/users/${user_id}`),

  create: (data: { nombre: string; email: string; password: string; role: string }) =>
    request<User>("/users", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  update: (user_id: number, data: Partial<{ nombre: string; email: string; role: string }>) =>
    request<User>(`/users/${user_id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  delete: (user_id: number) =>
    request<void>(`/users/${user_id}`, {
      method: "DELETE",
    }),
};

// API de Categorías
export interface Category {
  id_categoria: number;
  nom_categoria: string;
  descripcion: string;
}

export const categoriesApi = {
  list: () => request<Category[]>("/categories"),

  get: (id_categoria: number) => request<Category>(`/categories/${id_categoria}`),

  create: (data: { nom_categoria: string; descripcion: string }) =>
    request<Category>("/categories", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  update: (id_categoria: number, data: Partial<{ nom_categoria: string; descripcion: string }>) =>
    request<Category>(`/categories/${id_categoria}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  delete: (id_categoria: number) =>
    request<void>(`/categories/${id_categoria}`, {
      method: "DELETE",
    }),
};

// API de Equipos Deportivos
export interface Articulo {
  id_articulo: number;
  nombre: string;
  cantidad: number;
  dañados: number;
  estado: string;
  id_categoria: number;
  observaciones: string;
}

export const articlesApi = {
  list: () => request<Articulo[]>("/sports-equipment"),

  get: (id_articulo: number) => request<Articulo>(`/sports-equipment/${id_articulo}`),

  create: (data: {
    nombre: string;
    cantidad: number;
    dañados: number;
    estado: string;
    id_categoria: number;
    observaciones: string;
  }) =>
    request<Articulo>("/sports-equipment", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  update: (
    id_articulo: number,
    data: Partial<{
      nombre: string;
      cantidad: number;
      dañados: number;
      estado: string;
      id_categoria: number;
      observaciones: string;
    }>,
  ) =>
    request<Articulo>(`/sports-equipment/${id_articulo}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  delete: (id_articulo: number) =>
    request<void>(`/sports-equipment/${id_articulo}`, {
      method: "DELETE",
    }),
};

export interface InscripcionItem {
  id_inscripcion: number;
  nombre: string;
  tipo_documento: string;
  documento: string;
  sexo: string;
  fecha_nacimiento: string;
  lugar_nacimiento: string;
  estado_civil: string;
  direccion_residencial: string;
  barrio: string;
  num_celular: string;
  email: string;
  deporte: string;
  fecha_inscripcion: string;
  estado: string;
  datos_academicos: {
    nom_colegio: string;
    jornada_colegio: string;
    anio_promocion: number;
    carrera: string;
    jornada_uni: string;
    promedio: number;
    permanencia: string;
  };
  datos_generales: {
    nivel_deportivo: string;
    torneo_participado: string;
    club_perteneciente: string;
    peso: number;
    estatura: number;
    enfermedad_padecida: string;
    eps: string;
    rh: string;
    trabaja_estudiante: boolean;
    lugar_trabajo: string;
    cargo_de_trabajo: string;
  };
  datos_familiares: {
    nom_madre: string;
    dir_madre: string;
    ciudad_madre: string;
    cel_madre: string;
    ocup_madre: string;
    nom_padre: string;
    dir_padre: string;
    ciudad_padre: string;
    cel_padre: string;
    ocup_padre: string;
    observaciones: string;
  };
  documentos: {
    horario: string;
    cedula: string;
    valoracion_medica: string;
    valoracion_odontologica: string;
    valoracion_psicologica: string;
    foto_3x4: string;
  };
}

export const inscripcionesApi = {
  list: () => request<InscripcionItem[]>("/inscripciones"),

  get: (id_inscripcion: number) =>
    request<InscripcionItem>(`/inscripciones/${id_inscripcion}`),
};

// API de Roles
export interface Role {
  id: number;
  nombre: string;
  descripcion: string;
  creado_en: string;
}

export interface RoleCreate {
  nombre: string;
  descripcion: string;
}

export interface RoleUpdate {
  nombre?: string;
  descripcion?: string;
}

export const rolesApi = {
  list: () => request<Role[]>("/roles"),

  get: (id: number) => request<Role>(`/roles/${id}`),

  create: (data: RoleCreate) =>
    request<Role>("/roles", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  update: (id: number, data: RoleUpdate) =>
    request<Role>(`/roles/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  delete: (id: number) =>
    request<void>(`/roles/${id}`, {
      method: "DELETE",
    }),
};
