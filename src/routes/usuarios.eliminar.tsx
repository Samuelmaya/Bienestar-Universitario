import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { RequireAuth } from "@/components/RequireAuth";
import { Trash2, Search, User, AlertTriangle, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/usuarios/eliminar")({
  head: () => ({ meta: [{ title: "Eliminar usuario — UPC" }] }),
  component: () => (
    <RequireAuth roles={["admin"]}>
      <EliminarUsuarioPage />
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

function EliminarUsuarioPage() {
  const [searchId, setSearchId] = useState("");
  const [foundUser, setFoundUser] = useState<typeof usuariosEjemplo[0] | null>(null);
  const [searchError, setSearchError] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleted, setDeleted] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchError("");
    setFoundUser(null);
    setConfirmDelete(false);
    setDeleted(false);

    if (!searchId.trim()) {
      setSearchError("Por favor ingresa un ID de usuario");
      return;
    }

    const userId = parseInt(searchId);
    const user = usuariosEjemplo.find((u) => u.id === userId);

    if (user) {
      setFoundUser(user);
    } else {
      setSearchError(`No se encontró ningún usuario con ID: ${searchId}`);
    }
  };

  const handleDelete = () => {
    if (foundUser) {
      // Aquí iría la lógica para eliminar el usuario
      setDeleted(true);
      setConfirmDelete(false);
      setFoundUser(null);
      setSearchId("");
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
        title="Eliminar Usuario"
        subtitle="Busca y elimina usuarios del sistema de forma segura."
      />

      <section className="container mx-auto px-4 py-10">
        {/* Búsqueda de usuario */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-soft)] mb-8">
          <h2 className="text-xl font-semibold flex items-center gap-2 mb-6">
            <Search className="h-5 w-5 text-primary" /> Buscar usuario a eliminar
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
              <AlertTriangle className="h-5 w-5 text-destructive" />
              <p className="text-sm text-destructive">{searchError}</p>
            </div>
          )}

          {/* Usuario encontrado */}
          {foundUser && !deleted && (
            <div className="mt-6 rounded-lg border border-border p-6">
              <div className="flex items-center gap-3 mb-4">
                <User className="h-8 w-8 text-primary" />
                <div>
                  <h3 className="font-semibold text-lg">
                    {foundUser.primer_nombre} {foundUser.segundo_nombre} {foundUser.primer_apellido} {foundUser.segundo_apellido}
                  </h3>
                  <p className="text-sm text-muted-foreground">ID: {foundUser.id}</p>
                </div>
              </div>
              <div className="grid gap-3 text-sm mb-6">
                <div className="flex justify-between">
                  <span className="font-medium">Email:</span>
                  <span>{foundUser.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Rol:</span>
                  <span>{getRoleName(foundUser.role_id)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Estado:</span>
                  <span className={foundUser.activo ? "text-green-600" : "text-red-600"}>
                    {foundUser.activo ? "Activo" : "Inactivo"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Creado:</span>
                  <span>{formatDate(foundUser.creando_en)}</span>
                </div>
              </div>

              {!confirmDelete ? (
                <button
                  onClick={() => setConfirmDelete(true)}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-md bg-destructive py-2.5 font-semibold text-destructive-foreground shadow-[var(--shadow-soft)] hover:opacity-90"
                >
                  <Trash2 className="h-4 w-4" /> Eliminar usuario
                </button>
              ) : (
                <div className="rounded-lg bg-destructive/15 p-4">
                  <div className="flex items-center gap-3 mb-4">
                    <AlertTriangle className="h-5 w-5 text-destructive" />
                    <div>
                      <h4 className="font-semibold text-destructive">¿Confirmar eliminación?</h4>
                      <p className="text-sm text-destructive">
                        Esta acción no se puede deshacer. El usuario será eliminado permanentemente del sistema.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={handleDelete}
                      className="flex-1 inline-flex items-center justify-center gap-2 rounded-md bg-destructive py-2 font-semibold text-destructive-foreground hover:opacity-90"
                    >
                      <Trash2 className="h-4 w-4" /> Sí, eliminar
                    </button>
                    <button
                      onClick={() => setConfirmDelete(false)}
                      className="flex-1 inline-flex items-center justify-center gap-2 rounded-md bg-secondary py-2 font-semibold text-secondary-foreground hover:opacity-90"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Confirmación de eliminación */}
          {deleted && (
            <div className="mt-6 rounded-lg bg-green-50 border border-green-200 p-6 text-center">
              <CheckCircle2 className="mx-auto h-12 w-12 text-green-600 mb-4" />
              <h3 className="font-semibold text-green-800 text-lg mb-2">Usuario eliminado exitosamente</h3>
              <p className="text-green-700 text-sm mb-4">
                El usuario ha sido eliminado permanentemente del sistema.
              </p>
              <button
                onClick={() => {
                  setDeleted(false);
                  setSearchId("");
                }}
                className="inline-flex items-center justify-center gap-2 rounded-md bg-green-600 px-4 py-2 font-semibold text-white hover:opacity-90"
              >
                Eliminar otro usuario
              </button>
            </div>
          )}
        </div>

        {/* Información importante */}
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
            <div>
              <h3 className="font-semibold text-amber-800 mb-2">Información importante</h3>
              <ul className="text-sm text-amber-700 space-y-1">
                <li>• La eliminación de un usuario es permanente y no se puede deshacer</li>
                <li>• Se eliminarán todos los datos asociados al usuario</li>
                <li>• Verifica que estás eliminando el usuario correcto antes de confirmar</li>
                <li>• Se recomienda desactivar el usuario en lugar de eliminarlo si solo necesitas acceso temporal</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
