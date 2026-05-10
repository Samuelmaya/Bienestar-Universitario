import { Edit, Trash2, Trophy } from "lucide-react";
import type { Deporte } from "@/shared/dtos/deporte.dto";

type Props = {
  deporte: Deporte;
  onEdit: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onDelete: (e: React.MouseEvent<HTMLButtonElement>) => void;
};

export function DeporteCard({ deporte, onEdit, onDelete }: Props) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-soft)] transition hover:shadow-[var(--shadow-elegant)]">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-accent flex items-center justify-center">
            <Trophy className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="font-semibold text-sm">{deporte.nom_deporte}</p>
            <p className="text-xs text-muted-foreground">#{deporte.cod_deporte}</p>
          </div>
        </div>
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
            deporte.estado === false
              ? "bg-destructive/10 text-destructive"
              : "bg-emerald-500/10 text-emerald-600"
          }`}
        >
          {deporte.estado === false ? "Inactivo" : "Activo"}
        </span>
      </div>

      <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
        {deporte.descripcion || "Sin descripción"}
      </p>

      <div className="flex items-center gap-3 text-xs text-muted-foreground">
        {typeof deporte.cupo_maximo === "number" && <span>Cupo: {deporte.cupo_maximo}</span>}
      </div>

      <div className="flex gap-2 mt-4 pt-3 border-t border-border">
        <button
          type="button"
          onClick={onEdit}
          className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl border border-border px-3 py-2 text-xs font-medium hover:bg-accent transition"
        >
          <Edit className="h-3.5 w-3.5" /> Modificar
        </button>
        <button
          type="button"
          onClick={onDelete}
          className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-destructive/10 px-3 py-2 text-xs font-medium text-destructive hover:bg-destructive/20 transition"
        >
          <Trash2 className="h-3.5 w-3.5" /> Eliminar
        </button>
      </div>
    </div>
  );
}
