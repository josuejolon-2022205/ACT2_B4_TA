export interface Usuario {
  id_usuario?: number;
  nombre_usuario: string;
  correo: string;
  contrasena: string;
}

export interface UsuarioSinPassword {
  id_usuario: number;
  nombre_usuario: string;
  correo: string;
}

export interface LoginUsuario {
  correo: string;
  contrasena: string;
}