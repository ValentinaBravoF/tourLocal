import React from "react";
import { useNavigate } from "react-router-dom";
import HeaderBar from "../components/HeaderBar/HeaderBar";
import ExperienceCard from "../components/ExperienceCard/ExperienceCard";
import Button from "../components/Button/Button";
import "./HistoryPage.css";

const experiences = [
  {
    id: 1,
    nombre: "Calle de las Brujas",
    guia: "Marcos Salguero",
    ubicacion: "La Paz, Bolivia",
    calificacion: "4.9 (Tu calificación)",
    fecha: "18/04/2026",
    imagen:
      "https://images.unsplash.com/photo-1526392060635-9d6019884377?q=80&w=200&auto=format&fit=crop",
    hasRating: true,
  },
  {
    id: 2,
    nombre: "Barrio de Colores",
    guia: "Carla Flores",
    ubicacion: "La Paz, Bolivia",
    calificacion: "3 (Tu calificación)",
    fecha: "4/10/2023",
    imagen:
      "https://images.unsplash.com/photo-1583535314398-3eb1a23424a9?q=80&w=200&auto=format&fit=crop",
    hasRating: true,
  },
  {
    id: 3,
    nombre: "Valle de la Luna",
    guia: "Juan Yupanqui",
    ubicacion: "La Paz, Bolivia",
    fecha: "5/10/2023",
    imagen:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=200&auto=format&fit=crop",
    hasRating: false,
  },
];

export default function HistoryPage() {
  const navigate = useNavigate();

  return (
    <div className="history-page">
      <HeaderBar
        title="Historial de Experiencias"
        showBackButton={true}
        onBackClick={() => navigate(-1)}
      />

      <main className="history-page__content">
        <div className="history-page__list">
          {experiences.map((exp) => (
            <ExperienceCard
              key={exp.id}
              imagen={exp.imagen}
              nombre={exp.nombre}
              guia={exp.guia}
              ubicacion={exp.ubicacion}
              calificacion={exp.hasRating ? exp.calificacion : undefined}
              fecha={exp.fecha}
              onVerDetalles={() => navigate(`/experiencias/${exp.id}`)}
              onCalificar={
                !exp.hasRating
                  ? () => navigate(`/experiencias/${exp.id}/calificar`)
                  : undefined
              }
            />
          ))}
        </div>

        <div className="history-page__action">
          <Button variant="primary" onClick={() => navigate("/explorar")}>
            Visit more places
          </Button>
        </div>
      </main>
    </div>
  );
}
