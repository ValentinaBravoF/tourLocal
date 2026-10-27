import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import BottomNavigation from "./components/BottomNavigation/BottomNavigation";

import SplashPage from "./pages/SplashPage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import CancelBookingPage from "./pages/CancelBookingPage";
import ScheduleVisitPage from "./pages/ScheduleVisitPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<SplashPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/registro" element={<SignUpPage />} />
      <Route path="/agendar/:id" element={<ScheduleVisitPage />} />

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

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
