import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Trash2, Edit, List, AlertCircle, CheckCircle2 } from "lucide-react";
import { sportsApi, type Sport } from "@/lib/api";

export const Route = createFileRoute("/deportes/listar")({
  head: () => ({ meta: [{ title: "Listar Deportes — UPC" }] }),
  component: DeportesListarPage,
});

function DeportesListarPage() {
  const [deportes, setDeportes] = useState<Sport[]>([]);
  const [filteredDeportes, setFilteredDeportes] = useState<Sport[]>([]);
  const [searchId, setSearchId] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchError, setSearchError] = useState("");
  const [foundDeporte, setFoundDeporte] = useState<Sport | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    loadDeportes();
  }, []);

  const loadDeportes = async () => {
    try {
      const data = await sportsApi.list();
      setDeportes(data);
      setFilteredDeportes(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar deportes");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setSearchError("");
    setFoundDeporte(null);

    if (!searchId.trim()) {
      setFilteredDeportes(deportes);
      return;
    }

    try {
      const id = parseInt(searchId);
      const deporte = await sportsApi.get(id);
      setFoundDeporte(deporte);
      setFilteredDeportes([deporte]);
    } catch (err) {
      setSearchError(
        err instanceof Error ? err.message : `No se encontró deporte con ID: ${searchId}`,
      );
      setFilteredDeportes([]);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("¿Estás seguro de eliminar este deporte?")) return;
    try {
      setDeletingId(id);
      await sportsApi.delete(id);
      await loadDeportes();
      setFoundDeporte(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al eliminar deporte");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <>
      <PageHeader
        title="Listar Deportes"
        subtitle="Consulta todos los deportes registrados en el sistema."
      />

      <section className="container mx-auto px-4 py-10">
        <Card className="rounded-2xl border border-border bg-card shadow-[var(--shadow-soft)]">
          <CardHeader>
            <div className="flex items-center gap-2 mb-4">
              <List className="h-5 w-5 text-primary" />
              <CardTitle className="text-xl font-semibold">Todos los Deportes</CardTitle>
            </div>

            <form onSubmit={handleSearch} className="flex gap-2 mb-4">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="number"
                  placeholder="Buscar por código..."
                  value={searchId}
                  onChange={(e) => setSearchId(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Button type="submit">Buscar</Button>
            </form>

            {searchError && (
              <div className="mb-4 rounded-lg bg-destructive/15 p-3 flex items-center gap-2 text-sm text-destructive">
                <AlertCircle className="h-4 w-4" />
                {searchError}
              </div>
            )}

            {foundDeporte && (
              <div className="mb-4 rounded-lg border border-border bg-accent/50 p-4">
                <p className="font-semibold">{foundDeporte.nom_deporte}</p>
                <p className="text-sm text-muted-foreground">{foundDeporte.descripcion}</p>
              </div>
            )}
          </CardHeader>

          <CardContent>
            {loading ? (
              <p className="text-center py-8 text-muted-foreground">Cargando deportes...</p>
            ) : error ? (
              <div className="rounded-lg bg-destructive/15 p-4 text-center text-destructive">
                {error}
              </div>
            ) : filteredDeportes.length === 0 ? (
              <p className="text-center py-8 text-muted-foreground">No se encontraron deportes.</p>
            ) : (
              <div className="space-y-3">
                {filteredDeportes.map((dep) => (
                  <div
                    key={dep.cod_deporte}
                    className="flex items-center justify-between rounded-lg border border-border p-4 hover:bg-accent/50 transition"
                  >
                    <div>
                      <p className="font-semibold">{dep.nom_deporte}</p>
                      <p className="text-sm text-muted-foreground">{dep.descripcion}</p>
                      <p className="text-xs text-muted-foreground">
                        Código: {dep.cod_deporte} | Estado: {dep.estado ? "Activo" : "Inactivo"}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="icon" disabled>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => handleDelete(dep.cod_deporte)}
                        disabled={deletingId === dep.cod_deporte}
                      >
                        {deletingId === dep.cod_deporte ? (
                          <span className="animate-spin">↻</span>
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </section>
    </>
  );
}
