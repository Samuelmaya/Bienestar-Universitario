import { environment } from "@/shared/environments/environment";
import { authFetch } from "@/services/auth.interceptor";
import type {
  StudentProfile,
  StudentProfileCreate,
  StudentResponse,
  StudentOperationResponse,
} from "@/shared/dtos/student.dto";

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

// =====================================================
// CONSULTAS RÁPIDAS
// =====================================================

export async function listarEstudiantes(): Promise<StudentResponse[]> {
  return request<StudentResponse[]>("/students");
}

export async function obtenerEstudiante(id_estudiante: number): Promise<StudentResponse> {
  return request<StudentResponse>(`/students/${id_estudiante}`);
}

// =====================================================
// FICHA COMPLETA
// =====================================================

export async function crearFichaEstudiante(
  data: StudentProfileCreate
): Promise<StudentOperationResponse> {
  return request<StudentOperationResponse>("/students/profile", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function obtenerFichaEstudiante(id_estudiante: number): Promise<StudentProfile> {
  return request<StudentProfile>(`/students/profile/${id_estudiante}`);
}

export async function actualizarFichaEstudiante(
  id_estudiante: number,
  data: StudentProfileCreate
): Promise<StudentOperationResponse> {
  return request<StudentOperationResponse>(`/students/profile/${id_estudiante}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function eliminarFichaEstudiante(id_estudiante: number): Promise<void> {
  await request<void>(`/students/profile/${id_estudiante}`, { method: "DELETE" });
}