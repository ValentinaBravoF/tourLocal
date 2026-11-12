
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import HeaderBar from "../components/HeaderBar/HeaderBar";
import ExperienceCard from "../components/ExperienceCard/ExperienceCard";
import { getSavedPlaces, removeSavedPlace } from "../services/savedPlaces";
import "./SavedPlacesPage.css";

export default function SavedPlacesPage() {
  const navigate = useNavigate();

  const [lugaresGuardados, setLugaresGuardados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [removingId, setRemovingId] = useState(null);
  const [actionError, setActionError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function cargarGuardados() {
      try {
        setLoading(true);
        setError("");

        const data = await getSavedPlaces(controller.signal);
        if (!Array.isArray(data)) {
          throw new Error("La API devolvió datos inválidos.");
        }

        if (!controller.signal.aborted) {
          setLugaresGuardados(data);
        }
      } catch (err) {
        if (!controller.signal.aborted) {
          setError(err instanceof Error ? err.message : "No se pudieron cargar los guardados.");
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

  async function quitarGuardado(id) {
    if (removingId !== null) return;

    setRemovingId(id);
    setActionError("");
    try {
      await removeSavedPlace(id);
      setLugaresGuardados((previous) =>
        previous.filter((lugar) => lugar.id !== id),
      );
    } catch (err) {
      setActionError(
        err instanceof Error
          ? err.message
          : "No se pudo quitar el lugar guardado.",
      );
    } finally {
      setRemovingId(null);
    }
  }

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

        {actionError && <p role="alert">{actionError}</p>}

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
                onQuitarGuardado={() => quitarGuardado(lugar.id)}
                guardadoLoading={removingId === lugar.id}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
