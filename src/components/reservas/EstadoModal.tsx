import { useEffect, useMemo, useState } from "react";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import { ReusableModal } from "@/shared/reusable-modal/reusable-modal";
import type { PeticionListItem, EstadoPeticion } from "@/shared/dtos/peticion.dto";
import { actualizarEstadoPeticion } from "@/services/peticiones.service";

type Props = {
  peticion: PeticionListItem;
  triggerElement: HTMLElement | null;
  onClose: () => void;
  onSuccess: (id: number, nuevoEstado: string) => void;
};

export function EstadoModal({ peticion, triggerElement, onClose, onSuccess }: Props) {
  const [nuevoEstado, setNuevoEstado] = useState<EstadoPeticion>("APROBADA");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const estadosDisponibles = useMemo<EstadoPeticion[]>(() => {
    if (peticion.estado === "PENDIENTE") {
      return ["APROBADA", "RECHAZADA"];
    }
    if (peticion.estado === "APROBADA") {
      return ["DEVUELTA"];
    }
    return [];
  }, [peticion.estado]);

  const inputSx = useMemo(
    () => ({
      "& .MuiFilledInput-root": {
        backgroundColor: "rgba(255,255,255,0.6)",
        borderRadius: "12px",
        transition: "background 0.2s, box-shadow 0.2s",
        "&:before": { borderBottom: "none !important" },
        "&:after": { borderBottom: "none !important" },
        "&:hover:before": { borderBottom: "none !important" },
        "&:hover": { backgroundColor: "rgba(255,255,255,0.75)" },
        "&.Mui-focused": {
          backgroundColor: "rgba(255,255,255,0.92)",
          boxShadow: "0 0 0 2px rgba(16, 123, 66, 0.22)",
        },
      },
      "& .MuiInputLabel-root": {
        color: "#5a7a5a",
        fontSize: "0.875rem",
        fontFamily: "'DM Sans', system-ui, sans-serif",
      },
      "& .MuiInputLabel-root.Mui-focused": { color: "#107b42" },
      "& .MuiFilledInput-input": {
        paddingTop: "22px",
        paddingBottom: "8px",
        fontFamily: "'DM Sans', system-ui, sans-serif",
        fontSize: "0.9rem",
        color: "#1a2e1a",
      },
    }),
    [],
  );

  useEffect(() => {
    if (estadosDisponibles.length === 0) {
      return;
    }
    if (!estadosDisponibles.includes(nuevoEstado)) {
      setNuevoEstado(estadosDisponibles[0]);
    }
  }, [estadosDisponibles, nuevoEstado]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (estadosDisponibles.length === 0) {
      setError("Este estado no permite cambios.");
      return;
    }
    if (nuevoEstado === peticion.estado) {
      setError("Selecciona un estado diferente al actual.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await actualizarEstadoPeticion(peticion.id_peticion, { estado: nuevoEstado });
      onSuccess(peticion.id_peticion, nuevoEstado);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error actualizando estado");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ReusableModal
      triggerElement={triggerElement}
      closePosition="left"
      maxWidth="440px"
      backgroundColor="#eaf6ea"
      centerOnDesktop
      onClose={onClose}
    >
      <div className="w-full max-w-[340px] mx-auto pt-6 pb-10">
        <p
          className="text-[10px] font-medium tracking-[0.18em] uppercase mb-2 select-none"
          style={{ color: "#4a7a4a", fontFamily: "'DM Sans', system-ui, sans-serif" }}
        >
          petición #{peticion.id_peticion}
        </p>
        <h2
          className="text-[1.4rem] font-semibold leading-tight mb-1"
          style={{
            fontFamily: "'Bricolage Grotesque', system-ui, sans-serif",
            color: "#142e14",
            letterSpacing: "-0.025em",
          }}
        >
          Cambiar estado
        </h2>
        <p
          className="text-xs mb-5"
          style={{ color: "#5a7a5a", fontFamily: "'DM Sans', system-ui, sans-serif" }}
        >
          {peticion.nombre_solicitante} · Estado actual: <strong>{peticion.estado}</strong>
        </p>
        <form
          className="flex flex-col gap-4"
          onSubmit={onSubmit}
          style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}
        >
          <TextField
            select
            label="Nuevo estado"
            variant="filled"
            fullWidth
            value={nuevoEstado}
            onChange={(e) => setNuevoEstado(e.target.value as EstadoPeticion)}
            disabled={loading || estadosDisponibles.length === 0}
            sx={inputSx}
            slotProps={{ input: { disableUnderline: true } }}
          >
            {estadosDisponibles.map((e) => (
              <MenuItem key={e} value={e}>
                {e}
              </MenuItem>
            ))}
          </TextField>
          {error && (
            <p
              className="text-xs"
              style={{ color: "#c2185b", fontFamily: "'DM Sans', system-ui, sans-serif" }}
            >
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={loading || estadosDisponibles.length === 0}
            className="w-full py-[13px] font-medium tracking-wide rounded-full transition-all duration-200 hover:opacity-90 active:scale-[0.98] disabled:opacity-55"
            style={{
              backgroundColor: "#107b42",
              color: "#ffffff",
              fontSize: "0.88rem",
              letterSpacing: "0.04em",
              border: "none",
              cursor: loading ? "not-allowed" : "pointer",
              fontFamily: "'DM Sans', system-ui, sans-serif",
            }}
          >
            {loading ? "Actualizando..." : "Actualizar estado"}
          </button>
        </form>
      </div>
    </ReusableModal>
  );
}
