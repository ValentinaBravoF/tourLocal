
const reservas = [
  {
    id: 1,
    tipo: "past",
    nombre: "Calle de las Brujas",
    guia: "Marcos Salguero",
    ubicacion: "La Paz, Bolivia",
    calificacion: "4.9 (Tu calificación)",
    fecha: "18/04/2026",
    imagen:
      "https://images.unsplash.com/photo-1526392060635-9d6019884377?q=80&w=200&auto=format&fit=crop",
    hasRating: true,
    estado: "completada",
  },
  {
    id: 2,
    tipo: "past",
    nombre: "Barrio de Colores",
    guia: "Carla Flores",
    ubicacion: "La Paz, Bolivia",
    calificacion: "3 (Tu calificación)",
    fecha: "4/10/2023",
    imagen:
      "https://images.unsplash.com/photo-1583535314398-3eb1a23424a9?q=80&w=200&auto=format&fit=crop",
    hasRating: true,
    estado: "completada",
  },
  {
    id: 3,
    tipo: "past",
    nombre: "Valle de la Luna",
    guia: "Juan Yupanqui",
    ubicacion: "La Paz, Bolivia",
    fecha: "5/10/2023",
    imagen:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=200&auto=format&fit=crop",
    hasRating: false,
    estado: "completada",
  },
  {
    id: 101,
    tipo: "upcoming",
    nombre: 'Letrero "LA PAZ"',
    guia: "Diego Ramos",
    guiaId: 1,
    ubicacion: "Murillo, La Paz, Bolivia",
    fecha: "28 de octubre de 2026",
    horario: "10:00 AM",
    participantes: 2,
    estado: "confirmada",
    notas: "Presentarse 10 minutos antes.",
    precioPorPersona: 80,
    tarifaServicio: 10,
    categoria: "PARQUE MIRADOR",
    calificacion: 4.9,
    resenas: "2,481",
    imagen:
      "https://images.unsplash.com/photo-1583535314398-3eb1a23424a9?q=80&w=300&auto=format&fit=crop",
  },
]

export default reservas
