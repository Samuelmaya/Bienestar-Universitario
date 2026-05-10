import { useMemo, useState } from "react";
import TextField from "@mui/material/TextField";
import { ReusableModal } from "@/shared/reusable-modal/reusable-modal";
import type { Deporte, DeporteCreateRequest } from "@/shared/dtos/deporte.dto";
import { crearDeporte } from "@/shared/services/deportes.service";

type Props = {
  triggerElement: HTMLElement | null;
  onClose: () => void;
  onCreated: (deporte: Deporte) => void;
};

export function CrearDeporteModal({ triggerElement, onClose, onCreated }: Props) {
  const [form, setForm] = useState<DeporteCreateRequest>({
    nom_deporte: "",
    descripcion: "",
    cupo_maximo: null,
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
      const created = await crearDeporte({
        nom_deporte: form.nom_deporte.trim(),
        descripcion: form.descripcion.trim(),
        cupo_maximo: form.cupo_maximo ? Number(form.cupo_maximo) : null,
      });
      onCreated(created);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error creando deporte");
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
          modulo deportes
        </p>
        <h2
          className="text-[1.4rem] font-semibold leading-tight mb-1"
          style={{
            fontFamily: "'Bricolage Grotesque', system-ui, sans-serif",
            color: "#142e14",
            letterSpacing: "-0.025em",
          }}
        >
          Crear deporte
        </h2>
        <p
          className="text-xs mb-5"
          style={{ color: "#5a7a5a", fontFamily: "'DM Sans', system-ui, sans-serif" }}
        >
          Registra un nuevo deporte en el sistema.
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
            {loading ? "Creando..." : "Crear deporte"}
          </button>
        </form>
      </div>
    </ReusableModal>
  );
}
