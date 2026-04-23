import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { RequireAuth } from "@/components/RequireAuth";
import {
  Trophy,
  Plus,
  Users,
  Volleyball,
  Dumbbell,
  Goal,
  Activity,
  Edit,
} from "lucide-react";

export const Route = createFileRoute("/deportes")({
  head: () => ({ meta: [{ title: "Gestión de Deportes — UPC" }] }),
  component: ProtectedDeportes,
});

function ProtectedDeportes() {
  return (
    <RequireAuth>
      <DeportesPage />
    </RequireAuth>
  );
}

const deportes = [
  { n: "Fútbol", entr: "Carlos Mendoza", insc: 84, dias: "Lun-Mié-Vie", icon: Goal },
  { n: "Baloncesto", entr: "Laura Pérez", insc: 52, dias: "Mar-Jue", icon: Trophy },
  { n: "Voleibol", entr: "Ana Torres", insc: 41, dias: "Lun-Mié", icon: Volleyball },
  { n: "Atletismo", entr: "Jorge Salas", insc: 67, dias: "Mar-Jue-Sáb", icon: Activity },
  { n: "Tenis de mesa", entr: "Miguel Rojas", insc: 24, dias: "Mié-Vie", icon: Dumbbell },
  { n: "Boxeo", entr: "Iván Caballero", insc: 19, dias: "Lun-Vie", icon: Dumbbell },
];

function DeportesPage() {
  return (
    <>
      <PageHeader
        title="Gestión de Deportes"
        subtitle="Disciplinas ofertadas, entrenadores y participantes inscritos."
        actions={
          <button className="inline-flex items-center gap-2 rounded-md bg-white px-4 py-2 font-semibold text-primary shadow">
            <Plus className="h-4 w-4" /> Nuevo deporte
          </button>
        }
      />
      <section className="container mx-auto px-4 py-10">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {deportes.map((d) => (
            <article
              key={d.n}
              className="rounded-2xl border border-border bg-card p-6 hover:shadow-[var(--shadow-elegant)] transition"
            >
              <div className="flex items-start justify-between">
                <div className="rounded-xl bg-accent p-3 text-primary">
                  <d.icon className="h-6 w-6" />
                </div>
                <button className="text-muted-foreground hover:text-primary">
                  <Edit className="h-4 w-4" />
                </button>
              </div>
              <h3 className="mt-4 text-xl font-semibold">{d.n}</h3>
              <p className="text-sm text-muted-foreground mt-1">Entrenador: {d.entr}</p>
              <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-lg bg-muted p-3">
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Users className="h-3 w-3" /> Inscritos
                  </p>
                  <p className="font-bold text-primary text-lg">{d.insc}</p>
                </div>
                <div className="rounded-lg bg-muted p-3">
                  <p className="text-xs text-muted-foreground">Días</p>
                  <p className="font-semibold text-sm">{d.dias}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
