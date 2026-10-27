import "./PriceSummary.css";

export default function PriceSummary({
  titulo = "Importe Pagado",
  title,
  precioPorPersona = 80,
  pricePerPerson,
  participantes = 2,
  participantsCount,
  tarifaServicio = 10,
  serviceFee,
  total,
  variante = "pagado", // 'resumen' | 'pagado'
}) {
  const tituloFinal = title !== undefined ? title : titulo;
  const precioUnitario = Number(pricePerPerson ?? precioPorPersona);
  const cantidadPersonas = Number(participantsCount ?? participantes);
  const tarifa = Number(serviceFee ?? tarifaServicio);

  const subtotalPersonas = precioUnitario * cantidadPersonas;
  const totalCalculado =
    total !== undefined ? Number(total) : subtotalPersonas + tarifa;

  return (
    <section className="price-summary-wrapper">
      {tituloFinal && (
        <h3 className="price-summary-wrapper__title">{tituloFinal}</h3>
      )}

      <div className={`price-summary price-summary--${variante}`}>
        <div className="price-summary__row">
          <span className="price-summary__label">Precio por persona</span>
          <span className="price-summary__value">Bs. {precioUnitario}</span>
        </div>

        <div className="price-summary__row">
          <span className="price-summary__label">
            {cantidadPersonas} {cantidadPersonas === 1 ? "persona" : "personas"}
          </span>
          <span className="price-summary__value">Bs. {subtotalPersonas}</span>
        </div>

        <div className="price-summary__row">
          <span className="price-summary__label">Tarifa por servicio</span>
          <span className="price-summary__value">Bs. {tarifa}</span>
        </div>

        <div className="price-summary__row price-summary__row--total">
          <span className="price-summary__total-label">Total</span>
          <span className="price-summary__total-value">
            Bs. {totalCalculado}
          </span>
        </div>
      </div>
    </section>
  );
}