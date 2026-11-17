import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import HeaderBar from "../components/HeaderBar/HeaderBar";
import SearchBar from "../components/SearchBar/SearchBar";
import CategoryPill from "../components/CategoryPill/CategoryPill";
import FeaturedCard from "../components/FeaturedCard/FeaturedCard";
import {
  getSavedPlaces,
  removeSavedPlace,
  savePlace,
} from "../services/savedPlaces";
import "./AllPlacesPage.css";

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

  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("populares");
  const [savedIds, setSavedIds] = useState([]);
  const [savingIds, setSavingIds] = useState([]);
  const [savedError, setSavedError] = useState("");

  // 1. Cargar destinos desde la base de datos (SQLite)
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);

    fetch("/api/destinos", { signal: controller.signal })
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        if (!controller.signal.aborted && Array.isArray(data)) {
          const formateados = data.map((item) => {
            const match = String(item.price || "").match(/\d+(?:\.\d+)?/);
            return {
              ...item,
              priceNumber: /gratis/i.test(String(item.price))
                ? 0
                : match
                  ? Number(match[0])
                  : 0,
            };
          });
          setDestinations(formateados);
        }
      })
      .catch(() => {})
      .finally(() => {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      });

    return () => controller.abort();
  }, []);

  // 2. Cargar lugares guardados del usuario
  useEffect(() => {
    const controller = new AbortController();

    getSavedPlaces(controller.signal)
      .then((places) => {
        if (!controller.signal.aborted && Array.isArray(places)) {
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
      setSavedError(
        err instanceof Error
          ? err.message
          : "No se pudo actualizar el guardado.",
      );
    } finally {
      setSavingIds((previous) =>
        previous.filter((savingId) => savingId !== id),
      );
    }
  }

  const filteredPlaces = useMemo(() => {
    return destinations
      .filter((item) => {
        const title = (item.title || "").toLowerCase();
        const location = (item.location || "").toLowerCase();
        const query = searchQuery.toLowerCase().trim();

        const matchesSearch = title.includes(query) || location.includes(query);
        const matchesCategory =
          selectedCategory === "Todos" ||
          item.category === selectedCategory ||
          (selectedCategory === "Populares" && Number(item.rating) >= 4.8) ||
          (selectedCategory === "Miradores" &&
            (item.category === "Miradores" ||
              title.includes("mirador") ||
              title.includes("letrero")));

        return matchesSearch && matchesCategory;
      })
      .sort((a, b) => {
        if (sortBy === "calificacion") return Number(b.rating) - Number(a.rating);
        if (sortBy === "precio-menor") return a.priceNumber - b.priceNumber;
        return Number(b.rating) - Number(a.rating);
      });
  }, [destinations, searchQuery, selectedCategory, sortBy]);

  return (
    <div className="all-places-page">
      <HeaderBar
        title="Todos los Destinos"
        showBackButton={true}
        onBackClick={() => navigate("/explorar")}
      />

      <main className="all-places-page__content">
        {savedError && <p role="alert">{savedError}</p>}

        <section className="all-places-page__search">
          <SearchBar
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onClear={() => setSearchQuery("")}
            placeholder="Buscar por nombre, zona o categoría..."
          />
        </section>

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

        <div className="all-places-page__meta-bar">
          <span className="all-places-page__count">
            {filteredPlaces.length}{" "}
            {filteredPlaces.length === 1
              ? "lugar encontrado"
              : "lugares encontrados"}
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

        {loading ? (
          <div className="all-places-page__empty">
            <p className="all-places-page__empty-title">Cargando destinos...</p>
          </div>
        ) : filteredPlaces.length > 0 ? (
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
                saveDisabled={savingIds.includes(place.id)}
                onClick={() => navigate(`/lugares/${place.id}`)}
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