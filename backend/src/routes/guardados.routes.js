
import { Router } from 'express'
import lugaresGuardados from '../data/guardados.js'

const router = Router()

// GET /api/guardados
router.get('/', (req, res) => {
  res.json(lugaresGuardados)
})

// GET /api/guardados/:id
router.get('/:id', (req, res) => {
  const id = Number(req.params.id)

  if (!Number.isSafeInteger(id) || id <= 0) {
    return res.status(400).json({
      error: 'El id debe ser un número entero positivo',
    })
  }

  const lugar = lugaresGuardados.find(
    (item) => item.id === id
  )

  if (!lugar) {
    return res.status(404).json({
      error: 'Lugar guardado no encontrado',
    })
  }

  res.json(lugar)
})

export default router
