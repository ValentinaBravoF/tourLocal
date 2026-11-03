import React, { useState, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import HeaderBar from "../components/HeaderBar/HeaderBar";
import SearchBar from "../components/SearchBar/SearchBar";
import CategoryPill from "../components/CategoryPill/CategoryPill";
import FeaturedCard from "../components/FeaturedCard/FeaturedCard";
import "./AllPlacesPage.css";

const ALL_DESTINATIONS = [
  {
    id: 1,
    title: 'Letrero "LA PAZ"',
    location: "Murillo, La Paz, Bolivia",
    image:
      "https://images.unsplash.com/photo-1583535314398-3eb1a23424a9?q=80&w=400&auto=format&fit=crop",
    tag: "Pase Libre",
    duration: "A 40 minutos",
    priceNumber: 0,
    category: "Miradores",
    rating: 4.9,
    reviews: "2.4k",
  },
  {
    id: 2,
    title: "Tiwanaku",
    location: "Ingavi, La Paz, Bolivia",
    image:
      "https://images.unsplash.com/photo-1589802829985-817e51171b92?q=80&w=400&auto=format&fit=crop",
    tag: "Tour Guiado",
    price: "Bs. 100.00",
    priceNumber: 100,
    category: "Históricos",
    rating: 4.8,
    reviews: "3.1k",
  },
  {
    id: 3,
    title: "Valle de la Luna",
    location: "Mallasa, La Paz, Bolivia",
    image:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=400&auto=format&fit=crop",
    tag: "Pase Libre",
    duration: "A 25 minutos",
    priceNumber: 15,
    category: "Parques",
    rating: 4.7,
    reviews: "1.9k",
  },
  {
    id: 4,
    title: "Teleférico Línea Morada",
    location: "El Prado, La Paz, Bolivia",
    image:
      "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=400&auto=format&fit=crop",
    tag: "Pase Libre",
    duration: "A 15 minutos",
    priceNumber: 3,
    category: "Populares",
    rating: 4.9,
    reviews: "2.4k",
  },
  {
    id: 5,
    title: "Mirador Killi Killi",
    location: "Villa Pabón, La Paz, Bolivia",
    image:
      "https://images.unsplash.com/photo-1526392060635-9d6019884377?q=80&w=400&auto=format&fit=crop",
    tag: "Pase Libre",
    duration: "A 20 minutos",
    priceNumber: 0,
    category: "Miradores",
    rating: 4.8,
    reviews: "1.9k",
  },
  {
    id: 6,
    title: "Calle de las Brujas",
    location: "Linares y Sagárnaga, La Paz",
    image:
      "https://images.unsplash.com/photo-1589556264807-12c3f4b5d322?w=400&auto=format&fit=crop",
    tag: "Tour Guiado",
    price: "Bs. 80.00",
    priceNumber: 80,
    category: "Históricos",
    rating: 4.9,
    reviews: "2.4k",
  },
  {
    id: 7,
    title: "Muela del Diablo",
    location: "Pedregal, La Paz, Bolivia",
    image:
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=400&auto=format&fit=crop",
    tag: "Senderismo",
    duration: "A 1 hora",
    priceNumber: 40,
    category: "Senderismo",
    rating: 4.6,
    reviews: "820",
  },
  {
    id: 8,
    title: "Museo Nacional de Arte",
    location: "Calle Comercio, La Paz, Bolivia",
    image:
      "https://images.unsplash.com/photo-1566127444979-b3d2b654e3d7?q=80&w=400&auto=format&fit=crop",
    tag: "Museo",
    price: "Bs. 20.00",
    priceNumber: 20,
    category: "Museos",
    rating: 4.7,
    reviews: "950",
  },
];

const CATEGORIES = [
  "Todos",
  "Populares",
  "Históricos",
  "Miradores",
  "Parques",
  "Senderismo",
  "Museos",
];

export default function AllPlacesPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get("categoria") || "Todos";

  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("populares");
  const [savedIds, setSavedIds] = useState([1, 3]);

  const toggleSave = (id) => {
    setSavedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const filteredPlaces = useMemo(() => {
    return ALL_DESTINATIONS.filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.location.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === "Todos" ||
        item.category === selectedCategory ||
        (selectedCategory === "Populares" && item.rating >= 4.8);
      return matchesSearch && matchesCategory;
    }).sort((a, b) => {
      if (sortBy === "calificacion") return b.rating - a.rating;
      if (sortBy === "precio-menor") return a.priceNumber - b.priceNumber;
      return b.rating - a.rating; // Default 'populares'
    });
  }, [searchQuery, selectedCategory, sortBy]);

  return (
    <div className="all-places-page">
      <HeaderBar
        title="Todos los Destinos"
        showBackButton={true}
        onBackClick={() => navigate("/app/explorar")}
      />

      <main className="all-places-page__content">
        {/* Barra de búsqueda */}
        <section className="all-places-page__search">
          <SearchBar
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onClear={() => setSearchQuery("")}
            placeholder="Buscar por nombre, zona o categoría..."
          />
        </section>

        {/* Píldoras de Categorías */}
        <nav
          className="all-places-page__categories"
          aria-label="Filtro de categorías"
        >
          {CATEGORIES.map((cat) => (
            <CategoryPill
              key={cat}
              label={cat}
              active={selectedCategory === cat}
              onClick={() => setSelectedCategory(cat)}
            />
          ))}
        </nav>

        {/* Barra de resultados y ordenamiento */}
        <div className="all-places-page__meta-bar">
          <span className="all-places-page__count">
            {filteredPlaces.length}{" "}
            {filteredPlaces.length === 1 ? "lugar encontrado" : "lugares encontrados"}
          </span>
          <select
            className="all-places-page__sort"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            aria-label="Ordenar por"
          >
            <option value="populares">Más populares</option>
            <option value="calificacion">Mejor calificados</option>
            <option value="precio-menor">Precio menor a mayor</option>
          </select>
        </div>

        {/* Cuadrícula de Destinos */}
        {filteredPlaces.length > 0 ? (
          <div className="all-places-page__grid">
            {filteredPlaces.map((place) => (
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
        ) : (
          <div className="all-places-page__empty">
            <p className="all-places-page__empty-title">
              No encontramos lugares para tu búsqueda
            </p>
            <p className="all-places-page__empty-desc">
              Prueba cambiando los filtros o buscando con otros términos.
            </p>
            <button
              type="button"
              className="all-places-page__reset-btn"
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("Todos");
              }}
            >
              Restablecer filtros
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
