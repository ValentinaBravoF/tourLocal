
import { Router } from 'express'
import reservas from '../data/reservas.js'

const router = Router()

// GET /api/reservas
// Opcional: ?tipo=past o ?tipo=upcoming
router.get('/', (req, res) => {
  const { tipo } = req.query

  if (tipo && !['past', 'upcoming'].includes(tipo)) {
    return res.status(400).json({
      error: 'Tipo de reserva no válido',
    })
  }

  const resultado = tipo
    ? reservas.filter((reserva) => reserva.tipo === tipo)
    : reservas

  res.json(resultado)
})

// GET /api/reservas/:id
router.get('/:id', (req, res) => {
  const id = Number(req.params.id)

  if (!Number.isSafeInteger(id) || id <= 0) {
    return res.status(400).json({
      error: 'El id debe ser un número entero positivo',
    })
  }

  const reserva = reservas.find((item) => item.id === id)

  if (!reserva) {
    return res.status(404).json({
      error: 'Reserva no encontrada',
    })
  }

  res.json(reserva)
})

export default router
