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
      JSON.stringify(item.guide || null)
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
const countGuias = db
  .prepare("SELECT COUNT(*) AS total FROM guides")
  .get();

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
      guide.quote
    );
  }

  console.log("Se cargaron los guías iniciales en SQLite (Módulo Esther)");
}

console.log("Base de datos TourLocal conectada correctamente");

export default db;
