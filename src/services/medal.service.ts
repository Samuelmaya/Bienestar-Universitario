import { environment } from "@/shared/environments/environment";
import { authFetch } from "@/services/auth.interceptor";
import type {
  Medal,
  MedalCreateRequest,
  MedalUpdateRequest,
} from "@/shared/dtos/medal.dto";

const API_BASE = environment.apiUrl;

/**
 * Listar todas las medallas.
 * GET /medals/ (admin)
 */
export async function listarMedallas(): Promise<Medal[]> {
  const response = await authFetch(`${API_BASE}/medals/`, {
    headers: { "Content-Type": "application/json" },
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || `Error ${response.status}`);
  }
  return response.json();
}

/**
 * Obtener una medalla por ID.
 * GET /medals/{id_medalla} (admin)
 */
export async function obtenerMedalla(id_medalla: number): Promise<Medal> {
  const response = await authFetch(`${API_BASE}/medals/${id_medalla}`, {
    headers: { "Content-Type": "application/json" },
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || `Error ${response.status}`);
  }
  return response.json();
}

/**
 * Crear una medalla.
 * POST /medals/ (admin)
 */
export async function crearMedalla(data: MedalCreateRequest): Promise<Medal> {
  const response = await authFetch(`${API_BASE}/medals/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || `Error ${response.status}`);
  }
  return response.json();
}

/**
 * Actualizar una medalla.
 * PATCH /medals/{id_medalla} (admin)
 */
export async function actualizarMedalla(
  id_medalla: number,
  data: MedalUpdateRequest,
): Promise<Medal> {
  const response = await authFetch(`${API_BASE}/medals/${id_medalla}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || `Error ${response.status}`);
  }
  return response.json();
}

/**
 * Eliminar una medalla.
 * DELETE /medals/{id_medalla} (admin)
 */
export async function eliminarMedalla(id_medalla: number): Promise<void> {
  const response = await authFetch(`${API_BASE}/medals/${id_medalla}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || `Error ${response.status}`);
  }
}