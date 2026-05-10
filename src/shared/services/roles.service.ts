import { environment } from "@/shared/environments/environment";
import { authFetch } from "@/services/auth.interceptor";
import type { Rol, RolCreateRequest, RolUpdateRequest } from "@/shared/dtos/rol.dto";

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

export async function listarRoles(): Promise<Rol[]> {
  return request<Rol[]>("/roles");
}

export async function obtenerRol(id: number): Promise<Rol> {
  return request<Rol>(`/roles/${id}`);
}

export async function crearRol(data: RolCreateRequest): Promise<Rol> {
  return request<Rol>("/roles", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function actualizarRol(id: number, data: RolUpdateRequest): Promise<Rol> {
  return request<Rol>(`/roles/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function eliminarRol(id: number): Promise<void> {
  await request<void>(`/roles/${id}`, { method: "DELETE" });
}
