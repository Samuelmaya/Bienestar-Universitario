import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Package,
  MapPin,
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  Send,
  AlertCircle,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { ReusableModal } from "@/shared/reusable-modal/reusable-modal";
import TextField from "@mui/material/TextField";
import type {
  ArticuloDisponible,
  CartItem,
  PeticionCreateRequest,
} from "@/shared/dtos/peticion.dto";
import type { EspacioDeportivo, SolicitudEspacioCreateRequest } from "@/shared/dtos/espacio.dto";
import {
  listarArticulosDisponibles,
  crearPeticion,
} from "@/services/peticiones.service";
import {
  listarEspaciosDeportivos,
  crearSolicitudEspacio,
} from "@/services/espacio.service";

export const Route = createFileRoute("/peticiones")({
  head: () => ({
    meta: [
      { title: "Reservas — Bienestar Deportivo UPC" },
      {
        name: "description",
        content:
          "Reserva implementos y escenarios deportivos de la Universidad Popular del Cesar.",
      },
    ],
  }),
  component: PeticionesPage,
});

type Tab = "productos" | "escenarios";

/* ───────────────────────── page ───────────────────────── */
function PeticionesPage() {
  const [tab, setTab] = useState<Tab>("productos");

  return (
    <>
      <PageHeader
        title="Reservas Deportivas"
        subtitle="Solicita el préstamo de implementos o escenarios deportivos."
      />

      <section className="container mx-auto px-4 py-8">
        {/* Tab selector */}
        <div className="flex gap-2 mb-8">
          <TabButton
            active={tab === "productos"}
            icon={Package}
            label="Productos deportivos"
            onClick={() => setTab("productos")}
          />
          <TabButton
            active={tab === "escenarios"}
            icon={MapPin}
            label="Escenarios deportivos"
            onClick={() => setTab("escenarios")}
          />
        </div>

        {tab === "productos" ? <ProductosTab /> : <EscenariosTab />}
      </section>
    </>
  );
}

