// ── Artículo disponible (respuesta de GET /sports-equipment/) ──
export type ArticuloDisponible = {
  id_articulo: number;
  nombre: string;
  cantidad: number;
  cantidad_reservada: number;
  dañados: number;
  estado: string;
  id_categoria: number;
  observaciones: string | null;
};

// ── Detalle de un item en la petición ──
export type PeticionDetalleItem = {
  id_articulo: number;
  cantidad: number;
};

// ── Request body para POST /peticiones/ ──
export type PeticionCreateRequest = {
  nombre_solicitante: string;
  correo: string;
  telefono: string;
  descripcion: string;
  fecha_inicio: string; // ISO 8601
  fecha_fin: string;    // ISO 8601
  detalle: PeticionDetalleItem[];
};

// ── Response de POST /peticiones/ ──
export type PeticionCreateResponse = {
  message: string;
  id_peticion: number;
};

// ── Item del carrito (uso interno en frontend) ──
export type CartItem = {
  articulo: ArticuloDisponible;
  cantidad: number;
};

// ── Admin: Petición en listado (GET /peticiones/) ──
export type PeticionListItem = {
  id_peticion: number;
  nombre_solicitante: string;
  correo: string;
  telefono: string;
  descripcion: string;
  fecha_inicio: string;
  fecha_fin: string;
  estado: string;
  created_at: string;
  updated_at: string;
};

// ── Admin: Detalle completo de petición (GET /peticiones/{id}) ──
export type PeticionDetalleArticulo = {
  id_articulo: number;
  nombre: string;
  cantidad: number;
  cantidad_reservada: number;
  dañados: number;
  estado: string;
  id_categoria: number;
  observaciones: string | null;
};

export type PeticionDetalleCompleto = {
  id_articulo: number;
  cantidad: number;
  articulo: PeticionDetalleArticulo;
};

export type PeticionFullResponse = {
  id_peticion: number;
  nombre_solicitante: string;
  correo: string;
  telefono: string;
  descripcion: string;
  fecha_inicio: string;
  fecha_fin: string;
  estado: string;
  created_at: string;
  updated_at: string;
  detalle: PeticionDetalleCompleto[];
};

// ── Admin: Cambio de estado (PATCH /peticiones/{id}/estado) ──
export type PeticionEstadoUpdateRequest = {
  estado: string;
};

export type PeticionEstadoUpdateResponse = {
  message: string;
  estado: string;
  id_peticion: number;
};

export const ESTADOS_PETICION = [
  "PENDIENTE",
  "APROBADA",
  "RECHAZADA",
  "DEVUELTA",
] as const;

export type EstadoPeticion = (typeof ESTADOS_PETICION)[number];
