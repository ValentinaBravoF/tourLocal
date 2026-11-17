import React, { useState, useEffect } from "react";
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
    guiaId: 3,
    metodoPago: "QR Simple",
    totalPagado: 170,
    idReserva: "TL-582914",
    estado: "confirmada",
  };

  // ESTADOS PARA LA BASE DE DATOS
  const [guiaDb, setGuiaDb] = useState(null);
  const [destinoDb, setDestinoDb] = useState(null);

  useEffect(() => {
    async function jalarDatosReales() {
      try {
        // 1. Traer datos del guía por su ID
        if (reserva.guiaId) {
          const resGuia = await fetch(`/api/guias/${reserva.guiaId}`);
          if (resGuia.ok) setGuiaDb(await resGuia.json());
        }
        // 2. Traer datos del destino para la foto
        if (reserva.experienciaId) {
          const resDestino = await fetch(`/api/destinos/${reserva.experienciaId}`);
          if (resDestino.ok) setDestinoDb(await resDestino.json());
        }
      } catch (e) {
        console.error("Error cargando de BD", e);
      }
    }
    jalarDatosReales();
  }, [reserva.guiaId, reserva.experienciaId]);

  // Usar imagen de la BD si existe
  const imagenLugar = destinoDb?.image || reserva.imagen || "https://images.unsplash.com/photo-1583535314398-3eb1a23424a9?q=80&w=200&auto=format&fit=crop";

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
            <svg className="reservation-success-page__icon" viewBox="0 0 64 64" fill="none" stroke="var(--color-primary, #0f766e)" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="32" cy="32" r="28" />
              <polyline points="20 32 28 40 44 24" />
            </svg>
          </div>
          <h1 className="reservation-success-page__title">¡Reserva Confirmada!</h1>
          <p className="reservation-success-page__subtitle">
            Tu experiencia ha sido reservada correctamente. Te esperamos con entusiasmo.
          </p>
          {reserva.idReserva && (
            <span className="reservation-success-page__code">
              Código de reserva: <strong>{reserva.idReserva}</strong>
            </span>
          )}
        </section>

        {/* Resumen de Experiencia DINÁMICO */}
        <section className="reservation-success-page__experience">
          <ExperienceSummary
            imagen={imagenLugar}
            destino={reserva.experiencia}
            ubicacion={reserva.ubicacion || destinoDb?.location}
            categoria={destinoDb?.category || reserva.categoria || "EXPERIENCIA"}
            calificacion={destinoDb?.rating || reserva.calificacion || "4.9"}
            resenas={destinoDb?.reviews || reserva.resenas || "120"}
            estado="resumen"
          />
        </section>

        <section className="reservation-success-page__section">
          <h2 className="reservation-success-page__section-title">Detalles de la reserva</h2>
          <ReservationDetailCard
            titulo=""
            fecha={formatTourDate(reserva.fecha)}
            horario={reserva.horario}
            participantes={`${reserva.participantes} personas`}
            ubicacion={reserva.ubicacion || destinoDb?.location}
            notas={reserva.notas || "-"}
            estado="confirmada"
          />
        </section>

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

        {/* Guía Asignado DINÁMICO */}
        <section className="reservation-success-page__section">
          <h2 className="reservation-success-page__section-title">Tu guía asignado</h2>
          {guiaDb ? (
            <GuideCard
              foto={guiaDb.avatar}
              nombre={guiaDb.name}
              descripcion={guiaDb.description}
              calificacion={String(guiaDb.rating)}
              resenas={String(guiaDb.reviews)}
              onVerPerfil={() => navigate(`/app/guias/${guiaDb.id}`)}
            />
          ) : (
            <p>Cargando información del guía...</p>
          )}
        </section>

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
                navigate(`/app/cancelar-reserva/${reserva.id}`, { state: { reserva } })
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