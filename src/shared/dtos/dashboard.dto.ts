// ─────────────────────────────────────────
// DTOs — Dashboard
// ─────────────────────────────────────────

export interface DashboardResumen {
  total_usuarios: number;
  usuarios_activos: number;
  total_deportes: number;
  total_espacios: number;
  total_articulos: number;
  total_peticiones: number;
  total_solicitudes_espacio: number;
}

export interface InventarioCategoria {
  categoria: string;
  cantidad: number;
}

export interface InventarioEstado {
  estado: string;
  cantidad: number;
}

export interface ArticuloReservado {
  id_articulo: number;
  nombre: string;
  cantidad_reservada: number;
}

export interface DashboardInventario {
  total_disponible: number;
  total_reservado: number;
  total_dañado: number;
  articulos_por_categoria: InventarioCategoria[];
  articulos_por_estado: InventarioEstado[];
  top_articulos_reservados: ArticuloReservado[];
}

export interface PeticionReciente {
  id_peticion: number;
  nombre_solicitante: string;
  estado: string;
  fecha_inicio: string;
  created_at: string;
}

export interface DashboardPeticiones {
  por_estado: Record<string, number>;
  total: number;
  tasa_aprobacion: number;
  recientes: PeticionReciente[];
}

export interface SolicitudPorEspacio {
  id_espacio: number;
  nombre_espacio: string;
  total_solicitudes: number;
}

export interface SolicitudProxima {
  id_solicitud: number;
  solicitante: string;
  nombre_espacio: string;
  fecha: string;
  hora_inicio: string;
  hora_fin: string;
  estado: string;
}

export interface DashboardSolicitudesEspacio {
  por_estado: Record<string, number>;
  total: number;
  tasa_aprobacion: number;
  por_espacio: SolicitudPorEspacio[];
  proximas: SolicitudProxima[];
}

export interface EspacioEstado {
  estado: string;
  cantidad: number;
}

export interface DashboardEspacios {
  por_estado: EspacioEstado[];
  total: number;
}

export interface DeporteItem {
  cod_deporte: number;
  nom_deporte: string;
  cupo_maximo: number;
}

export interface DashboardDeportes {
  lista: DeporteItem[];
  total: number;
  horarios_por_dia: Record<string, number>;
  total_horarios: number;
}

export interface DashboardResponse {
  resumen: DashboardResumen;
  inventario: DashboardInventario;
  peticiones: DashboardPeticiones;
  solicitudes_espacio: DashboardSolicitudesEspacio;
  espacios: DashboardEspacios;
  deportes: DashboardDeportes;
}
