
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

import HeaderBar from "../components/HeaderBar/HeaderBar";
import GuideCard from "../components/GuideCard/GuideCard";
import Button from "../components/Button/Button";
import ReservationDetailCard from "../components/ReservationDetailCard/ReservationDetailCard";
import PriceSummary from "../components/PriceSummary/PriceSummary";

import "./ConfirmReservationPage.css";

export default function ConfirmReservationPage() {
  const navigate = useNavigate();
  const location = useLocation();

  // Datos recibidos desde Agendar visita
  const datosRecibidos = location.state || {};

  // Datos de ejemplo para el prototipo
  const reserva = {
    experienciaId: datosRecibidos.experienciaId ?? 1,
    experiencia: "Letrero LA PAZ",
    fecha: datosRecibidos.fecha || "28 de octubre de 2026",
    horario: datosRecibidos.horario || "10:00 AM",
    participantes: datosRecibidos.participantes ?? 2,
    ubicacion: "Murillo, La Paz, Bolivia",
    notas: "Presentarse 10 minutos antes.",
    guia: "María Fernández",
    guiaId: 1,
    precioPorPersona: 80,
    tarifaServicio: 10,
    estado: "confirmada",
  };

  function confirmarReserva() {
    navigate("/reserva-confirmada", {
      state: { reserva },
    });
  }

  return (
    <div className="confirm-reservation-page">
      <HeaderBar
        title="Confirmar Reserva"
        showBackButton={true}
        onBackClick={() => navigate(-1)}
      />

      <main className="confirm-reservation-page__content">
        <section className="confirm-reservation-page__section">
          <h2 className="confirm-reservation-page__section-title">
            Detalles de la reserva
          </h2>

          <ReservationDetailCard
            titulo=""
            fecha={reserva.fecha}
            horario={reserva.horario}
            participantes={`${reserva.participantes} personas`}
            ubicacion={reserva.ubicacion}
            notas={reserva.notas}
            estado="normal"
          />
        </section>

        <section className="confirm-reservation-page__section">
          <h2 className="confirm-reservation-page__section-title">
            Tu guía
          </h2>

          <GuideCard
            nombre={reserva.guia}
            descripcion="Guía local especializada en historia y cultura de La Paz."
            ubicacion="La Paz, Bolivia"
            calificacion={4.9}
            resenas={120}
            onVerPerfil={() => navigate(`/guias/${reserva.guiaId}`)}
          />
        </section>

        <section className="confirm-reservation-page__section">
          <h2 className="confirm-reservation-page__section-title">
            Resumen del precio
          </h2>

          <PriceSummary
            titulo=""
            precioPorPersona={reserva.precioPorPersona}
            participantes={reserva.participantes}
            tarifaServicio={reserva.tarifaServicio}
            variante="resumen"
          />
        </section>

        <div className="confirm-reservation-page__actions">
          <Button variant="primary" onClick={confirmarReserva}>
            Confirmar Reserva
          </Button>

          <Button
            variant="secondary"
            onClick={() => navigate(-1)}
          >
            Modificar Reserva
          </Button>
        </div>
      </main>
    </div>
  );
}
