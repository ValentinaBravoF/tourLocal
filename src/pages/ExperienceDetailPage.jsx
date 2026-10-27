
import { useNavigate, useParams } from "react-router-dom";

import ExperienceSummary from "../components/ExperienceSummary/ExperienceSummary";
import ReservationDetailCard from "../components/ReservationDetailCard/ReservationDetailCard";
import PriceSummary from "../components/PriceSummary/PriceSummary";
import GuideCard from "../components/GuideCard/GuideCard";
import Button from "../components/Button/Button";

import "./ExperienceDetailPage.css";

export default function ExperienceDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  // Datos de ejemplo para la versión frontend.
  const experiencia = {
    nombre: "Recorrido por la Calle de las Brujas",
    ubicacion: "Calle de las Brujas, La Paz, Bolivia",
    categoria: "CULTURA Y TRADICIÓN",
    calificacion: 4.9,
    resenas: "248 reseñas",
    imagen:
      "https://images.unsplash.com/photo-1583535314398-3eb1a23424a9?q=80&w=600&auto=format&fit=crop",

    fecha: "Miércoles, 28 de octubre de 2026",
    horario: "10:00 AM",
    participantes: 2,
    notas: "Presentarse 10 minutos antes del recorrido.",

    precioPorPersona: 80,
    tarifaServicio: 10,

    guia: {
      nombre: "María Fernández",
      descripcion:
        "Guía local especializada en historia, cultura y tradiciones de La Paz.",
      ubicacion: "La Paz, Bolivia",
      calificacion: 4.9,
      resenas: 120,
    },
  };

  function irACalificar() {
    navigate(`/experiencias/${id || 1}/calificar`);
  }

  function volver() {
    navigate(-1);
  }

  return (
    <div className="experience-detail-page">
      <header className="experience-detail-page__header">
        <button
          type="button"
          className="experience-detail-page__back"
          onClick={volver}
          aria-label="Volver"
        >
          ←
        </button>

        <h1>Detalle de experiencia</h1>
      </header>

      <main className="experience-detail-page__content">
        <section className="experience-detail-page__intro">
          <div className="experience-detail-page__status">
            <span className="experience-detail-page__check">✓</span>
            <div>
              <h2>Experiencia realizada</h2>
              <p>
                ¡Esperamos que hayas disfrutado tu recorrido!
              </p>
            </div>
          </div>
        </section>

        <section className="experience-detail-page__section">
          <ExperienceSummary
            destino={experiencia.nombre}
            imagen={experiencia.imagen}
            ubicacion={experiencia.ubicacion}
            categoria={experiencia.categoria}
            calificacion={experiencia.calificacion}
            resenas={experiencia.resenas}
            estado="resumen"
          />
        </section>

        <section className="experience-detail-page__section">
          <ReservationDetailCard
            titulo="Detalles de la reserva"
            fecha={experiencia.fecha}
            horario={experiencia.horario}
            participantes={`${experiencia.participantes} personas`}
            ubicacion={experiencia.ubicacion}
            notas={experiencia.notas}
            estado="normal"
          />
        </section>

        <section className="experience-detail-page__section">
          <PriceSummary
            titulo="Importe pagado"
            precioPorPersona={experiencia.precioPorPersona}
            participantes={experiencia.participantes}
            tarifaServicio={experiencia.tarifaServicio}
            variante="pagado"
          />
        </section>

        <section className="experience-detail-page__section">
          <h3 className="experience-detail-page__section-title">
            Tu guía
          </h3>

          <GuideCard
            nombre={experiencia.guia.nombre}
            descripcion={experiencia.guia.descripcion}
            ubicacion={experiencia.guia.ubicacion}
            calificacion={experiencia.guia.calificacion}
            resenas={experiencia.guia.resenas}
            onVerPerfil={() =>
              alert("Perfil del guía pendiente de conectar")
            }
          />
        </section>

        <div className="experience-detail-page__actions">
          <Button variant="primary" onClick={irACalificar}>
            Calificar experiencia
          </Button>

          <button
            type="button"
            className="experience-detail-page__secondary"
            onClick={() => navigate("/app/explorar")}
          >
            Volver a explorar
          </button>
        </div>
      </main>
    </div>
  );
}
