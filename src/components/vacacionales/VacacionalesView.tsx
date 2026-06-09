import { useEffect, useRef, useState } from "react";
import { CheckCircle2, AlertCircle, Loader2, Upload, X, CalendarRange, Trophy } from "lucide-react";
import {
  obtenerConfigVacacional,
  crearInscripcionVacacional,
  obtenerCuposVacacional,
} from "@/services/vacacional.service";
import { listarDeportes } from "@/shared/services/deportes.service";
import type { Deporte } from "@/shared/dtos/deporte.dto";
import {
  INFORMACION_REFERENCIA_OPTIONS,
  REFERENCIA_SIN_COMPROBANTE,
  type InformacionReferencia,
  type VacacionalCreatePayload,
} from "@/shared/dtos/vacacional.dto";

// ─── Validaciones ─────────────────────────────────────────────────────────────

function validarTelefono(tel: string) {
  return /^\d{10}$/.test(tel);
}

function validarEdad(edad: number) {
  return Number.isInteger(edad) && edad >= 1 && edad <= 14;
}

// ─── Estado inicial ───────────────────────────────────────────────────────────

const ESTADO_INICIAL: Omit<VacacionalCreatePayload, "comprobante"> = {
  nombre_completo: "",
  edad: 0,
  numero_documento: "",
  telefono: "",
  informacion_referencia: "Estudiante" as InformacionReferencia,
  disciplina_deportiva_id: 0,
};

// ─── Componente principal ─────────────────────────────────────────────────────

interface VacacionalesViewProps {
  onVolver?: () => void;
}

