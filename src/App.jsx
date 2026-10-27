import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import BottomNavigation from "./components/BottomNavigation/BottomNavigation";

import SplashPage from "./pages/SplashPage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import CancelBookingPage from "./pages/CancelBookingPage";
import ScheduleVisitPage from "./pages/ScheduleVisitPage";

// Páginas de Andrea
import GuideProfilePage from "./pages/GuideProfilePage";
import PlaceDetailPage from "./pages/PlaceDetailPage";
import UserProfilePage from "./pages/UserProfilePage";
import EditProfilePage from "./pages/EditProfilePage";

export default function App() {
  return (
    <Routes>
      {/* Rutas de autenticación y bienvenida */}
      <Route path="/" element={<SplashPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/registro" element={<SignUpPage />} />

      {/* Rutas de reservas y lugares */}
      <Route path="/agendar/:id" element={<ScheduleVisitPage />} />
      <Route path="/lugares/:id" element={<PlaceDetailPage />} />
      <Route path="/guias/:id" element={<GuideProfilePage />} />

      {/* Rutas de perfil */}
      <Route path="/perfil" element={<UserProfilePage />} />
      <Route path="/perfil/editar" element={<EditProfilePage />} />

      {/* Rutas dentro de /app/ con MainLayout */}
      <Route
        path="/app/*"
        element={
          <>
            <MainLayout title="TourLocal">
              <Routes>
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
            <BottomNavigation />
          </>
        }
      />

      {/* Rutas directas para navegación cómoda */}
      <Route path="/explorar" element={<Navigate to="/app/explorar" replace />} />
      <Route path="/cancelar-reserva/:id" element={<CancelBookingPage />} />

      {/* Redirección por defecto */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}