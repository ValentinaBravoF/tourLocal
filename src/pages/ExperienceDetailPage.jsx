
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import ReservationDetailCard from "../components/ReservationDetailCard/ReservationDetailCard";
import PriceSummary from "../components/PriceSummary/PriceSummary";
import Button from "../components/Button/Button";

import "./ExperienceDetailPage.css";

export default function ExperienceDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [experiencia, setExperiencia] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function cargarExperiencia() {
      setLoading(true);
      setError("");
      setExperiencia(null);

      try {
        const response = await fetch(`/api/reservas/${id}`, {
          signal: controller.signal,
        });

        if (!response.ok) {
          if (response.status === 400) {
            throw new Error("El ID de la reserva no es válido.");
          }

          if (response.status === 404) {
            throw new Error("Reserva no encontrada.");
          }

          throw new Error(
            "No se pudo obtener la información de la reserva."
          );
        }

        const data = await response.json();

        if (!data || Array.isArray(data) || !data.nombre) {
          throw new Error("Los datos de la reserva no son válidos.");
        }

        if (!controller.signal.aborted) {
          setExperiencia(data);
        }
      } catch (err) {
        if (!controller.signal.aborted) {
          const mensaje =
            err instanceof TypeError || err instanceof SyntaxError
              ? "No se pudo conectar con la API. Verifica que el backend esté encendido."
              : err.message;

          setError(mensaje);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    cargarExperiencia();

    return () => controller.abort();
  }, [id]);

  function volver() {
    navigate("/historial");
  }

  function irACalificar() {
    navigate(`/experiencias/${id}/calificar`);
  }

  return (
    <div className="experience-detail-page">
      <header className="experience-detail-page__header">
        <button
          type="button"
          className="experience-detail-page__back"
          onClick={volver}
          aria-label="Volver al historial"
        >
          ←
        </button>

        <h1>Detalle de la experiencia</h1>
      </header>

      <main
        className="experience-detail-page__content"
        style={{
          padding: "20px 16px",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
        }}
      >
        {/* Cargando */}
        {loading && (
          <p role="status">Cargando información de la reserva...</p>
        )}

        {/* Error 400, 404 o de conexión */}
        {!loading && error && (
          <section role="alert">
            <h2>No se pudo cargar la experiencia</h2>
            <p>{error}</p>

            <Button variant="secondary" onClick={volver}>
              Volver al historial
            </Button>
          </section>
        )}

        {/* Datos de la API */}
        {!loading && !error && experiencia && (
          <>
            {/* Imagen y lugar */}
            <section>
              {experiencia.imagen && (
                <img
                  src={experiencia.imagen}
                  alt={experiencia.nombre}
                  style={{
                    width: "100%",
                    maxHeight: "230px",
                    objectFit: "cover",
                    borderRadius: "12px",
                  }}
                />
              )}

              <h2>{experiencia.nombre}</h2>
              <p>{experiencia.ubicacion}</p>

              {experiencia.categoria && (
                <p>{experiencia.categoria}</p>
              )}

              {experiencia.calificacion && (
                <p>
                  ★ {experiencia.calificacion}
                  {experiencia.resenas
                    ? ` · ${experiencia.resenas} reseñas`
                    : ""}
                </p>
              )}

              <p>
                Estado:{" "}
                <strong>{experiencia.estado}</strong>
              </p>
            </section>

            {/* Detalles de reserva */}
            <section>
              <h3>Detalles de la reserva</h3>

              <ReservationDetailCard
                titulo=""
                fecha={experiencia.fecha}
                horario={experiencia.horario || "No registrado"}
                participantes={
                  experiencia.participantes
                    ? `${experiencia.participantes} personas`
                    : "No registrado"
                }
                ubicacion={experiencia.ubicacion}
                notas={
                  experiencia.notas ||
                  "Sin notas adicionales."
                }
                estado="normal"
              />
            </section>

            {/* Guía de la experiencia */}
            <section>
              <h3>Tu guía</h3>

              <p>
                {experiencia.guia || "Guía no registrado"}
              </p>

              {experiencia.guiaId && (
                <Button
                  variant="secondary"
                  onClick={() =>
                    navigate(`/guias/${experiencia.guiaId}`)
                  }
                >
                  Ver perfil del guía
                </Button>
              )}
            </section>

            {/* Precio si existe */}
            {experiencia.precioPorPersona != null && (
              <section>
                <h3>Resumen del precio</h3>

                <PriceSummary
                  titulo=""
                  precioPorPersona={experiencia.precioPorPersona}
                  participantes={experiencia.participantes || 1}
                  tarifaServicio={experiencia.tarifaServicio || 0}
                  variante="resumen"
                />
              </section>
            )}

            {/* Acciones según el tipo de reserva */}
            {experiencia.tipo === "upcoming" && (
              <Button
                variant="secondary"
                onClick={() =>
                  navigate(`/cancelar-reserva/${experiencia.id}`)
                }
              >
                Revisar cancelación
              </Button>
            )}

            {experiencia.tipo === "past" &&
              !experiencia.hasRating && (
                <Button
                  variant="primary"
                  onClick={irACalificar}
                >
                  Calificar experiencia
                </Button>
              )}

            <Button variant="secondary" onClick={volver}>
              Volver al historial
            </Button>
          </>
        )}
      </main>
    </div>
  );
}
