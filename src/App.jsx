import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import BottomNavigation from "./components/BottomNavigation/BottomNavigation";

// Importamos tus páginas (asegúrate de que las rutas de importación sean correctas)
import SplashPage from "./pages/SplashPage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import CancelBookingPage from "./pages/CancelBookingPage";
// import ExplorePage from "./pages/ExplorePage"; // Ejemplo para después

export default function App() {
  return (
    <Routes>
      {/* --- RUTAS SIN BOTTOM NAVIGATION (Flujo de Autenticación) --- */}
      <Route path="/" element={<SplashPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/registro" element={<SignUpPage />} />

      {/* --- RUTAS CON LAYOUT Y BOTTOM NAVIGATION --- */}
      {/* Envolvemos estas rutas en un componente que renderiza el Layout y la Barra */}
      <Route
        path="/app/*"
        element={
          <>
            <MainLayout title="TourLocal">
              <Routes>
                {/* Aquí irán tus rutas principales en el futuro */}
                <Route
                  path="explorar"
                  element={<h2>Pantalla de Exploración (Próximamente)</h2>}
                />
                <Route
                  path="cancelar-reserva/:id"
                  element={<CancelBookingPage />}
                />
              </Routes>
            </MainLayout>
            {/* La barra se coloca debajo del main (el layout) */}
            <BottomNavigation />
          </>
        }
      />

      {/* Redirección por defecto si la ruta no existe */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
