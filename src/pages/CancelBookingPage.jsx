import React from "react";
import { useNavigate } from "react-router-dom";
import HeaderBar from "../components/HeaderBar/HeaderBar";
import Button from "../components/Button/Button";
import "./CancelBookingPage.css";

const CancelBookingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="cancel-page">
      <HeaderBar
        title="Eliminar Reserva"
        showBackButton={true}
        onBackClick={() => navigate(-1)}
      />

      <div className="cancel-page__content">
        {/* Icono de Alerta Rojo */}
        <div className="cancel-page__alert-icon">
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--color-danger)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="15" y1="9" x2="9" y2="15"></line>
            <line x1="9" y1="9" x2="15" y2="15"></line>
          </svg>
        </div>
        <h2 className="cancel-page__title">Cancelar Reserva</h2>

        {/* Tarjeta de Lugar */}
        <div className="cancel-page__card cancel-page__place-card">
          <img
            src="https://images.unsplash.com/photo-1583535314398-3eb1a23424a9?q=80&w=200&auto=format&fit=crop"
            alt="La Paz"
            className="cancel-page__place-img"
          />
          <div className="cancel-page__place-info">
            <h3>Letrero "LA PAZ"</h3>
            <p>Murillo, La Paz, Bolivia</p>
            <span className="cancel-page__badge">PARQUE MIRADOR</span>
            <p className="cancel-page__rating">★ 4.9 (2,481 reseñas)</p>
          </div>
        </div>

        {/* Detalles de la Reserva */}
        <h3 className="cancel-page__section-title">Detalles de la reserva</h3>
        <div className="cancel-page__card cancel-page__details-card">
          <div className="cancel-page__row">
            <span>Fecha</span>
            <span>Miércoles, 18 Octubre, 2026</span>
          </div>
          <div className="cancel-page__row">
            <span>Horario</span>
            <span>06:30 AM</span>
          </div>
          <div className="cancel-page__row">
            <span>Participantes</span>
            <span>2 people</span>
          </div>
          <div className="cancel-page__row">
            <span>Ubicación</span>
            <span>Arashima, Kyoto, Japan</span>
          </div>
          <div className="cancel-page__row">
            <span>Notas</span>
            <span>-</span>
          </div>
        </div>

        {/* Guía */}
        <h3 className="cancel-page__section-title">Ver mi reserva</h3>
        <div className="cancel-page__card cancel-page__guide-card">
          <div>
            <h4>Diego Ramos</h4>
            <p>Tu guía en La Paz</p>
            <p className="cancel-page__rating">★ 4.9 (320 reviews)</p>
          </div>
          <span className="cancel-page__link">Ver perfil</span>
        </div>

        {/* Botones */}
        <div className="cancel-page__actions">
          <Button variant="danger" onClick={() => alert("Reserva cancelada")}>
            Cancelar reserva
          </Button>
          <Button variant="secondary" onClick={() => navigate("/explorar")}>
            Volver al inicio
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CancelBookingPage;
