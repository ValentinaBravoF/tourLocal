import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import HeaderBar from "../components/HeaderBar/HeaderBar";
import RatingBar from "../components/RatingBar/RatingBar";
import GuideCard from "../components/GuideCard/GuideCard";
import Button from "../components/Button/Button";

export default function PlaceDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  return (
    <div style={{ backgroundColor: "var(--color-background)", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <HeaderBar
        title="Detalles del Lugar"
        showBackButton={true}
        onBackClick={() => navigate(-1)}
      />

      <main style={{ padding: "16px", maxWidth: "430px", margin: "0 auto", width: "100%", boxSizing: "border-box", display: "flex", flexDirection: "column", gap: "16px" }}>
        {/* Imagen Hero */}
        <img
          src="https://images.unsplash.com/photo-1589556264807-12c3f4b5d322?w=800&auto=format&fit=crop"
          alt="Calle de las Brujas"
          style={{ width: "100%", height: "220px", objectFit: "cover", borderRadius: "var(--radius)" }}
        />

        {/* Información principal */}
        <section style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <span style={{ fontSize: "11px", fontWeight: "700", color: "var(--color-primary)", letterSpacing: "0.5px" }}>
            PARQUE MIRADOR · CULTURA Y TRADICIÓN
          </span>
          <h1 style={{ margin: 0, fontSize: "22px", fontWeight: "800", color: "var(--color-text)" }}>
            Calle de las Brujas
          </h1>
          <p style={{ margin: 0, fontSize: "13px", color: "var(--color-muted)" }}>
            📍 Linares y Sagárnaga, La Paz, Bolivia
          </p>
          <RatingBar rating={4.9} reviewsCount="2,481" variant="readonly" />
        </section>

        {/* Tarjeta Informativa del lugar */}
        <section
          style={{
            backgroundColor: "var(--color-surface)",
            border: "1px solid var(--color-border)",
            borderRadius: "var(--radius)",
            padding: "16px",
            display: "flex",
            flexDirection: "column",
            gap: "8px",
          }}
        >
          <h3 style={{ margin: 0, fontSize: "15px", fontWeight: "700", color: "var(--color-text)" }}>
            Acerca de la experiencia
          </h3>
          <p style={{ margin: 0, fontSize: "13px", lineHeight: "1.5", color: "var(--color-muted)" }}>
            Descubre los misterios, artesanías y la cosmovisión andina en una de las calles más tradicionales de La Paz. Un recorrido guiado a pie por tiendas tradicionales y amuletos milenarios.
          </p>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "6px", paddingTop: "10px", borderTop: "1px solid var(--color-border)" }}>
            <span style={{ fontSize: "13px", color: "var(--color-muted)" }}>Precio por persona</span>
            <strong style={{ fontSize: "16px", color: "var(--color-primary)" }}>Bs. 80</strong>
          </div>
        </section>

        {/* Guía asignado */}
        <section style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <h3 style={{ margin: 0, fontSize: "15px", fontWeight: "700", color: "var(--color-text)" }}>
            Guía responsable
          </h3>
          <GuideCard
            foto="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop"
            nombre="Diego Ramos"
            ubicacion="La Paz, Bolivia"
            calificacion="4.9"
            resenas="320"
            onVerPerfil={() => navigate("/guias/1")}
          />
        </section>

        {/* Botón de acción */}
        <div style={{ marginTop: "8px", paddingBottom: "24px" }}>
          <Button variant="primary" onClick={() => navigate(`/agendar/${id || 1}`)}>
            Agendar Visita
          </Button>
        </div>
      </main>
    </div>
  );
}