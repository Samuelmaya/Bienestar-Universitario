import { useEffect, useState } from "react";
import { AlertCircle, ClipboardList, Loader2, Users } from "lucide-react";
import { InscripcionCard } from "./InscripcionCard";
import { InscripcionDetailModal } from "./InscripcionDetailModal";
import { inscripcionesApi, type InscripcionItem } from "@/lib/api";

const sampleInscripciones: InscripcionItem[] = [
  {
    id_inscripcion: 1,
    nombre: "María Gómez",
    tipo_documento: "CC",
    documento: "1023456789",
    sexo: "F",
    fecha_nacimiento: "2003-09-18",
    lugar_nacimiento: "Valledupar",
    estado_civil: "SOLTERO",
    direccion_residencial: "Carrera 10 #24-56",
    barrio: "San Jorge",
    num_celular: "3007654321",
    email: "maria.gomez@correo.com",
    deporte: "Vóley playa",
    fecha_inscripcion: "2026-05-22",
    estado: "PENDIENTE",
    datos_academicos: {
      nom_colegio: "Instituto Técnico Valledupar",
      jornada_colegio: "MAÑANA",
      anio_promocion: 2021,
      carrera: "Administración Deportiva",
      jornada_uni: "TARDE",
      promedio: 4.2,
      permanencia: "ACTIVO",
    },
    datos_generales: {
      nivel_deportivo: "REGIONAL",
      torneo_participado: "Copa Caribe 2025",
      club_perteneciente: "Club Atlético Caribe",
      peso: 64,
      estatura: 173,
      enfermedad_padecida: "Ninguna",
      eps: "Sura",
      rh: "O+",
      trabaja_estudiante: false,
      lugar_trabajo: "",
      cargo_de_trabajo: "",
    },
    datos_familiares: {
      nom_madre: "Gloria Parra",
      dir_madre: "Calle 12 #3-45",
      ciudad_madre: "Valledupar",
      cel_madre: "3151234567",
      ocup_madre: "Docente",
      nom_padre: "Carlos Gómez",
      dir_padre: "Calle 12 #3-45",
      ciudad_padre: "Valledupar",
      cel_padre: "3139876543",
      ocup_padre: "Contador",
      observaciones: "Necesita acompañamiento para actividades físicas tempranas.",
    },
    documentos: {
      horario: "horario_clases.pdf",
      cedula: "cedula_frontal.pdf",
      valoracion_medica: "valoracion_medica.pdf",
      valoracion_odontologica: "valoracion_odontologica.pdf",
      valoracion_psicologica: "valoracion_psicologica.pdf",
      foto_3x4: "foto_3x4.jpg",
    },
  },
  {
    id_inscripcion: 2,
    nombre: "Daniel Ramírez",
    tipo_documento: "TI",
    documento: "1133224455",
    sexo: "M",
    fecha_nacimiento: "2004-02-05",
    lugar_nacimiento: "Valledupar",
    estado_civil: "SOLTERO",
    direccion_residencial: "Transversal 5 #33-20",
    barrio: "Los Cortijos",
    num_celular: "3122547890",
    email: "daniel.ramirez@correo.com",
    deporte: "Baloncesto",
    fecha_inscripcion: "2026-05-30",
    estado: "APROBADA",
    datos_academicos: {
      nom_colegio: "Colegio San José",
      jornada_colegio: "TARDE",
      anio_promocion: 2022,
      carrera: "Psicología Deportiva",
      jornada_uni: "MAÑANA",
      promedio: 3.8,
      permanencia: "ACTIVO",
    },
    datos_generales: {
      nivel_deportivo: "LOCAL",
      torneo_participado: "Torneo Intercolegiado 2024",
      club_perteneciente: "Academia Norte",
      peso: 78,
      estatura: 184,
      enfermedad_padecida: "Asma controlada",
      eps: "Comfenalco",
      rh: "A-",
      trabaja_estudiante: true,
      lugar_trabajo: "Gimnasio Central",
      cargo_de_trabajo: "Auxiliar administrativo",
    },
    datos_familiares: {
      nom_madre: "Sandra Ramírez",
      dir_madre: "Transversal 5 #33-20",
      ciudad_madre: "Valledupar",
      cel_madre: "3108765432",
      ocup_madre: "Enfermera",
      nom_padre: "Jorge Ramírez",
      dir_padre: "Transversal 5 #33-20",
      ciudad_padre: "Valledupar",
      cel_padre: "3112345678",
      ocup_padre: "Transportador",
      observaciones: "Requiere revisión de disponibilidad de horarios para entrenamiento.",
    },
    documentos: {
      horario: "horario_clases_daniel.pdf",
      cedula: "ti_daniel.pdf",
      valoracion_medica: "valoracion_medica_daniel.pdf",
      valoracion_odontologica: "valoracion_odontologica_daniel.pdf",
      valoracion_psicologica: "valoracion_psicologica_daniel.pdf",
      foto_3x4: "foto_daniel.jpg",
    },
  },
];

