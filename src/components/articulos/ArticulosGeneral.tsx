import { useEffect, useMemo, useState } from "react";
import { Package, Plus, Search, AlertCircle, Loader2, CheckCircle2 } from "lucide-react";
import type { ArticuloDeportivo } from "@/shared/dtos/articulo.dto";
import { listarArticulos } from "@/shared/services/articulos.service";
import { ArticuloCard } from "./ArticuloCard";
import { CrearArticuloModal } from "./CrearArticuloModal";
import { EditarArticuloModal } from "./EditarArticuloModal";
import { EliminarArticuloModal } from "./EliminarArticuloModal";

export function ArticulosGeneral() {
  const [articulos, setArticulos] = useState<ArticuloDeportivo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [search, setSearch] = useState("");

  const [crearOpen, setCrearOpen] = useState(false);
  const [crearTriggerEl, setCrearTriggerEl] = useState<HTMLElement | null>(null);

  const [editOpen, setEditOpen] = useState(false);
  const [editArticulo, setEditArticulo] = useState<ArticuloDeportivo | null>(null);
  const [editTriggerEl, setEditTriggerEl] = useState<HTMLElement | null>(null);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteArticulo, setDeleteArticulo] = useState<ArticuloDeportivo | null>(null);
  const [deleteTriggerEl, setDeleteTriggerEl] = useState<HTMLElement | null>(null);

  const loadArticulos = () => {
    setLoading(true);
    setError("");
    listarArticulos()
      .then((data) => setArticulos(data))
      .catch((err) => setError(err instanceof Error ? err.message : "Error cargando articulos"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadArticulos();
  }, []);

  const filtered = useMemo(() => {
    if (!search.trim()) return articulos;
    const query = search.toLowerCase();
    return articulos.filter(
      (a) =>
        a.nombre.toLowerCase().includes(query) || a.observaciones?.toLowerCase().includes(query),
    );
  }, [search, articulos]);

  const handleCreated = (articulo: ArticuloDeportivo) => {
    setArticulos((prev) => [articulo, ...prev]);
    setCrearOpen(false);
    setCrearTriggerEl(null);
    setSuccessMsg("Articulo creado correctamente");
    setTimeout(() => setSuccessMsg(""), 4000);
  };

  const handleUpdated = (updated: ArticuloDeportivo) => {
    setArticulos((prev) => prev.map((a) => (a.id_articulo === updated.id_articulo ? updated : a)));
    setEditOpen(false);
    setEditArticulo(null);
    setEditTriggerEl(null);
    setSuccessMsg("Articulo actualizado correctamente");
    setTimeout(() => setSuccessMsg(""), 4000);
  };

  const handleDeleted = (id: number) => {
    setArticulos((prev) => prev.filter((a) => a.id_articulo !== id));
    setDeleteOpen(false);
    setDeleteArticulo(null);
    setDeleteTriggerEl(null);
    setSuccessMsg("Articulo eliminado correctamente");
    setTimeout(() => setSuccessMsg(""), 4000);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Articulos deportivos</h1>
          <p className="text-sm text-muted-foreground">Administra el inventario deportivo.</p>
        </div>
        <button
          type="button"
          onClick={(e) => {
            setCrearTriggerEl(e.currentTarget);
            setCrearOpen(true);
          }}
          className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-xs font-medium text-primary-foreground hover:opacity-90"
        >
          <Plus className="h-4 w-4" /> Nuevo articulo
        </button>
      </div>

      <div className="mb-6 flex items-center gap-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar articulos"
            className="w-full rounded-full border border-border bg-background px-4 py-2 pl-9 text-xs"
          />
        </div>
      </div>

      {successMsg && (
        <div className="mb-6 flex items-center gap-2 p-4 rounded-xl bg-green-500/10 text-green-600">
          <CheckCircle2 className="h-5 w-5 shrink-0" />
          <p className="font-medium">{successMsg}</p>
        </div>
      )}

      {loading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 p-4 rounded-xl bg-destructive/10 text-destructive mb-6">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {!loading && !error && filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Package className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-lg font-semibold">No hay articulos</p>
          <p className="text-sm text-muted-foreground">Crea un articulo para comenzar.</p>
        </div>
      )}

      {!loading && !error && filtered.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((articulo) => (
            <ArticuloCard
              key={articulo.id_articulo}
              articulo={articulo}
              onEdit={(e) => {
                setEditTriggerEl(e.currentTarget);
                setEditArticulo(articulo);
                setEditOpen(true);
              }}
              onDelete={(e) => {
                setDeleteTriggerEl(e.currentTarget);
                setDeleteArticulo(articulo);
                setDeleteOpen(true);
              }}
            />
          ))}
        </div>
      )}

      {crearOpen && (
        <CrearArticuloModal
          triggerElement={crearTriggerEl}
          onClose={() => {
            setCrearOpen(false);
            setCrearTriggerEl(null);
          }}
          onCreated={handleCreated}
        />
      )}
      {editOpen && editArticulo && (
        <EditarArticuloModal
          articulo={editArticulo}
          triggerElement={editTriggerEl}
          onClose={() => {
            setEditOpen(false);
            setEditArticulo(null);
            setEditTriggerEl(null);
          }}
          onUpdated={handleUpdated}
        />
      )}
      {deleteOpen && deleteArticulo && (
        <EliminarArticuloModal
          articulo={deleteArticulo}
          triggerElement={deleteTriggerEl}
          onClose={() => {
            setDeleteOpen(false);
            setDeleteArticulo(null);
            setDeleteTriggerEl(null);
          }}
          onDeleted={handleDeleted}
        />
      )}
    </div>
  );
}
