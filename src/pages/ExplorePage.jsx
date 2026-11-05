import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import SearchBar from "../components/SearchBar/SearchBar";
import CategoryPill from "../components/CategoryPill/CategoryPill";
import FeaturedCard from "../components/FeaturedCard/FeaturedCard";
import InfoBox from "../components/InfoBox/InfoBox";
import "./ExplorePage.css";

const categories = [
  "Todos",
  "Populares",
  "Históricos",
  "Parques",
  "Senderismo",
  "Museos",
];

const nearbyAttractions = [
  {
    id: 4,
    title: "Teleférico Línea Morada",
    description: "Cadena de teleféricos para una visión panorámica...",
    rating: 4.9,
    reviews: "2.4k",
    category: "Populares",
    image:
      "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=300&auto=format&fit=crop",
  },
  {
    id: 5,
    title: "Mirador Killi Killi",
    description: "Vistas panorámicas increíbles de la ciudad...",
    rating: 4.8,
    reviews: "1.9k",
    category: "Parques",
    image:
      "https://images.unsplash.com/photo-1526392060635-9d6019884377?q=80&w=300&auto=format&fit=crop",
  },
  {
    id: 6,
    title: "Calle de las Brujas",
    description: "Tradición andina, artesanías y amuletos milenarios...",
    rating: 4.9,
    reviews: "2.4k",
    category: "Históricos",
    image:
      "https://images.unsplash.com/photo-1589556264807-12c3f4b5d322?q=80&w=300&auto=format&fit=crop",
  },
  {
    id: 8,
    title: "Museo Nacional de Arte",
    description: "Colección colonial y contemporánea en casona barroca...",
    rating: 4.7,
    reviews: "950",
    category: "Museos",
    image:
      "https://images.unsplash.com/photo-1566127444979-b3d2b654e3d7?q=80&w=300&auto=format&fit=crop",
  },
];

export default function ExplorePage() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [searchQuery, setSearchQuery] = useState("");
  const [savedIds, setSavedIds] = useState([1, 3]);

  // Estados de la API
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const toggleSave = (id) => {
    setSavedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Carga de datos desde la API
  useEffect(() => {
    async function loadDestinations() {
      try {
        setLoading(true);
        setError("");
        const response = await fetch(
          `/api/destinos?categoria=${encodeURIComponent(selectedCategory)}`
        );
        const data = await response.json();

        if (response.ok) {
          setDestinations(data);
        } else {
          setError(data.error || "Error al cargar los destinos");
        }
      } catch {
        setError("No se pudo conectar con la API. ¿Está encendida?");
      } finally {
        setLoading(false);
      }
    }

    loadDestinations();
  }, [selectedCategory]);

  const filteredFeatured = useMemo(() => {
    return destinations.filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.location &&
          item.location.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchesSearch;
    });
  }, [destinations, searchQuery]);

  const filteredNearby = useMemo(() => {
    return nearbyAttractions.filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.description &&
          item.description.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCat =
        selectedCategory === "Todos" ||
        item.category === selectedCategory ||
        (selectedCategory === "Populares" && item.rating >= 4.8);

      return matchesSearch && matchesCat;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <div className="explore-page">
      <main className="explore-page__content">
        {/* Cabecera con Saludo, Notificaciones y Perfil */}
        <header className="explore-page__header">
          <div className="explore-page__welcome">
            <span className="explore-page__greeting">Bienvenida de nuevo,</span>
            <h1 className="explore-page__user-name">Sofía Martínez</h1>
          </div>
          <div className="explore-page__header-actions">
            <button
              type="button"
              className="explore-page__notif-btn"
              onClick={() => navigate("/notificaciones")}
              aria-label="Ver notificaciones"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=120&auto=format&fit=crop"
                alt="Sofía Martínez"
                className="explore-page__avatar"
              />
            </button>
          </div>
        </header>

        {/* Buscador interactivo */}
        <section className="explore-page__search-section">
          <SearchBar
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onClear={() => setSearchQuery("")}
            placeholder="Buscar lugares o destinos de tu interés..."
            onFilterClick={() => navigate("/lugares")}
          />
        </section>

        {/* Píldoras de Categorías funcionales */}
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

        {/* Aviso de carga */}
        {loading && (
          <InfoBox
            title="Cargando destinos…"
            text="Obteniendo lugares disponibles desde la API de TourLocal."
          />
        )}

        {/* Aviso de error */}
        {error && (
          <InfoBox
            variant="alert"
            title="No se pudo cargar"
            text={error}
          />
        )}

        {/* Sección Lugares Destacados */}
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
                    onClick={() => navigate(`/lugares/${place.id}`)}
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

        {/* Sección Atracciones Cercanas */}
        {!loading && filteredNearby.length > 0 && (
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

            <div className="explore-page__nearby-list">
              {filteredNearby.map((place) => (
                <article
                  key={place.id}
                  className="nearby-card"
                  onClick={() => navigate(`/lugares/${place.id}`)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
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
                    <h3 className="nearby-card__title">{place.title}</h3>
                    <p className="nearby-card__desc">{place.description}</p>
                    <p className="nearby-card__rating">
                      <span className="nearby-card__star">★</span>
                      <strong>{place.rating}</strong>
                      <span>({place.reviews} reseñas)</span>
                    </p>
                  </div>
                  <div className="nearby-card__chevron" aria-hidden="true">
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
          </section>
        )}
      </main>
    </div>
  );
}
