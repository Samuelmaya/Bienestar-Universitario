import { useEffect, useState } from "react";
import { ClipboardList, AlertCircle, Loader2, CheckCircle2 } from "lucide-react";
import type { PeticionListItem } from "@/shared/dtos/peticion.dto";
import { listarPeticiones } from "@/services/peticiones.service";
import { ReservaCard } from "./ReservaCard";
import { DetalleModal } from "./DetalleModal";
import { EstadoModal } from "./EstadoModal";

export function ReservasGeneral() {
  const [peticiones, setPeticiones] = useState<PeticionListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [detailOpen, setDetailOpen] = useState(false);
  const [detailId, setDetailId] = useState<number | null>(null);
  const [detailTriggerEl, setDetailTriggerEl] = useState<HTMLElement | null>(null);

  const [estadoOpen, setEstadoOpen] = useState(false);
  const [estadoPeticion, setEstadoPeticion] = useState<PeticionListItem | null>(null);
  const [estadoTriggerEl, setEstadoTriggerEl] = useState<HTMLElement | null>(null);

  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");
    listarPeticiones()
      .then((data) => {
        data.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        setPeticiones(data);
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Error cargando peticiones"))
      .finally(() => setLoading(false));
  }, []);

  const handleEstadoSuccess = (id: number, nuevoEstado: string) => {
    setPeticiones((prev) =>
      prev.map((p) => (p.id_peticion === id ? { ...p, estado: nuevoEstado } : p)),
    );
    setEstadoOpen(false);
    setSuccessMsg("Estado actualizado correctamente");
    setTimeout(() => setSuccessMsg(""), 4000);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Gestión de Reservas</h1>
        <p className="text-sm text-muted-foreground">
          Administra las solicitudes de préstamo de implementos deportivos.
        </p>
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

      {!loading && !error && peticiones.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <ClipboardList className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-lg font-semibold">No hay peticiones</p>
          <p className="text-sm text-muted-foreground">
            Aún no se han registrado solicitudes de préstamo.
          </p>
        </div>
      )}

      {!loading && !error && peticiones.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {peticiones.map((p) => (
            <ReservaCard
              key={p.id_peticion}
              peticion={p}
              onDetalle={(e) => {
                setDetailTriggerEl(e.currentTarget);
                setDetailId(p.id_peticion);
                setDetailOpen(true);
              }}
              onEstado={(e) => {
                setEstadoTriggerEl(e.currentTarget);
                setEstadoPeticion(p);
                setEstadoOpen(true);
              }}
            />
          ))}
        </div>
      )}

      {detailOpen && detailId !== null && (
        <DetalleModal
          idPeticion={detailId}
          triggerElement={detailTriggerEl}
          onClose={() => {
            setDetailOpen(false);
            setDetailId(null);
            setDetailTriggerEl(null);
          }}
        />
      )}
      {estadoOpen && estadoPeticion && (
        <EstadoModal
          peticion={estadoPeticion}
          triggerElement={estadoTriggerEl}
          onClose={() => {
            setEstadoOpen(false);
            setEstadoPeticion(null);
            setEstadoTriggerEl(null);
          }}
          onSuccess={handleEstadoSuccess}
        />
      )}
    </div>
  );
}
