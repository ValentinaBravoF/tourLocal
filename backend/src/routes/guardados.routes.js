import { Router } from "express";
import db from "../db.js";
import destinations from "../data/destinations.js";
import { initialSavedIds } from "../data/guardados.js";

const router = Router();

const insertSavedPlace = db.prepare(
  "INSERT OR IGNORE INTO saved_places (destination_id) VALUES (?)",
);
const isSaved = db.prepare(
  "SELECT id FROM saved_places WHERE destination_id = ?",
);
const listSavedPlaces = db.prepare(
  "SELECT destination_id FROM saved_places ORDER BY id",
);
const removeSavedPlace = db.prepare(
  "DELETE FROM saved_places WHERE destination_id = ?",
);
const getMetadata = db.prepare("SELECT value FROM app_metadata WHERE key = ?");
const setMetadata = db.prepare(
  "INSERT INTO app_metadata (key, value) VALUES (?, ?)",
);

if (!getMetadata.get("initial_saved_places_seeded")) {
  for (const id of initialSavedIds) {
    insertSavedPlace.run(id);
  }
  setMetadata.run("initial_saved_places_seeded", "true");
}

function getDestination(id) {
  const destination = destinations.find((item) => item.id === id);
  if (!destination) return null;

  return {
    id: destination.id,
    nombre: destination.title,
    ubicacion: destination.location,
    calificacion: destination.rating,
    resenas: destination.reviews,
    imagen: destination.image,
  };
}

function parseId(value) {
  const id = Number(value);
  return Number.isSafeInteger(id) && id > 0 ? id : null;
}

router.get("/", (req, res) => {
  const lugares = listSavedPlaces
    .all()
    .map(({ destination_id: id }) => getDestination(id))
    .filter(Boolean);

  res.json(lugares);
});

router.get("/:id", (req, res) => {
  const id = parseId(req.params.id);
  if (id === null) {
    return res.status(400).json({
      error: "El id debe ser un número entero positivo",
    });
  }

  const lugar = isSaved.get(id) ? getDestination(id) : null;
  if (!lugar) {
    return res.status(404).json({
      error: "Lugar guardado no encontrado",
    });
  }

  return res.json(lugar);
});

router.post("/", (req, res) => {
  const id = parseId(req.body?.id);
  if (id === null) {
    return res.status(400).json({
      error: "Envía un id de destino válido",
    });
  }

  const lugar = getDestination(id);
  if (!lugar) {
    return res.status(404).json({ error: "Destino no encontrado" });
  }

  const result = insertSavedPlace.run(id);
  return res.status(result.changes > 0 ? 201 : 200).json(lugar);
});

router.delete("/:id", (req, res) => {
  const id = parseId(req.params.id);
  if (id === null) {
    return res.status(400).json({
      error: "El id debe ser un número entero positivo",
    });
  }

  const result = removeSavedPlace.run(id);
  if (result.changes === 0) {
    return res.status(404).json({ error: "El lugar no está guardado" });
  }

  return res.json({ id, guardado: false });
});

export default router;
