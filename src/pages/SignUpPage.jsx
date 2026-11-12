import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import HeaderBar from "../components/HeaderBar/HeaderBar";
import FormField from "../components/FormField/FormField";
import Button from "../components/Button/Button";
import { saveUser, setCurrentUser } from "../services/userService"; // Importamos el servicio
import "./LoginPage.css";

const SignUpPage = () => {
  const navigate = useNavigate();
  const [accepted, setAccepted] = useState(false);

  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRegister = (e) => {
    e.preventDefault();

    if (!nombre || !email || !password) {
      alert("Por favor, completa todos los campos.");
      return;
    }
    if (password !== confirmPassword) {
      alert("Las contraseñas no coinciden.");
      return;
    }
    if (!accepted) {
      alert("Debes aceptar los términos y condiciones.");
      return;
    }

    // Creamos el objeto del nuevo usuario
    const newUser = {
      nombre: nombre,
      email: email,
      password: password, // En un caso real, esto iría encriptado
      telefono: "+591 00000000", // Valor por defecto
      ciudad: "La Paz, Bolivia", // Valor por defecto
      fechaRegistro: new Date().toLocaleDateString("es-BO", {
        month: "long",
        year: "numeric",
      }),
    };

    saveUser(newUser);
    setCurrentUser(newUser);

    alert("¡Cuenta creada con éxito!");
    navigate("/app/explorar");
  };

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
          Únete a nuestra comunidad global de viajeros.
        </p>

        <form className="auth-page__form" onSubmit={handleRegister}>
          <FormField
            label="Nombres y Apellidos"
            placeholder="Sofia Martinez"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
          <FormField
            label="Correo electronico"
            type="email"
            placeholder="sofia.martinez@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <FormField
            label="Contraseña"
            type="password"
            placeholder="minimo 8 caracteres"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <FormField
            label="Confirma tu contraseña"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

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

          <div className="auth-page__actions">
            <Button variant="primary" type="submit">
              Registrarse
            </Button>
            <p className="auth-page__footer-text">
              ¿Ya tienes cuenta?{" "}
              <span onClick={() => navigate("/login")}>Iniciar Sesión</span>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUpPage;
