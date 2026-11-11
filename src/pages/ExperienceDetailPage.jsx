import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ExperienceSummary from "../components/ExperienceSummary/ExperienceSummary";
import ReservationDetailCard from "../components/ReservationDetailCard/ReservationDetailCard";
import PriceSummary from "../components/PriceSummary/PriceSummary";
import Button from "../components/Button/Button";
import {
  formatTourDate,
  parseTourDateTime,
} from "../services/reservationDates";
import "./ExperienceDetailPage.css";

export default function ExperienceDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [reserva, setReserva] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [ahora] = useState(() => new Date());

  useEffect(() => {
    const controller = new AbortController();

    async function cargarReserva() {
      try {
        const response = await fetch(`/api/reservas/${id}`, {
          signal: controller.signal,
        });
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "No se pudo cargar la reserva");
        }

        setReserva(data);
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Error al cargar el detalle de la reserva:", err);
          setError(
            err instanceof Error
              ? err.message
              : "No se pudo conectar con la API de reservas",
          );
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    cargarReserva();
    return () => controller.abort();
  }, [id]);

  const fechaTour = reserva
    ? parseTourDateTime(reserva.fecha, reserva.horario)
    : null;
  const puedeCancelar =
    reserva?.estado === "confirmada" &&
    fechaTour !== null &&
    fechaTour > ahora;
  const realizada =
    reserva?.estado === "confirmada" &&
    fechaTour !== null &&
    fechaTour <= ahora;

  const tituloEstado = realizada
    ? "Experiencia realizada"
    : reserva?.estado === "cancelada"
      ? "Reserva cancelada"
      : puedeCancelar
        ? "Próxima experiencia"
        : "No se pudo validar la fecha";
  const descripcionEstado = realizada
    ? "¡Esperamos que hayas disfrutado tu recorrido!"
    : reserva?.estado === "cancelada"
      ? "Esta reserva fue cancelada."
      : puedeCancelar
        ? "Puedes cancelar esta reserva antes de que comience el tour."
        : "Revisa los datos de fecha y hora de esta reserva.";

  return (
    <div className="experience-detail-page">
      <header className="experience-detail-page__header">
        <button
          type="button"
          className="experience-detail-page__back"
          onClick={() => navigate(-1)}
          aria-label="Volver"
        >
          ←
        </button>
        <h1>Detalle de experiencia</h1>
      </header>

      <main className="experience-detail-page__content">
        {loading ? (
          <p role="status">Cargando reserva...</p>
        ) : error ? (
          <p role="alert">{error}</p>
        ) : reserva ? (
          <>
            <section className="experience-detail-page__intro">
              <div className="experience-detail-page__status">
                <span className="experience-detail-page__check">
                  {realizada ? "✓" : "•"}
                </span>
                <div>
                  <h2>{tituloEstado}</h2>
                  <p>{descripcionEstado}</p>
                </div>
              </div>
            </section>

            <section className="experience-detail-page__section">
              <ExperienceSummary
                destino={reserva.experiencia}
                imagen="https://images.unsplash.com/photo-1583535314398-3eb1a23424a9?q=80&w=200&auto=format&fit=crop"
                ubicacion="La Paz, Bolivia"
                categoria="EXPERIENCIA"
                calificacion="4.9"
                resenas="248 reseñas"
                estado={reserva.estado}
              />
            </section>

            <section className="experience-detail-page__section">
              <ReservationDetailCard
                titulo="Detalles de la reserva"
                fecha={formatTourDate(reserva.fecha)}
                horario={reserva.horario}
                participantes={`${reserva.participantes} personas`}
                ubicacion="La Paz, Bolivia"
                estado={reserva.estado === "cancelada" ? "cancelacion" : "normal"}
              />
            </section>

            <section className="experience-detail-page__section">
              <PriceSummary
                titulo="Total de la reserva"
                precioPorPersona={reserva.total / reserva.participantes}
                participantes={reserva.participantes}
                tarifaServicio={0}
                variante="pagado"
              />
            </section>

            <div className="experience-detail-page__actions">
              {puedeCancelar && (
                <Button
                  variant="danger"
                  onClick={() =>
                    navigate(`/app/cancelar-reserva/${reserva.id}`, {
                      state: { reserva },
                    })
                  }
                >
                  Cancelar reserva
                </Button>
              )}
              {realizada && (
                <Button
                  variant="primary"
                  onClick={() =>
                    navigate(`/experiencias/${reserva.id}/calificar`)
                  }
                >
                  Calificar experiencia
                </Button>
              )}
              <button
                type="button"
                className="experience-detail-page__secondary"
                onClick={() => navigate("/explorar")}
              >
                Volver a explorar
              </button>
            </div>
          </>
        ) : null}
      </main>
    </div>
  );
}
