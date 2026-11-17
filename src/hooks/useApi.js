import { useState, useEffect } from "react";

function useApi(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const response = await fetch(url);
        const result = await response.json();

        if (response.ok) {
          setData(result);
        } else {
          setError(result.error);
        }
      } catch {
        setError("No se pudo conectar con la API. ¿Está encendida?");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [url]);

  return { data, loading, error };
}

export default useApi;
