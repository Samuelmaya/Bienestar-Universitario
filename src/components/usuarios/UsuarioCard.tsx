import { Edit, Trash2 } from "lucide-react";
import type { Usuario } from "@/shared/dtos/usuario.dto";
import type { Rol } from "@/shared/dtos/rol.dto";

type Props = {
  usuario: Usuario;
  roles: Rol[];
  onEdit: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onDelete: (e: React.MouseEvent<HTMLButtonElement>) => void;
};

function nombreCompleto(u: Usuario) {
  return [u.primer_nombre, u.segundo_nombre, u.primer_apellido, u.segundo_apellido]
    .filter(Boolean)
    .join(" ");
}

function iniciales(u: Usuario) {
  return `${u.primer_nombre[0]}${u.primer_apellido[0]}`.toUpperCase();
}

export function UsuarioCard({ usuario, roles, onEdit, onDelete }: Props) {
  const rolNombre = roles.find((r) => r.id === usuario.role_id)?.nombre ?? "Sin rol";

  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-soft)] transition hover:shadow-[var(--shadow-elegant)] flex flex-col min-w-0">
      {/* Avatar + nombre + badge activo */}
      <div className="flex items-start justify-between gap-3 mb-3 min-w-0">
        <div className="flex items-center gap-3 min-w-0">
          <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center shrink-0">
            <span className="text-sm font-bold text-primary-foreground">{iniciales(usuario)}</span>
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-sm leading-tight break-words line-clamp-2">
              {nombreCompleto(usuario)}
            </p>
            <p className="text-xs text-muted-foreground truncate mt-0.5">{usuario.email}</p>
          </div>
        </div>
        <span
          className={`shrink-0 inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold whitespace-nowrap ${
            usuario.activo
              ? "bg-green-500/10 text-green-700"
              : "bg-destructive/10 text-destructive"
          }`}
        >
          {usuario.activo ? "Activo" : "Inactivo"}
        </span>
      </div>

      {/* Rol + ID */}
      <div className="flex items-center gap-2 mb-4">
        <span className="inline-flex items-center rounded-full bg-accent px-2.5 py-0.5 text-[10px] font-medium text-primary capitalize truncate max-w-[140px]">
          {rolNombre}
        </span>
        <span className="text-[10px] text-muted-foreground shrink-0">#{usuario.id}</span>
      </div>

      {/* Acciones */}
      <div className="flex gap-2 pt-3 border-t border-border mt-auto">
        <button
          type="button"
          onClick={onEdit}
          className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl border border-border px-3 py-2 text-xs font-medium hover:bg-accent transition"
        >
          <Edit className="h-3.5 w-3.5 shrink-0" /> Modificar
        </button>
        <button
          type="button"
          onClick={onDelete}
          className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-destructive/10 px-3 py-2 text-xs font-medium text-destructive hover:bg-destructive/20 transition"
        >
          <Trash2 className="h-3.5 w-3.5 shrink-0" /> Eliminar
        </button>
      </div>
    </div>
  );
}