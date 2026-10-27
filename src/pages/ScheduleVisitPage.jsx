
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import HeaderBar from "../components/HeaderBar/HeaderBar";
import SlotCard from "../components/SlotCard/SlotCard";
import Button from "../components/Button/Button";
import "./ScheduleVisitPage.css";

const horarios = [
  { time: "10:00 AM", period: "Mañana", status: "2 restantes" },
  { time: "11:30 AM", period: "Mediodía", status: "Disponible" },
  { time: "03:00 PM", period: "Tarde", status: "Sin cupos" },
  { time: "04:30 PM", period: "Tarde", status: "Disponible" },
  { time: "06:00 PM", period: "Atardecer", status: "Sin cupos" },
  { time: "07:30 PM", period: "Noche", status: "Disponible" },
];

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

  const [inicio, setInicio] = useState(() => {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    return hoy;
  });

  const [fechaSeleccionada, setFechaSeleccionada] = useState(inicio);
  const [horarioSeleccionado, setHorarioSeleccionado] = useState("10:00 AM");

  const dias = Array.from({ length: 6 }, (_, i) =>
    sumarDias(inicio, i)
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

  
  function confirmarHorario() {
    if (!horarioSeleccionado) return;

    const fecha = fechaSeleccionada.toLocaleDateString("es-BO", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    navigate("/confirmar-reserva", {
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
                fechaClave(fecha) === fechaClave(fechaSeleccionada);

              return (
                <button
                  key={fechaClave(fecha)}
                  type="button"
                  className={`schedule-page__day ${
                    seleccionada ? "schedule-page__day--selected" : ""
                  }`}
                  onClick={() => {
                    setFechaSeleccionada(fecha);
                    setHorarioSeleccionado(null);
                  }}
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

          <div className="schedule-page__slots">
            {horarios.map((horario) => {
              const sinCupos = horario.status === "Sin cupos";
              const seleccionado =
                horarioSeleccionado === horario.time;

              return (
                <SlotCard
                  key={horario.time}
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
                    setHorarioSeleccionado(horario.time)
                  }
                />
              );
            })}
          </div>
        </section>
      </main>

      <div className="schedule-page__footer">
        <Button
          variant="primary"
          disabled={!horarioSeleccionado}
          onClick={confirmarHorario}
        >
          Confirmar Horario
        </Button>
      </div>
    </div>
  );
}
