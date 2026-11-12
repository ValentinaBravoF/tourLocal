
import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import SearchBar from "../components/SearchBar/SearchBar";
import CategoryPill from "../components/CategoryPill/CategoryPill";
import FeaturedCard from "../components/FeaturedCard/FeaturedCard";
import InfoBox from "../components/InfoBox/InfoBox";
import { getCurrentUser } from "../services/userService";
import {
  getSavedPlaces,
  removeSavedPlace,
  savePlace,
} from "../services/savedPlaces";
import "./ExplorePage.css";

const categories = [
  "Todos",
  "Populares",
  "Históricos",
  "Parques",
  "Senderismo",
  "Museos",
];

// Mensaje claro para problemas de conexión
const CONNECTION_ERROR =
  "No se pudo conectar con el servidor. Verifica que la API de TourLocal esté encendida.";

// Función reutilizable para consultar las APIs
async function fetchApi(url, signal) {
  let response;

  try {
    response = await fetch(url, { signal });
  } catch (err) {
    if (err.name === "AbortError") {
      throw err;
    }

    throw new Error(CONNECTION_ERROR);
  }

  // Leer la respuesta como texto permite manejar
  // respuestas vacías o errores del proxy de Vite.
  const text = await response.text();

  let data = null;

  if (text.trim()) {
    try {
      data = JSON.parse(text);
    } catch {
      throw new Error(
        "El servidor devolvió una respuesta inválida. Verifica que el backend esté funcionando."
      );
    }
  }

  if (!response.ok) {
    // Si el servidor devuelve JSON con un mensaje,
    // usamos ese mensaje.
    if (data && typeof data.error === "string") {
      throw new Error(data.error);
    }

    // Error frecuente cuando Vite no encuentra el backend
    if (response.status >= 500 || response.status === 404) {
      throw new Error(CONNECTION_ERROR);
    }

    throw new Error(
      "No se pudo completar la solicitud."
    );
  }

  if (!Array.isArray(data)) {
    throw new Error(
      "La API devolvió datos inválidos."
    );
  }

  return data;
}

