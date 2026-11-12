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
      setLoading(true);
      setError("");
      setReserva(null);

      try {
        const response = await fetch(`/api/reservas/${id}`, {
          signal: controller.signal,
        });

        if (!response.ok) {
          if (response.status === 400) {
            throw new Error("El ID de la reserva no es válido.");
          }
          if (response.status === 404) {
            throw new Error("Reserva no encontrada.");
          }
          throw new Error("No se pudo obtener la información de la reserva.");
        }

        const data = await response.json();
        if (!data || typeof data !== "object" || Array.isArray(data)) {
          throw new Error("Los datos de la reserva no son válidos.");
        }

        if (!controller.signal.aborted) {
          setReserva(data);
        }
      } catch (err) {
        if (!controller.signal.aborted) {
          setError(
            err instanceof TypeError || err instanceof SyntaxError
              ? "No se pudo conectar con la API. Verifica que el backend esté encendido."
              : err instanceof Error
                ? err.message
                : "No se pudo cargar la reserva.",
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    cargarReserva();
    return () => controller.abort();
  }, [id]);

  function volver() {
    navigate("/historial");
  }

  const fechaTour = reserva
    ? parseTourDateTime(reserva.fecha, reserva.horario)
    : null;
  const esPasada =
    reserva?.tipo === "past" ||
    reserva?.estado === "completada" ||
    (reserva?.estado === "confirmada" &&
      fechaTour !== null &&
      fechaTour <= ahora);
  const puedeCancelar =
    reserva?.estado === "confirmada" &&
    fechaTour !== null &&
    fechaTour > ahora;
  const tituloEstado = esPasada
    ? "Experiencia realizada"
    : reserva?.estado === "cancelada"
      ? "Reserva cancelada"
      : puedeCancelar
        ? "Próxima experiencia"
        : "No se pudo validar la fecha";
  const descripcionEstado = esPasada
    ? "¡Esperamos que hayas disfrutado tu recorrido!"
    : reserva?.estado === "cancelada"
      ? "Esta reserva fue cancelada."
      : puedeCancelar
        ? "Puedes cancelar esta reserva antes de que comience el tour."
        : "Revisa los datos de fecha y hora de esta reserva.";
  const participantes = Number(reserva?.participantes) || 1;
  const precioPorPersona = Number(reserva?.precioPorPersona);
  const tarifaServicio = Number(reserva?.tarifaServicio) || 0;
  const total =
    reserva?.total == null ? Number.NaN : Number(reserva.total);
  const tienePrecio =
    Number.isFinite(total) ||
    (Number.isFinite(precioPorPersona) && precioPorPersona > 0);

  return (
    <div className="experience-detail-page">
      <header className="experience-detail-page__header">
        <button
          type="button"
          className="experience-detail-page__back"
          onClick={volver}
          aria-label="Volver al historial"
        >
          ←
        </button>
        <h1>Detalle de la experiencia</h1>
      </header>

      <main className="experience-detail-page__content">
        {loading && <p role="status">Cargando información de la reserva...</p>}

        {!loading && error && (
          <section role="alert">
            <h2>No se pudo cargar la experiencia</h2>
            <p>{error}</p>
            <Button variant="secondary" onClick={volver}>
              Volver al historial
            </Button>
          </section>
        )}

        {!loading && !error && reserva && (
          <>
            <section className="experience-detail-page__intro">
              <div className="experience-detail-page__status">
                <span className="experience-detail-page__check">
                  {esPasada ? "✓" : "•"}
                </span>
                <div>
                  <h2>{tituloEstado}</h2>
                  <p>{descripcionEstado}</p>
                </div>
              </div>
            </section>

            <section className="experience-detail-page__section">
              <ExperienceSummary
                destino={reserva.experiencia || reserva.nombre}
                imagen={reserva.imagen}
                ubicacion={reserva.ubicacion || "La Paz, Bolivia"}
                categoria={reserva.categoria || "EXPERIENCIA"}
                calificacion={reserva.calificacion || "4.9"}
                resenas={reserva.resenas || "248 reseñas"}
                estado={esPasada ? "realizada" : reserva.estado}
              />
            </section>

            <section className="experience-detail-page__section">
              <ReservationDetailCard
                titulo="Detalles de la reserva"
                fecha={formatTourDate(reserva.fecha)}
                horario={reserva.horario || "No registrado"}
                participantes={`${participantes} personas`}
                ubicacion={reserva.ubicacion || "La Paz, Bolivia"}
                notas={reserva.notas}
                estado={
                  reserva.estado === "cancelada" ? "cancelacion" : "normal"
                }
              />
            </section>

            {reserva.guia && (
              <section className="experience-detail-page__section">
                <h2 className="experience-detail-page__section-title">
                  Tu guía
                </h2>
                <p>{reserva.guia}</p>
                {reserva.guiaId && (
                  <Button
                    variant="secondary"
                    onClick={() => navigate(`/app/guias/${reserva.guiaId}`)}
                  >
                    Ver perfil del guía
                  </Button>
                )}
              </section>
            )}

            {tienePrecio && (
              <section className="experience-detail-page__section">
                <PriceSummary
                  titulo="Total de la reserva"
                  precioPorPersona={
                    Number.isFinite(precioPorPersona) && precioPorPersona > 0
                      ? precioPorPersona
                      : total / participantes
                  }
                  participantes={participantes}
                  tarifaServicio={tarifaServicio}
                  total={Number.isFinite(total) ? total : undefined}
                  variante="pagado"
                />
              </section>
            )}

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
              {esPasada && !reserva.hasRating && (
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
        )}
      </main>
    </div>
  );
}
