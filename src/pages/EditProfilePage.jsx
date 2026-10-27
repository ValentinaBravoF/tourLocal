import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import HeaderBar from "../components/HeaderBar/HeaderBar";
import FormField from "../components/FormField/FormField";
import Button from "../components/Button/Button";
import NavBar from "../components/NavBar/NavBar";

export default function EditProfilePage() {
  const navigate = useNavigate();
  const [nombre, setNombre] = useState("Sofía Martínez");
  const [correo, setCorreo] = useState("sofia.martinez@gmail.com");
  const [telefono, setTelefono] = useState("+591 70000000");

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Perfil actualizado correctamente");
    navigate("/perfil");
  };

  return (
    <div style={{ backgroundColor: "var(--color-background)", minHeight: "100vh", display: "flex", flexDirection: "column", paddingBottom: "70px" }}>
      <HeaderBar
        title="Editar Perfil"
        showBackButton={true}
        onBackClick={() => navigate(-1)}
      />

      <main style={{ padding: "20px 16px", maxWidth: "430px", margin: "0 auto", width: "100%", boxSizing: "border-box" }}>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {/* Avatar selector */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop"
              alt="Avatar de Sofía Martínez"
              style={{ width: "76px", height: "76px", borderRadius: "50%", objectFit: "cover" }}
            />
            <span style={{ fontSize: "13px", fontWeight: "600", color: "var(--color-primary)", cursor: "pointer" }}>
              Cambiar foto de perfil
            </span>
          </div>

          <FormField
            label="Nombre y Apellidos"
            type="text"
            value={nombre}
            placeholder="Sofía Martínez"
            onChange={(e) => setNombre(e.target.value)}
          />

          <FormField
            label="Correo electrónico"
            type="email"
            value={correo}
            placeholder="sofia.martinez@gmail.com"
            onChange={(e) => setCorreo(e.target.value)}
          />

          <FormField
            label="Teléfono"
            type="tel"
            value={telefono}
            placeholder="+591 ..."
            onChange={(e) => setTelefono(e.target.value)}
          />

          <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "12px" }}>
            <Button variant="primary" type="submit" onClick={handleSubmit}>
              Guardar Cambios
            </Button>
            <Button variant="secondary" onClick={() => navigate("/perfil")}>
              Cancelar
            </Button>
          </div>
        </form>
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