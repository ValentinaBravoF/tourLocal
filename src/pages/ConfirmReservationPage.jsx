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

  const datosRecibidos = location.state || {};

  const reserva = {
    experienciaId: datosRecibidos.experienciaId ?? 1,
    experiencia: datosRecibidos.experiencia || 'Letrero "LA PAZ"',
    fecha: datosRecibidos.fecha || "28 de octubre de 2026",
    horario: datosRecibidos.horario || "10:00 AM",
    participantes: datosRecibidos.participantes ?? 2,
    ubicacion: datosRecibidos.ubicacion || "Murillo, La Paz, Bolivia",
    notas: datosRecibidos.notas || "Presentarse 10 minutos antes.",
    guia: datosRecibidos.guia || "María Fernández",
    guiaId: datosRecibidos.guiaId ?? 1,
    precioPorPersona: datosRecibidos.precioPorPersona ?? 80,
    tarifaServicio: datosRecibidos.tarifaServicio ?? 10,
    estado: "confirmada",
  };

  function irAlPago() {
    navigate("/app/pago", {
      state: { reserva },
    });
  }

  const confirmarEnEfectivo = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/reservas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          experiencia: reserva.experiencia,
          fecha: reserva.fecha,
          horario: reserva.horario,
          participantes: reserva.participantes,
          total:
            reserva.precioPorPersona * reserva.participantes +
            reserva.tarifaServicio,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        navigate("/app/reserva-confirmada", {
          state: {
            reserva: {
              ...reserva,
              metodoPago: "Efectivo al guía",
              totalPagado: data.total,
              idReserva: data.codigo, // Usamos el código que generó la API
              id: data.id,
            },
          },
        });
      } else {
        alert(data.error || "Error al crear la reserva");
      }
    } catch (error) {
      alert("No se pudo conectar con la API. ¿Está encendida?");
    }
  };

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
          <h2 className="confirm-reservation-page__section-title">Tu guía</h2>

          <GuideCard
            nombre={reserva.guia}
            descripcion="Guía local especializada en historia y cultura de La Paz."
            ubicacion="La Paz, Bolivia"
            calificacion={4.9}
            resenas={120}
            onVerPerfil={() => navigate(`/app/guias/${reserva.guiaId}`)}
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

        <div className="confirm-reservation-page__policy">
          <span className="confirm-reservation-page__policy-icon">🛡️</span>
          <p className="confirm-reservation-page__policy-text">
            <strong>Cancelación flexible:</strong> Puedes cancelar sin costo
            hasta 24 horas antes del tour desde tu historial.
          </p>
        </div>

        <div className="confirm-reservation-page__actions">
          <Button variant="primary" onClick={irAlPago}>
            Seleccionar Método de Pago
          </Button>

          <Button variant="secondary" onClick={confirmarEnEfectivo}>
            Confirmar y Pagar en Efectivo
          </Button>

          <button
            type="button"
            className="confirm-reservation-page__modify-btn"
            onClick={() => navigate(-1)}
          >
            Modificar fecha u horario
          </button>
        </div>
      </main>
    </div>
  );
}
