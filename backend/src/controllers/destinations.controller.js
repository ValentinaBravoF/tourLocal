import db from '../db.js'

const VALID_CATEGORIES = [
  'Todos',
  'Populares',
  'Popular',
  'Históricos',
  'Historicos',
  'Parques',
  'Senderismo',
  'Museos',
  'Naturaleza',
]

function normalize(str) {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

function toDestination(row) {
  if (!row) return null
  let guideObj = null
  if (row.guide) {
    try {
      guideObj = typeof row.guide === 'string' ? JSON.parse(row.guide) : row.guide
    } catch {
      guideObj = null
    }
  }
  return {
    ...row,
    guide: guideObj,
  }
}

export function getDestinations(req, res) {
  const category = req.query.categoria || req.query.category || req.query.tipo || 'Todos'

  const isValid = VALID_CATEGORIES.some((cat) => normalize(cat) === normalize(category))

  if (!isValid) {
    return res.status(400).json({ error: 'Categoría no válida' })
  }

  const normalizedCategory = normalize(category)

  let rows = []

  if (normalizedCategory === 'todos') {
    rows = db.prepare('SELECT * FROM destinations ORDER BY id ASC').all()
  } else if (normalizedCategory === 'populares' || normalizedCategory === 'popular') {
    rows = db.prepare("SELECT * FROM destinations WHERE rating >= 4.8 OR LOWER(category) = 'populares' ORDER BY rating DESC").all()
  } else {
    const allRows = db.prepare('SELECT * FROM destinations').all()
    rows = allRows.filter((r) => normalize(r.category) === normalizedCategory)
  }

  res.json(rows.map(toDestination))
}

export function getDestinationById(req, res) {
  const id = Number(req.params.id)

  if (!Number.isSafeInteger(id) || id <= 0) {
    return res.status(400).json({ error: 'El id debe ser un número entero positivo' })
  }

  const row = db.prepare('SELECT * FROM destinations WHERE id = ?').get(id)

  if (!row) {
    return res.status(404).json({ error: 'Destino no encontrado' })
  }

  res.json(toDestination(row))
}
