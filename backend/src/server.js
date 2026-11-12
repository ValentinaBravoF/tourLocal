import express from "express";
import destinationsRouter from "./routes/destinations.routes.js";
import horariosRouter from "./routes/horarios.routes.js";
import guidesRouter from "./routes/guides.routes.js";
import guardadosRouter from "./routes/guardados.routes.js";
import reservationsRouter from "./routes/reservations.routes.js";
import destinations from "./data/destinations.js";

const app = express();
const PORT = 3000;

app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/destinos", destinationsRouter);
app.use("/api/tours", destinationsRouter);
app.use("/api/horarios", horariosRouter);
app.use("/api/guias", guidesRouter);
app.use("/api/guardados", guardadosRouter);
app.use("/api/reservas", reservationsRouter);

const idsCercanos = [4, 5, 6, 8];
const atraccionesCercanas = destinations
  .filter((destino) => idsCercanos.includes(destino.id))
  .map((destino) => ({
    id: destino.id,
    title: destino.title,
    description: destino.description,
    rating: destino.rating,
    reviews: destino.reviews,
    category: destino.category,
    image: destino.image,
  }));

app.get("/api/atracciones-cercanas", (req, res) => {
  res.json(atraccionesCercanas);
});

app.get("/api/atracciones-cercanas/:id", (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isSafeInteger(id) || id <= 0) {
    return res.status(400).json({
      error: "El id debe ser un número entero positivo",
    });
  }

  const atraccion = atraccionesCercanas.find((item) => item.id === id);
  if (!atraccion) {
    return res.status(404).json({
      error: "Atracción no encontrada",
    });
  }

  return res.json(atraccion);
});

app.use((req, res) => {
  res.status(404).json({ error: "Ruta no encontrada" });
});

app.listen(PORT, () => {
  console.log(`API de TourLocal en http://localhost:${PORT}`);
});
