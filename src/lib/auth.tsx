import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

export type Role = "estudiante" | "profesor" | "admin";

export type AuthUser = {
  nombre: string;
  email: string;
  role: Role;
};

type AuthContextValue = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (data: { email: string; role: Role }) => void;
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
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setUser(JSON.parse(raw));
    } catch {
      // ignore
    }
    setHydrated(true);
  }, []);

  const login = useCallback((data: { email: string; role: Role }) => {
    const u: AuthUser = {
      email: data.email,
      role: data.role,
      nombre: nombreFromEmail(data.email),
    };
    setUser(u);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
    } catch {
      // ignore
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
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