import { listarPerfiles, obtenerFichaEstudiante } from "@/shared/services/student.service";
import type { StudentProfile } from "@/shared/dtos/student.dto";

function mapProfileToInscripcionItem(profile: StudentProfile): InscripcionItem {
  const est = profile.estudiante;
  const acad = profile.informacion_academica;
  const gen = profile.datos_generales;
  const fam = profile.datos_familiares;
  const insc = profile.inscripcion;

  const docMap: Record<string, string> = {
    horario: "",
    cedula: "",
    valoracion_medica: "",
    valoracion_odontologica: "",
    valoracion_psicologica: "",
    foto_3x4: "",
  };

  if (Array.isArray(profile.documentos)) {
    profile.documentos.forEach((d) => {
      const downloadUrl = d.download_url || d.url_archivo || "";
      if (d.tipo_documento === "HORARIO_CLASES") docMap.horario = downloadUrl;
      if (d.tipo_documento === "DOCUMENTO_IDENTIDAD") docMap.cedula = downloadUrl;
      if (d.tipo_documento === "VALORACION_MEDICA") docMap.valoracion_medica = downloadUrl;
      if (d.tipo_documento === "VALORACION_ODONTOLOGICA") docMap.valoracion_odontologica = downloadUrl;
      if (d.tipo_documento === "VALORACION_PSICOLOGICA") docMap.valoracion_psicologica = downloadUrl;
      if (d.tipo_documento === "FOTO_ESTUDIANTE") docMap.foto_3x4 = downloadUrl;
    });
  }

  return {
    id_inscripcion: insc?.id_inscripcion ?? est.id_estudiante,
    nombre: est.nombre,
    tipo_documento: est.tipo_documento,
    documento: String(est.id_estudiante),
    sexo: est.sexo,
    fecha_nacimiento: est.fecha_nacimiento,
    lugar_nacimiento: est.lugar_nacimiento ?? "",
    estado_civil: est.estado_civil ?? "SOLTERO",
    direccion_residencial: est.direccion_residencial ?? "",
    barrio: est.barrio ?? "",
    num_celular: est.num_celular ?? "",
    email: est.email ?? "",
    deporte: insc?.nombre_deporte ?? "Sin asignar",
    fecha_inscripcion: insc?.fecha ?? new Date().toISOString().split("T")[0],
    estado: insc?.estado ?? "PENDIENTE",
    datos_academicos: {
      nom_colegio: acad.nom_colegio ?? "",
      jornada_colegio: acad.jornada_colegio ?? "MAÑANA",
      anio_promocion: acad.anio_promocion ?? 0,
      carrera: acad.carrera ?? "",
      jornada_uni: acad.jornada_uni ?? "MAÑANA",
      promedio: acad.promedio ?? 0,
      permanencia: acad.permanencia ?? "ACTIVO",
    },
    datos_generales: {
      nivel_deportivo: gen.nivel_deportivo ?? "NINGUNO",
      torneo_participado: gen.torneo_participado ?? "",
      club_perteneciente: gen.club_perteneciente ?? "",
      peso: gen.peso ?? 0,
      estatura: gen.estatura ?? 0,
      enfermedad_padecida: gen.enfermedad_padecida ?? "",
      eps: gen.eps ?? "",
      rh: gen.rh ?? "O+",
      trabaja_estudiante: !!gen.trabaja_estudiante,
      lugar_trabajo: gen.lugar_trabajo ?? "",
      cargo_de_trabajo: gen.cargo_de_trabajo ?? "",
    },
    datos_familiares: {
      nom_madre: fam.nom_madre ?? "",
      dir_madre: fam.dir_madre ?? "",
      ciudad_madre: fam.ciudad_madre ?? "",
      cel_madre: String(fam.cel_madre ?? ""),
      ocup_madre: fam.ocup_madre ?? "",
      nom_padre: fam.nom_padre ?? "",
      dir_padre: fam.dir_padre ?? "",
      ciudad_padre: fam.ciudad_padre ?? "",
      cel_padre: String(fam.cel_padre ?? ""),
      ocup_padre: fam.ocup_padre ?? "",
      observaciones: fam.observaciones ?? "",
    },
    documentos: docMap as any,
  };
}

