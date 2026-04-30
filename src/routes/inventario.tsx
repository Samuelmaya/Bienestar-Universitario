import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { PageHeader } from "@/components/PageHeader";
import { RequireAuth } from "@/components/RequireAuth";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Package,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { articlesApi, type Articulo } from "@/lib/api";

// NOTE: Backend disconnected - using local state only
// Fields: nombre, cantidad, dañados, estado, id_categoria, observaciones

export const Route = createFileRoute("/inventario")({
  head: () => ({ meta: [{ title: "Inventario Deportivo — UPC" }] }),
  component: ProtectedInventario,
});

function ProtectedInventario() {
  return (
    <RequireAuth>
      <InventarioContent />
    </RequireAuth>
  );
}

function InventarioContent() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredArticulos, setFilteredArticulos] = useState<Articulo[]>([]);
  
  // Sample data (local only - backend disconnected)
  const [articulos, setArticulos] = useState<Articulo[]>([
    { id_articulo: 1, nombre: "Balón de fútbol", cantidad: 20, dañados: 0, estado: "disponible", id_categoria: 1, observaciones: "Balón profesional tamaño 5" },
    { id_articulo: 2, nombre: "Raqueta de tenis", cantidad: 15, dañados: 1, estado: "disponible", id_categoria: 2, observaciones: "Raqueta profesional" },
    { id_articulo: 3, nombre: "Pelota de basketball", cantidad: 12, dañados: 0, estado: "disponible", id_categoria: 3, observaciones: "Balón oficial NBA" },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  // Dialog states
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedArticulo, setSelectedArticulo] = useState<Articulo | null>(null);
  
  // Form states
  const [form, setForm] = useState({
    nombre: "",
    cantidad: "",
    dañados: "",
    estado: "disponible",
    id_categoria: "",
    observaciones: "",
  });
  const [success, setSuccess] = useState("");
  const [saving, setSaving] = useState(false);

  // Initialize filtered articulos on mount and filter on search
  useEffect(() => {
    if (searchTerm.trim()) {
      const filtered = articulos.filter(a => 
        a.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.observaciones.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredArticulos(filtered);
    } else {
      setFilteredArticulos(articulos);
    }
  }, [searchTerm, articulos]);

  // Local-only handlers (backend disconnected)
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const newId = Math.max(...articulos.map(a => a.id_articulo), 0) + 1;
    const newArticulo: Articulo = {
      id_articulo: newId,
      nombre: form.nombre,
      cantidad: parseInt(form.cantidad) || 0,
      dañados: parseInt(form.dañados) || 0,
      estado: form.estado,
      id_categoria: parseInt(form.id_categoria) || 1,
      observaciones: form.observaciones,
    };
    setArticulos([...articulos, newArticulo]);
    setSuccess("Artículo creado exitosamente");
    setIsCreateOpen(false);
    setForm({ nombre: "", cantidad: "", dañados: "", estado: "disponible", id_categoria: "", observaciones: "" });
    setTimeout(() => setSuccess(""), 3000);
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedArticulo) return;
    setError("");
    const updated = articulos.map(a => 
      a.id_articulo === selectedArticulo.id_articulo
        ? { ...a, nombre: form.nombre, cantidad: parseInt(form.cantidad) || 0, dañados: parseInt(form.dañados) || 0, estado: form.estado, id_categoria: parseInt(form.id_categoria) || 1, observaciones: form.observaciones }
        : a
    );
    setArticulos(updated);
    setSuccess("Artículo actualizado exitosamente");
    setIsEditOpen(false);
    setSelectedArticulo(null);
    setTimeout(() => setSuccess(""), 3000);
  };

  const handleDelete = async () => {
    if (!selectedArticulo) return;
    setError("");
    const filtered = articulos.filter(a => a.id_articulo !== selectedArticulo.id_articulo);
    setArticulos(filtered);
    setSuccess("Artículo eliminado exitosamente");
    setIsDeleteOpen(false);
    setSelectedArticulo(null);
    setTimeout(() => setSuccess(""), 3000);
  };

  const openEdit = (articulo: Articulo) => {
    setSelectedArticulo(articulo);
    setForm({
      nombre: articulo.nombre,
      cantidad: String(articulo.cantidad),
      dañados: String(articulo.dañados),
      estado: articulo.estado,
      id_categoria: String(articulo.id_categoria),
      observaciones: articulo.observaciones,
    });
    setIsEditOpen(true);
  };

  const openDelete = (articulo: Articulo) => {
    setSelectedArticulo(articulo);
    setIsDeleteOpen(true);
  };

  return (
    <>
      <PageHeader
        title="Inventario Deportivo"
        subtitle="Gestiona los artículos deportivos del sistema."
      />

      <section className="container mx-auto px-4 py-10">
        {/* Success message */}
        {success && (
          <div className="mb-4 flex items-center gap-2 p-4 rounded-lg bg-green-500/10 text-green-600">
            <CheckCircle2 className="h-5 w-5" />
            <p>{success}</p>
          </div>
        )}

        <div className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-soft)]">
          {/* Header with search and add button */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar artículos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Button onClick={() => {
              setForm({ nombre: "", cantidad: "", dañados: "", estado: "disponible", id_categoria: "", observaciones: "" });
              setIsCreateOpen(true);
            }}>
              <Plus className="h-4 w-4 mr-2" /> Nuevo Artículo
            </Button>
          </div>

          {loading && (
            <p className="text-center text-muted-foreground py-8">Cargando artículos...</p>
          )}

          {error && (
            <div className="mb-4 flex items-center gap-2 p-4 rounded-lg bg-destructive/10 text-destructive">
              <AlertCircle className="h-5 w-5" />
              <p>{error}</p>
            </div>
          )}

          {!loading && !error && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium">ID</th>
                    <th className="text-left py-3 px-4 font-medium">Nombre</th>
                    <th className="text-left py-3 px-4 font-medium">Cantidad</th>
                    <th className="text-left py-3 px-4 font-medium">Dañados</th>
                    <th className="text-left py-3 px-4 font-medium">Categoría</th>
                    <th className="text-left py-3 px-4 font-medium">Estado</th>
                    <th className="text-right py-3 px-4 font-medium">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredArticulos.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-8 text-muted-foreground">
                        No se encontraron artículos
                      </td>
                    </tr>
                  ) : (
                    filteredArticulos.map((articulo) => (
                      <tr key={articulo.id_articulo} className="border-b hover:bg-accent/50">
                        <td className="py-3 px-4">{articulo.id_articulo}</td>
                        <td className="py-3 px-4 font-medium">{articulo.nombre}</td>
                        <td className="py-3 px-4">{articulo.cantidad}</td>
                        <td className="py-3 px-4">{articulo.dañados}</td>
                        <td className="py-3 px-4">{articulo.id_categoria}</td>
                        <td className="py-3 px-4">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            articulo.estado === "disponible" || articulo.estado === "activo"
                              ? "bg-green-500/10 text-green-600"
                              : "bg-yellow-500/10 text-yellow-600"
                          }`}>
                            {articulo.estado}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="icon" onClick={() => openEdit(articulo)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => openDelete(articulo)}>
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          <div className="mt-6 p-4 bg-muted/30 rounded-lg">
            <p className="text-sm text-muted-foreground">
              Total de artículos: <span className="font-semibold">{filteredArticulos.length}</span>
            </p>
          </div>
        </div>
      </section>

      {/* Create Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nuevo Artículo</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <Label>Nombre del artículo</Label>
              <Input
                value={form.nombre}
                onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                placeholder="Ej: Balón de fútbol"
                required
              />
            </div>
            <div>
              <Label>Cantidad</Label>
              <Input
                type="number"
                value={form.cantidad}
                onChange={(e) => setForm({ ...form, cantidad: e.target.value })}
                placeholder="0"
                required
              />
            </div>
            <div>
              <Label>Dañados</Label>
              <Input
                type="number"
                value={form.dañados}
                onChange={(e) => setForm({ ...form, dañados: e.target.value })}
                placeholder="0"
              />
            </div>
            <div>
              <Label>Estado</Label>
              <Input
                value={form.estado}
                onChange={(e) => setForm({ ...form, estado: e.target.value })}
                placeholder="disponible"
              />
            </div>
            <div>
              <Label>ID Categoría</Label>
              <Input
                type="number"
                value={form.id_categoria}
                onChange={(e) => setForm({ ...form, id_categoria: e.target.value })}
                placeholder="1"
              />
            </div>
            <div>
              <Label>Observaciones</Label>
              <Input
                value={form.observaciones}
                onChange={(e) => setForm({ ...form, observaciones: e.target.value })}
                placeholder="Ej: Balón profesional tamaño 5"
              />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? "Guardando..." : "Guardar"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Artículo</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEdit} className="space-y-4">
            <div>
              <Label>Nombre del artículo</Label>
              <Input
                value={form.nombre}
                onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                required
              />
            </div>
            <div>
              <Label>Cantidad</Label>
              <Input
                type="number"
                value={form.cantidad}
                onChange={(e) => setForm({ ...form, cantidad: e.target.value })}
                required
              />
            </div>
            <div>
              <Label>Dañados</Label>
              <Input
                type="number"
                value={form.dañados}
                onChange={(e) => setForm({ ...form, dañados: e.target.value })}
              />
            </div>
            <div>
              <Label>Estado</Label>
              <Input
                value={form.estado}
                onChange={(e) => setForm({ ...form, estado: e.target.value })}
              />
            </div>
            <div>
              <Label>ID Categoría</Label>
              <Input
                type="number"
                value={form.id_categoria}
                onChange={(e) => setForm({ ...form, id_categoria: e.target.value })}
              />
            </div>
            <div>
              <Label>Observaciones</Label>
              <Input
                value={form.observaciones}
                onChange={(e) => setForm({ ...form, observaciones: e.target.value })}
              />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsEditOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? "Guardando..." : "Actualizar"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar eliminación</DialogTitle>
          </DialogHeader>
          <p className="text-muted-foreground">
            ¿Estás seguro de eliminar el artículo <strong>{selectedArticulo?.nombre}</strong>?
            Esta acción no se puede deshacer.
          </p>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsDeleteOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={saving}>
              {saving ? "Eliminando..." : "Eliminar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
