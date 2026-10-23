import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import HeaderBar from "../components/HeaderBar/HeaderBar";
import FormField from "../components/FormField/FormField";
import Button from "../components/Button/Button";
import "./LoginPage.css"; // Reutilizamos el CSS del Login

const SignUpPage = () => {
  const navigate = useNavigate();
  const [accepted, setAccepted] = useState(false);

  return (
    <div className="auth-page">
      <HeaderBar
        title="Crear Cuenta"
        showBackButton={true}
        onBackClick={() => navigate(-1)}
      />

      <div className="auth-page__scroll-content">
        <h1 className="auth-page__title">Empecemos!</h1>
        <p className="auth-page__subtitle">
          Únete a nuestra comunidad global de viajeros entusiastas.
        </p>

        <div className="auth-page__form">
          <FormField label="Nombres y Apellidos" placeholder="Sofia Martinez" />
          <FormField
            label="Correo electronico"
            type="email"
            placeholder="sofia.martinez@gmail.com"
          />
          <FormField
            label="contraseña"
            type="password"
            placeholder="minimo 8 caracteres"
          />
          <FormField label="confirma tu contraseña" type="password" />

          <label className="auth-page__checkbox-label">
            <input
              type="checkbox"
              checked={accepted}
              onChange={() => setAccepted(!accepted)}
            />
            <span className="auth-page__checkbox-text">
              Al crear una cuenta, aceptas nuestros Términos y nuestra Política
              de privacidad.
            </span>
          </label>
        </div>

        <div className="auth-page__actions">
          <Button variant="primary" onClick={() => navigate("/explorar")}>
            Registrarse
          </Button>
          <p className="auth-page__footer-text">
            ya tienes cuenta?{" "}
            <span onClick={() => navigate("/login")}>Iniciar Sesión</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
