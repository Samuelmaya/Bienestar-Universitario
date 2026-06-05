import { useState, useEffect, useCallback } from "react";
import {
  Trash2,
  Building2,
  ClipboardList,
  AlertCircle,
  Plus,
  Loader2,
  Calendar,
  Clock,
  Check,
  X
} from "lucide-react";
import { ReusableModal } from "@/shared/reusable-modal/reusable-modal";
import {
  listarEspaciosDeportivos,
  crearEspacioDeportivo,
  actualizarEspacioDeportivo,
  eliminarEspacioDeportivo,
  listarSolicitudesEspacios,
  actualizarSolicitudEspacio,
} from "@/services/espacio.service";
import type {
  EspacioDeportivo,
  EspacioDeportivoCreateRequest,
  SolicitudEspacio,
} from "@/shared/dtos/espacio.dto";

// ─── constantes ────────────────────────────────────────────────────────────

type Tab = "espacios" | "solicitudes";

const ESTADO_ESPACIO_OPTS = ["DISPONIBLE", "MANTENIMIENTO", "INHABILITADO"];
const ESTADO_SOLICITUD_OPTS = ["PENDIENTE", "APROBADA", "RECHAZADA"];

const badgeEspacio: Record<string, string> = {
  DISPONIBLE: "bg-emerald-50 text-emerald-700 border border-emerald-200/50",
  MANTENIMIENTO: "bg-amber-50 text-amber-700 border border-amber-200/50",
  INHABILITADO: "bg-red-50 text-red-700 border border-red-200/50",
};

const badgeSolicitud: Record<string, string> = {
  PENDIENTE: "bg-yellow-50 text-yellow-700 border border-yellow-200/50",
  APROBADA: "bg-emerald-50 text-emerald-700 border border-emerald-200/50",
  RECHAZADA: "bg-red-50 text-red-700 border border-red-200/50",
};

function formatDate(dateStr: string) {
  if (!dateStr) return "—";
  const [y, m, d] = dateStr.split("-");
  return `${d}/${m}/${y}`;
}

function formatTime(timeStr: string) {
  if (!timeStr) return "—";
  return timeStr.substring(0, 5);
}

// ─── Modal Crear / Editar Espacio ──────────────────────────────────────────

type ModalEspacioProps = {
  espacio: EspacioDeportivo | null; // null = crear
  triggerElement: HTMLElement | null;
  onClose: () => void;
  onSaved: () => void;
};

