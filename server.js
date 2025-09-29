import express from "express";
import pkg from "pg";

const { Pool } = pkg;

const app = express();
app.use(express.json());

// Configuración conexión DB
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  ssl: { rejectUnauthorized: false }
});

// Endpoint para crear cesta (solo id_producto y cantidad_producto)
app.post("/api/crear_cesta", async (req, res) => {
  try {
    const { id_producto, cantidad_producto } = req.body;

    // Insertar en tabla cestas_productos
    const result = await pool.query(
      `INSERT INTO cestas_productos (id_producto, cantidad_producto)
       VALUES ($1, $2) RETURNING id_producto, cantidad_producto`,
      [id_producto, cantidad_producto]
    );

    res.json({ ok: true, cesta: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: err.message });
  }
});

// Endpoint para obtener todas las cestas
app.get("/api/cestas", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id_producto, cantidad_producto FROM cestas_productos"
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API escuchando en puerto ${PORT}`));
