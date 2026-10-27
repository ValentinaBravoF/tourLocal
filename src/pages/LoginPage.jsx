import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import HeaderBar from "../components/HeaderBar/HeaderBar";
import FormField from "../components/FormField/FormField";
import Button from "../components/Button/Button";
import "./LoginPage.css";

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="auth-page">
      <HeaderBar
        title="Inicio de sesión"
        showBackButton={true}
        onBackClick={() => navigate(-1)}
      />

      <div className="auth-page__scroll-content">
        <h1 className="auth-page__title">Bienvenido de vuelta!</h1>
        <p className="auth-page__subtitle">
          Inicia sesión para continuar organizando tus futuros recorridos.
        </p>

        <div className="auth-page__form">
          <FormField
            label="Correo"
            type="email"
            placeholder="sofia.martinez@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <FormField
            label="Contraseña"
            type="password"
            placeholder="supersecret123"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <span className="auth-page__forgot">¿Olvidaste tu contraseña?</span>
        </div>

        <div className="auth-page__actions">
          <Button variant="primary" onClick={() => navigate("/explorar")}>
            Iniciar Sesión
          </Button>

          <div className="auth-page__divider">
            <span>O conécta con</span>
          </div>

          <div className="auth-page__social">
            <Button variant="secondary" className="btn-social">
              G Google
            </Button>
            <Button variant="secondary" className="btn-social">
               Facebook
            </Button>
          </div>

          <p className="auth-page__footer-text">
            eres nuevo?{" "}
            <span onClick={() => navigate("/registro")}>Crear cuenta</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
