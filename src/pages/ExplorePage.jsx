import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import SearchBar from "../components/SearchBar/SearchBar";
import CategoryPill from "../components/CategoryPill/CategoryPill";
import FeaturedCard from "../components/FeaturedCard/FeaturedCard";
import NavBar from "../components/NavBar/NavBar";
import "./ExplorePage.css";

const categories = [
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
  },
  {
    id: 2,
    title: "Tiwanaku",
    location: "Ingavi, La Paz, Bolivia",
    image:
      "https://images.unsplash.com/photo-1589802829985-817e51171b92?q=80&w=400&auto=format&fit=crop",
    tag: "Tour Guiado",
    price: "Bs. 100.00",
  },
  {
    id: 3,
    title: "Valle de la Luna",
    location: "Mallasa, La Paz, Bolivia",
    image:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=400&auto=format&fit=crop",
    tag: "Pase Libre",
    duration: "A 25 minutos",
  },
];

const nearbyAttractions = [
  {
    id: 4,
    title: "Teleférico Línea Morada",
    description: "Cadena de teleféricos para una visión...",
    rating: 4.9,
    reviews: "2.4k",
    image:
      "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=200&auto=format&fit=crop",
  },
  {
    id: 5,
    title: "Mirador Killi Killi",
    description: "Vistas panorámicas increíbles de la ciudad...",
    rating: 4.8,
    reviews: "1.9k",
    image:
      "https://images.unsplash.com/photo-1526392060635-9d6019884377?q=80&w=200&auto=format&fit=crop",
  },
];

export default function ExplorePage() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("Populares");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredFeatured = featuredDestinations.filter(
    (item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="explore-page">
      <main className="explore-page__content">
        {/* Cabecera de Usuario */}
        <header className="explore-page__header">
          <div className="explore-page__welcome">
            <span className="explore-page__greeting">Bienvenida de nuevo,</span>
            <h1 className="explore-page__user-name">Sofía Martínez</h1>
          </div>
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
        </header>

        {/* Buscador */}
        <section className="explore-page__search-section">
          <SearchBar
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar lugares o destinos de tu interés..."
            onFilterClick={() => {}}
          />
        </section>

        {/* Carrusel de Categorías */}
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
        <section className="explore-page__section">
          <div className="explore-page__section-header">
            <h2 className="explore-page__section-title">Lugares Destacados</h2>
            <button
              type="button"
              className="explore-page__see-all"
              onClick={() => {}}
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
                onClick={() => navigate(`/agendar/${place.id}`)}
              />
            ))}
          </div>
        </section>

        {/* Sección Atracciones Cercanas */}
        <section className="explore-page__section">
          <div className="explore-page__section-header">
            <h2 className="explore-page__section-title">Atracciones Cercanas</h2>
          </div>

          <div className="explore-page__nearby-list">
            {nearbyAttractions.map((place) => (
              <article
                key={place.id}
                className="nearby-card"
                onClick={() => navigate(`/agendar/${place.id}`)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    navigate(`/agendar/${place.id}`);
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
      </main>

      {/* Barra de Navegación Inferior */}
      <NavBar
        activeTab="explore"
        onTabChange={(tab) => {
          if (tab === "history") navigate("/historial");
          else if (tab === "profile") navigate("/perfil");
        }}
      />
    </div>
  );
}
