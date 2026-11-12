async function requestSavedPlaces(url, options) {
  let response;
  try {
    response = await fetch(url, options);
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw error;
    }
    throw new Error(
      "No se pudo conectar con la API de guardados. Verifica que el backend esté encendido.",
    );
  }

  let data;
  try {
    data = await response.json();
  } catch {
    throw new Error("La API de guardados devolvió una respuesta inválida.");
  }
  if (!response.ok) {
    throw new Error(data.error || "No se pudo actualizar el lugar guardado.");
  }

  return data;
}

export function getSavedPlaces(signal) {
  return requestSavedPlaces("/api/guardados", { signal });
}

export function savePlace(id) {
  return requestSavedPlaces("/api/guardados", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id }),
  });
}

export function removeSavedPlace(id) {
  return requestSavedPlaces(`/api/guardados/${id}`, {
    method: "DELETE",
  });
}
