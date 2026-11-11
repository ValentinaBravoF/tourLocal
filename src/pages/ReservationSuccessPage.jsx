import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import HeaderBar from "../components/HeaderBar/HeaderBar";
import GuideCard from "../components/GuideCard/GuideCard";
import Button from "../components/Button/Button";
import ExperienceSummary from "../components/ExperienceSummary/ExperienceSummary";
import ReservationDetailCard from "../components/ReservationDetailCard/ReservationDetailCard";
import { formatTourDate } from "../services/reservationDates";
import "./ReservationSuccessPage.css";

export default function ReservationSuccessPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const reserva = location.state?.reserva || {
    experienciaId: 1,
    experiencia: 'Letrero "LA PAZ"',
    fecha: "28 de octubre de 2026",
    horario: "10:00 AM",
    participantes: 2,
    ubicacion: "Murillo, La Paz, Bolivia",
    notas: "Presentarse 10 minutos antes del recorrido.",
    guia: "María Fernández",
    guiaId: 1,
    metodoPago: "QR Simple",
    totalPagado: 170,
    idReserva: "TL-582914",
    estado: "confirmada",
  };

  return (
    <div className="reservation-success-page">
      <HeaderBar
        title="Reserva Confirmada"
        showBackButton={true}
        onBackClick={() => navigate("/app/explorar")}
      />

      <main className="reservation-success-page__content">
        {/* Banner de Éxito */}
        <section className="reservation-success-page__banner">
          <div className="reservation-success-page__icon-wrap">
            <svg
              className="reservation-success-page__icon"
              viewBox="0 0 64 64"
              fill="none"
              stroke="var(--color-primary, #0f766e)"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="32" cy="32" r="28" />
              <polyline points="20 32 28 40 44 24" />
            </svg>
          </div>
          <h1 className="reservation-success-page__title">
            ¡Reserva Confirmada!
          </h1>
          <p className="reservation-success-page__subtitle">
            Tu experiencia ha sido reservada correctamente. Te esperamos con entusiasmo.
          </p>
          {reserva.idReserva && (
            <span className="reservation-success-page__code">
              Código de reserva: <strong>{reserva.idReserva}</strong>
            </span>
          )}
        </section>

        {/* Resumen de Experiencia */}
        <section className="reservation-success-page__experience">
          <ExperienceSummary
            imagen="https://images.unsplash.com/photo-1583535314398-3eb1a23424a9?q=80&w=200&auto=format&fit=crop"
            destino={reserva.experiencia || 'Letrero "LA PAZ"'}
            ubicacion={reserva.ubicacion || "Murillo, La Paz, Bolivia"}
            categoria="PARQUE MIRADOR"
            calificacion="4.9"
            resenas="2,481"
          />
        </section>

        {/* Detalles de la reserva */}
        <section className="reservation-success-page__section">
          <h2 className="reservation-success-page__section-title">
            Detalles de la reserva
          </h2>
          <ReservationDetailCard
            titulo=""
            fecha={formatTourDate(reserva.fecha || "28 de octubre de 2026")}
            horario={reserva.horario || "10:00 AM"}
            participantes={`${reserva.participantes ?? 2} personas`}
            ubicacion={reserva.ubicacion || "Murillo, La Paz, Bolivia"}
            notas={reserva.notas || "-"}
            estado="confirmada"
          />
        </section>

        {/* Pago y Guía */}
        {reserva.metodoPago && (
          <section className="reservation-success-page__payment-info">
            <div className="reservation-success-page__payment-row">
              <span>Método de pago:</span>
              <strong>{reserva.metodoPago}</strong>
            </div>
            {reserva.totalPagado && (
              <div className="reservation-success-page__payment-row">
                <span>Monto total:</span>
                <strong>Bs. {reserva.totalPagado}.00</strong>
              </div>
            )}
          </section>
        )}

        {/* Ver mi reserva / Tu guía */}
        <section className="reservation-success-page__section">
          <h2 className="reservation-success-page__section-title">
            Tu guía asignado
          </h2>
          <GuideCard
            foto="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop"
            nombre={reserva.guia || "María Fernández"}
            descripcion="Guía local especializada en historia, tradiciones y cultura paceña."
            calificacion="4.9"
            resenas="120"
            onVerPerfil={() => navigate(`/app/guias/${reserva.guiaId || 1}`)}
          />
        </section>

        {/* Botones de acción */}
        <div className="reservation-success-page__actions">
          <Button
            variant="primary"
            onClick={() =>
              navigate("/app/historial", {
                state: { tab: "upcoming", reserva },
              })
            }
          >
            Ver en mis reservas
          </Button>

          {reserva.id && (
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

          <Button variant="secondary" onClick={() => navigate("/app/explorar")}>
            Volver al inicio
          </Button>
        </div>
      </main>
    </div>
  );
}
