import { Router } from "express";
import db from "../db.js";

const router = Router();

// GET /api/guias
router.get("/", (req, res) => {
  const rows = db.prepare("SELECT * FROM guides ORDER BY id ASC").all();
  res.json(rows);
});

// GET /api/guias/:id
router.get("/:id", (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isSafeInteger(id) || id <= 0) {
    return res.status(400).json({
      error: "El id debe ser un número entero positivo",
    });
  }

  const guide = db.prepare("SELECT * FROM guides WHERE id = ?").get(id);

  if (!guide) {
    return res.status(404).json({
      error: "Guía no encontrado",
    });
  }

  res.json(guide);
});

export default router;
