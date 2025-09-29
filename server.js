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

// Endpoint para crear cesta
app.post("/api/crear_cesta", async (req, res) => {
  try {
    const { usuario_id, producto_id, cantidad } = req.body;

    // Insertar en tabla cestas_productos
    const result = await pool.query(
      `INSERT INTO cestas_productos (usuario_id, producto_id, cantidad)
       VALUES ($1, $2, $3) RETURNING *`,
      [usuario_id, producto_id, cantidad]
    );

    res.json({ ok: true, cesta: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: err.message });
  }
});

// Endpoint para obtener cestas de un usuario
app.get("/api/cestas/:usuario_id", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM cestas_productos WHERE usuario_id = $1",
      [req.params.usuario_id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API escuchando en puerto ${PORT}`));

