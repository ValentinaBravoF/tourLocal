import React from "react";
import { useNavigate } from "react-router-dom";
import HeaderBar from "../components/HeaderBar/HeaderBar";
import ExperienceCard from "../components/ExperienceCard/ExperienceCard";
import "./SavedPlacesPage.css";

const lugaresGuardados = [
  {
    id: 1,
    nombre: 'Letrero "LA PAZ"',
    ubicacion: "Murillo, La Paz, Bolivia",
    calificacion: "4.9",
    resenas: "2,481",
    imagen:
      "https://images.unsplash.com/photo-1583535314398-3eb1a23424a9?q=80&w=400&auto=format&fit=crop",
  },
  {
    id: 2,
    nombre: "Valle de la Luna",
    ubicacion: "Mallasa, La Paz, Bolivia",
    calificacion: "4.8",
    resenas: "1,920",
    imagen:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=400&auto=format&fit=crop",
  },
  {
    id: 3,
    nombre: "Tiwanaku",
    ubicacion: "Ingavi, La Paz, Bolivia",
    calificacion: "4.7",
    resenas: "3,105",
    imagen:
      "https://images.unsplash.com/photo-1589802829985-817e51171b92?q=80&w=400&auto=format&fit=crop",
  },
];

export default function SavedPlacesPage() {
  const navigate = useNavigate();

  return (
    <div className="saved-page">
      <HeaderBar
        title="Mis Guardados"
        showBackButton={true}
        onBackClick={() => navigate("/app/explorar")}
      />
      <main className="saved-page__content">
        <h1 className="saved-page__title">Tus lugares favoritos</h1>
        <p className="saved-page__subtitle">
          Aquí tienes los lugares que has guardado para visitar más tarde.
        </p>

        <div className="saved-page__grid">
          {lugaresGuardados.map((lugar) => (
            <ExperienceCard
              key={lugar.id}
              imagen={lugar.imagen}
              nombre={lugar.nombre}
              ubicacion={lugar.ubicacion}
              calificacion={lugar.calificacion}
              resenas={lugar.resenas}
              onVerDetalles={() => navigate(`/app/lugares/${lugar.id}`)}
            />
          ))}
        </div>
      </main>
    </div>
  );
}
