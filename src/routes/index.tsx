import { createFileRoute, Link } from "@tanstack/react-router";
import {
  CalendarCheck,
  Package,
  Trophy,
  Clock,
  ArrowRight,
  Activity,
  Users,
  ShieldCheck,
  UserCircle,
  ClipboardList,
  Bell,
  Sparkles,
} from "lucide-react";
import hero from "@/assets/hero-deportes.jpg";
import { useAuth } from "@/lib/auth";

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
  component: Index,
});

const features = [
  {
    icon: Clock,
    title: "Horarios Deportivos",
    desc: "Consulta y administra los horarios de cada disciplina.",
    to: "/horarios",
  },
  {
    icon: CalendarCheck,
    title: "Reserva de Implementos",
    desc: "Solicita el préstamo de artículos deportivos en pocos clics.",
    to: "/reservas",
  },
  {
    icon: Package,
    title: "Inventario Deportivo",
    desc: "Control de balones, raquetas, conos y más, disponible para administradores y profesores.",
    to: "/inventario",
  },
] as const;

function Index() {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <AuthenticatedHome /> : <PublicHome />;
}

function AuthenticatedHome() {
  const { user } = useAuth();
  if (!user) return null;

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Buenos días" : hour < 19 ? "Buenas tardes" : "Buenas noches";

  const quickActions = [
    {
      to: "/reservas",
      label: "Reservar implemento",
      desc: "Solicita un préstamo en minutos",
      icon: CalendarCheck,
    },
    {
      to: "/deportes",
      label: "Inscribirme a un deporte",
      desc: "Explora las disciplinas activas",
      icon: Trophy,
    },
    {
      to: "/horarios",
      label: "Ver horarios",
      desc: "Consulta entrenamientos y canchas",
      icon: Clock,
    },
    {
      to: "/perfil/datos-personales",
      label: "Actualizar mi perfil",
      desc: "Mantén tu información al día",
      icon: UserCircle,
    },
  ] as const;

  const adminActions = [
    { to: "/inventario", label: "Inventario", icon: Package },
    { to: "/registros", label: "Registros", icon: ClipboardList },
  ] as const;

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
            {greeting}, {user.nombre.split(" ")[0]} 👋
          </h1>
          <p className="mt-2 max-w-2xl text-sm md:text-base opacity-95">
            Bienvenido a tu espacio de Bienestar Deportivo UPC. Desde aquí puedes gestionar tus
            reservas, inscripciones y consultar lo que se viene esta semana.
          </p>
          <div className="mt-5 flex flex-wrap gap-2 text-xs">
            <span className="rounded-full bg-white/15 px-3 py-1 capitalize">Rol: {user.role}</span>
            <span className="rounded-full bg-white/15 px-3 py-1">{user.email}</span>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-3">Acciones rápidas</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {quickActions.map((a) => (
            <Link
              key={a.to}
              to={a.to}
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

      <div className="grid gap-6 lg:grid-cols-3">
        <section className="lg:col-span-2 rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-soft)]">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Próximas actividades</h2>
            <Link
              to="/horarios"
              className="text-xs font-semibold text-primary inline-flex items-center gap-1"
            >
              Ver todas <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
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

      {(user.role === "admin" || user.role === "profesor") && (
        <section className="rounded-2xl border border-border bg-card p-6">
          <div className="flex items-center gap-2 mb-3">
            <ShieldCheck className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">Gestión ({user.role})</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {adminActions.map((a) => (
              <Link
                key={a.to}
                to={a.to}
                className="flex items-center gap-3 rounded-xl border border-border p-4 hover:border-primary hover:bg-accent/40 transition"
              >
                <div className="rounded-lg bg-accent p-2 text-primary">
                  <a.icon className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm">{a.label}</p>
                  <p className="text-xs text-muted-foreground">Ir al módulo</p>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function PublicHome() {
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
            Reserva implementos, inscríbete a disciplinas y mantente al día con los horarios del
            área de Bienestar Deportivo de la UPC.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/registro"
              className="inline-flex items-center gap-2 rounded-md bg-white px-5 py-3 font-semibold text-primary shadow-[var(--shadow-elegant)] transition hover:scale-[1.02]"
            >
              Regístrate <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 rounded-md border border-white/40 bg-white/10 px-5 py-3 font-semibold text-white backdrop-blur transition hover:bg-white/20"
            >
              Iniciar sesión
            </Link>
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

      <section className="container mx-auto px-4 pb-20">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <p className="text-sm font-semibold uppercase tracking-widest text-secondary">
            Módulos del sistema
          </p>
          <h2 className="mt-2 text-3xl md:text-4xl font-bold text-foreground">
            Todo lo que necesitas para hacer deporte
          </h2>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <Link
              key={f.to}
              to={f.to}
              className="group rounded-2xl border border-border bg-card p-6 transition hover:border-primary hover:shadow-[var(--shadow-elegant)]"
            >
              <div className="inline-flex rounded-xl bg-accent p-3 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition">
                <f.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-lg font-semibold">{f.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{f.desc}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary">
                Ir al módulo <ArrowRight className="h-4 w-4" />
              </span>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
