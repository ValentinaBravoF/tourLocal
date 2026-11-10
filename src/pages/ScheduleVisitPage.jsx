
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import HeaderBar from "../components/HeaderBar/HeaderBar";
import SlotCard from "../components/slotcard/SlotCard";
import Button from "../components/Button/Button";
import "./ScheduleVisitPage.css";

function sumarDias(fecha, cantidad) {
  const nueva = new Date(fecha);
  nueva.setDate(nueva.getDate() + cantidad);
  return nueva;
}

function fechaClave(fecha) {
  return `${fecha.getFullYear()}-${fecha.getMonth()}-${fecha.getDate()}`;
}

export default function ScheduleVisitPage() {
  const navigate = useNavigate();

  // Datos obtenidos desde el backend
  const [horarios, setHorarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Estados del calendario
  const [inicio, setInicio] = useState(() => {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    return hoy;
  });

  const [fechaSeleccionada, setFechaSeleccionada] = useState(inicio);
  const [horarioSeleccionado, setHorarioSeleccionado] = useState(null);

  // Consultar API al cargar la página
  useEffect(() => {
    const controller = new AbortController();

    async function cargarHorarios() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch("/api/horarios", {
          signal: controller.signal,
        });

        if (!response.ok) {
          let mensaje = "No se pudieron cargar los horarios";

          try {
            const dataError = await response.json();
            mensaje = dataError.error || mensaje;
          } catch {
            // Mantener el mensaje general
          }

          throw new Error(mensaje);
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
          throw new Error("La API devolvió datos inválidos");
        }

        setHorarios(data);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message || "No se pudo conectar con la API");
          setHorarios([]);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    cargarHorarios();

    return () => controller.abort();
  }, []);

  const dias = Array.from(
    { length: 6 },
    (_, i) => sumarDias(inicio, i)
  );

  const mes = inicio.toLocaleDateString("es-BO", {
    month: "long",
    year: "numeric",
  });

  function cambiarSemana(cantidad) {
    const nuevoInicio = sumarDias(inicio, cantidad);

    setInicio(nuevoInicio);
    setFechaSeleccionada(nuevoInicio);
    setHorarioSeleccionado(null);
  }

  function seleccionarFecha(fecha) {
    setFechaSeleccionada(fecha);
    setHorarioSeleccionado(null);
  }

  function seleccionarHorario(horario) {
    if (horario.status === "Sin cupos") return;

    setHorarioSeleccionado(horario.time);
  }

  function confirmarHorario() {
    if (loading || error || !horarioSeleccionado) return;

    const horarioValido = horarios.some(
      (horario) =>
        horario.time === horarioSeleccionado &&
        horario.status !== "Sin cupos"
    );

    if (!horarioValido) return;

    const fecha = fechaSeleccionada.toLocaleDateString("es-BO", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    navigate("/app/confirmar-reserva", {
      state: {
        experienciaId: 1,
        fecha: fecha,
        horario: horarioSeleccionado,
        participantes: 2,
      },
    });
  }

  return (
    <div className="schedule-page">
      <HeaderBar
        title="Selecciona la Fecha y Hora"
        showBackButton={true}
        onBackClick={() => navigate(-1)}
      />

      <main className="schedule-page__content">
        <section className="schedule-page__place">
          <div className="schedule-page__thumbnail">
            LA PAZ
          </div>

          <div>
            <h2>Letrero "LA PAZ"</h2>
            <p>Murillo, La Paz, Bolivia</p>
          </div>
        </section>

        <section className="schedule-page__calendar">
          <div className="schedule-page__section-header">
            <h3>{mes}</h3>

            <div className="schedule-page__arrows">
              <button
                type="button"
                onClick={() => cambiarSemana(-6)}
                aria-label="Ver días anteriores"
              >
                ‹
              </button>

              <button
                type="button"
                onClick={() => cambiarSemana(6)}
                aria-label="Ver días siguientes"
              >
                ›
              </button>
            </div>
          </div>

          <div className="schedule-page__days">
            {dias.map((fecha) => {
              const seleccionada =
                fechaClave(fecha) ===
                fechaClave(fechaSeleccionada);

              return (
                <button
                  key={fechaClave(fecha)}
                  type="button"
                  className={`schedule-page__day ${
                    seleccionada
                      ? "schedule-page__day--selected"
                      : ""
                  }`}
                  onClick={() => seleccionarFecha(fecha)}
                >
                  <span>
                    {fecha.toLocaleDateString("es-BO", {
                      weekday: "short",
                    })}
                  </span>

                  <strong>{fecha.getDate()}</strong>
                </button>
              );
            })}
          </div>
        </section>

        <section className="schedule-page__schedule">
          <h3>Horarios disponibles</h3>

          {loading && (
            <p role="status">
              Cargando horarios disponibles...
            </p>
          )}

          {!loading && error && (
            <div role="alert" className="schedule-page__error">
              <strong>No se pudieron cargar los horarios</strong>
              <p>{error}</p>
            </div>
          )}

          {!loading && !error && horarios.length === 0 && (
            <p role="status">
              No hay horarios disponibles por el momento.
            </p>
          )}

          {!loading && !error && horarios.length > 0 && (
            <div className="schedule-page__slots">
              {horarios.map((horario) => {
                const sinCupos =
                  horario.status === "Sin cupos";

                const seleccionado =
                  horarioSeleccionado === horario.time;

                return (
                  <SlotCard
                    key={horario.id}
                    time={horario.time}
                    period={horario.period}
                    statusText={horario.status}
                    statusType={
                      sinCupos
                        ? "no-slots"
                        : seleccionado
                          ? "selected"
                          : "available"
                    }
                    onClick={() =>
                      seleccionarHorario(horario)
                    }
                  />
                );
              })}
            </div>
          )}
        </section>
      </main>

      <div className="schedule-page__footer">
        <Button
          variant="primary"
          disabled={
            loading ||
            Boolean(error) ||
            !horarioSeleccionado
          }
          onClick={confirmarHorario}
        >
          Confirmar Horario
        </Button>
      </div>
    </div>
  );
}
