import { useEffect, useState } from "react";
import { Shield, Plus, AlertCircle, Loader2, CheckCircle2 } from "lucide-react";
import type { Rol } from "@/shared/dtos/rol.dto";
import { listarRoles } from "@/shared/services/roles.service";
import { RolCard } from "./RolCard";
import { CrearRolModal } from "./CrearRolModal";
import { EditarRolModal } from "./EditarRolModal";
import { EliminarRolModal } from "./EliminarRolModal";

export function RolesGeneral() {
  const [roles, setRoles] = useState<Rol[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [crearOpen, setCrearOpen] = useState(false);
  const [crearTriggerEl, setCrearTriggerEl] = useState<HTMLElement | null>(null);

  const [editOpen, setEditOpen] = useState(false);
  const [editRol, setEditRol] = useState<Rol | null>(null);
  const [editTriggerEl, setEditTriggerEl] = useState<HTMLElement | null>(null);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteRol, setDeleteRol] = useState<Rol | null>(null);
  const [deleteTriggerEl, setDeleteTriggerEl] = useState<HTMLElement | null>(null);

  const loadRoles = () => {
    setLoading(true);
    setError("");
    listarRoles()
      .then((data) => setRoles(data))
      .catch((err) => setError(err instanceof Error ? err.message : "Error cargando roles"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadRoles();
  }, []);

  const handleCreated = (rol: Rol) => {
    setRoles((prev) => [rol, ...prev]);
    setCrearOpen(false);
    setCrearTriggerEl(null);
    setSuccessMsg("Rol creado correctamente");
    setTimeout(() => setSuccessMsg(""), 4000);
  };

  const handleUpdated = (updated: Rol) => {
    setRoles((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
    setEditOpen(false);
    setEditRol(null);
    setEditTriggerEl(null);
    setSuccessMsg("Rol actualizado correctamente");
    setTimeout(() => setSuccessMsg(""), 4000);
  };

  const handleDeleted = (id: number) => {
    setRoles((prev) => prev.filter((r) => r.id !== id));
    setDeleteOpen(false);
    setDeleteRol(null);
    setDeleteTriggerEl(null);
    setSuccessMsg("Rol eliminado correctamente");
    setTimeout(() => setSuccessMsg(""), 4000);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Roles del sistema</h1>
          <p className="text-sm text-muted-foreground">Administra los roles disponibles.</p>
        </div>
        <button
          type="button"
          onClick={(e) => {
            setCrearTriggerEl(e.currentTarget);
            setCrearOpen(true);
          }}
          className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-xs font-medium text-primary-foreground hover:opacity-90"
        >
          <Plus className="h-4 w-4" /> Nuevo rol
        </button>
      </div>

      {successMsg && (
        <div className="mb-6 flex items-center gap-2 p-4 rounded-xl bg-green-500/10 text-green-600">
          <CheckCircle2 className="h-5 w-5 shrink-0" />
          <p className="font-medium">{successMsg}</p>
        </div>
      )}

      {loading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 p-4 rounded-xl bg-destructive/10 text-destructive mb-6">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {!loading && !error && roles.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Shield className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-lg font-semibold">No hay roles</p>
          <p className="text-sm text-muted-foreground">Crea un rol para comenzar.</p>
        </div>
      )}

      {!loading && !error && roles.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {roles.map((rol) => (
            <RolCard
              key={rol.id}
              rol={rol}
              onEdit={(e) => {
                setEditTriggerEl(e.currentTarget);
                setEditRol(rol);
                setEditOpen(true);
              }}
              onDelete={(e) => {
                setDeleteTriggerEl(e.currentTarget);
                setDeleteRol(rol);
                setDeleteOpen(true);
              }}
            />
          ))}
        </div>
      )}

      {crearOpen && (
        <CrearRolModal
          triggerElement={crearTriggerEl}
          onClose={() => {
            setCrearOpen(false);
            setCrearTriggerEl(null);
          }}
          onCreated={handleCreated}
        />
      )}
      {editOpen && editRol && (
        <EditarRolModal
          rol={editRol}
          triggerElement={editTriggerEl}
          onClose={() => {
            setEditOpen(false);
            setEditRol(null);
            setEditTriggerEl(null);
          }}
          onUpdated={handleUpdated}
        />
      )}
      {deleteOpen && deleteRol && (
        <EliminarRolModal
          rol={deleteRol}
          triggerElement={deleteTriggerEl}
          onClose={() => {
            setDeleteOpen(false);
            setDeleteRol(null);
            setDeleteTriggerEl(null);
          }}
          onDeleted={handleDeleted}
        />
      )}
    </div>
  );
}
