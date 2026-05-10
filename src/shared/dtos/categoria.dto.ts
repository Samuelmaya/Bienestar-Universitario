export type CategoriaArticulo = {
  id_categoria: number;
  nombre: string;
  descripcion?: string | null;
};

export type CategoriaCreateRequest = {
  nombre: string;
  descripcion?: string | null;
};

export type CategoriaUpdateRequest = {
  nombre?: string;
  descripcion?: string | null;
};
