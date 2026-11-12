import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
  const { id } = useParams();
  const [ahora] = useState(() => new Date());
  const [horarios, setHorarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [lugar, setLugar] = useState(null);
  const [lugarLoading, setLugarLoading] = useState(true);
  const [lugarError, setLugarError] = useState("");

  const [inicio, setInicio] = useState(() => {
    const hoy = new Date(ahora);
    hoy.setHours(0, 0, 0, 0);
    return hoy;
  });
  const [fechaSeleccionada, setFechaSeleccionada] = useState(inicio);
  const [horarioSeleccionado, setHorarioSeleccionado] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    async function cargarLugar() {
      try {
        setLugarLoading(true);
        setLugarError("");
        setLugar(null);

        const [lugarResponse, guiasResponse] = await Promise.all([
          fetch(`/api/destinos/${id}`, { signal: controller.signal }),
          fetch("/api/guias", { signal: controller.signal }),
        ]);

        if (!lugarResponse.ok) {
          const data = await lugarResponse.json();
          throw new Error(data.error || "No se pudo cargar el destino.");
        }
        if (!guiasResponse.ok) {
          throw new Error("No se pudo cargar la información de los guías.");
        }

        const [lugarData, guias] = await Promise.all([
          lugarResponse.json(),
          guiasResponse.json(),
        ]);
        if (
          !lugarData ||
          !lugarData.title ||
          !Array.isArray(guias)
        ) {
          throw new Error("La API devolvió información inválida del destino.");
        }

        const guia = guias.find(
          (item) => item.name === lugarData.guide?.nombre,
        );
        if (!guia) {
          throw new Error("No se encontró el guía asignado a este destino.");
        }

        const precioTexto = String(lugarData.price || "");
        const precioEncontrado = precioTexto.match(/\d+(?:\.\d+)?/);
        const precioPorPersona = /gratis/i.test(precioTexto)
          ? 0
          : precioEncontrado
            ? Number(precioEncontrado[0])
            : 80;

        if (!controller.signal.aborted) {
          setLugar({
            ...lugarData,
            guiaId: guia.id,
            precioPorPersona,
          });
        }
      } catch (err) {
        if (!controller.signal.aborted) {
          setLugarError(
            err instanceof TypeError || err instanceof SyntaxError
              ? "No se pudo conectar con la API. Verifica que el backend esté encendido."
              : err instanceof Error
                ? err.message
                : "No se pudo cargar el destino.",
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setLugarLoading(false);
        }
      }
    }

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

    cargarLugar();
    cargarHorarios();
    return () => controller.abort();
  }, [id]);

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

    if (
      loading ||
      error ||
      lugarLoading ||
      lugarError ||
      !lugar ||
      !horarioDisponible
    ) {
      return;
    }

    navigate("/app/confirmar-reserva", {
      state: {
        experienciaId: Number(id),
        experiencia: lugar.title,
        ubicacion: lugar.location,
        imagen: lugar.image,
        categoria: lugar.category,
        guiaId: lugar.guiaId,
        precioPorPersona: lugar.precioPorPersona,
        tarifaServicio: 10,
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
  const puedeConfirmar =
    !loading &&
    !error &&
    !lugarLoading &&
    !lugarError &&
    Boolean(lugar) &&
    horarioSeleccionadoDisponible;

  return (
    <div className="schedule-page">
      <HeaderBar
        title="Selecciona la Fecha y Hora"
        showBackButton={true}
        onBackClick={() => navigate(-1)}
      />

      <main className="schedule-page__content">
        <section className="schedule-page__place">
          {lugar?.image && (
            <img
              className="schedule-page__thumbnail"
              src={lugar.image}
              alt={lugar.title}
            />
          )}
          <div>
            {lugarLoading && <p role="status">Cargando destino...</p>}
            {!lugarLoading && lugarError && (
              <p role="alert">{lugarError}</p>
            )}
            {lugar && (
              <>
                <h2>{lugar.title}</h2>
                <p>{lugar.location}</p>
              </>
            )}
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
          disabled={!puedeConfirmar}
          onClick={confirmarHorario}
        >
          Confirmar Horario
        </Button>
      </div>
    </div>
  );
}
