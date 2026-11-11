import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import HeaderBar from "../components/HeaderBar/HeaderBar";
import ExperienceCard from "../components/ExperienceCard/ExperienceCard";
import Button from "../components/Button/Button";
import { formatTourDate, parseTourDateTime } from "../services/reservationDates";
import "./HistoryPage.css";

export default function HistoryPage() {
  const navigate = useNavigate();
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [ahora] = useState(() => new Date());

  useEffect(() => {
    async function cargarReservas() {
      try {
        const response = await fetch("/api/reservas");
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "No se pudieron cargar las reservas");
        }
        if (!Array.isArray(data)) {
          throw new Error("La API devolvió un historial inválido");
        }

        setReservas(data);
      } catch (err) {
        console.error("Error al cargar el historial de reservas:", err);
        setError(
          err instanceof Error
            ? err.message
            : "No se pudo conectar con la API de reservas",
        );
      } finally {
        setLoading(false);
      }
    }

    cargarReservas();
  }, []);

  if (loading) {
    return (
      <div className="history-page">
        <HeaderBar
          title="Historial"
          showBackButton={true}
          onBackClick={() => navigate(-1)}
        />
        <main className="history-page__content">
          <p style={{ textAlign: "center", padding: "20px" }}>
            Cargando tus reservas...
          </p>
        </main>
      </div>
    );
  }

  return (
    <div className="history-page">
      <HeaderBar
        title="Historial de Experiencias"
        showBackButton={true}
        onBackClick={() => navigate(-1)}
      />

      <main className="history-page__content">
        <div className="history-page__list">
          {error ? (
            <p role="alert" style={{ textAlign: "center", padding: "20px" }}>
              {error}
            </p>
          ) : reservas.length === 0 ? (
            <p
              style={{
                textAlign: "center",
                padding: "20px",
                color: "var(--color-muted)",
              }}
            >
              Aún no tienes reservas guardadas.
            </p>
          ) : (
            reservas.map((res) => {
              const fechaTour = parseTourDateTime(res.fecha, res.horario);
              const estado =
                res.estado === "confirmada" &&
                fechaTour &&
                fechaTour <= ahora
                  ? "realizada"
                  : res.estado;

              return (
                <ExperienceCard
                  key={res.id}
                  imagen="https://images.unsplash.com/photo-1583535314398-3eb1a23424a9?q=80&w=200&auto=format&fit=crop"
                  nombre={res.experiencia}
                  ubicacion="La Paz, Bolivia"
                  fecha={formatTourDate(res.fecha)}
                  estado={estado}
                  onVerDetalles={() => navigate(`/app/experiencias/${res.id}`)}
                />
              );
            })
          )}
        </div>

        <div className="history-page__action">
          <Button variant="primary" onClick={() => navigate("/app/explorar")}>
            Visit more places
          </Button>
        </div>
      </main>
    </div>
  );
}
