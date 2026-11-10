
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import HeaderBar from "../components/HeaderBar/HeaderBar";
import ExperienceCard from "../components/ExperienceCard/ExperienceCard";
import Button from "../components/Button/Button";
import StatusBadge from "../components/StatusBadge/StatusBadge";

import "./HistoryPage.css";

export default function HistoryPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const nuevaReserva = location.state?.reserva;

  const [activeTab, setActiveTab] = useState("upcoming");
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function cargarReservas() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch("/api/reservas", {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("No se pudieron obtener las reservas.");
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
          throw new Error("Los datos de las reservas no son válidos.");
        }

        if (!controller.signal.aborted) {
          setReservas(data);
        }
      } catch {
        if (!controller.signal.aborted) {
          setReservas([]);
          setError(
            "No se pudieron cargar las reservas. Verifica que la API de TourLocal esté encendida."
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    cargarReservas();

    return () => controller.abort();
  }, []);

  // Reservas que devuelve el backend
  const upcomingFromApi = useMemo(
    () => reservas.filter((item) => item.tipo === "upcoming"),
    [reservas]
  );

  const pastExperiences = useMemo(
    () => reservas.filter((item) => item.tipo === "past"),
    [reservas]
  );

  // Si otra pantalla envía una reserva por navegación,
  // se muestra de manera provisional.
  // Todavía no se guarda en el backend.
  const upcomingList = useMemo(() => {
    if (!nuevaReserva) {
      return upcomingFromApi;
    }

    const temporal = {
      id: nuevaReserva.idReserva || "temporal",
      nombre: nuevaReserva.experiencia || 'Letrero "LA PAZ"',
      guia: nuevaReserva.guia || "Diego Ramos",
      ubicacion:
        nuevaReserva.ubicacion || "Murillo, La Paz, Bolivia",
      fecha: nuevaReserva.fecha || "Fecha por confirmar",
      horario: nuevaReserva.horario || "Horario por confirmar",
      participantes: nuevaReserva.participantes || 2,
      estado: nuevaReserva.estado || "confirmada",
      imagen:
        "https://images.unsplash.com/photo-1583535314398-3eb1a23424a9?q=80&w=300&auto=format&fit=crop",
      tipo: "upcoming",
      provisional: true,
    };

    return [temporal, ...upcomingFromApi];
  }, [nuevaReserva, upcomingFromApi]);

  function verDetalles(item) {
    navigate(`/experiencias/${item.id}`, {
      state: { reserva: item },
    });
  }

  function cancelar(item) {
    navigate(`/cancelar-reserva/${item.id}`, {
      state: { reserva: item },
    });
  }

  return (
    <div className="history-page">
      <HeaderBar
        title="Mis Reservas e Historial"
        showBackButton={true}
        onBackClick={() => navigate(-1)}
      />

      <main className="history-page__content">
        {/* Pestañas */}
        <div className="history-page__tabs">
          <button
            type="button"
            className={`history-page__tab ${
              activeTab === "upcoming"
                ? "history-page__tab--active"
                : ""
            }`}
            onClick={() => setActiveTab("upcoming")}
          >
            Próximas reservas ({upcomingList.length})
          </button>

          <button
            type="button"
            className={`history-page__tab ${
              activeTab === "past"
                ? "history-page__tab--active"
                : ""
            }`}
            onClick={() => setActiveTab("past")}
          >
            Historial ({pastExperiences.length})
          </button>
        </div>

        {/* Cargando */}
        {loading && (
          <div className="history-page__empty" role="status">
            <p className="history-page__empty-title">
              Cargando tus reservas...
            </p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="history-page__empty" role="alert">
            <p className="history-page__empty-title">
              No se pudieron cargar las reservas
            </p>
            <p className="history-page__empty-desc">
              {error}
            </p>
          </div>
        )}

        {!loading && !error && (
          <>
            {/* Próximas reservas */}
            {activeTab === "upcoming" && (
              <div className="history-page__upcoming-list">
                {upcomingList.length > 0 ? (
                  upcomingList.map((item) => (
                    <article
                      key={item.id}
                      className="upcoming-card"
                    >
                      <div className="upcoming-card__header">
                        <img
                          src={item.imagen}
                          alt={item.nombre}
                          className="upcoming-card__image"
                        />

                        <div className="upcoming-card__info">
                          <div className="upcoming-card__badge-row">
                            <StatusBadge estado={item.estado} />
                          </div>

                          <h3 className="upcoming-card__title">
                            {item.nombre}
                          </h3>

                          <p className="upcoming-card__guide">
                            Guía: {item.guia}
                          </p>

                          <p className="upcoming-card__date">
                            📅 {item.fecha} · {item.horario}
                          </p>

                          <p className="upcoming-card__location">
                            📍 {item.ubicacion}
                          </p>

                          {item.provisional && (
                            <p className="upcoming-card__guide">
                              Reserva provisional: aún no se guardó en el servidor.
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="upcoming-card__actions">
                        <Button
                          variant="primary"
                          onClick={() => verDetalles(item)}
                        >
                          Ver Detalles
                        </Button>

                        <Button
                          variant="secondary"
                          onClick={() => cancelar(item)}
                        >
                          Cancelar Reserva
                        </Button>
                      </div>
                    </article>
                  ))
                ) : (
                  <div className="history-page__empty">
                    <p className="history-page__empty-title">
                      No tienes reservas próximas agendadas
                    </p>

                    <p className="history-page__empty-desc">
                      Explora los tours disponibles y agenda tu próxima aventura.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Historial de experiencias pasadas */}
            {activeTab === "past" && (
              <div className="history-page__list">
                {pastExperiences.length > 0 ? (
                  pastExperiences.map((exp) => (
                    <ExperienceCard
                      key={exp.id}
                      imagen={exp.imagen}
                      nombre={exp.nombre}
                      guia={exp.guia}
                      ubicacion={exp.ubicacion}
                      calificacion={
                        exp.hasRating
                          ? exp.calificacion
                          : undefined
                      }
                      fecha={exp.fecha}
                      onVerDetalles={() => verDetalles(exp)}
                      onCalificar={
                        !exp.hasRating
                          ? () =>
                              navigate(
                                `/experiencias/${exp.id}/calificar`
                              )
                          : undefined
                      }
                    />
                  ))
                ) : (
                  <div className="history-page__empty">
                    <p className="history-page__empty-title">
                      Todavía no tienes experiencias pasadas
                    </p>
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {/* Botón inferior */}
        <Button
          variant="primary"
          onClick={() => navigate("/explorar")}
        >
          Explorar más destinos
        </Button>
      </main>
    </div>
  );
}
