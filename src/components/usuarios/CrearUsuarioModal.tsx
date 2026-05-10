import { useMemo, useState } from "react";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import { ReusableModal } from "@/shared/reusable-modal/reusable-modal";
import type { Usuario, UsuarioCreateRequest } from "@/shared/dtos/usuario.dto";
import type { Rol } from "@/shared/dtos/rol.dto";
import { crearUsuario } from "@/shared/services/usuarios.service";

type Props = {
  roles: Rol[];
  triggerElement: HTMLElement | null;
  onClose: () => void;
  onCreated: (usuario: Usuario) => void;
};

export function CrearUsuarioModal({ roles, triggerElement, onClose, onCreated }: Props) {
  const [form, setForm] = useState<UsuarioCreateRequest>({
    primer_nombre: "",
    segundo_nombre: null,
    primer_apellido: "",
    segundo_apellido: null,
    email: "",
    contrasena: "",
    role_id: 0,
    activo: true,
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
    if (
      !form.primer_nombre.trim() ||
      !form.primer_apellido.trim() ||
      !form.email.trim() ||
      !form.contrasena.trim() ||
      !form.role_id
    ) {
      setError("Completa los campos obligatorios.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const created = await crearUsuario({
        primer_nombre: form.primer_nombre.trim(),
        segundo_nombre: form.segundo_nombre?.trim() || null,
        primer_apellido: form.primer_apellido.trim(),
        segundo_apellido: form.segundo_apellido?.trim() || null,
        email: form.email.trim(),
        contrasena: form.contrasena,
        role_id: Number(form.role_id),
        activo: form.activo,
      });
      onCreated(created);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error creando usuario");
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
          gestion de usuarios
        </p>
        <h2
          className="text-[1.4rem] font-semibold leading-tight mb-1"
          style={{
            fontFamily: "'Bricolage Grotesque', system-ui, sans-serif",
            color: "#142e14",
            letterSpacing: "-0.025em",
          }}
        >
          Crear usuario
        </h2>
        <p
          className="text-xs mb-5"
          style={{ color: "#5a7a5a", fontFamily: "'DM Sans', system-ui, sans-serif" }}
        >
          Registra un nuevo usuario en el sistema.
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
              value={form.segundo_nombre ?? ""}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, segundo_nombre: e.target.value || null }))
              }
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
              value={form.segundo_apellido ?? ""}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, segundo_apellido: e.target.value || null }))
              }
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
          <TextField
            label="Contrasena *"
            variant="filled"
            fullWidth
            type="password"
            value={form.contrasena}
            onChange={(e) => setForm((prev) => ({ ...prev, contrasena: e.target.value }))}
            disabled={loading}
            sx={inputSx}
            slotProps={{ input: { disableUnderline: true } }}
          />

          <div className="grid grid-cols-2 gap-3">
            <TextField
              select
              label="Rol *"
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
              value={form.activo ? "activo" : "inactivo"}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, activo: e.target.value === "activo" }))
              }
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
            {loading ? "Creando..." : "Crear usuario"}
          </button>
        </form>
      </div>
    </ReusableModal>
  );
}
