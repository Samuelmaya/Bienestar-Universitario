import { environment } from "@/shared/environments/environment";
import { authFetch } from "@/services/auth.interceptor";
import type {
  ArticuloDisponible,
  PeticionCreateRequest,
  PeticionCreateResponse,
  PeticionListItem,
  PeticionFullResponse,
  PeticionEstadoUpdateRequest,
  PeticionEstadoUpdateResponse,
} from "@/shared/dtos/peticion.dto";

const API_BASE = environment.apiUrl;

// ── Público ──

/**
 * Listar artículos deportivos disponibles.
 * GET /sports-equipment/ (público)
 */
export async function listarArticulosDisponibles(): Promise<ArticuloDisponible[]> {
  const response = await fetch(`${API_BASE}/sports-equipment/`, {
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || `Error ${response.status}`);
  }

  return response.json();
}

/**
 * Crear una petición de préstamo.
 * POST /peticiones/ (público)
 */
export async function crearPeticion(
  data: PeticionCreateRequest,
): Promise<PeticionCreateResponse> {
  const response = await fetch(`${API_BASE}/peticiones/`, {
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

// ── Admin (requiere token) ──

/**
 * Listar todas las peticiones.
 * GET /peticiones/ (admin)
 */
export async function listarPeticiones(): Promise<PeticionListItem[]> {
  const response = await authFetch(`${API_BASE}/peticiones/`, {
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || `Error ${response.status}`);
  }

  return response.json();
}

/**
 * Obtener detalle completo de una petición.
 * GET /peticiones/{id_peticion} (admin)
 */
export async function obtenerPeticion(
  id_peticion: number,
): Promise<PeticionFullResponse> {
  const response = await authFetch(
    `${API_BASE}/peticiones/${id_peticion}`,
    { headers: { "Content-Type": "application/json" } },
  );

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || `Error ${response.status}`);
  }

  return response.json();
}

/**
 * Actualizar estado de una petición.
 * PATCH /peticiones/{id_peticion}/estado (admin)
 */
export async function actualizarEstadoPeticion(
  id_peticion: number,
  data: PeticionEstadoUpdateRequest,
): Promise<PeticionEstadoUpdateResponse> {
  const response = await authFetch(
    `${API_BASE}/peticiones/${id_peticion}/estado`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    },
  );

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || `Error ${response.status}`);
  }

  return response.json();
}
