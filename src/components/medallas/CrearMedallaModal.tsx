import { useMemo, useState } from "react";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import { ReusableModal } from "@/shared/reusable-modal/reusable-modal";
import { crearMedalla } from "@/services/medal.service";
import type { Medal, MedalCreateRequest } from "@/shared/dtos/medal.dto";

type Props = {
  triggerElement: HTMLElement | null;
  onClose: () => void;
  onCreated: (medalla: Medal) => void;
};

export function CrearMedallaModal({ triggerElement, onClose, onCreated }: Props) {
  const [form, setForm] = useState<MedalCreateRequest>({
    nombre_estudiante: "",
    carrera: "",
    disciplina: "",
    fecha: "",
    evento: "",
    ciudad_evento: "",
    modalidad: "INDIVIDUAL",
    tipo_medalla: "ORO",
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
          boxShadow: "0 0 0 2px rgba(16,123,66,0.22)",
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
        color: "#1a1a1a",
      },
    }),
    []
  );

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.nombre_estudiante.trim() || !form.carrera.trim() || !form.disciplina.trim()) {
      setError("Completa todos los campos obligatorios.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const created = await crearMedalla(form);
      onCreated(created);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error creando medalla");
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
      <div className="w-full max-w-[440px] mx-auto pt-6 pb-10">
        <p
          className="text-[10px] font-medium tracking-[0.18em] uppercase mb-2 select-none"
          style={{ color: "#4a7a4a", fontFamily: "'DM Sans', system-ui, sans-serif" }}
        >
          modulo medallas
        </p>

        <h2
          className="text-[1.4rem] font-semibold leading-tight mb-1"
          style={{
            fontFamily: "'Bricolage Grotesque', system-ui, sans-serif",
            color: "#142e14",
            letterSpacing: "-0.025em",
          }}
        >
          Crear medalla
        </h2>

        <p
          className="text-xs mb-5"
          style={{ color: "#5a7a5a", fontFamily: "'DM Sans', system-ui, sans-serif" }}
        >
          Registra una nueva medalla obtenida por un estudiante.
        </p>

        <form className="flex flex-col gap-4" onSubmit={onSubmit}>
          <TextField
            label="Nombre del estudiante"
            variant="filled"
            fullWidth
            value={form.nombre_estudiante}
            onChange={(e) => setForm((prev) => ({ ...prev, nombre_estudiante: e.target.value }))}
            sx={inputSx}
            slotProps={{ input: { disableUnderline: true } }}
          />
          <TextField
            label="Carrera"
            variant="filled"
            fullWidth
            value={form.carrera}
            onChange={(e) => setForm((prev) => ({ ...prev, carrera: e.target.value }))}
            sx={inputSx}
            slotProps={{ input: { disableUnderline: true } }}
          />
          <TextField
            label="Disciplina"
            variant="filled"
            fullWidth
            value={form.disciplina}
            onChange={(e) => setForm((prev) => ({ ...prev, disciplina: e.target.value }))}
            sx={inputSx}
            slotProps={{ input: { disableUnderline: true } }}
          />
          <TextField
            label="Fecha"
            type="date"
            variant="filled"
            fullWidth
            value={form.fecha}
            onChange={(e) => setForm((prev) => ({ ...prev, fecha: e.target.value }))}
            sx={inputSx}
            slotProps={{ input: { disableUnderline: true } }}
          />
          <TextField
            label="Evento"
            variant="filled"
            fullWidth
            value={form.evento}
            onChange={(e) => setForm((prev) => ({ ...prev, evento: e.target.value }))}
            sx={inputSx}
            slotProps={{ input: { disableUnderline: true } }}
          />
          <TextField
            label="Ciudad del evento"
            variant="filled"
            fullWidth
            value={form.ciudad_evento}
            onChange={(e) => setForm((prev) => ({ ...prev, ciudad_evento: e.target.value }))}
            sx={inputSx}
            slotProps={{ input: { disableUnderline: true } }}
          />
          <TextField
            select
            label="Modalidad"
            variant="filled"
            fullWidth
            value={form.modalidad}
            onChange={(e) => setForm((prev) => ({ ...prev, modalidad: e.target.value }))}
            sx={inputSx}
            slotProps={{ input: { disableUnderline: true } }}
          >
            <MenuItem value="INDIVIDUAL">Individual</MenuItem>
            <MenuItem value="GRUPAL">Grupal</MenuItem>
          </TextField>
          <TextField
            select
            label="Tipo de medalla"
            variant="filled"
            fullWidth
            value={form.tipo_medalla}
            onChange={(e) => setForm((prev) => ({ ...prev, tipo_medalla: e.target.value }))}
            sx={inputSx}
            slotProps={{ input: { disableUnderline: true } }}
          >
            <MenuItem value="ORO">🥇 Oro</MenuItem>
            <MenuItem value="PLATA">🥈 Plata</MenuItem>
            <MenuItem value="BRONCE">🥉 Bronce</MenuItem>
          </TextField>

          {error && (
            <p className="text-xs" style={{ color: "#c2185b" }}>{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-[13px] font-medium tracking-wide rounded-full transition-all duration-200 hover:opacity-90 active:scale-[0.98] disabled:opacity-55"
            style={{
              backgroundColor: "#107b42",
              color: "#ffffff",
              border: "none",
              cursor: loading ? "not-allowed" : "pointer",
              fontFamily: "'DM Sans', system-ui, sans-serif",
            }}
          >
            {loading ? "Creando..." : "Crear medalla"}
          </button>
        </form>
      </div>
    </ReusableModal>
  );
}