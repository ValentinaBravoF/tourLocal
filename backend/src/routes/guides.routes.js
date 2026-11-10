
import { Router } from 'express'
import guides from '../data/guides.js'

const router = Router()

// GET /api/guias
router.get('/', (req, res) => {
  res.json(guides)
})

// GET /api/guias/:id
router.get('/:id', (req, res) => {
  const id = Number(req.params.id)

  if (!Number.isSafeInteger(id) || id <= 0) {
    return res.status(400).json({
      error: 'El id debe ser un número entero positivo',
    })
  }

  const guide = guides.find((item) => item.id === id)

  if (!guide) {
    return res.status(404).json({
      error: 'Guía no encontrado',
    })
  }

  res.json(guide)
})

export default router