/* ───────────── tab button ───────────── */
function TabButton({
  active,
  icon: Icon,
  label,
  onClick,
}: {
  active: boolean;
  icon: typeof Package;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition-all duration-200 border ${
        active
          ? "bg-primary text-primary-foreground border-primary shadow-[var(--shadow-soft)]"
          : "bg-card text-foreground border-border hover:border-primary/40 hover:bg-accent/40"
      }`}
    >
      <Icon className="h-4 w-4" />
      {label}
    </button>
  );
}

/* ───────────── escenarios tab ───────────── */
function EscenariosTab() {
  const [espacios, setEspacios] = useState<EspacioDeportivo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedEspacio, setSelectedEspacio] = useState<EspacioDeportivo | null>(null);
  const [successMsg, setSuccessMsg] = useState("");
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    setLoading(true);
    setError("");
    listarEspaciosDeportivos()
      .then((data) =>
        setEspacios(
          data.filter(
            (e) => !e.estado || e.estado.toUpperCase() === "DISPONIBLE",
          ),
        ),
      )
      .catch((err) =>
        setError(err instanceof Error ? err.message : "Error cargando espacios"),
      )
      .finally(() => setLoading(false));
  }, []);

  const handleSuccess = () => {
    setSelectedEspacio(null);
    setSuccessMsg("¡Solicitud de reserva enviada correctamente!");
    setTimeout(() => setSuccessMsg(""), 5000);
  };

  return (
    <>
      {/* Success banner */}
      {successMsg && (
        <div className="mb-6 flex items-center gap-2 p-4 rounded-xl bg-green-500/10 text-green-600 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="h-5 w-5 shrink-0" />
          <p className="font-medium">{successMsg}</p>
        </div>
      )}

      {loading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 p-4 rounded-xl bg-destructive/10 text-destructive">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {!loading && !error && espacios.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="rounded-2xl bg-accent/60 p-6 mb-6">
            <MapPin className="h-12 w-12 text-primary" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Sin espacios disponibles</h2>
          <p className="text-muted-foreground max-w-md">
            No hay escenarios deportivos disponibles en este momento. Intenta más tarde.
          </p>
        </div>
      )}

      {!loading && !error && espacios.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {espacios.map((espacio) => (
            <div
              key={espacio.id_espacio}
              className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-soft)] transition hover:border-primary/40 hover:shadow-[var(--shadow-elegant)]"
            >
              {/* ícono */}
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="rounded-xl bg-accent p-2.5 text-primary">
                  <MapPin className="h-5 w-5" />
                </div>
                <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-green-500/10 text-green-600">
                  Disponible
                </span>
              </div>

              <h3 className="font-semibold text-sm mb-1">{espacio.nombre}</h3>

              {espacio.observaciones && (
                <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                  {espacio.observaciones}
                </p>
              )}

              <button
                ref={selectedEspacio?.id_espacio === espacio.id_espacio ? triggerRef : undefined}
                type="button"
                onClick={(e) => {
                  triggerRef.current = e.currentTarget;
                  setSelectedEspacio(espacio);
                }}
                className="mt-3 w-full inline-flex items-center justify-center gap-1.5 rounded-xl bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground transition hover:opacity-90 active:scale-[0.97]"
              >
                <Send className="h-3.5 w-3.5" /> Solicitar reserva
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Modal de reserva */}
      {selectedEspacio && (
        <ReservaEspacioModal
          triggerElement={triggerRef.current}
          espacio={selectedEspacio}
          onClose={() => setSelectedEspacio(null)}
          onSuccess={handleSuccess}
        />
      )}
    </>
  );
}

/* ───────────── modal reserva escenario ───────────── */
function ReservaEspacioModal({
  triggerElement,
  espacio,
  onClose,
  onSuccess,
}: {
  triggerElement: HTMLElement | null;
  espacio: EspacioDeportivo;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [solicitante, setSolicitante] = useState("");
  const [entidad, setEntidad] = useState("");
  const [fecha, setFecha] = useState("");
  const [horaInicio, setHoraInicio] = useState("");
  const [horaFin, setHoraFin] = useState("");
  const [motivo, setMotivo] = useState("");
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

  const validate = (): boolean => {
    setValidationError("");
    if (!solicitante.trim()) {
      setValidationError("El nombre del solicitante es obligatorio.");
      return false;
    }
    if (!entidad.trim()) {
      setValidationError("La entidad u organización es obligatoria.");
      return false;
    }
    if (!fecha) {
      setValidationError("La fecha es obligatoria.");
      return false;
    }
    if (new Date(fecha) < new Date(new Date().toDateString())) {
      setValidationError("La fecha no puede ser anterior a hoy.");
      return false;
    }
    if (!horaInicio) {
      setValidationError("La hora de inicio es obligatoria.");
      return false;
    }
    if (!horaFin) {
      setValidationError("La hora de fin es obligatoria.");
      return false;
    }
    if (horaInicio >= horaFin) {
      setValidationError("La hora de inicio debe ser anterior a la hora de fin.");
      return false;
    }
    return true;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setValidationError("");

    const payload: SolicitudEspacioCreateRequest = {
      solicitante: solicitante.trim(),
      entidad: entidad.trim(),
      id_espacio: espacio.id_espacio,
      fecha,
      hora_inicio: horaInicio + ":00",
      hora_fin: horaFin + ":00",
      motivo: motivo.trim() || null,
    };

    try {
      await crearSolicitudEspacio(payload);
      onSuccess();
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
      <div className="w-full max-w-[380px] mx-auto pt-6 pb-10">
        {/* Header */}
        <div className="mb-6">
          <p
            className="text-[10px] font-medium tracking-[0.18em] uppercase mb-2 select-none"
            style={{ color: "#4a7a4a", fontFamily: "'DM Sans', system-ui, sans-serif" }}
          >
            bienestar deportivo · UPC
          </p>
          <h2
            className="text-[1.5rem] font-semibold leading-tight"
            style={{
              fontFamily: "'Bricolage Grotesque', system-ui, sans-serif",
              color: "#142e14",
              letterSpacing: "-0.025em",
            }}
          >
            Reserva de escenario
          </h2>
          <p
            className="mt-1 text-xs"
            style={{ color: "#5a7a5a", fontFamily: "'DM Sans', system-ui, sans-serif" }}
          >
            Completa tus datos para solicitar el espacio.
          </p>
        </div>

        {/* Espacio seleccionado */}
        <div className="mb-5 rounded-xl p-3" style={{ backgroundColor: "rgba(16,123,66,0.08)" }}>
          <p className="text-xs font-semibold mb-0.5" style={{ color: "#107b42" }}>
            Escenario seleccionado
          </p>
          <p className="text-sm font-bold" style={{ color: "#142e14" }}>
            {espacio.nombre}
          </p>
          {espacio.observaciones && (
            <p className="text-xs mt-0.5" style={{ color: "#3a6a3a" }}>
              {espacio.observaciones}
            </p>
          )}
        </div>

        {/* Form */}
        <form
          className="flex flex-col gap-4"
          onSubmit={onSubmit}
          style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}
        >
          <div className="flex flex-col gap-2.5">
            <TextField
              label="Nombre del solicitante"
              variant="filled"
              fullWidth
              value={solicitante}
              onChange={(e) => setSolicitante(e.target.value)}
              disabled={loading}
              sx={inputSx}
              slotProps={{ input: { disableUnderline: true } }}
            />
            <TextField
              label="Entidad u organización"
              variant="filled"
              fullWidth
              value={entidad}
              onChange={(e) => setEntidad(e.target.value)}
              disabled={loading}
              sx={inputSx}
              slotProps={{ input: { disableUnderline: true } }}
            />
            <TextField
              label="Fecha"
              type="date"
              variant="filled"
              fullWidth
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              disabled={loading}
              sx={inputSx}
              slotProps={{
                input: { disableUnderline: true, inputProps: { min: new Date().toISOString().split("T")[0] } },
                inputLabel: { shrink: true },
              }}
            />
            <div className="grid grid-cols-2 gap-2.5">
              <TextField
                label="Hora inicio"
                type="time"
                variant="filled"
                fullWidth
                value={horaInicio}
                onChange={(e) => setHoraInicio(e.target.value)}
                disabled={loading}
                sx={inputSx}
                slotProps={{
                  input: { disableUnderline: true },
                  inputLabel: { shrink: true },
                }}
              />
              <TextField
                label="Hora fin"
                type="time"
                variant="filled"
                fullWidth
                value={horaFin}
                onChange={(e) => setHoraFin(e.target.value)}
                disabled={loading}
                sx={inputSx}
                slotProps={{
                  input: { disableUnderline: true },
                  inputLabel: { shrink: true },
                }}
              />
            </div>
            <TextField
              label="Motivo (opcional)"
              variant="filled"
              fullWidth
              multiline
              minRows={2}
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              disabled={loading}
              sx={inputSx}
              slotProps={{ input: { disableUnderline: true } }}
            />
          </div>

          {validationError && (
            <p
              className="text-xs -mt-1"
              style={{ color: "#c2185b", fontFamily: "'DM Sans', system-ui, sans-serif" }}
            >
              {validationError}
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
            {loading ? "Enviando..." : "Enviar solicitud"}
          </button>
        </form>
      </div>
    </ReusableModal>
  );
}

/* ───────────── productos tab ───────────── */
function ProductosTab() {
  const [articulos, setArticulos] = useState<ArticuloDisponible[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    setLoading(true);
    setError("");
    listarArticulosDisponibles()
      .then(setArticulos)
      .catch((err) =>
        setError(
          err instanceof Error ? err.message : "Error cargando artículos",
        ),
      )
      .finally(() => setLoading(false));
  }, []);

  const disponibilidad = useCallback(
    (a: ArticuloDisponible) =>
      a.cantidad - a.dañados - (a.cantidad_reservada ?? 0),
    [],
  );

  const cartCount = useMemo(
    () => cart.reduce((s, c) => s + c.cantidad, 0),
    [cart],
  );

  const addToCart = (articulo: ArticuloDisponible) => {
    const disp = disponibilidad(articulo);
    if (disp <= 0) return;
    setCart((prev) => {
      const existing = prev.find(
        (c) => c.articulo.id_articulo === articulo.id_articulo,
      );
      if (existing) {
        if (existing.cantidad >= disp) return prev;
        return prev.map((c) =>
          c.articulo.id_articulo === articulo.id_articulo
            ? { ...c, cantidad: c.cantidad + 1 }
            : c,
        );
      }
      return [...prev, { articulo, cantidad: 1 }];
    });
  };

  const updateQty = (id: number, delta: number) => {
    setCart((prev) => {
      return prev
        .map((c) => {
          if (c.articulo.id_articulo !== id) return c;
          const disp = disponibilidad(c.articulo);
          const next = c.cantidad + delta;
          if (next <= 0) return null;
          if (next > disp) return c;
          return { ...c, cantidad: next };
        })
        .filter(Boolean) as CartItem[];
    });
  };

  const removeFromCart = (id: number) =>
    setCart((prev) => prev.filter((c) => c.articulo.id_articulo !== id));

  const handleSuccess = () => {
    setCart([]);
    setModalOpen(false);
    setSuccessMsg("¡Solicitud enviada correctamente!");
    setTimeout(() => setSuccessMsg(""), 5000);
  };

  return (
    <>
      {successMsg && (
        <div className="mb-6 flex items-center gap-2 p-4 rounded-xl bg-green-500/10 text-green-600 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="h-5 w-5 shrink-0" />
          <p className="font-medium">{successMsg}</p>
        </div>
      )}

      {cart.length > 0 && (
        <div className="mb-6 flex items-center justify-between gap-4 rounded-2xl border border-primary/30 bg-accent/50 p-4 shadow-[var(--shadow-soft)]">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-primary p-2 text-primary-foreground">
              <ShoppingCart className="h-5 w-5" />
            </div>
            <div>
              <p className="font-semibold text-sm">
                {cartCount} artículo{cartCount > 1 ? "s" : ""} en el carrito
              </p>
              <p className="text-xs text-muted-foreground">
                {cart.length} tipo{cart.length > 1 ? "s" : ""} diferentes
              </p>
            </div>
          </div>
          <button
            ref={triggerRef}
            type="button"
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition hover:opacity-90 active:scale-[0.97]"
          >
            <Send className="h-4 w-4" /> Enviar solicitud
          </button>
        </div>
      )}

      {cart.length > 0 && (
        <div className="mb-8 rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-soft)]">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <ShoppingCart className="h-4 w-4 text-primary" /> Tu carrito
          </h3>
          <div className="divide-y divide-border">
            {cart.map((c) => (
              <div
                key={c.articulo.id_articulo}
                className="flex items-center justify-between gap-4 py-3"
              >
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-sm truncate">{c.articulo.nombre}</p>
                  <p className="text-xs text-muted-foreground">
                    Disponible: {disponibilidad(c.articulo)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => updateQty(c.articulo.id_articulo, -1)}
                    className="rounded-lg border border-border p-1.5 hover:bg-accent transition"
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                  <span className="w-8 text-center text-sm font-semibold">{c.cantidad}</span>
                  <button
                    type="button"
                    onClick={() => updateQty(c.articulo.id_articulo, 1)}
                    className="rounded-lg border border-border p-1.5 hover:bg-accent transition"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeFromCart(c.articulo.id_articulo)}
                    className="rounded-lg p-1.5 text-destructive hover:bg-destructive/10 transition ml-1"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {loading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}
      {error && (
        <div className="flex items-center gap-2 p-4 rounded-xl bg-destructive/10 text-destructive">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <p>{error}</p>
        </div>
      )}
      {!loading && !error && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {articulos
            .filter((a) => a.estado === "DISPONIBLE" || a.estado === "disponible")
            .map((a) => {
              const disp = disponibilidad(a);
              const inCart = cart.find((c) => c.articulo.id_articulo === a.id_articulo);
              return (
                <div
                  key={a.id_articulo}
                  className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-soft)] transition hover:border-primary/40 hover:shadow-[var(--shadow-elegant)]"
                >
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="rounded-xl bg-accent p-2.5 text-primary">
                      <Package className="h-5 w-5" />
                    </div>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        disp > 0
                          ? "bg-green-500/10 text-green-600"
                          : "bg-red-500/10 text-red-500"
                      }`}
                    >
                      {disp > 0 ? `${disp} disp.` : "Agotado"}
                    </span>
                  </div>
                  <h3 className="font-semibold text-sm mb-1">{a.nombre}</h3>
                  {a.observaciones && (
                    <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                      {a.observaciones}
                    </p>
                  )}
                  <div className="flex items-center justify-between mt-auto pt-2">
                    <div className="text-xs text-muted-foreground space-y-0.5">
                      <p>Total: {a.cantidad}</p>
                      <p>
                        Reservados: {a.cantidad_reservada ?? 0} · Dañados: {a.dañados}
                      </p>
                    </div>
                    {inCart ? (
                      <span className="text-xs font-semibold text-primary bg-accent rounded-lg px-3 py-1.5">
                        ✓ En carrito ({inCart.cantidad})
                      </span>
                    ) : (
                      <button
                        type="button"
                        disabled={disp <= 0}
                        onClick={() => addToCart(a)}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground transition hover:opacity-90 active:scale-[0.97] disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        <Plus className="h-3.5 w-3.5" /> Agregar
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
        </div>
      )}

      {modalOpen && (
        <SolicitudModal
          triggerElement={triggerRef.current}
          cart={cart}
          onClose={() => setModalOpen(false)}
          onSuccess={handleSuccess}
        />
      )}
    </>
  );
}

