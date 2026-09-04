import { Router } from "express";
import {
  borrarUsuario,
  crearUsuario,
  loginController,
  obtenerUsuarios,
} from "../controller/usuario.controller";

export const usuarioRouter = Router();

usuarioRouter.get("/usuarios", obtenerUsuarios);
usuarioRouter.post("/usuarios", crearUsuario);
usuarioRouter.delete("/usuarios/:id_usuario", borrarUsuario);
usuarioRouter.post("/usuarios/login", loginController);
