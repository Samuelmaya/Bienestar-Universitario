import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { RequireAuth } from "@/components/RequireAuth";
import { EditableField } from "@/components/EditableField";
import { useProfileData } from "@/hooks/use-profile-data";
import { useAuth } from "@/lib/auth";
import { Stethoscope, UserRound, ClipboardList, HeartPulse } from "lucide-react";

export const Route = createFileRoute("/perfil/valoracion-medica")({
  head: () => ({ meta: [{ title: "Control de valoración médica — UPC" }] }),
  component: () => (
    <RequireAuth>
      <ValoracionMedicaPage />
    </RequireAuth>
  ),
});

const DEFAULTS = {
  especialista: "",
  profesional: "",
  observaciones:
    "Presenta un esguince en el tobillo derecho de grado leve. Se recomienda reposo deportivo por 10 días, aplicación de hielo local 3 veces al día y revaloración con el fisioterapeuta al finalizar el periodo indicado.",
};

function ValoracionMedicaPage() {
  const { user } = useAuth();
  const [data, update] = useProfileData("valoracion-medica", user?.email, DEFAULTS);

  return (
    <>
      <PageHeader
        title="Control de valoración médica"
        subtitle="Seguimiento de las valoraciones médicas y deportivas del estudiante."
      />
      <section className="container mx-auto px-4 py-10">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-soft)]">
          <div className="flex items-center gap-4 border-b border-border pb-5">
            <div className="h-14 w-14 rounded-full bg-accent flex items-center justify-center">
              <HeartPulse className="h-7 w-7 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">{user?.nombre}</h2>
              <p className="text-sm text-muted-foreground">Historial de valoración médica</p>
            </div>
          </div>

          <dl className="mt-6 grid gap-4 md:grid-cols-2">
            <EditableField
              icon={Stethoscope}
              label="Especialista"
              value={data.especialista}
              onChange={(v) => update("especialista", v)}
              type="select"
              options={["Medicina deportiva", "Ortopedia", "Fisioterapia", "Medicina general", "Cardiología"]}
              hint="Especialidad médica que realiza la valoración."
            />
            <EditableField
              icon={UserRound}
              label="Profesional que lo atendió"
              value={data.profesional}
              onChange={(v) => update("profesional", v)}
              hint="Nombre del médico o profesional de la salud responsable."
            />
            <EditableField
              icon={ClipboardList}
              label="Observaciones"
              value={data.observaciones}
              onChange={(v) => update("observaciones", v)}
              type="textarea"
              maxLength={500}
              hint="Texto de hasta 500 caracteres con el detalle clínico de la valoración."
              fullWidth
            />
          </dl>
        </div>
      </section>
    </>
  );
}
