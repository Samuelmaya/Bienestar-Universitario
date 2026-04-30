import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { RequireAuth } from "@/components/RequireAuth";
import { Search, Users, User, CheckCircle2, AlertCircle } from "lucide-react";
import { usersApi } from "@/lib/api";

interface Usuario {
  user_id: number;
  nombre: string;
  email: string;
  role: string;
  activo: boolean;
  creando_en: string;
}

export const Route = createFileRoute("/usuarios/buscar")({
  head: () => ({ meta: [{ title: "Buscar usuarios — UPC" }] }),
  component: () => (
    <RequireAuth roles={["admin"]}>
      <BuscarUsuarioPage />
    </RequireAuth>
  ),
});

function BuscarUsuarioPage() {
  const [searchId, setSearchId] = useState("");
  const [foundUser, setFoundUser] = useState<Usuario | null>(null);
  const [allUsers, setAllUsers] = useState<Usuario[]>([]);
  const [searchError, setSearchError] = useState("");
  const [searching, setSearching] = useState(false);
  const [loadingAll, setLoadingAll] = useState(false);
  const [showAll, setShowAll] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setSearchError("");
    setFoundUser(null);

    if (!searchId.trim()) {
      setSearchError("Por favor ingresa un ID de usuario");
      return;
    }

    setSearching(true);
    try {
      const userId = parseInt(searchId);
      const user = await usersApi.get(userId);
      setFoundUser(user);
    } catch (err) {
      setSearchError(
        err instanceof Error ? err.message : `No se encontró ningún usuario con ID: ${searchId}`,
      );
    } finally {
      setSearching(false);
    }
  };

  const handleShowAll = async () => {
    if (showAll) {
      setShowAll(false);
      setAllUsers([]);
      return;
    }
    setLoadingAll(true);
    try {
      const users = await usersApi.list();
      setAllUsers(users);
      setShowAll(true);
    } catch (err) {
      setSearchError(err instanceof Error ? err.message : "Error al cargar la lista de usuarios");
    } finally {
      setLoadingAll(false);
    }
  };

  const getRoleName = (role: string) => {
    switch (role) {
      case "admin":
        return "Administrador";
      case "utilero":
        return "Utilero";
      case "entrenador":
        return "Entrenador";
      default:
        return role;
    }
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
          <form onSubmit={handleSearch} className="flex gap-4">
            <input
              type="number"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              placeholder="Ingresa el ID del usuario"
              className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
              min="1"
            />
            <button
              type="submit"
              disabled={searching}
              className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-6 py-2 font-semibold text-primary-foreground shadow-[var(--shadow-soft)] hover:opacity-90"
            >
              <Search className="h-4 w-4" /> {searching ? "Buscando..." : "Buscar"}
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
                  <h3 className="font-semibold text-lg">{foundUser.nombre}</h3>
                  <p className="text-sm text-muted-foreground">ID: {foundUser.user_id}</p>
                </div>
              </div>
              <div className="grid gap-3 text-sm">
                <div className="flex justify-between">
                  <span className="font-medium">Email:</span>
                  <span>{foundUser.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Rol:</span>
                  <span>{getRoleName(foundUser.role)}</span>
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
              onClick={handleShowAll}
              disabled={loadingAll}
              className="inline-flex items-center justify-center gap-2 rounded-md bg-secondary px-4 py-2 font-semibold text-secondary-foreground shadow-[var(--shadow-soft)] hover:opacity-90"
            >
              {loadingAll ? (
                <>
                  {" "}
                  <span className="animate-spin">↻</span> Cargando...
                </>
              ) : showAll ? (
                "Ocultar"
              ) : (
                "Mostrar todos"
              )}
            </button>
          </div>

          {showAll && (
            <div className="space-y-4">
              {allUsers.length === 0 && !loadingAll ? (
                <div className="text-center py-8">
                  <Users className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No hay usuarios registrados.</p>
                </div>
              ) : (
                allUsers.map((user) => (
                  <div key={user.user_id} className="rounded-lg border border-border p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <User className="h-6 w-6 text-primary" />
                        <div>
                          <h3 className="font-semibold">{user.nombre}</h3>
                          <p className="text-sm text-muted-foreground">ID: {user.user_id}</p>
                        </div>
                      </div>
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                          user.activo ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                        }`}
                      >
                        {user.activo ? "Activo" : "Inactivo"}
                      </span>
                    </div>
                    <div className="mt-3 grid gap-2 text-sm md:grid-cols-2">
                      <div>
                        <span className="font-medium">Email:</span> {user.email}
                      </div>
                      <div>
                        <span className="font-medium">Rol:</span> {getRoleName(user.role)}
                      </div>
                    </div>
                  </div>
                ))
              )}
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
