import { pool } from "../config/conexion";
import { Producto } from "../models/productos";

let productosMemoria: Producto[] = [
  { id: 1, nombre: "cafe", precio: 2, cantidad: 1000 },
  { id: 2, nombre: "queso", precio: 5, cantidad: 1000 },
];

export async function listarProductos(): Promise<Producto[]> {
  try {
    const result = await pool.query("SELECT id, nombre, precio, cantidad FROM productos ORDER BY id ASC");
    return result.rows.map((row) => ({
      id: row.id,
      nombre: row.nombre,
      precio: Number(row.precio),
      cantidad: Number(row.cantidad),
    }));
  } catch (error: any) {
    console.warn("⚠️ Falló la consulta a PostgreSQL. Usando datos de productos en memoria:", error.message);
    return productosMemoria;
  }
}

export async function agregarProducto(p_producto: Producto): Promise<Producto> {
  try {
    const result = await pool.query(
      "INSERT INTO productos (nombre, precio, cantidad) VALUES ($1, $2, $3) RETURNING id, nombre, precio, cantidad",
      [p_producto.nombre, p_producto.precio, p_producto.cantidad]
    );
    return {
      id: result.rows[0].id,
      nombre: result.rows[0].nombre,
      precio: Number(result.rows[0].precio),
      cantidad: Number(result.rows[0].cantidad),
    };
  } catch (error: any) {
    console.warn("⚠️ Falló la inserción en PostgreSQL. Guardando en memoria:", error.message);
    const nuevoId = productosMemoria.length ? Math.max(...productosMemoria.map((p) => p.id ?? 0)) + 1 : 1;
    const nuevoProducto = { id: nuevoId, ...p_producto };
    productosMemoria.push(nuevoProducto);
    return nuevoProducto;
  }
}
