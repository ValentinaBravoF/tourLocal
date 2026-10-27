import React from "react";
import { useNavigate } from "react-router-dom";
import HeaderBar from "../components/HeaderBar/HeaderBar";
import DetailRow from "../components/DetailRow/DetailRow";
import Button from "../components/Button/Button";
import NavBar from "../components/NavBar/NavBar";

export default function UserProfilePage() {
  const navigate = useNavigate();

  return (
    <div style={{ backgroundColor: "var(--color-background)", minHeight: "100vh", display: "flex", flexDirection: "column", paddingBottom: "70px" }}>
      <HeaderBar title="Mi Perfil" showBackButton={false} />

      <main style={{ padding: "20px 16px", maxWidth: "430px", margin: "0 auto", width: "100%", boxSizing: "border-box", display: "flex", flexDirection: "column", gap: "20px" }}>
        {/* Cabecera de usuario */}
        <section
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "8px",
            backgroundColor: "var(--color-surface)",
            border: "1px solid var(--color-border)",
            borderRadius: "var(--radius)",
            padding: "20px",
            textAlign: "center",
          }}
        >
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop"
            alt="Foto de perfil de Sofía Martínez"
            style={{ width: "72px", height: "72px", borderRadius: "50%", objectFit: "cover" }}
          />
          <h2 style={{ margin: "4px 0 0", fontSize: "18px", fontWeight: "800", color: "var(--color-text)" }}>
            Sofía Martínez
          </h2>
          <p style={{ margin: 0, fontSize: "12px", color: "var(--color-muted)" }}>
            Viajera exploradora · La Paz, Bolivia
          </p>
        </section>

        {/* Datos Personales con DetailRow */}
        <section
          style={{
            backgroundColor: "var(--color-surface)",
            border: "1px solid var(--color-border)",
            borderRadius: "var(--radius)",
            padding: "16px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <h3 style={{ margin: "0 0 10px 0", fontSize: "15px", fontWeight: "700", color: "var(--color-text)" }}>
            Información de cuenta
          </h3>
          <DetailRow etiqueta="Correo" valor="sofia.martinez@gmail.com" />
          <DetailRow etiqueta="Teléfono" valor="+591 70000000" />
          <DetailRow etiqueta="Ciudad" valor="La Paz, Bolivia" />
          <DetailRow etiqueta="Miembro desde" valor="Octubre 2026" />
        </section>

        {/* Acciones */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <Button variant="primary" onClick={() => navigate("/perfil/editar")}>
            Editar Perfil
          </Button>

          <Button variant="secondary" onClick={() => navigate("/historial")}>
            Ver Historial de Experiencias
          </Button>
        </div>
      </main>

      <NavBar
        activeTab="profile"
        onTabChange={(tab) => {
          if (tab === "explore") navigate("/explorar");
          if (tab === "history") navigate("/historial");
          if (tab === "profile") navigate("/perfil");
        }}
      />
    </div>
  );
}