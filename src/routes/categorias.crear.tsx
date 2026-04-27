import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { RequireAuth } from "@/components/RequireAuth";
import { FolderOpen, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/categorias/crear")({
  head: () => ({ meta: [{ title: "Crear categoría — UPC" }] }),
  component: () => (
    <RequireAuth roles={["admin", "utilero"]}>
      <CrearCategoriaPage />
    </RequireAuth>
  ),
});

function CrearCategoriaPage() {
  const [done, setDone] = useState(false);
  const [form, setForm] = useState({
    id_categoria: "",
    nombre: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.id_categoria && form.nombre) {
      setDone(true);
    }
  };

  return (
    <>
      <PageHeader
        title="Crear Categoría"
        subtitle="Registra una nueva categoría en el sistema."
      />

      <section className="container mx-auto px-4 py-10 grid gap-8 lg:grid-cols-3">
        <form
          onSubmit={handleSubmit}
          className="lg:col-span-2 rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-soft)]"
        >
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <FolderOpen className="h-5 w-5 text-primary" /> Datos de la categoría
          </h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium">ID Categoría</label>
              <input
                type="number"
                required
                value={form.id_categoria}
                onChange={(e) => setForm({ ...form, id_categoria: e.target.value })}
                placeholder="Ingresa el ID de la categoría"
                className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Nombre</label>
              <input
                type="text"
                required
                value={form.nombre}
                onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                placeholder="Ingresa el nombre de la categoría"
                className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={!form.id_categoria || !form.nombre}
                className="w-full inline-flex items-center justify-center gap-2 rounded-md bg-primary py-2.5 font-semibold text-primary-foreground shadow-[var(--shadow-soft)] hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FolderOpen className="h-4 w-4" /> Crear categoría
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
              <p className="mt-2 font-semibold">Categoría creada exitosamente</p>
              <p className="text-sm text-muted-foreground">
                ID: {form.id_categoria}
              </p>
              <p className="text-sm text-muted-foreground">
                Nombre: {form.nombre}
              </p>
              <button
                onClick={() => {
                  setDone(false);
                  setForm({
                    id_categoria: "",
                    nombre: "",
                  });
                }}
                className="mt-3 text-sm text-primary hover:underline"
              >
                Crear otra categoría
              </button>
            </div>
          ) : (
            <p className="mt-4 text-sm text-muted-foreground">
              Completa el formulario para crear una nueva categoría en el sistema.
            </p>
          )}
        </div>
      </section>
    </>
  );
}
