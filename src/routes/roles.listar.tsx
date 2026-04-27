import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { PageHeader } from "@/components/PageHeader";
import { List, Shield, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { rolesApi, type Role } from "@/lib/api";

export const Route = createFileRoute("/roles/listar")({
  head: () => ({ meta: [{ title: "Listar roles — UPC" }] }),
  component: RolesListarPage,
});

function RolesListarPage() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchId, setSearchId] = useState("");
  const [filteredRoles, setFilteredRoles] = useState<Role[]>([]);

  useEffect(() => {
    loadRoles();
  }, []);

  const loadRoles = async () => {
    try {
      setLoading(true);
      // const data = await rolesApi.list(); // No conectado aún al backend
      // Datos simulados para pruebas
      const data: Role[] = [
        { id: 1, nombre: "Administrador", descripcion: "Acceso total al sistema", creado_en: new Date().toISOString() },
        { id: 2, nombre: "Entrenador", descripcion: "Gestiona horarios y reservas", creado_en: new Date().toISOString() },
        { id: 3, nombre: "Utilero", descripcion: "Gestiona inventario y artículos", creado_en: new Date().toISOString() }
      ];
      setRoles(data);
      setFilteredRoles(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar roles");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchId.trim()) {
      setFilteredRoles(roles);
      return;
    }
    const roleId = parseInt(searchId);
    const filtered = roles.filter((r) => r.id === roleId);
    setFilteredRoles(filtered);
  };

  return (
    <>
      <PageHeader
        title="Listar Roles"
        subtitle="Consulta todos los roles registrados en el sistema."
      />

      <section className="container mx-auto px-4 py-10">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-soft)]">
          <div className="flex items-center gap-2 mb-6">
            <List className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">Todos los Roles</h2>
          </div>

          {/* Buscar por ID */}
          <form onSubmit={handleSearch} className="flex gap-2 mb-6">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="number"
                placeholder="Buscar por ID..."
                value={searchId}
                onChange={(e) => {
                  setSearchId(e.target.value);
                  if (!e.target.value.trim()) {
                    setFilteredRoles(roles);
                  }
                }}
                className="pl-9"
              />
            </div>
            <Button type="submit" variant="secondary">
              Buscar
            </Button>
            {searchId && (
              <Button type="button" variant="outline" onClick={() => {
                setSearchId("");
                setFilteredRoles(roles);
              }}>
                Limpiar
              </Button>
            )}
          </form>

          {loading && (
            <p className="text-center text-muted-foreground py-8">Cargando roles...</p>
          )}

          {error && (
            <p className="text-center text-destructive py-4">{error}</p>
          )}

          {!loading && !error && (
            <div className="grid gap-4">
              {filteredRoles.length === 0 ? (
                <p className="text-center text-muted-foreground py-4">
                  No se encontró ningún rol con ID: {searchId}
                </p>
              ) : (
                filteredRoles.map((rol) => (
                  <div
                    key={rol.id}
                    className="rounded-lg border border-border p-4 hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <Shield className="h-6 w-6 text-primary mt-1" />
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">{rol.nombre}</h3>
                          <div className="mt-2 space-y-1 text-sm">
                            <p><strong>ID:</strong> {rol.id}</p>
                            <p><strong>Descripción:</strong> {rol.descripcion}</p>
                            <p><strong>Creado en:</strong> {new Date(rol.creado_en).toLocaleString()}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          <div className="mt-6 p-4 bg-muted/30 rounded-lg">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Total de roles: <span className="font-semibold">{filteredRoles.length}</span>
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}