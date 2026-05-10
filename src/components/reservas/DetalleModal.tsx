import { useEffect, useState } from "react";
import { Loader2, Mail, Phone, Package } from "lucide-react";
import { ReusableModal } from "@/shared/reusable-modal/reusable-modal";
import type { PeticionFullResponse } from "@/shared/dtos/peticion.dto";
import { obtenerPeticion } from "@/services/peticiones.service";
import { estadoColor } from "./estado-colors";

type Props = {
  idPeticion: number;
  triggerElement: HTMLElement | null;
  onClose: () => void;
};

export function DetalleModal({ idPeticion, triggerElement, onClose }: Props) {
  const [data, setData] = useState<PeticionFullResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");
    obtenerPeticion(idPeticion)
      .then(setData)
      .catch((e) => setError(e instanceof Error ? e.message : "Error"))
      .finally(() => setLoading(false));
  }, [idPeticion]);

  return (
    <ReusableModal
      triggerElement={triggerElement}
      closePosition="left"
      maxWidth="600px"
      backgroundColor="#eaf6ea"
      centerOnDesktop
      onClose={onClose}
    >
      <div className="w-full max-w-[480px] mx-auto pt-6 pb-10">
        <p
          className="text-[10px] font-medium tracking-[0.18em] uppercase mb-2 select-none"
          style={{ color: "#4a7a4a", fontFamily: "'DM Sans', system-ui, sans-serif" }}
        >
          petición #{idPeticion}
        </p>
        <h2
          className="text-[1.4rem] font-semibold leading-tight mb-5"
          style={{
            fontFamily: "'Bricolage Grotesque', system-ui, sans-serif",
            color: "#142e14",
            letterSpacing: "-0.025em",
          }}
        >
          Detalle de la solicitud
        </h2>

        {loading && (
          <div className="flex justify-center py-10">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        )}
        {error && <p className="text-sm text-red-600">{error}</p>}

        {data && !loading && (
          <div className="space-y-4" style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>
            <div className="rounded-xl p-4" style={{ backgroundColor: "rgba(16,123,66,0.06)" }}>
              <p className="font-semibold text-sm" style={{ color: "#142e14" }}>
                {data.nombre_solicitante}
              </p>
              <div className="flex flex-col gap-1 mt-2 text-xs" style={{ color: "#3a6a3a" }}>
                <span className="flex items-center gap-1.5">
                  <Mail className="h-3 w-3" /> {data.correo}
                </span>
                <span className="flex items-center gap-1.5">
                  <Phone className="h-3 w-3" /> {data.telefono}
                </span>
              </div>
            </div>

            <span
              className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${estadoColor[data.estado] ?? "bg-muted text-muted-foreground"}`}
            >
              {data.estado}
            </span>

            <div className="grid grid-cols-2 gap-3 text-xs" style={{ color: "#3a6a3a" }}>
              <div>
                <p className="font-medium mb-0.5" style={{ color: "#142e14" }}>Inicio</p>
                <p>{new Date(data.fecha_inicio).toLocaleString("es-CO")}</p>
              </div>
              <div>
                <p className="font-medium mb-0.5" style={{ color: "#142e14" }}>Fin</p>
                <p>{new Date(data.fecha_fin).toLocaleString("es-CO")}</p>
              </div>
            </div>

            <div>
              <p className="font-medium text-xs mb-1" style={{ color: "#142e14" }}>Descripción</p>
              <p className="text-xs" style={{ color: "#3a6a3a" }}>{data.descripcion}</p>
            </div>

            <div>
              <p className="font-medium text-xs mb-2" style={{ color: "#142e14" }}>
                Artículos solicitados
              </p>
              <div className="space-y-2">
                {data.detalle.map((d) => (
                  <div
                    key={d.id_articulo}
                    className="flex items-center gap-3 rounded-xl p-3"
                    style={{ backgroundColor: "rgba(255,255,255,0.7)" }}
                  >
                    <div className="rounded-lg p-2" style={{ backgroundColor: "rgba(16,123,66,0.1)" }}>
                      <Package className="h-4 w-4" style={{ color: "#107b42" }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate" style={{ color: "#142e14" }}>
                        {d.articulo.nombre}
                      </p>
                      <p className="text-xs" style={{ color: "#5a7a5a" }}>
                        Cantidad solicitada: {d.cantidad}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div
              className="text-[10px] pt-2 border-t"
              style={{ color: "#8aaa8a", borderColor: "rgba(0,0,0,0.06)" }}
            >
              <p>Creada: {new Date(data.created_at).toLocaleString("es-CO")}</p>
              <p>Actualizada: {new Date(data.updated_at).toLocaleString("es-CO")}</p>
            </div>
          </div>
        )}
      </div>
    </ReusableModal>
  );
}
