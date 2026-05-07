import { useMemo, useState, type FormEvent } from "react";
import TextField from "@mui/material/TextField";
import { useAuth } from "@/lib/auth";
import { ReusableModal } from "@/shared/reusable-modal/reusable-modal";
import logoApp from "@/assets/logo-app.png";

type Props = {
  triggerElement?: HTMLElement | null;
  onClose?: () => void;
};

export function LoginModal({ triggerElement, onClose }: Props) {
  const { login, user } = useAuth();
  const [email, setEmail] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [validationError, setValidationError] = useState("");

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
      "& .MuiFilledInput-input:focus": { boxShadow: "none" },
    }),
    [],
  );

  const validate = () => {
    setValidationError("");
    if (!email || email.length < 5 || email.length > 255) {
      setValidationError("El email debe tener entre 5 y 255 caracteres.");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setValidationError("El email no tiene un formato válido.");
      return false;
    }
    if (!contrasena || contrasena.length < 6 || contrasena.length > 100) {
      setValidationError("La contraseña debe tener entre 6 y 100 caracteres.");
      return false;
    }
    return true;
  };

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setValidationError("");
    try {
      await login({ email, contrasena });
      onClose?.();
    } catch (err) {
      setValidationError(
        err instanceof Error ? err.message : "Ocurrió un error inesperado. Inténtalo de nuevo.",
      );
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
      {/* Centering wrapper — creates generous whitespace on sides and top/bottom */}
      <div className="w-full max-w-[330px] mx-auto pt-10 pb-14">
        {/* ── Header ── */}
        <div className="mb-8">
          <img src={logoApp} alt="Bienestar Deportivo" className="h-10 w-10 object-cover mb-5" />
          <p
            className="text-[10px] font-medium tracking-[0.18em] uppercase mb-2.5 select-none"
            style={{ color: "#4a7a4a", fontFamily: "'DM Sans', system-ui, sans-serif" }}
          >
            bienestar deportivo · UPC
          </p>
          <h2
            className="text-[1.65rem] font-semibold leading-tight"
            style={{
              fontFamily: "'Bricolage Grotesque', system-ui, sans-serif",
              color: "#142e14",
              letterSpacing: "-0.025em",
            }}
          >
            Inicia sesión
          </h2>
        </div>

        {/* ── Form ── */}
        <form
          className="flex flex-col gap-5"
          onSubmit={onSubmit}
          style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}
        >
          {/* Inputs close together */}
          <div className="flex flex-col gap-2.5">
            <TextField
              label="Correo electrónico"
              type="email"
              variant="filled"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              sx={inputSx}
              slotProps={{ input: { disableUnderline: true } }}
            />

            <div className="relative">
              <TextField
                label="Contraseña"
                type={showPassword ? "text" : "password"}
                variant="filled"
                fullWidth
                value={contrasena}
                onChange={(e) => setContrasena(e.target.value)}
                disabled={loading}
                sx={inputSx}
                slotProps={{ input: { disableUnderline: true } }}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center p-1 rounded-full transition-opacity hover:opacity-70"
                style={{
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  color: "#6a9a6a",
                }}
                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              >
                <span
                  className="material-symbols-outlined"
                  style={{
                    fontSize: "20px",
                    fontVariationSettings: "'FILL' 0, 'wght' 200, 'GRAD' 0, 'opsz' 24",
                  }}
                >
                  {showPassword ? "visibility_off" : "visibility"}
                </span>
              </button>
            </div>
          </div>

          {/* Validation error */}
          {validationError && (
            <p
              className="text-xs -mt-2"
              style={{ color: "#c2185b", fontFamily: "'DM Sans', system-ui, sans-serif" }}
            >
              {validationError}
            </p>
          )}

          {/* Submit */}
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
            {loading ? "Ingresando..." : "Iniciar sesión"}
          </button>
        </form>
      </div>

      {user?.role && (
        <div
          className="absolute left-6 bottom-4 text-[10px]"
          style={{ color: "#7a9a7a", fontFamily: "'DM Sans', system-ui, sans-serif" }}
        >
          ROL: {user.role}
        </div>
      )}
    </ReusableModal>
  );
}
