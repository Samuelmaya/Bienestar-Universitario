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
