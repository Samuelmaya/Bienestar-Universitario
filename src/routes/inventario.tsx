import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { RequireAuth } from "@/components/RequireAuth";
import { Plus, Search, Edit, Trash2, ShieldCheck, Package } from "lucide-react";

export const Route = createFileRoute("/inventario")({
  head: () => ({ meta: [{ title: "Inventario Deportivo — UPC" }] }),
  component: ProtectedInventario,
});

function ProtectedInventario() {
  return (
    <RequireAuth roles={["admin", "profesor"]}>
      <InventarioPage />
    </RequireAuth>
  );
}

type Item = {
  id: string;
  nombre: string;
  categoria: string;
  total: number;
  disponibles: number;
  estado: "Bueno" | "Regular" | "Malo";
};

const inicial: Item[] = [
  { id: "INV-001", nombre: "Balón de fútbol Adidas", categoria: "Fútbol", total: 20, disponibles: 14, estado: "Bueno" },
  { id: "INV-002", nombre: "Balón de baloncesto Molten", categoria: "Baloncesto", total: 15, disponibles: 9, estado: "Bueno" },
  { id: "INV-003", nombre: "Raqueta de tenis Wilson", categoria: "Tenis", total: 10, disponibles: 4, estado: "Regular" },
  { id: "INV-004", nombre: "Conos de entrenamiento", categoria: "Atletismo", total: 60, disponibles: 60, estado: "Bueno" },
  { id: "INV-005", nombre: "Red de voleibol", categoria: "Voleibol", total: 4, disponibles: 2, estado: "Bueno" },
  { id: "INV-006", nombre: "Mesa de ping pong", categoria: "Tenis de mesa", total: 3, disponibles: 1, estado: "Regular" },
  { id: "INV-007", nombre: "Guantes de boxeo", categoria: "Boxeo", total: 12, disponibles: 8, estado: "Bueno" },
  { id: "INV-008", nombre: "Colchonetas", categoria: "Gimnasia", total: 25, disponibles: 25, estado: "Bueno" },
];

const colores = {
  Bueno: "bg-secondary/15 text-secondary",
  Regular: "bg-yellow-100 text-yellow-800",
  Malo: "bg-destructive/15 text-destructive",
} as const;

function InventarioPage() {
  const [q, setQ] = useState("");
  const items = inicial.filter((i) =>
    `${i.nombre} ${i.categoria} ${i.id}`.toLowerCase().includes(q.toLowerCase()),
  );

  return (
    <>
      <PageHeader
        title="Gestión de Inventario"
        subtitle="Administra los artículos deportivos disponibles. Acceso restringido a administradores y profesores."
        actions={
          <button className="inline-flex items-center gap-2 rounded-md bg-white px-4 py-2 font-semibold text-primary shadow hover:scale-[1.02] transition">
            <Plus className="h-4 w-4" /> Nuevo artículo
          </button>
        }
      />

      <section className="container mx-auto px-4 py-10">
        <div className="grid gap-4 md:grid-cols-4 mb-6">
          {[
            { l: "Total artículos", v: inicial.reduce((s, i) => s + i.total, 0) },
            { l: "Disponibles", v: inicial.reduce((s, i) => s + i.disponibles, 0) },
            { l: "En préstamo", v: inicial.reduce((s, i) => s + (i.total - i.disponibles), 0) },
            { l: "Categorías", v: new Set(inicial.map((i) => i.categoria)).size },
          ].map((s) => (
            <div key={s.l} className="rounded-xl border border-border bg-card p-5">
              <p className="text-sm text-muted-foreground">{s.l}</p>
              <p className="mt-1 text-3xl font-bold text-primary">{s.v}</p>
            </div>
          ))}
        </div>

        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-4 border-b border-border">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <ShieldCheck className="h-4 w-4 text-primary" />
              Acceso: Administrador / Profesor
            </div>
            <div className="relative w-full md:max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Buscar artículo..."
                className="w-full rounded-md border border-input bg-background pl-9 pr-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted text-left text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-4 py-3">Código</th>
                  <th className="px-4 py-3">Artículo</th>
                  <th className="px-4 py-3">Categoría</th>
                  <th className="px-4 py-3">Disponibles</th>
                  <th className="px-4 py-3">Estado</th>
                  <th className="px-4 py-3 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {items.map((i) => (
                  <tr key={i.id} className="hover:bg-accent/40">
                    <td className="px-4 py-3 font-mono text-xs">{i.id}</td>
                    <td className="px-4 py-3 font-medium flex items-center gap-2">
                      <Package className="h-4 w-4 text-primary" />
                      {i.nombre}
                    </td>
                    <td className="px-4 py-3">{i.categoria}</td>
                    <td className="px-4 py-3">
                      <span className="font-semibold">{i.disponibles}</span>
                      <span className="text-muted-foreground"> / {i.total}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${colores[i.estado]}`}>
                        {i.estado}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button className="inline-flex items-center justify-center rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-primary">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button className="inline-flex items-center justify-center rounded-md p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </>
  );
}
