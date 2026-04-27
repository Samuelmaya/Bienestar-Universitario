import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Trophy, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/deportes/crear")({
  head: () => ({ meta: [{ title: "Crear deporte — UPC" }] }),
  component: DeportesCrearPage,
});

function DeportesCrearPage() {
  const [done, setDone] = useState(false);
  const [form, setForm] = useState({
    cod_deporte: "",
    nom_deporte: "",
    cupo_maximo: "",
    descripcion: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.cod_deporte && form.nom_deporte && form.cupo_maximo && form.descripcion) {
      setDone(true);
    }
  };

  return (
    <>
      <PageHeader
        title="Crear Deporte"
        subtitle="Registra un nuevo deporte en el sistema."
      />

      <section className="container mx-auto px-4 py-10 grid gap-8 lg:grid-cols-3">
        <form
          onSubmit={handleSubmit}
          className="lg:col-span-2 rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-soft)]"
        >
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Trophy className="h-5 w-5 text-primary" /> Datos del deporte
          </h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium">Código Deporte</label>
              <input
                type="number"
                required
                value={form.cod_deporte}
                onChange={(e) => setForm({ ...form, cod_deporte: e.target.value })}
                placeholder="Ingresa el código del deporte"
                className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Nombre Deporte</label>
              <input
                type="text"
                required
                value={form.nom_deporte}
                onChange={(e) => setForm({ ...form, nom_deporte: e.target.value })}
                placeholder="Ingresa el nombre del deporte"
                className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Cupo Máximo</label>
              <input
                type="number"
                required
                value={form.cupo_maximo}
                onChange={(e) => setForm({ ...form, cupo_maximo: e.target.value })}
                placeholder="Ingresa el cupo máximo"
                className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-sm font-medium">Descripción</label>
              <textarea
                required
                value={form.descripcion}
                onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
                placeholder="Ingresa una descripción del deporte"
                rows={4}
                className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring resize-none"
              />
            </div>

            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={!form.cod_deporte || !form.nom_deporte || !form.cupo_maximo || !form.descripcion}
                className="w-full inline-flex items-center justify-center gap-2 rounded-md bg-primary py-2.5 font-semibold text-primary-foreground shadow-[var(--shadow-soft)] hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Trophy className="h-4 w-4" /> Crear deporte
              </button>
            </div>
          </div>
        </form>

        <div className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-soft)]">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-primary" /> Confirmación
          </h2>
          {done ? (
            <div className="mt-4 rounded-lg bg-secondary/15 p-4 text-center">
              <CheckCircle2 className="mx-auto h-10 w-10 text-secondary" />
              <p className="mt-2 font-semibold">Deporte creado exitosamente</p>
              <div className="mt-3 text-sm text-left space-y-1">
                <p><strong>Código:</strong> {form.cod_deporte}</p>
                <p><strong>Nombre:</strong> {form.nom_deporte}</p>
                <p><strong>Cupo máximo:</strong> {form.cupo_maximo}</p>
                <p><strong>Descripción:</strong> {form.descripcion}</p>
              </div>
              <button
                onClick={() => {
                  setDone(false);
                  setForm({
                    cod_deporte: "",
                    nom_deporte: "",
                    cupo_maximo: "",
                    descripcion: "",
                  });
                }}
                className="mt-3 text-sm text-primary hover:underline"
              >
                Crear otro deporte
              </button>
            </div>
          ) : (
            <p className="mt-4 text-sm text-muted-foreground">
              Completa el formulario para crear un nuevo deporte en el sistema.
            </p>
          )}
        </div>
      </section>
    </>
  );
}
