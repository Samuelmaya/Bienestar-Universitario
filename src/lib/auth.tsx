import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { authApi } from "./api";
import { clearToken, getToken, setToken } from "@/services/auth.service";

export type Role = "utilero" | "admin" | "entrenador" | "string";

export type AuthUser = {
  nombre: string;
  email: string;
  role: Role;
  user_id?: number;
};

type AuthContextValue = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (data: { email: string; contrasena: string }) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);
const STORAGE_KEY = "upc.auth.user";
function nombreFromEmail(email: string) {
  const base = email.split("@")[0] ?? "Usuario";
  return base
    .replace(/[._-]+/g, " ")
    .split(" ")
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const token = getToken();
      const raw = localStorage.getItem(STORAGE_KEY);
      if (token && raw) setUser(JSON.parse(raw));
    } catch {
      // ignore
    }
    setHydrated(true);
  }, []);

  const login = useCallback(async (data: { email: string; contrasena: string }) => {
    const response = await authApi.login({ email: data.email, contrasena: data.contrasena });
    setToken(response.access_token);

    const u: AuthUser = {
      email: data.email,
      role: response.rol as Role,
      nombre: nombreFromEmail(data.email),
    };

    setUser(u);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
      clearToken();
    } catch {
      // ignore
    }
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user: hydrated ? user : null,
      isAuthenticated: hydrated && !!user,
      login,
      logout,
    }),
    [user, hydrated, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de <AuthProvider>");
  return ctx;
}
