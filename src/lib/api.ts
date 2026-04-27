const API_BASE = "https://backend-deportes.onrender.com";

const getToken = () => localStorage.getItem("auth_token");

const headers = () => {
  const token = getToken();
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      ...headers(),
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

// API de Autenticación
export interface LoginRequest {
  email: string;
  password: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
}

export const authApi = {
  login: (data: LoginRequest) =>
    request<TokenResponse>("/auth/login", {
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
  nom_articulo: string;
  descripcion: string;
  cantidad: number;
  estado: string;
}

export const articlesApi = {
  list: () => request<Articulo[]>("/sports-equipment"),

  get: (id_articulo: number) => request<Articulo>(`/sports-equipment/${id_articulo}`),

  create: (data: { nom_articulo: string; descripcion: string; cantidad: number }) =>
    request<Articulo>("/sports-equipment", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  update: (id_articulo: number, data: Partial<{ nom_articulo: string; descripcion: string; cantidad: number; estado: string }>) =>
    request<Articulo>(`/sports-equipment/${id_articulo}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  delete: (id_articulo: number) =>
    request<void>(`/sports-equipment/${id_articulo}`, {
      method: "DELETE",
    }),
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