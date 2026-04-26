import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { MapPin, CalendarCheck, Clock, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/reservas/lugares")({
  head: () => ({ meta: [{ title: "Reservar lugares deportivos — UPC" }] }),
  component: ReservasLugaresPage,
});

const lugares = [
  { id: 1, nombre: "Cancha de fútbol", capacidad: "22 jugadores", horario: "6:00 AM - 10:00 PM" },
  { id: 2, nombre: "Cancha de baloncesto", capacidad: "10 jugadores", horario: "6:00 AM - 10:00 PM" },
  { id: 3, nombre: "Cancha de voleibol", capacidad: "12 jugadores", horario: "6:00 AM - 10:00 PM" },
  { id: 4, nombre: "Cancha de tenis", capacidad: "4 jugadores", horario: "6:00 AM - 10:00 PM" },
  { id: 5, nombre: "Cancha de tenis de mesa", capacidad: "4 jugadores", horario: "6:00 AM - 10:00 PM" },
  { id: 6, nombre: "Gimnasio", capacidad: "30 personas", horario: "6:00 AM - 10:00 PM" },
  { id: 7, nombre: "Piscina", capacidad: "20 personas", horario: "6:00 AM - 8:00 PM" },
  { id: 8, nombre: "Pista de atletismo", capacidad: "50 personas", horario: "5:00 AM - 9:00 PM" },
];

function ReservasLugaresPage() {
  const [done, setDone] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);
  const [form, setForm] = useState({
    id_reserva: "",
    reserva_est: "",
    fecha: "",
    hora: "",
    estado: "pendiente",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selected && form.fecha && form.hora && form.reserva_est) {
      setDone(true);
    }
  };

  const lugarSeleccionado = lugares.find((l) => l.id === selected);

  return (
    <>
      <PageHeader
        title="Reserva de Lugares Deportivos"
        subtitle="Reserva canchas, gimnasios y demás espacios deportivos."
      />

      <section className="container mx-auto px-4 py-10 grid gap-8 lg:grid-cols-3">
        <form
          onSubmit={handleSubmit}
          className="lg:col-span-2 rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-soft)]"
        >
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" /> Nueva reserva de lugar
          </h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className="text-sm font-medium">Seleccionar lugar</label>
              <div className="mt-2 grid gap-2 sm:grid-cols-2">
                {lugares.map((l) => (
                  <button
                    key={l.id}
                    type="button"
                    onClick={() => setSelected(l.id)}
                    className={`p-3 rounded-lg border text-left transition ${
                      selected === l.id
                        ? "border-primary bg-primary/10 ring-2 ring-primary"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <p className="font-medium">{l.nombre}</p>
                    <p className="text-xs text-muted-foreground">{l.capacidad}</p>
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium">ID Reserva</label>
              <input
                type="text"
                value={form.id_reserva}
                onChange={(e) => setForm({ ...form, id_reserva: e.target.value })}
                placeholder="ID de reserva"
                className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium">ID Estudiante</label>
              <input
                type="text"
                required
                value={form.reserva_est}
                onChange={(e) => setForm({ ...form, reserva_est: e.target.value })}
                placeholder="ID del estudiante que reserva"
                className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium">Fecha</label>
              <input
                type="date"
                required
                value={form.fecha}
                onChange={(e) => setForm({ ...form, fecha: e.target.value })}
                className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium">Hora</label>
              <input
                type="time"
                required
                value={form.hora}
                onChange={(e) => setForm({ ...form, hora: e.target.value })}
                className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium">Estado</label>
              <select
                value={form.estado}
                onChange={(e) => setForm({ ...form, estado: e.target.value })}
                className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="pendiente">Pendiente</option>
                <option value="confirmada">Confirmada</option>
                <option value="cancelada">Cancelada</option>
              </select>
            </div>
            
            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={!selected || !form.fecha || !form.hora || !form.reserva_est}
                className="w-full inline-flex items-center justify-center gap-2 rounded-md bg-primary py-2.5 font-semibold text-primary-foreground shadow-[var(--shadow-soft)] hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <CalendarCheck className="h-4 w-4" /> Confirmar reserva
              </button>
            </div>
          </div>
        </form>

        <div className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-soft)]">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" /> Mis reservas
          </h2>
          {done && lugarSeleccionado ? (
            <div className="mt-4 rounded-lg bg-secondary/15 p-4 text-center">
              <CheckCircle2 className="mx-auto h-10 w-10 text-secondary" />
              <p className="mt-2 font-semibold">Reserva confirmada</p>
              <p className="text-sm text-muted-foreground">{lugarSeleccionado.nombre}</p>
              <p className="text-sm text-muted-foreground">
                {form.fecha} a las {form.hora}
              </p>
              <p className="text-sm text-muted-foreground">
                ID Reserva: {form.id_reserva}
              </p>
              <p className="text-sm text-muted-foreground">
                Estudiante: {form.reserva_est}
              </p>
              <p className="text-sm text-muted-foreground">
                Estado: {form.estado}
              </p>
              <button
                onClick={() => {
                  setDone(false);
                  setSelected(null);
                  setForm({ id_reserva: "", reserva_est: "", fecha: "", hora: "", estado: "pendiente" });
                }}
                className="mt-3 text-sm text-primary hover:underline"
              >
                Hacer otra reserva
              </button>
            </div>
          ) : (
            <p className="mt-4 text-sm text-muted-foreground">
              No tienes reservas activas. Completa el formulario para reservar un lugar deportivo.
            </p>
          )}
        </div>
      </section>
    </>
  );
}
