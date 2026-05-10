import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { authApi } from "./api";
import { clearToken, getToken, setToken, refreshToken } from "@/services/auth.service";

export type Role = "administrador" | "utilero" | "entrenador" | string;

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

function buildNombre(primerNombre: string, primerApellido: string): string {
  return `${primerNombre} ${primerApellido}`.trim() || "Usuario";
}

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

  // Al montar: si hay token guardado, intentar refresh para validarlo
  useEffect(() => {
    const token = getToken();
    if (!token) {
      setHydrated(true);
      return;
    }

    refreshToken(token)
      .then((res) => {
        // Token válido: actualizar token y datos del usuario
        setToken(res.access_token);
        const u: AuthUser = {
          email: res.usuario.email,
          role: res.rol.toLowerCase() as Role,
          nombre: buildNombre(res.usuario.primer_nombre, res.usuario.primer_apellido),
          user_id: res.usuario.id,
        };
        setUser(u);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
      })
      .catch(() => {
        // Token inválido o expirado: limpiar todo
        clearToken();
        localStorage.removeItem(STORAGE_KEY);
        setUser(null);
      })
      .finally(() => setHydrated(true));
  }, []);

  const login = useCallback(async (data: { email: string; contrasena: string }) => {
    const response = await authApi.login({ email: data.email, contrasena: data.contrasena });
    setToken(response.access_token);

    const u: AuthUser = {
      email: data.email,
      role: (response.rol as string).toLowerCase() as Role,
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
