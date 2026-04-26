import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { RequireAuth } from "@/components/RequireAuth";
import { Plus, Search, Edit, Trash2, ShieldCheck, Package, Save } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/inventario")({
  head: () => ({ meta: [{ title: "Inventario Deportivo — UPC" }] }),
  component: ProtectedInventario,
});

function ProtectedInventario() {
  return (
    <RequireAuth roles={["admin", "utilero"]}>
      <InventarioPage />
    </RequireAuth>
  );
}

type Articulo = {
  id: number;
  nombre: string;
  cantidad: number;
  dañados: number;
  estado: string;
  id_categoria: number;
  observaciones: string;
  categoria_nombre?: string;
};

const categorias = [
  { id: 1, nombre: "Fútbol" },
  { id: 2, nombre: "Baloncesto" },
  { id: 3, nombre: "Voleibol" },
  { id: 4, nombre: "Tenis" },
  { id: 5, nombre: "Tenis de mesa" },
  { id: 6, nombre: "Atletismo" },
  { id: 7, nombre: "Gimnasia" },
  { id: 8, nombre: "Boxeo" },
  { id: 9, nombre: "Natación" },
  { id: 10, nombre: "Otros" },
];

const inicial: Articulo[] = [
  { id: 1, nombre: "Balón de fútbol Adidas", cantidad: 20, dañados: 0, estado: "Bueno", id_categoria: 1, observaciones: "Balones oficiales de competencia", categoria_nombre: "Fútbol" },
  { id: 2, nombre: "Balón de baloncesto Molten", cantidad: 15, dañados: 2, estado: "Regular", id_categoria: 2, observaciones: "Balones de entrenamiento", categoria_nombre: "Baloncesto" },
  { id: 3, nombre: "Raqueta de tenis Wilson", cantidad: 10, dañados: 1, estado: "Bueno", id_categoria: 4, observaciones: "", categoria_nombre: "Tenis" },
  { id: 4, nombre: "Conos de entrenamiento", cantidad: 60, dañados: 0, estado: "Bueno", id_categoria: 6, observaciones: "Conos plásticos de 15cm", categoria_nombre: "Atletismo" },
  { id: 5, nombre: "Red de voleibol", cantidad: 4, dañados: 0, estado: "Bueno", id_categoria: 3, observaciones: "Redes profesionales", categoria_nombre: "Voleibol" },
  { id: 6, nombre: "Mesa de ping pong", cantidad: 3, dañados: 1, estado: "Regular", id_categoria: 5, observaciones: "Mesas plegables", categoria_nombre: "Tenis de mesa" },
  { id: 7, nombre: "Guantes de boxeo", cantidad: 12, dañados: 0, estado: "Bueno", id_categoria: 8, observaciones: "Guantes de 12oz", categoria_nombre: "Boxeo" },
  { id: 8, nombre: "Colchonetas", cantidad: 25, dañados: 3, estado: "Bueno", id_categoria: 7, observaciones: "Colchonetas de espuma", categoria_nombre: "Gimnasia" },
];

const colores = {
  Bueno: "bg-secondary/15 text-secondary",
  Regular: "bg-yellow-100 text-yellow-800",
  Malo: "bg-destructive/15 text-destructive",
} as const;

