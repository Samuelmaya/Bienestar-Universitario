import { environment } from "@/shared/environments/environment";
import { authFetch } from "@/services/auth.interceptor";
import type {
  ArticuloDeportivo,
  ArticuloCreateRequest,
  ArticuloUpdateRequest,
} from "@/shared/dtos/articulo.dto";

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

export async function listarArticulos(): Promise<ArticuloDeportivo[]> {
  return request<ArticuloDeportivo[]>("/sports-equipment");
}

export async function obtenerArticulo(id_articulo: number): Promise<ArticuloDeportivo> {
  return request<ArticuloDeportivo>(`/sports-equipment/${id_articulo}`);
}

export async function crearArticulo(data: ArticuloCreateRequest): Promise<ArticuloDeportivo> {
  return request<ArticuloDeportivo>("/sports-equipment", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function actualizarArticulo(
  id_articulo: number,
  data: ArticuloUpdateRequest,
): Promise<ArticuloDeportivo> {
  return request<ArticuloDeportivo>(`/sports-equipment/${id_articulo}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function eliminarArticulo(id_articulo: number): Promise<void> {
  await request<void>(`/sports-equipment/${id_articulo}`, { method: "DELETE" });
}
