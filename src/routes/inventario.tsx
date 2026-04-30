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
  const [articulos, setArticulos] = useState<Articulo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredArticulos, setFilteredArticulos] = useState<Articulo[]>([]);
  
  // Dialog states
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedArticulo, setSelectedArticulo] = useState<Articulo | null>(null);
  
  // Form states
  const [form, setForm] = useState({
    nom_articulo: "",
    descripcion: "",
    cantidad: "",
  });
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");

  useEffect(() => {
    loadArticulos();
  }, []);

  useEffect(() => {
    if (searchTerm.trim()) {
      const filtered = articulos.filter(a => 
        a.nom_articulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredArticulos(filtered);
    } else {
      setFilteredArticulos(articulos);
    }
  }, [searchTerm, articulos]);

  const loadArticulos = async () => {
    try {
      setLoading(true);
      const data = await articlesApi.list();
      setArticulos(data);
      setFilteredArticulos(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar artículos");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      await articlesApi.create({
        nom_articulo: form.nom_articulo,
        descripcion: form.descripcion,
        cantidad: parseInt(form.cantidad) || 0,
      });
      setSuccess("Artículo creado exitosamente");
      setIsCreateOpen(false);
      setForm({ nom_articulo: "", descripcion: "", cantidad: "" });
      loadArticulos();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al crear artículo");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedArticulo) return;
    setSaving(true);
    setError("");
    try {
      await articlesApi.update(selectedArticulo.id_articulo, {
        nom_articulo: form.nom_articulo,
        descripcion: form.descripcion,
        cantidad: parseInt(form.cantidad) || 0,
      });
      setSuccess("Artículo actualizado exitosamente");
      setIsEditOpen(false);
      setSelectedArticulo(null);
      loadArticulos();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al actualizar artículo");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedArticulo) return;
    setSaving(true);
    setError("");
    try {
      await articlesApi.delete(selectedArticulo.id_articulo);
      setSuccess("Artículo eliminado exitosamente");
      setIsDeleteOpen(false);
      setSelectedArticulo(null);
      loadArticulos();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al eliminar artículo");
    } finally {
      setSaving(false);
    }
  };

  const openEdit = (articulo: Articulo) => {
    setSelectedArticulo(articulo);
    setForm({
      nom_articulo: articulo.nom_articulo,
      descripcion: articulo.descripcion,
      cantidad: String(articulo.cantidad),
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
              setForm({ nom_articulo: "", descripcion: "", cantidad: "" });
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
                    <th className="text-left py-3 px-4 font-medium">Descripción</th>
                    <th className="text-left py-3 px-4 font-medium">Cantidad</th>
                    <th className="text-left py-3 px-4 font-medium">Estado</th>
                    <th className="text-right py-3 px-4 font-medium">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredArticulos.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-8 text-muted-foreground">
                        No se encontraron artículos
                      </td>
                    </tr>
                  ) : (
                    filteredArticulos.map((articulo) => (
                      <tr key={articulo.id_articulo} className="border-b hover:bg-accent/50">
                        <td className="py-3 px-4">{articulo.id_articulo}</td>
                        <td className="py-3 px-4 font-medium">{articulo.nom_articulo}</td>
                        <td className="py-3 px-4 text-muted-foreground">{articulo.descripcion}</td>
                        <td className="py-3 px-4">{articulo.cantidad}</td>
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
                value={form.nom_articulo}
                onChange={(e) => setForm({ ...form, nom_articulo: e.target.value })}
                placeholder="Ej: Balón de fútbol"
                required
              />
            </div>
            <div>
              <Label>Descripción</Label>
              <Input
                value={form.descripcion}
                onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
                placeholder="Ej: Balón profesional tamaño 5"
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
                value={form.nom_articulo}
                onChange={(e) => setForm({ ...form, nom_articulo: e.target.value })}
                required
              />
            </div>
            <div>
              <Label>Descripción</Label>
              <Input
                value={form.descripcion}
                onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
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
            ¿Estás seguro de eliminar el artículo <strong>{selectedArticulo?.nom_articulo}</strong>?
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
