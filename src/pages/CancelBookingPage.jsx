
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import HeaderBar from "../components/HeaderBar/HeaderBar";
import Button from "../components/Button/Button";

import "./CancelBookingPage.css";

export default function CancelBookingPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [reserva, setReserva] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

          throw new Error(
            "No se pudo consultar la reserva."
          );
        }

        const data = await response.json();

        if (!data || Array.isArray(data) || !data.nombre) {
          throw new Error("Datos de reserva inválidos.");
        }

        if (!controller.signal.aborted) {
          setReserva(data);
        }
      } catch (err) {
        if (!controller.signal.aborted) {
          setError(
            err instanceof TypeError || err instanceof SyntaxError
              ? "No se pudo conectar con la API. Verifica que el backend esté encendido."
              : err.message
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

  return (
    <div className="cancel-page">
      <HeaderBar
        title="Cancelar Reserva"
        showBackButton={true}
        onBackClick={() => navigate(-1)}
      />

      <div className="cancel-page__content">
        <div className="cancel-page__alert-icon">
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--color-danger)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="15" y1="9" x2="9" y2="15" />
            <line x1="9" y1="9" x2="15" y2="15" />
          </svg>
        </div>

        <h2 className="cancel-page__title">
          Consultar cancelación
        </h2>

        {loading && (
          <p role="status">Cargando reserva...</p>
        )}

        {!loading && error && (
          <div role="alert">
            <h3>No se pudo cargar la reserva</h3>
            <p>{error}</p>

            <Button
              variant="secondary"
              onClick={() => navigate("/historial")}
            >
              Volver al historial
            </Button>
          </div>
        )}

        {!loading && !error && reserva && (
          <>
            {/* Información del lugar */}
            <div className="cancel-page__card cancel-page__place-card">
              {reserva.imagen && (
                <img
                  src={reserva.imagen}
                  alt={reserva.nombre}
                  className="cancel-page__place-img"
                />
              )}

              <div className="cancel-page__place-info">
                <h3>{reserva.nombre}</h3>
                <p>{reserva.ubicacion}</p>

                {reserva.categoria && (
                  <span className="cancel-page__badge">
                    {reserva.categoria}
                  </span>
                )}

                {reserva.calificacion && (
                  <p className="cancel-page__rating">
                    ★ {reserva.calificacion}
                    {reserva.resenas
                      ? ` (${reserva.resenas} reseñas)`
                      : ""}
                  </p>
                )}
              </div>
            </div>

            {/* Datos de la reserva */}
            <h3 className="cancel-page__section-title">
              Detalles de la reserva
            </h3>

            <div className="cancel-page__card cancel-page__details-card">
              <div className="cancel-page__row">
                <span>Fecha</span>
                <span>{reserva.fecha}</span>
              </div>

              <div className="cancel-page__row">
                <span>Horario</span>
                <span>{reserva.horario || "No registrado"}</span>
              </div>

              <div className="cancel-page__row">
                <span>Participantes</span>
                <span>
                  {reserva.participantes || "No registrado"}
                </span>
              </div>

              <div className="cancel-page__row">
                <span>Ubicación</span>
                <span>{reserva.ubicacion}</span>
              </div>

              <div className="cancel-page__row">
                <span>Notas</span>
                <span>{reserva.notas || "Sin notas"}</span>
              </div>
            </div>

            {/* Guía */}
            <h3 className="cancel-page__section-title">
              Guía de la reserva
            </h3>

            <div className="cancel-page__card cancel-page__guide-card">
              <div>
                <h4>{reserva.guia || "No registrado"}</h4>
                <p>Tu guía en La Paz</p>
              </div>

              {reserva.guiaId && (
                <button
                  type="button"
                  className="cancel-page__link"
                  onClick={() =>
                    navigate(`/guias/${reserva.guiaId}`)
                  }
                >
                  Ver perfil
                </button>
              )}
            </div>

            {/* Estado del proceso */}
            <div
              className="cancel-page__card"
              role="status"
            >
              <strong>Cancelación no disponible todavía</strong>

              <p>
                La reserva se puede consultar, pero todavía
                no es posible cancelarla desde el servidor.
                No se ha modificado tu reserva.
              </p>
            </div>

            <div className="cancel-page__actions">
              <Button
                variant="secondary"
                onClick={() => navigate("/historial")}
              >
                Volver a mis reservas
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
