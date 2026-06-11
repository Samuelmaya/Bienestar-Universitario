import { useEffect, useState } from "react";
import { Medal, Plus, AlertCircle, Loader2, CheckCircle2 } from "lucide-react";
import { createFileRoute } from "@tanstack/react-router";

import MedalTable from "../components/medallas/MedalTable";
import { CrearMedallaModal } from "../components/medallas/CrearMedallaModal";
import { EditarMedallaModal } from "../components/medallas/EditarMedallaModal";
import { EliminarMedallaModal } from "../components/medallas/EliminarMedallaModal";

import { listarMedallas } from "@/services/medal.service";
import type { Medal as MedalType } from "@/shared/dtos/medal.dto";

export const Route = createFileRoute("/medallas")({
  component: MedallasPage,
});

function MedallasPage() {
  const [medals, setMedals] = useState<MedalType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [crearOpen, setCrearOpen] = useState(false);
  const [crearTriggerEl, setCrearTriggerEl] = useState<HTMLElement | null>(null);

  const [editingMedal, setEditingMedal] = useState<MedalType | null>(null);
  const [editTriggerEl, setEditTriggerEl] = useState<HTMLElement | null>(null);

  const [deletingMedal, setDeletingMedal] = useState<MedalType | null>(null);
  const [deleteTriggerEl, setDeleteTriggerEl] = useState<HTMLElement | null>(null);

  const loadMedals = () => {
    setLoading(true);
    setError("");
    listarMedallas()
      .then(setMedals)
      .catch((err) => setError(err instanceof Error ? err.message : "Error cargando medallas"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadMedals();
  }, []);

  const handleCreated = (medalla: MedalType) => {
    setMedals((prev) => [medalla, ...prev]);
    setCrearOpen(false);
    setCrearTriggerEl(null);
    setSuccessMsg("Medalla creada correctamente");
    setTimeout(() => setSuccessMsg(""), 4000);
  };

  const handleUpdated = (updated: MedalType) => {
    setMedals((prev) =>
      prev.map((m) => (m.id_medalla === updated.id_medalla ? updated : m))
    );
    setEditingMedal(null);
    setEditTriggerEl(null);
    setSuccessMsg("Medalla actualizada correctamente");
    setTimeout(() => setSuccessMsg(""), 4000);
  };

  const handleDeleted = () => {
    setMedals((prev) =>
      prev.filter((m) => m.id_medalla !== deletingMedal?.id_medalla)
    );
    setDeletingMedal(null);
    setDeleteTriggerEl(null);
    setSuccessMsg("Medalla eliminada correctamente");
    setTimeout(() => setSuccessMsg(""), 4000);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Gestión de Medallas</h1>
          <p className="text-sm text-muted-foreground">
            Administra las medallas obtenidas por los estudiantes.
          </p>
        </div>
        <button
          type="button"
          onClick={(e) => {
            setCrearTriggerEl(e.currentTarget);
            setCrearOpen(true);
          }}
          className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-xs font-medium text-primary-foreground hover:opacity-90"
        >
          <Plus className="h-4 w-4" /> Nueva Medalla
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

      {!loading && !error && medals.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Medal className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-lg font-semibold">No hay medallas registradas</p>
          <p className="text-sm text-muted-foreground">Crea una medalla para comenzar.</p>
        </div>
      )}

      {!loading && !error && medals.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <MedalTable
              medals={medals}
              onEdit={(medalla, e) => {
                setEditTriggerEl(e.currentTarget);
                setEditingMedal(medalla);
              }}
              onDelete={(medalla, e) => {
                setDeleteTriggerEl(e.currentTarget);
                setDeletingMedal(medalla);
              }}
            />
          </div>
        </div>
      )}

      {crearOpen && (
        <CrearMedallaModal
          triggerElement={crearTriggerEl}
          onClose={() => {
            setCrearOpen(false);
            setCrearTriggerEl(null);
          }}
          onCreated={handleCreated}
        />
      )}

      {editingMedal && (
        <EditarMedallaModal
          medalla={editingMedal}
          triggerElement={editTriggerEl}
          onClose={() => {
            setEditingMedal(null);
            setEditTriggerEl(null);
          }}
          onUpdated={handleUpdated}
        />
      )}

      {deletingMedal && (
        <EliminarMedallaModal
          medalla={deletingMedal}
          triggerElement={deleteTriggerEl}
          onClose={() => {
            setDeletingMedal(null);
            setDeleteTriggerEl(null);
          }}
          onDeleted={handleDeleted}
        />
      )}
    </div>
  );
}