import { useState } from "react";
import "./RatingBar.css";

export default function RatingBar({
  calificacion,
  rating = 4.9,
  resenas,
  reviewsCount,
  estrellasSeleccionadas,
  variant = "readonly", // 'readonly' | 'interactive'
  etiqueta,
  label,
  onChange,
}) {
  const valorInicial =
    estrellasSeleccionadas ?? calificacion ?? rating ?? 5;
  const [seleccionadas, setSeleccionadas] = useState(
    Math.round(Number(valorInicial))
  );

  const esInteractivo = variant === "interactive" || variant === "seleccion";
  const puntajeMostrar = calificacion ?? rating;
  const resenasMostrar = resenas ?? reviewsCount;
  const textoEtiqueta = etiqueta ?? label;

  const estrellasActivas = esInteractivo
    ? seleccionadas
    : Math.round(Number(puntajeMostrar));

  const manejarClick = (valor) => {
    if (!esInteractivo) return;
    setSeleccionadas(valor);
    if (onChange) {
      onChange(valor);
    }
  };

  return (
    <div
      className={`rating-bar ${
        esInteractivo ? "rating-bar--interactive" : ""
      }`}
    >
      {textoEtiqueta && (
        <span className="rating-bar__label">{textoEtiqueta}</span>
      )}

      <div className="rating-bar__stars">
        {[1, 2, 3, 4, 5].map((estrella) => {
          const activa = estrella <= estrellasActivas;
          return (
            <button
              key={estrella}
              type="button"
              className={`rating-bar__star ${
                activa ? "rating-bar__star--active" : ""
              }`}
              onClick={() => manejarClick(estrella)}
              disabled={!esInteractivo}
              aria-label={`Calificar con ${estrella} estrellas`}
            >
              ★
            </button>
          );
        })}
      </div>

      {!esInteractivo && (
        <div className="rating-bar__meta">
          <strong className="rating-bar__score">{puntajeMostrar}</strong>
          {resenasMostrar !== undefined && (
            <span className="rating-bar__reviews">
              ({resenasMostrar} reseñas)
            </span>
          )}
        </div>
      )}
    </div>
  );
}