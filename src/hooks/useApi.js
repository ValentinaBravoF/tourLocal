import { useEffect, useState } from "react";

export default function useApi(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      setLoading(true);
      setError("");

      try {
        const response = await fetch(url, {
          signal: controller.signal,
        });

        if (!response.ok) {
          let message = "No se pudieron cargar los datos.";

          try {
            const result = await response.json();
            message = result.error || message;
          } catch {
            // Some error responses may not include JSON.
          }

          throw new Error(message);
        }

        const result = await response.json();
        if (!controller.signal.aborted) {
          setData(result);
        }
      } catch (err) {
        if (!controller.signal.aborted) {
          setData(null);
          setError(
            err instanceof TypeError
              ? "No se pudo conectar con la API. Verifica que el backend esté encendido."
              : err instanceof SyntaxError
                ? "La API devolvió una respuesta inválida."
                : err instanceof Error
                  ? err.message
                  : "Ocurrió un error al cargar los datos.",
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    load();
    return () => controller.abort();
  }, [url]);

  return { data, loading, error };
}
