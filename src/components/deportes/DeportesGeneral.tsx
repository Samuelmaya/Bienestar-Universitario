import { useEffect, useState } from "react";
import { Trophy, Plus, AlertCircle, Loader2, CheckCircle2 } from "lucide-react";
import type { Deporte } from "@/shared/dtos/deporte.dto";
import { listarDeportes } from "@/shared/services/deportes.service";
import { DeporteCard } from "./DeporteCard";
import { CrearDeporteModal } from "./CrearDeporteModal";
import { EditarDeporteModal } from "./EditarDeporteModal";
import { EliminarDeporteModal } from "./EliminarDeporteModal";

export function DeportesGeneral() {
  const [deportes, setDeportes] = useState<Deporte[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [crearOpen, setCrearOpen] = useState(false);
  const [crearTriggerEl, setCrearTriggerEl] = useState<HTMLElement | null>(null);

  const [editOpen, setEditOpen] = useState(false);
  const [editDeporte, setEditDeporte] = useState<Deporte | null>(null);
  const [editTriggerEl, setEditTriggerEl] = useState<HTMLElement | null>(null);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteDeporte, setDeleteDeporte] = useState<Deporte | null>(null);
  const [deleteTriggerEl, setDeleteTriggerEl] = useState<HTMLElement | null>(null);

  const loadDeportes = () => {
    setLoading(true);
    setError("");
    listarDeportes()
      .then((data) => {
        setDeportes(data);
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Error cargando deportes"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadDeportes();
  }, []);

  const handleCreated = (deporte: Deporte) => {
    setDeportes((prev) => [deporte, ...prev]);
    setCrearOpen(false);
    setCrearTriggerEl(null);
    setSuccessMsg("Deporte creado correctamente");
    setTimeout(() => setSuccessMsg(""), 4000);
  };

  const handleUpdated = (updated: Deporte) => {
    setDeportes((prev) => prev.map((d) => (d.cod_deporte === updated.cod_deporte ? updated : d)));
    setEditOpen(false);
    setEditDeporte(null);
    setEditTriggerEl(null);
    setSuccessMsg("Deporte actualizado correctamente");
    setTimeout(() => setSuccessMsg(""), 4000);
  };

  const handleDeleted = (id: number) => {
    setDeportes((prev) => prev.filter((d) => d.cod_deporte !== id));
    setDeleteOpen(false);
    setDeleteDeporte(null);
    setDeleteTriggerEl(null);
    setSuccessMsg("Deporte eliminado correctamente");
    setTimeout(() => setSuccessMsg(""), 4000);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Gestion de Deportes</h1>
          <p className="text-sm text-muted-foreground">Administra los deportes del sistema.</p>
        </div>
        <button
          type="button"
          onClick={(e) => {
            setCrearTriggerEl(e.currentTarget);
            setCrearOpen(true);
          }}
          className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-xs font-medium text-primary-foreground hover:opacity-90"
        >
          <Plus className="h-4 w-4" /> Nuevo deporte
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

      {!loading && !error && deportes.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Trophy className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-lg font-semibold">No hay deportes</p>
          <p className="text-sm text-muted-foreground">Crea un deporte para comenzar.</p>
        </div>
      )}

      {!loading && !error && deportes.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {deportes.map((deporte) => (
            <DeporteCard
              key={deporte.cod_deporte}
              deporte={deporte}
              onEdit={(e) => {
                setEditTriggerEl(e.currentTarget);
                setEditDeporte(deporte);
                setEditOpen(true);
              }}
              onDelete={(e) => {
                setDeleteTriggerEl(e.currentTarget);
                setDeleteDeporte(deporte);
                setDeleteOpen(true);
              }}
            />
          ))}
        </div>
      )}

      {crearOpen && (
        <CrearDeporteModal
          triggerElement={crearTriggerEl}
          onClose={() => {
            setCrearOpen(false);
            setCrearTriggerEl(null);
          }}
          onCreated={handleCreated}
        />
      )}
      {editOpen && editDeporte && (
        <EditarDeporteModal
          deporte={editDeporte}
          triggerElement={editTriggerEl}
          onClose={() => {
            setEditOpen(false);
            setEditDeporte(null);
            setEditTriggerEl(null);
          }}
          onUpdated={handleUpdated}
        />
      )}
      {deleteOpen && deleteDeporte && (
        <EliminarDeporteModal
          deporte={deleteDeporte}
          triggerElement={deleteTriggerEl}
          onClose={() => {
            setDeleteOpen(false);
            setDeleteDeporte(null);
            setDeleteTriggerEl(null);
          }}
          onDeleted={handleDeleted}
        />
      )}
    </div>
  );
}
