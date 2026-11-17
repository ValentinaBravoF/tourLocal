import { useEffect, useState } from "react";
import { getUserHeaders } from "../services/userService";

function useReservas() {
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function cargarReservas() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch("/api/reservas", {
          headers: getUserHeaders(),
          signal: controller.signal,
        });
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "No se pudieron cargar las reservas.");
        }
        if (!Array.isArray(data)) {
          throw new Error("La API devolvió un historial inválido.");
        }

        if (!controller.signal.aborted) {
          setReservas(data);
        }
      } catch (err) {
        if (!controller.signal.aborted) {
          setError(
            err instanceof TypeError || err instanceof SyntaxError
              ? "No se pudo conectar con la API de reservas. Verifica que esté encendida."
              : err instanceof Error
                ? err.message
                : "No se pudieron cargar las reservas.",
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    cargarReservas();
    return () => controller.abort();
  }, []);

  return { reservas, loading, error };
}

export default useReservas;
