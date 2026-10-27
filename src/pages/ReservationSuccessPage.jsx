
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import HeaderBar from "../components/HeaderBar/HeaderBar";
import GuideCard from "../components/GuideCard/GuideCard";
import Button from "../components/Button/Button";
import ExperienceSummary from "../components/ExperienceSummary/ExperienceSummary";
import ReservationDetailCard from "../components/ReservationDetailCard/ReservationDetailCard";
import "./ReservationSuccessPage.css";

export default function ReservationSuccessPage() {
  const navigate = useNavigate();
  const location = useLocation();

  // Datos enviados desde ConfirmReservationPage
  const reserva = location.state?.reserva || {};

  return (
    <div className="reservation-success-page">
      <HeaderBar
        title="Confirmar Reserva"
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
            Tu experiencia ha sido reservada correctamente.
          </p>
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
            fecha={reserva.fecha || "28 de octubre de 2026"}
            horario={reserva.horario || "10:00 AM"}
            participantes={`${reserva.participantes ?? 2} personas`}
            ubicacion={reserva.ubicacion || "Murillo, La Paz, Bolivia"}
            notas={reserva.notas || "-"}
            estado="confirmada"
          />
        </section>

        {/* Ver mi reserva / Tu guía */}
        <section className="reservation-success-page__section">
          <h2 className="reservation-success-page__section-title">
            Ver mi reserva
          </h2>
          <GuideCard
            foto="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=120&auto=format&fit=crop"
            nombre="Diego Ramos"
            descripcion="Tu guía en La Paz"
            calificacion="4.9"
            resenas="320"
            onVerPerfil={() => navigate("/guias/2")}
          />
        </section>

        {/* Botones de acción */}
        <div className="reservation-success-page__actions">
          <Button
            variant="primary"
            onClick={() =>
              navigate("/app/historial", {
                state: { reserva },
              })
            }
          >
            Ver mi reserva
          </Button>

          <Button
            variant="danger"
            onClick={() =>
              navigate(`/app/cancelar-reserva/${reserva.experienciaId ?? 1}`, {
                state: { reserva },
              })
            }
          >
            Cancelar reserva
          </Button>

          <Button
            variant="secondary"
            onClick={() => navigate("/app/explorar")}
          >
            Volver al inicio
          </Button>
        </div>
      </main>
    </div>
  );
}
