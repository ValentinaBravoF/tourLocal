import db from "../db.js";

export const getSchedules = (req, res) => {
  try {
    const { status } = req.query;

    if (status !== undefined) {
      const estadosValidos = db
        .prepare("SELECT DISTINCT status FROM schedules")
        .all()
        .map((horario) => horario.status);

      if (!estadosValidos.includes(status)) {
        return res.status(400).json({
          error: "Estado no válido",
        });
      }

      const horarios = db
        .prepare(
          "SELECT * FROM schedules WHERE status = ? ORDER BY id"
        )
        .all(status);

      return res.json(horarios);
    }

    const horarios = db
      .prepare("SELECT * FROM schedules ORDER BY id")
      .all();

    return res.json(horarios);
  } catch (error) {
    console.error("Error al obtener horarios:", error);

    return res.status(500).json({
      error: "No se pudieron obtener los horarios",
    });
  }
};

export const getScheduleById = (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isSafeInteger(id) || id <= 0) {
      return res.status(400).json({
        error: "El id debe ser un número entero positivo",
      });
    }

    const horario = db
      .prepare("SELECT * FROM schedules WHERE id = ?")
      .get(id);

    if (!horario) {
      return res.status(404).json({
        error: "Horario no encontrado",
      });
    }

    return res.json(horario);
  } catch (error) {
    console.error("Error al obtener horario:", error);

    return res.status(500).json({
      error: "No se pudo obtener el horario",
    });
  }
};
