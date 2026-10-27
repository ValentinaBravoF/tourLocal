import React from "react";
import { useNavigate } from "react-router-dom";
import HeaderBar from "../components/HeaderBar/HeaderBar";
import RatingBar from "../components/RatingBar/RatingBar";
import ExperienceCard from "../components/ExperienceCard/ExperienceCard";
import Button from "../components/Button/Button";

export default function GuideProfilePage() {
  const navigate = useNavigate();

  // Experiencias que ofrece el guía Diego Ramos
  const experiencias = [
    {
      id: "1",
      nombre: "Calle de las Brujas",
      ubicacion: "La Paz, Bolivia",
      calificacion: "4.9",
      resenas: "2,481",
      imagen: "https://images.unsplash.com/photo-1589556264807-12c3f4b5d322?w=400&auto=format&fit=crop",
    },
    {
      id: "2",
      nombre: "Montículo",
      ubicacion: "La Paz, Bolivia",
      calificacion: "4.6",
      resenas: "1,421",
      imagen: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=400&auto=format&fit=crop",
    },
    {
      id: "3",
      nombre: "Valle de la Luna",
      ubicacion: "La Paz, Bolivia",
      calificacion: "4.8",
      resenas: "2,031",
      imagen: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&auto=format&fit=crop",
    },
  ];

  return (
    <div style={{ backgroundColor: "var(--color-background)", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <HeaderBar
        title="Perfil del guía"
        showBackButton={true}
        onBackClick={() => navigate(-1)}
      />

      <main style={{ padding: "20px 16px", maxWidth: "430px", margin: "0 auto", width: "100%", boxSizing: "border-box", display: "flex", flexDirection: "column", gap: "20px" }}>
        {/* Cabecera del guía */}
        <section style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop"
            alt="Diego Ramos"
            style={{ width: "68px", height: "68px", borderRadius: "50%", objectFit: "cover", flexShrink: 0 }}
          />
          <div>
            <h2 style={{ margin: "0 0 4px", fontSize: "18px", fontWeight: "700", color: "var(--color-text)" }}>
              Diego Ramos
            </h2>
            <p style={{ margin: "0 0 6px", fontSize: "12px", color: "var(--color-muted)" }}>
              Guía local en La Paz, Bolivia
            </p>
            <RatingBar rating={4.9} reviewsCount={320} variant="readonly" />
          </div>
        </section>

        {/* Sobre el guía y Biografía (GuideBioCard) */}
        <section style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <h3 style={{ margin: 0, fontSize: "15px", fontWeight: "700", color: "var(--color-text)" }}>
            Sobre el guía
          </h3>
          <p style={{ margin: 0, fontSize: "13px", lineHeight: "1.5", color: "var(--color-muted)" }}>
            ¡Hola! Soy Diego, un guía local apasionado por compartir la historia, la cultura y los rincones auténticos de La Paz. Disfruto conectar con viajeros y crear experiencias únicas que van más allá de los lugares turísticos tradicionales.
          </p>

          <blockquote
            style={{
              margin: "6px 0 0",
              padding: "14px 16px",
              backgroundColor: "var(--color-info-bg)",
              border: "1.5px solid var(--color-primary)",
              borderRadius: "var(--radius)",
              color: "var(--color-primary)",
              fontSize: "12px",
              lineHeight: "1.5",
              fontStyle: "italic",
            }}
          >
            "Mi objetivo es que cada viajero sienta a La Paz no solo como un destino, sino como una historia de la que también forma parte."
            <footer style={{ marginTop: "6px", fontWeight: "700", fontStyle: "normal" }}>
              — Diego Ramos
            </footer>
          </blockquote>
        </section>

        {/* Experiencias que ofrece */}
        <section style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <h3 style={{ margin: 0, fontSize: "15px", fontWeight: "700", color: "var(--color-text)" }}>
            Experiencias que ofrece
          </h3>
          {experiencias.map((exp) => (
            <div key={exp.id} onClick={() => navigate(`/lugares/${exp.id}`)} style={{ cursor: "pointer" }}>
              <ExperienceCard
                imagen={exp.imagen}
                nombre={exp.nombre}
                ubicacion={exp.ubicacion}
                calificacion={exp.calificacion}
                resenas={exp.resenas}
                onVerDetalles={() => navigate(`/lugares/${exp.id}`)}
              />
            </div>
          ))}
        </section>

        <div style={{ marginTop: "10px" }}>
          <Button variant="primary" onClick={() => navigate("/agendar/1")}>
            Contactar al guía
          </Button>
        </div>
      </main>
    </div>
  );
}