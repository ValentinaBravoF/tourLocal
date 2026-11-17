import db from "../db.js";

export const getGuides = (req, res) => {
  try {
    const rows = db.prepare("SELECT * FROM guides ORDER BY id ASC").all();
    res.json(rows);
  } catch (error) {
    console.error("Error al obtener guías:", error);
    res.status(500).json({ error: "No se pudieron obtener los guías" });
  }
};

export const getGuideById = (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isSafeInteger(id) || id <= 0) {
      return res.status(400).json({ error: "El id debe ser un número entero positivo" });
    }

    const guide = db.prepare("SELECT * FROM guides WHERE id = ?").get(id);

    if (!guide) {
      return res.status(404).json({ error: "Guía no encontrado" });
    }

    res.json(guide);
  } catch (error) {
    console.error("Error al obtener el guía:", error);
    res.status(500).json({ error: "No se pudo obtener el perfil del guía" });
  }
};