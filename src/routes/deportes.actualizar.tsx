import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Edit, Search, Trophy, CheckCircle2, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { sportsApi, type Sport } from "@/lib/api";

export const Route = createFileRoute("/deportes/actualizar")({
  head: () => ({ meta: [{ title: "Actualizar deporte — UPC" }] }),
  component: DeportesActualizarPage,
});

function DeportesActualizarPage() {
  const navigate = useNavigate();
  const [searchId, setSearchId] = useState("");
  const [deporte, setDeporte] = useState<Sport | null>(null);
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState({
    nom_deporte: "",
    descripcion: "",
    categoria: "",
    estado: "true",
  });

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setDeporte(null);

    if (!searchId.trim()) {
      setError("Por favor ingresa un código de deporte");
      return;
    }

    setSearching(true);
    try {
      const id = parseInt(searchId);
      const found = await sportsApi.get(id);
      setDeporte(found);
      setForm({
        nom_deporte: found.nom_deporte,
        descripcion: found.descripcion,
        categoria: found.categoria?.toString() || "",
        estado: found.estado ? "true" : "false",
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : `No se encontró deporte con ID: ${searchId}`);
    } finally {
      setSearching(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!deporte) return;

    if (!form.nom_deporte.trim() || !form.descripcion.trim()) {
      setError("Por favor completa los campos requeridos");
      return;
    }

    setLoading(true);
    setError("");
    try {
      await sportsApi.update(deporte.cod_deporte, {
        nom_deporte: form.nom_deporte,
        descripcion: form.descripcion,
        categoria: form.categoria ? parseInt(form.categoria) : undefined,
        estado: form.estado === "true",
      });
      setSuccess(true);
      setTimeout(() => {
        navigate({ to: "/deportes/listar" });
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al actualizar deporte");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-svh flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 mb-4">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl">¡Deporte actualizado!</CardTitle>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <>
      <PageHeader
        title="Actualizar Deporte"
        subtitle="Modifica los datos de un deporte existente."
      />
      <section className="container mx-auto px-4 py-10">
        <Card className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-soft)] max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-xl font-semibold flex items-center gap-2">
              <Edit className="h-5 w-5 text-primary" /> Modificar Deporte
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!deporte ? (
              <>
                <form onSubmit={handleSearch} className="flex gap-2 mb-6">
                  <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="number"
                      placeholder="Código del deporte"
                      value={searchId}
                      onChange={(e) => setSearchId(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                  <Button type="submit" disabled={searching}>
                    {searching ? "Buscando..." : "Buscar"}
                  </Button>
                </form>
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
              </>
            ) : (
              <form onSubmit={handleUpdate} className="space-y-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                <div className="grid gap-2">
                  <Label>Nombre del deporte</Label>
                  <Input
                    value={form.nom_deporte}
                    onChange={(e) => setForm({ ...form, nom_deporte: e.target.value })}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Descripción</Label>
                  <Input
                    value={form.descripcion}
                    onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Categoría (opcional)</Label>
                  <Input
                    type="number"
                    value={form.categoria}
                    onChange={(e) => setForm({ ...form, categoria: e.target.value })}
                    placeholder="ID"
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Estado</Label>
                  <select
                    value={form.estado}
                    onChange={(e) => setForm({ ...form, estado: e.target.value })}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="true">Activo</option>
                    <option value="false">Inactivo</option>
                  </select>
                </div>
                <Button type="submit" disabled={loading} className="w-full">
                  {loading ? "Actualizando..." : "Actualizar Deporte"}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </section>
    </>
  );
}
