
import React, { useEffect, useState } from "react";
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
    experiencia:
      datosRecibidos.experiencia || 'Letrero "LA PAZ"',
    fecha:
      datosRecibidos.fecha || "28 de octubre de 2026",
    horario:
      datosRecibidos.horario || "10:00 AM",
    participantes:
      datosRecibidos.participantes ?? 2,
    ubicacion:
      datosRecibidos.ubicacion || "Murillo, La Paz, Bolivia",
    notas:
      datosRecibidos.notas || "Presentarse 10 minutos antes.",
    guiaId:
      datosRecibidos.guiaId ?? 1,
    precioPorPersona:
      datosRecibidos.precioPorPersona ?? 80,
    tarifaServicio:
      datosRecibidos.tarifaServicio ?? 10,
    estado: "confirmada",
  };

  // Datos del guía desde la API
  const [guia, setGuia] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function cargarGuia() {
      try {
        setLoading(true);
        setError("");
        setGuia(null);

        const response = await fetch(
          `/api/guias/${reserva.guiaId}`,
          { signal: controller.signal }
        );

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("Guía no encontrado.");
          }

          if (response.status === 400) {
            throw new Error("Identificador del guía inválido.");
          }

          throw new Error("No se pudo cargar el guía.");
        }

        const data = await response.json();

        if (!data || Array.isArray(data) || !data.name) {
          throw new Error("Datos del guía inválidos.");
        }

        if (!controller.signal.aborted) {
          setGuia(data);
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

    cargarGuia();

    return () => controller.abort();
  }, [reserva.guiaId]);

  function irAlPago() {
    if (!guia || loading || error) return;

    navigate("/app/pago", {
      state: {
        reserva: {
          ...reserva,
          guia: guia.name,
        },
      },
    });
  }

  function confirmarEnEfectivo() {
    if (!guia || loading || error) return;

    navigate("/app/reserva-confirmada", {
      state: {
        reserva: {
          ...reserva,
          guia: guia.name,
          metodoPago: "Efectivo al guía",
          totalPagado:
            reserva.precioPorPersona * reserva.participantes +
            reserva.tarifaServicio,
          idReserva: `TL-${Math.floor(
            100000 + Math.random() * 900000
          )}`,
        },
      },
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
        {/* Detalles de la reserva */}
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

        {/* Guía obtenido desde la API */}
        <section className="confirm-reservation-page__section">
          <h2 className="confirm-reservation-page__section-title">
            Tu guía
          </h2>

          {loading && (
            <p role="status">
              Cargando información del guía...
            </p>
          )}

          {!loading && error && (
            <div role="alert">
              <strong>No se pudo cargar el guía</strong>
              <p>{error}</p>
            </div>
          )}

          {!loading && !error && guia && (
            <GuideCard
              foto={guia.avatar}
              nombre={guia.name}
              descripcion={guia.description}
              ubicacion={guia.location}
              calificacion={Number(guia.rating)}
              resenas={String(guia.reviews)}
              onVerPerfil={() =>
                navigate(`/guias/${guia.id}`)
              }
            />
          )}
        </section>

        {/* Precio */}
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

        {/* Política de cancelación */}
        <div className="confirm-reservation-page__policy">
          <span className="confirm-reservation-page__policy-icon">
            🛡️
          </span>

          <p className="confirm-reservation-page__policy-text">
            <strong>Cancelación flexible:</strong> Puedes cancelar
            sin costo hasta 24 horas antes del tour desde tu
            historial.
          </p>
        </div>

        {/* Acciones */}
        <div className="confirm-reservation-page__actions">
          <Button
            variant="primary"
            onClick={irAlPago}
            disabled={loading || Boolean(error) || !guia}
          >
            Seleccionar Método de Pago
          </Button>

          <Button
            variant="secondary"
            onClick={confirmarEnEfectivo}
            disabled={loading || Boolean(error) || !guia}
          >
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
