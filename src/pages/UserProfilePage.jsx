import React from "react";
import { useNavigate } from "react-router-dom";
import HeaderBar from "../components/HeaderBar/HeaderBar";
import DetailRow from "../components/DetailRow/DetailRow";
import Button from "../components/Button/Button";
import "./UserProfilePage.css";

export default function UserProfilePage() {
  const navigate = useNavigate();

  return (
    <div className="user-profile-page">
      <HeaderBar title="Mi Perfil" showBackButton={false} />

      <main className="user-profile-page__content">
        <section className="user-profile-page__header-card">
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop"
            alt="Sofía Martínez"
            className="user-profile-page__avatar"
          />
          <h2 className="user-profile-page__name">Sofía Martínez</h2>
          <p className="user-profile-page__subtitle">
            Viajera exploradora · La Paz, Bolivia
          </p>
        </section>

        <section className="user-profile-page__info-card">
          <h3 className="user-profile-page__info-title">
            Información de cuenta
          </h3>
          <DetailRow etiqueta="Correo" valor="sofia.martinez@gmail.com" />
          <DetailRow etiqueta="Teléfono" valor="+591 70000000" />
          <DetailRow etiqueta="Ciudad" valor="La Paz, Bolivia" />
          <DetailRow etiqueta="Miembro desde" valor="Octubre 2026" />
        </section>

        <div className="user-profile-page__actions">
          <Button
            variant="primary"
            onClick={() => navigate("/app/perfil/editar")}
          >
            Editar Perfil
          </Button>
          <Button
            variant="secondary"
            onClick={() => navigate("/app/historial")}
          >
            Ver Historial de Experiencias
          </Button>
        </div>
      </main>
    </div>
  );
}
