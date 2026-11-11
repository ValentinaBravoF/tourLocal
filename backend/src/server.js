import express from "express";
import destinationsRouter from "./routes/destinations.routes.js";
import reservationsRouter from "./routes/reservations.routes.js"; // <-- Faltaba este import

const app = express();
const PORT = 3000;

app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// Rutas
app.use("/api/destinos", destinationsRouter);
app.use("/api/tours", destinationsRouter);
app.use("/api/reservas", reservationsRouter);
// Ruta no encontrada (404)
app.use((req, res) => {
  res.status(404).json({ error: "Ruta no encontrada" });
});

app.listen(PORT, () => {
  console.log(`API de TourLocal en http://localhost:${PORT}`);
});
