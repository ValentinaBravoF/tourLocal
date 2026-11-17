import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ExperienceSummary from "../components/ExperienceSummary/ExperienceSummary";
import ReservationDetailCard from "../components/ReservationDetailCard/ReservationDetailCard";
import PriceSummary from "../components/PriceSummary/PriceSummary";
import Button from "../components/Button/Button";
import GuideCard from "../components/GuideCard/GuideCard"; // ¡Faltaba importar GuideCard!
import {
  formatTourDate,
  parseTourDateTime,
} from "../services/reservationDates";
import { getUserHeaders } from "../services/userService";
import "./ExperienceDetailPage.css";

export default function ExperienceDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [reserva, setReserva] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [ahora] = useState(() => new Date());

  // Nuevos estados para cargar dinámicamente la imagen y el guía
  const [destinos, setDestinos] = useState([]);
  const [guiaData, setGuiaData] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    async function cargarDatos() {
      setLoading(true);
      setError("");
      setReserva(null);

      try {
        // 1. Cargamos la reserva
        const resReserva = await fetch(`/api/reservas/${id}`, {
          headers: getUserHeaders(),
          signal: controller.signal,
        });

        if (!resReserva.ok) {
          throw new Error("No se pudo obtener la información de la reserva.");
        }
        const dataReserva = await resReserva.json();
        
        // 2. Cargamos TODOS los destinos (para buscar la imagen correcta)
        const resDestinos = await fetch(`/api/destinos`, {
          signal: controller.signal,
        });
        
        let listaDestinos = [];
        if (resDestinos.ok) {
           listaDestinos = await resDestinos.json();
           setDestinos(listaDestinos);
        }

        // 3. Cargamos el guía si tenemos el ID
        if (dataReserva.guiaId) {
            const resGuia = await fetch(`/api/guias/${dataReserva.guiaId}`, {
                signal: controller.signal,
            });
            if (resGuia.ok) {
                setGuiaData(await resGuia.json());
            }
        } else if (dataReserva.guia) {
            // Fallback: si no hay ID pero hay nombre, buscamos en la lista general de guías
            const resGuiasAll = await fetch(`/api/guias`, { signal: controller.signal });
            if (resGuiasAll.ok) {
                const todosLosGuias = await resGuiasAll.json();
                const guiaEncontrado = todosLosGuias.find(g => g.name === dataReserva.guia);
                if (guiaEncontrado) setGuiaData(guiaEncontrado);
            }
        }

        if (!controller.signal.aborted) {
          setReserva(dataReserva);
        }
      } catch (err) {
        if (!controller.signal.aborted) {
          setError(
            err instanceof Error
              ? err.message
              : "No se pudo cargar la reserva."
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    cargarDatos();
    return () => controller.abort();
  }, [id]);

  function volver() {
    navigate("/historial");
  }

  // --- Lógica de estado de la reserva ---
  const fechaTour = reserva
    ? parseTourDateTime(reserva.fecha, reserva.horario)
    : null;
  const esPasada =
    reserva?.tipo === "past" ||
    reserva?.estado === "completada" ||
    (reserva?.estado === "confirmada" &&
      fechaTour !== null &&
      fechaTour <= ahora);
  const puedeCancelar =
    reserva?.estado === "confirmada" &&
    fechaTour !== null &&
    fechaTour > ahora;
  const tituloEstado = esPasada
    ? "Experiencia realizada"
    : reserva?.estado === "cancelada"
      ? "Reserva cancelada"
      : puedeCancelar
        ? "Próxima experiencia"
        : "No se pudo validar la fecha";
  const descripcionEstado = esPasada
    ? "¡Esperamos que hayas disfrutado tu recorrido!"
    : reserva?.estado === "cancelada"
      ? "Esta reserva fue cancelada."
      : puedeCancelar
        ? "Puedes cancelar esta reserva antes de que comience el tour."
        : "Revisa los datos de fecha y hora de esta reserva.";
  
  const participantes = Number(reserva?.participantes) || 1;
  const precioPorPersona = Number(reserva?.precioPorPersona);
  const tarifaServicio = Number(reserva?.tarifaServicio) || 0;
  const total = reserva?.total == null ? Number.NaN : Number(reserva.total);
  const tienePrecio = Number.isFinite(total) || (Number.isFinite(precioPorPersona) && precioPorPersona > 0);

  // --- Lógica para buscar la imagen correcta ---
  // Buscamos el destino en la lista que coincida con el nombre de la reserva
  const destinoEncontrado = destinos.find(d => 
      d.title === reserva?.experiencia || 
      d.name === reserva?.experiencia || 
      d.title === reserva?.nombre
  );
  
  // Usamos la imagen de la BD, o un fallback genérico si no se encuentra
  const imagenMostrar = reserva?.imagen || destinoEncontrado?.image || "https://images.unsplash.com/photo-1583535314398-3eb1a23424a9?q=80&w=200&auto=format&fit=crop";

  return (
    <div className="experience-detail-page">
      <header className="experience-detail-page__header">
        <button
          type="button"
          className="experience-detail-page__back"
          onClick={volver}
          aria-label="Volver al historial"
        >
          ←
        </button>
        <h1>Detalle de la experiencia</h1>
      </header>

      <main className="experience-detail-page__content">
        {loading && <p role="status">Cargando información de la reserva...</p>}

        {!loading && error && (
          <section role="alert">
            <h2>No se pudo cargar la experiencia</h2>
            <p>{error}</p>
            <Button variant="secondary" onClick={volver}>
              Volver al historial
            </Button>
          </section>
        )}

        {!loading && !error && reserva && (
          <>
            <section className="experience-detail-page__intro">
              <div className="experience-detail-page__status">
                <span className="experience-detail-page__check">
                  {esPasada ? "✓" : "•"}
                </span>
                <div>
                  <h2>{tituloEstado}</h2>
                  <p>{descripcionEstado}</p>
                </div>
              </div>
            </section>

            <section className="experience-detail-page__section">
              <ExperienceSummary
                destino={reserva.experiencia || reserva.nombre}
                imagen={imagenMostrar} // Aquí pasamos la imagen correcta
                ubicacion={reserva.ubicacion || destinoEncontrado?.location || "La Paz, Bolivia"}
                categoria={reserva.categoria || destinoEncontrado?.category || "EXPERIENCIA"}
                calificacion={reserva.calificacion || destinoEncontrado?.rating || "4.9"}
                resenas={reserva.resenas || destinoEncontrado?.reviews || "248 reseñas"}
                estado={esPasada ? "realizada" : reserva.estado}
              />
            </section>

            <section className="experience-detail-page__section">
              <ReservationDetailCard
                titulo="Detalles de la reserva"
                fecha={formatTourDate(reserva.fecha)}
                horario={reserva.horario || "No registrado"}
                participantes={`${participantes} personas`}
                ubicacion={reserva.ubicacion || destinoEncontrado?.location || "La Paz, Bolivia"}
                notas={reserva.notas}
                estado={
                  reserva.estado === "cancelada" ? "cancelacion" : "normal"
                }
              />
            </section>

            {/* SECCIÓN DEL GUÍA ACTUALIZADA */}
            <section className="experience-detail-page__section">
              <h2 className="experience-detail-page__section-title">
                Tu guía asignado
              </h2>
              {guiaData ? (
                 <GuideCard
                 foto={guiaData.avatar}
                 nombre={guiaData.name}
                 descripcion={guiaData.description}
                 calificacion={String(guiaData.rating)}
                 resenas={String(guiaData.reviews)}
                 onVerPerfil={() => navigate(`/app/guias/${guiaData.id}`)}
               />
              ) : (
                <div style={{ padding: "12px", border: "1px solid #eae6e1", borderRadius: "12px" }}>
                    <p style={{ margin: "0 0 8px 0", fontWeight: "bold" }}>{reserva.guia || "Guía Local"}</p>
                    {reserva.guiaId && (
                    <Button
                        variant="secondary"
                        onClick={() => navigate(`/app/guias/${reserva.guiaId}`)}
                    >
                        Ver perfil del guía
                    </Button>
                    )}
                </div>
              )}
            </section>

            {tienePrecio && (
              <section className="experience-detail-page__section">
                <PriceSummary
                  titulo="Total de la reserva"
                  precioPorPersona={
                    Number.isFinite(precioPorPersona) && precioPorPersona > 0
                      ? precioPorPersona
                      : total / participantes
                  }
                  participantes={participantes}
                  tarifaServicio={tarifaServicio}
                  total={Number.isFinite(total) ? total : undefined}
                  variante="pagado"
                />
              </section>
            )}

            <div className="experience-detail-page__actions">
              {puedeCancelar && (
                <Button
                  variant="danger"
                  onClick={() =>
                    navigate(`/app/cancelar-reserva/${reserva.id}`, {
                      state: { reserva },
                    })
                  }
                >
                  Cancelar reserva
                </Button>
              )}
              {esPasada && !reserva.hasRating && (
                <Button
                  variant="primary"
                  onClick={() =>
                    navigate(`/experiencias/${reserva.id}/calificar`)
                  }
                >
                  Calificar experiencia
                </Button>
              )}
              <button
                type="button"
                className="experience-detail-page__secondary"
                onClick={() => navigate("/explorar")}
              >
                Volver a explorar
              </button>
            </div>
          </>
        )}
      </main>
    </div>
  );
}