
import { useEffect, useState } from "react";

export default function useApi(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function cargarDatos() {
      setLoading(true);
      setError("");

      try {
        const response = await fetch(url, {
          signal: controller.signal,
        });

        if (!response.ok) {
          let mensaje = "No se pudieron cargar los datos.";

          try {
            const respuesta = await response.json();
            mensaje = respuesta.error || mensaje;
          } catch {
            // La respuesta puede no contener JSON
          }

          throw new Error(mensaje);
        }

        const resultado = await response.json();

        if (!controller.signal.aborted) {
          setData(resultado);
        }
      } catch (err) {
        if (!controller.signal.aborted) {
          setError(
            err instanceof TypeError || err instanceof SyntaxError
              ? "No se pudo conectar con la API. Verifica que el backend esté encendido."
              : err instanceof Error
                ? err.message
                : "Ocurrió un error al cargar los datos."
          );

          setData(null);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    cargarDatos();

    return () => controller.abort();
  }, [url]);

  return { data, loading, error };
}
