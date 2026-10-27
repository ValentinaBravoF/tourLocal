import DetailRow from "../DetailRow/DetailRow";
import "./ReservationDetailCard.css";

export default function ReservationDetailCard({
  titulo = "Detalles de la reserva",
  title,
  fecha,
  date = "Miércoles, 18 Octubre, 2026",
  horario,
  time = "06:30 AM",
  participantes,
  participants = "2 personas",
  ubicacion,
  location,
  notas,
  notes,
  estado = "confirmada", // 'normal' | 'confirmada' | 'cancelacion'
  status,
}) {
  const tituloFinal = title !== undefined ? title : titulo;
  const fechaFinal = fecha || date;
  const horarioFinal = horario || time;
  const participantesFinal = participantes || participants;
  const ubicacionFinal = ubicacion || location;
  const notasFinal = notas !== undefined ? notas : notes;

  const estadoRaw = status || estado;
  const varianteClase =
    estadoRaw === "cancelacion" || estadoRaw === "cancelled"
      ? "cancelacion"
      : estadoRaw === "normal"
      ? "normal"
      : "confirmada";

  return (
    <section className="reservation-detail-wrapper">
      {tituloFinal && (
        <h3 className="reservation-detail-wrapper__title">{tituloFinal}</h3>
      )}

      <div
        className={`reservation-detail-card reservation-detail-card--${varianteClase}`}
      >
        <DetailRow etiqueta="Fecha" valor={fechaFinal} />
        <DetailRow etiqueta="Horario" valor={horarioFinal} />
        <DetailRow etiqueta="Participantes" valor={participantesFinal} />

        {ubicacionFinal && (
          <DetailRow etiqueta="Ubicación" valor={ubicacionFinal} />
        )}

        {notasFinal !== undefined && (
          <DetailRow etiqueta="Notas" valor={notasFinal || "—"} />
        )}
      </div>
    </section>
  );
}