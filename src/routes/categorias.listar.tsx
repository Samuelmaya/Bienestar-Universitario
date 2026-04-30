import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { PageHeader } from "@/components/PageHeader";
import { RequireAuth } from "@/components/RequireAuth";
import { List, FolderOpen, AlertCircle, RefreshCw } from "lucide-react";
import { categoriesApi, type Category } from "@/lib/api";

export const Route = createFileRoute("/categorias/listar")({
  head: () => ({ meta: [{ title: "Listar categorías — UPC" }] }),
  component: () => (
    <RequireAuth roles={["admin", "utilero"]}>
      <ListarCategoriasPage />
    </RequireAuth>
  ),
});

function ListarCategoriasPage() {
  const [categorias, setCategorias] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const loadCategorias = async (showRefresh = false) => {
    try {
      if (showRefresh) setRefreshing(true);
      else setLoading(true);
      const data = await categoriesApi.list();
      setCategorias(data);
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar categorías");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadCategorias();
  }, []);

  return (
    <>
      <PageHeader
        title="Listar Categorías"
        subtitle="Consulta todas las categorías registradas en el sistema."
      />

      <section className="container mx-auto px-4 py-10">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-soft)]">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <List className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">Todas las Categorías</h2>
            </div>
            <button
              onClick={() => loadCategorias(true)}
              disabled={refreshing}
              className="inline-flex items-center gap-2 rounded-md bg-secondary px-3 py-1.5 text-sm font-medium hover:opacity-80 transition"
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
              {refreshing ? "Actualizando..." : "Actualizar"}
            </button>
          </div>

          {error && (
            <div className="mb-4 rounded-lg bg-destructive/15 p-3 flex items-center gap-2 text-sm text-destructive border border-destructive/20">
              <AlertCircle className="h-4 w-4" />
              {error}
            </div>
          )}

          {loading ? (
            <div className="space-y-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="rounded-lg border border-border p-4">
                  <div className="animate-pulse flex items-center gap-3">
                    <div className="h-6 w-6 rounded-full bg-muted" />
                    <div className="flex-1">
                      <div className="h-4 w-32 bg-muted rounded" />
                      <div className="h-3 w-16 bg-muted rounded mt-2" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : !loading && !error && categorias.length === 0 ? (
            <div className="text-center py-8">
              <FolderOpen className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No hay categorías registradas.</p>
              <p className="text-sm text-muted-foreground mt-1">
                Crea una nueva categoría para empezar.
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {categorias.map((category) => (
                <div
                  key={category.id_categoria}
                  className="rounded-lg border border-border p-4 hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FolderOpen className="h-6 w-6 text-primary" />
                      <div>
                        <h3 className="font-semibold text-lg">{category.nom_categoria}</h3>
                        <p className="text-sm text-muted-foreground">ID: {category.id_categoria}</p>
                        {category.descripcion && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {category.descripcion}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                        Activa
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && !error && categorias.length > 0 && (
            <div className="mt-6 p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Total de categorías: <span className="font-semibold">{categorias.length}</span>
                </p>
                <p className="text-sm text-muted-foreground">
                  Actualizado:{" "}
                  <span className="font-semibold">{new Date().toLocaleString("es-CO")}</span>
                </p>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
