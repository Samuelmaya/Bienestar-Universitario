import { environment } from "@/shared/environments/environment";
import { authFetch } from "@/services/auth.interceptor";
import type { DashboardResponse } from "@/shared/dtos/dashboard.dto";

const API_BASE = environment.apiUrl;

/**
 * Obtener estadísticas del dashboard.
 * GET /dashboard/ (admin)
 */
export async function obtenerDashboard(): Promise<DashboardResponse> {
  const response = await authFetch(`${API_BASE}/dashboard/`, {
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || `Error ${response.status}`);
  }

  return response.json();
}

export async function exportarDashboard(format: "excel" | "pdf"): Promise<Blob> {
  const response = await authFetch(`${API_BASE}/dashboard/export?format=${format}`, {
    method: "GET",
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || `Error ${response.status}`);
  }

  return response.blob();
}
