import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { RequireAuth } from "@/components/RequireAuth";
import { Edit, Search, User, CheckCircle2, AlertCircle } from "lucide-react";

export const Route = createFileRoute("/usuarios/actualizar")({
  head: () => ({ meta: [{ title: "Actualizar usuario — UPC" }] }),
  component: () => (
    <RequireAuth roles={["admin"]}>
      <ActualizarUsuarioPage />
    </RequireAuth>
  ),
});

// Datos de ejemplo
const usuariosEjemplo = [
  {
    id: 1,
    primer_nombre: "Juan",
    segundo_nombre: "Carlos",
    primer_apellido: "Pérez",
    segundo_apellido: "García",
    email: "juan.perez@upc.edu.co",
    role_id: 1,
    activo: true,
    creando_en: "2026-04-26T01:47:38.225Z",
  },
  {
    id: 2,
    primer_nombre: "María",
    segundo_nombre: "Fernanda",
    primer_apellido: "López",
    segundo_apellido: "Martínez",
    email: "maria.lopez@upc.edu.co",
    role_id: 2,
    activo: true,
    creando_en: "2026-04-26T01:54:38.970Z",
  },
  {
    id: 3,
    primer_nombre: "Carlos",
    segundo_nombre: "",
    primer_apellido: "Rodríguez",
    segundo_apellido: "Sánchez",
    email: "carlos.rodriguez@upc.edu.co",
    role_id: 0,
    activo: false,
    creando_en: "2026-04-25T15:30:12.456Z",
  },
];

function ActualizarUsuarioPage() {
  const [searchId, setSearchId] = useState("");
  const [foundUser, setFoundUser] = useState<typeof usuariosEjemplo[0] | null>(null);
  const [searchError, setSearchError] = useState("");
  const [updated, setUpdated] = useState(false);
  const [form, setForm] = useState({
    primer_nombre: "",
    segundo_nombre: "",
    primer_apellido: "",
    segundo_apellido: "",
    email: "",
    role_id: 0,
    activo: true,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchError("");
    setFoundUser(null);
    setUpdated(false);

    if (!searchId.trim()) {
      setSearchError("Por favor ingresa un ID de usuario");
      return;
    }

    const userId = parseInt(searchId);
    const user = usuariosEjemplo.find((u) => u.id === userId);

    if (user) {
      setFoundUser(user);
      setForm({
        primer_nombre: user.primer_nombre,
        segundo_nombre: user.segundo_nombre,
        primer_apellido: user.primer_apellido,
        segundo_apellido: user.segundo_apellido,
        email: user.email,
        role_id: user.role_id,
        activo: user.activo,
      });
    } else {
      setSearchError(`No se encontró ningún usuario con ID: ${searchId}`);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (foundUser && form.primer_nombre && form.primer_apellido && form.email) {
      // Aquí iría la lógica para actualizar el usuario
      setUpdated(true);
    }
  };

  const getRoleName = (roleId: number) => {
    switch (roleId) {
      case 0: return "Administrador";
      case 1: return "Estudiante";
      case 2: return "Profesor";
      case 3: return "Personal";
      default: return "Desconocido";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("es-CO", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <>
      <PageHeader
        title="Actualizar Usuario"
        subtitle="Busca y actualiza la información de los usuarios existentes."
      />

      <section className="container mx-auto px-4 py-10">
        {/* Búsqueda de usuario */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-soft)] mb-8">
          <h2 className="text-xl font-semibold flex items-center gap-2 mb-6">
            <Search className="h-5 w-5 text-primary" /> Buscar usuario a actualizar
          </h2>
          <form onSubmit={handleSearch} className="flex gap-4">
            <input
              type="number"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              placeholder="Ingresa el ID del usuario"
              className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-6 py-2 font-semibold text-primary-foreground shadow-[var(--shadow-soft)] hover:opacity-90"
            >
              <Search className="h-4 w-4" /> Buscar
            </button>
          </form>

          {/* Mensaje de error */}
          {searchError && (
            <div className="mt-4 rounded-lg bg-destructive/15 p-4 flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-destructive" />
              <p className="text-sm text-destructive">{searchError}</p>
            </div>
          )}

          {/* Usuario encontrado y formulario de actualización */}
          {foundUser && !updated && (
            <div className="mt-6">
              <div className="rounded-lg border border-border p-4 mb-6">
                <div className="flex items-center gap-3">
                  <User className="h-8 w-8 text-primary" />
                  <div>
                    <h3 className="font-semibold text-lg">
                      {foundUser.primer_nombre} {foundUser.segundo_nombre} {foundUser.primer_apellido} {foundUser.segundo_apellido}
                    </h3>
                    <p className="text-sm text-muted-foreground">ID: {foundUser.id} • Creado: {formatDate(foundUser.creando_en)}</p>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Edit className="h-5 w-5 text-primary" /> Editar información
                </h3>
                
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="text-sm font-medium">Primer Nombre</label>
                    <input
                      type="text"
                      required
                      value={form.primer_nombre}
                      onChange={(e) => setForm({ ...form, primer_nombre: e.target.value })}
                      className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">Segundo Nombre</label>
                    <input
                      type="text"
                      value={form.segundo_nombre}
                      onChange={(e) => setForm({ ...form, segundo_nombre: e.target.value })}
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
                      className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">Segundo Apellido</label>
                    <input
                      type="text"
                      value={form.segundo_apellido}
                      onChange={(e) => setForm({ ...form, segundo_apellido: e.target.value })}
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
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={!form.primer_nombre || !form.primer_apellido || !form.email}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-md bg-primary py-2.5 font-semibold text-primary-foreground shadow-[var(--shadow-soft)] hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Edit className="h-4 w-4" /> Actualizar usuario
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Confirmación de actualización */}
          {updated && foundUser && (
            <div className="mt-6 rounded-lg bg-green-50 border border-green-200 p-6 text-center">
              <CheckCircle2 className="mx-auto h-12 w-12 text-green-600 mb-4" />
              <h3 className="font-semibold text-green-800 text-lg mb-2">Usuario actualizado exitosamente</h3>
              <div className="text-left text-sm text-green-700 mb-4 max-w-md mx-auto">
                <p><strong>Nombre:</strong> {form.primer_nombre} {form.segundo_nombre} {form.primer_apellido} {form.segundo_apellido}</p>
                <p><strong>Email:</strong> {form.email}</p>
                <p><strong>Rol:</strong> {getRoleName(form.role_id)}</p>
                <p><strong>Estado:</strong> {form.activo ? "Activo" : "Inactivo"}</p>
              </div>
              <button
                onClick={() => {
                  setUpdated(false);
                  setFoundUser(null);
                  setSearchId("");
                }}
                className="inline-flex items-center justify-center gap-2 rounded-md bg-green-600 px-4 py-2 font-semibold text-white hover:opacity-90"
              >
                Actualizar otro usuario
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
