import { environment } from "@/shared/environments/environment";
import { authFetch } from "@/services/auth.interceptor";
import type {
  EspacioDeportivo,
  EspacioDeportivoCreateRequest,
  EspacioDeportivoUpdateRequest,
  SolicitudEspacio,
  SolicitudEspacioCreateRequest,
  SolicitudEspacioUpdateRequest,
} from "@/shared/dtos/espacio.dto";

const API_BASE = environment.apiUrl;

// ─────────────────────────────────────────
// Espacios Deportivos
// ─────────────────────────────────────────

/**
 * Listar todos los espacios deportivos.
 * GET /espacio-deportivos/ (público)
 */
export async function listarEspaciosDeportivos(): Promise<EspacioDeportivo[]> {
  const response = await fetch(`${API_BASE}/espacio-deportivos/`, {
    headers: { "Content-Type": "application/json" },
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || `Error ${response.status}`);
  }
  return response.json();
}

/**
 * Obtener un espacio deportivo por ID.
 * GET /espacio-deportivos/{id_espacio} (admin)
 */
export async function obtenerEspacioDeportivo(
  id_espacio: number,
): Promise<EspacioDeportivo> {
  const response = await authFetch(
    `${API_BASE}/espacio-deportivos/${id_espacio}`,
    { headers: { "Content-Type": "application/json" } },
  );
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || `Error ${response.status}`);
  }
  return response.json();
}

/**
 * Crear un espacio deportivo.
 * POST /espacio-deportivos/ (admin)
 */
export async function crearEspacioDeportivo(
  data: EspacioDeportivoCreateRequest,
): Promise<EspacioDeportivo> {
  const response = await authFetch(`${API_BASE}/espacio-deportivos/`, {
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
 * Actualizar un espacio deportivo.
 * PATCH /espacio-deportivos/{id_espacio} (admin)
 */
export async function actualizarEspacioDeportivo(
  id_espacio: number,
  data: EspacioDeportivoUpdateRequest,
): Promise<EspacioDeportivo> {
  const response = await authFetch(
    `${API_BASE}/espacio-deportivos/${id_espacio}`,
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

/**
 * Eliminar un espacio deportivo.
 * DELETE /espacio-deportivos/{id_espacio} (admin)
 */
export async function eliminarEspacioDeportivo(
  id_espacio: number,
): Promise<void> {
  const response = await authFetch(
    `${API_BASE}/espacio-deportivos/${id_espacio}`,
    { method: "DELETE" },
  );
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || `Error ${response.status}`);
  }
}

// ─────────────────────────────────────────
// Solicitudes de Escenarios Deportivos
// ─────────────────────────────────────────

/**
 * Listar todas las solicitudes.
 * GET /solicitud-espacios/ (público)
 */
export async function listarSolicitudesEspacios(): Promise<SolicitudEspacio[]> {
  const response = await fetch(`${API_BASE}/solicitud-espacios/`, {
    headers: { "Content-Type": "application/json" },
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || `Error ${response.status}`);
  }
  return response.json();
}

/**
 * Obtener una solicitud por ID.
 * GET /solicitud-espacios/{id_solicitud} (admin)
 */
export async function obtenerSolicitudEspacio(
  id_solicitud: number,
): Promise<SolicitudEspacio> {
  const response = await authFetch(
    `${API_BASE}/solicitud-espacios/${id_solicitud}`,
    { headers: { "Content-Type": "application/json" } },
  );
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || `Error ${response.status}`);
  }
  return response.json();
}

/**
 * Crear una solicitud de préstamo de espacio deportivo.
 * POST /solicitud-espacios/ (admin - requiere token)
 */
export async function crearSolicitudEspacio(
  data: SolicitudEspacioCreateRequest,
): Promise<SolicitudEspacio> {
  const response = await authFetch(`${API_BASE}/solicitud-espacios/`, {
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
 * Actualizar una solicitud de espacio deportivo.
 * PATCH /solicitud-espacios/{id_solicitud} (admin)
 */
export async function actualizarSolicitudEspacio(
  id_solicitud: number,
  data: SolicitudEspacioUpdateRequest,
): Promise<SolicitudEspacio> {
  const response = await authFetch(
    `${API_BASE}/solicitud-espacios/${id_solicitud}`,
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
