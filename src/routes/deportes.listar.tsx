import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { List, Trophy, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/deportes/listar")({
  head: () => ({ meta: [{ title: "Listar deportes — UPC" }] }),
  component: DeportesListarPage,
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

function DeportesListarPage() {
  const [searchId, setSearchId] = useState("");
  const [filteredDeportes, setFilteredDeportes] = useState(deportes);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchId.trim()) {
      setFilteredDeportes(deportes);
      return;
    }
    const sportId = parseInt(searchId);
    const filtered = deportes.filter((s) => s.cod_deporte === sportId);
    setFilteredDeportes(filtered);
  };

  return (
    <>
      <PageHeader
        title="Listar Deportes"
        subtitle="Consulta todos los deportes registrados en el sistema."
      />

      <section className="container mx-auto px-4 py-10">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-soft)]">
          <div className="flex items-center gap-2 mb-6">
            <List className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">Todos los Deportes</h2>
          </div>

          {/* Buscar por código */}
          <form onSubmit={handleSearch} className="flex gap-2 mb-6">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="number"
                placeholder="Buscar por código..."
                value={searchId}
                onChange={(e) => {
                  setSearchId(e.target.value);
                  if (!e.target.value.trim()) {
                    setFilteredDeportes(deportes);
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
                setFilteredDeportes(deportes);
              }}>
                Limpiar
              </Button>
            )}
          </form>

          <div className="grid gap-4">
            {filteredDeportes.length === 0 ? (
              <p className="text-center text-muted-foreground py-4">
                No se encontró ningún deporte con código: {searchId}
              </p>
            ) : (
              filteredDeportes.map((deporte) => (
              <div
                key={deporte.cod_deporte}
                className="rounded-lg border border-border p-4 hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <Trophy className="h-6 w-6 text-primary mt-1" />
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{deporte.nom_deporte}</h3>
                      <div className="mt-2 space-y-1 text-sm">
                        <p><strong>Código:</strong> {deporte.cod_deporte}</p>
                        <p><strong>Cupo máximo:</strong> {deporte.cupo_maximo} participantes</p>
                        <p><strong>Descripción:</strong> {deporte.descripcion}</p>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                      Activo
                    </span>
                  </div>
                </div>
              </div>
            ))
            )}
          </div>

          <div className="mt-6 p-4 bg-muted/30 rounded-lg">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Total de deportes: <span className="font-semibold">{filteredDeportes.length}</span>
              </p>
              <p className="text-sm text-muted-foreground">
                Cupo total disponible: <span className="font-semibold">
                  {filteredDeportes.reduce((total, deporte) => total + deporte.cupo_maximo, 0)} participantes
                </span>
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
