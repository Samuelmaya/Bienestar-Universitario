import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { Plus, MapPin } from "lucide-react";

import { RequireAuth } from "@/components/RequireAuth";

export const Route = createFileRoute("/horarios")({
  head: () => ({ meta: [{ title: "Horarios Deportivos — UPC" }] }),
  component: ProtectedHorarios,
});

function ProtectedHorarios() {
  return (
    <RequireAuth>
      <HorariosPage />
    </RequireAuth>
  );
}

const dias = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"] as const;
const horas = ["6:00", "8:00", "10:00", "2:00", "4:00", "6:00 PM"] as const;

type Slot = { d: string; titulo: string; lugar: string };
const eventos: Slot[] = [
  { d: "Lunes-6:00", titulo: "Atletismo", lugar: "Pista Olímpica" },
  { d: "Lunes-4:00", titulo: "Fútbol Sala", lugar: "Cancha Central" },
  { d: "Martes-8:00", titulo: "Baloncesto", lugar: "Coliseo Mayor" },
  { d: "Martes-6:00 PM", titulo: "Voleibol", lugar: "Coliseo Mayor" },
  { d: "Miércoles-10:00", titulo: "Tenis de mesa", lugar: "Sala Multiusos" },
  { d: "Miércoles-4:00", titulo: "Fútbol", lugar: "Cancha Central" },
  { d: "Jueves-6:00", titulo: "Atletismo", lugar: "Pista Olímpica" },
  { d: "Jueves-2:00", titulo: "Boxeo", lugar: "Gimnasio" },
  { d: "Viernes-4:00", titulo: "Voleibol", lugar: "Coliseo Mayor" },
  { d: "Viernes-6:00 PM", titulo: "Baloncesto", lugar: "Coliseo Mayor" },
  { d: "Sábado-8:00", titulo: "Atletismo", lugar: "Pista Olímpica" },
];

function HorariosPage() {
  return (
    <>
      <PageHeader
        title="Gestión de Horarios Deportivos"
        subtitle="Programa de entrenamientos y prácticas semanales."
        actions={
          <button className="inline-flex items-center gap-2 rounded-md bg-white px-4 py-2 font-semibold text-primary shadow">
            <Plus className="h-4 w-4" /> Nuevo horario
          </button>
        }
      />
      <section className="container mx-auto px-4 py-10">
        <div className="rounded-2xl border border-border bg-card overflow-hidden">
          <div className="overflow-x-auto">
            <div
              className="min-w-[900px] grid"
              style={{ gridTemplateColumns: `120px repeat(${dias.length}, minmax(140px, 1fr))` }}
            >
              <div className="bg-muted px-3 py-3 text-xs font-semibold uppercase text-muted-foreground border-b border-r border-border">
                Hora
              </div>
              {dias.map((d) => (
                <div
                  key={d}
                  className="bg-muted px-3 py-3 text-center text-xs font-semibold uppercase text-muted-foreground border-b border-border"
                >
                  {d}
                </div>
              ))}

              {horas.map((h) => (
                <div key={h} className="contents">
                  <div className="px-3 py-4 text-sm font-medium border-b border-r border-border">
                    {h}
                  </div>
                  {dias.map((d) => {
                    const ev = eventos.find((e) => e.d === `${d}-${h}`);
                    return (
                      <div
                        key={d + h}
                        className="border-b border-border p-2 min-h-[80px] hover:bg-accent/40 transition"
                      >
                        {ev && (
                          <div className="rounded-lg bg-[image:var(--gradient-primary)] text-primary-foreground p-2 text-xs h-full">
                            <p className="font-semibold">{ev.titulo}</p>
                            <p className="opacity-90 flex items-center gap-1 mt-1">
                              <MapPin className="h-3 w-3" /> {ev.lugar}
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 grid md:grid-cols-3 gap-4">
          {[
            { l: "Cancha Central", h: "Fútbol, Fútbol Sala" },
            { l: "Coliseo Mayor", h: "Baloncesto, Voleibol" },
            { l: "Pista Olímpica", h: "Atletismo" },
          ].map((e) => (
            <div key={e.l} className="rounded-xl border border-border bg-card p-5">
              <MapPin className="h-5 w-5 text-primary" />
              <p className="mt-2 font-semibold">{e.l}</p>
              <p className="text-sm text-muted-foreground">{e.h}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
