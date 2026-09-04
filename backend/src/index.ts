import express from "express";
import cors from "cors";
import { router as productoRouter } from "./router/producto.routes";
import { usuarioRouter } from "./router/usuario.router";
import { inicializarBaseDeDatos } from "./config/conexion";

export const app = express();
export const port = 3000;

app.use(cors());
app.use(express.json());
app.use(productoRouter);
app.use(usuarioRouter);

async function iniciarServidor() {
  await inicializarBaseDeDatos();

  app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
  });
}

iniciarServidor();