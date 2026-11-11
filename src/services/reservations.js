export async function saveReservation(reserva, total) {
  const response = await fetch("/api/reservas", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      experiencia: reserva.experiencia,
      fecha: reserva.fecha,
      horario: reserva.horario,
      participantes: reserva.participantes,
      total,
    }),
  });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "No se pudo guardar la reserva");
  }

  return data;
}
