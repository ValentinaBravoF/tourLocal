
import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import BottomNavigation from "./components/BottomNavigation/BottomNavigation";

import SplashPage from "./pages/SplashPage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import ExplorePage from "./pages/ExplorePage";
import CancelBookingPage from "./pages/CancelBookingPage";

import ScheduleVisitPage from "./pages/ScheduleVisitPage";
import RateExperiencePage from "./pages/RateExperiencePage";
import CancellationErrorPage from "./pages/CancellationErrorPage";
import ExperienceDetailPage from "./pages/ExperienceDetailPage";
import ConfirmReservationPage from "./pages/ConfirmReservationPage";
import ReservationSuccessPage from "./pages/ReservationSuccessPage";
import HistoryPage from "./pages/HistoryPage";

export default function App() {
  return (
    <Routes>
      {/* Pantallas de bienvenida y autenticación */}
      <Route path="/" element={<SplashPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/registro" element={<SignUpPage />} />

      <Route
        path="/agendar/:id"
        element={<ScheduleVisitPage />}
      />

      <Route
        path="/confirmar-reserva"
        element={<ConfirmReservationPage />}
      />

      <Route
        path="/reserva-confirmada"
        element={<ReservationSuccessPage />}
      />

      <Route
        path="/experiencias/:id"
        element={<ExperienceDetailPage />}
      />

      <Route
        path="/experiencias/:id/calificar"
        element={<RateExperiencePage />}
      />

      <Route
        path="/cancelacion-error"
        element={<CancellationErrorPage />}
      />

      <Route
        path="/cancelacion-error/:id"
        element={<CancellationErrorPage />}
      />

      {/* Pantallas principales de la aplicación */}
      <Route
        path="/app/*"
        element={
          <>
            <MainLayout title="TourLocal">
              <Routes>
                <Route
                  path="explorar"
                  element={<ExplorePage />}
                />

                <Route
                  path="cancelar-reserva/:id"
                  element={<CancelBookingPage />}
                />

                <Route
                  path="*"
                  element={<Navigate to="explorar" replace />}
                />
              </Routes>
            </MainLayout>

            <BottomNavigation />
          </>
        }
      />

      <Route
        path="historial"
        element={<HistoryPage />}
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
