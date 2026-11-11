import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import HeaderBar from "../components/HeaderBar/HeaderBar";
import GuideCard from "../components/GuideCard/GuideCard";
import Button from "../components/Button/Button";
import ReservationDetailCard from "../components/ReservationDetailCard/ReservationDetailCard";
import PriceSummary from "../components/PriceSummary/PriceSummary";
import { saveReservation } from "../services/reservations";
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
  };

  const total =
    reserva.precioPorPersona * reserva.participantes + reserva.tarifaServicio;

  const confirmarEnEfectivo = async () => {
    try {
      const data = await saveReservation(reserva, total);
      navigate("/app/reserva-confirmada", {
        state: {
          reserva: {
            ...reserva,
            id: data.id,
            idReserva: data.codigo,
            metodoPago: "Efectivo al guía",
            totalPagado: data.total,
          },
        },
      });
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "No se pudo conectar con la API. ¿Está encendida?",
      );
    }
  };

  const irAlPago = () => {
    navigate("/app/pago", { state: { reserva } });
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
