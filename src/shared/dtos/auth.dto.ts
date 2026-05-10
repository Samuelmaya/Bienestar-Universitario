export type LoginRequest = {
  email: string;
  contrasena: string;
};

export type LoginResponse = {
  access_token: string;
  token_type: string;
  expires_in: number;
  rol: string;
};

export type RefreshUsuario = {
  id: number;
  primer_nombre: string;
  segundo_nombre: string | null;
  primer_apellido: string;
  segundo_apellido: string | null;
  email: string;
  rol: string;
  role_id: number;
};

export type RefreshResponse = {
  access_token: string;
  token_type: string;
  expires_in: number;
  rol: string;
  usuario: RefreshUsuario;
};

export type ApiErrorDetail = {
  loc: Array<string | number>;
  msg: string;
  type: string;
  input: string;
  ctx: Record<string, unknown>;
};

export type ApiErrorResponse = {
  detail: ApiErrorDetail[];
};
