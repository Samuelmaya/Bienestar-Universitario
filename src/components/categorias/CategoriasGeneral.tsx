import { useEffect, useState } from "react";
import { FolderOpen, Plus, AlertCircle, Loader2, CheckCircle2 } from "lucide-react";
import type { CategoriaArticulo } from "@/shared/dtos/categoria.dto";
import { listarCategorias } from "@/shared/services/categorias.service";
import { CategoriaCard } from "./CategoriaCard";
import { CrearCategoriaModal } from "./CrearCategoriaModal";
import { EditarCategoriaModal } from "./EditarCategoriaModal";
import { EliminarCategoriaModal } from "./EliminarCategoriaModal";

export function CategoriasGeneral() {
  const [categorias, setCategorias] = useState<CategoriaArticulo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [crearOpen, setCrearOpen] = useState(false);
  const [crearTriggerEl, setCrearTriggerEl] = useState<HTMLElement | null>(null);

  const [editOpen, setEditOpen] = useState(false);
  const [editCategoria, setEditCategoria] = useState<CategoriaArticulo | null>(null);
  const [editTriggerEl, setEditTriggerEl] = useState<HTMLElement | null>(null);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteCategoria, setDeleteCategoria] = useState<CategoriaArticulo | null>(null);
  const [deleteTriggerEl, setDeleteTriggerEl] = useState<HTMLElement | null>(null);

  const loadCategorias = () => {
    setLoading(true);
    setError("");
    listarCategorias()
      .then((data) => setCategorias(data))
      .catch((err) => setError(err instanceof Error ? err.message : "Error cargando categorias"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadCategorias();
  }, []);

  const handleCreated = (categoria: CategoriaArticulo) => {
    setCategorias((prev) => [categoria, ...prev]);
    setCrearOpen(false);
    setCrearTriggerEl(null);
    setSuccessMsg("Categoria creada correctamente");
    setTimeout(() => setSuccessMsg(""), 4000);
  };

  const handleUpdated = (updated: CategoriaArticulo) => {
    setCategorias((prev) =>
      prev.map((c) => (c.id_categoria === updated.id_categoria ? updated : c)),
    );
    setEditOpen(false);
    setEditCategoria(null);
    setEditTriggerEl(null);
    setSuccessMsg("Categoria actualizada correctamente");
    setTimeout(() => setSuccessMsg(""), 4000);
  };

  const handleDeleted = (id: number) => {
    setCategorias((prev) => prev.filter((c) => c.id_categoria !== id));
    setDeleteOpen(false);
    setDeleteCategoria(null);
    setDeleteTriggerEl(null);
    setSuccessMsg("Categoria eliminada correctamente");
    setTimeout(() => setSuccessMsg(""), 4000);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Categorias de articulos</h1>
          <p className="text-sm text-muted-foreground">Administra las categorias de articulos.</p>
        </div>
        <button
          type="button"
          onClick={(e) => {
            setCrearTriggerEl(e.currentTarget);
            setCrearOpen(true);
          }}
          className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-xs font-medium text-primary-foreground hover:opacity-90"
        >
          <Plus className="h-4 w-4" /> Nueva categoria
        </button>
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

      {!loading && !error && categorias.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <FolderOpen className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-lg font-semibold">No hay categorias</p>
          <p className="text-sm text-muted-foreground">Crea una categoria para comenzar.</p>
        </div>
      )}

      {!loading && !error && categorias.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categorias.map((categoria) => (
            <CategoriaCard
              key={categoria.id_categoria}
              categoria={categoria}
              onEdit={(e) => {
                setEditTriggerEl(e.currentTarget);
                setEditCategoria(categoria);
                setEditOpen(true);
              }}
              onDelete={(e) => {
                setDeleteTriggerEl(e.currentTarget);
                setDeleteCategoria(categoria);
                setDeleteOpen(true);
              }}
            />
          ))}
        </div>
      )}

      {crearOpen && (
        <CrearCategoriaModal
          triggerElement={crearTriggerEl}
          onClose={() => {
            setCrearOpen(false);
            setCrearTriggerEl(null);
          }}
          onCreated={handleCreated}
        />
      )}
      {editOpen && editCategoria && (
        <EditarCategoriaModal
          categoria={editCategoria}
          triggerElement={editTriggerEl}
          onClose={() => {
            setEditOpen(false);
            setEditCategoria(null);
            setEditTriggerEl(null);
          }}
          onUpdated={handleUpdated}
        />
      )}
      {deleteOpen && deleteCategoria && (
        <EliminarCategoriaModal
          categoria={deleteCategoria}
          triggerElement={deleteTriggerEl}
          onClose={() => {
            setDeleteOpen(false);
            setDeleteCategoria(null);
            setDeleteTriggerEl(null);
          }}
          onDeleted={handleDeleted}
        />
      )}
    </div>
  );
}
