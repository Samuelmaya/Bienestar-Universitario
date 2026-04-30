import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Trash2, Search, Trophy, AlertTriangle, CheckCircle2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { sportsApi, type Sport } from "@/lib/api";

export const Route = createFileRoute("/deportes/eliminar")({
  head: () => ({ meta: [{ title: "Eliminar deporte — UPC" }] }),
  component: DeportesEliminarPage,
});

function DeportesEliminarPage() {
  const navigate = useNavigate();
  const [searchId, setSearchId] = useState("");
  const [deporte, setDeporte] = useState<Sport | null>(null);
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

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
    } catch (err) {
      setError(err instanceof Error ? err.message : `No se encontró deporte con ID: ${searchId}`);
    } finally {
      setSearching(false);
    }
  };

  const handleDelete = async () => {
    if (!deporte) return;
    if (!window.confirm(`¿Eliminar deporte "${deporte.nom_deporte}"?`)) return;

    setLoading(true);
    setError("");
    try {
      await sportsApi.delete(deporte.cod_deporte);
      setSuccess(true);
      setTimeout(() => {
        navigate({ to: "/deportes/listar" });
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al eliminar deporte");
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
            <CardTitle className="text-2xl">¡Deporte eliminado!</CardTitle>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <>
      <PageHeader title="Eliminar Deporte" subtitle="Elimina un deporte del sistema." />
      <section className="container mx-auto px-4 py-10">
        <Card className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-soft)] max-w-2xl mx-auto">
          <CardContent className="pt-6">
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
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
              </>
            ) : (
              <div className="text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 mb-4">
                  <Trash2 className="h-8 w-8 text-destructive" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{deporte.nom_deporte}</h3>
                <p className="text-sm text-muted-foreground mb-4">{deporte.descripcion}</p>
                <p className="text-xs text-muted-foreground mb-6">Código: {deporte.cod_deporte}</p>
                <div className="flex gap-3 justify-center">
                  <Button variant="outline" onClick={() => setDeporte(null)} disabled={loading}>
                    Cancelar
                  </Button>
                  <Button variant="destructive" onClick={handleDelete} disabled={loading}>
                    {loading ? "Eliminando..." : "Eliminar"}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </section>
    </>
  );
}
