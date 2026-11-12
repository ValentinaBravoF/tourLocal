
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import HeaderBar from "../components/HeaderBar/HeaderBar";
import RatingBar from "../components/RatingBar/RatingBar";
import ExperienceCard from "../components/ExperienceCard/ExperienceCard";
import Button from "../components/Button/Button";

const experiencias = [
  {
    id: 6,
    nombre: "Calle de las Brujas",
    ubicacion: "La Paz, Bolivia",
    calificacion: "4.9",
    resenas: "2,481",
    imagen:
      "https://images.unsplash.com/photo-1589556264807-12c3f4b5d322?w=400&auto=format&fit=crop",
  },
  {
    id: 2,
    nombre: "Montículo",
    ubicacion: "La Paz, Bolivia",
    calificacion: "4.6",
    resenas: "1,421",
    imagen:
      "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=400&auto=format&fit=crop",
  },
  {
    id: 3,
    nombre: "Valle de la Luna",
    ubicacion: "La Paz, Bolivia",
    calificacion: "4.8",
    resenas: "2,031",
    imagen:
      "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&auto=format&fit=crop",
  },
];

const pageStyle = {
  backgroundColor: "var(--color-background)",
  minHeight: "100vh",
  display: "flex",
  flexDirection: "column",
};

const mainStyle = {
  padding: "20px 16px",
  maxWidth: "430px",
  margin: "0 auto",
  width: "100%",
  boxSizing: "border-box",
  display: "flex",
  flexDirection: "column",
  gap: "20px",
};

export default function GuideProfilePage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [guide, setGuide] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function cargarGuia() {
      try {
        setLoading(true);
        setError("");
        setGuide(null);

        const response = await fetch(`/api/guias/${id}`, {
          signal: controller.signal,
        });

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("Guía no encontrado.");
          }

          if (response.status === 400) {
            throw new Error("El identificador del guía no es válido.");
          }

          throw new Error("No se pudo cargar el perfil del guía.");
        }

        const data = await response.json();

        if (!data || Array.isArray(data) || !data.name) {
          throw new Error("La API devolvió datos inválidos.");
        }

        if (!controller.signal.aborted) {
          setGuide(data);
        }
      } catch (err) {
        if (!controller.signal.aborted) {
          setError(
            err instanceof TypeError || err instanceof SyntaxError
              ? "No se pudo conectar con la API. Verifica que el backend esté encendido."
              : err.message
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    cargarGuia();

    return () => controller.abort();
  }, [id]);

  return (
    <div style={pageStyle}>
      <HeaderBar
        title="Perfil del guía"
        showBackButton={true}
        onBackClick={() => navigate(-1)}
      />

      <main style={mainStyle}>
        {loading && (
          <p role="status">Cargando perfil del guía...</p>
        )}

        {!loading && error && (
          <div role="alert">
            <strong>No se pudo cargar el guía</strong>
            <p>{error}</p>

            <Button
              variant="secondary"
              onClick={() => navigate(-1)}
            >
              Volver
            </Button>
          </div>
        )}

        {!loading && !error && guide && (
          <>
            {/* Cabecera del guía */}
            <section
              style={{
                display: "flex",
                alignItems: "center",
                gap: "14px",
              }}
            >
              {guide.avatar ? (
                <img
                  src={guide.avatar}
                  alt={guide.name}
                  style={{
                    width: "68px",
                    height: "68px",
                    borderRadius: "50%",
                    objectFit: "cover",
                    flexShrink: 0,
                  }}
                />
              ) : (
                <div
                  aria-label="Sin fotografía"
                  style={{
                    width: "68px",
                    height: "68px",
                    borderRadius: "50%",
                    backgroundColor: "var(--color-info-bg)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "24px",
                    fontWeight: "700",
                    color: "var(--color-primary)",
                    flexShrink: 0,
                  }}
                >
                  {guide.name.charAt(0)}
                </div>
              )}

              <div>
                <h2
                  style={{
                    margin: "0 0 4px",
                    fontSize: "18px",
                    fontWeight: "700",
                    color: "var(--color-text)",
                  }}
                >
                  {guide.name}
                </h2>

                <p
                  style={{
                    margin: "0 0 6px",
                    fontSize: "12px",
                    color: "var(--color-muted)",
                  }}
                >
                  Guía local en {guide.location}
                </p>

                <RatingBar
                  rating={Number(guide.rating)}
                  reviewsCount={String(guide.reviews)}
                  variant="readonly"
                />
              </div>
            </section>

            {/* Biografía */}
            <section
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "10px",
              }}
            >
              <h3
                style={{
                  margin: 0,
                  fontSize: "15px",
                  fontWeight: "700",
                  color: "var(--color-text)",
                }}
              >
                Sobre el guía
              </h3>

              <p
                style={{
                  margin: 0,
                  fontSize: "13px",
                  lineHeight: "1.5",
                  color: "var(--color-muted)",
                }}
              >
                {guide.description}
              </p>

              {guide.quote && (
                <blockquote
                  style={{
                    margin: "6px 0 0",
                    padding: "14px 16px",
                    backgroundColor: "var(--color-info-bg)",
                    border: "1.5px solid var(--color-primary)",
                    borderRadius: "var(--radius)",
                    color: "var(--color-primary)",
                    fontSize: "12px",
                    lineHeight: "1.5",
                    fontStyle: "italic",
                  }}
                >
                  "{guide.quote}"

                  <footer
                    style={{
                      marginTop: "6px",
                      fontWeight: "700",
                      fontStyle: "normal",
                    }}
                  >
                    — {guide.name}
                  </footer>
                </blockquote>
              )}
            </section>

            {/* Experiencias existentes */}
            <section
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "12px",
              }}
            >
              <h3
                style={{
                  margin: 0,
                  fontSize: "15px",
                  fontWeight: "700",
                  color: "var(--color-text)",
                }}
              >
                Experiencias que ofrece
              </h3>

              {experiencias.map((exp) => (
                <div
                  key={exp.id}
                  onClick={() => navigate(`/lugares/${exp.id}`)}
                  style={{ cursor: "pointer" }}
                >
                  <ExperienceCard
                    imagen={exp.imagen}
                    nombre={exp.nombre}
                    ubicacion={exp.ubicacion}
                    calificacion={exp.calificacion}
                    resenas={exp.resenas}
                    onVerDetalles={() =>
                      navigate(`/lugares/${exp.id}`)
                    }
                  />
                </div>
              ))}
            </section>

            <Button
              variant="primary"
              onClick={() => navigate("/agendar/1")}
            >
              Contactar al guía
            </Button>
          </>
        )}
      </main>
    </div>
  );
}
