import { useEffect, useMemo, useState } from "react";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import { ReusableModal } from "@/shared/reusable-modal/reusable-modal";
import type { ArticuloDeportivo } from "@/shared/dtos/articulo.dto";
import type { CategoriaArticulo } from "@/shared/dtos/categoria.dto";
import { actualizarArticulo } from "@/shared/services/articulos.service";
import { listarCategorias } from "@/shared/services/categorias.service";

type Props = {
  articulo: ArticuloDeportivo;
  triggerElement: HTMLElement | null;
  onClose: () => void;
  onUpdated: (articulo: ArticuloDeportivo) => void;
};

export function EditarArticuloModal({ articulo, triggerElement, onClose, onUpdated }: Props) {
  const [form, setForm] = useState({
    nombre: articulo.nombre,
    cantidad: articulo.cantidad,
    dañados: articulo.dañados,
    estado: articulo.estado,
    id_categoria: articulo.id_categoria,
    observaciones: articulo.observaciones,
  });
  const [categorias, setCategorias] = useState<CategoriaArticulo[]>([]);
  const [loadingCats, setLoadingCats] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoadingCats(true);
    listarCategorias()
      .then((data) => setCategorias(data))
      .catch(() => setCategorias([]))
      .finally(() => setLoadingCats(false));
  }, []);

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
    if (!form.nombre.trim() || !form.id_categoria) {
      setError("Completa nombre y categoria.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const updated = await actualizarArticulo(articulo.id_articulo, {
        nombre: form.nombre.trim(),
        observaciones: form.observaciones?.trim() || "",
        cantidad: Number(form.cantidad) || 0,
        dañados: Number(form.dañados) || 0,
        id_categoria: Number(form.id_categoria),
        estado: form.estado,
      });
      onUpdated(updated);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error actualizando articulo");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ReusableModal
      triggerElement={triggerElement}
      closePosition="left"
      maxWidth="560px"
      backgroundColor="#eaf6ea"
      centerOnDesktop
      onClose={onClose}
    >
      <div className="w-full max-w-[440px] mx-auto pt-6 pb-10">
        <p
          className="text-[10px] font-medium tracking-[0.18em] uppercase mb-2 select-none"
          style={{ color: "#4a7a4a", fontFamily: "'DM Sans', system-ui, sans-serif" }}
        >
          articulo #{articulo.id_articulo}
        </p>
        <h2
          className="text-[1.4rem] font-semibold leading-tight mb-1"
          style={{
            fontFamily: "'Bricolage Grotesque', system-ui, sans-serif",
            color: "#142e14",
            letterSpacing: "-0.025em",
          }}
        >
          Modificar articulo
        </h2>
        <p
          className="text-xs mb-5"
          style={{ color: "#5a7a5a", fontFamily: "'DM Sans', system-ui, sans-serif" }}
        >
          Actualiza los datos del articulo.
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
            value={form.nombre}
            onChange={(e) => setForm((prev) => ({ ...prev, nombre: e.target.value }))}
            disabled={loading}
            sx={inputSx}
            slotProps={{ input: { disableUnderline: true } }}
          />
          <TextField
            label="Cantidad"
            variant="filled"
            fullWidth
            type="number"
            value={form.cantidad}
            onChange={(e) => setForm((prev) => ({ ...prev, cantidad: Number(e.target.value) }))}
            disabled={loading}
            sx={inputSx}
            slotProps={{ input: { disableUnderline: true } }}
          />
          <TextField
            label="Dañados"
            variant="filled"
            fullWidth
            type="number"
            value={form.dañados}
            onChange={(e) => setForm((prev) => ({ ...prev, dañados: Number(e.target.value) }))}
            disabled={loading}
            sx={inputSx}
            slotProps={{ input: { disableUnderline: true } }}
          />
          <TextField
            select
            label="Categoria"
            variant="filled"
            fullWidth
            value={form.id_categoria || ""}
            onChange={(e) => setForm((prev) => ({ ...prev, id_categoria: Number(e.target.value) }))}
            disabled={loading || loadingCats}
            sx={inputSx}
            slotProps={{ input: { disableUnderline: true } }}
          >
            {categorias.map((c) => (
              <MenuItem key={c.id_categoria} value={c.id_categoria}>
                {c.nombre}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Estado"
            variant="filled"
            fullWidth
            value={form.estado}
            onChange={(e) => setForm((prev) => ({ ...prev, estado: e.target.value }))}
            disabled={loading}
            sx={inputSx}
            slotProps={{ input: { disableUnderline: true } }}
          />
          <TextField
            label="Observaciones"
            variant="filled"
            fullWidth
            multiline
            minRows={3}
            value={form.observaciones}
            onChange={(e) => setForm((prev) => ({ ...prev, observaciones: e.target.value }))}
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
            {loading ? "Actualizando..." : "Actualizar articulo"}
          </button>
        </form>
      </div>
    </ReusableModal>
  );
}
