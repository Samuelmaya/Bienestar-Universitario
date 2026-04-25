import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { UserPlus, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/registro")({
  head: () => ({ meta: [{ title: "Registro de estudiantes — UPC" }] }),
  component: RegistroPage,
});

function RegistroPage() {
  const [ok, setOk] = useState(false);

  return (
    <>
      <PageHeader
        title="Registro de Nuevos Estudiantes"
        subtitle="Registro al programa de Educación Física, Recreación y Deportes de la UPC."
      />
      <section className="container mx-auto px-4 py-10 grid lg:grid-cols-3 gap-8">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setOk(true);
          }}
          className="lg:col-span-2 rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-soft)]"
        >
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-primary" /> Datos del estudiante
          </h2>

          <div className="mt-4 rounded-lg bg-accent/60 px-4 py-3 text-sm">
            <p className="font-medium text-foreground">Programa dirigido</p>
            <p className="text-muted-foreground">
              Licenciatura En Educación Física, Recreación y Deportes — Universidad Popular del Cesar.
            </p>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <Field label="Nombre" />
            <SelectField
              label="Tipo de documento"
              options={[
                { value: "CC", label: "CC — Cédula de Ciudadanía" },
                { value: "TI", label: "TI — Tarjeta de Identidad" },
                { value: "RC", label: "RC — Registro Civil" },
                { value: "CE", label: "CE — Cédula de Extranjería" },
              ]}
            />
            <Field label="Número de documento" />
            <Field label="Fecha de nacimiento" type="date" />
            <SelectField
              label="Sexo"
              options={[
                { value: "M", label: "M — Masculino" },
                { value: "F", label: "F — Femenino" },
                { value: "Otros", label: "Otros..." },
              ]}
            />
            <Field label="Lugar de nacimiento" />
            <SelectField
              label="Estado civil"
              options={[
                { value: "soltero", label: "Soltero/a" },
                { value: "casado", label: "Casado/a" },
                { value: "union_libre", label: "Unión libre" },
                { value: "viudo", label: "Viudo/a" },
              ]}
            />
            <Field label="Teléfono" type="tel" />
            <div className="md:col-span-2">
              <Field label="Dirección de residencia" />
            </div>
            <Field label="Barrio" />
            <SelectField
              label="Tipo de estudiante"
              options={[
                { value: "interno", label: "Interno" },
                { value: "externo", label: "Externo" },
                { value: "hijo_funcionario", label: "Hijo de funcionario" },
              ]}
            />
            <div className="md:col-span-2">
              <Field label="Correo institucional" type="email" />
            </div>
            <label className="md:col-span-2 flex items-start gap-2 text-sm">
              <input type="checkbox" required className="mt-1" />
              Acepto el reglamento deportivo de la Universidad Popular del Cesar y autorizo el
              tratamiento de mis datos personales.
            </label>
          </div>

          <div className="mt-6 flex justify-end">
            <button className="rounded-md bg-primary px-5 py-2.5 font-semibold text-primary-foreground shadow-[var(--shadow-soft)] hover:opacity-90">
              Enviar registro
            </button>
          </div>

          {ok && (
            <div className="mt-5 flex items-center gap-2 rounded-lg bg-secondary/15 text-secondary px-4 py-3 text-sm">
              <CheckCircle2 className="h-4 w-4" /> Registro enviado. Te contactaremos pronto.
            </div>
          )}
        </form>

        <aside className="space-y-4">
          <div className="rounded-2xl bg-[image:var(--gradient-primary)] text-primary-foreground p-6">
            <h3 className="font-semibold text-lg">Beneficios</h3>
            <ul className="mt-3 space-y-2 text-sm opacity-95 list-disc list-inside">
              <li>Acceso a entrenamientos guiados</li>
              <li>Préstamo de implementos deportivos</li>
              <li>Participación en torneos universitarios</li>
              <li>Carnet deportivo institucional</li>
            </ul>
          </div>
          <div className="rounded-2xl border border-border bg-card p-6 text-sm">
            <p className="font-semibold">Requisitos</p>
            <ul className="mt-2 space-y-1 text-muted-foreground list-disc list-inside">
              <li>Estar matriculado en el periodo vigente</li>
              <li>Certificado médico actualizado</li>
              <li>Foto carnet reciente</li>
            </ul>
          </div>
        </aside>
      </section>
    </>
  );
}

function Field({ label, ...props }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label className="text-sm font-medium">{label}</label>
      <input
        {...props}
        required
        className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
      />
    </div>
  );
}

function SelectField({
  label,
  options,
}: {
  label: string;
  options: { value: string; label: string }[];
}) {
  return (
    <div>
      <label className="text-sm font-medium">{label}</label>
      <select
        required
        defaultValue=""
        className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
      >
        <option value="" disabled>
          Seleccione…
        </option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
