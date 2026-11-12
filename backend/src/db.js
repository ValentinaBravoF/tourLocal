import { DatabaseSync } from "node:sqlite";
import { fileURLToPath } from "node:url";

const db = new DatabaseSync(
  fileURLToPath(new URL("../tourlocal.db", import.meta.url)),
);

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
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    correo TEXT NOT NULL UNIQUE,
    contrasena TEXT NOT NULL
  )
`);
db.exec(`
  CREATE TABLE IF NOT EXISTS saved_places (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    destination_id INTEGER NOT NULL UNIQUE,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  )
`);
db.exec(`
  CREATE TABLE IF NOT EXISTS app_metadata (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
  )
`);

console.log("Base de datos conectada y tabla reservations lista");
export default db;
