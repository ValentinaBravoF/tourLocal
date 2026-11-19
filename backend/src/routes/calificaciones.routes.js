
import { Router } from "express";
import db from "../db.js";

const router = Router();

// Crear la tabla si todavía no existe.
db.exec(`
  CREATE TABLE IF NOT EXISTS experience_ratings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    destination_id INTEGER NOT NULL,
    user_id TEXT NOT NULL,
    stars INTEGER NOT NULL CHECK (stars BETWEEN 1 AND 5),
    comment TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  )
`);

// Guardar una calificación nueva.
router.post("/", (req, res) => {
  try {
    const destinoId = Number(req.body?.destinoId);
    const estrellas = Number(req.body?.estrellas);
    const comentario = req.body?.comentario;

    if (!Number.isSafeInteger(destinoId) || destinoId <= 0) {
      return res.status(400).json({
        error: "El destino no es válido.",
      });
    }

    if (
      !Number.isInteger(estrellas) ||
      estrellas < 1 ||
      estrellas > 5
    ) {
      return res.status(400).json({
        error: "Debes seleccionar entre 1 y 5 estrellas.",
      });
    }

    if (
      typeof comentario !== "string" ||
      !comentario.trim() ||
      comentario.trim().length > 500
    ) {
      return res.status(400).json({
        error: "Escribe un comentario de hasta 500 caracteres.",
      });
    }

    const destino = db
      .prepare("SELECT id FROM destinations WHERE id = ?")
      .get(destinoId);

    if (!destino) {
      return res.status(404).json({
        error: "El destino no existe.",
      });
    }

    const resultado = db
      .prepare(`
        INSERT INTO experience_ratings
          (destination_id, user_id, stars, comment)
        VALUES (?, ?, ?, ?)
      `)
      .run(
        destinoId,
        req.userId,
        estrellas,
        comentario.trim()
      );

    const calificacion = db
      .prepare(`
        SELECT
          id,
          destination_id AS destinoId,
          stars AS estrellas,
          comment AS comentario,
          created_at AS fecha
        FROM experience_ratings
        WHERE id = ?
      `)
      .get(Number(resultado.lastInsertRowid));

    return res.status(201).json({
      mensaje: "Calificación guardada correctamente.",
      calificacion,
    });
  } catch (error) {
    console.error("Error al guardar calificación:", error);

    return res.status(500).json({
      error: "No se pudo guardar la calificación.",
    });
  }
});

// Consultar las calificaciones de un destino.
router.get("/", (req, res) => {
  try {
    const destinoId = Number(req.query.destinoId);

    if (!Number.isSafeInteger(destinoId) || destinoId <= 0) {
      return res.status(400).json({
        error: "Indica un destino válido.",
      });
    }

    const calificaciones = db
      .prepare(`
        SELECT
          id,
          destination_id AS destinoId,
          stars AS estrellas,
          comment AS comentario,
          created_at AS fecha
        FROM experience_ratings
        WHERE destination_id = ?
        ORDER BY id DESC
      `)
      .all(destinoId);

    return res.json(calificaciones);
  } catch (error) {
    console.error("Error al consultar calificaciones:", error);

    return res.status(500).json({
      error: "No se pudieron obtener las calificaciones.",
    });
  }
});

export default router;
