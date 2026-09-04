import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { pool } from "../config/conexion";
import { LoginUsuario, Usuario, UsuarioSinPassword } from "../models/usuarios";

const JWT_SECRET = process.env.JWT_SECRET ?? "midominio-secret-key";

export async function listarUsuarios(): Promise<UsuarioSinPassword[]> {
  const result = await pool.query(
    "SELECT id_usuario, nombre_usuario, correo FROM usuarios ORDER BY id_usuario ASC"
  );

  return result.rows;
}

export async function registrarUsuario(usuario: Usuario): Promise<UsuarioSinPassword> {
  const nombre = usuario.nombre_usuario.trim();
  const correo = usuario.correo.trim().toLowerCase();
  const contrasenaHash = await bcrypt.hash(usuario.contrasena.trim(), 10);

  const result = await pool.query(
    "INSERT INTO usuarios (nombre_usuario, correo, contrasena) VALUES ($1, $2, $3) RETURNING id_usuario, nombre_usuario, correo",
    [nombre, correo, contrasenaHash]
  );

  return result.rows[0];
}

export async function eliminarUsuario(idUsuario: number): Promise<UsuarioSinPassword | null> {
  const result = await pool.query(
    "DELETE FROM usuarios WHERE id_usuario = $1 RETURNING id_usuario, nombre_usuario, correo",
    [idUsuario]
  );

  return result.rows[0] ?? null;
}

export async function loginUsuario({ correo, contrasena }: LoginUsuario) {
  const result = await pool.query("SELECT * FROM usuarios WHERE correo = $1", [correo.trim().toLowerCase()]);

  if (result.rowCount === 0) {
    throw new Error("Credenciales incorrectas");
  }

  const usuario = result.rows[0] as Usuario;
  const passwordValida = await bcrypt.compare(contrasena, usuario.contrasena);

  if (!passwordValida) {
    throw new Error("Credenciales incorrectas");
  }

  const payload = {
    id_usuario: usuario.id_usuario,
    nombre_usuario: usuario.nombre_usuario,
    correo: usuario.correo,
  };

  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "8h" });

  return {
    usuario: {
      id_usuario: usuario.id_usuario,
      nombre_usuario: usuario.nombre_usuario,
      correo: usuario.correo,
    },
    token,
  };
}
