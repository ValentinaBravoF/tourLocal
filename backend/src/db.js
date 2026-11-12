
import { DatabaseSync } from "node:sqlite";
import { fileURLToPath } from "node:url";
import horarios from "./data/horarios.js";

const db = new DatabaseSync(
  fileURLToPath(new URL("../tourlocal.db", import.meta.url)),
);

// ========================================
// TABLAS EXISTENTES DEL PROYECTO
// ========================================

// Reservas
db.exec(`
  CREATE TABLE IF NOT EXISTS reservations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    codigo TEXT NOT NULL UNIQUE,
    experiencia TEXT NOT NULL,
    fecha TEXT NOT NULL,
    horario TEXT NOT NULL,
    participantes INTEGER NOT NULL,
    total REAL NOT NULL,
    estado TEXT NOT NULL DEFAULT 'confirmada'
  )
`);

// Usuarios
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    correo TEXT NOT NULL UNIQUE,
    contrasena TEXT NOT NULL
  )
`);

// Lugares guardados
db.exec(`
  CREATE TABLE IF NOT EXISTS saved_places (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    destination_id INTEGER NOT NULL UNIQUE,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  )
`);

// Metadatos de la aplicación
db.exec(`
  CREATE TABLE IF NOT EXISTS app_metadata (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
  )
`);

// ========================================
// TABLA DE HORARIOS - NAOMI
// ========================================

// Crear la tabla schedules
db.exec(`
  CREATE TABLE IF NOT EXISTS schedules (
    id INTEGER PRIMARY KEY,
    time TEXT NOT NULL,
    period TEXT NOT NULL,
    status TEXT NOT NULL,
    remaining INTEGER
  )
`);

// Comprobar si ya existen horarios guardados
const resultado = db
  .prepare("SELECT COUNT(*) AS total FROM schedules")
  .get();

// Insertar los horarios iniciales solo si la tabla está vacía
if (resultado.total === 0) {
  const insertarHorario = db.prepare(`
    INSERT INTO schedules (
      id,
      time,
      period,
      status,
      remaining
    )
    VALUES (?, ?, ?, ?, ?)
  `);

  for (const horario of horarios) {
    insertarHorario.run(
      horario.id,
      horario.time,
      horario.period,
      horario.status,
      horario.remaining
    );
  }

  console.log("Se cargaron los horarios iniciales en SQLite");
}

console.log("Base de datos TourLocal conectada correctamente");

export default db;
