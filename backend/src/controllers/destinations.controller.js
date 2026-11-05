import destinations from '../data/destinations.js'

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

export function getDestinations(req, res) {
  const category = req.query.categoria || req.query.category || req.query.tipo || 'Todos'

  const isValid = VALID_CATEGORIES.some((cat) => normalize(cat) === normalize(category))

  if (!isValid) {
    return res.status(400).json({ error: 'Categoría no válida' })
  }

  const normalizedCategory = normalize(category)

  if (normalizedCategory === 'todos') {
    return res.json(destinations)
  }

  if (normalizedCategory === 'populares' || normalizedCategory === 'popular') {
    const popularDestinations = destinations.filter(
      (item) => item.rating >= 4.8 || normalize(item.category) === 'populares'
    )
    return res.json(popularDestinations)
  }

  const filtered = destinations.filter(
    (item) => normalize(item.category) === normalizedCategory
  )

  res.json(filtered)
}

export function getDestinationById(req, res) {
  const id = Number(req.params.id)

  if (Number.isNaN(id)) {
    return res.status(400).json({ error: 'El id debe ser un número' })
  }

  const destination = destinations.find((item) => item.id === id)

  if (!destination) {
    return res.status(404).json({ error: 'Destino no encontrado' })
  }

  res.json(destination)
}
