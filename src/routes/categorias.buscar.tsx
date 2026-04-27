import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { RequireAuth } from "@/components/RequireAuth";
import { Search, FolderOpen, AlertCircle } from "lucide-react";

export const Route = createFileRoute("/categorias/buscar")({
  head: () => ({ meta: [{ title: "Buscar categoría — UPC" }] }),
  component: () => (
    <RequireAuth roles={["admin", "utilero"]}>
      <BuscarCategoriaPage />
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

function BuscarCategoriaPage() {
  const [searchId, setSearchId] = useState("");
  const [foundCategory, setFoundCategory] = useState<typeof categoriasEjemplo[0] | null>(null);
  const [searchError, setSearchError] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchError("");
    setFoundCategory(null);

    if (!searchId.trim()) {
      setSearchError("Por favor ingresa un ID de categoría");
      return;
    }

    const categoryId = parseInt(searchId);
    const category = categoriasEjemplo.find((c) => c.id_categoria === categoryId);

    if (category) {
      setFoundCategory(category);
    } else {
      setSearchError(`No se encontró ninguna categoría con ID: ${searchId}`);
    }
  };

  return (
    <>
      <PageHeader
        title="Buscar Categoría"
        subtitle="Busca categorías por su ID en el sistema."
      />

      <section className="container mx-auto px-4 py-10">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-soft)]">
          <h2 className="text-xl font-semibold flex items-center gap-2 mb-6">
            <Search className="h-5 w-5 text-primary" /> Buscar por ID
          </h2>
          <form onSubmit={handleSearch} className="flex gap-4 mb-6">
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
            <div className="rounded-lg bg-destructive/15 p-4 flex items-center gap-3 mb-6">
              <AlertCircle className="h-5 w-5 text-destructive" />
              <p className="text-sm text-destructive">{searchError}</p>
            </div>
          )}

          {/* Resultado de búsqueda */}
          {foundCategory && (
            <div className="rounded-lg bg-secondary/15 p-6">
              <div className="flex items-center gap-3 mb-4">
                <FolderOpen className="h-8 w-8 text-primary" />
                <div>
                  <h3 className="font-semibold text-lg">{foundCategory.nombre}</h3>
                  <p className="text-sm text-muted-foreground">ID: {foundCategory.id_categoria}</p>
                </div>
              </div>
              <div className="grid gap-3 text-sm">
                <div className="flex justify-between">
                  <span className="font-medium">ID Categoría:</span>
                  <span>{foundCategory.id_categoria}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Nombre:</span>
                  <span>{foundCategory.nombre}</span>
                </div>
              </div>
            </div>
          )}

          {/* Información de categorías disponibles */}
          {!foundCategory && !searchError && (
            <div className="rounded-lg border border-border p-4">
              <h3 className="font-semibold mb-3">Categorías disponibles</h3>
              <div className="grid gap-2 text-sm">
                {categoriasEjemplo.map((category) => (
                  <div key={category.id_categoria} className="flex justify-between p-2 bg-muted/30 rounded">
                    <span>ID: {category.id_categoria}</span>
                    <span>{category.nombre}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
