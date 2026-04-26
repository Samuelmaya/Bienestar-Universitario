import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { RequireAuth } from "@/components/RequireAuth";
import { Search, Users, User, CheckCircle2, AlertCircle } from "lucide-react";

export const Route = createFileRoute("/usuarios/buscar")({
  head: () => ({ meta: [{ title: "Buscar usuarios — UPC" }] }),
  component: () => (
    <RequireAuth roles={["admin"]}>
      <BuscarUsuarioPage />
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

function BuscarUsuarioPage() {
  const [searchId, setSearchId] = useState("");
  const [foundUser, setFoundUser] = useState<typeof usuariosEjemplo[0] | null>(null);
  const [searchError, setSearchError] = useState("");
  const [showAll, setShowAll] = useState(false);

  const handleSearchById = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchError("");
    setFoundUser(null);

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
        title="Buscar Usuarios"
        subtitle="Busca usuarios por ID o consulta todos los usuarios registrados."
      />

      <section className="container mx-auto px-4 py-10">
        {/* Búsqueda por ID */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-soft)] mb-8">
          <h2 className="text-xl font-semibold flex items-center gap-2 mb-6">
            <Search className="h-5 w-5 text-primary" /> Buscar por ID
          </h2>
          <form onSubmit={handleSearchById} className="flex gap-4">
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

          {/* Resultado de búsqueda por ID */}
          {searchError && (
            <div className="mt-4 rounded-lg bg-destructive/15 p-4 flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-destructive" />
              <p className="text-sm text-destructive">{searchError}</p>
            </div>
          )}

          {foundUser && (
            <div className="mt-6 rounded-lg bg-secondary/15 p-6">
              <div className="flex items-center gap-3 mb-4">
                <User className="h-8 w-8 text-primary" />
                <div>
                  <h3 className="font-semibold text-lg">
                    {foundUser.primer_nombre} {foundUser.segundo_nombre} {foundUser.primer_apellido} {foundUser.segundo_apellido}
                  </h3>
                  <p className="text-sm text-muted-foreground">ID: {foundUser.id}</p>
                </div>
              </div>
              <div className="grid gap-3 text-sm">
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
            </div>
          )}
        </div>

        {/* Listado de todos los usuarios */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-soft)]">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" /> Todos los usuarios
            </h2>
            <button
              onClick={() => setShowAll(!showAll)}
              className="inline-flex items-center justify-center gap-2 rounded-md bg-secondary px-4 py-2 font-semibold text-secondary-foreground shadow-[var(--shadow-soft)] hover:opacity-90"
            >
              {showAll ? "Ocultar" : "Mostrar"} todos
            </button>
          </div>

          {showAll && (
            <div className="space-y-4">
              {usuariosEjemplo.map((user) => (
                <div key={user.id} className="rounded-lg border border-border p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <User className="h-6 w-6 text-primary" />
                      <div>
                        <h3 className="font-semibold">
                          {user.primer_nombre} {user.segundo_nombre} {user.primer_apellido} {user.segundo_apellido}
                        </h3>
                        <p className="text-sm text-muted-foreground">ID: {user.id}</p>
                      </div>
                    </div>
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                      user.activo ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                    }`}>
                      {user.activo ? "Activo" : "Inactivo"}
                    </span>
                  </div>
                  <div className="mt-3 grid gap-2 text-sm md:grid-cols-2">
                    <div>
                      <span className="font-medium">Email:</span> {user.email}
                    </div>
                    <div>
                      <span className="font-medium">Rol:</span> {getRoleName(user.role_id)}
                    </div>
                    <div>
                      <span className="font-medium">Creado:</span> {formatDate(user.creando_en)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!showAll && (
            <div className="text-center py-8">
              <Users className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                Haz clic en "Mostrar todos" para ver el listado completo de usuarios
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
