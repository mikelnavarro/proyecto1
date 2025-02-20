const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Conectar a la base de datos SQLite
const db = new sqlite3.Database("foro.db", (err) => {
  if (err) console.error("Error al conectar la base de datos:", err);
  else console.log("Conectado a SQLite");
});

// Crear tabla si no existe
db.run(
  `CREATE TABLE IF NOT EXISTS mensajes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario TEXT,
    mensaje TEXT
  )`
);

// Ruta para obtener mensajes
app.get("/mensajes", (req, res) => {
  db.all("SELECT * FROM mensajes", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Ruta para enviar un mensaje
app.post("/mensajes", (req, res) => {
  const { usuario, mensaje } = req.body;
  db.run("INSERT INTO mensajes (usuario, mensaje) VALUES (?, ?)", [usuario, mensaje], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: this.lastID, usuario, mensaje });
  });
});

// Iniciar servidor
app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));
