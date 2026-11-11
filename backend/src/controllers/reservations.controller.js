import db from "../db.js";

// GET: Lista todas las reservas (para el historial)
export function getReservations(req, res) {
  const rows = db.prepare("SELECT * FROM reservations ORDER BY id DESC").all();
  res.json(rows);
}

// GET por ID (para el detalle o cancelación)
export function getReservationById(req, res) {
  const { id } = req.params;
  const reserva = db.prepare("SELECT * FROM reservations WHERE id = ?").get(id);

  if (!reserva) return res.status(404).json({ error: "Reserva no encontrada" });
  res.json(reserva);
}

// POST: Crear una nueva reserva
export function createReservation(req, res) {
  const { experiencia, fecha, horario, participantes, total } = req.body;

  if (
    typeof experiencia !== "string" ||
    !experiencia.trim() ||
    typeof fecha !== "string" ||
    !fecha.trim() ||
    typeof horario !== "string" ||
    !horario.trim() ||
    !Number.isInteger(participantes) ||
    participantes < 1 ||
    typeof total !== "number" ||
    !Number.isFinite(total) ||
    total < 0
  ) {
    return res
      .status(400)
      .json({ error: "Los datos de la reserva no son válidos" });
  }

  // Generar código único (ej: TL-1234)
  const codigo = "TL-" + Math.floor(Math.random() * 9000 + 1000);

  try {
    const stmt = db.prepare(`
      INSERT INTO reservations (codigo, experiencia, fecha, horario, participantes, total) 
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    const result = stmt.run(
      codigo,
      experiencia,
      fecha,
      horario,
      participantes,
      total,
    );

    // 201 Created: devolver la reserva creada con su ID
    res.status(201).json({
      id: result.lastInsertRowid,
      codigo,
      experiencia,
      fecha,
      horario,
      participantes,
      total,
      estado: "confirmada",
    });
  } catch (error) {
    console.error("Error al guardar la reserva:", error);
    res.status(500).json({ error: "Error al guardar la reserva" });
  }
}

// DELETE: Cancelar una reserva
export function cancelReservation(req, res) {
  const { id } = req.params;

  const reserva = db.prepare("SELECT * FROM reservations WHERE id = ?").get(id);

  if (!reserva) return res.status(404).json({ error: "Reserva no encontrada" });

  if (reserva.estado === "cancelada") {
    return res.status(400).json({ error: "La reserva ya está cancelada" });
  }

  // Actualizamos el estado en lugar de borrar la fila
  db.prepare("UPDATE reservations SET estado = ? WHERE id = ?").run(
    "cancelada",
    id,
  );

  res.json({ ...reserva, estado: "cancelada" });
}
