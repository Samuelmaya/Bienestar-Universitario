import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { Shield, CheckCircle2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { rolesApi } from "@/lib/api";

export const Route = createFileRoute("/roles/crear")({
  head: () => ({ meta: [{ title: "Crear rol — UPC" }] }),
  component: RolesCrearPage,
});

function RolesCrearPage() {
  const navigate = useNavigate();
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim() || !descripcion.trim()) {
      setError("Por favor completa todos los campos");
      return;
    }

    setLoading(true);
    setError("");
    try {
      // await rolesApi.create({ nombre, descripcion }); // No conectado aún al backend
      setSuccess(true);
      setTimeout(() => {
        navigate({ to: "/roles/listar" });
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al crear el rol");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageHeader
        title="Crear Rol"
        subtitle="Registra un nuevo rol en el sistema."
      />

      <section className="container mx-auto px-4 py-10">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-soft)] max-w-2xl mx-auto">
          {success ? (
            <div className="text-center py-8">
              <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-green-600">¡Rol creado exitosamente!</h3>
              <p className="text-muted-foreground mt-2">Redirigiendo a la lista de roles...</p>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2 mb-6">
                <Shield className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-semibold">Datos del rol</h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
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
                    {loading ? "Creando..." : "Crear rol"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate({ to: "/roles/listar" })}
                  >
                    Cancelar
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