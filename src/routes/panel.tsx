import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Sparkles, ClipboardList, MapPin } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { RequireAuth } from "@/components/RequireAuth";
import { ReservasGeneral } from "@/components/reservas/ReservasGeneral";
import { DeportesGeneral } from "@/components/deportes/DeportesGeneral";
import { ArticulosGeneral } from "@/components/articulos/ArticulosGeneral";
import { CategoriasGeneral } from "@/components/categorias/CategoriasGeneral";
import { RolesGeneral } from "@/components/roles/RolesGeneral";
import { UsuariosGeneral } from "@/components/usuarios/UsuariosGeneral";
import { EspaciosGeneral } from "@/components/espacios/EspaciosGeneral";

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
  if (seccion === "espacios" && user.role === "administrador") return <EspaciosGeneral />;
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

/* ═══════════ INICIO ═══════════ */
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
          {
            to: "/panel" as const,
            search: { seccion: "espacios" },
            label: "Escenarios deportivos",
            desc: "Gestiona espacios y solicitudes de reserva",
            icon: MapPin,
          },
        ]
      : []),
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
    </div>
  );
}