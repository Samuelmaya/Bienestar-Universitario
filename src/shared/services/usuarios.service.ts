import { environment } from "@/shared/environments/environment";
import { authFetch } from "@/services/auth.interceptor";
import type {
  Usuario,
  UsuarioCreateRequest,
  UsuarioUpdateRequest,
} from "@/shared/dtos/usuario.dto";

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

  if (response.status === 204) return undefined as T;
  return response.json();
}

export async function listarUsuarios(): Promise<Usuario[]> {
  return request<Usuario[]>("/users/");
}

export async function obtenerUsuario(id: number): Promise<Usuario> {
  return request<Usuario>(`/users/${id}`);
}

export async function crearUsuario(data: UsuarioCreateRequest): Promise<Usuario> {
  return request<Usuario>("/users/", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function actualizarUsuario(id: number, data: UsuarioUpdateRequest): Promise<Usuario> {
  return request<Usuario>(`/users/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function eliminarUsuario(id: number): Promise<void> {
  await request<void>(`/users/${id}`, { method: "DELETE" });
}