export function VacacionalesView({ onVolver }: VacacionalesViewProps) {
  const [cupos, setCupos] = useState<Record<number, number>>({});
  useEffect(() => {
    obtenerConfigVacacional()
      .then((c) => setFormularioActivo(c.activo))
      .catch(() => setFormularioActivo(false))
      .finally(() => setConfigLoading(false));

    listarDeportes()
      .then((data) => {
        setDeportes(data);
        if (data.length > 0) {
          setForm((prev) => ({ ...prev, disciplina_deportiva_id: data[0].cod_deporte }));
        }
      })
      .catch(() => {})
      .finally(() => setDeportesLoading(false));

    obtenerCuposVacacional()
      .then(setCupos)
      .catch(() => {}); // silencioso: si falla, no bloqueamos el formulario
  }, []);
  // Estado de config}
  const [configLoading, setConfigLoading] = useState(true);
  const [formularioActivo, setFormularioActivo] = useState<boolean | null>(null);

  // Estado del formulario
  const [form, setForm] = useState(ESTADO_INICIAL);
  const [comprobante, setComprobante] = useState<File | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  // Disciplinas
  const [deportes, setDeportes] = useState<Deporte[]>([]);
  const [deportesLoading, setDeportesLoading] = useState(true);

  // Envío
  const [sending, setSending] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState("");

  // ── Cargar config y disciplinas al montar ──
  useEffect(() => {
    obtenerConfigVacacional()
      .then((c) => setFormularioActivo(c.activo))
      .catch(() => setFormularioActivo(false))
      .finally(() => setConfigLoading(false));

    listarDeportes()
      .then((data) => {
        setDeportes(data);
        if (data.length > 0) {
          setForm((prev) => ({ ...prev, disciplina_deportiva_id: data[0].cod_deporte }));
        }
      })
      .catch(() => {})
      .finally(() => setDeportesLoading(false));
  }, []);

  // ── Comprobante necesario ──
  const necesitaComprobante = form.informacion_referencia !== REFERENCIA_SIN_COMPROBANTE;

  // ── Validación cliente ──
  const validar = (): boolean => {
    const e: Record<string, string> = {};

    if (!form.nombre_completo.trim()) e.nombre_completo = "El nombre completo es requerido.";
    if (!validarEdad(form.edad)) e.edad = "La edad debe ser un número entre 1 y 14.";
    if (!form.numero_documento.trim()) e.numero_documento = "El número de documento es requerido.";
    if (!validarTelefono(form.telefono))
      e.telefono = "El teléfono debe tener exactamente 10 dígitos.";
    if (!form.disciplina_deportiva_id) {
      e.disciplina_deportiva_id = "Selecciona una disciplina deportiva.";
    } else {
      const deporte = deportes.find((d) => d.cod_deporte === form.disciplina_deportiva_id);
      const inscritos = cupos[form.disciplina_deportiva_id] ?? 0;
      if (deporte?.cupo_maximo != null && inscritos >= deporte.cupo_maximo) {
        e.disciplina_deportiva_id = "Esta disciplina ya no tiene cupos disponibles.";
      }
    }
    if (necesitaComprobante && !comprobante)
      e.comprobante = "El comprobante de pago de la póliza de seguro es requerido.";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError("");
    if (!validar()) return;

    setSending(true);
    try {
      await crearInscripcionVacacional({
        ...form,
        comprobante: necesitaComprobante ? comprobante! : undefined,
      });
      setEnviado(true);
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Error al enviar el formulario.");
    } finally {
      setSending(false);
    }
  };

  const update = (field: keyof typeof ESTADO_INICIAL, value: string | number) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // Pantalla de carga
  // ─────────────────────────────────────────────────────────────────────────────
  if (configLoading) {
    return (
      <div className="min-h-screen bg-muted flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Formulario inactivo
  // ─────────────────────────────────────────────────────────────────────────────
  if (!formularioActivo) {
    return (
      <div className="min-h-screen bg-muted flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-xl max-w-md w-full overflow-hidden">
          <div className="bg-gradient-to-r from-primary to-secondary p-8 text-center">
            <CalendarRange className="h-14 w-14 text-white mx-auto mb-3 opacity-80" />
            <h2 className="text-white font-bold text-2xl">Inscripción vacacional</h2>
            <p className="text-white/70 text-sm mt-2">Bienestar Deportivo UPC</p>
          </div>
          <div className="p-8 text-center">
            <p className="text-lg font-semibold text-foreground mb-2">
              El formulario no está disponible
            </p>
            <p className="text-sm text-muted-foreground mb-6">
              Las inscripciones vacacionales no se encuentran activas en este momento. Intenta de
              nuevo más tarde o consulta con el área de Bienestar Deportivo.
            </p>
            {onVolver && (
              <button
                onClick={onVolver}
                className="px-6 py-2 text-sm font-semibold text-primary-foreground bg-primary rounded-xl hover:bg-primary/90 transition-colors"
              >
                ← Volver al inicio
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Pantalla de éxito
  // ─────────────────────────────────────────────────────────────────────────────
  if (enviado) {
    return (
      <div className="min-h-screen bg-muted flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-xl max-w-md w-full overflow-hidden text-center">
          <div className="bg-gradient-to-r from-primary to-secondary p-8">
            <CheckCircle2 className="h-16 w-16 text-white mx-auto" />
          </div>
          <div className="p-8">
            <h2 className="text-2xl font-bold text-primary mb-2">¡Inscripción enviada!</h2>
            <p className="text-muted-foreground text-sm mb-6">
              Tu inscripción vacacional fue registrada exitosamente. El área de Bienestar Deportivo
              se pondrá en contacto contigo pronto.
            </p>
            {onVolver && (
              <button
                onClick={onVolver}
                className="px-6 py-2 text-sm font-semibold text-primary-foreground bg-primary rounded-xl hover:bg-primary/90 transition-colors"
              >
                ← Volver al inicio
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Formulario activo
  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-muted">
      <div className="max-w-2xl mx-auto px-4 py-12 pb-16">
        {/* Encabezado */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-primary mb-4">
            <Trophy className="h-3.5 w-3.5" />
            Bienestar Deportivo UPC
          </div>
          <h1 className="text-4xl font-bold text-primary mb-2">Inscripción Vacacional</h1>
          <p className="text-muted-foreground">
            Completa el formulario para inscribirte a los cursos vacacionales.
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="bg-white rounded-3xl shadow-sm overflow-hidden mb-6">
            {/* Header tarjeta */}
            <div className="bg-gradient-to-r from-primary to-secondary p-6">
              <h2 className="text-white font-bold text-lg">Datos del inscrito</h2>
              <p className="text-white/70 text-sm mt-1">
                Información personal requerida para el registro
              </p>
            </div>

            <div className="p-7 space-y-5">
              {/* Nombre completo */}
              <div>
                <label className="block text-xs font-bold text-primary uppercase tracking-wide mb-2">
                  Nombre completo <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Nombre y apellidos"
                  value={form.nombre_completo}
                  onChange={(e) => update("nombre_completo", e.target.value)}
                  className="w-full px-3 py-2 border-2 border-secondary/30 rounded-lg bg-muted text-foreground focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                />
                {errors.nombre_completo && (
                  <p className="text-xs text-destructive mt-1">{errors.nombre_completo}</p>
                )}
              </div>

              {/* Edad + Documento */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-primary uppercase tracking-wide mb-2">
                    Edad <span className="text-destructive">*</span>{" "}
                    <span className="font-normal text-muted-foreground normal-case tracking-normal">
                      (máx. 14 años)
                    </span>
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={14}
                    placeholder="Ej: 10"
                    value={form.edad || ""}
                    onChange={(e) => update("edad", parseInt(e.target.value, 10) || 0)}
                    className="w-full px-3 py-2 border-2 border-secondary/30 rounded-lg bg-muted text-foreground focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  />
                  {errors.edad && <p className="text-xs text-destructive mt-1">{errors.edad}</p>}
                </div>
                <div>
                  <label className="block text-xs font-bold text-primary uppercase tracking-wide mb-2">
                    Número de documento <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Número de identificación"
                    value={form.numero_documento}
                    onChange={(e) => update("numero_documento", e.target.value)}
                    className="w-full px-3 py-2 border-2 border-secondary/30 rounded-lg bg-muted text-foreground focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  />
                  {errors.numero_documento && (
                    <p className="text-xs text-destructive mt-1">{errors.numero_documento}</p>
                  )}
                </div>
              </div>

              {/* Teléfono */}
              <div>
                <label className="block text-xs font-bold text-primary uppercase tracking-wide mb-2">
                  Teléfono <span className="text-destructive">*</span>{" "}
                  <span className="font-normal text-muted-foreground normal-case tracking-normal">
                    (exactamente 10 dígitos)
                  </span>
                </label>
                <input
                  type="tel"
                  placeholder="3XX XXX XXXX"
                  value={form.telefono}
                  maxLength={10}
                  onChange={(e) => update("telefono", e.target.value.replace(/\D/g, ""))}
                  className="w-full px-3 py-2 border-2 border-secondary/30 rounded-lg bg-muted text-foreground focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                />
                {errors.telefono && (
                  <p className="text-xs text-destructive mt-1">{errors.telefono}</p>
                )}
              </div>

              {/* Información de referencia */}
              <div>
                <label className="block text-xs font-bold text-primary uppercase tracking-wide mb-2">
                  Relación con la UPC <span className="text-destructive">*</span>
                </label>
                <select
                  value={form.informacion_referencia}
                  onChange={(e) => update("informacion_referencia", e.target.value)}
                  className="w-full px-3 py-2 border-2 border-secondary/30 rounded-lg bg-muted text-foreground focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                >
                  {INFORMACION_REFERENCIA_OPTIONS.map((ref) => (
                    <option key={ref} value={ref}>
                      {ref}
                    </option>
                  ))}
                </select>
              </div>

              {/* Disciplina deportiva */}
              <div>
                <label className="block text-xs font-bold text-primary uppercase tracking-wide mb-2">
                  Disciplina deportiva <span className="text-destructive">*</span>
                </label>
                {deportesLoading ? (
                  <div className="flex items-center gap-2 text-muted-foreground text-sm py-2">
                    <Loader2 className="h-4 w-4 animate-spin" /> Cargando disciplinas...
                  </div>
                ) : (
                  <select
                    value={form.disciplina_deportiva_id}
                    onChange={(e) =>
                      update("disciplina_deportiva_id", parseInt(e.target.value, 10))
                    }
                    className="w-full px-3 py-2 border-2 border-secondary/30 rounded-lg bg-muted text-foreground focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  >
                    {deportes
                      .filter((d) => {
                        const inscritos = cupos[d.cod_deporte] ?? 0;
                        return d.cupo_maximo == null || inscritos < d.cupo_maximo;
                      })
                      .map((d) => {
                        const inscritos = cupos[d.cod_deporte] ?? 0;
                        const disponibles =
                          d.cupo_maximo != null ? d.cupo_maximo - inscritos : null;
                        return (
                          <option key={d.cod_deporte} value={d.cod_deporte}>
                            {d.nom_deporte}
                            {disponibles != null
                              ? ` (${disponibles} cupo${disponibles === 1 ? "" : "s"} disponible${disponibles === 1 ? "" : "s"})`
                              : ""}
                          </option>
                        );
                      })}
                  </select>
                )}
                {errors.disciplina_deportiva_id && (
                  <p className="text-xs text-destructive mt-1">{errors.disciplina_deportiva_id}</p>
                )}
              </div>

              {/* Comprobante — condicional */}
              {necesitaComprobante && (
                <div>
                  <label className="block text-xs font-bold text-primary uppercase tracking-wide mb-2">
                    Comprobante de pago de póliza de seguro{" "}
                    <span className="text-destructive">*</span>
                  </label>
                  <p className="text-xs text-muted-foreground mb-3">
                    Adjunta el comprobante de pago de la póliza de seguro requerido para participar
                    en los cursos vacacionales.
                  </p>

                  {/* Zona de carga */}
                  <div
                    className={`relative rounded-xl border-2 border-dashed transition-colors cursor-pointer ${
                      comprobante
                        ? "border-primary/50 bg-primary/5"
                        : errors.comprobante
                          ? "border-destructive/50 bg-destructive/5"
                          : "border-secondary/40 bg-muted hover:border-primary/40"
                    }`}
                    onClick={() => fileRef.current?.click()}
                  >
                    <input
                      ref={fileRef}
                      type="file"
                      accept="image/*,.pdf"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0] ?? null;
                        setComprobante(file);
                        setErrors((prev) => ({ ...prev, comprobante: "" }));
                      }}
                    />
                    <div className="flex flex-col items-center justify-center gap-2 py-6 px-4 text-center">
                      {comprobante ? (
                        <>
                          <CheckCircle2 className="h-8 w-8 text-primary" />
                          <p className="text-sm font-semibold text-primary">{comprobante.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {(comprobante.size / 1024).toFixed(1)} KB
                          </p>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setComprobante(null);
                              if (fileRef.current) fileRef.current.value = "";
                            }}
                            className="mt-1 inline-flex items-center gap-1 text-xs text-destructive hover:underline"
                          >
                            <X className="h-3 w-3" /> Quitar archivo
                          </button>
                        </>
                      ) : (
                        <>
                          <Upload className="h-8 w-8 text-muted-foreground" />
                          <p className="text-sm font-medium text-foreground">
                            Haz clic para seleccionar un archivo
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Formatos aceptados: imagen o PDF
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                  {errors.comprobante && (
                    <p className="text-xs text-destructive mt-1">{errors.comprobante}</p>
                  )}
                </div>
              )}

              {/* Nota Hijo de Funcionario */}
              {!necesitaComprobante && (
                <div className="flex items-start gap-3 rounded-xl bg-green-500/10 border border-green-500/20 p-4">
                  <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                  <p className="text-sm text-green-700">
                    Como <strong>Hijo de Funcionario</strong>, no se requiere comprobante de pago de
                    póliza de seguro.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Error del servidor */}
          {serverError && (
            <div className="flex items-center gap-3 p-4 rounded-xl bg-destructive/10 text-destructive mb-6">
              <AlertCircle className="h-5 w-5 shrink-0" />
              <p className="text-sm font-medium">{serverError}</p>
            </div>
          )}

          {/* Acciones */}
          <div className="flex flex-col sm:flex-row items-center gap-3 justify-between">
            {onVolver && (
              <button
                type="button"
                onClick={onVolver}
                className="px-6 py-2.5 text-sm font-semibold text-primary border-2 border-secondary/30 rounded-xl hover:bg-secondary/5 transition-colors"
              >
                ← Volver
              </button>
            )}
            <button
              type="submit"
              disabled={sending}
              className="inline-flex items-center gap-2 px-8 py-2.5 text-sm font-semibold text-primary-foreground bg-primary rounded-xl hover:bg-primary/90 disabled:opacity-60 disabled:cursor-not-allowed transition-colors shadow-sm"
            >
              {sending && <Loader2 className="h-4 w-4 animate-spin" />}
              {sending ? "Enviando..." : "Enviar inscripción"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
