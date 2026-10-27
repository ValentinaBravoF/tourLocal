
import "./ExperienceCard.css";
import StatusBadge from "../StatusBadge/StatusBadge";

export default function ExperienceCard({
  imagen,
  nombre,
  guia,
  ubicacion,
  calificacion,
  resenas,
  fecha,
  estado,
  onVerDetalles,
  onCalificar,
}) {
  const estadoVisual =
    estado === "reservada" ? "confirmada" : estado;

  const textoEstado = estado
    ? estado.charAt(0).toUpperCase() + estado.slice(1)
    : "";

  return (
    <article className="experience-card">
      {imagen && (
        <img
          className="experience-card__image"
          src={imagen}
          alt={nombre}
        />
      )}

      <div className="experience-card__info">
        <h3 className="experience-card__name">{nombre}</h3>

        {guia && (
          <p className="experience-card__guide">
            Guía: {guia}
          </p>
        )}

        {ubicacion && (
          <p className="experience-card__location">
            <span aria-hidden="true">📍</span> {ubicacion}
          </p>
        )}

        {calificacion != null && (
          <p className="experience-card__rating">
            <span className="experience-card__star">★</span>
            {calificacion}
            {resenas != null && (
              <span> ({resenas} reseñas)</span>
            )}
          </p>
        )}

        {fecha && (
          <p className="experience-card__date">
            Realizada el {fecha}
          </p>
        )}

        {estado && (
          <StatusBadge
            estado={estadoVisual}
            texto={textoEstado}
          />
        )}

        {(onVerDetalles || onCalificar) && (
          <div className="experience-card__actions">
            {onVerDetalles && (
              <button
                type="button"
                className="experience-card__button"
                onClick={onVerDetalles}
              >
                Detalles
              </button>
            )}

            {onCalificar && (
              <button
                type="button"
                className="experience-card__button experience-card__button--secondary"
                onClick={onCalificar}
              >
                Calificar
              </button>
            )}
          </div>
        )}
      </div>
    </article>
  );
}
