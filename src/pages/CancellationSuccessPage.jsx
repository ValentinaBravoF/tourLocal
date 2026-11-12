
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

import HeaderBar from "../components/HeaderBar/HeaderBar";
import Button from "../components/Button/Button";

import "./CancellationSuccessPage.css";

export default function CancellationSuccessPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const cancelacionExitosa = location.state?.cancelacionExitosa === true;

  return (
    <div className="cancellation-success-page">
      <HeaderBar
        title="Estado de cancelación"
        showBackButton={true}
        onBackClick={() => navigate("/historial")}
      />

      <main className="cancellation-success-page__content">

        <section className="cancellation-success-page__banner">
          <div className="cancellation-success-page__icon-wrap">
            <svg
              className="cancellation-success-page__icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="10" />
              {cancelacionExitosa ? (
                <polyline points="7 12 10 15 17 8" />
              ) : (
                <>
                  <line x1="12" y1="7" x2="12" y2="13" />
                  <circle cx="12" cy="17" r="1" />
                </>
              )}
            </svg>
          </div>

          <h1 className="cancellation-success-page__title">
            {cancelacionExitosa
              ? "¡Reserva cancelada!"
              : "No se encontró una cancelación"}
          </h1>

          <p className="cancellation-success-page__subtitle">
            {cancelacionExitosa
              ? "La reserva se canceló correctamente."
              : "Para cancelar una reserva, inicia la solicitud desde tus reservas. No se realizó ningún cambio."}
          </p>
        </section>

        <section className="cancellation-success-page__card">
          <h2 className="cancellation-success-page__card-title">
            Estado de la solicitud
          </h2>

          <div className="cancellation-success-page__row">
            <span className="cancellation-success-page__label">
              Cancelación:
            </span>

            <strong className="cancellation-success-page__value">
              {cancelacionExitosa ? "Cancelada" : "No realizada"}
            </strong>
          </div>

          <div className="cancellation-success-page__row">
            <span className="cancellation-success-page__label">
              Reembolso:
            </span>

            <span className="cancellation-success-page__value">
              {cancelacionExitosa
                ? "No se procesa automáticamente"
                : "No solicitado"}
            </span>
          </div>
        </section>

        <div className="cancellation-success-page__actions">
          <Button
            variant="primary"
            onClick={() => navigate("/historial")}
          >
            Ir a mi historial
          </Button>

          <Button
            variant="secondary"
            onClick={() => navigate("/explorar")}
          >
            Explorar otros destinos
          </Button>
        </div>
      </main>
    </div>
  );
}
