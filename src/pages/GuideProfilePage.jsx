import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import HeaderBar from "../components/HeaderBar/HeaderBar";
import RatingBar from "../components/RatingBar/RatingBar";
import ExperienceCard from "../components/ExperienceCard/ExperienceCard";
import Button from "../components/Button/Button";
import "./GuideProfilePage.css";

export default function GuideProfilePage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [guide, setGuide] = useState(null);
  const [experiencias, setExperiencias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function cargarDatos() {
      try {
        setLoading(true);
        setError("");

        const [resGuia, resDestinos] = await Promise.all([
          fetch(`/api/guias/${id}`, { signal: controller.signal }),
          fetch("/api/destinos", { signal: controller.signal })
        ]);

        if (!resGuia.ok) throw new Error("No se pudo cargar el perfil del guía.");

        const dataGuia = await resGuia.json();
        let dataDestinos = [];
        
        if (resDestinos.ok) {
          dataDestinos = await resDestinos.json();
        }

        if (!controller.signal.aborted) {
          setGuide(dataGuia);
          const toursDelGuia = dataDestinos.filter(
            (destino) => destino.guide && destino.guide.nombre === dataGuia.name
          );
          setExperiencias(toursDelGuia);
        }
      } catch (err) {
        if (!controller.signal.aborted) {
          setError(
            err instanceof TypeError
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

    cargarDatos();
    return () => controller.abort();
  }, [id]);

  return (
    <div className="guide-profile-page">
      <HeaderBar
        title="Perfil del guía"
        showBackButton={true}
        onBackClick={() => navigate(-1)}
      />

      <main className="guide-profile-page__content">
        {loading && <p role="status">Cargando perfil del guía...</p>}

        {!loading && error && (
          <div role="alert">
            <strong>No se pudo cargar el guía</strong>
            <p>{error}</p>
            <Button variant="secondary" onClick={() => navigate(-1)}>Volver</Button>
          </div>
        )}

        {!loading && !error && guide && (
          <>
            <section className="guide-profile-page__header-section">
              {guide.avatar ? (
                <img
                  src={guide.avatar}
                  alt={guide.name}
                  className="guide-profile-page__avatar"
                />
              ) : (
                <div className="guide-profile-page__avatar-placeholder">
                  {guide.name.charAt(0)}
                </div>
              )}

              <div>
                <h2 className="guide-profile-page__name">{guide.name}</h2>
                <p className="guide-profile-page__bio-text">
                  Guía local en {guide.location}
                </p>
                <RatingBar
                  rating={Number(guide.rating)}
                  reviewsCount={String(guide.reviews)}
                  variant="readonly"
                />
              </div>
            </section>

            <section className="guide-profile-page__bio-section">
              <h3 className="guide-profile-page__section-title">Sobre el guía</h3>
              <p className="guide-profile-page__bio-text">{guide.description}</p>
              
              {guide.quote && (
                <blockquote className="guide-profile-page__quote">
                  "{guide.quote}"
                  <span className="guide-profile-page__quote-author">— {guide.name}</span>
                </blockquote>
              )}
            </section>

            <section className="guide-profile-page__bio-section">
              <h3 className="guide-profile-page__section-title">Experiencias que ofrece</h3>
              
              {experiencias.length > 0 ? (
                experiencias.map((exp) => (
                  <div
                    key={exp.id}
                    onClick={() => navigate(`/lugares/${exp.id}`)}
                    style={{ cursor: "pointer" }}
                  >
                    <ExperienceCard
                      imagen={exp.image}
                      nombre={exp.title}
                      ubicacion={exp.location}
                      calificacion={String(exp.rating)}
                      resenas={String(exp.reviews)}
                      onVerDetalles={() => navigate(`/lugares/${exp.id}`)}
                    />
                  </div>
                ))
              ) : (
                <p className="guide-profile-page__bio-text">Este guía no tiene recorridos asignados actualmente.</p>
              )}
            </section>

            <Button variant="primary" onClick={() => navigate("/agendar/1")}>
              Contactar al guía
            </Button>
          </>
        )}
      </main>
    </div>
  );
}