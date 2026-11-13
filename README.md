# TourLocal - Guías y Experiencias Turísticas en La Paz

Aplicación web interactiva que conecta turistas con experiencias locales auténticas y guías especializados en la ciudad de La Paz, Bolivia.

## Cómo ejecutar

1. Instalar dependencias del frontend (en la raíz del proyecto):
   ```bash
   npm install
   ```
2. Instalar dependencias del backend:
   ```bash
   cd backend
   npm install
   ```
3. Iniciar el servidor API (Terminal 1):
   ```bash
   cd backend
   npm run dev
   ```
   *Servidor API disponible en: http://localhost:3000*  
   *La base de datos SQLite (`backend/tourlocal.db`) se crea sola automáticamente la primera vez.*

4. Iniciar la aplicación web (Terminal 2):
   ```bash
   npm run dev
   ```
   *Aplicación web disponible en: http://localhost:5173*

## Tecnologías

- **Frontend:** React 19 + Vite, React Router v7, CSS modular con Design Tokens.
- **Backend:** Node.js v24 + Express 5.
- **Base de Datos:** SQLite nativo (`node:sqlite`).

## Flujo principal

1. **Explorar destinos:** `/explorar` (filtrado por categorías y búsqueda).
2. **Detalle del destino:** `/lugares/:id` (información, fotos, guía asignado y precio).
3. **Perfil del guía:** `/guias/:id` (biografía, reseñas y calificaciones).
4. **Agendar visita:** `/agendar/:id` (selección de fecha y horarios disponibles).
5. **Confirmar reserva:** `/confirmar-reserva` (cálculo de tarifa y confirmación POST).
6. **Reserva realizada:** `/reserva-confirmada` (generación de código `TL-...`).
7. **Historial de reservas:** `/historial` (listado persistente de reservas próximas y pasadas).
8. **Cancelar reserva:** `/cancelar-reserva/:id` (confirmación y borrado DELETE).

## Equipo y aportes

| Integrante | Cuenta de GitHub | Páginas y componentes | Endpoints y base de datos |
| :--- | :--- | :--- | :--- |
| **Esther Daza** | `CrisDaz` | `ExplorePage`, `PlaceDetailPage`, `CategoryPill`, `FeaturedCard`, `SearchBar` | `GET /api/destinos`, `GET /api/destinos/:id`, `GET /api/atracciones-cercanas`, tablas `destinations` y `guides` en SQLite |
| **Andrea Guachalla** | `Andrea Guachalla` | `GuideProfilePage`, `ExperienceDetailPage`, `UserProfilePage`, `EditProfilePage`, `GuideCard` | `GET /api/guias`, `GET /api/guias/:id`, consultas de guías en SQLite |
| **Naomi Flores** | `Naomi Flores` | `ScheduleVisitPage`, `SlotCard`, `RateExperiencePage` | `GET /api/horarios`, `GET /api/horarios/:id`, tabla `schedules` en SQLite |
| **Valentina Bravo** | `valele` / `ValentinaBravoF` | `ConfirmReservationPage`, `HistoryPage`, `CancelBookingPage`, `Button`, `HeaderBar` | `POST /api/reservas`, `DELETE /api/reservas/:id`, tablas `reservations` y `saved_places` en SQLite |
