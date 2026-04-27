import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Package, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/reservas/articulos")({
  head: () => ({ meta: [{ title: "Reservar artículos — UPC" }] }),
  component: ReservasArticulosPage,
});

const articulos = [
  { id: 1, nombre: "Balón de fútbol", disponible: true },
  { id: 2, nombre: "Balón de baloncesto", disponible: true },
  { id: 3, nombre: "Raqueta de tenis", disponible: false },
  { id: 4, nombre: "Red de voleibol", disponible: true },
  { id: 5, nombre: "Conos de entrenamiento", disponible: true },
  { id: 6, nombre: "Petos de equipo", disponible: true },
  { id: 7, nombre: "Silbato", disponible: true },
  { id: 8, nombre: "Cronómetro", disponible: false },
];

function ReservasArticulosPage() {
  const [selected, setSelected] = useState<number | null>(null);
  const [done, setDone] = useState(false);
  const [form, setForm] = useState({
    id_prestamo: "",
    id_articulo: "",
    id_responsable: "",
    fecha_prestamo: "",
    fecha_devolucion: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selected && form.id_prestamo && form.id_responsable && form.fecha_prestamo && form.fecha_devolucion) {
      setDone(true);
    }
  };

  const articuloSeleccionado = articulos.find((a) => a.id === selected);

  return (
    <>
      <PageHeader
        title="Reservar Artículos Deportivos"
        subtitle="Solicita préstamos de implementos y artículos deportivos."
      />

      <section className="container mx-auto px-4 py-10 grid gap-8 lg:grid-cols-3">
        <form
          onSubmit={handleSubmit}
          className="lg:col-span-2 rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-soft)]"
        >
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Package className="h-5 w-5 text-primary" /> Nueva reserva de artículo
          </h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className="text-sm font-medium">Seleccionar artículo</label>
              <div className="mt-2 grid gap-2 sm:grid-cols-2">
                {articulos.map((a) => (
                  <button
                    key={a.id}
                    type="button"
                    onClick={() => setSelected(a.id)}
                    disabled={!a.disponible}
                    className={`p-3 rounded-lg border text-left transition ${
                      selected === a.id
                        ? "border-primary bg-primary/10 ring-2 ring-primary"
                        : a.disponible
                        ? "border-border hover:border-primary/50"
                        : "border-border bg-muted/50 cursor-not-allowed opacity-50"
                    }`}
                  >
                    <p className="font-medium">{a.nombre}</p>
                    <p className="text-xs text-muted-foreground">
                      {a.disponible ? "Disponible" : "No disponible"}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">ID Préstamo</label>
              <input
                type="text"
                value={form.id_prestamo}
                onChange={(e) => setForm({ ...form, id_prestamo: e.target.value })}
                placeholder="ID del préstamo"
                className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <div>
              <label className="text-sm font-medium">ID Responsable</label>
              <input
                type="text"
                required
                value={form.id_responsable}
                onChange={(e) => setForm({ ...form, id_responsable: e.target.value })}
                placeholder="ID del responsable"
                className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Fecha Préstamo</label>
              <input
                type="date"
                required
                value={form.fecha_prestamo}
                onChange={(e) => setForm({ ...form, fecha_prestamo: e.target.value })}
                className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Fecha Devolución</label>
              <input
                type="date"
                required
                value={form.fecha_devolucion}
                onChange={(e) => setForm({ ...form, fecha_devolucion: e.target.value })}
                className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={!selected || !form.id_prestamo || !form.id_responsable || !form.fecha_prestamo || !form.fecha_devolucion}
                className="w-full inline-flex items-center justify-center gap-2 rounded-md bg-primary py-2.5 font-semibold text-primary-foreground shadow-[var(--shadow-soft)] hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Package className="h-4 w-4" /> Confirmar reserva
              </button>
            </div>
          </div>
        </form>

        <div className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-soft)]">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Package className="h-5 w-5 text-primary" /> Mi reserva
          </h2>
          {done && articuloSeleccionado ? (
            <div className="mt-4 rounded-lg bg-secondary/15 p-4 text-center">
              <CheckCircle2 className="mx-auto h-10 w-10 text-secondary" />
              <p className="mt-2 font-semibold">Reserva confirmada</p>
              <p className="text-sm text-muted-foreground">{articuloSeleccionado.nombre}</p>
              <p className="text-sm text-muted-foreground">
                {form.fecha_prestamo} - {form.fecha_devolucion}
              </p>
              <p className="text-sm text-muted-foreground">
                ID Préstamo: {form.id_prestamo}
              </p>
              <p className="text-sm text-muted-foreground">
                Responsable: {form.id_responsable}
              </p>
              <button
                onClick={() => {
                  setDone(false);
                  setSelected(null);
                  setForm({
                    id_prestamo: "",
                    id_articulo: "",
                    id_responsable: "",
                    fecha_prestamo: "",
                    fecha_devolucion: "",
                  });
                }}
                className="mt-3 text-sm text-primary hover:underline"
              >
                Hacer otra reserva
              </button>
            </div>
          ) : (
            <p className="mt-4 text-sm text-muted-foreground">
              No tienes reservas activas. Completa el formulario para reservar un artículo deportivo.
            </p>
          )}
        </div>
      </section>
    </>
  );
}
