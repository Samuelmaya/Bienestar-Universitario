import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { Edit, Search, Shield, CheckCircle2, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { rolesApi, type Role } from "@/lib/api";

export const Route = createFileRoute("/roles/actualizar")({
  head: () => ({ meta: [{ title: "Actualizar rol — UPC" }] }),
  component: RolesActualizarPage,
});

function RolesActualizarPage() {
  const navigate = useNavigate();
  const [searchId, setSearchId] = useState("");
  const [role, setRole] = useState<Role | null>(null);
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setRole(null);

    if (!searchId.trim()) {
      setError("Por favor ingresa un ID de rol");
      return;
    }

    setSearching(true);
      try {
        const roleId = parseInt(searchId);
        // const foundRole = await rolesApi.get(roleId); // No conectado aún al backend
        // Simulación para pruebas
        const foundRole = { id: roleId, nombre: "Rol de prueba", descripcion: "Descripción de prueba", creado_en: new Date().toISOString() } as Role;
        setRole(foundRole);
        setNombre(foundRole.nombre);
        setDescripcion(foundRole.descripcion);
      } catch (err) {
        setError(err instanceof Error ? err.message : `No se encontró ningún rol con ID: ${searchId}`);
      } finally {
        setSearching(false);
      }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!role) return;

    if (!nombre.trim() || !descripcion.trim()) {
      setError("Por favor completa todos los campos");
      return;
    }

    setLoading(true);
    setError("");
      try {
        // await rolesApi.update(role.id, { nombre, descripcion }); // No conectado aún al backend
        setSuccess(true);
        setTimeout(() => {
          navigate({ to: "/roles/listar" });
        }, 2000);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error al actualizar el rol");
      } finally {
        setLoading(false);
      }
    };

  return (
    <>
      <PageHeader
        title="Actualizar Rol"
        subtitle="Modifica los datos de un rol existente."
      />

      <section className="container mx-auto px-4 py-10">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-soft)] max-w-2xl mx-auto">
          {success ? (
            <div className="text-center py-8">
              <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-green-600">¡Rol actualizado exitosamente!</h3>
              <p className="text-muted-foreground mt-2">Redirigiendo a la lista de roles...</p>
            </div>
          ) : !role ? (
            <>
              <div className="flex items-center gap-2 mb-6">
                <Search className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-semibold">Buscar rol por ID</h2>
              </div>

              <form onSubmit={handleSearch} className="flex gap-2 mb-6">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="number"
                    placeholder="Ingresa el ID del rol..."
                    value={searchId}
                    onChange={(e) => setSearchId(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Button type="submit" variant="secondary" disabled={searching}>
                  {searching ? "Buscando..." : "Buscar"}
                </Button>
              </form>

              {error && (
                <div className="flex items-center gap-2 p-4 rounded-lg bg-destructive/10 text-destructive">
                  <AlertCircle className="h-5 w-5" />
                  <p>{error}</p>
                </div>
              )}
            </>
          ) : (
            <>
              <div className="flex items-center gap-2 mb-6">
                <Shield className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-semibold">Datos del rol</h2>
              </div>

              <div className="mb-4 p-3 bg-muted/50 rounded-lg">
                <p className="text-sm"><strong>ID:</strong> {role.id}</p>
                <p className="text-sm"><strong>Creado en:</strong> {new Date(role.creado_en).toLocaleString()}</p>
              </div>

              <form onSubmit={handleUpdate} className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Nombre del rol</label>
                  <Input
                    type="text"
                    placeholder="Ej: Administrador"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    className="mt-1"
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Descripción</label>
                  <Input
                    type="text"
                    placeholder="Ej: Rol con acceso completo al sistema"
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                    className="mt-1"
                    required
                  />
                </div>

                {error && (
                  <p className="text-sm text-destructive">{error}</p>
                )}

                <div className="flex gap-2 pt-4">
                  <Button type="submit" disabled={loading}>
                    {loading ? "Actualizando..." : "Actualizar rol"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setRole(null)}
                  >
                    Buscar otro
                  </Button>
                </div>
              </form>
            </>
          )}
        </div>
      </section>
    </>
  );
}