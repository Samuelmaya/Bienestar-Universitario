import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { RequireAuth } from "@/components/RequireAuth";
import { Edit, Search, User, CheckCircle2, AlertCircle } from "lucide-react";
import { usersApi } from "@/lib/api";

interface Usuario {
  user_id: number;
  nombre: string;
  email: string;
  role: string;
  activo: boolean;
  creando_en: string;
}

export const Route = createFileRoute("/usuarios/actualizar")({
  head: () => ({ meta: [{ title: "Actualizar usuario — UPC" }] }),
  component: () => (
    <RequireAuth roles={["admin"]}>
      <ActualizarUsuarioPage />
    </RequireAuth>
  ),
});

function ActualizarUsuarioPage() {
  const [searchId, setSearchId] = useState("");
  const [foundUser, setFoundUser] = useState<Usuario | null>(null);
  const [searchError, setSearchError] = useState("");
  const [searching, setSearching] = useState(false);
  const [updated, setUpdated] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [form, setForm] = useState({
    nombre: "",
    email: "",
    role: "utilero" as string,
    activo: true,
  });

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setSearchError("");
    setFoundUser(null);
    setUpdated(false);

    if (!searchId.trim()) {
      setSearchError("Por favor ingresa un ID de usuario");
      return;
    }

    setSearching(true);
    try {
      const userId = parseInt(searchId);
      const user = await usersApi.get(userId);
      setFoundUser(user);
      setForm({
        nombre: user.nombre,
        email: user.email,
        role: user.role,
        activo: user.activo,
      });
    } catch (err) {
      setSearchError(
        err instanceof Error ? err.message : `No se encontró ningún usuario con ID: ${searchId}`,
      );
    } finally {
      setSearching(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (foundUser && form.nombre) {
      setUpdating(true);
      try {
        await usersApi.update(foundUser.user_id, {
          nombre: form.nombre,
          email: form.email,
          role: form.role,
        });
        setUpdated(true);
      } catch (err) {
        setSearchError(err instanceof Error ? err.message : "Error al actualizar el usuario");
      } finally {
        setUpdating(false);
      }
    }
  };

  const handleReset = () => {
    setUpdated(false);
    setFoundUser(null);
    setSearchId("");
    setSearchError("");
    setForm({ nombre: "", email: "", role: "utilero", activo: true });
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
              min="1"
              disabled={updating}
            />
            <button
              type="submit"
              disabled={searching || updating}
              className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-6 py-2 font-semibold text-primary-foreground shadow-[var(--shadow-soft)] hover:opacity-90"
            >
              <Search className="h-4 w-4" /> {searching ? "Buscando..." : "Buscar"}
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
                    <h3 className="font-semibold text-lg">{foundUser.nombre}</h3>
                    <p className="text-sm text-muted-foreground">ID: {foundUser.user_id}</p>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Edit className="h-5 w-5 text-primary" /> Editar información
                </h3>

                <div>
                  <label className="text-sm font-medium">Nombre completo</label>
                  <input
                    type="text"
                    required
                    value={form.nombre}
                    onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                    className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>

                <div>
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
                    value={form.role}
                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                    className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="admin">Administrador</option>
                    <option value="utilero">Utilero</option>
                    <option value="entrenador">Entrenador</option>
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

                <div>
                  <button
                    type="submit"
                    disabled={updating || !form.nombre || !form.email}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-md bg-primary py-2.5 font-semibold text-primary-foreground shadow-[var(--shadow-soft)] hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {updating ? (
                      <>
                        <Edit className="h-4 w-4" /> Actualizando...
                      </>
                    ) : (
                      <>
                        <Edit className="h-4 w-4" /> Actualizar usuario
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Confirmación de actualización */}
          {updated && foundUser && (
            <div className="mt-6 rounded-lg bg-green-50 border border-green-200 p-6 text-center">
              <CheckCircle2 className="mx-auto h-12 w-12 text-green-600 mb-4" />
              <h3 className="font-semibold text-green-800 text-lg mb-2">
                Usuario actualizado exitosamente
              </h3>
              <div className="text-left text-sm text-green-700 mb-4 max-w-md mx-auto">
                <p>
                  <strong>Nombre:</strong> {form.nombre}
                </p>
                <p>
                  <strong>Email:</strong> {form.email}
                </p>
                <p>
                  <strong>Rol:</strong> {form.role}
                </p>
                <p>
                  <strong>Estado:</strong> {form.activo ? "Activo" : "Inactivo"}
                </p>
              </div>
              <button
                onClick={handleReset}
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
