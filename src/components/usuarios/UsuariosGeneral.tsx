import { useEffect, useState } from "react";
import { Users, Plus, AlertCircle, Loader2, CheckCircle2 } from "lucide-react";
import type { Usuario } from "@/shared/dtos/usuario.dto";
import type { Rol } from "@/shared/dtos/rol.dto";
import { listarUsuarios } from "@/shared/services/usuarios.service";
import { listarRoles } from "@/shared/services/roles.service";
import { UsuarioCard } from "./UsuarioCard";
import { CrearUsuarioModal } from "./CrearUsuarioModal";
import { EditarUsuarioModal } from "./EditarUsuarioModal";
import { EliminarUsuarioModal } from "./EliminarUsuarioModal";

export function UsuariosGeneral() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [roles, setRoles] = useState<Rol[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [crearOpen, setCrearOpen] = useState(false);
  const [crearTriggerEl, setCrearTriggerEl] = useState<HTMLElement | null>(null);

  const [editOpen, setEditOpen] = useState(false);
  const [editUsuario, setEditUsuario] = useState<Usuario | null>(null);
  const [editTriggerEl, setEditTriggerEl] = useState<HTMLElement | null>(null);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteUsuario, setDeleteUsuario] = useState<Usuario | null>(null);
  const [deleteTriggerEl, setDeleteTriggerEl] = useState<HTMLElement | null>(null);

  const loadData = () => {
    setLoading(true);
    setError("");
    Promise.all([listarUsuarios(), listarRoles()])
      .then(([us, rs]) => {
        setUsuarios(us);
        setRoles(rs);
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Error cargando usuarios"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreated = (usuario: Usuario) => {
    setUsuarios((prev) => [usuario, ...prev]);
    setCrearOpen(false);
    setCrearTriggerEl(null);
    setSuccessMsg("Usuario creado correctamente");
    setTimeout(() => setSuccessMsg(""), 4000);
  };

  const handleUpdated = (updated: Usuario) => {
    setUsuarios((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
    setEditOpen(false);
    setEditUsuario(null);
    setEditTriggerEl(null);
    setSuccessMsg("Usuario actualizado correctamente");
    setTimeout(() => setSuccessMsg(""), 4000);
  };

  const handleDeleted = (id: number) => {
    setUsuarios((prev) => prev.filter((u) => u.id !== id));
    setDeleteOpen(false);
    setDeleteUsuario(null);
    setDeleteTriggerEl(null);
    setSuccessMsg("Usuario eliminado correctamente");
    setTimeout(() => setSuccessMsg(""), 4000);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Encabezado */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Gestión de Usuarios</h1>
          <p className="text-sm text-muted-foreground">Administra los usuarios del sistema.</p>
        </div>
        <button
          type="button"
          onClick={(e) => {
            setCrearTriggerEl(e.currentTarget);
            setCrearOpen(true);
          }}
          className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-xs font-medium text-primary-foreground hover:opacity-90 w-fit"
        >
          <Plus className="h-4 w-4" /> Nuevo usuario
        </button>
      </div>

      {/* Éxito */}
      {successMsg && (
        <div className="mb-6 flex items-center gap-2 p-4 rounded-xl bg-green-500/10 text-green-600">
          <CheckCircle2 className="h-5 w-5 shrink-0" />
          <p className="font-medium">{successMsg}</p>
        </div>
      )}

      {/* Cargando */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 p-4 rounded-xl bg-destructive/10 text-destructive mb-6">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {/* Vacío */}
      {!loading && !error && usuarios.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Users className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-lg font-semibold">No hay usuarios</p>
          <p className="text-sm text-muted-foreground">Crea un usuario para comenzar.</p>
        </div>
      )}

      {/* Grid — 1 col en móvil, 2 en tablet, 3 en desktop */}
      {!loading && !error && usuarios.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {usuarios.map((usuario) => (
            <UsuarioCard
              key={usuario.id}
              usuario={usuario}
              roles={roles}
              onEdit={(e) => {
                setEditTriggerEl(e.currentTarget);
                setEditUsuario(usuario);
                setEditOpen(true);
              }}
              onDelete={(e) => {
                setDeleteTriggerEl(e.currentTarget);
                setDeleteUsuario(usuario);
                setDeleteOpen(true);
              }}
            />
          ))}
        </div>
      )}

      {/* Modales */}
      {crearOpen && (
        <CrearUsuarioModal
          roles={roles}
          triggerElement={crearTriggerEl}
          onClose={() => {
            setCrearOpen(false);
            setCrearTriggerEl(null);
          }}
          onCreated={handleCreated}
        />
      )}
      {editOpen && editUsuario && (
        <EditarUsuarioModal
          usuario={editUsuario}
          roles={roles}
          triggerElement={editTriggerEl}
          onClose={() => {
            setEditOpen(false);
            setEditUsuario(null);
            setEditTriggerEl(null);
          }}
          onUpdated={handleUpdated}
        />
      )}
      {deleteOpen && deleteUsuario && (
        <EliminarUsuarioModal
          usuario={deleteUsuario}
          triggerElement={deleteTriggerEl}
          onClose={() => {
            setDeleteOpen(false);
            setDeleteUsuario(null);
            setDeleteTriggerEl(null);
          }}
          onDeleted={handleDeleted}
        />
      )}
    </div>
  );
}