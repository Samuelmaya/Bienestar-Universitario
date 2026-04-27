import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { RequireAuth } from "@/components/RequireAuth";
import { Edit, Search, FolderOpen, CheckCircle2, AlertCircle } from "lucide-react";

export const Route = createFileRoute("/categorias/actualizar")({
  head: () => ({ meta: [{ title: "Actualizar categoría — UPC" }] }),
  component: () => (
    <RequireAuth roles={["admin", "utilero"]}>
      <ActualizarCategoriaPage />
    </RequireAuth>
  ),
});

// Datos de ejemplo
const categoriasEjemplo = [
  {
    id_categoria: 1,
    nombre: "Fútbol",
  },
  {
    id_categoria: 2,
    nombre: "Baloncesto",
  },
  {
    id_categoria: 3,
    nombre: "Voleibol",
  },
  {
    id_categoria: 4,
    nombre: "Tenis",
  },
  {
    id_categoria: 5,
    nombre: "Natación",
  },
];

function ActualizarCategoriaPage() {
  const [searchId, setSearchId] = useState("");
  const [foundCategory, setFoundCategory] = useState<typeof categoriasEjemplo[0] | null>(null);
  const [searchError, setSearchError] = useState("");
  const [updated, setUpdated] = useState(false);
  const [form, setForm] = useState({
    nombre: "",
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchError("");
    setFoundCategory(null);
    setUpdated(false);

    if (!searchId.trim()) {
      setSearchError("Por favor ingresa un ID de categoría");
      return;
    }

    const categoryId = parseInt(searchId);
    const category = categoriasEjemplo.find((c) => c.id_categoria === categoryId);

    if (category) {
      setFoundCategory(category);
      setForm({
        nombre: category.nombre,
      });
    } else {
      setSearchError(`No se encontró ninguna categoría con ID: ${searchId}`);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (foundCategory && form.nombre) {
      // Aquí iría la lógica para actualizar la categoría
      setUpdated(true);
    }
  };

  return (
    <>
      <PageHeader
        title="Actualizar Categoría"
        subtitle="Busca y actualiza la información de las categorías existentes."
      />

      <section className="container mx-auto px-4 py-10">
        {/* Búsqueda de categoría */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-soft)] mb-8">
          <h2 className="text-xl font-semibold flex items-center gap-2 mb-6">
            <Search className="h-5 w-5 text-primary" /> Buscar categoría a actualizar
          </h2>
          <form onSubmit={handleSearch} className="flex gap-4">
            <input
              type="number"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              placeholder="Ingresa el ID de la categoría"
              className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-6 py-2 font-semibold text-primary-foreground shadow-[var(--shadow-soft)] hover:opacity-90"
            >
              <Search className="h-4 w-4" /> Buscar
            </button>
          </form>

          {/* Mensaje de error */}
          {searchError && (
            <div className="mt-4 rounded-lg bg-destructive/15 p-4 flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-destructive" />
              <p className="text-sm text-destructive">{searchError}</p>
            </div>
          )}

          {/* Categoría encontrada y formulario de actualización */}
          {foundCategory && !updated && (
            <div className="mt-6">
              <div className="rounded-lg border border-border p-4 mb-6">
                <div className="flex items-center gap-3">
                  <FolderOpen className="h-8 w-8 text-primary" />
                  <div>
                    <h3 className="font-semibold text-lg">{foundCategory.nombre}</h3>
                    <p className="text-sm text-muted-foreground">ID: {foundCategory.id_categoria}</p>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Edit className="h-5 w-5 text-primary" /> Editar información
                </h3>
                
                <div>
                  <label className="text-sm font-medium">Nombre</label>
                  <input
                    type="text"
                    required
                    value={form.nombre}
                    onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                    className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={!form.nombre}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-md bg-primary py-2.5 font-semibold text-primary-foreground shadow-[var(--shadow-soft)] hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Edit className="h-4 w-4" /> Actualizar categoría
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Confirmación de actualización */}
          {updated && foundCategory && (
            <div className="mt-6 rounded-lg bg-green-50 border border-green-200 p-6 text-center">
              <CheckCircle2 className="mx-auto h-12 w-12 text-green-600 mb-4" />
              <h3 className="font-semibold text-green-800 text-lg mb-2">Categoría actualizada exitosamente</h3>
              <div className="text-left text-sm text-green-700 mb-4 max-w-md mx-auto">
                <p><strong>ID:</strong> {foundCategory.id_categoria}</p>
                <p><strong>Nombre:</strong> {form.nombre}</p>
              </div>
              <button
                onClick={() => {
                  setUpdated(false);
                  setFoundCategory(null);
                  setSearchId("");
                }}
                className="inline-flex items-center justify-center gap-2 rounded-md bg-green-600 px-4 py-2 font-semibold text-white hover:opacity-90"
              >
                Actualizar otra categoría
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
