import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { LogIn, Mail, Lock, GraduationCap, Eye, EyeOff } from "lucide-react";
import logo from "@/assets/logo-upc.png";
import { useAuth } from "@/lib/auth";

type Search = { redirect?: string };

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Iniciar sesión — UPC Deportes" }] }),
  validateSearch: (search: Record<string, unknown>): Search => ({
    redirect: typeof search.redirect === "string" ? search.redirect : undefined,
  }),
  component: LoginPage,
});

function LoginPage() {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const search = Route.useSearch();

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Ingresa tu correo y contraseña.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await login({ email, password });
      const target = search.redirect && search.redirect !== "/login" ? search.redirect : "/";
      navigate({ to: target });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al iniciar sesión. Verifica tus credenciales.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="hidden lg:flex relative items-end p-12 bg-[image:var(--gradient-primary)] text-primary-foreground overflow-hidden">
        <div className="absolute -top-20 -right-20 h-80 w-80 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute bottom-1/3 -left-10 h-60 w-60 rounded-full bg-white/10 blur-2xl" />
        <div className="relative max-w-md">
          <img src={logo} alt="UPC" className="h-16 w-auto bg-white rounded-lg p-2 shadow-lg" />
          <h2 className="mt-8 text-4xl font-bold">Bienestar Deportivo UPC</h2>
          <p className="mt-3 opacity-90">
            Accede a tu cuenta para reservar implementos, inscribirte a disciplinas y consultar tus
            horarios deportivos.
          </p>
          <div className="mt-8 grid grid-cols-3 gap-3 text-center text-xs">
            {["Reservas", "Inventario", "Horarios"].map((t) => (
              <div key={t} className="rounded-lg bg-white/10 backdrop-blur p-3">
                <p className="font-semibold">{t}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center p-6 sm:p-12 bg-background">
        <div className="w-full max-w-md">
          <Link to="/" className="lg:hidden mb-6 flex justify-center">
            <img src={logo} alt="UPC" className="h-14 w-auto" />
          </Link>
          <h1 className="text-3xl font-bold">Bienvenido de nuevo</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Ingresa tus credenciales institucionales.
          </p>

          <form className="mt-6 space-y-4" onSubmit={onSubmit}>
            <div>
              <label className="text-sm font-medium">Correo institucional</label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="usuario@unicesar.edu.co"
                  className="w-full rounded-md border border-input bg-background pl-9 pr-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
                  disabled={loading}
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Contraseña</label>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type={show ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-md border border-input bg-background pl-9 pr-10 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShow((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                >
                  {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="rounded border-input" />
                Recordarme
              </label>
              <a href="#" className="font-medium text-primary hover:underline">
                ¿Olvidaste tu contraseña?
              </a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 rounded-md bg-primary py-2.5 font-semibold text-primary-foreground shadow-[var(--shadow-soft)] hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <LogIn className="h-4 w-4" /> {loading ? "Ingresando..." : "Ingresar"}
            </button>
          </form>

          <div className="mt-6 rounded-lg border border-dashed border-border p-4 flex items-start gap-3 bg-accent">
            <GraduationCap className="h-5 w-5 text-primary mt-0.5" />
            <div className="text-sm">
              <p className="font-medium">¿Eres estudiante nuevo?</p>
              <Link to="/registro" className="text-primary font-semibold hover:underline">
                Regístrate aquí
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
