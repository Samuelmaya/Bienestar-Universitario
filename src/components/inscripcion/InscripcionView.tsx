import { useState, useRef } from "react";
import { ChevronLeft, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Estudiante {
  nombre: string;
  tipo_documento: "RC" | "TI" | "CC" | "CE" | "PA";
  sexo: "M" | "F";
  fecha_nacimiento: string;
  lugar_nacimiento: string;
  estado_civil: "SOLTERO" | "CASADO" | "UNION_LIBRE" | "DIVORCIADO" | "VIUDO";
  direccion_residencial: string;
  barrio: string;
  num_celular: string;
  email: string;
}

interface InformacionAcademica {
  nom_colegio: string;
  jornada_colegio: "MAÑANA" | "TARDE" | "NOCHE" | "COMPLETA";
  anio_promocion: number;
  carrera: string;
  jornada_uni: "MAÑANA" | "TARDE" | "NOCHE" | "COMPLETA";
  promedio: number;
  permanencia: "ACTIVO" | "INACTIVO" | "SUSPENDIDO";
}

interface DatosGenerales {
  nivel_deportivo: "NINGUNO" | "LOCAL" | "REGIONAL" | "NACIONAL" | "INTERNACIONAL";
  torneo_participado: string;
  club_perteneciente: string;
  peso: number;
  estatura: number;
  enfermedad_padecida: string;
  eps: string;
  rh: "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-";
  trabaja_estudiante: boolean;
  lugar_trabajo: string;
  cargo_de_trabajo: string;
}

interface DatosFamiliares {
  nom_madre: string;
  dir_madre: string;
  ciudad_madre: string;
  cel_madre: string;
  ocup_madre: string;
  nom_padre: string;
  dir_padre: string;
  ciudad_padre: string;
  cel_padre: string;
  ocup_padre: string;
  observaciones: string;
}

interface Documentos {
  horario: File | null;
  cedula: File | null;
  valoracion_medica: File | null;
  valoracion_odontologica: File | null;
  valoracion_psicologica: File | null;
  foto_3x4: File | null;
}

// ─── Datos del modal de términos ─────────────────────────────────────────────

const terminos = [
  "La práctica del deporte en la Universidad Popular del Cesar es un servicio que brinda la División de Bienestar Universitario a través de la Sección Deportes y Recreación.",
  "El deporte en la Universidad se contempla de tres formas: Formativo, Recreativo y Competitivo.",
  "Para ingresar a la práctica de una disciplina deportiva se debe llenar una ficha informativa, copias de: documento de identidad, prematrícula u horario de clases, foto de 3x4 cm reciente y entregarla a la sección de deportes debidamente diligenciada.",
  "Todo estudiante que practique una disciplina deportiva que ofrezca la Universidad deberá guardar buen comportamiento y acatar el reglamento estipulado.",
  "El solo hecho de practicar una disciplina deportiva que ofrezca la universidad, no amerita la entrega de la beca al estudiante.",
  "Los estudiantes con derecho a acceder a las becas son los que integran las selecciones de la Universidad y representan a nuestra institución en eventos a nivel municipal, regional, nacional e internacional.",
  "Los principales aspectos a tener en cuenta: Nivel técnico, Asistencia a los entrenamientos (mínimo 75%), disciplina, sentido de pertenencia con la Universidad y asistencia a eventos programados por la Sección de Deportes o la División de Bienestar Universitario.",
  "Los estudiantes que sean seleccionados para acceder a la beca deberán tener un promedio académico del semestre igual o mayor a (3.5) (tres puntos cinco).",
  "La dotación deportiva utilizada en la práctica de las diferentes disciplinas es propiedad de la universidad y los estudiantes deberán hacer buen uso de ella.",
  "Cualquier aspecto no contemplado en esta información que sea objeto de discusión será estudiado por el jefe de Bienestar Universitario, el jefe de la Sección de Deportes y los profesores adscritos a la Sección de Deportes.",
];

// ─── Componente principal ─────────────────────────────────────────────────────

interface InscripcionViewProps {
  onVolver?: () => void;
}

// named export (usado desde inscripcion.tsx)
export function InscripcionView({ onVolver }: InscripcionViewProps) {
  const [mostrarModal, setMostrarModal] = useState(true);
  const [aceptoTerminos, setAceptoTerminos] = useState(false);
  const [paso, setPaso] = useState(0);

  const [estudiante, setEstudiante] = useState<Estudiante>({
    nombre: "", tipo_documento: "CC", sexo: "M",
    fecha_nacimiento: "", lugar_nacimiento: "",
    estado_civil: "SOLTERO", direccion_residencial: "",
    barrio: "", num_celular: "", email: "",
  });

  const [academica, setAcademica] = useState<InformacionAcademica>({
    nom_colegio: "", jornada_colegio: "MAÑANA", anio_promocion: 2024,
    carrera: "", jornada_uni: "MAÑANA", promedio: 3.5, permanencia: "ACTIVO",
  });

  const [generales, setGenerales] = useState<DatosGenerales>({
    nivel_deportivo: "NINGUNO", torneo_participado: "", club_perteneciente: "",
    peso: 0, estatura: 0, enfermedad_padecida: "", eps: "", rh: "O+",
    trabaja_estudiante: false, lugar_trabajo: "", cargo_de_trabajo: "",
  });

  const [familiares, setFamiliares] = useState<DatosFamiliares>({
    nom_madre: "", dir_madre: "", ciudad_madre: "", cel_madre: "", ocup_madre: "",
    nom_padre: "", dir_padre: "", ciudad_padre: "", cel_padre: "", ocup_padre: "",
    observaciones: "",
  });

  const [documentos, setDocumentos] = useState<Documentos>({
    horario: null, cedula: null, valoracion_medica: null,
    valoracion_odontologica: null, valoracion_psicologica: null,
    foto_3x4: null,
  });

  const [enviado, setEnviado] = useState(false);
  const fileRefs = {
    horario: useRef<HTMLInputElement>(null),
    cedula: useRef<HTMLInputElement>(null),
    valoracion_medica: useRef<HTMLInputElement>(null),
    valoracion_odontologica: useRef<HTMLInputElement>(null),
    valoracion_psicologica: useRef<HTMLInputElement>(null),
    foto_3x4: useRef<HTMLInputElement>(null),
  };

  const pasos = [
    { label: "Datos Personales" },
    { label: "Info Académica" },
    { label: "Datos Generales" },
    { label: "Datos Familiares" },
    { label: "Documentos" },
  ];

  const actualizarDoc = (key: keyof Documentos, file: File | null) => {
    setDocumentos(prev => ({ ...prev, [key]: file }));
  };

  const todosDocsCargados = Object.values(documentos).every(v => v !== null);

  const handleEnviar = () => {
    setEnviado(true);
  };

  return (
    <div className="min-h-screen bg-muted">

      {/* Modal de términos */}
      {mostrarModal && (
        <div className="fixed inset-0 z-50 bg-black/55 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[88vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in duration-300">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-primary to-secondary p-7 flex items-center gap-4 flex-shrink-0">
              <div className="w-11 h-11 bg-white/15 rounded-lg flex items-center justify-center text-xs font-semibold uppercase tracking-wide">
                TÉRMINOS
              </div>
              <div>
                <h3 className="text-white font-bold text-lg">Información Importante</h3>
                <p className="text-xs text-white/70 uppercase tracking-wider mt-1">
                  Código: 307-202-PRO03-FOR03 · Versión 1
                </p>
              </div>
            </div>

            {/* Modal Body */}
            <div className="overflow-y-auto flex-1 p-7">
              <div className="text-center font-bold text-primary mb-6 pb-4 border-b-2 border-accent/30">
                INFORMACIÓN PARA LOS PRACTICANTES DE LOS GRUPOS DEPORTIVOS<br />
                DE LA UNIVERSIDAD POPULAR DEL CESAR
              </div>

              {terminos.map((t, i) => (
                <div key={i} className="flex gap-3 p-3 rounded-lg mb-2 bg-muted border-l-4 border-secondary hover:bg-secondary/10 transition-colors">
                  <span className="flex-shrink-0 w-5 h-5 bg-secondary text-white rounded-full flex items-center justify-center text-xs font-bold">
                    {i + 1}
                  </span>
                  <span className="text-sm leading-relaxed text-foreground/90">{t}</span>
                </div>
              ))}

              <div className="mt-6 p-5 border-2 border-dashed border-secondary/30 rounded-lg text-center bg-secondary/10">
                <p className="text-xs text-muted-foreground italic mb-1">Firmado por</p>
                <strong className="text-primary text-sm block">RICARDO MOVILLA ANDRADE</strong>
                <span className="text-xs text-muted-foreground">Jefe Sección Deportes y Recreación</span>
              </div>

              <label className="flex items-center gap-3 mt-6 p-3 rounded-lg bg-secondary/10 cursor-pointer border-2 border-transparent hover:border-secondary transition-colors">
                <input
                  type="checkbox"
                  checked={aceptoTerminos}
                  onChange={(e) => setAceptoTerminos(e.target.checked)}
                  className="w-5 h-5 cursor-pointer accent-primary rounded"
                />
                <span className="text-sm font-semibold text-primary cursor-pointer">
                  Dejo constancia que he leído y acepto este documento
                </span>
              </label>
            </div>

            {/* Modal Footer */}
            <div className="border-t border-border p-4 flex gap-3 justify-end flex-shrink-0 bg-muted">
              {onVolver && (
                <button
                  onClick={onVolver}
                  className="px-4 py-2 text-sm font-semibold text-primary border-2 border-secondary/30 rounded-lg hover:bg-secondary/5 transition-colors"
                >
                  Cancelar
                </button>
              )}
              <button
                disabled={!aceptoTerminos}
                onClick={() => setMostrarModal(false)}
                className="px-6 py-2 text-sm font-semibold text-primary-foreground bg-primary rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Aceptar y Continuar →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Contenido principal */}
      {!mostrarModal && (
        <main className="max-w-3xl mx-auto px-4 py-12 pb-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-primary mb-2">Inscripción Deportiva</h2>
            <p className="text-muted-foreground italic">
              Completa todos los pasos para registrarte en los grupos deportivos
            </p>
          </div>

          {/* Stepper */}
          {!enviado && (
            <div className="bg-white rounded-3xl p-6 shadow-sm mb-8 overflow-x-auto">
              <div className="flex gap-0 items-start min-w-min">
                {pasos.map((p, i) => (
                  <div
                    key={i}
                    className="flex flex-col items-center gap-2 flex-1 min-w-20 relative cursor-pointer group"
                    onClick={() => i < paso && setPaso(i)}
                  >
                    {i < pasos.length - 1 && (
                      <div
                        className={`absolute top-4 left-[50%] w-full h-1 ${
                          i < paso ? "bg-primary" : "bg-secondary/30"
                        }`}
                      />
                    )}
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm relative z-10 transition-all ${
                        i === paso
                          ? "bg-primary text-primary-foreground ring-4 ring-primary/20"
                          : i < paso
                            ? "bg-primary text-primary-foreground"
                            : "bg-secondary/30 text-muted-foreground"
                      }`}
                    >
                      {i < paso ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
                    </div>
                    <span className={`text-xs font-semibold text-center leading-tight whitespace-nowrap ${
                      i === paso ? "text-primary" : i < paso ? "text-primary" : "text-muted-foreground"
                    }`}>
                      {p.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Paso 0: Datos del estudiante */}
          {paso === 0 && !enviado && (
            <div className="bg-white rounded-3xl shadow-sm overflow-hidden mb-4">
              <div className="bg-gradient-to-r from-primary to-secondary p-6 flex items-center gap-4">
                <div>
                  <h3 className="text-white font-bold text-lg">Datos Personales</h3>
                  <p className="text-sm text-white/70 mt-1">Información básica del estudiante</p>
                </div>
              </div>
              <div className="p-7">
                <div className="space-y-5">
                  <div>
                    <label className="block text-xs font-bold text-primary uppercase tracking-wide mb-2">
                      Nombre Completo
                    </label>
                    <input
                      type="text"
                      placeholder="Nombre y apellidos"
                      value={estudiante.nombre}
                      onChange={(e) =>
                        setEstudiante({ ...estudiante, nombre: e.target.value })
                      }
                      className="w-full px-3 py-2 border-2 border-secondary/30 rounded-lg bg-muted text-foreground focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-primary uppercase tracking-wide mb-2">
                        Tipo de Documento
                      </label>
                      <select
                        value={estudiante.tipo_documento}
                        onChange={(e) =>
                          setEstudiante({
                            ...estudiante,
                            tipo_documento: e.target.value as any,
                          })
                        }
                        className="w-full px-3 py-2 border-2 border-secondary/30 rounded-lg bg-muted text-foreground focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                      >
                        <option value="CC">Cédula de Ciudadanía</option>
                        <option value="TI">Tarjeta de Identidad</option>
                        <option value="RC">Registro Civil</option>
                        <option value="CE">Cédula Extranjería</option>
                        <option value="PA">Pasaporte</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-primary uppercase tracking-wide mb-2">
                        Sexo
                      </label>
                      <select
                        value={estudiante.sexo}
                        onChange={(e) =>
                          setEstudiante({ ...estudiante, sexo: e.target.value as any })
                        }
                        className="w-full px-3 py-2 border-2 border-secondary/30 rounded-lg bg-muted text-foreground focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                      >
                        <option value="M">Masculino</option>
                        <option value="F">Femenino</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-primary uppercase tracking-wide mb-2">
                        Fecha de Nacimiento
                      </label>
                      <input
                        type="date"
                        value={estudiante.fecha_nacimiento}
                        onChange={(e) =>
                          setEstudiante({
                            ...estudiante,
                            fecha_nacimiento: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border-2 border-secondary/30 rounded-lg bg-muted text-foreground focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-primary uppercase tracking-wide mb-2">
                        Lugar de Nacimiento
                      </label>
                      <input
                        type="text"
                        placeholder="Ciudad de nacimiento"
                        value={estudiante.lugar_nacimiento}
                        onChange={(e) =>
                          setEstudiante({
                            ...estudiante,
                            lugar_nacimiento: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border-2 border-secondary/30 rounded-lg bg-muted text-foreground focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-primary uppercase tracking-wide mb-2">
                      Estado Civil
                    </label>
                    <select
                      value={estudiante.estado_civil}
                      onChange={(e) =>
                        setEstudiante({
                          ...estudiante,
                          estado_civil: e.target.value as any,
                        })
                      }
                      className="w-full px-3 py-2 border-2 border-secondary/30 rounded-lg bg-muted text-foreground focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    >
                      <option value="SOLTERO">Soltero/a</option>
                      <option value="CASADO">Casado/a</option>
                      <option value="UNION_LIBRE">Unión Libre</option>
                      <option value="DIVORCIADO">Divorciado/a</option>
                      <option value="VIUDO">Viudo/a</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-primary uppercase tracking-wide mb-2">
                        Dirección Residencial
                      </label>
                      <input
                        type="text"
                        placeholder="Calle / Carrera / Avenida"
                        value={estudiante.direccion_residencial}
                        onChange={(e) =>
                          setEstudiante({
                            ...estudiante,
                            direccion_residencial: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border-2 border-secondary/30 rounded-lg bg-muted text-foreground focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-primary uppercase tracking-wide mb-2">
                        Barrio
                      </label>
                      <input
                        type="text"
                        placeholder="Nombre del barrio"
                        value={estudiante.barrio}
                        onChange={(e) =>
                          setEstudiante({ ...estudiante, barrio: e.target.value })
                        }
                        className="w-full px-3 py-2 border-2 border-secondary/30 rounded-lg bg-muted text-foreground focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-primary uppercase tracking-wide mb-2">
                        Número Celular
                      </label>
                      <input
                        type="tel"
                        placeholder="3XX XXX XXXX"
                        value={estudiante.num_celular}
                        onChange={(e) =>
                          setEstudiante({
                            ...estudiante,
                            num_celular: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border-2 border-secondary/30 rounded-lg bg-muted text-foreground focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-primary uppercase tracking-wide mb-2">
                        Correo Electrónico
                      </label>
                      <input
                        type="email"
                        placeholder="correo@ejemplo.com"
                        value={estudiante.email}
                        onChange={(e) =>
                          setEstudiante({ ...estudiante, email: e.target.value })
                        }
                        className="w-full px-3 py-2 border-2 border-secondary/30 rounded-lg bg-muted text-foreground focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>
                <div className="flex justify-between items-center mt-7 pt-5 border-t border-secondary/20">
                  <span className="text-xs text-muted-foreground">Paso 1 de 5</span>
                  <button
                    onClick={() => setPaso(1)}
                    className="px-6 py-2 text-sm font-semibold text-primary-foreground bg-primary rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    Siguiente →
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Paso 1: Información Académica */}
          {paso === 1 && !enviado && (
            <div className="bg-white rounded-3xl shadow-sm overflow-hidden mb-4">
              <div className="bg-gradient-to-r from-primary to-secondary p-6 flex items-center gap-4">
                <div>
                  <h3 className="text-white font-bold text-lg">Información Académica</h3>
                  <p className="text-sm text-white/70 mt-1">Datos sobre tu formación académica</p>
                </div>
              </div>
              <div className="p-7">
                <div className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-primary uppercase tracking-wide mb-2">
                        Nombre del Colegio
                      </label>
                      <input
                        type="text"
                        placeholder="Institución educativa"
                        value={academica.nom_colegio}
                        onChange={(e) =>
                          setAcademica({ ...academica, nom_colegio: e.target.value })
                        }
                        className="w-full px-3 py-2 border-2 border-secondary/30 rounded-lg bg-muted text-foreground focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-primary uppercase tracking-wide mb-2">
                        Jornada Colegio
                      </label>
                      <select
                        value={academica.jornada_colegio}
                        onChange={(e) =>
                          setAcademica({
                            ...academica,
                            jornada_colegio: e.target.value as any,
                          })
                        }
                        className="w-full px-3 py-2 border-2 border-secondary/30 rounded-lg bg-muted text-foreground focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                      >
                        <option value="MAÑANA">Mañana</option>
                        <option value="TARDE">Tarde</option>
                        <option value="NOCHE">Noche</option>
                        <option value="COMPLETA">Jornada Completa</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-primary uppercase tracking-wide mb-2">
                      Año de Promoción
                    </label>
                    <input
                      type="number"
                      value={academica.anio_promocion}
                      min={1990}
                      max={2030}
                      onChange={(e) =>
                        setAcademica({
                          ...academica,
                          anio_promocion: parseInt(e.target.value),
                        })
                      }
                      className="w-full px-3 py-2 border-2 border-secondary/30 rounded-lg bg-muted text-foreground focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-primary uppercase tracking-wide mb-2">
                        Carrera Universitaria
                      </label>
                      <input
                        type="text"
                        placeholder="Nombre de la carrera"
                        value={academica.carrera}
                        onChange={(e) =>
                          setAcademica({ ...academica, carrera: e.target.value })
                        }
                        className="w-full px-3 py-2 border-2 border-secondary/30 rounded-lg bg-muted text-foreground focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-primary uppercase tracking-wide mb-2">
                        Jornada Universidad
                      </label>
                      <select
                        value={academica.jornada_uni}
                        onChange={(e) =>
                          setAcademica({
                            ...academica,
                            jornada_uni: e.target.value as any,
                          })
                        }
                        className="w-full px-3 py-2 border-2 border-secondary/30 rounded-lg bg-muted text-foreground focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                      >
                        <option value="MAÑANA">Mañana</option>
                        <option value="TARDE">Tarde</option>
                        <option value="NOCHE">Noche</option>
                        <option value="COMPLETA">Jornada Completa</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-primary uppercase tracking-wide mb-2">
                        Promedio Académico
                      </label>
                      <input
                        type="number"
                        value={academica.promedio}
                        step="0.1"
                        min={0}
                        max={5}
                        onChange={(e) =>
                          setAcademica({
                            ...academica,
                            promedio: parseFloat(e.target.value),
                          })
                        }
                        className="w-full px-3 py-2 border-2 border-secondary/30 rounded-lg bg-muted text-foreground focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-primary uppercase tracking-wide mb-2">
                        Permanencia
                      </label>
                      <select
                        value={academica.permanencia}
                        onChange={(e) =>
                          setAcademica({
                            ...academica,
                            permanencia: e.target.value as any,
                          })
                        }
                        className="w-full px-3 py-2 border-2 border-secondary/30 rounded-lg bg-muted text-foreground focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                      >
                        <option value="ACTIVO">Activo</option>
                        <option value="INACTIVO">Inactivo</option>
                        <option value="SUSPENDIDO">Suspendido</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="flex justify-between items-center mt-7 pt-5 border-t border-secondary/20">
                  <button
                    onClick={() => setPaso(0)}
                    className="px-6 py-2 text-sm font-semibold text-primary border-2 border-secondary/30 rounded-lg hover:bg-secondary/5 transition-colors"
                  >
                    ← Anterior
                  </button>
                  <button
                    onClick={() => setPaso(2)}
                    className="px-6 py-2 text-sm font-semibold text-primary-foreground bg-primary rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    Siguiente →
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Paso 2: Datos Generales */}
          {paso === 2 && !enviado && (
            <div className="bg-white rounded-3xl shadow-sm overflow-hidden mb-4">
              <div className="bg-gradient-to-r from-primary to-secondary p-6 flex items-center gap-4">
                <div>
                  <h3 className="text-white font-bold text-lg">Datos Generales</h3>
                  <p className="text-sm text-white/70 mt-1">Información deportiva y de salud</p>
                </div>
              </div>
              <div className="p-7">
                <div className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-primary uppercase tracking-wide mb-2">
                        Nivel Deportivo
                      </label>
                      <select
                        value={generales.nivel_deportivo}
                        onChange={(e) =>
                          setGenerales({
                            ...generales,
                            nivel_deportivo: e.target.value as any,
                          })
                        }
                        className="w-full px-3 py-2 border-2 border-secondary/30 rounded-lg bg-muted text-foreground focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                      >
                        <option value="NINGUNO">Ninguno</option>
                        <option value="LOCAL">Local</option>
                        <option value="REGIONAL">Regional</option>
                        <option value="NACIONAL">Nacional</option>
                        <option value="INTERNACIONAL">Internacional</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-primary uppercase tracking-wide mb-2">
                        Club Perteneciente
                      </label>
                      <input
                        type="text"
                        placeholder="Nombre del club (opcional)"
                        value={generales.club_perteneciente}
                        onChange={(e) =>
                          setGenerales({
                            ...generales,
                            club_perteneciente: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border-2 border-secondary/30 rounded-lg bg-muted text-foreground focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-primary uppercase tracking-wide mb-2">
                      Torneos en los que ha participado
                    </label>
                    <input
                      type="text"
                      placeholder="Nombre de torneos (separados por coma)"
                      value={generales.torneo_participado}
                      onChange={(e) =>
                        setGenerales({
                          ...generales,
                          torneo_participado: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border-2 border-secondary/30 rounded-lg bg-muted text-foreground focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-primary uppercase tracking-wide mb-2">
                        Peso (kg)
                      </label>
                      <input
                        type="number"
                        placeholder="Ej: 65"
                        value={generales.peso || ""}
                        onChange={(e) =>
                          setGenerales({
                            ...generales,
                            peso: parseFloat(e.target.value),
                          })
                        }
                        className="w-full px-3 py-2 border-2 border-secondary/30 rounded-lg bg-muted text-foreground focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-primary uppercase tracking-wide mb-2">
                        Estatura (cm)
                      </label>
                      <input
                        type="number"
                        placeholder="Ej: 170"
                        value={generales.estatura || ""}
                        onChange={(e) =>
                          setGenerales({
                            ...generales,
                            estatura: parseFloat(e.target.value),
                          })
                        }
                        className="w-full px-3 py-2 border-2 border-secondary/30 rounded-lg bg-muted text-foreground focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-primary uppercase tracking-wide mb-2">
                        RH Sanguíneo
                      </label>
                      <select
                        value={generales.rh}
                        onChange={(e) =>
                          setGenerales({ ...generales, rh: e.target.value as any })
                        }
                        className="w-full px-3 py-2 border-2 border-secondary/30 rounded-lg bg-muted text-foreground focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                      >
                        {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(
                          (r) => (
                            <option key={r} value={r}>
                              {r}
                            </option>
                          )
                        )}
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-primary uppercase tracking-wide mb-2">
                        EPS
                      </label>
                      <input
                        type="text"
                        placeholder="Nombre de la EPS"
                        value={generales.eps}
                        onChange={(e) =>
                          setGenerales({ ...generales, eps: e.target.value })
                        }
                        className="w-full px-3 py-2 border-2 border-secondary/30 rounded-lg bg-muted text-foreground focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-primary uppercase tracking-wide mb-2">
                        Enfermedad Padecida
                      </label>
                      <input
                        type="text"
                        placeholder="Ninguna / especificar"
                        value={generales.enfermedad_padecida}
                        onChange={(e) =>
                          setGenerales({
                            ...generales,
                            enfermedad_padecida: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border-2 border-secondary/30 rounded-lg bg-muted text-foreground focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                      />
                    </div>
                  </div>
                  <div
                    className="p-3 rounded-lg bg-secondary/10 border-2 border-secondary/30 flex items-center gap-3 cursor-pointer hover:bg-secondary/20 transition-colors"
                    onClick={() =>
                      setGenerales({
                        ...generales,
                        trabaja_estudiante: !generales.trabaja_estudiante,
                      })
                    }
                  >
                    <input
                      type="checkbox"
                      checked={generales.trabaja_estudiante}
                      onChange={() => {}}
                      className="w-5 h-5 cursor-pointer accent-primary rounded"
                    />
                    <label className="flex-1 text-sm font-semibold text-primary cursor-pointer">
                      ¿El estudiante trabaja actualmente?
                    </label>
                  </div>
                  {generales.trabaja_estudiante && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-primary uppercase tracking-wide mb-2">
                          Lugar de Trabajo
                        </label>
                        <input
                          type="text"
                          placeholder="Empresa / institución"
                          value={generales.lugar_trabajo}
                          onChange={(e) =>
                            setGenerales({
                              ...generales,
                              lugar_trabajo: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border-2 border-secondary/30 rounded-lg bg-muted text-foreground focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-primary uppercase tracking-wide mb-2">
                          Cargo
                        </label>
                        <input
                          type="text"
                          placeholder="Cargo desempeñado"
                          value={generales.cargo_de_trabajo}
                          onChange={(e) =>
                            setGenerales({
                              ...generales,
                              cargo_de_trabajo: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border-2 border-secondary/30 rounded-lg bg-muted text-foreground focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                        />
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex justify-between items-center mt-7 pt-5 border-t border-secondary/20">
                  <button
                    onClick={() => setPaso(1)}
                    className="px-6 py-2 text-sm font-semibold text-primary border-2 border-secondary/30 rounded-lg hover:bg-secondary/5 transition-colors"
                  >
                    ← Anterior
                  </button>
                  <button
                    onClick={() => setPaso(3)}
                    className="px-6 py-2 text-sm font-semibold text-primary-foreground bg-primary rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    Siguiente →
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Paso 3: Datos Familiares */}
          {paso === 3 && !enviado && (
            <div className="bg-white rounded-3xl shadow-sm overflow-hidden mb-4">
              <div className="bg-gradient-to-r from-primary to-secondary p-6 flex items-center gap-4">
                <div className="w-11 h-11 bg-white/15 rounded-lg flex items-center justify-center text-sm font-semibold uppercase tracking-wide">
                  P4
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg">Datos Familiares</h3>
                  <p className="text-sm text-white/70 mt-1">Información de contacto familiar</p>
                </div>
              </div>
              <div className="p-7">
                <div className="space-y-5">
                  {/* Madre */}
                  <div className="p-4 bg-secondary/10 rounded-lg border-l-4 border-secondary">
                    <p className="font-bold text-sm text-primary uppercase tracking-wide mb-4">
                      👩 Datos de la Madre
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-primary uppercase tracking-wide mb-2">
                          Nombre
                        </label>
                        <input
                          type="text"
                          placeholder="Nombre completo"
                          value={familiares.nom_madre}
                          onChange={(e) =>
                            setFamiliares({
                              ...familiares,
                              nom_madre: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border-2 border-secondary/30 rounded-lg bg-white text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-primary uppercase tracking-wide mb-2">
                          Celular
                        </label>
                        <input
                          type="tel"
                          placeholder="3XX XXX XXXX"
                          value={familiares.cel_madre}
                          onChange={(e) =>
                            setFamiliares({
                              ...familiares,
                              cel_madre: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border-2 border-secondary/30 rounded-lg bg-white text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-primary uppercase tracking-wide mb-2">
                          Dirección
                        </label>
                        <input
                          type="text"
                          placeholder="Dirección"
                          value={familiares.dir_madre}
                          onChange={(e) =>
                            setFamiliares({
                              ...familiares,
                              dir_madre: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border-2 border-secondary/30 rounded-lg bg-white text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-primary uppercase tracking-wide mb-2">
                          Ciudad
                        </label>
                        <input
                          type="text"
                          placeholder="Ciudad"
                          value={familiares.ciudad_madre}
                          onChange={(e) =>
                            setFamiliares({
                              ...familiares,
                              ciudad_madre: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border-2 border-secondary/30 rounded-lg bg-white text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-bold text-primary uppercase tracking-wide mb-2">
                          Ocupación
                        </label>
                        <input
                          type="text"
                          placeholder="Ocupación"
                          value={familiares.ocup_madre}
                          onChange={(e) =>
                            setFamiliares({
                              ...familiares,
                              ocup_madre: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border-2 border-secondary/30 rounded-lg bg-white text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Padre */}
                  <div className="p-4 bg-secondary/10 rounded-lg border-l-4 border-secondary">
                    <p className="font-bold text-sm text-primary uppercase tracking-wide mb-4">
                      👨 Datos del Padre
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-primary uppercase tracking-wide mb-2">
                          Nombre
                        </label>
                        <input
                          type="text"
                          placeholder="Nombre completo"
                          value={familiares.nom_padre}
                          onChange={(e) =>
                            setFamiliares({
                              ...familiares,
                              nom_padre: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border-2 border-secondary/30 rounded-lg bg-white text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-primary uppercase tracking-wide mb-2">
                          Celular
                        </label>
                        <input
                          type="tel"
                          placeholder="3XX XXX XXXX"
                          value={familiares.cel_padre}
                          onChange={(e) =>
                            setFamiliares({
                              ...familiares,
                              cel_padre: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border-2 border-secondary/30 rounded-lg bg-white text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-primary uppercase tracking-wide mb-2">
                          Dirección
                        </label>
                        <input
                          type="text"
                          placeholder="Dirección"
                          value={familiares.dir_padre}
                          onChange={(e) =>
                            setFamiliares({
                              ...familiares,
                              dir_padre: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border-2 border-secondary/30 rounded-lg bg-white text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-primary uppercase tracking-wide mb-2">
                          Ciudad
                        </label>
                        <input
                          type="text"
                          placeholder="Ciudad"
                          value={familiares.ciudad_padre}
                          onChange={(e) =>
                            setFamiliares({
                              ...familiares,
                              ciudad_padre: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border-2 border-secondary/30 rounded-lg bg-white text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-bold text-primary uppercase tracking-wide mb-2">
                          Ocupación
                        </label>
                        <input
                          type="text"
                          placeholder="Ocupación"
                          value={familiares.ocup_padre}
                          onChange={(e) =>
                            setFamiliares({
                              ...familiares,
                              ocup_padre: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border-2 border-secondary/30 rounded-lg bg-white text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-primary uppercase tracking-wide mb-2">
                      Observaciones Generales
                    </label>
                    <textarea
                      placeholder="Alguna observación adicional..."
                      value={familiares.observaciones}
                      onChange={(e) =>
                        setFamiliares({
                          ...familiares,
                          observaciones: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border-2 border-secondary/30 rounded-lg bg-muted text-foreground focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20 outline-none transition-all min-h-20 resize-none"
                    />
                  </div>
                </div>
                <div className="flex justify-between items-center mt-7 pt-5 border-t border-secondary/20">
                  <button
                    onClick={() => setPaso(2)}
                    className="px-6 py-2 text-sm font-semibold text-primary border-2 border-secondary/30 rounded-lg hover:bg-secondary/5 transition-colors"
                  >
                    ← Anterior
                  </button>
                  <button
                    onClick={() => setPaso(4)}
                    className="px-6 py-2 text-sm font-semibold text-primary-foreground bg-primary rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    Siguiente →
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Paso 4: Documentos */}
          {paso === 4 && !enviado && (
            <div className="bg-white rounded-3xl shadow-sm overflow-hidden mb-4">
              <div className="bg-gradient-to-r from-primary to-secondary p-6 flex items-center gap-4">
                <div className="w-11 h-11 bg-white/15 rounded-lg flex items-center justify-center text-sm font-semibold uppercase tracking-wide">
                  P5
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg">Carga de Documentos</h3>
                  <p className="text-sm text-white/70 mt-1">
                    Todos los documentos son obligatorios en formato PDF, excepto la foto 3x4 que debe ser JPG o PNG.
                  </p>
                </div>
              </div>
              <div className="p-7">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  {(
                    [
                      { key: "horario", label: "Horario de Clases", accept: ".pdf" },
                      {
                        key: "cedula",
                        label: "Cédula / Documento de ID",
                        accept: ".pdf",
                      },
                      {
                        key: "valoracion_medica",
                        label: "Control Valoración Médica",
                        accept: ".pdf",
                      },
                      {
                        key: "valoracion_odontologica",
                        label: "Control Valoración Odontológica",
                        accept: ".pdf",
                      },
                      {
                        key: "valoracion_psicologica",
                        label: "Control Valoración Psicológica",
                        accept: ".pdf",
                      },
                      {
                        key: "foto_3x4",
                        label: "Foto 3x4 del Estudiante",
                        accept: "image/png,image/jpeg",
                      },
                    ] as Array<{ key: keyof Documentos; label: string; accept: string }>
                  ).map((doc) => (
                    <div
                      key={doc.key}
                      className={`border-2 ${
                        documentos[doc.key]
                          ? "border-primary bg-primary/5"
                          : "border-dashed border-secondary/30 bg-muted"
                      } rounded-lg p-5 text-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-all relative overflow-hidden group`}
                    >
                      <input
                        type="file"
                        accept={doc.accept}
                        ref={fileRefs[doc.key]}
                        onChange={(e) =>
                          actualizarDoc(doc.key, e.target.files?.[0] ?? null)
                        }
                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                      />
                      <div className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold mb-2 ${
                        documentos[doc.key]
                          ? "bg-primary/10 text-primary"
                          : "bg-muted/70 text-muted-foreground"
                      }`}>
                        {documentos[doc.key] ? "Cargado" : "Pendiente"}
                      </div>
                      <div className="font-bold text-sm text-primary mb-1">
                        {doc.label}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {documentos[doc.key]
                          ? `✓ ${documentos[doc.key]!.name.substring(0, 22)}${
                              documentos[doc.key]!.name.length > 22 ? "…" : ""
                            }`
                          : "Clic para cargar PDF"}
                      </div>
                    </div>
                  ))}
                </div>

                {!todosDocsCargados && (
                  <div className="mb-6 p-4 rounded-lg bg-amber-50 border border-amber-200 flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-amber-700">
                      Debes cargar todos los documentos para poder enviar la inscripción
                    </p>
                  </div>
                )}

                <div className="flex justify-between items-center mt-7 pt-5 border-t border-secondary/20">
                  <button
                    onClick={() => setPaso(3)}
                    className="px-6 py-2 text-sm font-semibold text-primary border-2 border-secondary/30 rounded-lg hover:bg-secondary/5 transition-colors"
                  >
                    ← Anterior
                  </button>
                  <button
                    disabled={!todosDocsCargados}
                    onClick={handleEnviar}
                    className="px-6 py-2 text-sm font-semibold text-primary-foreground bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Enviar Inscripción 
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Confirmación */}
          {enviado && (
            <div className="bg-white rounded-3xl shadow-sm overflow-hidden mb-4">
              <div className="p-10">
                <div className="bg-secondary/10 border-2 border-secondary/30 rounded-2xl p-8 text-center mb-8">
                  <CheckCircle2 className="mx-auto h-12 w-12 text-primary mb-4" />
                  <h3 className="text-3xl font-bold text-primary mb-2">
                    Inscripción Enviada
                  </h3>
                  <p className="text-muted-foreground italic">
                    Tu solicitud ha sido recibida exitosamente. El equipo de la
                    Sección de Deportes y Recreación la revisará y se comunicará
                    contigo pronto.
                  </p>

                  <div className="mt-6 space-y-2 text-left">
                    <div className="p-3 bg-white rounded-lg border border-secondary/20">
                      <p className="text-sm text-slate-700">
                        Datos personales: <strong>{estudiante.nombre || "Registrado"}</strong>
                      </p>
                    </div>
                    <div className="p-3 bg-white rounded-lg border border-secondary/20">
                      <p className="text-sm text-slate-700">
                        Carrera: <strong>{academica.carrera || "Registrada"}</strong>
                      </p>
                    </div>
                    <div className="p-3 bg-white rounded-lg border border-secondary/20">
                      <p className="text-sm text-slate-700">
                        Nivel deportivo: <strong>{generales.nivel_deportivo}</strong>
                      </p>
                    </div>
                    <div className="p-3 bg-white rounded-lg border border-secondary/20">
                      <p className="text-sm text-slate-700">
                        Documentos cargados: <strong>{Object.values(documentos).filter((file) => file !== null).length} / {Object.keys(documentos).length}</strong>
                      </p>
                    </div>
                  </div>
                </div>

                {onVolver && (
                  <div className="text-center">
                    <button
                      onClick={onVolver}
                      className="px-6 py-2 text-sm font-semibold text-primary-foreground bg-primary rounded-lg hover:bg-primary/90 transition-colors"
                    >
                      ← Volver al Inicio
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      )}
    </div>
  );
}

// ─── Acceso Rápido (panel de inicio) ─────────────────────────────────────────

export function InscripcionQuickAccess({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-2 rounded-md border border-white/40 bg-white/10 px-5 py-3 font-semibold text-white backdrop-blur transition hover:bg-white/20"
    >
      Inscripción deportiva
    </button>
  );
}