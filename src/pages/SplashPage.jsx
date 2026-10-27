import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button/Button";
import "./SplashPage.css";

const SplashPage = () => {
  const navigate = useNavigate();

  return (
    <div className="splash-page">
      <div className="splash-page__image-container">
        {/* Nota: Reemplaza esta URL por la ruta de tu imagen local en src/assets */}
        <img
          src="https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?q=80&w=1000&auto=format&fit=crop"
          alt="Bosque de bambú"
          className="splash-page__image"
        />
      </div>

      <div className="splash-page__content">
        <div className="splash-page__logo">
          {/* Icono simulado del logo */}
          <div className="splash-page__logo-icon">◎</div>
          <h1 className="splash-page__brand">TourLocal</h1>
        </div>

        <h2 className="splash-page__title">¡Vive la experiencia ahora!</h2>
        <p className="splash-page__description">
          Encuentra recorridos únicos, compara precios de forma transparente y
          asegura tu lugar en minutos sin perder tiempo en chats dispersos.
        </p>

        <div className="splash-page__actions">
          <Button variant="primary" onClick={() => navigate("/registro")}>
            REGISTRAR
          </Button>
          <p className="splash-page__login-text">
            ya tienes una cuenta?{" "}
            <span onClick={() => navigate("/login")}>Iniciar sesión</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SplashPage;
