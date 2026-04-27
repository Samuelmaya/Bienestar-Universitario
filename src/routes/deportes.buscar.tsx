import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Search, Trophy, AlertCircle } from "lucide-react";

export const Route = createFileRoute("/deportes/buscar")({
  head: () => ({ meta: [{ title: "Buscar deporte — UPC" }] }),
  component: DeportesBuscarPage,
});

// Datos de ejemplo
const deportes = [
  {
    cod_deporte: 1,
    nom_deporte: "Fútbol",
    cupo_maximo: 22,
    descripcion: "Deporte de equipo que se juega con un balón y dos equipos de 11 jugadores cada uno.",
  },
  {
    cod_deporte: 2,
    nom_deporte: "Baloncesto",
    cupo_maximo: 10,
    descripcion: "Deporte de equipo donde dos equipos de 5 jugadores compiten para encestar un balón.",
  },
  {
    cod_deporte: 3,
    nom_deporte: "Voleibol",
    cupo_maximo: 12,
    descripcion: "Deporte de equipo que se juega con una red y dos equipos de 6 jugadores.",
  },
  {
    cod_deporte: 4,
    nom_deporte: "Tenis",
    cupo_maximo: 4,
    descripcion: "Deporte individual o de dobles que se juega con raquetas y una pelota.",
  },
  {
    cod_deporte: 5,
    nom_deporte: "Natación",
    cupo_maximo: 20,
    descripcion: "Deporte individual que consiste en nadar en diferentes estilos y distancias.",
  },
];

function DeportesBuscarPage() {
  const [searchId, setSearchId] = useState("");
  const [foundSport, setFoundSport] = useState<typeof deportes[0] | null>(null);
  const [searchError, setSearchError] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchError("");
    setFoundSport(null);

    if (!searchId.trim()) {
      setSearchError("Por favor ingresa un código de deporte");
      return;
    }

    const sportId = parseInt(searchId);
    const sport = deportes.find((s) => s.cod_deporte === sportId);

    if (sport) {
      setFoundSport(sport);
    } else {
      setSearchError(`No se encontró ningún deporte con código: ${searchId}`);
    }
  };

  return (
    <>
      <PageHeader
        title="Buscar Deporte"
        subtitle="Busca deportes por su código en el sistema."
      />

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
            />
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-6 py-2 font-semibold text-primary-foreground shadow-[var(--shadow-soft)] hover:opacity-90"
            >
              <Search className="h-4 w-4" /> Buscar
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
                  <span className="font-medium">Cupo Máximo:</span>
                  <span>{foundSport.cupo_maximo} participantes</span>
                </div>
                <div>
                  <span className="font-medium">Descripción:</span>
                  <p className="mt-1 text-muted-foreground">{foundSport.descripcion}</p>
                </div>
              </div>
            </div>
          )}

          {/* Información de deportes disponibles */}
          {!foundSport && !searchError && (
            <div className="rounded-lg border border-border p-4">
              <h3 className="font-semibold mb-3">Deportes disponibles</h3>
              <div className="grid gap-2 text-sm">
                {deportes.map((sport) => (
                  <div key={sport.cod_deporte} className="flex justify-between p-2 bg-muted/30 rounded">
                    <span>Código: {sport.cod_deporte}</span>
                    <span>{sport.nom_deporte}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
