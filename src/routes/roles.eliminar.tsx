import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { Trash2, Search, Shield, AlertTriangle, CheckCircle2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { rolesApi, type Role } from "@/lib/api";

export const Route = createFileRoute("/roles/eliminar")({
  head: () => ({ meta: [{ title: "Eliminar rol — UPC" }] }),
  component: RolesEliminarPage,
});

function RolesEliminarPage() {
  const navigate = useNavigate();
  const [searchId, setSearchId] = useState("");
  const [role, setRole] = useState<Role | null>(null);
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
      const foundRole = await rolesApi.get(roleId);
      setRole(foundRole);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : `No se encontró ningún rol con ID: ${searchId}`,
      );
    } finally {
      setSearching(false);
    }
  };

  const handleDelete = async () => {
    if (!role) return;

    setLoading(true);
    setError("");
    try {
      await rolesApi.delete(role.id);
      setSuccess(true);
      setTimeout(() => {
        navigate({ to: "/roles/listar" });
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al eliminar el rol");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageHeader title="Eliminar Rol" subtitle="Elimina un rol del sistema." />

      <section className="container mx-auto px-4 py-10">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-soft)] max-w-2xl mx-auto">
          {success ? (
            <div className="text-center py-8">
              <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-green-600">¡Rol eliminado exitosamente!</h3>
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
                  <AlertTriangle className="h-5 w-5" />
                  <p>{error}</p>
                </div>
              )}
            </>
          ) : (
            <>
              <div className="flex items-center gap-2 mb-6">
                <Trash2 className="h-5 w-5 text-destructive" />
                <h2 className="text-xl font-semibold">Confirmar eliminación</h2>
              </div>

              <div className="mb-6 p-4 rounded-lg bg-destructive/10 border border-destructive/30">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-destructive mt-0.5" />
                  <div>
                    <p className="font-medium">¿Estás seguro de eliminar este rol?</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Esta acción no se puede deshacer.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mb-6 p-4 bg-muted/50 rounded-lg space-y-2">
                <p className="text-sm">
                  <strong>ID:</strong> {role.id}
                </p>
                <p className="text-sm">
                  <strong>Nombre:</strong> {role.nombre}
                </p>
                <p className="text-sm">
                  <strong>Descripción:</strong> {role.descripcion}
                </p>
                <p className="text-sm">
                  <strong>Creado en:</strong> {new Date(role.creado_en).toLocaleString()}
                </p>
              </div>

              {error && <p className="text-sm text-destructive mb-4">{error}</p>}

              <div className="flex gap-2">
                <Button variant="destructive" onClick={handleDelete} disabled={loading}>
                  {loading ? "Eliminando..." : "Eliminar rol"}
                </Button>
                <Button variant="outline" onClick={() => setRole(null)}>
                  Cancelar
                </Button>
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
}
