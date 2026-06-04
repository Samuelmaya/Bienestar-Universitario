import { ReusableModal } from "@/shared/reusable-modal/reusable-modal";
import type { InscripcionItem } from "@/lib/api";

type Props = {
  inscripcion: InscripcionItem;
  onClose: () => void;
};

export function InscripcionDetailModal({ inscripcion, onClose }: Props) {
  return (
    <ReusableModal onClose={onClose} maxWidth="840px">
      <div className="space-y-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold">Detalle de Inscripción</h2>
            <p className="text-sm text-muted-foreground">Información completa del estudiante y su ficha deportiva.</p>
          </div>
          <div className="rounded-2xl bg-secondary/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-secondary">
            {inscripcion.estado}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-3xl border border-border bg-muted p-5">
            <h3 className="text-sm font-semibold">Datos del estudiante</h3>
            <div className="mt-4 space-y-3 text-sm text-foreground">
              <div>
                <span className="font-semibold">Nombre:</span> {inscripcion.nombre}
              </div>
              <div>
                <span className="font-semibold">Documento:</span> {inscripcion.tipo_documento} {inscripcion.documento}
              </div>
              <div>
                <span className="font-semibold">Sexo:</span> {inscripcion.sexo}
              </div>
              <div>
                <span className="font-semibold">Nacimiento:</span> {inscripcion.fecha_nacimiento}
              </div>
              <div>
                <span className="font-semibold">Correo:</span> {inscripcion.email}
              </div>
              <div>
                <span className="font-semibold">Celular:</span> {inscripcion.num_celular}
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-border bg-muted p-5">
            <h3 className="text-sm font-semibold">Ficha deportiva</h3>
            <div className="mt-4 space-y-3 text-sm text-foreground">
              <div>
                <span className="font-semibold">Deporte:</span> {inscripcion.deporte}
              </div>
              <div>
                <span className="font-semibold">Nivel deportivo:</span> {inscripcion.datos_generales.nivel_deportivo}
              </div>
              <div>
                <span className="font-semibold">Torneo:</span> {inscripcion.datos_generales.torneo_participado}
              </div>
              <div>
                <span className="font-semibold">Club:</span> {inscripcion.datos_generales.club_perteneciente}
              </div>
              <div>
                <span className="font-semibold">Fecha de inscripción:</span> {inscripcion.fecha_inscripcion}
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <section className="rounded-3xl border border-border bg-muted p-5">
            <h3 className="text-sm font-semibold">Datos académicos</h3>
            <dl className="mt-4 space-y-3 text-sm text-foreground">
              <div>
                <dt className="font-semibold">Colegio</dt>
                <dd>{inscripcion.datos_academicos.nom_colegio}</dd>
              </div>
              <div>
                <dt className="font-semibold">Jornada colegio</dt>
                <dd>{inscripcion.datos_academicos.jornada_colegio}</dd>
              </div>
              <div>
                <dt className="font-semibold">Año de promoción</dt>
                <dd>{inscripcion.datos_academicos.anio_promocion}</dd>
              </div>
              <div>
                <dt className="font-semibold">Carrera</dt>
                <dd>{inscripcion.datos_academicos.carrera}</dd>
              </div>
              <div>
                <dt className="font-semibold">Promedio</dt>
                <dd>{inscripcion.datos_academicos.promedio.toFixed(2)}</dd>
              </div>
            </dl>
          </section>

          <section className="rounded-3xl border border-border bg-muted p-5">
            <h3 className="text-sm font-semibold">Datos generales</h3>
            <dl className="mt-4 space-y-3 text-sm text-foreground">
              <div>
                <dt className="font-semibold">Peso / estatura</dt>
                <dd>{inscripcion.datos_generales.peso} kg / {inscripcion.datos_generales.estatura} cm</dd>
              </div>
              <div>
                <dt className="font-semibold">EPS</dt>
                <dd>{inscripcion.datos_generales.eps}</dd>
              </div>
              <div>
                <dt className="font-semibold">RH</dt>
                <dd>{inscripcion.datos_generales.rh}</dd>
              </div>
              <div>
                <dt className="font-semibold">Trabaja</dt>
                <dd>{inscripcion.datos_generales.trabaja_estudiante ? "Sí" : "No"}</dd>
              </div>
              {inscripcion.datos_generales.trabaja_estudiante && (
                <>
                  <div>
                    <dt className="font-semibold">Lugar de trabajo</dt>
                    <dd>{inscripcion.datos_generales.lugar_trabajo}</dd>
                  </div>
                  <div>
                    <dt className="font-semibold">Cargo</dt>
                    <dd>{inscripcion.datos_generales.cargo_de_trabajo}</dd>
                  </div>
                </>
              )}
            </dl>
          </section>

          <section className="rounded-3xl border border-border bg-muted p-5">
            <h3 className="text-sm font-semibold">Familiares</h3>
            <dl className="mt-4 space-y-3 text-sm text-foreground">
              <div>
                <dt className="font-semibold">Madre</dt>
                <dd>{inscripcion.datos_familiares.nom_madre} · {inscripcion.datos_familiares.cel_madre}</dd>
              </div>
              <div>
                <dt className="font-semibold">Padre</dt>
                <dd>{inscripcion.datos_familiares.nom_padre} · {inscripcion.datos_familiares.cel_padre}</dd>
              </div>
              <div>
                <dt className="font-semibold">Observaciones</dt>
                <dd>{inscripcion.datos_familiares.observaciones || "Ninguna"}</dd>
              </div>
            </dl>
          </section>
        </div>

        <section className="rounded-3xl border border-border bg-muted p-5">
          <h3 className="text-sm font-semibold">Documentos enviados</h3>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {Object.entries(inscripcion.documentos).map(([label, value]) => (
              <div key={label} className="rounded-2xl bg-white/80 p-3 text-sm">
                <p className="font-semibold capitalize">{label.replaceAll("_", " ")}</p>
                <p className="mt-1 text-muted-foreground">{value || "No cargado"}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-2xl bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
          >
            Cerrar
          </button>
        </div>
      </div>
    </ReusableModal>
  );
}
