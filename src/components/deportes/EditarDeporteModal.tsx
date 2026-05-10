import { useMemo, useState } from "react";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import { ReusableModal } from "@/shared/reusable-modal/reusable-modal";
import type { Deporte } from "@/shared/dtos/deporte.dto";
import { actualizarDeporte } from "@/shared/services/deportes.service";

type Props = {
  deporte: Deporte;
  triggerElement: HTMLElement | null;
  onClose: () => void;
  onUpdated: (deporte: Deporte) => void;
};

export function EditarDeporteModal({ deporte, triggerElement, onClose, onUpdated }: Props) {
  const [form, setForm] = useState({
    nom_deporte: deporte.nom_deporte,
    descripcion: deporte.descripcion,
    cupo_maximo: deporte.cupo_maximo ?? null,
    estado: deporte.estado === false ? "inactivo" : "activo",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nom_deporte.trim() || !form.descripcion.trim()) {
      setError("Completa nombre y descripcion.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const updated = await actualizarDeporte(deporte.cod_deporte, {
        nom_deporte: form.nom_deporte.trim(),
        descripcion: form.descripcion.trim(),
        cupo_maximo: form.cupo_maximo ? Number(form.cupo_maximo) : null,
        estado: form.estado === "activo",
      });
      onUpdated(updated);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error actualizando deporte");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ReusableModal
      triggerElement={triggerElement}
      closePosition="left"
      maxWidth="520px"
      backgroundColor="#eaf6ea"
      centerOnDesktop
      onClose={onClose}
    >
      <div className="w-full max-w-[420px] mx-auto pt-6 pb-10">
        <p
          className="text-[10px] font-medium tracking-[0.18em] uppercase mb-2 select-none"
          style={{ color: "#4a7a4a", fontFamily: "'DM Sans', system-ui, sans-serif" }}
        >
          deporte #{deporte.cod_deporte}
        </p>
        <h2
          className="text-[1.4rem] font-semibold leading-tight mb-1"
          style={{
            fontFamily: "'Bricolage Grotesque', system-ui, sans-serif",
            color: "#142e14",
            letterSpacing: "-0.025em",
          }}
        >
          Modificar deporte
        </h2>
        <p
          className="text-xs mb-5"
          style={{ color: "#5a7a5a", fontFamily: "'DM Sans', system-ui, sans-serif" }}
        >
          Actualiza los datos del deporte.
        </p>

        <form
          className="flex flex-col gap-4"
          onSubmit={onSubmit}
          style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}
        >
          <TextField
            label="Nombre"
            variant="filled"
            fullWidth
            value={form.nom_deporte}
            onChange={(e) => setForm((prev) => ({ ...prev, nom_deporte: e.target.value }))}
            disabled={loading}
            sx={inputSx}
            slotProps={{ input: { disableUnderline: true } }}
          />
          <TextField
            label="Descripcion"
            variant="filled"
            fullWidth
            multiline
            minRows={3}
            value={form.descripcion}
            onChange={(e) => setForm((prev) => ({ ...prev, descripcion: e.target.value }))}
            disabled={loading}
            sx={inputSx}
            slotProps={{ input: { disableUnderline: true } }}
          />
          <TextField
            label="Cupo maximo (opcional)"
            variant="filled"
            fullWidth
            type="number"
            value={form.cupo_maximo ?? ""}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                cupo_maximo: e.target.value ? Number(e.target.value) : null,
              }))
            }
            disabled={loading}
            sx={inputSx}
            slotProps={{ input: { disableUnderline: true } }}
          />
          <TextField
            select
            label="Estado"
            variant="filled"
            fullWidth
            value={form.estado}
            onChange={(e) => setForm((prev) => ({ ...prev, estado: e.target.value }))}
            disabled={loading}
            sx={inputSx}
            slotProps={{ input: { disableUnderline: true } }}
          >
            <MenuItem value="activo">Activo</MenuItem>
            <MenuItem value="inactivo">Inactivo</MenuItem>
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
            disabled={loading}
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
            {loading ? "Actualizando..." : "Actualizar deporte"}
          </button>
        </form>
      </div>
    </ReusableModal>
  );
}