export default function ExplorePage() {
  const navigate = useNavigate();
  const usuario = getCurrentUser();
  const nombreUsuario = usuario?.nombre?.trim() || "Viajero";

  // Estados de interacción
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [searchQuery, setSearchQuery] = useState("");
  const [savedIds, setSavedIds] = useState([]);
  const [savingIds, setSavingIds] = useState([]);
  const [savedError, setSavedError] = useState("");

  // Estados de destinos destacados
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Estados de atracciones cercanas
  const [nearbyAttractions, setNearbyAttractions] = useState([]);
  const [nearbyLoading, setNearbyLoading] = useState(true);
  const [nearbyError, setNearbyError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    getSavedPlaces(controller.signal)
      .then((places) => {
        if (!controller.signal.aborted) {
          setSavedIds(places.map((place) => place.id));
        }
      })
      .catch((err) => {
        if (!controller.signal.aborted) {
          setSavedError(err.message);
        }
      });

    return () => controller.abort();
  }, []);

  async function toggleSave(id) {
    if (savingIds.includes(id)) return;

    setSavingIds((previous) => [...previous, id]);
    setSavedError("");
    try {
      if (savedIds.includes(id)) {
        await removeSavedPlace(id);
        setSavedIds((previous) => previous.filter((savedId) => savedId !== id));
      } else {
        await savePlace(id);
        setSavedIds((previous) =>
          previous.includes(id) ? previous : [...previous, id],
        );
      }
    } catch (err) {
      setSavedError(err instanceof Error ? err.message : "No se pudo actualizar el guardado.");
    } finally {
      setSavingIds((previous) => previous.filter((savingId) => savingId !== id));
    }
  }

  // API 1: Obtener destinos destacados
  useEffect(() => {
    const controller = new AbortController();

    async function loadDestinations() {
      setLoading(true);
      setError("");

      try {
        const data = await fetchApi(
          `/api/destinos?categoria=${encodeURIComponent(selectedCategory)}`,
          controller.signal
        );

        if (!controller.signal.aborted) {
          setDestinations(data);
        }
      } catch (err) {
        if (!controller.signal.aborted) {
          setError(
            err.message || CONNECTION_ERROR
          );
          setDestinations([]);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadDestinations();

    return () => controller.abort();
  }, [selectedCategory]);

  // API 2: Obtener atracciones cercanas
  useEffect(() => {
    const controller = new AbortController();

    async function loadNearbyAttractions() {
      setNearbyLoading(true);
      setNearbyError("");

      try {
        const data = await fetchApi(
          "/api/atracciones-cercanas",
          controller.signal
        );

        if (!controller.signal.aborted) {
          setNearbyAttractions(data);
        }
      } catch (err) {
        if (!controller.signal.aborted) {
          setNearbyError(
            err.message || CONNECTION_ERROR
          );
          setNearbyAttractions([]);
        }
      } finally {
        if (!controller.signal.aborted) {
          setNearbyLoading(false);
        }
      }
    }

    loadNearbyAttractions();

    return () => controller.abort();
  }, []);

  // Filtrar destinos según la búsqueda
  const filteredFeatured = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();

    return destinations.filter((item) => {
      return (
        (item.title || "").toLowerCase().includes(query) ||
        (item.location || "").toLowerCase().includes(query)
      );
    });
  }, [destinations, searchQuery]);

  // Filtrar atracciones según categoría y búsqueda
  const filteredNearby = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();

    return nearbyAttractions.filter((item) => {
      const matchesSearch =
        (item.title || "").toLowerCase().includes(query) ||
        (item.description || "").toLowerCase().includes(query);

      const matchesCategory =
        selectedCategory === "Todos" ||
        item.category === selectedCategory ||
        (selectedCategory === "Populares" &&
          item.rating >= 4.8);

      return matchesSearch && matchesCategory;
    });
  }, [nearbyAttractions, searchQuery, selectedCategory]);

  return (
    <div className="explore-page">
      <main className="explore-page__content">

        {/* Cabecera */}
        <header className="explore-page__header">
          <div className="explore-page__welcome">
            <span className="explore-page__greeting">
              Bienvenida de nuevo,
            </span>

            <h1 className="explore-page__user-name">
              {nombreUsuario}
            </h1>
          </div>

          <div className="explore-page__header-actions">
            <button
              type="button"
              className="explore-page__notif-btn"
              onClick={() => navigate("/notificaciones")}
              aria-label="Ver notificaciones"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>

              <span className="explore-page__notif-dot" />
            </button>

            <button
              type="button"
              className="explore-page__avatar-btn"
              onClick={() => navigate("/perfil")}
              aria-label="Ir al perfil"
            >
              <img
                src={
                  usuario?.foto ||
                  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=120&auto=format&fit=crop"
                }
                alt={nombreUsuario}
                className="explore-page__avatar"
              />
            </button>
          </div>
        </header>

        {/* Buscador */}
        <section className="explore-page__search-section">
          <SearchBar
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onClear={() => setSearchQuery("")}
            placeholder="Buscar lugares o destinos de tu interés..."
            onFilterClick={() => navigate("/lugares")}
          />
        </section>

        {/* Categorías */}
        <nav
          className="explore-page__categories"
          aria-label="Categorías de lugares"
        >
          {categories.map((cat) => (
            <CategoryPill
              key={cat}
              label={cat}
              active={selectedCategory === cat}
              onClick={() => setSelectedCategory(cat)}
            />
          ))}
        </nav>

        {/* Estado: cargando destinos */}
        {loading && (
          <InfoBox
            title="Cargando destinos..."
            text="Obteniendo los lugares disponibles."
          />
        )}

        {/* Estado: error de destinos */}
        {!loading && error && (
          <InfoBox
            variant="alert"
            title="No se pudieron cargar los destinos"
            text={error}
          />
        )}

        {/* Lugares destacados */}
        {savedError && (
          <p role="alert" className="explore-page__error">
            {savedError}
          </p>
        )}
        {!loading && !error && (
          <section className="explore-page__section">
            <div className="explore-page__section-header">
              <h2 className="explore-page__section-title">
                Lugares Destacados ({filteredFeatured.length})
              </h2>

              <button
                type="button"
                className="explore-page__see-all"
                onClick={() => navigate("/lugares")}
              >
                Ver Todos
              </button>
            </div>

            {filteredFeatured.length > 0 ? (
              <div className="explore-page__featured-carousel">
                {filteredFeatured.map((place) => (
                  <FeaturedCard
                    key={place.id}
                    image={place.image}
                    title={place.title}
                    location={place.location}
                    tag={place.tag}
                    duration={place.duration}
                    price={place.price}
                    isSaved={savedIds.includes(place.id)}
                    onSave={() => toggleSave(place.id)}
                    saveDisabled={savingIds.includes(place.id)}
                    onClick={() =>
                      navigate(`/lugares/${place.id}`)
                    }
                  />
                ))}
              </div>
            ) : (
              <div className="explore-page__empty">
                <p className="explore-page__empty-title">
                  No se encontraron lugares en esta categoría
                </p>

                <p className="explore-page__empty-desc">
                  Intenta con otra categoría o restablece los filtros.
                </p>

                <button
                  type="button"
                  className="explore-page__reset-btn"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("Todos");
                  }}
                >
                  Mostrar todos
                </button>
              </div>
            )}
          </section>
        )}

        {/* Atracciones cercanas */}
        <section className="explore-page__section">
          <div className="explore-page__section-header">
            <h2 className="explore-page__section-title">
              Atracciones Cercanas
            </h2>

            <button
              type="button"
              className="explore-page__see-all"
              onClick={() => navigate("/lugares")}
            >
              Ver mapa completo
            </button>
          </div>

          {/* Estado: cargando atracciones */}
          {nearbyLoading && (
            <InfoBox
              title="Cargando atracciones..."
              text="Consultando las atracciones cercanas."
            />
          )}

          {/* Estado: error de atracciones */}
          {!nearbyLoading && nearbyError && (
            <InfoBox
              variant="alert"
              title="No se pudieron cargar las atracciones"
              text={nearbyError}
            />
          )}

          {/* Estado: sin resultados */}
          {!nearbyLoading &&
            !nearbyError &&
            filteredNearby.length === 0 && (
              <div className="explore-page__empty">
                <p className="explore-page__empty-title">
                  No se encontraron atracciones
                </p>

                <p className="explore-page__empty-desc">
                  Intenta con otra búsqueda o categoría.
                </p>
              </div>
            )}

          {/* Lista de atracciones */}
          {!nearbyLoading &&
            !nearbyError &&
            filteredNearby.length > 0 && (
              <div className="explore-page__nearby-list">
                {filteredNearby.map((place) => (
                  <article
                    key={place.id}
                    className="nearby-card"
                    onClick={() =>
                      navigate(`/lugares/${place.id}`)
                    }
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (
                        e.key === "Enter" ||
                        e.key === " "
                      ) {
                        e.preventDefault();
                        navigate(`/lugares/${place.id}`);
                      }
                    }}
                  >
                    <img
                      src={place.image}
                      alt={place.title}
                      className="nearby-card__image"
                    />

                    <div className="nearby-card__info">
                      <h3 className="nearby-card__title">
                        {place.title}
                      </h3>

                      <p className="nearby-card__desc">
                        {place.description}
                      </p>

                      <p className="nearby-card__rating">
                        <span className="nearby-card__star">
                          ★
                        </span>

                        <strong>{place.rating}</strong>

                        <span>
                          ({place.reviews} reseñas)
                        </span>
                      </p>
                    </div>

                    <div
                      className="nearby-card__chevron"
                      aria-hidden="true"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="9 18 15 12 9 6" />
                      </svg>
                    </div>
                  </article>
                ))}
              </div>
            )}
        </section>
      </main>
    </div>
  );
}