function ModalEspacio({ espacio, triggerElement, onClose, onSaved }: ModalEspacioProps) {
  const [nombre, setNombre] = useState(espacio?.nombre ?? "");
  const [estado, setEstado] = useState(espacio?.estado ?? "DISPONIBLE");
  const [observaciones, setObservaciones] = useState(espacio?.observaciones ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const payload: EspacioDeportivoCreateRequest = {
      nombre: nombre.trim(),
      estado: estado || null,
      observaciones: observaciones.trim() || null,
    };
    try {
      if (espacio) {
        await actualizarEspacioDeportivo(espacio.id_espacio, payload);
      } else {
        await crearEspacioDeportivo(payload);
      }
      onSaved();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al guardar el espacio.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <ReusableModal triggerElement={triggerElement} onClose={onClose} maxWidth="480px">
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-foreground">
            {espacio ? "Editar Escenario" : "Nuevo Escenario Deportivo"}
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            {espacio ? "Modifica los datos del escenario seleccionado." : "Registra un nuevo escenario deportivo en el sistema."}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-primary uppercase tracking-wide mb-2">
              Nombre del escenario <span className="text-red-500">*</span>
            </label>
            <input
              required
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ej: Cancha de Microfútbol"
              className="w-full px-3 py-2 border-2 border-secondary/30 rounded-lg bg-muted text-foreground focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20 outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-primary uppercase tracking-wide mb-2">
              Estado
            </label>
            <select
              value={estado ?? "DISPONIBLE"}
              onChange={(e) => setEstado(e.target.value)}
              className="w-full px-3 py-2 border-2 border-secondary/30 rounded-lg bg-muted text-foreground focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20 outline-none transition-all"
            >
              {ESTADO_ESPACIO_OPTS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-primary uppercase tracking-wide mb-2">
              Observaciones
            </label>
            <textarea
              value={observaciones}
              onChange={(e) => setObservaciones(e.target.value)}
              rows={3}
              placeholder="Detalles sobre el equipamiento, capacidad o restricciones..."
              className="w-full px-3 py-2 border-2 border-secondary/30 rounded-lg bg-muted text-foreground focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
            />
          </div>

          {error && (
            <div className="bg-destructive/10 border border-destructive/20 text-destructive rounded-lg px-4 py-3 text-xs flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="flex gap-3 pt-3 border-t border-secondary/10">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 text-sm font-semibold text-primary border-2 border-secondary/30 rounded-lg hover:bg-secondary/5 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 px-4 py-2.5 text-sm font-semibold text-primary-foreground bg-primary rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-colors"
            >
              {saving ? "Guardando..." : espacio ? "Actualizar" : "Crear"}
            </button>
          </div>
        </form>
      </div>
    </ReusableModal>
  );
}

// ─── Modal Confirmar Eliminar ──────────────────────────────────────────────

type ModalEliminarProps = {
  espacio: EspacioDeportivo;
  triggerElement: HTMLElement | null;
  onClose: () => void;
  onDeleted: () => void;
};

function ModalEliminar({ espacio, triggerElement, onClose, onDeleted }: ModalEliminarProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDelete() {
    setLoading(true);
    setError(null);
    try {
      await eliminarEspacioDeportivo(espacio.id_espacio);
      onDeleted();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al eliminar el espacio.");
      setLoading(false);
    }
  }

  return (
    <ReusableModal triggerElement={triggerElement} onClose={onClose} maxWidth="400px">
      <div className="flex flex-col items-center text-center space-y-4">
        <div className="h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center text-destructive">
          <Trash2 className="h-6 w-6" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-foreground">Eliminar Escenario</h2>
          <p className="text-sm text-muted-foreground mt-2">
            ¿Estás seguro de que deseas eliminar{" "}
            <span className="font-semibold text-foreground">{espacio.nombre}</span>? Esta acción no
            se puede deshacer.
          </p>
        </div>

        {error && (
          <div className="w-full bg-destructive/10 border border-destructive/20 text-destructive rounded-lg px-4 py-3 text-xs flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="flex gap-3 w-full pt-3 border-t border-secondary/10">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 text-sm font-semibold text-primary border-2 border-secondary/30 rounded-lg hover:bg-secondary/5 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleDelete}
            disabled={loading}
            className="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-destructive hover:bg-destructive/90 disabled:opacity-50 transition-colors"
          >
            {loading ? "Eliminando..." : "Eliminar"}
          </button>
        </div>
      </div>
    </ReusableModal>
  );
}

// ─── EspaciosGeneral (componente principal) ────────────────────────────────

export function EspaciosGeneral() {
  const [tab, setTab] = useState<Tab>("espacios");

  // espacios
  const [espacios, setEspacios] = useState<EspacioDeportivo[]>([]);
  const [loadingEspacios, setLoadingEspacios] = useState(true);
  const [errorEspacios, setErrorEspacios] = useState<string | null>(null);

  // solicitudes
  const [solicitudes, setSolicitudes] = useState<SolicitudEspacio[]>([]);
  const [loadingSolicitudes, setLoadingSolicitudes] = useState(false);
  const [errorSolicitudes, setErrorSolicitudes] = useState<string | null>(null);

  // modales
  const [modalCrear, setModalCrear] = useState(false);
  const [modalEditar, setModalEditar] = useState<EspacioDeportivo | null>(null);
  const [modalEliminar, setModalEliminar] = useState<EspacioDeportivo | null>(null);
  const [modalTriggerEl, setModalTriggerEl] = useState<HTMLElement | null>(null);

  // filtro solicitudes
  const [filtroEstado, setFiltroEstado] = useState("TODOS");
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const fetchEspacios = useCallback(() => {
    setLoadingEspacios(true);
    setErrorEspacios(null);
    listarEspaciosDeportivos()
      .then(setEspacios)
      .catch(() => setErrorEspacios("No se pudieron cargar los espacios."))
      .finally(() => setLoadingEspacios(false));
  }, []);

  const fetchSolicitudes = useCallback(() => {
    setLoadingSolicitudes(true);
    setErrorSolicitudes(null);
    listarSolicitudesEspacios()
      .then(setSolicitudes)
      .catch(() => setErrorSolicitudes("No se pudieron cargar las solicitudes."))
      .finally(() => setLoadingSolicitudes(false));
  }, []);

  useEffect(() => { fetchEspacios(); }, [fetchEspacios]);
  useEffect(() => { if (tab === "solicitudes") fetchSolicitudes(); }, [tab, fetchSolicitudes]);

  async function handleEstadoSolicitud(solicitud: SolicitudEspacio, nuevoEstado: string) {
    setUpdatingId(solicitud.id_solicitud);
    try {
      await actualizarSolicitudEspacio(solicitud.id_solicitud, { estado: nuevoEstado });
      setSolicitudes((prev) =>
        prev.map((s) =>
          s.id_solicitud === solicitud.id_solicitud ? { ...s, estado: nuevoEstado } : s,
        ),
      );
    } catch {
      // se puede mejorar con un toast
    } finally {
      setUpdatingId(null);
    }
  }

  const solicitudesFiltradas =
    filtroEstado === "TODOS"
      ? solicitudes
      : solicitudes.filter((s) => s.estado.toUpperCase() === filtroEstado);

  const nombreEspacio = (id: number) =>
    espacios.find((e) => e.id_espacio === id)?.nombre ?? `#${id}`;

  // ── render ─────────────────────────────────────────────────────────────

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground font-display">Escenarios Deportivos</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Administra los espacios y revisa las solicitudes de reserva.
          </p>
        </div>
        {tab === "espacios" && (
          <button
            onClick={(e) => {
              setModalTriggerEl(e.currentTarget);
              setModalCrear(true);
            }}
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-4 py-2.5 rounded-xl text-sm transition active:scale-95 flex items-center gap-2 w-fit shadow-[var(--shadow-soft)] hover:shadow-md"
          >
            <Plus className="h-4 w-4" /> Nuevo escenario
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-accent/40 border border-border rounded-xl p-1 w-fit">
        {(["espacios", "solicitudes"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-5 py-2 rounded-lg text-sm font-semibold transition ${
              tab === t
                ? "bg-card text-primary shadow-sm font-bold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {t === "espacios" ? "Escenarios" : "Solicitudes"}
          </button>
        ))}
      </div>

      {/* ─── TAB ESPACIOS ─────────────────────────────────── */}
      {tab === "espacios" && (
        <>
          {loadingEspacios && (
            <div className="flex justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          )}

          {errorEspacios && (
            <div className="bg-destructive/10 border border-destructive/20 text-destructive rounded-xl p-4 text-center text-sm flex items-center justify-center gap-2">
              <AlertCircle className="h-5 w-5" />
              <span>{errorEspacios}</span>
            </div>
          )}

          {!loadingEspacios && !errorEspacios && espacios.length === 0 && (
            <div className="text-center py-20 text-muted-foreground flex flex-col items-center justify-center">
              <Building2 className="h-12 w-12 text-muted-foreground/60 mb-3" />
              <p className="font-semibold text-lg text-foreground">No hay escenarios registrados</p>
              <p className="text-sm mt-1">Crea el primer escenario deportivo con el botón de arriba.</p>
            </div>
          )}

          {!loadingEspacios && espacios.length > 0 && (
            <div className="rounded-2xl border border-border bg-card shadow-[var(--shadow-soft)] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/40 text-left">
                      {["ID", "Nombre", "Estado", "Observaciones", "Acciones"].map((h) => (
                        <th
                          key={h}
                          className={`px-5 py-3.5 font-semibold text-muted-foreground text-xs uppercase tracking-wide ${
                            h === "Acciones" ? "text-right" : ""
                          }`}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {espacios.map((esp) => (
                      <tr
                        key={esp.id_espacio}
                        className="border-b border-border hover:bg-accent/40 transition"
                      >
                        <td className="px-5 py-4 text-muted-foreground font-mono text-xs">
                          #{esp.id_espacio}
                        </td>
                        <td className="px-5 py-4 font-semibold text-foreground">
                          {esp.nombre}
                        </td>
                        <td className="px-5 py-4">
                          <span
                            className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                              badgeEspacio[(esp.estado ?? "DISPONIBLE").toUpperCase()] ??
                              badgeEspacio["DISPONIBLE"]
                            }`}
                          >
                            {(esp.estado ?? "DISPONIBLE").toUpperCase()}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-muted-foreground max-w-xs truncate">
                          {esp.observaciones ?? "—"}
                        </td>
                        <td className="px-5 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={(e) => {
                                setModalTriggerEl(e.currentTarget);
                                setModalEditar(esp);
                              }}
                              className="border border-secondary/35 hover:bg-secondary/5 text-primary font-semibold px-3 py-1.5 rounded-lg text-xs transition"
                            >
                              Editar
                            </button>
                            <button
                              onClick={(e) => {
                                setModalTriggerEl(e.currentTarget);
                                setModalEliminar(esp);
                              }}
                              className="border border-red-200 hover:bg-red-50 text-red-600 font-semibold px-3 py-1.5 rounded-lg text-xs transition"
                            >
                              Eliminar
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}

      {/* ─── TAB SOLICITUDES ──────────────────────────────── */}
      {tab === "solicitudes" && (
        <>
          {/* Filtros */}
          <div className="flex gap-2 flex-wrap">
            {["TODOS", ...ESTADO_SOLICITUD_OPTS].map((e) => (
              <button
                key={e}
                onClick={() => setFiltroEstado(e)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition ${
                  filtroEstado === e
                    ? "bg-primary border-primary text-primary-foreground shadow-sm"
                    : "border-border text-muted-foreground hover:border-primary hover:text-primary bg-card"
                }`}
              >
                {e}
              </button>
            ))}
          </div>

          {loadingSolicitudes && (
            <div className="flex justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          )}

          {errorSolicitudes && (
            <div className="bg-destructive/10 border border-destructive/20 text-destructive rounded-xl p-4 text-center text-sm flex items-center justify-center gap-2">
              <AlertCircle className="h-5 w-5" />
              <span>{errorSolicitudes}</span>
            </div>
          )}

          {!loadingSolicitudes && !errorSolicitudes && solicitudesFiltradas.length === 0 && (
            <div className="text-center py-20 text-muted-foreground flex flex-col items-center justify-center">
              <ClipboardList className="h-12 w-12 text-muted-foreground/60 mb-3" />
              <p className="font-semibold text-lg text-foreground">No hay solicitudes de reserva</p>
              <p className="text-sm mt-1">No se encontraron solicitudes con el filtro seleccionado.</p>
            </div>
          )}

          {!loadingSolicitudes && solicitudesFiltradas.length > 0 && (
            <div className="rounded-2xl border border-border bg-card shadow-[var(--shadow-soft)] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/40 text-left">
                      {["ID", "Solicitante", "Espacio", "Fecha", "Horario", "Estado"].map((h) => (
                        <th
                          key={h}
                          className="px-5 py-3.5 font-semibold text-muted-foreground text-xs uppercase tracking-wide"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {solicitudesFiltradas.map((sol) => (
                      <tr
                        key={sol.id_solicitud}
                        className="border-b border-border hover:bg-accent/40 transition"
                      >
                        <td className="px-5 py-4 text-muted-foreground font-mono text-xs">
                          #{sol.id_solicitud}
                        </td>
                        <td className="px-5 py-4">
                          <p className="font-semibold text-foreground">{sol.solicitante}</p>
                          <p className="text-muted-foreground text-xs">{sol.entidad}</p>
                        </td>
                        <td className="px-5 py-4 text-foreground font-medium">
                          {nombreEspacio(sol.id_espacio)}
                        </td>
                        <td className="px-5 py-4 text-muted-foreground">
                          <span className="inline-flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5 text-muted-foreground/75" />
                            {formatDate(sol.fecha)}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-muted-foreground whitespace-nowrap">
                          <span className="inline-flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5 text-muted-foreground/75" />
                            {formatTime(sol.hora_inicio)} – {formatTime(sol.hora_fin)}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <select
                            value={sol.estado.toUpperCase()}
                            disabled={updatingId === sol.id_solicitud}
                            onChange={(e) => handleEstadoSolicitud(sol, e.target.value)}
                            className={`text-xs font-semibold px-2.5 py-1.5 rounded-lg border-2 border-transparent outline-none cursor-pointer transition focus:ring-2 focus:ring-primary/20 ${
                              badgeSolicitud[sol.estado.toUpperCase()] ??
                              "bg-accent text-foreground"
                            } ${updatingId === sol.id_solicitud ? "opacity-60" : ""}`}
                          >
                            {ESTADO_SOLICITUD_OPTS.map((e) => (
                              <option key={e} value={e}>{e}</option>
                            ))}
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}

      {/* Modales */}
      {modalCrear && (
        <ModalEspacio
          espacio={null}
          triggerElement={modalTriggerEl}
          onClose={() => { setModalCrear(false); setModalTriggerEl(null); }}
          onSaved={() => { setModalCrear(false); setModalTriggerEl(null); fetchEspacios(); }}
        />
      )}
      {modalEditar && (
        <ModalEspacio
          espacio={modalEditar}
          triggerElement={modalTriggerEl}
          onClose={() => { setModalEditar(null); setModalTriggerEl(null); }}
          onSaved={() => { setModalEditar(null); setModalTriggerEl(null); fetchEspacios(); }}
        />
      )}
      {modalEliminar && (
        <ModalEliminar
          espacio={modalEliminar}
          triggerElement={modalTriggerEl}
          onClose={() => { setModalEliminar(null); setModalTriggerEl(null); }}
          onDeleted={() => { setModalEliminar(null); setModalTriggerEl(null); fetchEspacios(); }}
        />
      )}
    </div>
  );
}
