# Pruebas funcionales · TourLocal v1.0

Evidencia de ejecución de pruebas funcionales de la aplicación TourLocal (Web y Móvil) contra el backend con base de datos SQLite y la API preparada para Render.

| ID | Caso | Pasos | Resultado esperado | Obtenido | Estado |
|:---|:-----|:------|:-------------------|:---------|:------:|
| **P01** | Buscar por categoría | Inicio / Explorar → Seleccionar filtro «Históricos» o «Parques» | Solo aparecen destinos de la categoría (ej. Tiwanaku o Valle de la Luna) | Filtro reactivo muestra únicamente los destinos de la categoría seleccionada | ✓ |
| **P02** | Ver detalle del destino | Catálogo → Clic en «Letrero "LA PAZ"» | Carga hero image, descripción, precio, duración, guía oficial asignado y calificación | Se visualizan todos los datos del destino y la información del guía verificado | ✓ |
| **P03** | Agendar experiencia | Detalle → Agendar → Elegir fecha y horario disponible → Confirmar reserva | Pantalla de confirmación «¡Reserva realizada!» con código generado `TL-XXXX` | Pantalla de éxito con código de reserva, resumen y botón para ver reservas | ✓ |
| **P04** | La reserva se guarda | Menú de navegación → Ir a «Mis Reservas» / Historial | Aparece la reserva recién efectuada con estado «Confirmada», fecha, hora y total | La reserva figura en la lista con su código correspondiente y estado activo | ✓ |
| **P05** | Persistencia de datos | `Ctrl + C` en terminal de la API → Reiniciar con `npm start` → Recargar «Mis Reservas» | Las reservas persisten intactas en la base de datos SQLite `tourlocal.db` | La reserva sigue registrada correctamente tras reiniciar el servidor | ✓ |
| **P06** | Cancelar reserva | Mis Reservas → Seleccionar reserva activa → Clic en «Cancelar reserva» → Confirmar | La reserva cambia su estado a «Cancelada» y se actualiza el contador de reservas | Estado actualizado a «Cancelada» visualmente y registrado en la base de datos | ✓ |
| **P07** | Dato inválido (400) | Navegador: `http://localhost:3000/api/atracciones-cercanas/abc` | Respuesta JSON con código 400: `{"error":"El id debe ser un número entero positivo"}` | Mismo mensaje de error y código HTTP 400 | ✓ |
| **P08** | No existe (404) | Navegador: `http://localhost:3000/api/atracciones-cercanas/999` | Respuesta JSON con código 404: `{"error":"Atracción no encontrada"}` | Mismo mensaje de error y código HTTP 404 | ✓ |
| **P09** | API apagada | `Ctrl + C` en la API backend → Intentar cargar destinos o confirmar reserva | Mensaje en pantalla: «Error al conectar con la API» y botón interactivo «Reintentar» | Aviso amigable de error en interfaz sin pantallas rotas ni excepciones no controladas | ✓ |
| **P10** | App Celular (Expo Go / APK) | Repetir P01 a P04 desde el teléfono móvil conectado a la misma red local | Mismo comportamiento que en la web: catálogo en vivo, agendamiento y guardado sincronizado | Sincronización instantánea; la reserva creada en el celular se refleja en la web | ✓ |
| **P11** | Calificación con estrellas | Detalle de experiencia → Abrir modal de calificar → Seleccionar 5 estrellas y reseña | Se guarda la puntuación en `/api/calificaciones` y se actualiza el promedio | Calificación guardada exitosamente con estrellas activas y mensaje de agradecimiento | ✓ |
| **P12** | Ubicación y Mapa interactivo | Detalle de destino → Sección «Ubicación y Mapa» | Renderizado del mapa interactivo con pin en las coordenadas reales y acceso GPS | Mapa visual renderizado con pin del destino, coordenadas y enlace a navegación | ✓ |
