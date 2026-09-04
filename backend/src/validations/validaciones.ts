import { Usuario } from "../models/usuarios";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validarUsuario(usuario: Partial<Usuario>) {
  if (!usuario.nombre_usuario || usuario.nombre_usuario.trim().length < 3) {
    throw new Error("El nombre de usuario debe tener al menos 3 caracteres");
  }

  if (!usuario.correo || !emailRegex.test(usuario.correo.trim())) {
    throw new Error("El correo no es válido");
  }

  if (!usuario.contrasena || usuario.contrasena.trim().length < 6) {
    throw new Error("La contraseña debe tener al menos 6 caracteres");
  }
}

export function validarLogin({ correo, contrasena }: { correo?: string; contrasena?: string }) {
  if (!correo || !emailRegex.test(correo.trim())) {
    throw new Error("Debe proporcionar un correo válido");
  }

  if (!contrasena || contrasena.trim().length < 6) {
    throw new Error("La contraseña debe tener al menos 6 caracteres");
  }
}

export function validarIdUsuario(idUsuario: string | number) {
  const id = Number(idUsuario);

  if (!Number.isInteger(id) || id <= 0) {
    throw new Error("El id_usuario debe ser un número válido");
  }

  return id;
}
