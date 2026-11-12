import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import HeaderBar from "../components/HeaderBar/HeaderBar";
import DetailRow from "../components/DetailRow/DetailRow";
import Button from "../components/Button/Button";
import { getCurrentUser, logout } from "../services/userService"; // Importamos el servicio
import "./UserProfilePage.css";

export default function UserProfilePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Leemos el usuario logueado
    const currentUser = getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    } else {
      // Si no hay usuario, lo mandamos al login
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Mientras carga el usuario, mostramos un mensaje
  if (!user) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        Cargando perfil...
      </div>
    );
  }

  return (
    <div className="user-profile-page">
      <HeaderBar title="Mi Perfil" showBackButton={false} />

      <main className="user-profile-page__content">
        <section className="user-profile-page__header-card">
          <img
            src={
              user.foto ||
              "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop"
            }
            alt={user.nombre}
            className="user-profile-page__avatar"
          />
          <h2 className="user-profile-page__name">{user.nombre}</h2>
          <p className="user-profile-page__subtitle">
            Viajero explorador · {user.ciudad || "La Paz, Bolivia"}
          </p>
        </section>

        <section className="user-profile-page__info-card">
          <h3 className="user-profile-page__info-title">
            Información de cuenta
          </h3>
          <DetailRow etiqueta="Correo" valor={user.email} />
          <DetailRow
            etiqueta="Teléfono"
            valor={user.telefono || "+591 00000000"}
          />
          <DetailRow
            etiqueta="Ciudad"
            valor={user.ciudad || "La Paz, Bolivia"}
          />
          <DetailRow
            etiqueta="Miembro desde"
            valor={user.fechaRegistro || "Octubre 2026"}
          />
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
          <Button variant="danger" onClick={handleLogout}>
            Cerrar Sesión
          </Button>
        </div>
      </main>
    </div>
  );
}
