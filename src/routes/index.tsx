import { createFileRoute, Link } from "@tanstack/react-router";
import {
  CalendarPlus,
  Trophy,
  Activity,
  Users,
  ArrowRight,
} from "lucide-react";
import hero from "@/assets/hero-deportes.jpg";
import { useAuth } from "@/lib/auth";
import { useRef, useState } from "react";
import { LoginModal } from "@/components/LoginModal";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Inicio — Bienestar Deportivo UPC" },
      {
        name: "description",
        content:
          "Reserva implementos, inscríbete a deportes y consulta horarios del área deportiva de la UPC.",
      },
    ],
  }),
  component: PublicHome,
});

function PublicHome() {
  const { isAuthenticated } = useAuth();
  const [loginOpen, setLoginOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  return (
    <>
      <section className="relative overflow-hidden">
        <img
          src={hero}
          alt="Estudiantes de la UPC practicando deportes"
          width={1600}
          height={900}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-[image:var(--gradient-hero)]" />
        <div className="relative container mx-auto px-4 py-24 md:py-32 text-primary-foreground">
          <span className="inline-block rounded-full bg-white/15 backdrop-blur px-4 py-1 text-xs font-semibold uppercase tracking-widest">
            Universidad Popular del Cesar
          </span>
          <h1 className="mt-4 text-4xl md:text-6xl font-bold leading-tight max-w-3xl">
            Vive la pasión del deporte universitario
          </h1>
          <p className="mt-4 max-w-2xl text-lg opacity-95">
            Reserva implementos, inscribete a disciplinas y mantente al dia con
            los horarios del area de Bienestar Deportivo de la UPC.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/peticiones"
              className="inline-flex items-center gap-2 rounded-md bg-white px-5 py-3 font-semibold text-primary shadow transition hover:bg-white/90"
            >
              <CalendarPlus className="h-4 w-4" />
              Reservar
            </Link>

            {isAuthenticated ? (
              <Link
                to="/panel"
                className="inline-flex items-center gap-2 rounded-md border border-white/40 bg-white/10 px-5 py-3 font-semibold text-white backdrop-blur transition hover:bg-white/20"
              >
                Ir al Panel <ArrowRight className="h-4 w-4" />
              </Link>
            ) : (
              <button
                ref={triggerRef}
                type="button"
                onClick={() => setLoginOpen(true)}
                className="inline-flex items-center gap-2 rounded-md border border-white/40 bg-white/10 px-5 py-3 font-semibold text-white backdrop-blur transition hover:bg-white/20"
              >
                Iniciar sesion
              </button>
            )}
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <div className="grid gap-6 md:grid-cols-3">
          {[
            { icon: Users, k: "+3.200", v: "Estudiantes activos" },
            { icon: Trophy, k: "18", v: "Disciplinas deportivas" },
            { icon: Activity, k: "+450", v: "Reservas mensuales" },
          ].map((s) => (
            <div
              key={s.v}
              className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-soft)] flex items-center gap-4"
            >
              <div className="rounded-xl bg-accent p-3">
                <s.icon className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-primary">{s.k}</p>
                <p className="text-sm text-muted-foreground">{s.v}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {loginOpen && (
        <LoginModal
          triggerElement={triggerRef.current}
          onClose={() => setLoginOpen(false)}
        />
      )}
    </>
  );
}
