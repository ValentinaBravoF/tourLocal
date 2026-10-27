import React from "react";
import { useNavigate } from "react-router-dom";
import HeaderBar from "../components/HeaderBar/HeaderBar";
import GuideCard from "../components/GuideCard/GuideCard";
import Button from "../components/Button/Button";
import ReservationDetailCard from "../components/ReservationDetailCard/ReservationDetailCard";
import PriceSummary from "../components/PriceSummary/PriceSummary";
import "./ConfirmReservationPage.css";

export default function ConfirmReservationPage() {
  const navigate = useNavigate();

  return (
    <div className="confirm-reservation-page">
      <HeaderBar
        title="Confirmar Reserva"
        showBackButton={true}
        onBackClick={() => navigate(-1)}
      />

      <main className="confirm-reservation-page__content">
        {/* Detalles de la reserva */}
        <section className="confirm-reservation-page__section">
          <h2 className="confirm-reservation-page__section-title">
            Detalles de la reserva
          </h2>
          <ReservationDetailCard
            fecha="Miércoles, 18 Octubre, 2026"
            horario="06:30 AM"
            participantes="2 personas"
            ubicacion="Arashima, Kyoto, Japan"
            notas="-"
          />
        </section>

        {/* Tu guía */}
        <section className="confirm-reservation-page__section">
          <h2 className="confirm-reservation-page__section-title">Tu guía</h2>
          <GuideCard
            foto="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=120&auto=format&fit=crop"
            nombre="Hiroshi Tanaka"
            descripcion="Tu guía en Kyoto"
            ubicacion="La Paz, Bolivia"
            calificacion="4.9"
            resenas="320"
            onVerPerfil={() => navigate("/guias/1")}
          />
        </section>

        {/* Resumen del precio */}
        <section className="confirm-reservation-page__section">
          <h2 className="confirm-reservation-page__section-title">
            Resumen del precio
          </h2>
          <PriceSummary
            precioPorPersona="Bs. 80"
            participantes={2}
            tarifaServicio="Bs. 10"
            total="Bs. 170"
          />
        </section>

        {/* Botones de acción */}
        <div className="confirm-reservation-page__actions">
          <Button
            variant="primary"
            onClick={() => navigate("/reserva-confirmada")}
          >
            Confirmar Reserva
          </Button>
          <Button variant="secondary" onClick={() => navigate(-1)}>
            Modificar Reserva
          </Button>
        </div>
      </main>
    </div>
  );
}
