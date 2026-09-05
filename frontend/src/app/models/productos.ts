export interface Producto {
  id?: number;
  nombre: string;
  precio: number;
  cantidad: number;
}

export interface ProductoResponse {
    message: string,
    productos: Producto[]
}