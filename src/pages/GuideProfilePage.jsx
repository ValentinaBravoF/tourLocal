import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import HeaderBar from "../components/HeaderBar/HeaderBar";
import RatingBar from "../components/RatingBar/RatingBar";
import ExperienceCard from "../components/ExperienceCard/ExperienceCard";
import Button from "../components/Button/Button";
import "./GuideProfilePage.css";

const GUIDE_CONTACTS = {
  "Diego Ramos": { phone: "+591 76543210", email: "diego.ramos@tourlocal.bo" },
  "Carlos Condori": { phone: "+591 71234567", email: "carlos.condori@tourlocal.bo" },
  "María Fernández": { phone: "+591 72345678", email: "maria.fernandez@tourlocal.bo" },
  "Elena Choque": { phone: "+591 73456789", email: "elena.choque@tourlocal.bo" },
};

export default function GuideProfilePage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [guide, setGuide] = useState(null);
  const [experiencias, setExperiencias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showContactModal, setShowContactModal] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  const [mensajeEnviado, setMensajeEnviado] = useState(false);

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

  const contactInfo = guide
    ? GUIDE_CONTACTS[guide.name] || {
        phone: "+591 76543210",
        email: `${guide.name.toLowerCase().replace(/\s+/g, ".")}@tourlocal.bo`,
      }
    : null;

  const handleEnviarMensaje = (e) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;
    setMensajeEnviado(true);
    setChatMessage("");
    setTimeout(() => {
      setMensajeEnviado(false);
      setShowContactModal(false);
    }, 2500);
  };

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

            <Button variant="primary" onClick={() => setShowContactModal(true)}>
              Contactar al guía
            </Button>

            {showContactModal && (
              <div
                className="guide-modal__backdrop"
                onClick={() => setShowContactModal(false)}
              >
                <div
                  className="guide-modal__content"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="guide-modal__header">
                    <h3>Contactar a {guide.name}</h3>
                    <button
                      type="button"
                      className="guide-modal__close"
                      onClick={() => setShowContactModal(false)}
                      aria-label="Cerrar modal"
                    >
                      ✕
                    </button>
                  </div>

                  <p className="guide-modal__desc">
                    Elige el medio por el cual deseas comunicarte directamente con el guía:
                  </p>

                  <div className="guide-modal__options">
                    <a
                      href={`https://wa.me/${contactInfo.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                        `Hola ${guide.name}, te contacto desde TourLocal para realizar una consulta sobre tus recorridos.`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="guide-modal__option guide-modal__option--whatsapp"
                    >
                      <span className="guide-modal__option-icon">💬</span>
                      <div>
                        <strong>WhatsApp</strong>
                        <span>{contactInfo.phone}</span>
                      </div>
                    </a>

                    <a
                      href={`tel:${contactInfo.phone}`}
                      className="guide-modal__option"
                    >
                      <span className="guide-modal__option-icon">📞</span>
                      <div>
                        <strong>Llamada directa</strong>
                        <span>{contactInfo.phone}</span>
                      </div>
                    </a>

                    <a
                      href={`mailto:${contactInfo.email}?subject=Consulta%20TourLocal`}
                      className="guide-modal__option"
                    >
                      <span className="guide-modal__option-icon">✉️</span>
                      <div>
                        <strong>Correo electrónico</strong>
                        <span>{contactInfo.email}</span>
                      </div>
                    </a>
                  </div>

                  <hr className="guide-modal__divider" />

                  <form onSubmit={handleEnviarMensaje} className="guide-modal__chat-form">
                    <label htmlFor="chat-message" className="guide-modal__chat-label">
                      O envíale un mensaje rápido ahora mismo:
                    </label>
                    <textarea
                      id="chat-message"
                      className="guide-modal__textarea"
                      rows={3}
                      placeholder={`Hola ${guide.name}, quisiera saber más detalles sobre el punto de encuentro...`}
                      value={chatMessage}
                      onChange={(e) => setChatMessage(e.target.value)}
                    />
                    {mensajeEnviado && (
                      <div className="guide-modal__success" role="status">
                        ✓ ¡Mensaje enviado a {guide.name}! Te responderá a la brevedad.
                      </div>
                    )}
                    <div className="guide-modal__actions">
                      <Button variant="primary" type="submit" disabled={!chatMessage.trim() || mensajeEnviado}>
                        Enviar mensaje
                      </Button>
                      <Button variant="secondary" type="button" onClick={() => setShowContactModal(false)}>
                        Cerrar
                      </Button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}