
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import HeaderBar from "../components/HeaderBar/HeaderBar";
import ExperienceCard from "../components/ExperienceCard/ExperienceCard";
import "./SavedPlacesPage.css";

export default function SavedPlacesPage() {
  const navigate = useNavigate();

  const [lugaresGuardados, setLugaresGuardados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function cargarGuardados() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch("/api/guardados", {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("No se pudieron cargar los lugares guardados.");
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
          throw new Error("La API devolvió datos inválidos.");
        }

        if (!controller.signal.aborted) {
          setLugaresGuardados(data);
        }
      } catch (err) {
        if (!controller.signal.aborted) {
          setError(
            "No se pudieron cargar los guardados. Verifica que el backend esté encendido."
          );
          setLugaresGuardados([]);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    cargarGuardados();

    return () => controller.abort();
  }, []);

  return (
    <div className="saved-page">
      <HeaderBar
        title="Mis Guardados"
        showBackButton={true}
        onBackClick={() => navigate("/explorar")}
      />

      <main className="saved-page__content">
        <h1 className="saved-page__title">
          Tus lugares favoritos
        </h1>

        <p className="saved-page__subtitle">
          Aquí tienes los lugares que has guardado para visitar más tarde.
        </p>

        {loading && (
          <p role="status">
            Cargando lugares guardados...
          </p>
        )}

        {!loading && error && (
          <div role="alert">
            <strong>No se pudieron cargar los guardados</strong>
            <p>{error}</p>
          </div>
        )}

        {!loading && !error && lugaresGuardados.length === 0 && (
          <p role="status">
            Todavía no tienes lugares guardados.
          </p>
        )}

        {!loading && !error && lugaresGuardados.length > 0 && (
          <div className="saved-page__grid">
            {lugaresGuardados.map((lugar) => (
              <ExperienceCard
                key={lugar.id}
                imagen={lugar.imagen}
                nombre={lugar.nombre}
                ubicacion={lugar.ubicacion}
                calificacion={String(lugar.calificacion)}
                resenas={String(lugar.resenas)}
                onVerDetalles={() =>
                  navigate(`/lugares/${lugar.id}`)
                }
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
