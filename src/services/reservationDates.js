const meses = {
  enero: 0,
  febrero: 1,
  marzo: 2,
  abril: 3,
  mayo: 4,
  junio: 5,
  julio: 6,
  agosto: 7,
  septiembre: 8,
  setiembre: 8,
  octubre: 9,
  noviembre: 10,
  diciembre: 11,
};

export function parseTourDateTime(fecha, horario) {
  if (typeof fecha !== "string" || typeof horario !== "string") return null;

  let year;
  let month;
  let day;
  const isoDate = fecha.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  const dateWithoutWeekday = fecha.includes(",")
    ? fecha.slice(fecha.indexOf(",") + 1).trim()
    : fecha;
  const spanishDate = dateWithoutWeekday.match(
    /^(\d{1,2})\s+de\s+([\p{L}]+)\s+de\s+(\d{4})$/iu,
  );

  if (isoDate) {
    [, year, month, day] = isoDate;
    month = Number(month) - 1;
  } else if (spanishDate) {
    [, day, month, year] = spanishDate;
    month = meses[month.toLocaleLowerCase("es")];
  } else {
    return null;
  }

  const time = horario.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i);
  if (!time || month === undefined) return null;

  let hours = Number(time[1]);
  const minutes = Number(time[2]);
  const period = time[3]?.toUpperCase();

  if (minutes > 59 || (period ? hours < 1 || hours > 12 : hours > 23)) {
    return null;
  }
  if (period) {
    hours = (hours % 12) + (period === "PM" ? 12 : 0);
  }

  const dateTime = new Date(
    Number(year),
    month,
    Number(day),
    hours,
    minutes,
  );
  if (
    dateTime.getFullYear() !== Number(year) ||
    dateTime.getMonth() !== month ||
    dateTime.getDate() !== Number(day)
  ) {
    return null;
  }
  return dateTime;
}

export function formatTourDate(fecha) {
  const dateTime = parseTourDateTime(fecha, "12:00 AM");
  return dateTime
    ? dateTime.toLocaleDateString("es-BO", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : fecha;
}
