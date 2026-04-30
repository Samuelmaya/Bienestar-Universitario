import { Link, useLocation } from "@tanstack/react-router";
import { Lock, LogIn, ShieldAlert } from "lucide-react";
import { useAuth, type Role } from "@/lib/auth";

type Props = {
  children: React.ReactNode;
  roles?: Role[];
};

export function RequireAuth({ children, roles }: Props) {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (!isAuthenticated || !user) {
    return (
      <div className="container mx-auto px-4 py-20">
        <div className="mx-auto max-w-md rounded-2xl border border-border bg-card p-8 text-center shadow-[var(--shadow-soft)]">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-accent">
            <Lock className="h-6 w-6 text-primary" />
          </div>
          <h2 className="mt-4 text-xl font-bold">Acceso restringido</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Debes iniciar sesión para acceder a esta sección del sistema.
          </p>
          <Link
            to="/login"
            search={{ redirect: location.pathname }}
            className="mt-6 inline-flex items-center justify-center gap-2 rounded-md bg-primary px-5 py-2.5 font-semibold text-primary-foreground shadow-[var(--shadow-soft)] hover:opacity-90"
          >
            <LogIn className="h-4 w-4" /> Iniciar sesión
          </Link>
        </div>
      </div>
    );
  }

  if (roles && !roles.includes(user.role)) {
    return (
      <div className="container mx-auto px-4 py-20">
        <div className="mx-auto max-w-md rounded-2xl border border-border bg-card p-8 text-center shadow-[var(--shadow-soft)]">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10">
            <ShieldAlert className="h-6 w-6 text-destructive" />
          </div>
          <h2 className="mt-4 text-xl font-bold">Permiso insuficiente</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Tu rol <span className="font-semibold capitalize">{user.role}</span> no tiene acceso a
            esta sección. Sólo disponible para: {roles.join(", ")}.
          </p>
          <Link
            to="/"
            className="mt-6 inline-flex items-center justify-center rounded-md border border-input bg-background px-5 py-2.5 font-semibold text-foreground hover:bg-accent"
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
