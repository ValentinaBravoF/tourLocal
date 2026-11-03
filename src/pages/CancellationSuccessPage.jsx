import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import HeaderBar from "../components/HeaderBar/HeaderBar";
import Button from "../components/Button/Button";
import "./CancellationSuccessPage.css";

export default function CancellationSuccessPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const reserva = location.state?.reserva || {
    experiencia: 'Letrero "LA PAZ"',
    fecha: "Miércoles, 18 de octubre de 2026",
    horario: "10:00 AM",
    guia: "María Fernández",
  };

  const [cancelId] = useState(
    () => `CAN-${Math.floor(10000 + Math.random() * 90000)}`
  );

  return (
    <div className="cancellation-success-page">
      <HeaderBar
        title="Cancelación de Reserva"
        showBackButton={true}
        onBackClick={() => navigate("/app/historial")}
      />

      <main className="cancellation-success-page__content">
        {/* Banner de Éxito de Cancelación */}
        <section className="cancellation-success-page__banner">
          <div className="cancellation-success-page__icon-wrap">
            <svg
              className="cancellation-success-page__icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--color-primary)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          </div>
          <h1 className="cancellation-success-page__title">
            ¡Reserva Cancelada con Éxito!
          </h1>
          <p className="cancellation-success-page__subtitle">
            Tu reserva ha sido dada de baja de tu calendario. Hemos enviado la confirmación a tu correo.
          </p>
        </section>

        {/* Resumen del tour cancelado */}
        <section className="cancellation-success-page__card">
          <h2 className="cancellation-success-page__card-title">
            Detalle de la cancelación
          </h2>
          <div className="cancellation-success-page__row">
            <span className="cancellation-success-page__label">Código:</span>
            <strong className="cancellation-success-page__value">{cancelId}</strong>
          </div>
          <div className="cancellation-success-page__row">
            <span className="cancellation-success-page__label">Experiencia:</span>
            <span className="cancellation-success-page__value">{reserva.experiencia}</span>
          </div>
          <div className="cancellation-success-page__row">
            <span className="cancellation-success-page__label">Fecha prevista:</span>
            <span className="cancellation-success-page__value">{reserva.fecha}</span>
          </div>
          <div className="cancellation-success-page__row">
            <span className="cancellation-success-page__label">Reembolso:</span>
            <span className="cancellation-success-page__refund-badge">100% procesado</span>
          </div>
        </section>

        {/* Botones de acción */}
        <div className="cancellation-success-page__actions">
          <Button
            variant="primary"
            onClick={() => navigate("/app/explorar")}
          >
            Explorar otros destinos
          </Button>

          <Button
            variant="secondary"
            onClick={() => navigate("/app/historial")}
          >
            Ir a mi Historial
          </Button>
        </div>
      </main>
    </div>
  );
}
