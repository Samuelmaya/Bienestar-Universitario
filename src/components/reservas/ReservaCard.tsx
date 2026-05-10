import { Eye, RefreshCw, Mail, Calendar } from "lucide-react";
import type { PeticionListItem } from "@/shared/dtos/peticion.dto";
import { estadoColor } from "./estado-colors";

type Props = {
  peticion: PeticionListItem;
  onDetalle: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onEstado: (e: React.MouseEvent<HTMLButtonElement>) => void;
};

export function ReservaCard({ peticion: p, onDetalle, onEstado }: Props) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-soft)] transition hover:shadow-[var(--shadow-elegant)]">
      <div className="flex items-start justify-between gap-2 mb-3">
        <div>
          <p className="font-semibold text-sm">{p.nombre_solicitante}</p>
          <p className="text-xs text-muted-foreground">#{p.id_peticion}</p>
        </div>
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${estadoColor[p.estado] ?? "bg-muted text-muted-foreground"}`}
        >
          {p.estado}
        </span>
      </div>
      <p className="text-xs text-muted-foreground mb-1 line-clamp-2">
        {p.descripcion}
      </p>
      <div className="flex items-center gap-3 text-xs text-muted-foreground mt-2">
        <span className="flex items-center gap-1">
          <Mail className="h-3 w-3" /> {p.correo}
        </span>
      </div>
      <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
        <span className="flex items-center gap-1">
          <Calendar className="h-3 w-3" />
          {new Date(p.fecha_inicio).toLocaleDateString("es-CO", {
            day: "numeric",
            month: "short",
            hour: "2-digit",
            minute: "2-digit",
          })}
          {" — "}
          {new Date(p.fecha_fin).toLocaleDateString("es-CO", {
            day: "numeric",
            month: "short",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>
      <div className="flex gap-2 mt-4 pt-3 border-t border-border">
        <button
          type="button"
          onClick={onDetalle}
          className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl border border-border px-3 py-2 text-xs font-medium hover:bg-accent transition"
        >
          <Eye className="h-3.5 w-3.5" /> Detalle
        </button>
        <button
          type="button"
          onClick={onEstado}
          className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-primary px-3 py-2 text-xs font-medium text-primary-foreground hover:opacity-90 transition"
        >
          <RefreshCw className="h-3.5 w-3.5" /> Estado
        </button>
      </div>
    </div>
  );
}
