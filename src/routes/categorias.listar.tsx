import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { RequireAuth } from "@/components/RequireAuth";
import { List, FolderOpen } from "lucide-react";

export const Route = createFileRoute("/categorias/listar")({
  head: () => ({ meta: [{ title: "Listar categorías — UPC" }] }),
  component: () => (
    <RequireAuth roles={["admin", "utilero"]}>
      <ListarCategoriasPage />
    </RequireAuth>
  ),
});

// Datos de ejemplo
const categoriasEjemplo = [
  {
    id_categoria: 1,
    nombre: "Fútbol",
  },
  {
    id_categoria: 2,
    nombre: "Baloncesto",
  },
  {
    id_categoria: 3,
    nombre: "Voleibol",
  },
  {
    id_categoria: 4,
    nombre: "Tenis",
  },
  {
    id_categoria: 5,
    nombre: "Natación",
  },
  {
    id_categoria: 6,
    nombre: "Atletismo",
  },
  {
    id_categoria: 7,
    nombre: "Gimnasia",
  },
  {
    id_categoria: 8,
    nombre: "Ciclismo",
  },
];

function ListarCategoriasPage() {
  return (
    <>
      <PageHeader
        title="Listar Categorías"
        subtitle="Consulta todas las categorías registradas en el sistema."
      />

      <section className="container mx-auto px-4 py-10">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-soft)]">
          <div className="flex items-center gap-2 mb-6">
            <List className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">Todas las Categorías</h2>
          </div>

          <div className="grid gap-4">
            {categoriasEjemplo.map((category) => (
              <div
                key={category.id_categoria}
                className="rounded-lg border border-border p-4 hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FolderOpen className="h-6 w-6 text-primary" />
                    <div>
                      <h3 className="font-semibold text-lg">{category.nombre}</h3>
                      <p className="text-sm text-muted-foreground">ID: {category.id_categoria}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                      Activa
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-muted/30 rounded-lg">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Total de categorías: <span className="font-semibold">{categoriasEjemplo.length}</span>
              </p>
              <p className="text-sm text-muted-foreground">
                Última actualización: <span className="font-semibold">Hoy</span>
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
