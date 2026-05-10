export type ArticuloDeportivo = {
  id_articulo: number;
  nombre: string;
  cantidad: number;
  dañados: number;
  estado: string;
  id_categoria: number;
  observaciones: string;
};

export type ArticuloCreateRequest = {
  nombre: string;
  cantidad: number;
  dañados: number;
  estado: string;
  id_categoria: number;
  observaciones: string;
};

export type ArticuloUpdateRequest = {
  nombre?: string;
  cantidad?: number;
  dañados?: number;
  estado?: string;
  id_categoria?: number;
  observaciones?: string;
};
