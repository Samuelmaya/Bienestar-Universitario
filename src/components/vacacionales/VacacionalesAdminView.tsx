import { useEffect, useState } from "react";
import {
  Loader2,
  AlertCircle,
  CheckCircle2,
  Trash2,
  ExternalLink,
  CalendarRange,
  Search,
  User,
  Phone,
  FileText,
  Trophy,
} from "lucide-react";
import {
  listarVacacionales,
  eliminarVacacional,
  obtenerConfigVacacional,
  toggleConfigVacacional,
} from "@/services/vacacional.service";
import type { VacacionalInscripcion } from "@/shared/dtos/vacacional.dto";
// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatFecha(iso: string) {
  return new Date(iso).toLocaleDateString("es-CO", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}



// ─── Componente ───────────────────────────────────────────────────────────────

export function VacacionalesAdminView() {
  const [inscripciones, setInscripciones] = useState<VacacionalInscripcion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [search, setSearch] = useState("");

  // ── Toggle formulario vacacional ──
  const [vacacionalActivo, setVacacionalActivo] = useState<boolean | null>(null);
  const [toggleLoading, setToggleLoading] = useState(false);

  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);

  const loadData = () => {
    setLoading(true);
    setError("");
    listarVacacionales()
      .then((data) => setInscripciones(data))
      .catch((err) =>
        setError(
          err instanceof Error
            ? err.message
            : "Error cargando inscripciones vacacionales",
        ),
      )
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
    // Cargar estado del toggle
    obtenerConfigVacacional()
      .then((c) => setVacacionalActivo(c.activo))
      .catch(() => setVacacionalActivo(false));
  }, []);

  const handleToggle = async () => {
    if (toggleLoading) return;
    setToggleLoading(true);
    try {
      const updated = await toggleConfigVacacional();
      setVacacionalActivo(updated.activo);
      setSuccessMsg(
        updated.activo
          ? "Formulario vacacional activado."
          : "Formulario vacacional desactivado.",
      );
      setTimeout(() => setSuccessMsg(""), 4000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cambiar el estado.");
    } finally {
      setToggleLoading(false);
    }
  };

  const filtered = inscripciones.filter((i) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      i.nombre_completo.toLowerCase().includes(q) ||
      i.numero_documento.includes(q) ||
      i.telefono.includes(q) ||
      i.informacion_referencia.toLowerCase().includes(q)
    );
  });

  const handleDelete = async (id: number) => {
    setDeleting(true);
    try {
      await eliminarVacacional(id);
      setInscripciones((prev) => prev.filter((i) => i.id_vacacional !== id));
      setSuccessMsg("Inscripción eliminada correctamente.");
      setTimeout(() => setSuccessMsg(""), 4000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al eliminar.");
    } finally {
      setDeleting(false);
      setDeleteId(null);
    }
  };



  return (
    <div className="container mx-auto px-4 py-8">
      {/* Encabezado */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <CalendarRange className="h-6 w-6 text-primary" />
            Inscripciones vacacionales
          </h1>
          <p className="text-sm text-muted-foreground">
            Listado de inscripciones recibidas al programa vacacional.
          </p>
        </div>
        <div className="flex items-center gap-3 flex-wrap sm:flex-nowrap">
          {/* Toggle activar/desactivar formulario */}
          <div className="flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1.5">
            <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">
              Formulario activo
            </span>
            <button
              type="button"
              role="switch"
              aria-checked={vacacionalActivo ?? false}
              disabled={toggleLoading || vacacionalActivo === null}
              onClick={handleToggle}
              className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:opacity-60 disabled:cursor-not-allowed ${
                vacacionalActivo ? "bg-primary" : "bg-muted-foreground/30"
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform ${
                  vacacionalActivo ? "translate-x-4" : "translate-x-0"
                }`}
              />
            </button>
            {toggleLoading && (
              <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
            )}
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1.5 text-sm font-semibold text-primary whitespace-nowrap">
            {inscripciones.length} registros
          </span>
        </div>
      </div>

      {/* Buscador */}
      <div className="mb-6">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nombre, documento, teléfono..."
            className="w-full rounded-full border border-border bg-background px-4 py-2 pl-9 text-xs"
          />
        </div>
      </div>

      {/* Mensajes */}
      {successMsg && (
        <div className="mb-6 flex items-center gap-2 p-4 rounded-xl bg-green-500/10 text-green-600">
          <CheckCircle2 className="h-5 w-5 shrink-0" />
          <p className="font-medium">{successMsg}</p>
        </div>
      )}
      {error && (
        <div className="mb-6 flex items-center gap-2 p-4 rounded-xl bg-destructive/10 text-destructive">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {/* Cargando */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}

      {/* Vacío */}
      {!loading && !error && filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <CalendarRange className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-lg font-semibold">No hay inscripciones</p>
          <p className="text-sm text-muted-foreground">
            {search
              ? "No se encontraron resultados para tu búsqueda."
              : "Aún no hay inscripciones vacacionales registradas."}
          </p>
        </div>
      )}

      {/* Tabla */}
      {!loading && !error && filtered.length > 0 && (
        <div className="rounded-2xl border border-border overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted text-muted-foreground text-xs uppercase tracking-wide">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold">#</th>
                  <th className="px-4 py-3 text-left font-semibold">
                    <span className="flex items-center gap-1.5">
                      <User className="h-3.5 w-3.5" /> Inscrito
                    </span>
                  </th>
                  <th className="px-4 py-3 text-left font-semibold hidden sm:table-cell">
                    <span className="flex items-center gap-1.5">
                      <FileText className="h-3.5 w-3.5" /> Documento
                    </span>
                  </th>
                  <th className="px-4 py-3 text-left font-semibold hidden md:table-cell">
                    <span className="flex items-center gap-1.5">
                      <Phone className="h-3.5 w-3.5" /> Teléfono
                    </span>
                  </th>
                  <th className="px-4 py-3 text-left font-semibold hidden lg:table-cell">
                    <span className="flex items-center gap-1.5">
                      <Trophy className="h-3.5 w-3.5" /> Disciplina
                    </span>
                  </th>
                  <th className="px-4 py-3 text-left font-semibold hidden lg:table-cell">
                    Referencia
                  </th>
                  <th className="px-4 py-3 text-left font-semibold hidden xl:table-cell">
                    Fecha
                  </th>
                  <th className="px-4 py-3 text-left font-semibold">Comprobante</th>
                  <th className="px-4 py-3 text-right font-semibold">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border bg-card">
                {filtered.map((inscripcion) => (
                  <tr
                    key={inscripcion.id_vacacional}
                    className="hover:bg-accent/40 transition-colors"
                  >
                    <td className="px-4 py-3 text-muted-foreground text-xs">
                      #{inscripcion.id_vacacional}
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium leading-tight">
                          {inscripcion.nombre_completo}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {inscripcion.edad} años
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell text-muted-foreground text-xs font-mono">
                      {inscripcion.numero_documento}
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell text-xs">
                      {inscripcion.telefono}
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell text-xs">
                      <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-primary font-medium">
                        {inscripcion.deporte.nom_deporte}
                      </span>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell text-xs text-muted-foreground">
                      {inscripcion.informacion_referencia}
                    </td>
                    <td className="px-4 py-3 hidden xl:table-cell text-xs text-muted-foreground">
                      {formatFecha(inscripcion.created_at)}
                    </td>
                    <td className="px-4 py-3">
                      {inscripcion.comprobante_url ? (
                        <a
                          href={inscripcion.comprobante_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                        >
                          Ver <ExternalLink className="h-3 w-3" />
                        </a>
                      ) : (
                        <span className="text-xs text-muted-foreground italic">
                          No aplica
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {deleteId === inscripcion.id_vacacional ? (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleDelete(inscripcion.id_vacacional)}
                            disabled={deleting}
                            className="text-xs font-semibold text-destructive hover:underline disabled:opacity-60"
                          >
                            {deleting ? (
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : (
                              "Confirmar"
                            )}
                          </button>
                          <button
                            onClick={() => setDeleteId(null)}
                            className="text-xs text-muted-foreground hover:underline"
                          >
                            Cancelar
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setDeleteId(inscripcion.id_vacacional)}
                          className="inline-flex items-center gap-1 rounded-lg border border-destructive/30 px-2.5 py-1 text-xs font-medium text-destructive hover:bg-destructive/10 transition-colors"
                        >
                          <Trash2 className="h-3.5 w-3.5" /> Eliminar
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
