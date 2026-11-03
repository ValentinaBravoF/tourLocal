import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import HeaderBar from "../components/HeaderBar/HeaderBar";
import ExperienceCard from "../components/ExperienceCard/ExperienceCard";
import Button from "../components/Button/Button";
import StatusBadge from "../components/StatusBadge/StatusBadge";
import "./HistoryPage.css";

const PAST_EXPERIENCES = [
  {
    id: 1,
    nombre: "Calle de las Brujas",
    guia: "Marcos Salguero",
    ubicacion: "La Paz, Bolivia",
    calificacion: "4.9 (Tu calificación)",
    fecha: "18/04/2026",
    imagen:
      "https://images.unsplash.com/photo-1526392060635-9d6019884377?q=80&w=200&auto=format&fit=crop",
    hasRating: true,
  },
  {
    id: 2,
    nombre: "Barrio de Colores",
    guia: "Carla Flores",
    ubicacion: "La Paz, Bolivia",
    calificacion: "3 (Tu calificación)",
    fecha: "4/10/2023",
    imagen:
      "https://images.unsplash.com/photo-1583535314398-3eb1a23424a9?q=80&w=200&auto=format&fit=crop",
    hasRating: true,
  },
  {
    id: 3,
    nombre: "Valle de la Luna",
    guia: "Juan Yupanqui",
    ubicacion: "La Paz, Bolivia",
    fecha: "5/10/2023",
    imagen:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=200&auto=format&fit=crop",
    hasRating: false,
  },
];

const INITIAL_UPCOMING = [
  {
    id: 101,
    nombre: 'Letrero "LA PAZ"',
    guia: "Diego Ramos",
    ubicacion: "Murillo, La Paz, Bolivia",
    fecha: "28 de octubre de 2026",
    horario: "10:00 AM",
    participantes: 2,
    estado: "confirmada",
    imagen:
      "https://images.unsplash.com/photo-1583535314398-3eb1a23424a9?q=80&w=300&auto=format&fit=crop",
  },
];

export default function HistoryPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const nuevaReserva = location.state?.reserva;
  const initialTab =
    location.state?.tab === "upcoming" || nuevaReserva
      ? "upcoming"
      : "upcoming";

  const [activeTab, setActiveTab] = useState(initialTab);

  // Combinar reservas activas
  const upcomingList = React.useMemo(() => {
    if (nuevaReserva) {
      return [
        {
          id: nuevaReserva.experienciaId || 102,
          nombre: nuevaReserva.experiencia || 'Letrero "LA PAZ"',
          guia: nuevaReserva.guia || "Diego Ramos",
          ubicacion: nuevaReserva.ubicacion || "Murillo, La Paz, Bolivia",
          fecha: nuevaReserva.fecha || "28 de octubre de 2026",
          horario: nuevaReserva.horario || "10:00 AM",
          participantes: nuevaReserva.participantes || 2,
          estado: nuevaReserva.estado || "confirmada",
          imagen:
            "https://images.unsplash.com/photo-1583535314398-3eb1a23424a9?q=80&w=300&auto=format&fit=crop",
        },
        ...INITIAL_UPCOMING,
      ];
    }
    return INITIAL_UPCOMING;
  }, [nuevaReserva]);

  return (
    <div className="history-page">
      <HeaderBar
        title="Mis Reservas e Historial"
        showBackButton={true}
        onBackClick={() => navigate(-1)}
      />

      <main className="history-page__content">
        {/* Pestañas de Navegación: Próximas vs Pasadas */}
        <div className="history-page__tabs">
          <button
            type="button"
            className={`history-page__tab ${activeTab === "upcoming" ? "history-page__tab--active" : ""}`}
            onClick={() => setActiveTab("upcoming")}
          >
            Próximas reservas ({upcomingList.length})
          </button>
          <button
            type="button"
            className={`history-page__tab ${activeTab === "past" ? "history-page__tab--active" : ""}`}
            onClick={() => setActiveTab("past")}
          >
            Historial ({PAST_EXPERIENCES.length})
          </button>
        </div>

        {/* Contenido pestaña: Próximas Reservas */}
        {activeTab === "upcoming" && (
          <div className="history-page__upcoming-list">
            {upcomingList.length > 0 ? (
              upcomingList.map((item) => (
                <article key={item.id} className="upcoming-card">
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
                      <h3 className="upcoming-card__title">{item.nombre}</h3>
                      <p className="upcoming-card__guide">Guía: {item.guia}</p>
                      <p className="upcoming-card__date">
                        📅 {item.fecha} · {item.horario}
                      </p>
                      <p className="upcoming-card__location">
                        📍 {item.ubicacion}
                      </p>
                    </div>
                  </div>

                  <div className="upcoming-card__actions">
                    <Button
                      variant="primary"
                      onClick={() => navigate(`/app/experiencias/${item.id}`)}
                    >
                      Ver Detalles
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() =>
                        navigate(`/app/cancelar-reserva/${item.id}`, {
                          state: { reserva: item },
                        })
                      }
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

        {/* Contenido pestaña: Historial de Experiencias Pasadas */}
        {activeTab === "past" && (
          <div className="history-page__list">
            {PAST_EXPERIENCES.map((exp) => (
              <ExperienceCard
                key={exp.id}
                imagen={exp.imagen}
                nombre={exp.nombre}
                guia={exp.guia}
                ubicacion={exp.ubicacion}
                calificacion={exp.hasRating ? exp.calificacion : undefined}
                fecha={exp.fecha}
                onVerDetalles={() => navigate(`/app/experiencias/${exp.id}`)}
                onCalificar={
                  !exp.hasRating
                    ? () => navigate(`/app/experiencias/${exp.id}/calificar`)
                    : undefined
                }
              />
            ))}
          </div>
        )}

        {/* Acción inferior */}
        <div className="history-page__action">
          <Button variant="primary" onClick={() => navigate("/app/explorar")}>
            Explorar más destinos
          </Button>
        </div>
      </main>
    </div>
  );
}
