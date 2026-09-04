import "dotenv/config";
import { Pool } from "pg";

export const pool = new Pool(
  process.env.DATABASE_URL
    ? { connectionString: process.env.DATABASE_URL }
    : {
        user: process.env.DB_USER ?? "postgres",
        password: process.env.DB_PASSWORD ?? "2009",
        host: process.env.DB_HOST ?? "localhost",
        port: Number(process.env.DB_PORT ?? 5432),
        database: process.env.DB_NAME ?? "postgres",
        max: 10,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 5000,
      }
);

pool.on("error", (error) => {
  console.error("Error inesperado en el pool de PostgreSQL", error);
});

export async function inicializarBaseDeDatos() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id_usuario SERIAL PRIMARY KEY,
        nombre_usuario VARCHAR(100) NOT NULL,
        correo VARCHAR(150) NOT NULL UNIQUE,
        contrasena TEXT NOT NULL
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS productos (
        id SERIAL PRIMARY KEY,
        nombre VARCHAR(150) NOT NULL,
        precio NUMERIC(10, 2) NOT NULL,
        cantidad INT NOT NULL
      );
    `);

    const countResult = await pool.query("SELECT COUNT(*) FROM productos");
    if (parseInt(countResult.rows[0].count, 10) === 0) {
      await pool.query(`
        INSERT INTO productos (nombre, precio, cantidad) VALUES
        ('cafe', 2.00, 1000),
        ('queso', 5.00, 1000);
      `);
    }

    console.log("Base de datos inicializada correctamente");
  } catch (error) {
    console.error("No se pudo conectar a PostgreSQL. Verifica la base de datos.", error);
  }
}