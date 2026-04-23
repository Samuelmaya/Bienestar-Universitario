import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { RequireAuth } from "@/components/RequireAuth";
import { EditableField } from "@/components/EditableField";
import { useProfileData } from "@/hooks/use-profile-data";
import { useAuth } from "@/lib/auth";
import { User, Mail, Phone, MapPin, IdCard, CalendarDays } from "lucide-react";

export const Route = createFileRoute("/perfil/datos-personales")({
  head: () => ({ meta: [{ title: "Datos personales — UPC" }] }),
  component: () => (
    <RequireAuth>
      <DatosPersonalesPage />
    </RequireAuth>
  ),
});

const DEFAULTS = {
  nombre: "",
  tipoDoc: "CC",
  numeroDoc: "1.000.000.000",
  fechaNac: "2000-01-01",
  sexo: "",
  lugarNac: "Valledupar, Cesar",
  estadoCivil: "Soltero/a",
  direccion: "",
  barrio: "",
  telefono: "",
  email: "",
};

function DatosPersonalesPage() {
  const { user } = useAuth();
  const [data, update] = useProfileData("datos-personales", user?.email, {
    ...DEFAULTS,
    nombre: user?.nombre ?? "",
    email: user?.email ?? "",
  });

  return (
    <>
      <PageHeader
        title="Datos personales"
        subtitle="Información básica de identificación y contacto del estudiante."
      />
      <section className="container mx-auto px-4 py-10">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-soft)]">
          <div className="flex items-center gap-4 border-b border-border pb-5">
            <div className="h-16 w-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold">
              {(data.nombre || user?.nombre || "U").charAt(0)}
            </div>
            <div>
              <h2 className="text-xl font-semibold">{data.nombre || user?.nombre}</h2>
              <p className="text-sm text-muted-foreground capitalize">{user?.role}</p>
            </div>
          </div>

          <dl className="mt-6 grid gap-4 md:grid-cols-2">
            <EditableField
              icon={User}
              label="Nombre completo"
              value={data.nombre}
              onChange={(v) => update("nombre", v)}
            />
            <EditableField
              icon={IdCard}
              label="Tipo de documento"
              value={data.tipoDoc}
              onChange={(v) => update("tipoDoc", v)}
              type="select"
              options={["CC", "TI", "CE", "Pasaporte"]}
            />
            <EditableField
              icon={IdCard}
              label="Número de documento"
              value={data.numeroDoc}
              onChange={(v) => update("numeroDoc", v)}
            />
            <EditableField
              icon={CalendarDays}
              label="Fecha de nacimiento"
              value={data.fechaNac}
              onChange={(v) => update("fechaNac", v)}
              type="date"
            />
            <EditableField
              icon={User}
              label="Sexo"
              value={data.sexo}
              onChange={(v) => update("sexo", v)}
              type="select"
              options={["Femenino", "Masculino", "Otro", "Prefiero no decirlo"]}
            />
            <EditableField
              icon={MapPin}
              label="Lugar de nacimiento"
              value={data.lugarNac}
              onChange={(v) => update("lugarNac", v)}
            />
            <EditableField
              icon={User}
              label="Estado civil"
              value={data.estadoCivil}
              onChange={(v) => update("estadoCivil", v)}
              type="select"
              options={["Soltero/a", "Casado/a", "Unión libre", "Divorciado/a", "Viudo/a"]}
            />
            <EditableField
              icon={MapPin}
              label="Dirección de residencia"
              value={data.direccion}
              onChange={(v) => update("direccion", v)}
            />
            <EditableField
              icon={MapPin}
              label="Barrio"
              value={data.barrio}
              onChange={(v) => update("barrio", v)}
            />
            <EditableField
              icon={Phone}
              label="Teléfono"
              value={data.telefono}
              onChange={(v) => update("telefono", v)}
            />
            <EditableField
              icon={Mail}
              label="Correo institucional"
              value={data.email}
              onChange={(v) => update("email", v)}
              fullWidth
            />
          </dl>
        </div>
      </section>
    </>
  );
}
