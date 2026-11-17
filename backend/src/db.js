import { DatabaseSync } from "node:sqlite";
import { fileURLToPath } from "node:url";

const db = new DatabaseSync(
  fileURLToPath(new URL("../tourlocal.db", import.meta.url)),
);

db.exec(`
  CREATE TABLE IF NOT EXISTS reservations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT NOT NULL,
    codigo TEXT NOT NULL UNIQUE,
    experiencia TEXT NOT NULL,
    fecha TEXT NOT NULL,
    horario TEXT NOT NULL,
    participantes INTEGER NOT NULL,
    total REAL NOT NULL,
    estado TEXT NOT NULL DEFAULT 'confirmada'
  )
`);
const reservationColumns = db.prepare("PRAGMA table_info(reservations)").all();
if (!reservationColumns.some((column) => column.name === "user_id")) {
  db.exec(
    "ALTER TABLE reservations ADD COLUMN user_id TEXT NOT NULL DEFAULT ''",
  );
}
db.exec(`
  CREATE TABLE IF NOT EXISTS saved_places (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT NOT NULL,
    destination_id INTEGER NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, destination_id)
  )
`);
const savedPlaceColumns = db.prepare("PRAGMA table_info(saved_places)").all();
if (!savedPlaceColumns.some((column) => column.name === "user_id")) {
  db.exec(`
    ALTER TABLE saved_places RENAME TO saved_places_legacy;
    CREATE TABLE saved_places (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT NOT NULL,
      destination_id INTEGER NOT NULL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(user_id, destination_id)
    );
    INSERT INTO saved_places (id, user_id, destination_id, created_at)
    SELECT id, '', destination_id, created_at FROM saved_places_legacy;
    DROP TABLE saved_places_legacy;
  `);
}
db.exec(`
  CREATE TABLE IF NOT EXISTS app_metadata (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
  )
`);
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    telefono TEXT,
    ciudad TEXT,
    fechaRegistro TEXT
  )
`);
let userColumns = db.prepare("PRAGMA table_info(users)").all();
const userColumnNames = new Set(userColumns.map((column) => column.name));

if (!userColumnNames.has("email") && userColumnNames.has("correo")) {
  db.exec("ALTER TABLE users RENAME COLUMN correo TO email");
}
if (!userColumnNames.has("password") && userColumnNames.has("contrasena")) {
  db.exec("ALTER TABLE users RENAME COLUMN contrasena TO password");
}

userColumns = db.prepare("PRAGMA table_info(users)").all();
const migratedUserColumnNames = new Set(
  userColumns.map((column) => column.name),
);
for (const column of ["telefono", "ciudad", "fechaRegistro"]) {
  if (!migratedUserColumnNames.has(column)) {
    db.exec(`ALTER TABLE users ADD COLUMN ${column} TEXT`);
  }
}

console.log("Base de datos conectada y tabla reservations lista");
export default db;
