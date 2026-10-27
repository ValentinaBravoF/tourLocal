
import "./GuideCard.css";

export default function GuideCard({
  foto,
  nombre,
  descripcion,
  ubicacion,
  calificacion,
  resenas,
  onVerPerfil,
}) {
  return (
    <article className="guide-card">
      <div className="guide-card__info">
        <img
          className="guide-card__photo"
          src={foto}
          alt={`Foto de ${nombre}`}
        />

        <div className="guide-card__details">
          <h3 className="guide-card__name">{nombre}</h3>

          <p className="guide-card__location">
            📍 {ubicacion}
          </p>

          <p className="guide-card__rating">
            <span className="guide-card__star">★</span>
            {calificacion} ({resenas} reseñas)
          </p>
        </div>
      </div>

      {descripcion && (
        <p className="guide-card__description">
          {descripcion}
        </p>
      )}

      {onVerPerfil && (
        <button
          type="button"
          className="guide-card__link"
          onClick={onVerPerfil}
        >
          Ver perfil
        </button>
      )}
    </article>
  );
}
