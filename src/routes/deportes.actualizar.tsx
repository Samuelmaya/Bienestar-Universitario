import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Edit, Search, Trophy, CheckCircle2, AlertCircle } from "lucide-react";

export const Route = createFileRoute("/deportes/actualizar")({
  head: () => ({ meta: [{ title: "Actualizar deporte — UPC" }] }),
  component: DeportesActualizarPage,
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

function DeportesActualizarPage() {
  const [searchId, setSearchId] = useState("");
  const [foundSport, setFoundSport] = useState<typeof deportes[0] | null>(null);
  const [searchError, setSearchError] = useState("");
  const [updated, setUpdated] = useState(false);
  const [form, setForm] = useState({
    nom_deporte: "",
    cupo_maximo: "",
    descripcion: "",
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchError("");
    setFoundSport(null);
    setUpdated(false);

    if (!searchId.trim()) {
      setSearchError("Por favor ingresa un código de deporte");
      return;
    }

    const sportId = parseInt(searchId);
    const sport = deportes.find((s) => s.cod_deporte === sportId);

    if (sport) {
      setFoundSport(sport);
      setForm({
        nom_deporte: sport.nom_deporte,
        cupo_maximo: sport.cupo_maximo.toString(),
        descripcion: sport.descripcion,
      });
    } else {
      setSearchError(`No se encontró ningún deporte con código: ${searchId}`);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (foundSport && form.nom_deporte && form.cupo_maximo && form.descripcion) {
      // Aquí iría la lógica para actualizar el deporte
      setUpdated(true);
    }
  };

  return (
    <>
      <PageHeader
        title="Actualizar Deporte"
        subtitle="Busca y actualiza la información de los deportes existentes."
      />

      <section className="container mx-auto px-4 py-10">
        {/* Búsqueda de deporte */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-soft)] mb-8">
          <h2 className="text-xl font-semibold flex items-center gap-2 mb-6">
            <Search className="h-5 w-5 text-primary" /> Buscar deporte a actualizar
          </h2>
          <form onSubmit={handleSearch} className="flex gap-4">
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
            <div className="mt-4 rounded-lg bg-destructive/15 p-4 flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-destructive" />
              <p className="text-sm text-destructive">{searchError}</p>
            </div>
          )}

          {/* Deporte encontrado y formulario de actualización */}
          {foundSport && !updated && (
            <div className="mt-6">
              <div className="rounded-lg border border-border p-4 mb-6">
                <div className="flex items-center gap-3">
                  <Trophy className="h-8 w-8 text-primary" />
                  <div>
                    <h3 className="font-semibold text-lg">{foundSport.nom_deporte}</h3>
                    <p className="text-sm text-muted-foreground">Código: {foundSport.cod_deporte}</p>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Edit className="h-5 w-5 text-primary" /> Editar información
                </h3>
                
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="text-sm font-medium">Nombre Deporte</label>
                    <input
                      type="text"
                      required
                      value={form.nom_deporte}
                      onChange={(e) => setForm({ ...form, nom_deporte: e.target.value })}
                      className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">Cupo Máximo</label>
                    <input
                      type="number"
                      required
                      value={form.cupo_maximo}
                      onChange={(e) => setForm({ ...form, cupo_maximo: e.target.value })}
                      className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="text-sm font-medium">Descripción</label>
                    <textarea
                      required
                      value={form.descripcion}
                      onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
                      rows={4}
                      className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring resize-none"
                    />
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={!form.nom_deporte || !form.cupo_maximo || !form.descripcion}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-md bg-primary py-2.5 font-semibold text-primary-foreground shadow-[var(--shadow-soft)] hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Edit className="h-4 w-4" /> Actualizar deporte
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Confirmación de actualización */}
          {updated && foundSport && (
            <div className="mt-6 rounded-lg bg-green-50 border border-green-200 p-6 text-center">
              <CheckCircle2 className="mx-auto h-12 w-12 text-green-600 mb-4" />
              <h3 className="font-semibold text-green-800 text-lg mb-2">Deporte actualizado exitosamente</h3>
              <div className="text-left text-sm text-green-700 mb-4 max-w-md mx-auto">
                <p><strong>Código:</strong> {foundSport.cod_deporte}</p>
                <p><strong>Nombre:</strong> {form.nom_deporte}</p>
                <p><strong>Cupo máximo:</strong> {form.cupo_maximo}</p>
                <p><strong>Descripción:</strong> {form.descripcion}</p>
              </div>
              <button
                onClick={() => {
                  setUpdated(false);
                  setFoundSport(null);
                  setSearchId("");
                }}
                className="inline-flex items-center justify-center gap-2 rounded-md bg-green-600 px-4 py-2 font-semibold text-white hover:opacity-90"
              >
                Actualizar otro deporte
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
