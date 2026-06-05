import { Eye } from "lucide-react";
import type { InscripcionItem } from "@/lib/api";

type Props = {
  inscripcion: InscripcionItem;
  onDetalle: (e: React.MouseEvent<HTMLButtonElement>) => void;
};

export function InscripcionCard({ inscripcion, onDetalle }: Props) {
  return (
    <div className="rounded-3xl border border-border bg-card p-5 shadow-[var(--shadow-soft)] transition hover:shadow-[var(--shadow-elegant)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-semibold text-base text-foreground">{inscripcion.nombre}</p>
          <p className="mt-1 text-xs text-muted-foreground">
            {inscripcion.tipo_documento} {inscripcion.documento}
          </p>
          <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
            {inscripcion.deporte}
          </p>
        </div>
        <span className="rounded-full bg-secondary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-secondary">
          {inscripcion.estado}
        </span>
      </div>
      <div className="mt-4 flex flex-col gap-3">
        <div className="rounded-2xl bg-muted p-3 text-xs text-muted-foreground">
          Inscripción: {new Date(inscripcion.fecha_inscripcion).toLocaleDateString("es-CO", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })}
        </div>
        <button
          type="button"
          onClick={(e) => onDetalle(e)}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
        >
          <Eye className="h-4 w-4" /> Ver detalles
        </button>
      </div>
    </div>
  );
}
