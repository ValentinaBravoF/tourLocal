import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import HeaderBar from "../components/HeaderBar/HeaderBar";
import ExperienceCard from "../components/ExperienceCard/ExperienceCard";
import Button from "../components/Button/Button";
import StatusBadge from "../components/StatusBadge/StatusBadge";
import { formatTourDate, parseTourDateTime } from "../services/reservationDates";
import imagenPredeterminada from "../assets/hero.png";
import "./HistoryPage.css";

function normalizarNombre(nombre) {
  return String(nombre || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLocaleLowerCase("es");
}

function reemplazarImagenRota(event) {
  event.currentTarget.onerror = null;
  event.currentTarget.src = imagenPredeterminada;
}

export default function HistoryPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(
    location.state?.tab === "past" ? "past" : "upcoming",
  );
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [ahora] = useState(() => new Date());
  const nuevaReserva = location.state?.reserva;

  useEffect(() => {
    const controller = new AbortController();

    async function cargarReservas() {
      try {
        setLoading(true);
        setError("");

        const [reservasRes, destinosRes] = await Promise.all([
          fetch("/api/reservas", { signal: controller.signal }),
          fetch("/api/destinos", { signal: controller.signal }).catch(() => null),
        ]);

        const data = await reservasRes.json();
        let destinosLista = [];
        if (destinosRes && destinosRes.ok) {
          try {
            destinosLista = await destinosRes.json();
          } catch {
            destinosLista = [];
          }
        }

        if (!reservasRes.ok) {
          throw new Error(data.error || "No se pudieron cargar las reservas.");
        }
        if (!Array.isArray(data)) {
          throw new Error("La API devolvió un historial inválido.");
        }

        function buscarImagen(reserva) {
          if (reserva.imagen) return reserva.imagen;
          const nombre = normalizarNombre(reserva.experiencia || reserva.nombre);
          const destino = destinosLista.find(
            (item) =>
              normalizarNombre(item.title) === nombre ||
              normalizarNombre(item.name) === nombre,
          );
          return destino?.image || imagenPredeterminada;
        }

        if (!controller.signal.aborted) {
          setReservas(
            data.map((reserva) => ({
              ...reserva,
              imagen: buscarImagen(reserva),
            })),
          );
        }
      } catch (err) {
        if (!controller.signal.aborted) {
          setError(
            err instanceof TypeError || err instanceof SyntaxError
              ? "No se pudo conectar con la API de reservas. Verifica que esté encendida."
              : err instanceof Error
                ? err.message
                : "No se pudieron cargar las reservas.",
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

  const { upcomingList, pastExperiences } = useMemo(() => {
    const próximas = [];
    const pasadas = [];

    for (const reserva of reservas) {
      const fechaTour = parseTourDateTime(reserva.fecha, reserva.horario);
      const realizada =
        reserva.tipo === "past" ||
        reserva.estado === "completada" ||
        (reserva.estado === "confirmada" &&
          fechaTour !== null &&
          fechaTour <= ahora);
      const esProxima =
        reserva.estado !== "cancelada" &&
        (reserva.tipo === "upcoming" ||
          (reserva.estado === "confirmada" &&
            fechaTour !== null &&
            fechaTour > ahora));

      if (realizada) {
        pasadas.push(reserva);
      } else if (esProxima) {
        próximas.push(reserva);
      }
    }

    if (nuevaReserva) {
      const yaCargada = reservas.some(
        (reserva) =>
          (nuevaReserva.id != null &&
            String(reserva.id) === String(nuevaReserva.id)) ||
          (nuevaReserva.idReserva &&
            (reserva.codigo === nuevaReserva.idReserva ||
              reserva.idReserva === nuevaReserva.idReserva)),
      );

      if (!yaCargada) {
        próximas.unshift({
          id: nuevaReserva.id ?? nuevaReserva.idReserva ?? "temporal",
          nombre: nuevaReserva.experiencia || 'Letrero "LA PAZ"',
          guia: nuevaReserva.guia || "Diego Ramos",
          guiaId: nuevaReserva.guiaId,
          ubicacion: nuevaReserva.ubicacion || "Murillo, La Paz, Bolivia",
          fecha: nuevaReserva.fecha || "Fecha por confirmar",
          horario: nuevaReserva.horario || "Horario por confirmar",
          participantes: nuevaReserva.participantes ?? 2,
          estado: nuevaReserva.estado || "confirmada",
          imagen: nuevaReserva.imagen || obtenerImagenReserva(nuevaReserva),
          tipo: "upcoming",
          provisional: nuevaReserva.id == null,
        });
      }
    }

    return { upcomingList: próximas, pastExperiences: pasadas };
  }, [reservas, nuevaReserva, ahora]);

  function verDetalles(item) {
    navigate(`/experiencias/${item.id}`, { state: { reserva: item } });
  }

  function cancelar(item) {
    navigate(`/cancelar-reserva/${item.id}`, { state: { reserva: item } });
  }

  return (
    <div className="history-page">
      <HeaderBar
        title="Historial de Experiencias"
        showBackButton={true}
        onBackClick={() => navigate(-1)}
      />

      <main className="history-page__content">
        <div className="history-page__tabs">
          <button
            type="button"
            className={`history-page__tab ${
              activeTab === "upcoming" ? "history-page__tab--active" : ""
            }`}
            onClick={() => setActiveTab("upcoming")}
          >
            Próximas reservas ({upcomingList.length})
          </button>
          <button
            type="button"
            className={`history-page__tab ${
              activeTab === "past" ? "history-page__tab--active" : ""
            }`}
            onClick={() => setActiveTab("past")}
          >
            Historial ({pastExperiences.length})
          </button>
        </div>

        {loading && (
          <div className="history-page__empty" role="status">
            <p className="history-page__empty-title">
              Cargando tus reservas...
            </p>
          </div>
        )}

        {!loading && error && (
          <div className="history-page__empty" role="alert">
            <p className="history-page__empty-title">
              No se pudieron cargar las reservas
            </p>
            <p className="history-page__empty-desc">{error}</p>
          </div>
        )}

        {!loading && !error && (
          <>
            {activeTab === "upcoming" && (
              <div className="history-page__upcoming-list">
                {upcomingList.length ? (
                  upcomingList.map((item) => (
                    <article key={item.id} className="upcoming-card">
                      <div className="upcoming-card__header">
                        <img
                          src={item.imagen || obtenerImagenReserva(item)}
                          alt={item.nombre || item.experiencia}
                          className="upcoming-card__image"
                          onError={reemplazarImagenRota}
                        />
                        <div className="upcoming-card__info">
                          <div className="upcoming-card__badge-row">
                            <StatusBadge estado={item.estado} />
                          </div>
                          <h3 className="upcoming-card__title">
                            {item.nombre || item.experiencia}
                          </h3>
                          <p className="upcoming-card__guide">
                            Guía: {item.guia || "No asignado"}
                          </p>
                          <p className="upcoming-card__date">
                            📅 {formatTourDate(item.fecha)} · {item.horario}
                          </p>
                          <p className="upcoming-card__location">
                            📍 {item.ubicacion || "La Paz, Bolivia"}
                          </p>
                          {item.provisional && (
                            <p className="upcoming-card__guide">
                              Reserva provisional: aún no se guardó en el
                              servidor.
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
                      Explora los tours disponibles y agenda tu próxima
                      aventura.
                    </p>
                  </div>
                )}
              </div>
            )}

            {activeTab === "past" && (
              <div className="history-page__list">
                {pastExperiences.length ? (
                  pastExperiences.map((experiencia) => (
                    <ExperienceCard
                      key={experiencia.id}
                      imagen={experiencia.imagen || obtenerImagenReserva(experiencia)}
                      nombre={experiencia.nombre || experiencia.experiencia}
                      guia={experiencia.guia}
                      ubicacion={experiencia.ubicacion}
                      calificacion={
                        experiencia.hasRating
                          ? experiencia.calificacion
                          : undefined
                      }
                      fecha={formatTourDate(experiencia.fecha)}
                      estado={
                        experiencia.estado === "confirmada"
                          ? "realizada"
                          : experiencia.estado
                      }
                      onImageError={reemplazarImagenRota}
                      onVerDetalles={() => verDetalles(experiencia)}
                      onCalificar={
                        !experiencia.hasRating
                          ? () =>
                              navigate(
                                `/experiencias/${experiencia.id}/calificar`,
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

        <div className="history-page__action">
          <Button variant="primary" onClick={() => navigate("/explorar")}>
            Explorar más destinos
          </Button>
        </div>
      </main>
    </div>
  );
}
