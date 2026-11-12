import express from "express";
import destinationsRouter from "./routes/destinations.routes.js";
import schedulesRouter from "./routes/schedules.routes.js";
import guidesRouter from "./routes/guides.routes.js";
import guardadosRouter from "./routes/guardados.routes.js";
import reservationsRouter from "./routes/reservations.routes.js";
import db from "./db.js";

const app = express();
const PORT = 3000;

app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/destinos", destinationsRouter);
app.use("/api/tours", destinationsRouter);

// Horarios desde SQLite
app.use("/api/horarios", schedulesRouter);

app.use("/api/guias", guidesRouter);
app.use("/api/guardados", guardadosRouter);
app.use("/api/reservas", reservationsRouter);

// Atracciones cercanas desde la tabla destinations en SQLite (Módulo Esther)
app.get("/api/atracciones-cercanas", (req, res) => {
  const rows = db
    .prepare(
      "SELECT id, title, description, rating, reviews, category, image FROM destinations WHERE id IN (4, 5, 6, 8) ORDER BY id ASC"
    )
    .all();
  res.json(rows);
});

app.get("/api/atracciones-cercanas/:id", (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isSafeInteger(id) || id <= 0) {
    return res.status(400).json({
      error: "El id debe ser un número entero positivo",
    });
  }

  const atraccion = db
    .prepare(
      "SELECT id, title, description, rating, reviews, category, image FROM destinations WHERE id = ? AND id IN (4, 5, 6, 8)"
    )
    .get(id);

  if (!atraccion) {
    return res.status(404).json({
      error: "Atracción no encontrada",
    });
  }

  return res.json(atraccion);
});

app.use((req, res) => {
  res.status(404).json({
    error: "Ruta no encontrada",
  });
});

app.listen(PORT, () => {
  console.log(`API de TourLocal en http://localhost:${PORT}`);
});
