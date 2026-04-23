import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { RequireAuth } from "@/components/RequireAuth";
import { EditableField } from "@/components/EditableField";
import { useProfileData } from "@/hooks/use-profile-data";
import { useAuth } from "@/lib/auth";
import {
  Users,
  Hash,
  User,
  MapPin,
  Building2,
  Phone,
  Briefcase,
  FileText,
} from "lucide-react";

export const Route = createFileRoute("/perfil/datos-familiares")({
  head: () => ({ meta: [{ title: "Datos familiares — UPC" }] }),
  component: () => (
    <RequireAuth>
      <DatosFamiliaresPage />
    </RequireAuth>
  ),
});

const DEFAULTS = {
  idEstudiante: "",
  madreNombre: "",
  madreDireccion: "",
  madreCiudad: "",
  madreTelefono: "",
  madreOcupacion: "",
  padreNombre: "",
  padreDireccion: "",
  padreCiudad: "",
  padreTelefono: "",
  padreOcupacion: "",
  observaciones: "",
};

function DatosFamiliaresPage() {
  const { user } = useAuth();
  const [data, update] = useProfileData("datos-familiares", user?.email, DEFAULTS);

  return (
    <>
      <PageHeader
        title="Datos familiares"
        subtitle="Información de contacto y referencia del núcleo familiar del estudiante."
      />
      <section className="container mx-auto px-4 py-10">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-soft)]">
          <div className="flex items-center gap-4 border-b border-border pb-5">
            <div className="h-14 w-14 rounded-full bg-accent flex items-center justify-center">
              <Users className="h-7 w-7 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">{user?.nombre}</h2>
              <p className="text-sm text-muted-foreground">Núcleo familiar</p>
            </div>
          </div>

          <dl className="mt-6 grid gap-4 md:grid-cols-2">
            <EditableField icon={Hash} label="ID estudiante" value={data.idEstudiante} onChange={(v) => update("idEstudiante", v)} fullWidth />

            <EditableField icon={User} label="Nombre de la madre" value={data.madreNombre} onChange={(v) => update("madreNombre", v)} />
            <EditableField icon={MapPin} label="Dirección (madre)" value={data.madreDireccion} onChange={(v) => update("madreDireccion", v)} />
            <EditableField icon={Building2} label="Ciudad de residencia (madre)" value={data.madreCiudad} onChange={(v) => update("madreCiudad", v)} />
            <EditableField icon={Phone} label="Teléfono de la madre" value={data.madreTelefono} onChange={(v) => update("madreTelefono", v)} />
            <EditableField icon={Briefcase} label="Ocupación de la madre" value={data.madreOcupacion} onChange={(v) => update("madreOcupacion", v)} fullWidth />

            <EditableField icon={User} label="Nombre del padre" value={data.padreNombre} onChange={(v) => update("padreNombre", v)} />
            <EditableField icon={MapPin} label="Dirección (padre)" value={data.padreDireccion} onChange={(v) => update("padreDireccion", v)} />
            <EditableField icon={Building2} label="Ciudad de residencia (padre)" value={data.padreCiudad} onChange={(v) => update("padreCiudad", v)} />
            <EditableField icon={Phone} label="Teléfono del padre" value={data.padreTelefono} onChange={(v) => update("padreTelefono", v)} />
            <EditableField icon={Briefcase} label="Ocupación del padre" value={data.padreOcupacion} onChange={(v) => update("padreOcupacion", v)} fullWidth />

            <EditableField
              icon={FileText}
              label="Observaciones"
              value={data.observaciones}
              onChange={(v) => update("observaciones", v)}
              type="textarea"
              maxLength={500}
              fullWidth
            />
          </dl>
        </div>
      </section>
    </>
  );
}
