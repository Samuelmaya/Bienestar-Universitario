import { Edit, Trash2, Package } from "lucide-react";
import type { ArticuloDeportivo } from "@/shared/dtos/articulo.dto";

type Props = {
  articulo: ArticuloDeportivo;
  onEdit: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onDelete: (e: React.MouseEvent<HTMLButtonElement>) => void;
};

export function ArticuloCard({ articulo, onEdit, onDelete }: Props) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-soft)] transition hover:shadow-[var(--shadow-elegant)]">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-accent flex items-center justify-center">
            <Package className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="font-semibold text-sm">{articulo.nombre}</p>
            <p className="text-xs text-muted-foreground">#{articulo.id_articulo}</p>
          </div>
        </div>
        <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-emerald-500/10 text-emerald-600">
          {articulo.estado}
        </span>
      </div>

      <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
        {articulo.observaciones || "Sin observaciones"}
      </p>

      <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
        <span>Cantidad: {articulo.cantidad}</span>
        <span>Dañados: {articulo.dañados}</span>
        <span>Categoria: {articulo.id_categoria}</span>
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
