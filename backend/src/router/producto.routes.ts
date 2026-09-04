import { Router } from "express";
import { obtenerProductos, agregarProductos  } from "../controller/producto.controller";

export const router = Router();

router.get("/productos", obtenerProductos);

router.post("/productos", agregarProductos);