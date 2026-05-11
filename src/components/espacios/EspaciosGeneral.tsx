import { useState, useEffect, useCallback } from "react";
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
  DISPONIBLE: "bg-emerald-100 text-emerald-700",
  MANTENIMIENTO: "bg-amber-100 text-amber-700",
  INHABILITADO: "bg-red-100 text-red-700",
};

const badgeSolicitud: Record<string, string> = {
  PENDIENTE: "bg-yellow-100 text-yellow-700",
  APROBADA: "bg-emerald-100 text-emerald-700",
  RECHAZADA: "bg-red-100 text-red-700",
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
  onClose: () => void;
  onSaved: () => void;
};

function ModalEspacio({ espacio, onClose, onSaved }: ModalEspacioProps) {
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-card rounded-2xl shadow-[var(--shadow-elegant)] border border-border w-full max-w-md">
        <div className="bg-[image:var(--gradient-hero)] px-6 py-5 rounded-t-2xl flex items-center justify-between">
          <h2 className="text-primary-foreground font-bold text-lg">
            {espacio ? "Editar espacio" : "Nuevo espacio deportivo"}
          </h2>
          <button
            onClick={onClose}
            className="text-primary-foreground/80 hover:text-primary-foreground text-2xl leading-none transition"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wide">
              Nombre del espacio *
            </label>
            <input
              required
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ej: Cancha Fútbol Vallenata"
              className="w-full border border-border rounded-lg px-3 py-2.5 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wide">
              Estado
            </label>
            <select
              value={estado ?? "DISPONIBLE"}
              onChange={(e) => setEstado(e.target.value)}
              className="w-full border border-border rounded-lg px-3 py-2.5 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary transition"
            >
              {ESTADO_ESPACIO_OPTS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wide">
              Observaciones
            </label>
            <textarea
              value={observaciones}
              onChange={(e) => setObservaciones(e.target.value)}
              rows={3}
              placeholder="Descripción, capacidad, restricciones..."
              className="w-full border border-border rounded-lg px-3 py-2.5 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary transition resize-none"
            />
          </div>

          {error && (
            <div className="bg-destructive/10 border border-destructive/30 text-destructive rounded-lg px-4 py-3 text-sm">
              {error}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-border hover:bg-accent text-foreground font-semibold py-2.5 rounded-xl text-sm transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-primary hover:bg-primary/90 disabled:opacity-60 text-primary-foreground font-semibold py-2.5 rounded-xl text-sm transition"
            >
              {saving ? "Guardando..." : espacio ? "Actualizar" : "Crear"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Modal Confirmar Eliminar ──────────────────────────────────────────────

type ModalEliminarProps = {
  espacio: EspacioDeportivo;
  onClose: () => void;
  onDeleted: () => void;
};

function ModalEliminar({ espacio, onClose, onDeleted }: ModalEliminarProps) {
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-card rounded-2xl shadow-[var(--shadow-elegant)] border border-border w-full max-w-sm p-6 text-center">
        <div className="text-4xl mb-3">🗑️</div>
        <h2 className="text-foreground font-bold text-lg mb-2">Eliminar espacio</h2>
        <p className="text-muted-foreground text-sm mb-6">
          ¿Estás seguro de que deseas eliminar{" "}
          <span className="font-semibold text-foreground">{espacio.nombre}</span>? Esta acción no
          se puede deshacer.
        </p>

        {error && (
          <div className="bg-destructive/10 border border-destructive/30 text-destructive rounded-lg px-4 py-3 text-sm mb-4">
            {error}
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 border border-border hover:bg-accent text-foreground font-semibold py-2.5 rounded-xl text-sm transition"
          >
            Cancelar
          </button>
          <button
            onClick={handleDelete}
            disabled={loading}
            className="flex-1 bg-destructive hover:bg-destructive/90 disabled:opacity-60 text-white font-semibold py-2.5 rounded-xl text-sm transition"
          >
            {loading ? "Eliminando..." : "Sí, eliminar"}
          </button>
        </div>
      </div>
    </div>
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
          <h1 className="text-2xl font-bold text-foreground">Escenarios Deportivos</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Administra los espacios y revisa las solicitudes de reserva.
          </p>
        </div>
        {tab === "espacios" && (
          <button
            onClick={() => setModalCrear(true)}
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-4 py-2.5 rounded-xl text-sm transition active:scale-95 flex items-center gap-2 w-fit"
          >
            <span className="text-lg leading-none">+</span> Nuevo espacio
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-accent rounded-xl p-1 w-fit">
        {(["espacios", "solicitudes"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-5 py-2 rounded-lg text-sm font-semibold transition ${
              tab === t
                ? "bg-card text-primary shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {t === "espacios" ? "🏟️ Espacios" : "📋 Solicitudes"}
          </button>
        ))}
      </div>

      {/* ─── TAB ESPACIOS ─────────────────────────────────── */}
      {tab === "espacios" && (
        <>
          {loadingEspacios && (
            <div className="flex justify-center py-20">
              <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          {errorEspacios && (
            <div className="bg-destructive/10 border border-destructive/30 text-destructive rounded-xl p-4 text-center text-sm">
              {errorEspacios}
            </div>
          )}

          {!loadingEspacios && !errorEspacios && espacios.length === 0 && (
            <div className="text-center py-20 text-muted-foreground">
              <p className="text-4xl mb-3">🏟️</p>
              <p className="font-semibold">No hay espacios registrados.</p>
              <p className="text-sm mt-1">Crea el primero con el botón de arriba.</p>
            </div>
          )}

          {!loadingEspacios && espacios.length > 0 && (
            <div className="rounded-2xl border border-border bg-card shadow-[var(--shadow-soft)] overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left">
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
                            onClick={() => setModalEditar(esp)}
                            className="border border-border hover:bg-accent text-foreground font-semibold px-3 py-1.5 rounded-lg text-xs transition"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => setModalEliminar(esp)}
                            className="border border-destructive/30 hover:bg-destructive/10 text-destructive font-semibold px-3 py-1.5 rounded-lg text-xs transition"
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
                    ? "bg-primary border-primary text-primary-foreground"
                    : "border-border text-muted-foreground hover:border-primary hover:text-primary"
                }`}
              >
                {e}
              </button>
            ))}
          </div>

          {loadingSolicitudes && (
            <div className="flex justify-center py-20">
              <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          {errorSolicitudes && (
            <div className="bg-destructive/10 border border-destructive/30 text-destructive rounded-xl p-4 text-center text-sm">
              {errorSolicitudes}
            </div>
          )}

          {!loadingSolicitudes && !errorSolicitudes && solicitudesFiltradas.length === 0 && (
            <div className="text-center py-20 text-muted-foreground">
              <p className="text-4xl mb-3">📋</p>
              <p className="font-semibold">No hay solicitudes.</p>
            </div>
          )}

          {!loadingSolicitudes && solicitudesFiltradas.length > 0 && (
            <div className="rounded-2xl border border-border bg-card shadow-[var(--shadow-soft)] overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left">
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
                        {formatDate(sol.fecha)}
                      </td>
                      <td className="px-5 py-4 text-muted-foreground whitespace-nowrap">
                        {formatTime(sol.hora_inicio)} – {formatTime(sol.hora_fin)}
                      </td>
                      <td className="px-5 py-4">
                        <select
                          value={sol.estado.toUpperCase()}
                          disabled={updatingId === sol.id_solicitud}
                          onChange={(e) => handleEstadoSolicitud(sol, e.target.value)}
                          className={`text-xs font-semibold px-2.5 py-1.5 rounded-lg border-0 outline-none cursor-pointer transition ${
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
          )}
        </>
      )}

      {/* Modales */}
      {modalCrear && (
        <ModalEspacio
          espacio={null}
          onClose={() => setModalCrear(false)}
          onSaved={() => { setModalCrear(false); fetchEspacios(); }}
        />
      )}
      {modalEditar && (
        <ModalEspacio
          espacio={modalEditar}
          onClose={() => setModalEditar(null)}
          onSaved={() => { setModalEditar(null); fetchEspacios(); }}
        />
      )}
      {modalEliminar && (
        <ModalEliminar
          espacio={modalEliminar}
          onClose={() => setModalEliminar(null)}
          onDeleted={() => { setModalEliminar(null); fetchEspacios(); }}
        />
      )}
    </div>
  );
}