/* ───────────── modal solicitud productos ───────────── */
function SolicitudModal({
  triggerElement,
  cart,
  onClose,
  onSuccess,
}: {
  triggerElement: HTMLElement | null;
  cart: CartItem[];
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [telefono, setTelefono] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
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

  const validate = (): boolean => {
    setValidationError("");
    if (!nombre.trim()) { setValidationError("El nombre es obligatorio."); return false; }
    if (!correo || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
      setValidationError("El correo no tiene un formato válido."); return false;
    }
    if (!telefono || !/^\d{10}$/.test(telefono)) {
      setValidationError("El teléfono debe tener exactamente 10 dígitos."); return false;
    }
    if (!descripcion.trim()) { setValidationError("La descripción es obligatoria."); return false; }
    if (!fechaInicio) { setValidationError("La fecha de inicio es obligatoria."); return false; }
    if (!fechaFin) { setValidationError("La fecha de fin es obligatoria."); return false; }
    if (new Date(fechaFin) <= new Date(fechaInicio)) {
      setValidationError("La fecha de fin debe ser mayor que la de inicio."); return false;
    }
    if (cart.length === 0) { setValidationError("El carrito está vacío."); return false; }
    return true;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setValidationError("");
    const payload: PeticionCreateRequest = {
      nombre_solicitante: nombre.trim(),
      correo: correo.trim(),
      telefono,
      descripcion: descripcion.trim(),
      fecha_inicio: new Date(fechaInicio).toISOString().slice(0, 19),
      fecha_fin: new Date(fechaFin).toISOString().slice(0, 19),
      detalle: cart.map((c) => ({ id_articulo: c.articulo.id_articulo, cantidad: c.cantidad })),
    };
    try {
      await crearPeticion(payload);
      onSuccess();
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
      <div className="w-full max-w-[380px] mx-auto pt-6 pb-10">
        <div className="mb-6">
          <p
            className="text-[10px] font-medium tracking-[0.18em] uppercase mb-2 select-none"
            style={{ color: "#4a7a4a", fontFamily: "'DM Sans', system-ui, sans-serif" }}
          >
            bienestar deportivo · UPC
          </p>
          <h2
            className="text-[1.5rem] font-semibold leading-tight"
            style={{
              fontFamily: "'Bricolage Grotesque', system-ui, sans-serif",
              color: "#142e14",
              letterSpacing: "-0.025em",
            }}
          >
            Datos del solicitante
          </h2>
          <p
            className="mt-1 text-xs"
            style={{ color: "#5a7a5a", fontFamily: "'DM Sans', system-ui, sans-serif" }}
          >
            Completa tus datos para enviar la solicitud de préstamo.
          </p>
        </div>

        <div className="mb-5 rounded-xl p-3" style={{ backgroundColor: "rgba(16,123,66,0.08)" }}>
          <p className="text-xs font-semibold mb-1" style={{ color: "#107b42" }}>
            Resumen del pedido
          </p>
          {cart.map((c) => (
            <p key={c.articulo.id_articulo} className="text-xs" style={{ color: "#3a6a3a" }}>
              {c.articulo.nombre} × {c.cantidad}
            </p>
          ))}
        </div>

        <form
          className="flex flex-col gap-4"
          onSubmit={onSubmit}
          style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}
        >
          <div className="flex flex-col gap-2.5">
            <TextField label="Nombre completo" variant="filled" fullWidth value={nombre}
              onChange={(e) => setNombre(e.target.value)} disabled={loading} sx={inputSx}
              slotProps={{ input: { disableUnderline: true } }} />
            <TextField label="Correo electrónico" type="email" variant="filled" fullWidth
              value={correo} onChange={(e) => setCorreo(e.target.value)} disabled={loading}
              sx={inputSx} slotProps={{ input: { disableUnderline: true } }} />
            <TextField label="Teléfono (10 dígitos)" variant="filled" fullWidth value={telefono}
              onChange={(e) => { const v = e.target.value.replace(/\D/g, "").slice(0, 10); setTelefono(v); }}
              disabled={loading} sx={inputSx} slotProps={{ input: { disableUnderline: true } }} />
            <TextField label="Descripción / Motivo" variant="filled" fullWidth multiline minRows={2}
              value={descripcion} onChange={(e) => setDescripcion(e.target.value)} disabled={loading}
              sx={inputSx} slotProps={{ input: { disableUnderline: true } }} />
            <TextField label="Fecha y hora de inicio" type="datetime-local" variant="filled" fullWidth
              value={fechaInicio} onChange={(e) => setFechaInicio(e.target.value)} disabled={loading}
              sx={inputSx} slotProps={{ input: { disableUnderline: true }, inputLabel: { shrink: true } }} />
            <TextField label="Fecha y hora de fin" type="datetime-local" variant="filled" fullWidth
              value={fechaFin} onChange={(e) => setFechaFin(e.target.value)} disabled={loading}
              sx={inputSx} slotProps={{ input: { disableUnderline: true }, inputLabel: { shrink: true } }} />
          </div>

          {validationError && (
            <p className="text-xs -mt-1" style={{ color: "#c2185b", fontFamily: "'DM Sans', system-ui, sans-serif" }}>
              {validationError}
            </p>
          )}

          <button type="submit" disabled={loading}
            className="w-full py-[13px] font-medium tracking-wide rounded-full transition-all duration-200 hover:opacity-90 active:scale-[0.98] disabled:opacity-55"
            style={{ backgroundColor: "#107b42", color: "#ffffff", fontSize: "0.88rem",
              letterSpacing: "0.04em", border: "none", cursor: loading ? "not-allowed" : "pointer",
              fontFamily: "'DM Sans', system-ui, sans-serif" }}
          >
            {loading ? "Enviando..." : "Enviar solicitud"}
          </button>
        </form>
      </div>
    </ReusableModal>
  );
}