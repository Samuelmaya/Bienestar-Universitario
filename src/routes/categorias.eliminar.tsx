import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { RequireAuth } from "@/components/RequireAuth";
import { Trash2, Search, FolderOpen, AlertTriangle, CheckCircle2, AlertCircle } from "lucide-react";
import { categoriesApi, type Category } from "@/lib/api";

export const Route = createFileRoute("/categorias/eliminar")({
  head: () => ({ meta: [{ title: "Eliminar categoría — UPC" }] }),
  component: () => (
    <RequireAuth roles={["admin", "utilero"]}>
      <EliminarCategoriaPage />
    </RequireAuth>
  ),
});

function EliminarCategoriaPage() {
  const [searchId, setSearchId] = useState("");
  const [foundCategory, setFoundCategory] = useState<Category | null>(null);
  const [searchError, setSearchError] = useState("");
  const [searching, setSearching] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleted, setDeleted] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setSearchError("");
    setFoundCategory(null);
    setConfirmDelete(false);
    setDeleted(false);

    if (!searchId.trim()) {
      setSearchError("Por favor ingresa un ID de categoría");
      return;
    }

    setSearching(true);
    try {
      const categoryId = parseInt(searchId);
      const category = await categoriesApi.get(categoryId);
      setFoundCategory(category);
    } catch (err) {
      setSearchError(
        err instanceof Error ? err.message : `No se encontró ninguna categoría con ID: ${searchId}`,
      );
    } finally {
      setSearching(false);
    }
  };

  const handleDelete = async () => {
    if (foundCategory) {
      setDeleting(true);
      try {
        await categoriesApi.delete(foundCategory.id_categoria);
        setDeleted(true);
        setConfirmDelete(false);
        setFoundCategory(null);
        setSearchId("");
      } catch (err) {
        setSearchError(err instanceof Error ? err.message : "Error al eliminar la categoría");
      } finally {
        setDeleting(false);
      }
    }
  };

  const handleReset = () => {
    setDeleted(false);
    setSearchId("");
    setFoundCategory(null);
    setSearchError("");
    setConfirmDelete(false);
  };

  return (
    <>
      <PageHeader
        title="Eliminar Categoría"
        subtitle="Busca y elimina categorías del sistema de forma segura."
      />

      <section className="container mx-auto px-4 py-10">
        {/* Búsqueda de categoría */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-soft)] mb-8">
          <h2 className="text-xl font-semibold flex items-center gap-2 mb-6">
            <Search className="h-5 w-5 text-primary" /> Buscar categoría a eliminar
          </h2>
          <form onSubmit={handleSearch} className="flex gap-4">
            <input
              type="number"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              placeholder="Ingresa el ID de la categoría"
              className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
              min="1"
              disabled={deleting}
            />
            <button
              type="submit"
              disabled={searching || deleting}
              className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-6 py-2 font-semibold text-primary-foreground shadow-[var(--shadow-soft)] hover:opacity-90"
            >
              <Search className="h-4 w-4" /> {searching ? "Buscando..." : "Buscar"}
            </button>
          </form>

          {/* Mensaje de error */}
          {searchError && (
            <div className="mt-4 rounded-lg bg-destructive/15 p-4 flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-destructive" />
              <p className="text-sm text-destructive">{searchError}</p>
            </div>
          )}

          {/* Categoría encontrada */}
          {foundCategory && !deleted && (
            <div className="mt-6 rounded-lg border border-border p-6">
              <div className="flex items-center gap-3 mb-4">
                <FolderOpen className="h-8 w-8 text-primary" />
                <div>
                  <h3 className="font-semibold text-lg">{foundCategory.nom_categoria}</h3>
                  <p className="text-sm text-muted-foreground">ID: {foundCategory.id_categoria}</p>
                  {foundCategory.descripcion && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {foundCategory.descripcion}
                    </p>
                  )}
                </div>
              </div>

              {!confirmDelete ? (
                <button
                  onClick={() => setConfirmDelete(true)}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-md bg-destructive py-2.5 font-semibold text-destructive-foreground shadow-[var(--shadow-soft)] hover:opacity-90"
                >
                  <Trash2 className="h-4 w-4" /> Eliminar categoría
                </button>
              ) : (
                <div className="rounded-lg bg-destructive/15 p-4">
                  <div className="flex items-center gap-3 mb-4">
                    <AlertTriangle className="h-5 w-5 text-destructive" />
                    <div>
                      <h4 className="font-semibold text-destructive">¿Confirmar eliminación?</h4>
                      <p className="text-sm text-destructive">
                        Esta acción no se puede deshacer. La categoría "
                        {foundCategory.nom_categoria}" será eliminada permanentemente del sistema.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={handleDelete}
                      disabled={deleting}
                      className="flex-1 inline-flex items-center justify-center gap-2 rounded-md bg-destructive py-2 font-semibold text-destructive-foreground hover:opacity-90"
                    >
                      {deleting ? (
                        <>
                          <span className="animate-spin">↻</span> Eliminando...
                        </>
                      ) : (
                        <>
                          <Trash2 className="h-4 w-4" /> Sí, eliminar
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => setConfirmDelete(false)}
                      disabled={deleting}
                      className="flex-1 inline-flex items-center justify-center gap-2 rounded-md bg-secondary py-2 font-semibold text-secondary-foreground hover:opacity-90"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Confirmación de eliminación */}
          {deleted && (
            <div className="mt-6 rounded-lg bg-green-50 border border-green-200 p-6 text-center">
              <CheckCircle2 className="mx-auto h-12 w-12 text-green-600 mb-4" />
              <h3 className="font-semibold text-green-800 text-lg mb-2">
                Categoría eliminada exitosamente
              </h3>
              <p className="text-green-700 text-sm mb-4">
                La categoría ha sido eliminada permanentemente del sistema.
              </p>
              <button
                onClick={handleReset}
                className="inline-flex items-center justify-center gap-2 rounded-md bg-green-600 px-4 py-2 font-semibold text-white hover:opacity-90"
              >
                Eliminar otra categoría
              </button>
            </div>
          )}

          {/* Información importante */}
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 mt-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
              <div>
                <h3 className="font-semibold text-amber-800 mb-2">Información importante</h3>
                <ul className="text-sm text-amber-700 space-y-1">
                  <li>• La eliminación de una categoría es permanente y no se puede deshacer</li>
                  <li>
                    • Asegúrate de que no hay elementos asociados a esta categoría antes de
                    eliminarla
                  </li>
                  <li>• Verifica que estás eliminando la categoría correcta antes de confirmar</li>
                  <li>
                    • Se recomienda considerar si la categoría podría ser necesaria en el futuro
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
