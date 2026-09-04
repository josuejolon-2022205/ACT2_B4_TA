import { Request, Response } from "express";
import {
  eliminarUsuario,
  listarUsuarios,
  loginUsuario,
  registrarUsuario,
} from "../service/usuario.service";
import { validarIdUsuario, validarLogin, validarUsuario } from "../validations/validaciones";

export const obtenerUsuarios = async (_req: Request, res: Response) => {
  try {
    const usuarios = await listarUsuarios();
    res.status(200).json(usuarios);
  } catch (error) {
    const mensaje = error instanceof Error ? error.message : "Error al listar usuarios";
    res.status(500).json({ mensaje });
  }
};

export const crearUsuario = async (req: Request, res: Response) => {
  try {
    validarUsuario(req.body);
    const usuario = await registrarUsuario(req.body);

    res.status(201).json({
      mensaje: "Usuario creado correctamente",
      usuario,
    });
  } catch (error) {
    const mensaje = error instanceof Error ? error.message : "Error al crear usuario";
    res.status(400).json({ mensaje });
  }
};

export const borrarUsuario = async (req: Request, res: Response) => {
  try {
    const idParam = Array.isArray(req.params.id_usuario) ? req.params.id_usuario[0] : req.params.id_usuario;
    const idUsuario = validarIdUsuario(idParam);
    const usuarioEliminado = await eliminarUsuario(idUsuario);

    if (!usuarioEliminado) {
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }

    return res.status(200).json({
      mensaje: "Usuario eliminado correctamente",
      usuario: usuarioEliminado,
    });
  } catch (error) {
    const mensaje = error instanceof Error ? error.message : "Error al eliminar usuario";
    return res.status(400).json({ mensaje });
  }
};

export const loginController = async (req: Request, res: Response) => {
  try {
    validarLogin(req.body);
    const resultado = await loginUsuario(req.body);

    res.status(200).json({
      mensaje: "Login exitoso",
      ...resultado,
    });
  } catch (error) {
    const mensaje = error instanceof Error ? error.message : "Error al iniciar sesión";
    res.status(401).json({ mensaje });
  }
};
