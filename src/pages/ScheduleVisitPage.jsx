import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import HeaderBar from "../components/HeaderBar/HeaderBar";
import SlotCard from "../components/slotcard/SlotCard";
import Button from "../components/Button/Button";
import { parseTourDateTime } from "../services/reservationDates";
import "./ScheduleVisitPage.css";

function sumarDias(fecha, cantidad) {
  const nueva = new Date(fecha);
  nueva.setDate(nueva.getDate() + cantidad);
  return nueva;
}

function fechaClave(fecha) {
  return `${fecha.getFullYear()}-${fecha.getMonth()}-${fecha.getDate()}`;
}

function fechaISO(fecha) {
  return [
    fecha.getFullYear(),
    String(fecha.getMonth() + 1).padStart(2, "0"),
    String(fecha.getDate()).padStart(2, "0"),
  ].join("-");
}

export default function ScheduleVisitPage() {
  const navigate = useNavigate();
  const [ahora] = useState(() => new Date());
  const [horarios, setHorarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [inicio, setInicio] = useState(() => {
    const hoy = new Date(ahora);
    hoy.setHours(0, 0, 0, 0);
    return hoy;
  });
  const [fechaSeleccionada, setFechaSeleccionada] = useState(inicio);
  const [horarioSeleccionado, setHorarioSeleccionado] = useState(null);

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
          let mensaje = "No se pudieron cargar los horarios.";
          try {
            const dataError = await response.json();
            mensaje = dataError.error || mensaje;
          } catch {
            // La respuesta de error puede no contener JSON.
          }
          throw new Error(mensaje);
        }

        const data = await response.json();
        if (!Array.isArray(data)) {
          throw new Error("La API devolvió datos de horarios inválidos.");
        }

        if (!controller.signal.aborted) {
          setHorarios(data);
        }
      } catch (err) {
        if (!controller.signal.aborted) {
          setError(
            err instanceof TypeError || err instanceof SyntaxError
              ? "No se pudo conectar con la API. Verifica que el backend esté encendido."
              : err instanceof Error
                ? err.message
                : "No se pudieron cargar los horarios.",
          );
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

  const dias = Array.from({ length: 6 }, (_, i) => sumarDias(inicio, i));
  const mes = inicio.toLocaleDateString("es-BO", {
    month: "long",
    year: "numeric",
  });
  const inicioDelDia = new Date(ahora);
  inicioDelDia.setHours(0, 0, 0, 0);

  function cambiarSemana(cantidad) {
    const nuevoInicio = sumarDias(inicio, cantidad);
    if (nuevoInicio < inicioDelDia) return;

    setInicio(nuevoInicio);
    setFechaSeleccionada(nuevoInicio);
    setHorarioSeleccionado(null);
  }

  function seleccionarFecha(fecha) {
    if (fecha < inicioDelDia) return;
    setFechaSeleccionada(fecha);
    setHorarioSeleccionado(null);
  }

  function obtenerFechaHorario(time) {
    return parseTourDateTime(fechaISO(fechaSeleccionada), time);
  }

  function horarioEstaPasado(time) {
    const fechaHorario = obtenerFechaHorario(time);
    return !fechaHorario || fechaHorario <= ahora;
  }

  function seleccionarHorario(horario) {
    if (
      loading ||
      error ||
      horario.status === "Sin cupos" ||
      horarioEstaPasado(horario.time)
    ) {
      return;
    }
    setHorarioSeleccionado(horario.time);
  }

  function confirmarHorario() {
    const horarioDisponible = horarios.some(
      (horario) =>
        horario.time === horarioSeleccionado &&
        horario.status !== "Sin cupos" &&
        !horarioEstaPasado(horario.time),
    );

    if (loading || error || !horarioDisponible) return;

    navigate("/app/confirmar-reserva", {
      state: {
        experienciaId: 1,
        fecha: fechaISO(fechaSeleccionada),
        horario: horarioSeleccionado,
        participantes: 2,
      },
    });
  }

  const horarioSeleccionadoDisponible = horarios.some(
    (horario) =>
      horario.time === horarioSeleccionado &&
      horario.status !== "Sin cupos" &&
      !horarioEstaPasado(horario.time),
  );

  return (
    <div className="schedule-page">
      <HeaderBar
        title="Selecciona la Fecha y Hora"
        showBackButton={true}
        onBackClick={() => navigate(-1)}
      />

      <main className="schedule-page__content">
        <section className="schedule-page__place">
          <div className="schedule-page__thumbnail">LA PAZ</div>
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
                disabled={inicio <= inicioDelDia}
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
                fechaClave(fecha) === fechaClave(fechaSeleccionada);
              const pasada = fecha < inicioDelDia;

              return (
                <button
                  key={fechaClave(fecha)}
                  type="button"
                  className={`schedule-page__day ${
                    seleccionada ? "schedule-page__day--selected" : ""
                  }`}
                  onClick={() => seleccionarFecha(fecha)}
                  disabled={pasada}
                >
                  <span>
                    {fecha.toLocaleDateString("es-BO", { weekday: "short" })}
                  </span>
                  <strong>{fecha.getDate()}</strong>
                </button>
              );
            })}
          </div>
        </section>

        <section className="schedule-page__schedule">
          <h3>Horarios disponibles</h3>

          {loading && <p role="status">Cargando horarios disponibles...</p>}

          {!loading && error && (
            <div role="alert" className="schedule-page__error">
              <strong>No se pudieron cargar los horarios</strong>
              <p>{error}</p>
            </div>
          )}

          {!loading && !error && horarios.length === 0 && (
            <p role="status">No hay horarios disponibles por el momento.</p>
          )}

          {!loading && !error && horarios.length > 0 && (
            <div className="schedule-page__slots">
              {horarios.map((horario) => {
                const pasado = horarioEstaPasado(horario.time);
                const sinCupos =
                  horario.status === "Sin cupos" || pasado;
                const seleccionado =
                  horarioSeleccionado === horario.time;

                return (
                  <SlotCard
                    key={horario.id ?? horario.time}
                    time={horario.time}
                    period={horario.period}
                    statusText={
                      pasado ? "Horario pasado" : horario.status
                    }
                    statusType={
                      sinCupos
                        ? "no-slots"
                        : seleccionado
                          ? "selected"
                          : "available"
                    }
                    onClick={() => seleccionarHorario(horario)}
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
          disabled={loading || Boolean(error) || !horarioSeleccionadoDisponible}
          onClick={confirmarHorario}
        >
          Confirmar Horario
        </Button>
      </div>
    </div>
  );
}