export function InscripcionesGeneral() {
  const [inscripciones, setInscripciones] = useState<InscripcionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedInscripcion, setSelectedInscripcion] = useState<InscripcionItem | null>(null);
  const [triggerElement, setTriggerElement] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setLoading(true);
    listarPerfiles()
      .then(async (basicList) => {
        try {
          const details = await Promise.all(
            basicList.map(async (basic) => {
              try {
                const profile = await obtenerFichaEstudiante(basic.id_estudiante);
                return mapProfileToInscripcionItem(profile);
              } catch (err) {
                console.error(`Error al obtener ficha de ${basic.id_estudiante}:`, err);
                return null;
              }
            })
          );
          const valid = details.filter((d): d is InscripcionItem => d !== null);
          setInscripciones(valid.length > 0 ? valid : sampleInscripciones);
          if (valid.length === 0) {
            setError("No se encontraron inscripciones reales. Se muestran registros de ejemplo.");
          } else {
            setError("");
          }
        } catch (err: any) {
          setInscripciones(sampleInscripciones);
          setError(`Error al procesar perfiles: ${err.message || err}`);
        }
      })
      .catch((err) => {
        setInscripciones(sampleInscripciones);
        setError(
          err instanceof Error
            ? `No se pudieron cargar las inscripciones reales: ${err.message}. Mostrando datos de ejemplo.`
            : "No se pudieron cargar las inscripciones reales. Mostrando datos de ejemplo.",
        );
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Inscripciones de estudiantes</h1>
          <p className="text-sm text-muted-foreground">Revisa las inscripciones y abre el detalle de cada estudiante.</p>
        </div>
        <div className="inline-flex items-center gap-2 rounded-2xl bg-secondary/10 px-4 py-2 text-sm font-semibold text-secondary">
          <Users className="h-4 w-4" /> {inscripciones.length} inscripciones
        </div>
      </div>

      {error && (
        <div className="mb-6 flex items-center gap-2 rounded-2xl border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive">
          <AlertCircle className="h-5 w-5" />
          <span>{error}</span>
        </div>
      )}

      {loading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}

      {!loading && inscripciones.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center text-muted-foreground">
          <ClipboardList className="h-12 w-12 mb-4" />
          <p className="text-lg font-semibold">No hay inscripciones registradas</p>
          <p className="text-sm">Todavía no se ha recibido ninguna inscripción de estudiante.</p>
        </div>
      )}

      {!loading && inscripciones.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {inscripciones.map((inscripcion) => (
            <InscripcionCard
              key={inscripcion.id_inscripcion}
              inscripcion={inscripcion}
              onDetalle={(e) => {
                setTriggerElement(e.currentTarget);
                setSelectedInscripcion(inscripcion);
              }}
            />
          ))}
        </div>
      )}

      {selectedInscripcion && (
        <InscripcionDetailModal
          inscripcion={selectedInscripcion}
          triggerElement={triggerElement}
          onClose={() => {
            setSelectedInscripcion(null);
            setTriggerElement(null);
          }}
        />
      )}
    </div>
  );
}
