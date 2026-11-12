import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import HeaderBar from "../components/HeaderBar/HeaderBar";
import Button from "../components/Button/Button";
import { formatTourDate } from "../services/reservationDates";
import "./CancelBookingPage.css";

export default function CancelBookingPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [reserva, setReserva] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancelando, setCancelando] = useState(false);
  const [errorCancelacion, setErrorCancelacion] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function cargarReserva() {
      try {
        setLoading(true);
        setError("");
        setReserva(null);

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
          throw new Error("No se pudo consultar la reserva.");
        }

        const data = await response.json();
        if (
          !data ||
          typeof data !== "object" ||
          Array.isArray(data) ||
          !(data.nombre || data.experiencia)
        ) {
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

  const nombre = reserva?.nombre || reserva?.experiencia;
  const yaCancelada = reserva?.estado === "cancelada";

  async function cancelarReserva() {
    if (!reserva || yaCancelada || cancelando) return;

    setCancelando(true);
    setErrorCancelacion("");

    try {
      const response = await fetch(`/api/reservas/${id}`, {
        method: "DELETE",
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "No se pudo cancelar la reserva.");
      }

      navigate("/app/cancelacion-exitosa", {
        state: {
          cancelacionExitosa: true,
          reserva: { ...reserva, ...data, estado: "cancelada" },
        },
      });
    } catch (err) {
      setErrorCancelacion(
        err instanceof TypeError || err instanceof SyntaxError
          ? "No se pudo conectar con la API. Verifica que el backend esté encendido."
          : err instanceof Error
            ? err.message
            : "No se pudo cancelar la reserva.",
      );
    } finally {
      setCancelando(false);
    }
  }

  return (
    <div className="cancel-page">
      <HeaderBar
        title="Cancelar Reserva"
        showBackButton={true}
        onBackClick={() => navigate(-1)}
      />

      <main className="cancel-page__content">
        <h2 className="cancel-page__title">Consultar cancelación</h2>

        {loading && <p role="status">Cargando reserva...</p>}

        {!loading && error && (
          <section role="alert">
            <h3>No se pudo cargar la reserva</h3>
            <p>{error}</p>
            <Button variant="secondary" onClick={() => navigate("/historial")}>
              Volver al historial
            </Button>
          </section>
        )}

        {!loading && !error && reserva && (
          <>
            <section className="cancel-page__card cancel-page__place-card">
              {reserva.imagen && (
                <img
                  src={reserva.imagen}
                  alt={nombre}
                  className="cancel-page__place-img"
                />
              )}
              <div className="cancel-page__place-info">
                <h3>{nombre}</h3>
                <p>{reserva.ubicacion || "La Paz, Bolivia"}</p>
                {reserva.categoria && (
                  <span className="cancel-page__badge">
                    {reserva.categoria}
                  </span>
                )}
                {reserva.calificacion && (
                  <p className="cancel-page__rating">
                    ★ {reserva.calificacion}
                    {reserva.resenas ? ` (${reserva.resenas} reseñas)` : ""}
                  </p>
                )}
              </div>
            </section>

            <h3 className="cancel-page__section-title">
              Detalles de la reserva
            </h3>
            <section className="cancel-page__card cancel-page__details-card">
              <div className="cancel-page__row">
                <span>Fecha</span>
                <span>{formatTourDate(reserva.fecha || "")}</span>
              </div>
              <div className="cancel-page__row">
                <span>Horario</span>
                <span>{reserva.horario || "No registrado"}</span>
              </div>
              <div className="cancel-page__row">
                <span>Participantes</span>
                <span>
                  {reserva.participantes
                    ? `${reserva.participantes} personas`
                    : "No registrado"}
                </span>
              </div>
              <div className="cancel-page__row">
                <span>Ubicación</span>
                <span>{reserva.ubicacion || "La Paz, Bolivia"}</span>
              </div>
              <div className="cancel-page__row">
                <span>Notas</span>
                <span>{reserva.notas || "Sin notas"}</span>
              </div>
            </section>

            {reserva.guia && (
              <>
                <h3 className="cancel-page__section-title">
                  Guía de la reserva
                </h3>
                <section className="cancel-page__card cancel-page__guide-card">
                  <div>
                    <h4>{reserva.guia}</h4>
                    <p>Tu guía en La Paz</p>
                  </div>
                  {reserva.guiaId && (
                    <button
                      type="button"
                      className="cancel-page__link"
                      onClick={() =>
                        navigate(`/app/guias/${reserva.guiaId}`)
                      }
                    >
                      Ver perfil
                    </button>
                  )}
                </section>
              </>
            )}

            {errorCancelacion && (
              <section className="cancel-page__card" role="alert">
                <strong>No se pudo cancelar la reserva</strong>
                <p>{errorCancelacion}</p>
              </section>
            )}

            {yaCancelada && (
              <section className="cancel-page__card" role="status">
                <strong>Esta reserva ya está cancelada.</strong>
              </section>
            )}

            {!yaCancelada && (
              <section className="cancel-page__card" role="note">
                <strong>
                  ¿Confirmas que quieres cancelar esta reserva?
                </strong>
                <p>
                  La cancelación está sujeta a las condiciones de la reserva.
                  El servidor confirmará si todavía puede cancelarse.
                </p>
              </section>
            )}

            <div className="cancel-page__actions">
              {!yaCancelada && (
                <Button
                  variant="danger"
                  onClick={cancelarReserva}
                  disabled={cancelando}
                >
                  {cancelando
                    ? "Cancelando reserva..."
                    : "Confirmar cancelación"}
                </Button>
              )}
              <Button
                variant="secondary"
                onClick={() => navigate("/historial")}
                disabled={cancelando}
              >
                Volver a mis reservas
              </Button>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
