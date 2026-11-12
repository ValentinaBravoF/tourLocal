
import destinations from './destinations.js'

const guideNames = [
  'Diego Ramos',
  'Carlos Condori',
  'María Fernández',
  'Elena Choque',
]

const guides = guideNames.map((name, index) => {
  const destination = destinations.find(
    (item) => item.guide?.nombre === name
  )

  const original = destination?.guide || {}

  return {
    id: index + 1,
    name,
    location: original.ubicacion || 'La Paz, Bolivia',
    rating: Number(original.calificacion) || 4.9,
    reviews: original.resenas || '120',
    avatar: original.foto || '',
    description:
      name === 'Diego Ramos'
        ? 'Soy un guía local apasionado por compartir la historia, la cultura y los rincones auténticos de La Paz.'
        : 'Guía local que comparte experiencias culturales y turísticas en La Paz.',
    quote:
      name === 'Diego Ramos'
        ? 'Mi objetivo es que cada viajero sienta a La Paz como una historia de la que también forma parte.'
        : 'Descubre La Paz a través de experiencias locales.',
  }
})

export default guides
