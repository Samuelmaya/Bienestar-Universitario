import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Search, Trophy, AlertCircle } from "lucide-react";
import { sportsApi, type Sport } from "@/lib/api";

export const Route = createFileRoute("/deportes/buscar")({
  head: () => ({ meta: [{ title: "Buscar deporte — UPC" }] }),
  component: DeportesBuscarPage,
});

function DeportesBuscarPage() {
  const [searchId, setSearchId] = useState("");
  const [foundSport, setFoundSport] = useState<Sport | null>(null);
  const [searchError, setSearchError] = useState("");
  const [searching, setSearching] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setSearchError("");
    setFoundSport(null);

    if (!searchId.trim()) {
      setSearchError("Por favor ingresa un código de deporte");
      return;
    }

    setSearching(true);
    try {
      const sportId = parseInt(searchId);
      const sport = await sportsApi.get(sportId);
      setFoundSport(sport);
    } catch (err) {
      setSearchError(
        err instanceof Error
          ? err.message
          : `No se encontró ningún deporte con código: ${searchId}`,
      );
    } finally {
      setSearching(false);
    }
  };

  return (
    <>
      <PageHeader title="Buscar Deporte" subtitle="Busca deportes por su código en el sistema." />

      <section className="container mx-auto px-4 py-10">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-soft)]">
          <h2 className="text-xl font-semibold flex items-center gap-2 mb-6">
            <Search className="h-5 w-5 text-primary" /> Buscar por código
          </h2>
          <form onSubmit={handleSearch} className="flex gap-4 mb-6">
            <input
              type="number"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              placeholder="Ingresa el código del deporte"
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

          {/* Mensaje de error */}
          {searchError && (
            <div className="rounded-lg bg-destructive/15 p-4 flex items-center gap-3 mb-6">
              <AlertCircle className="h-5 w-5 text-destructive" />
              <p className="text-sm text-destructive">{searchError}</p>
            </div>
          )}

          {/* Resultado de búsqueda */}
          {foundSport && (
            <div className="rounded-lg bg-secondary/15 p-6">
              <div className="flex items-center gap-3 mb-4">
                <Trophy className="h-8 w-8 text-primary" />
                <div>
                  <h3 className="font-semibold text-lg">{foundSport.nom_deporte}</h3>
                  <p className="text-sm text-muted-foreground">Código: {foundSport.cod_deporte}</p>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="font-medium">Código Deporte:</span>
                  <span>{foundSport.cod_deporte}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Nombre:</span>
                  <span>{foundSport.nom_deporte}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Categoría:</span>
                  <span>{foundSport.categoria || "Sin categoría"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Estado:</span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${foundSport.estado ? "bg-secondary/15 text-secondary" : "bg-destructive/15 text-destructive"}`}
                  >
                    {foundSport.estado ? "Activo" : "Inactivo"}
                  </span>
                </div>
                <div>
                  <span className="font-medium">Descripción:</span>
                  <p className="mt-1 text-muted-foreground">{foundSport.descripcion}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
