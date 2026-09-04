import { Request, Response } from "express";
import { listarProductos, agregarProducto } from "../service/producto.service";

export const obtenerProductos = async (req: Request, res: Response): Promise<void> => {
  try {
    const productos = await listarProductos();
    res.json(productos);
  } catch (error: any) {
    console.error("Error al obtener productos:", error);
    res.status(500).json({
      mensaje: "Error al consultar la tabla de productos en la base de datos",
      error: error.message || "Error interno del servidor",
    });
  }
};

export const agregarProductos = async (req: Request, res: Response): Promise<void> => {
  try {
    const { nombre, precio, cantidad } = req.body;

    if (!nombre || precio === undefined || cantidad === undefined) {
      res.status(400).json({ mensaje: "Los campos nombre, precio y cantidad son requeridos" });
      return;
    }

    const nuevoProducto = await agregarProducto({
      nombre,
      precio: Number(precio),
      cantidad: Number(cantidad),
    });

    res.status(201).json({
      mensaje: "Producto creado exitosamente",
      producto: nuevoProducto,
    });
  } catch (error: any) {
    console.error("Error al agregar producto:", error);
    res.status(500).json({
      mensaje: "Error al guardar el producto en la base de datos",
      error: error.message || "Error interno del servidor",
    });
  }
};