import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import SearchBar from "../components/SearchBar/SearchBar";
import CategoryPill from "../components/CategoryPill/CategoryPill";
import FeaturedCard from "../components/FeaturedCard/FeaturedCard";
import "./ExplorePage.css";

const categories = [
  "Todos",
  "Populares",
  "Históricos",
  "Parques",
  "Senderismo",
  "Museos",
];

const featuredDestinations = [
  {
    id: 1,
    title: 'Letrero "LA PAZ"',
    location: "Murillo, La Paz, Bolivia",
    image:
      "https://images.unsplash.com/photo-1583535314398-3eb1a23424a9?q=80&w=400&auto=format&fit=crop",
    tag: "Pase Libre",
    duration: "A 40 minutos",
    category: "Parques",
    rating: 4.9,
  },
  {
    id: 2,
    title: "Tiwanaku",
    location: "Ingavi, La Paz, Bolivia",
    image:
      "https://images.unsplash.com/photo-1589802829985-817e51171b92?q=80&w=400&auto=format&fit=crop",
    tag: "Tour Guiado",
    price: "Bs. 100.00",
    category: "Históricos",
    rating: 4.8,
  },
  {
    id: 3,
    title: "Valle de la Luna",
    location: "Mallasa, La Paz, Bolivia",
    image:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=400&auto=format&fit=crop",
    tag: "Pase Libre",
    duration: "A 25 minutos",
    category: "Parques",
    rating: 4.7,
  },
  {
    id: 7,
    title: "Muela del Diablo",
    location: "Pedregal, La Paz, Bolivia",
    image:
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=400&auto=format&fit=crop",
    tag: "Senderismo",
    duration: "A 1 hora",
    category: "Senderismo",
    rating: 4.6,
  },
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
      "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=200&auto=format&fit=crop",
  },
  {
    id: 5,
    title: "Mirador Killi Killi",
    description: "Vistas panorámicas increíbles de la ciudad...",
    rating: 4.8,
    reviews: "1.9k",
    category: "Parques",
    image:
      "https://images.unsplash.com/photo-1526392060635-9d6019884377?q=80&w=200&auto=format&fit=crop",
  },
  {
    id: 6,
    title: "Calle de las Brujas",
    description: "Tradición andina, artesanías y amuletos milenarios...",
    rating: 4.9,
    reviews: "2.4k",
    category: "Históricos",
    image:
      "https://images.unsplash.com/photo-1589556264807-12c3f4b5d322?q=80&w=200&auto=format&fit=crop",
  },
  {
    id: 8,
    title: "Museo Nacional de Arte",
    description: "Colección colonial y contemporánea en casona barroca...",
    rating: 4.7,
    reviews: "950",
    category: "Museos",
    image:
      "https://images.unsplash.com/photo-1566127444979-b3d2b654e3d7?q=80&w=200&auto=format&fit=crop",
  },
];

export default function ExplorePage() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [searchQuery, setSearchQuery] = useState("");
  const [savedIds, setSavedIds] = useState([1, 3]);

  const toggleSave = (id) => {
    setSavedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const filteredFeatured = useMemo(() => {
    return featuredDestinations.filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.location &&
          item.location.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCat =
        selectedCategory === "Todos" ||
        item.category === selectedCategory ||
        (selectedCategory === "Populares" && item.rating >= 4.8);

      return matchesSearch && matchesCat;
    });
  }, [searchQuery, selectedCategory]);

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

  const hasResults = filteredFeatured.length > 0 || filteredNearby.length > 0;

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
              onClick={() => navigate("/app/notificaciones")}
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
              onClick={() => navigate("/app/perfil")}
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
            onFilterClick={() => navigate("/app/lugares")}
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

        {/* Sección Lugares Destacados */}
        {filteredFeatured.length > 0 && (
          <section className="explore-page__section">
            <div className="explore-page__section-header">
              <h2 className="explore-page__section-title">Lugares Destacados</h2>
              <button
                type="button"
                className="explore-page__see-all"
                onClick={() => navigate("/app/lugares")}
              >
                Ver Todos
              </button>
            </div>

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
                  onClick={() => navigate(`/app/lugares/${place.id}`)}
                />
              ))}
            </div>
          </section>
        )}

        {/* Sección Atracciones Cercanas */}
        {filteredNearby.length > 0 && (
          <section className="explore-page__section">
            <div className="explore-page__section-header">
              <h2 className="explore-page__section-title">
                Atracciones Cercanas
              </h2>
              <button
                type="button"
                className="explore-page__see-all"
                onClick={() => navigate("/app/lugares")}
              >
                Ver mapa completo
              </button>
            </div>

            <div className="explore-page__nearby-list">
              {filteredNearby.map((place) => (
                <article
                  key={place.id}
                  className="nearby-card"
                  onClick={() => navigate(`/app/lugares/${place.id}`)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      navigate(`/app/lugares/${place.id}`);
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

        {/* Sin resultados */}
        {!hasResults && (
          <div className="explore-page__empty">
            <p className="explore-page__empty-title">
              No se encontraron lugares en esta categoría
            </p>
            <p className="explore-page__empty-desc">
              Intenta con otra palabra clave o restablece los filtros.
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
      </main>
    </div>
  );
}
