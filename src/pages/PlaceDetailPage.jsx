import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import HeaderBar from "../components/HeaderBar/HeaderBar";
import RatingBar from "../components/RatingBar/RatingBar";
import GuideCard from "../components/GuideCard/GuideCard";
import Button from "../components/Button/Button";
import "./PlaceDetailPage.css";

export default function PlaceDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  return (
    <div className="place-detail-page">
      <HeaderBar
        title="Detalles del Lugar"
        showBackButton={true}
        onBackClick={() => navigate(-1)}
      />

      <main className="place-detail-page__content">
        <img
          src="https://images.unsplash.com/photo-1589556264807-12c3f4b5d322?w=800&auto=format&fit=crop"
          alt="Calle de las Brujas"
          className="place-detail-page__hero"
        />

        <section className="place-detail-page__info">
          <span className="place-detail-page__category">
            PARQUE MIRADOR · CULTURA Y TRADICIÓN
          </span>
          <h1 className="place-detail-page__title">Calle de las Brujas</h1>
          <p className="place-detail-page__location">
            📍 Linares y Sagárnaga, La Paz, Bolivia
          </p>
          <RatingBar rating={4.9} reviewsCount="2,481" variant="readonly" />
        </section>

        <section className="place-detail-page__card">
          <h3 className="place-detail-page__card-title">
            Acerca de la experiencia
          </h3>
          <p className="place-detail-page__desc">
            Descubre los misterios, artesanías y la cosmovisión andina en una de
            las calles más tradicionales de La Paz. Un recorrido guiado a pie
            por tiendas tradicionales y amuletos milenarios.
          </p>
          <div className="place-detail-page__price-row">
            <span className="place-detail-page__price-label">
              Precio por persona
            </span>
            <strong className="place-detail-page__price-value">Bs. 80</strong>
          </div>
        </section>

        <section className="place-detail-page__info">
          <h3 className="place-detail-page__card-title">Guía responsable</h3>
          <GuideCard
            foto="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop"
            nombre="Diego Ramos"
            ubicacion="La Paz, Bolivia"
            calificacion="4.9"
            resenas="320"
            onVerPerfil={() => navigate("/app/guias/1")}
          />
        </section>

        <div className="place-detail-page__actions">
          <Button
            variant="primary"
            onClick={() => navigate(`/app/agendar/${id || 1}`)}
          >
            Agendar Visita
          </Button>
        </div>
      </main>
    </div>
  );
}
