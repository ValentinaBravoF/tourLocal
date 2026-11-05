import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import HeaderBar from "../components/HeaderBar/HeaderBar";
import RatingBar from "../components/RatingBar/RatingBar";
import GuideCard from "../components/GuideCard/GuideCard";
import Button from "../components/Button/Button";
import InfoBox from "../components/InfoBox/InfoBox";
import "./PlaceDetailPage.css";

export default function PlaceDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [place, setPlace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadPlace() {
      try {
        setLoading(true);
        setError("");
        const response = await fetch(`/api/destinos/${id}`);
        const data = await response.json();

        if (response.ok) {
          setPlace(data);
        } else {
          setError(data.error || "Destino no encontrado");
        }
      } catch {
        setError("No se pudo conectar con la API. ¿Está encendida?");
      } finally {
        setLoading(false);
      }
    }

    loadPlace();
  }, [id]);

  if (loading) {
    return (
      <div className="place-detail-page">
        <HeaderBar
          title="Detalles del Lugar"
          showBackButton={true}
          onBackClick={() => navigate(-1)}
        />
        <main className="place-detail-page__content" style={{ padding: "20px 16px" }}>
          <InfoBox title="Cargando…" text="Obteniendo información del destino." />
        </main>
      </div>
    );
  }

  if (error || !place) {
    return (
      <div className="place-detail-page">
        <HeaderBar
          title="Detalles del Lugar"
          showBackButton={true}
          onBackClick={() => navigate(-1)}
        />
        <main className="place-detail-page__content" style={{ padding: "20px 16px", display: "flex", flexDirection: "column", gap: "16px" }}>
          <InfoBox variant="alert" title="No se pudo cargar" text={error || "Destino no encontrado"} />
          <Button variant="secondary" onClick={() => navigate(-1)}>
            Volver a resultados
          </Button>
        </main>
      </div>
    );
  }

  const guide = place.guide || {
    nombre: "Diego Ramos",
    ubicacion: "La Paz, Bolivia",
    calificacion: "4.9",
    resenas: "320",
    foto: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop",
  };

  return (
    <div className="place-detail-page">
      <HeaderBar
        title="Detalles del Lugar"
        showBackButton={true}
        onBackClick={() => navigate(-1)}
      />

      <main className="place-detail-page__content">
        <img
          src={place.image}
          alt={place.title}
          className="place-detail-page__hero"
        />

        <section className="place-detail-page__info">
          <span className="place-detail-page__category">
            {place.category?.toUpperCase()} · {place.tag?.toUpperCase() || "TOUR LOCAL"}
          </span>
          <h1 className="place-detail-page__title">{place.title}</h1>
          <p className="place-detail-page__location">
            📍 {place.location}
          </p>
          <RatingBar
            rating={Number(place.rating) || 4.8}
            reviewsCount={String(place.reviews || "1,200")}
            variant="readonly"
          />
        </section>

        <section className="place-detail-page__card">
          <h3 className="place-detail-page__card-title">
            Acerca de la experiencia
          </h3>
          <p className="place-detail-page__desc">
            {place.description ||
              "Descubre la belleza, cultura y tradiciones de este fascinante destino de La Paz con un guía local especializado."}
          </p>
          <div className="place-detail-page__price-row">
            <span className="place-detail-page__price-label">
              Precio por persona
            </span>
            <strong className="place-detail-page__price-value">
              {place.price || "Gratis"}
            </strong>
          </div>
        </section>

        <section className="place-detail-page__info">
          <h3 className="place-detail-page__card-title">Guía responsable</h3>
          <GuideCard
            foto={guide.foto}
            nombre={guide.nombre}
            ubicacion={guide.ubicacion}
            calificacion={String(guide.calificacion)}
            resenas={String(guide.resenas)}
            onVerPerfil={() => navigate("/guias/1")}
          />
        </section>

        <div className="place-detail-page__actions">
          <Button
            variant="primary"
            onClick={() => navigate(`/agendar/${place.id}`)}
          >
            Agendar Visita
          </Button>
        </div>
      </main>
    </div>
  );
}
