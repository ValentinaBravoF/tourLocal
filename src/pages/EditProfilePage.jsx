import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import HeaderBar from "../components/HeaderBar/HeaderBar";
import FormField from "../components/FormField/FormField";
import Button from "../components/Button/Button";
import "./EditProfilePage.css";

export default function EditProfilePage() {
  const navigate = useNavigate();
  const [nombre, setNombre] = useState("Sofía Martínez");
  const [correo, setCorreo] = useState("sofia.martinez@gmail.com");
  const [telefono, setTelefono] = useState("+591 70000000");

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Perfil actualizado correctamente");
    navigate("/app/perfil");
  };

  return (
    <div className="edit-profile-page">
      <HeaderBar
        title="Editar Perfil"
        showBackButton={true}
        onBackClick={() => navigate(-1)}
      />

      <main className="edit-profile-page__content">
        <form onSubmit={handleSubmit} className="edit-profile-page__form">
          <div className="edit-profile-page__avatar-section">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop"
              alt="Avatar"
              className="edit-profile-page__avatar"
            />
            <span className="edit-profile-page__change-photo">
              Cambiar foto de perfil
            </span>
          </div>

          <FormField
            label="Nombre y Apellidos"
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
          <FormField
            label="Correo electrónico"
            type="email"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
          />
          <FormField
            label="Teléfono"
            type="tel"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
          />

          <div className="edit-profile-page__actions">
            <Button variant="primary" type="submit">
              Guardar Cambios
            </Button>
            <Button variant="secondary" onClick={() => navigate("/app/perfil")}>
              Cancelar
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}
