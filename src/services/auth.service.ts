import { environment } from "@/shared/environments/environment";
import type { ApiErrorResponse, LoginRequest, LoginResponse } from "@/shared/dtos/auth.dto";

const TOKEN_KEY = "auth_token";

function getErrorMessage(error: ApiErrorResponse | null): string {
  if (!error?.detail?.length) return "Ocurrio un error inesperado.";
  return error.detail.map((item) => item.msg).join(" ");
}

export async function loginRequest(data: LoginRequest): Promise<LoginResponse> {
  const response = await fetch(`${environment.apiUrl}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = (await response.json().catch(() => null)) as ApiErrorResponse | null;
    throw new Error(getErrorMessage(error));
  }

  const payload = (await response.json()) as LoginResponse;
  return payload;
}

export function setToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}
