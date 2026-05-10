import { Edit, Trash2, Shield } from "lucide-react";
import type { Rol } from "@/shared/dtos/rol.dto";

type Props = {
  rol: Rol;
  onEdit: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onDelete: (e: React.MouseEvent<HTMLButtonElement>) => void;
};

export function RolCard({ rol, onEdit, onDelete }: Props) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-soft)] transition hover:shadow-[var(--shadow-elegant)]">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-accent flex items-center justify-center">
            <Shield className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="font-semibold text-sm">{rol.nombre}</p>
            <p className="text-xs text-muted-foreground">#{rol.id}</p>
          </div>
        </div>
      </div>

      <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
        {rol.descripcion || "Sin descripcion"}
      </p>
      <p className="text-[11px] text-muted-foreground">
        Creado: {new Date(rol.creado_en).toLocaleString("es-CO")}
      </p>

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
