
import destinations from './destinations.js'

const savedIds = [1, 3]

const lugaresGuardados = destinations
  .filter((item) => savedIds.includes(item.id))
  .map((item) => ({
    id: item.id,
    nombre: item.title,
    ubicacion: item.location,
    calificacion: item.rating,
    resenas: item.reviews,
    imagen: item.image,
  }))

export default lugaresGuardados
