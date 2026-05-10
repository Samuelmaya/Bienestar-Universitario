import { environment } from "@/shared/environments/environment";
import { authFetch } from "@/services/auth.interceptor";
import type {
  Deporte,
  DeporteCreateRequest,
  DeporteUpdateRequest,
} from "@/shared/dtos/deporte.dto";

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

export async function listarDeportes(): Promise<Deporte[]> {
  return request<Deporte[]>("/sports");
}

export async function obtenerDeporte(cod_deporte: number): Promise<Deporte> {
  return request<Deporte>(`/sports/${cod_deporte}`);
}

export async function crearDeporte(data: DeporteCreateRequest): Promise<Deporte> {
  return request<Deporte>("/sports", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function actualizarDeporte(
  cod_deporte: number,
  data: DeporteUpdateRequest,
): Promise<Deporte> {
  return request<Deporte>(`/sports/${cod_deporte}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function eliminarDeporte(cod_deporte: number): Promise<void> {
  await request<void>(`/sports/${cod_deporte}`, { method: "DELETE" });
}
