
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import RatingBar from "../components/RatingBar/RatingBar";
import Button from "../components/Button/Button";

import "./RateExperiencePage.css";

export default function RateExperiencePage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [calificacion, setCalificacion] = useState(0);
  const [comentario, setComentario] = useState("");
  const [enviada, setEnviada] = useState(false);

  const experiencia = {
    nombre: "Recorrido por la Calle de las Brujas",
    lugar: "La Paz, Bolivia",
    guia: "María Fernández",
  };

  function enviarCalificacion(evento) {
    evento.preventDefault();

    if (calificacion === 0) return;

    // Por ahora guardamos la reseña solo en la página.
    // Más adelante se conectará al sistema de reservas.
    console.log("Reseña enviada:", {
      experienciaId: id,
      calificacion,
      comentario,
    });

    setEnviada(true);
  }

  return (
    <div className="rate-page">
      <header className="rate-page__header">
        <button
          type="button"
          className="rate-page__back"
          onClick={() => navigate(-1)}
          aria-label="Volver"
        >
          ←
        </button>

        <h1>Calificar experiencia</h1>
      </header>

      <main className="rate-page__content">
        <section className="rate-page__experience">
          <div className="rate-page__experience-icon">📍</div>

          <div>
            <h2>{experiencia.nombre}</h2>
            <p>{experiencia.lugar}</p>
            <p>Guía: {experiencia.guia}</p>
          </div>
        </section>

        {enviada ? (
          <section className="rate-page__success">
            <div className="rate-page__success-icon">✓</div>
            <h2>¡Gracias por tu calificación!</h2>
            <p>
              Tu opinión nos ayuda a mejorar las experiencias
              de TourLocal.
            </p>

            <Button onClick={() => navigate("/historial")}>
              Volver a mis experiencias
            </Button>
          </section>
        ) : (
          <form onSubmit={enviarCalificacion}>
            <section className="rate-page__rating">
              <h2>¿Qué te pareció la experiencia?</h2>
              <p>Selecciona la cantidad de estrellas.</p>

              <RatingBar
                variant="interactive"
                estrellasSeleccionadas={0}
                onChange={setCalificacion}
              />

              <span className="rate-page__rating-text">
                {calificacion === 0
                  ? "Selecciona una calificación"
                  : `${calificacion} de 5 estrellas`}
              </span>
            </section>

            <section className="rate-page__comment">
              <label htmlFor="comentario">
                Cuéntanos tu experiencia
              </label>

              <p>
                ¿Qué fue lo que más te gustó? Tu comentario
                puede ayudar a otros viajeros.
              </p>

              <textarea
                id="comentario"
                value={comentario}
                onChange={(evento) =>
                  setComentario(evento.target.value)
                }
                placeholder="Escribe tu comentario aquí..."
                rows={6}
                maxLength={500}
              />

              <span className="rate-page__counter">
                {comentario.length}/500 caracteres
              </span>
            </section>

            <div className="rate-page__footer">
              <Button
                type="submit"
                variant="primary"
                disabled={calificacion === 0}
              >
                Enviar calificación
              </Button>
            </div>
          </form>
        )}
      </main>
    </div>
  );
}
