import "./ExperienceSummary.css";

export default function ExperienceSummary({
  imagen,
  image = "https://images.unsplash.com/photo-1583535314398-3eb1a23424a9?q=80&w=200&auto=format&fit=crop",
  destino,
  title = 'Letrero "LA PAZ"',
  ubicacion,
  location = "Murillo, La Paz, Bolivia",
  categoria,
  category = "PARQUE MIRADOR",
  calificacion,
  rating = "4.9",
  resenas,
  reviews = "2,481 reseñas",
  estado = "resumen", // 'resumen' | 'realizada'
  textoBoton,
  onAction,
}) {
  const imgFinal = imagen || image;
  const tituloFinal = destino || title;
  const ubicacionFinal = ubicacion || location;
  const categoriaFinal = categoria || category;
  const calificacionFinal = calificacion || rating;
  const resenasFinal = resenas || reviews;

  const botonEtiqueta =
    textoBoton || (estado === "realizada" ? "Cambiar calificación" : null);

  return (
    <article className={`experience-summary experience-summary--${estado}`}>
      <div className="experience-summary__left">
        <img
          src={imgFinal}
          alt={tituloFinal}
          className="experience-summary__image"
        />

        <div className="experience-summary__info">
          <h3 className="experience-summary__title">{tituloFinal}</h3>
          <p className="experience-summary__location">{ubicacionFinal}</p>

          {categoriaFinal && (
            <span className="experience-summary__category">
              {categoriaFinal}
            </span>
          )}

          <p className="experience-summary__rating">
            <span className="experience-summary__star">★</span>
            <strong>{calificacionFinal}</strong>{" "}
            <span>({resenasFinal})</span>
          </p>
        </div>
      </div>

      {botonEtiqueta && (
        <button
          type="button"
          className="experience-summary__action-btn"
          onClick={onAction}
        >
          {botonEtiqueta}
        </button>
      )}
    </article>
  );
}