function InventarioPage() {
  const [articulos, setArticulos] = useState<Articulo[]>(inicial);
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [editando, setEditando] = useState<Articulo | null>(null);
  const [eliminando, setEliminando] = useState<Articulo | null>(null);

  const [form, setForm] = useState({
    nombre: "",
    cantidad: 1,
    dañados: 0,
    estado: "Bueno",
    id_categoria: 1,
    observaciones: "",
  });

  const filtered = articulos.filter((i) =>
    `${i.nombre} ${i.categoria_nombre || ""}`.toLowerCase().includes(q.toLowerCase()),
  );

  const resetForm = () => {
    setForm({
      nombre: "",
      cantidad: 1,
      dañados: 0,
      estado: "Bueno",
      id_categoria: 1,
      observaciones: "",
    });
    setEditando(null);
  };

  const handleOpen = (articulo?: Articulo) => {
    if (articulo) {
      setEditando(articulo);
      setForm({
        nombre: articulo.nombre,
        cantidad: articulo.cantidad,
        dañados: articulo.dañados,
        estado: articulo.estado,
        id_categoria: articulo.id_categoria,
        observaciones: articulo.observaciones,
      });
    } else {
      resetForm();
    }
    setOpen(true);
  };

  const handleSave = () => {
    if (!form.nombre.trim()) return;

    if (editando) {
      setArticulos((prev) =>
        prev.map((a) =>
          a.id === editando.id
            ? {
                ...a,
                ...form,
                categoria_nombre: categorias.find((c) => c.id === form.id_categoria)?.nombre,
              }
            : a,
        ),
      );
    } else {
      const nuevo: Articulo = {
        ...form,
        id: Math.max(0, ...articulos.map((a) => a.id)) + 1,
        categoria_nombre: categorias.find((c) => c.id === form.id_categoria)?.nombre,
      };
      setArticulos((prev) => [...prev, nuevo]);
    }
    setOpen(false);
    resetForm();
  };

  const handleDelete = () => {
    if (eliminando) {
      setArticulos((prev) => prev.filter((a) => a.id !== eliminando.id));
      setEliminando(null);
    }
  };

  return (
    <>
      <PageHeader
        title="Gestión de Inventario"
        subtitle="Administra los artículos deportivos disponibles. Acceso restringido a administradores y utileros."
        actions={
          <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) resetForm(); }}>
            <DialogTrigger asChild>
              <button
                onClick={() => handleOpen()}
                className="inline-flex items-center gap-2 rounded-md bg-white px-4 py-2 font-semibold text-primary shadow hover:scale-[1.02] transition"
              >
                <Plus className="h-4 w-4" /> Nuevo artículo
              </button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>{editando ? "Editar artículo" : "Nuevo artículo"}</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="nombre">Nombre del artículo</Label>
                  <Input
                    id="nombre"
                    value={form.nombre}
                    onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                    placeholder="Ej: Balón de fútbol"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="cantidad">Cantidad total</Label>
                    <Input
                      id="cantidad"
                      type="number"
                      min={0}
                      value={form.cantidad}
                      onChange={(e) => setForm({ ...form, cantidad: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="dañados">Dañados</Label>
                    <Input
                      id="dañados"
                      type="number"
                      min={0}
                      max={form.cantidad}
                      value={form.dañados}
                      onChange={(e) => setForm({ ...form, dañados: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="estado">Estado</Label>
                    <select
                      id="estado"
                      value={form.estado}
                      onChange={(e) => setForm({ ...form, estado: e.target.value })}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                    >
                      <option value="Bueno">Bueno</option>
                      <option value="Regular">Regular</option>
                      <option value="Malo">Malo</option>
                    </select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="categoria">Categoría</Label>
                    <select
                      id="categoria"
                      value={form.id_categoria}
                      onChange={(e) => setForm({ ...form, id_categoria: parseInt(e.target.value) })}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                    >
                      {categorias.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.nombre}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="observaciones">Observaciones</Label>
                  <textarea
                    id="observaciones"
                    value={form.observaciones}
                    onChange={(e) => setForm({ ...form, observaciones: e.target.value })}
                    placeholder="Notas adicionales sobre el artículo..."
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring resize-none"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <Button variant="outline" onClick={() => { setOpen(false); resetForm(); }}>
                    Cancelar
                  </Button>
                  <Button onClick={handleSave}>
                    <Save className="h-4 w-4 mr-2" />
                    {editando ? "Actualizar" : "Crear"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        }
      />

      <section className="container mx-auto px-4 py-10">
        <div className="grid gap-4 md:grid-cols-4 mb-6">
          {[
            { l: "Total artículos", v: articulos.reduce((s, i) => s + i.cantidad, 0) },
            { l: "Disponibles", v: articulos.reduce((s, i) => s + (i.cantidad - i.dañados), 0) },
            { l: "Dañados", v: articulos.reduce((s, i) => s + i.dañados, 0) },
            { l: "Categorías", v: new Set(articulos.map((i) => i.id_categoria)).size },
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
              Acceso: Administrador / Utilero
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
                  <th className="px-4 py-3">ID</th>
                  <th className="px-4 py-3">Artículo</th>
                  <th className="px-4 py-3">Categoría</th>
                  <th className="px-4 py-3">Cantidad</th>
                  <th className="px-4 py-3">Dañados</th>
                  <th className="px-4 py-3">Estado</th>
                  <th className="px-4 py-3">Observaciones</th>
                  <th className="px-4 py-3 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-8 text-center text-muted-foreground">
                      No se encontraron artículos
                    </td>
                  </tr>
                ) : (
                  filtered.map((i) => (
                    <tr key={i.id} className="hover:bg-accent/40">
                      <td className="px-4 py-3 font-mono text-xs">{i.id}</td>
                      <td className="px-4 py-3 font-medium flex items-center gap-2">
                        <Package className="h-4 w-4 text-primary" />
                        {i.nombre}
                      </td>
                      <td className="px-4 py-3">{i.categoria_nombre}</td>
                      <td className="px-4 py-3">
                        <span className="font-semibold">{i.cantidad - i.dañados}</span>
                        <span className="text-muted-foreground"> / {i.cantidad}</span>
                      </td>
                      <td className="px-4 py-3">
                        {i.dañados > 0 ? (
                          <span className="text-destructive font-semibold">{i.dañados}</span>
                        ) : (
                          <span className="text-muted-foreground">0</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${colores[i.estado as keyof typeof colores]}`}>
                          {i.estado}
                        </span>
                      </td>
                      <td className="px-4 py-3 max-w-[150px] truncate text-muted-foreground" title={i.observaciones}>
                        {i.observaciones || "-"}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => handleOpen(i)}
                          className="inline-flex items-center justify-center rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-primary"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setEliminando(i)}
                          className="inline-flex items-center justify-center rounded-md p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Modal de confirmación de eliminación */}
      <Dialog open={!!eliminando} onOpenChange={(v) => !v && setEliminando(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Confirmar eliminación</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground py-2">
            ¿Estás seguro de que deseas eliminar el artículo <strong>{eliminando?.nombre}</strong>? Esta acción no se puede deshacer.
          </p>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => setEliminando(null)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Eliminar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
