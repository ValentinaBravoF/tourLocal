
import "./StatusBadge.css";

export default function StatusBadge({ estado = "disponible", texto }) {
  const estados = {
    confirmada: "Confirmada",
    cancelada: "Cancelada",
    disponible: "Disponible",
  };

  const etiqueta = texto || estados[estado] || estado;

  return (
    <span className={`status-badge status-badge--${estado}`}>
      {etiqueta}
    </span>
  );
}
