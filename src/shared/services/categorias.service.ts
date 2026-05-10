import { environment } from "@/shared/environments/environment";
import { authFetch } from "@/services/auth.interceptor";
import type {
  CategoriaArticulo,
  CategoriaCreateRequest,
  CategoriaUpdateRequest,
} from "@/shared/dtos/categoria.dto";

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

export async function listarCategorias(): Promise<CategoriaArticulo[]> {
  return request<CategoriaArticulo[]>("/categories");
}

export async function obtenerCategoria(id_categoria: number): Promise<CategoriaArticulo> {
  return request<CategoriaArticulo>(`/categories/${id_categoria}`);
}

export async function crearCategoria(data: CategoriaCreateRequest): Promise<CategoriaArticulo> {
  return request<CategoriaArticulo>("/categories", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function actualizarCategoria(
  id_categoria: number,
  data: CategoriaUpdateRequest,
): Promise<CategoriaArticulo> {
  return request<CategoriaArticulo>(`/categories/${id_categoria}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function eliminarCategoria(id_categoria: number): Promise<void> {
  await request<void>(`/categories/${id_categoria}`, { method: "DELETE" });
}
