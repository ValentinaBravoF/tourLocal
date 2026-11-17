import { DatabaseSync } from "node:sqlite";
import { fileURLToPath } from "node:url";
import destinations from "./data/destinations.js";
import guides from "./data/guides.js";
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

// Lugares guardados
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

// Metadatos de la aplicación
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
    fechaRegistro TEXT,
    foto TEXT
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
for (const column of ["telefono", "ciudad", "fechaRegistro", "foto"]) {
  if (!migratedUserColumnNames.has(column)) {
    db.exec(`ALTER TABLE users ADD COLUMN ${column} TEXT`);
  }
}

const countUsers = db.prepare("SELECT COUNT(*) AS total FROM users").get();
if (countUsers.total === 0) {
  db.prepare(`
    INSERT INTO users (nombre, email, password, telefono, ciudad, fechaRegistro, foto)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(
    "Sofía Martínez",
    "sofia.martinez@gmail.com",
    "supersecret123",
    "+591 76543210",
    "La Paz, Bolivia",
    "Octubre 2026",
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop"
  );
}

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
const resultado = db.prepare("SELECT COUNT(*) AS total FROM schedules").get();

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
      horario.remaining,
    );
  }

  console.log("Se cargaron los horarios iniciales en SQLite");
}

// ========================================
// TABLA DE DESTINOS TURÍSTICOS - ESTHER
// ========================================

// Crear la tabla destinations
db.exec(`
  CREATE TABLE IF NOT EXISTS destinations (
    id INTEGER PRIMARY KEY,
    title TEXT NOT NULL,
    name TEXT NOT NULL,
    location TEXT NOT NULL,
    image TEXT NOT NULL,
    tag TEXT NOT NULL,
    duration TEXT,
    category TEXT NOT NULL,
    rating REAL NOT NULL,
    reviews TEXT NOT NULL,
    description TEXT NOT NULL,
    price TEXT NOT NULL,
    guide TEXT
  )
`);

// Comprobar si ya existen destinos guardados
const countDestinos = db
  .prepare("SELECT COUNT(*) AS total FROM destinations")
  .get();

// Insertar los destinos iniciales solo si la tabla está vacía
if (countDestinos.total === 0) {
  const insertarDestino = db.prepare(`
    INSERT INTO destinations (
      id,
      title,
      name,
      location,
      image,
      tag,
      duration,
      category,
      rating,
      reviews,
      description,
      price,
      guide
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const item of destinations) {
    insertarDestino.run(
      item.id,
      item.title,
      item.name || item.title,
      item.location,
      item.image,
      item.tag || "Pase Libre",
      item.duration || "",
      item.category,
      item.rating,
      item.reviews,
      item.description,
      item.price || "Gratis",
      JSON.stringify(item.guide || null),
    );
  }

  console.log("Se cargaron los destinos iniciales en SQLite (Módulo Esther)");
}

// ========================================
// TABLA DE GUÍAS TURÍSTICOS - ESTHER
// ========================================

// Crear la tabla guides
db.exec(`
  CREATE TABLE IF NOT EXISTS guides (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    location TEXT NOT NULL,
    rating REAL NOT NULL,
    reviews TEXT NOT NULL,
    avatar TEXT NOT NULL,
    description TEXT NOT NULL,
    quote TEXT NOT NULL
  )
`);

// Comprobar si ya existen guías guardados
const countGuias = db.prepare("SELECT COUNT(*) AS total FROM guides").get();

// Insertar los guías iniciales solo si la tabla está vacía
if (countGuias.total === 0) {
  const insertarGuia = db.prepare(`
    INSERT INTO guides (
      id,
      name,
      location,
      rating,
      reviews,
      avatar,
      description,
      quote
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const guide of guides) {
    insertarGuia.run(
      guide.id,
      guide.name,
      guide.location,
      guide.rating,
      guide.reviews,
      guide.avatar,
      guide.description,
      guide.quote,
    );
  }

  console.log("Se cargaron los guías iniciales en SQLite (Módulo Esther)");
}

// Sincronizar avatars actualizados para Diego Ramos y Carlos Condori
try {
  db.prepare(
    "UPDATE guides SET avatar = ? WHERE name = 'Diego Ramos'"
  ).run("https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop");
  db.prepare(
    "UPDATE guides SET avatar = ? WHERE name = 'Carlos Condori'"
  ).run("https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop");

  for (const item of destinations) {
    if (item.guide) {
      db.prepare("UPDATE destinations SET guide = ? WHERE id = ?").run(
        JSON.stringify(item.guide),
        item.id,
      );
    }
  }
} catch {
  // Ignorar si hay algún problema de sincronización inicial
}

console.log("Base de datos TourLocal conectada correctamente");

export default db;
