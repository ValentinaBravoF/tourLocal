import "./DetailRow.css";

export default function DetailRow({ etiqueta, valor }) {
  return (
    <div className="detail-row">
      <span className="detail-row__label">{etiqueta}</span>
      <span className="detail-row__value">{valor}</span>
    </div>
  );
}
