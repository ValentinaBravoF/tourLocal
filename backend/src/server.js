import express from 'express'
import destinationsRouter from './routes/destinations.routes.js'

const app = express()
const PORT = 3000

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' })
})

// Rutas de destinos turísticos y tours
app.use('/api/destinos', destinationsRouter)
app.use('/api/tours', destinationsRouter)

// Ruta no encontrada (404)
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' })
})

app.listen(PORT, () => {
  console.log(`API de TourLocal en http://localhost:${PORT}`)
})
