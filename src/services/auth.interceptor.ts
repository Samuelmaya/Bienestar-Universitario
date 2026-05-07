import { environment } from "@/shared/environments/environment";
import { getToken, clearToken } from "@/services/auth.service";

type AuthInterceptorOptions = {
  onUnauthorized?: () => void;
};

export async function authFetch(
  input: RequestInfo | URL,
  init: RequestInit = {},
  options: AuthInterceptorOptions = {},
) {
  const url = typeof input === "string" ? input : input.toString();
  const shouldAttach = url.startsWith(environment.apiUrl);
  const token = shouldAttach ? getToken() : null;

  const headers = new Headers(init.headers || {});
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const response = await fetch(input, { ...init, headers });

  if (response.status === 401) {
    clearToken();
    options.onUnauthorized?.();
  }

  return response;
}
