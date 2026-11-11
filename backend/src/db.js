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

console.log("Base de datos conectada y tabla reservations lista");
export default db;
