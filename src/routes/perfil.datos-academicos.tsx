import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { RequireAuth } from "@/components/RequireAuth";
import { EditableField } from "@/components/EditableField";
import { useProfileData } from "@/hooks/use-profile-data";
import { useAuth } from "@/lib/auth";
import {
  GraduationCap,
  School,
  Sun,
  CalendarDays,
  BookOpen,
  Clock,
  Star,
  UserCheck,
  Hash,
} from "lucide-react";

export const Route = createFileRoute("/perfil/datos-academicos")({
  head: () => ({ meta: [{ title: "Datos académicos — UPC" }] }),
  component: () => (
    <RequireAuth>
      <DatosAcademicosPage />
    </RequireAuth>
  ),
});

const DEFAULTS = {
  idEstudiante: "",
  colegio: "",
  jornadaColegio: "",
  anioPromocion: "",
  carrera: "Educación Física, Recreación y Deportes",
  jornadaUni: "",
  promedio: "",
  permanencia: "Activo",
};

function DatosAcademicosPage() {
  const { user } = useAuth();
  const [data, update] = useProfileData("datos-academicos", user?.email, DEFAULTS);

  return (
    <>
      <PageHeader
        title="Datos académicos"
        subtitle="Información sobre tu trayectoria académica y permanencia en la UPC."
      />
      <section className="container mx-auto px-4 py-10">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-soft)]">
          <div className="flex items-center gap-4 border-b border-border pb-5">
            <div className="h-14 w-14 rounded-full bg-accent flex items-center justify-center">
              <GraduationCap className="h-7 w-7 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">{user?.nombre}</h2>
              <p className="text-sm text-muted-foreground">
                Programa de Educación Física, Recreación y Deportes
              </p>
            </div>
          </div>

          <dl className="mt-6 grid gap-4 md:grid-cols-2">
            <EditableField
              icon={Hash}
              label="ID estudiante"
              value={data.idEstudiante}
              onChange={(v) => update("idEstudiante", v)}
            />
            <EditableField
              icon={School}
              label="Colegio egresado"
              value={data.colegio}
              onChange={(v) => update("colegio", v)}
            />
            <EditableField
              icon={Sun}
              label="Jornada del colegio"
              value={data.jornadaColegio}
              onChange={(v) => update("jornadaColegio", v)}
              type="select"
              options={["Mañana", "Tarde", "Jornada única"]}
              hint="Mañana / Tarde / Jornada única"
            />
            <EditableField
              icon={CalendarDays}
              label="Año de promoción"
              value={data.anioPromocion}
              onChange={(v) => update("anioPromocion", v)}
              type="number"
            />
            <EditableField
              icon={BookOpen}
              label="Carrera"
              value={data.carrera}
              onChange={(v) => update("carrera", v)}
            />
            <EditableField
              icon={Clock}
              label="Jornada universitaria"
              value={data.jornadaUni}
              onChange={(v) => update("jornadaUni", v)}
              type="select"
              options={["Mañana", "Tarde", "Única", "Nocturna"]}
              hint="Mañana / Tarde / Única / Nocturna"
            />
            <EditableField
              icon={Star}
              label="Promedio"
              value={data.promedio}
              onChange={(v) => update("promedio", v)}
            />
            <EditableField
              icon={UserCheck}
              label="Permanencia"
              value={data.permanencia}
              onChange={(v) => update("permanencia", v)}
              type="select"
              options={["Activo", "Inactivo", "Suspendido", "Transferido"]}
              hint="Activo / Inactivo / Suspendido / Transferido"
            />
          </dl>
        </div>
      </section>
    </>
  );
}
