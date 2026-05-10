import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Activity, Bell, Sparkles, ClipboardList } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { RequireAuth } from "@/components/RequireAuth";
import { ReservasGeneral } from "@/components/reservas/ReservasGeneral";
import { DeportesGeneral } from "@/components/deportes/DeportesGeneral";
import { ArticulosGeneral } from "@/components/articulos/ArticulosGeneral";
import { CategoriasGeneral } from "@/components/categorias/CategoriasGeneral";
import { RolesGeneral } from "@/components/roles/RolesGeneral";
import { UsuariosGeneral } from "@/components/usuarios/UsuariosGeneral";

type PanelSearch = { seccion?: string };

export const Route = createFileRoute("/panel")({
  validateSearch: (search: Record<string, unknown>): PanelSearch => ({
    seccion: (search.seccion as string) || undefined,
  }),
  head: () => ({
    meta: [
      { title: "Panel — Bienestar Deportivo UPC" },
      { name: "description", content: "Panel principal de gestión de Bienestar Deportivo UPC." },
    ],
  }),
  component: () => (
    <RequireAuth>
      <PanelContent />
    </RequireAuth>
  ),
});

function PanelContent() {
  const { seccion } = Route.useSearch();
  const { user } = useAuth();
  if (!user) return null;

  if (seccion === "reservas" && user.role === "administrador") return <ReservasGeneral />;
  if (seccion === "deportes" && ["administrador", "entrenador"].includes(user.role)) {
    return <DeportesGeneral />;
  }
  if (seccion === "articulos" && ["administrador", "utilero"].includes(user.role)) {
    return <ArticulosGeneral />;
  }
  if (seccion === "categorias" && ["administrador", "utilero"].includes(user.role)) {
    return <CategoriasGeneral />;
  }
  if (seccion === "roles" && user.role === "administrador") return <RolesGeneral />;
  if (seccion === "usuarios" && user.role === "administrador") return <UsuariosGeneral />;
  return <InicioView />;
}

/* ═══════════ INICIO (Dashboard) ═══════════ */
function InicioView() {
  const { user } = useAuth();
  if (!user) return null;
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Buenos días" : hour < 19 ? "Buenas tardes" : "Buenas noches";

  const quickActions = [
    ...(user.role === "administrador"
      ? [
          {
            to: "/panel" as const,
            search: { seccion: "reservas" },
            label: "Gestionar reservas",
            desc: "Administra las solicitudes de préstamo",
            icon: ClipboardList,
          },
        ]
      : []),
  ];

  const proximas = [
    ["Fútbol Sala — Cancha Central", "Hoy · 4:00 p.m."],
    ["Voleibol Femenino — Coliseo", "Mañana · 10:00 a.m."],
    ["Atletismo — Pista Olímpica", "Jueves · 6:30 a.m."],
    ["Baloncesto Mixto", "Viernes · 5:00 p.m."],
  ] as const;

  const avisos = [
    {
      title: "Renovación de carnés deportivos",
      desc: "Acércate a Bienestar antes del viernes para renovar tu carné.",
    },
    {
      title: "Torneo interfacultades",
      desc: "Inscripciones abiertas hasta el 30 de este mes.",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <section className="relative overflow-hidden rounded-2xl border border-border bg-[image:var(--gradient-hero)] p-6 md:p-10 text-primary-foreground shadow-[var(--shadow-elegant)]">
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -bottom-12 -left-12 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
        <div className="relative">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/15 backdrop-blur px-3 py-1 text-xs font-semibold uppercase tracking-widest">
            <Sparkles className="h-3.5 w-3.5" /> Panel personal
          </span>
          <h1 className="mt-3 text-3xl md:text-4xl font-bold leading-tight">
            {greeting}, {user.nombre.split(" ")[0]}
          </h1>
          <p className="mt-2 max-w-2xl text-sm md:text-base opacity-95">
            Bienvenido a tu espacio de Bienestar Deportivo UPC. Desde aquí puedes gestionar tus
            reservas e inscripciones.
          </p>
          <div className="mt-5 flex flex-wrap gap-2 text-xs">
            <span className="rounded-full bg-white/15 px-3 py-1 capitalize">Rol: {user.role}</span>
            <span className="rounded-full bg-white/15 px-3 py-1">{user.email}</span>
          </div>
        </div>
      </section>

      {quickActions.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold mb-3">Acciones rápidas</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {quickActions.map((a) => (
              <Link
                key={a.label}
                to={a.to}
                search={"search" in a ? a.search : undefined}
                className="group rounded-2xl border border-border bg-card p-5 transition hover:border-primary hover:shadow-[var(--shadow-elegant)]"
              >
                <div className="inline-flex rounded-xl bg-accent p-2.5 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition">
                  <a.icon className="h-5 w-5" />
                </div>
                <p className="mt-3 font-semibold">{a.label}</p>
                <p className="mt-1 text-xs text-muted-foreground">{a.desc}</p>
                <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-primary">
                  Abrir <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <section className="lg:col-span-2 rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-soft)]">
          <h2 className="text-lg font-semibold">Próximas actividades</h2>
          <ul className="mt-4 divide-y divide-border">
            {proximas.map(([t, d]) => (
              <li key={t} className="flex items-center justify-between gap-4 py-3 text-sm">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-accent p-2 text-primary">
                    <Activity className="h-4 w-4" />
                  </div>
                  <span className="font-medium">{t}</span>
                </div>
                <span className="text-muted-foreground text-xs whitespace-nowrap">{d}</span>
              </li>
            ))}
          </ul>
        </section>
        <section className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-soft)]">
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">Avisos</h2>
          </div>
          <ul className="mt-4 space-y-3">
            {avisos.map((a) => (
              <li key={a.title} className="rounded-xl border border-border bg-accent/40 p-3">
                <p className="text-sm font-semibold">{a.title}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{a.desc}</p>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
