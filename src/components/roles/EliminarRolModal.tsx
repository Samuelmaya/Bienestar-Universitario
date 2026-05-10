import { useState } from "react";
import { ReusableModal } from "@/shared/reusable-modal/reusable-modal";
import type { Rol } from "@/shared/dtos/rol.dto";
import { eliminarRol } from "@/shared/services/roles.service";

type Props = {
  rol: Rol;
  triggerElement: HTMLElement | null;
  onClose: () => void;
  onDeleted: (id: number) => void;
};

export function EliminarRolModal({ rol, triggerElement, onClose, onDeleted }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onConfirm = async () => {
    setLoading(true);
    setError("");
    try {
      await eliminarRol(rol.id);
      onDeleted(rol.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error eliminando rol");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ReusableModal
      triggerElement={triggerElement}
      closePosition="left"
      maxWidth="440px"
      backgroundColor="#fff3f2"
      centerOnDesktop
      onClose={onClose}
    >
      <div className="w-full max-w-[360px] mx-auto pt-6 pb-10">
        <p
          className="text-[10px] font-medium tracking-[0.18em] uppercase mb-2 select-none"
          style={{ color: "#a3413d", fontFamily: "'DM Sans', system-ui, sans-serif" }}
        >
          rol #{rol.id}
        </p>
        <h2
          className="text-[1.4rem] font-semibold leading-tight mb-2"
          style={{
            fontFamily: "'Bricolage Grotesque', system-ui, sans-serif",
            color: "#3b1411",
            letterSpacing: "-0.025em",
          }}
        >
          Eliminar rol
        </h2>
        <p
          className="text-xs mb-5"
          style={{ color: "#7a4b49", fontFamily: "'DM Sans', system-ui, sans-serif" }}
        >
          Esta accion no se puede deshacer.
        </p>
        <div className="rounded-xl p-4 mb-4" style={{ backgroundColor: "rgba(163,65,61,0.08)" }}>
          <p className="text-sm font-semibold" style={{ color: "#3b1411" }}>
            {rol.nombre}
          </p>
          <p className="text-xs" style={{ color: "#7a4b49" }}>
            #{rol.id}
          </p>
        </div>
        {error && (
          <p className="text-xs mb-3" style={{ color: "#c2185b" }}>
            {error}
          </p>
        )}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 inline-flex items-center justify-center rounded-full px-4 py-2 text-xs font-medium bg-white/70 hover:opacity-80 transition"
            style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 inline-flex items-center justify-center rounded-full px-4 py-2 text-xs font-medium text-white transition disabled:opacity-55"
            style={{
              backgroundColor: "#c0392b",
              fontFamily: "'DM Sans', system-ui, sans-serif",
            }}
          >
            {loading ? "Eliminando..." : "Eliminar"}
          </button>
        </div>
      </div>
    </ReusableModal>
  );
}
