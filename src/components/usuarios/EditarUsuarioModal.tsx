import { useMemo, useState } from "react";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import { ReusableModal } from "@/shared/reusable-modal/reusable-modal";
import type { Usuario } from "@/shared/dtos/usuario.dto";
import type { Rol } from "@/shared/dtos/rol.dto";
import { actualizarUsuario } from "@/shared/services/usuarios.service";

type Props = {
  usuario: Usuario;
  roles: Rol[];
  triggerElement: HTMLElement | null;
  onClose: () => void;
  onUpdated: (usuario: Usuario) => void;
};

export function EditarUsuarioModal({ usuario, roles, triggerElement, onClose, onUpdated }: Props) {
  const [form, setForm] = useState({
    primer_nombre: usuario.primer_nombre,
    segundo_nombre: usuario.segundo_nombre ?? "",
    primer_apellido: usuario.primer_apellido,
    segundo_apellido: usuario.segundo_apellido ?? "",
    email: usuario.email,
    role_id: usuario.role_id ?? 0,
    activo: usuario.activo ? "activo" : "inactivo",
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
    if (!form.primer_nombre.trim() || !form.primer_apellido.trim() || !form.email.trim()) {
      setError("Completa los campos obligatorios.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const updated = await actualizarUsuario(usuario.id, {
        primer_nombre: form.primer_nombre.trim(),
        segundo_nombre: form.segundo_nombre.trim() || null,
        primer_apellido: form.primer_apellido.trim(),
        segundo_apellido: form.segundo_apellido.trim() || null,
        email: form.email.trim(),
        role_id: form.role_id ? Number(form.role_id) : null,
        activo: form.activo === "activo",
      });
      onUpdated(updated);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error actualizando usuario");
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
          usuario #{usuario.id}
        </p>
        <h2
          className="text-[1.4rem] font-semibold leading-tight mb-1"
          style={{
            fontFamily: "'Bricolage Grotesque', system-ui, sans-serif",
            color: "#142e14",
            letterSpacing: "-0.025em",
          }}
        >
          Modificar usuario
        </h2>
        <p
          className="text-xs mb-5"
          style={{ color: "#5a7a5a", fontFamily: "'DM Sans', system-ui, sans-serif" }}
        >
          Actualiza los datos del usuario.
        </p>

        <form
          className="flex flex-col gap-4"
          onSubmit={onSubmit}
          style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}
        >
          <div className="grid grid-cols-2 gap-3">
            <TextField
              label="Primer nombre *"
              variant="filled"
              fullWidth
              value={form.primer_nombre}
              onChange={(e) => setForm((prev) => ({ ...prev, primer_nombre: e.target.value }))}
              disabled={loading}
              sx={inputSx}
              slotProps={{ input: { disableUnderline: true } }}
            />
            <TextField
              label="Segundo nombre"
              variant="filled"
              fullWidth
              value={form.segundo_nombre}
              onChange={(e) => setForm((prev) => ({ ...prev, segundo_nombre: e.target.value }))}
              disabled={loading}
              sx={inputSx}
              slotProps={{ input: { disableUnderline: true } }}
            />
            <TextField
              label="Primer apellido *"
              variant="filled"
              fullWidth
              value={form.primer_apellido}
              onChange={(e) => setForm((prev) => ({ ...prev, primer_apellido: e.target.value }))}
              disabled={loading}
              sx={inputSx}
              slotProps={{ input: { disableUnderline: true } }}
            />
            <TextField
              label="Segundo apellido"
              variant="filled"
              fullWidth
              value={form.segundo_apellido}
              onChange={(e) => setForm((prev) => ({ ...prev, segundo_apellido: e.target.value }))}
              disabled={loading}
              sx={inputSx}
              slotProps={{ input: { disableUnderline: true } }}
            />
          </div>

          <TextField
            label="Correo electronico *"
            variant="filled"
            fullWidth
            type="email"
            value={form.email}
            onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
            disabled={loading}
            sx={inputSx}
            slotProps={{ input: { disableUnderline: true } }}
          />

          <div className="grid grid-cols-2 gap-3">
            <TextField
              select
              label="Rol"
              variant="filled"
              fullWidth
              value={form.role_id || ""}
              onChange={(e) => setForm((prev) => ({ ...prev, role_id: Number(e.target.value) }))}
              disabled={loading}
              sx={inputSx}
              slotProps={{ input: { disableUnderline: true } }}
            >
              {roles.map((r) => (
                <MenuItem key={r.id} value={r.id}>
                  {r.nombre}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select
              label="Estado"
              variant="filled"
              fullWidth
              value={form.activo}
              onChange={(e) => setForm((prev) => ({ ...prev, activo: e.target.value }))}
              disabled={loading}
              sx={inputSx}
              slotProps={{ input: { disableUnderline: true } }}
            >
              <MenuItem value="activo">Activo</MenuItem>
              <MenuItem value="inactivo">Inactivo</MenuItem>
            </TextField>
          </div>

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
            {loading ? "Actualizando..." : "Actualizar usuario"}
          </button>
        </form>
      </div>
    </ReusableModal>
  );
}
