import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { RequireAuth } from "@/components/RequireAuth";
import { UserPlus, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/usuarios/crear")({
  head: () => ({ meta: [{ title: "Crear usuario — UPC" }] }),
  component: () => (
    <RequireAuth roles={["admin"]}>
      <CrearUsuarioPage />
    </RequireAuth>
  ),
});

function CrearUsuarioPage() {
  const [done, setDone] = useState(false);
  const [form, setForm] = useState({
    primer_nombre: "",
    segundo_nombre: "",
    primer_apellido: "",
    segundo_apellido: "",
    email: "",
    contrasena: "",
    role_id: 0,
    activo: true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.primer_nombre && form.primer_apellido && form.email && form.contrasena) {
      setDone(true);
    }
  };

  return (
    <>
      <PageHeader
        title="Crear Usuario"
        subtitle="Registra un nuevo usuario en el sistema."
      />

      <section className="container mx-auto px-4 py-10 grid gap-8 lg:grid-cols-3">
        <form
          onSubmit={handleSubmit}
          className="lg:col-span-2 rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-soft)]"
        >
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-primary" /> Datos del usuario
          </h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium">Primer Nombre</label>
              <input
                type="text"
                required
                value={form.primer_nombre}
                onChange={(e) => setForm({ ...form, primer_nombre: e.target.value })}
                placeholder="Ingresa el primer nombre"
                className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Segundo Nombre</label>
              <input
                type="text"
                value={form.segundo_nombre}
                onChange={(e) => setForm({ ...form, segundo_nombre: e.target.value })}
                placeholder="Ingresa el segundo nombre (opcional)"
                className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Primer Apellido</label>
              <input
                type="text"
                required
                value={form.primer_apellido}
                onChange={(e) => setForm({ ...form, primer_apellido: e.target.value })}
                placeholder="Ingresa el primer apellido"
                className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Segundo Apellido</label>
              <input
                type="text"
                value={form.segundo_apellido}
                onChange={(e) => setForm({ ...form, segundo_apellido: e.target.value })}
                placeholder="Ingresa el segundo apellido (opcional)"
                className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-sm font-medium">Email</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="correo@ejemplo.com"
                className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-sm font-medium">Contraseña</label>
              <input
                type="password"
                required
                value={form.contrasena}
                onChange={(e) => setForm({ ...form, contrasena: e.target.value })}
                placeholder="Ingresa una contraseña segura"
                className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Rol</label>
              <select
                value={form.role_id}
                onChange={(e) => setForm({ ...form, role_id: parseInt(e.target.value) })}
                className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
              >
                <option value={0}>Administrador</option>
                <option value={1}>Estudiante</option>
                <option value={2}>Profesor</option>
                <option value={3}>Personal</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium">Estado</label>
              <div className="mt-2 flex items-center gap-2">
                <input
                  type="checkbox"
                  id="activo"
                  checked={form.activo}
                  onChange={(e) => setForm({ ...form, activo: e.target.checked })}
                  className="rounded border border-input"
                />
                <label htmlFor="activo" className="text-sm text-foreground">
                  Usuario activo
                </label>
              </div>
            </div>

            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={!form.primer_nombre || !form.primer_apellido || !form.email || !form.contrasena}
                className="w-full inline-flex items-center justify-center gap-2 rounded-md bg-primary py-2.5 font-semibold text-primary-foreground shadow-[var(--shadow-soft)] hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <UserPlus className="h-4 w-4" /> Crear usuario
              </button>
            </div>
          </div>
        </form>

        <div className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-soft)]">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-primary" /> Confirmación
          </h2>
          {done ? (
            <div className="mt-4 rounded-lg bg-secondary/15 p-4 text-center">
              <CheckCircle2 className="mx-auto h-10 w-10 text-secondary" />
              <p className="mt-2 font-semibold">Usuario creado exitosamente</p>
              <p className="text-sm text-muted-foreground">
                {form.primer_nombre} {form.primer_apellido}
              </p>
              <p className="text-sm text-muted-foreground">{form.email}</p>
              <p className="text-sm text-muted-foreground">
                Rol: {form.role_id === 0 ? "Administrador" : form.role_id === 1 ? "Estudiante" : form.role_id === 2 ? "Profesor" : "Personal"}
              </p>
              <p className="text-sm text-muted-foreground">
                Estado: {form.activo ? "Activo" : "Inactivo"}
              </p>
              <button
                onClick={() => {
                  setDone(false);
                  setForm({
                    primer_nombre: "",
                    segundo_nombre: "",
                    primer_apellido: "",
                    segundo_apellido: "",
                    email: "",
                    contrasena: "",
                    role_id: 0,
                    activo: true,
                  });
                }}
                className="mt-3 text-sm text-primary hover:underline"
              >
                Crear otro usuario
              </button>
            </div>
          ) : (
            <p className="mt-4 text-sm text-muted-foreground">
              Completa el formulario para crear un nuevo usuario en el sistema.
            </p>
          )}
        </div>
      </section>
    </>
  );
}
