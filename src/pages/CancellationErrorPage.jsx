
import { useNavigate, useParams } from "react-router-dom";

import ReservationDetailCard from "../components/ReservationDetailCard/ReservationDetailCard";
import Button from "../components/Button/Button";

import "./CancellationErrorPage.css";

export default function CancellationErrorPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  // Datos de ejemplo mientras no exista conexión con reservas.
  const reserva = {
    experiencia: "Recorrido por la Calle de las Brujas",
    guia: "María Fernández",
    ubicacion: "Calle de las Brujas, La Paz",
    fecha: "Miércoles, 28 de octubre de 2026",
    horario: "10:00 AM",
    participantes: "2 personas",
  };

  function reintentarCancelacion() {
    // Regresar al formulario desde donde se intentó cancelar.
    if (id) {
      navigate(`/app/cancelar-reserva/${id}`);
    } else {
      navigate(-1);
    }
  }

  return (
    <div className="cancellation-error-page">
      <header className="cancellation-error-page__header">
        <button
          type="button"
          className="cancellation-error-page__back"
          onClick={() => navigate(-1)}
          aria-label="Volver"
        >
          ←
        </button>

        <h1>Cancelar reserva</h1>
      </header>

      <main className="cancellation-error-page__content">
        <section className="cancellation-error-page__message">
          <div className="cancellation-error-page__icon">
            !
          </div>

          <h2>No se pudo cancelar tu reserva</h2>

          <p>
            Ocurrió un problema al intentar cancelar
            tu reserva. Por favor, vuelve a intentarlo.
          </p>

          <div className="cancellation-error-page__notice">
            <span>ⓘ</span>
            <p>
              Tu reserva no ha sido cancelada.
              Puedes volver a intentarlo.
            </p>
          </div>
        </section>

        <section className="cancellation-error-page__experience">
          <h3>Experiencia</h3>

          <div className="cancellation-error-page__experience-card">
            <div className="cancellation-error-page__thumbnail">
              📍
            </div>

            <div>
              <h4>{reserva.experiencia}</h4>
              <p>{reserva.ubicacion}</p>
              <p>Guía: {reserva.guia}</p>
            </div>
          </div>
        </section>

        <ReservationDetailCard
          titulo="Detalles de la reserva"
          fecha={reserva.fecha}
          horario={reserva.horario}
          participantes={reserva.participantes}
          ubicacion={reserva.ubicacion}
          estado="normal"
        />

        <div className="cancellation-error-page__actions">
          <Button
            variant="primary"
            onClick={reintentarCancelacion}
          >
            Volver a intentar
          </Button>

          <button
            type="button"
            className="cancellation-error-page__secondary"
            onClick={() => navigate("/app/explorar")}
          >
            Volver a explorar
          </button>
        </div>
      </main>
    </div>
  );
}
