import { environment } from "@/shared/environments/environment";
import { authFetch } from "@/services/auth.interceptor";
import type {
  VacacionalConfig,
  VacacionalInscripcion,
  VacacionalCreatePayload,
} from "@/shared/dtos/vacacional.dto";

const API_BASE = environment.apiUrl;

// ─── Helpers ──────────────────────────────────────────────────────────────────

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

  // 204 No Content o body vacío (ej. DELETE) — no intentar parsear JSON
  if (response.status === 204 || response.headers.get("content-length") === "0") {
    return undefined as T;
  }

  const text = await response.text();
  if (!text) return undefined as T;
  return JSON.parse(text) as T;
}


// ─── Endpoints públicos ───────────────────────────────────────────────────────

/**
 * GET /vacacionales/config
 * Consulta el estado de activación del formulario vacacional.
 * Endpoint público (no requiere token).
 */
export async function obtenerConfigVacacional(): Promise<VacacionalConfig> {
  return request<VacacionalConfig>("/vacacionales/config");
}

/**
 * POST /vacacionales
 * Crea una inscripción vacacional.
 * Endpoint público. Usa multipart/form-data (NO usar el helper request<T> con JSON).
 */
export async function crearInscripcionVacacional(
  payload: VacacionalCreatePayload,
): Promise<VacacionalInscripcion> {
  const formData = new FormData();
  formData.append("nombre_completo", payload.nombre_completo);
  formData.append("edad", String(payload.edad));
  formData.append("numero_documento", payload.numero_documento);
  formData.append("telefono", payload.telefono);
  formData.append("informacion_referencia", payload.informacion_referencia);
  formData.append("disciplina_deportiva_id", String(payload.disciplina_deportiva_id));
  if (payload.comprobante) {
    formData.append("comprobante", payload.comprobante);
  }

  // Sin Content-Type header para que el browser genere el boundary del multipart
  const response = await authFetch(`${API_BASE}/vacacionales`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || `Error ${response.status}`);
  }

  return response.json();
}

// ─── Endpoints admin ──────────────────────────────────────────────────────────

/**
 * PATCH /vacacionales/config/toggle
 * Activa o desactiva el formulario vacacional.
 * Requiere token de administrador.
 */
export async function toggleConfigVacacional(): Promise<VacacionalConfig> {
  return request<VacacionalConfig>("/vacacionales/config/toggle", {
    method: "PATCH",
  });
}

/**
 * GET /vacacionales
 * Lista todas las inscripciones vacacionales.
 * Requiere token de administrador.
 */
export async function listarVacacionales(): Promise<VacacionalInscripcion[]> {
  return request<VacacionalInscripcion[]>("/vacacionales");
}

/**
 * GET /vacacionales/{id}
 * Obtiene el detalle de una inscripción vacacional.
 * Requiere token de administrador.
 */
export async function obtenerVacacional(id: number): Promise<VacacionalInscripcion> {
  return request<VacacionalInscripcion>(`/vacacionales/${id}`);
}

/**
 * DELETE /vacacionales/{id}
 * Elimina una inscripción vacacional.
 * Requiere token de administrador.
 */
export async function eliminarVacacional(id: number): Promise<void> {
  await request<void>(`/vacacionales/${id}`, { method: "DELETE" });
}
