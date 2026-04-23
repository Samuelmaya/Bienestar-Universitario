import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { RequireAuth } from "@/components/RequireAuth";
import { CalendarCheck, Clock, User, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/reservas")({
  head: () => ({ meta: [{ title: "Reservar implementos — UPC" }] }),
  component: ProtectedReservas,
});

function ProtectedReservas() {
  return (
    <RequireAuth>
      <ReservasPage />
    </RequireAuth>
  );
}

const articulos = [
  "Balón de fútbol",
  "Balón de baloncesto",
  "Raqueta de tenis",
  "Red de voleibol",
  "Conos de entrenamiento",
  "Guantes de boxeo",
];

function ReservasPage() {
  const [done, setDone] = useState(false);

  return (
    <>
      <PageHeader
        title="Reserva de Artículos Deportivos"
        subtitle="Solicita el préstamo de implementos para tus prácticas y entrenamientos."
      />

      <section className="container mx-auto px-4 py-10 grid gap-8 lg:grid-cols-3">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setDone(true);
          }}
          className="lg:col-span-2 rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-soft)]"
        >
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <CalendarCheck className="h-5 w-5 text-primary" /> Nueva reserva
          </h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <Field label="Nombre completo" placeholder="Ej. Luisa Fernández" />
            <Field label="Documento / Código" placeholder="1052..." />
            <Field label="Programa académico" placeholder="Ingeniería de Sistemas" />
            <Field label="Correo institucional" type="email" placeholder="@unicesar.edu.co" />

            <div>
              <label className="text-sm font-medium">Artículo deportivo</label>
              <select className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm">
                {articulos.map((a) => (
                  <option key={a}>{a}</option>
                ))}
              </select>
            </div>
            <Field label="Cantidad" type="number" placeholder="1" />

            <Field label="Fecha de uso" type="date" />
            <div className="grid grid-cols-2 gap-3">
              <Field label="Hora inicio" type="time" />
              <Field label="Hora fin" type="time" />
            </div>

            <div className="md:col-span-2">
              <label className="text-sm font-medium">Observaciones</label>
              <textarea
                rows={3}
                className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                placeholder="Detalles de la actividad..."
              />
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between gap-3">
            <p className="text-xs text-muted-foreground">
              La reserva queda en estado <strong>pendiente</strong> hasta su aprobación.
            </p>
            <button className="rounded-md bg-primary px-5 py-2.5 font-semibold text-primary-foreground shadow-[var(--shadow-soft)] hover:opacity-90">
              Confirmar reserva
            </button>
          </div>

          {done && (
            <div className="mt-5 flex items-center gap-2 rounded-lg bg-secondary/15 text-secondary px-4 py-3 text-sm">
              <CheckCircle2 className="h-4 w-4" /> ¡Reserva enviada con éxito!
            </div>
          )}
        </form>

        <aside className="space-y-4">
          <div className="rounded-2xl border border-border bg-card p-6">
            <h3 className="font-semibold">Mis reservas activas</h3>
            <ul className="mt-4 space-y-3 text-sm">
              {[
                ["Balón de fútbol", "Hoy · 4:00 - 6:00 p.m."],
                ["Raqueta de tenis", "Mañana · 10:00 a.m."],
              ].map(([a, h]) => (
                <li key={a} className="rounded-lg border border-border p-3">
                  <p className="font-medium">{a}</p>
                  <p className="text-muted-foreground flex items-center gap-1 mt-1">
                    <Clock className="h-3.5 w-3.5" /> {h}
                  </p>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl bg-[image:var(--gradient-primary)] text-primary-foreground p-6">
            <User className="h-6 w-6" />
            <p className="mt-2 font-semibold">Recuerda</p>
            <p className="text-sm opacity-90 mt-1">
              Devuelve el material en buen estado dentro del horario acordado.
            </p>
          </div>
        </aside>
      </section>
    </>
  );
}

function Field({
  label,
  ...props
}: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label className="text-sm font-medium">{label}</label>
      <input
        {...props}
        className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
      />
    </div>
  );
}
