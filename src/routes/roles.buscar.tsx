import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Search, Shield, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { rolesApi, type Role } from "@/lib/api";

export const Route = createFileRoute("/roles/buscar")({
  head: () => ({ meta: [{ title: "Buscar rol — UPC" }] }),
  component: RolesBuscarPage,
});

function RolesBuscarPage() {
  const [searchId, setSearchId] = useState("");
  const [foundRole, setFoundRole] = useState<Role | null>(null);
  const [searchError, setSearchError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setSearchError("");
    setFoundRole(null);

    if (!searchId.trim()) {
      setSearchError("Por favor ingresa un ID de rol");
      return;
    }

    setLoading(true);
      try {
        const roleId = parseInt(searchId);
        // const role = await rolesApi.get(roleId); // No conectado aún al backend
        // Simulación de rol encontrado para pruebas
        const role = { id: roleId, nombre: "Rol de prueba", descripcion: "Descripción de prueba", creado_en: new Date().toISOString() } as Role;
        setFoundRole(role);
      } catch (err) {
        setSearchError(err instanceof Error ? err.message : `No se encontró ningún rol con ID: ${searchId}`);
      } finally {
        setLoading(false);
      }
  };

  return (
    <>
      <PageHeader
        title="Buscar Rol"
        subtitle="Busca roles por su ID en el sistema."
      />

      <section className="container mx-auto px-4 py-10">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-soft)]">
          <h2 className="text-xl font-semibold flex items-center gap-2 mb-6">
            <Search className="h-5 w-5 text-primary" /> Buscar por ID
          </h2>

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
            <Button type="submit" variant="secondary" disabled={loading}>
              {loading ? "Buscando..." : "Buscar"}
            </Button>
          </form>

          {searchError && (
            <div className="flex items-center gap-2 p-4 rounded-lg bg-destructive/10 text-destructive">
              <AlertCircle className="h-5 w-5" />
              <p>{searchError}</p>
            </div>
          )}

          {foundRole && (
            <div className="rounded-lg border border-border p-6 bg-accent/30">
              <div className="flex items-start gap-4">
                <Shield className="h-8 w-8 text-primary" />
                <div className="flex-1">
                  <h3 className="font-semibold text-xl">{foundRole.nombre}</h3>
                  <div className="mt-3 space-y-2 text-sm">
                    <p><strong>ID:</strong> {foundRole.id}</p>
                    <p><strong>Descripción:</strong> {foundRole.descripcion}</p>
                    <p><strong>Creado en:</strong> {new Date(foundRole.creado_en).toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}