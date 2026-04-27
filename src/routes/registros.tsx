import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { RequireAuth } from "@/components/RequireAuth";
import { Search, Filter } from "lucide-react";

export const Route = createFileRoute("/registros")({
  head: () => ({ meta: [{ title: "Registros de Reservas — UPC" }] }),
  component: ProtectedRegistros,
});

function ProtectedRegistros() {
  return (
    <RequireAuth roles={["admin", "entrenador"]}>
      <RegistrosPage />
    </RequireAuth>
  );
}

type Estado = "Aprobada" | "Pendiente" | "Devuelta" | "Rechazada";
const data: { id: string; usuario: string; rol: string; articulo: string; fecha: string; estado: Estado }[] = [
  { id: "RES-1042", usuario: "Luisa Fernández", rol: "Estudiante", articulo: "Balón de fútbol", fecha: "2025-04-22", estado: "Aprobada" },
  { id: "RES-1041", usuario: "Carlos Mendoza", rol: "Profesor", articulo: "Conos x10", fecha: "2025-04-22", estado: "Devuelta" },
  { id: "RES-1040", usuario: "Andrés Polo", rol: "Estudiante", articulo: "Raqueta de tenis", fecha: "2025-04-21", estado: "Pendiente" },
  { id: "RES-1039", usuario: "Daniela Ríos", rol: "Estudiante", articulo: "Balón baloncesto", fecha: "2025-04-21", estado: "Devuelta" },
  { id: "RES-1038", usuario: "Iván Caballero", rol: "Profesor", articulo: "Guantes de boxeo", fecha: "2025-04-20", estado: "Aprobada" },
  { id: "RES-1037", usuario: "María Gómez", rol: "Estudiante", articulo: "Red voleibol", fecha: "2025-04-19", estado: "Rechazada" },
];

const colores: Record<Estado, string> = {
  Aprobada: "bg-secondary/15 text-secondary",
  Pendiente: "bg-yellow-100 text-yellow-800",
  Devuelta: "bg-primary/10 text-primary",
  Rechazada: "bg-destructive/15 text-destructive",
};

function RegistrosPage() {
  const [q, setQ] = useState("");
  const [filtro, setFiltro] = useState<"Todos" | Estado>("Todos");
  const rows = data.filter(
    (r) =>
      (filtro === "Todos" || r.estado === filtro) &&
      `${r.usuario} ${r.articulo} ${r.id}`.toLowerCase().includes(q.toLowerCase()),
  );

  return (
    <>
      <PageHeader
        title="Registros de Reservas"
        subtitle="Histórico completo de solicitudes, préstamos y devoluciones."
      />
      <section className="container mx-auto px-4 py-10">
        <div className="grid md:grid-cols-4 gap-4 mb-6">
          {(["Aprobada", "Pendiente", "Devuelta", "Rechazada"] as Estado[]).map((e) => {
            const c = data.filter((r) => r.estado === e).length;
            return (
              <div key={e} className="rounded-xl border border-border bg-card p-5">
                <p className="text-sm text-muted-foreground">{e}</p>
                <p className="mt-1 text-3xl font-bold text-primary">{c}</p>
              </div>
            );
          })}
        </div>

        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center gap-3 p-4 border-b border-border">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Buscar por usuario, artículo o ID..."
                className="w-full rounded-md border border-input bg-background pl-9 pr-3 py-2 text-sm"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <select
                value={filtro}
                onChange={(e) => setFiltro(e.target.value as Estado | "Todos")}
                className="rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option>Todos</option>
                <option>Aprobada</option>
                <option>Pendiente</option>
                <option>Devuelta</option>
                <option>Rechazada</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted text-left text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-4 py-3">ID</th>
                  <th className="px-4 py-3">Usuario</th>
                  <th className="px-4 py-3">Rol</th>
                  <th className="px-4 py-3">Artículo</th>
                  <th className="px-4 py-3">Fecha</th>
                  <th className="px-4 py-3">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {rows.map((r) => (
                  <tr key={r.id} className="hover:bg-accent/40">
                    <td className="px-4 py-3 font-mono text-xs">{r.id}</td>
                    <td className="px-4 py-3 font-medium">{r.usuario}</td>
                    <td className="px-4 py-3 text-muted-foreground">{r.rol}</td>
                    <td className="px-4 py-3">{r.articulo}</td>
                    <td className="px-4 py-3 text-muted-foreground">{r.fecha}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${colores[r.estado]}`}>
                        {r.estado}
                      </span>
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
