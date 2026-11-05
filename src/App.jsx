import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";

// Páginas públicas (sin barra de navegación)
import SplashPage from "./pages/SplashPage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";

// Páginas principales con layout
import ExplorePage from "./pages/ExplorePage";
import SavedPlacesPage from "./pages/SavedPlacesPage";
import HistoryPage from "./pages/HistoryPage";
import UserProfilePage from "./pages/UserProfilePage";
import EditProfilePage from "./pages/EditProfilePage";
import AllPlacesPage from "./pages/AllPlacesPage";
import PlaceDetailPage from "./pages/PlaceDetailPage";
import GuideProfilePage from "./pages/GuideProfilePage";
import ScheduleVisitPage from "./pages/ScheduleVisitPage";
import ConfirmReservationPage from "./pages/ConfirmReservationPage";
import PaymentMethodPage from "./pages/PaymentMethodPage";
import ReservationSuccessPage from "./pages/ReservationSuccessPage";
import CancelBookingPage from "./pages/CancelBookingPage";
import CancellationSuccessPage from "./pages/CancellationSuccessPage";
import CancellationErrorPage from "./pages/CancellationErrorPage";
import ExperienceDetailPage from "./pages/ExperienceDetailPage";
import RateExperiencePage from "./pages/RateExperiencePage";
import NotificationsPage from "./pages/NotificationsPage";
import NotFoundPage from "./pages/NotFoundPage";

export default function App() {
  return (
    <Routes>
      {/* 1. Rutas públicas sin layout */}
      <Route path="/" element={<SplashPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/registro" element={<SignUpPage />} />

      {/* 2. Rutas con MainLayout común (<Outlet /> y <NavBar />) */}
      <Route element={<MainLayout />}>
        {/* Rutas principales del M3 */}
        <Route path="/explorar" element={<ExplorePage />} />
        <Route path="/guardados" element={<SavedPlacesPage />} />
        <Route path="/historial" element={<HistoryPage />} />
        <Route path="/perfil" element={<UserProfilePage />} />
        <Route path="/perfil/editar" element={<EditProfilePage />} />
        <Route path="/lugares" element={<AllPlacesPage />} />
        <Route path="/lugares/:id" element={<PlaceDetailPage />} />
        <Route path="/guias/:id" element={<GuideProfilePage />} />
        <Route path="/agendar/:id" element={<ScheduleVisitPage />} />
        <Route path="/confirmar-reserva" element={<ConfirmReservationPage />} />
        <Route path="/pago" element={<PaymentMethodPage />} />
        <Route path="/reserva-confirmada" element={<ReservationSuccessPage />} />
        <Route path="/cancelar-reserva/:id" element={<CancelBookingPage />} />
        <Route path="/cancelacion-exitosa" element={<CancellationSuccessPage />} />
        <Route path="/cancelacion-error" element={<CancellationErrorPage />} />
        <Route path="/experiencias/:id" element={<ExperienceDetailPage />} />
        <Route path="/experiencias/:id/calificar" element={<RateExperiencePage />} />
        <Route path="/notificaciones" element={<NotificationsPage />} />

        {/* Compatibilidad con rutas con prefijo /app/... */}
        <Route path="/app/explorar" element={<Navigate to="/explorar" replace />} />
        <Route path="/app/guardados" element={<Navigate to="/guardados" replace />} />
        <Route path="/app/historial" element={<Navigate to="/historial" replace />} />
        <Route path="/app/perfil" element={<Navigate to="/perfil" replace />} />
        <Route path="/app/perfil/editar" element={<Navigate to="/perfil/editar" replace />} />
        <Route path="/app/lugares" element={<Navigate to="/lugares" replace />} />
        <Route path="/app/lugares/:id" element={<PlaceDetailPage />} />
        <Route path="/app/guias/:id" element={<GuideProfilePage />} />
        <Route path="/app/agendar/:id" element={<ScheduleVisitPage />} />
        <Route path="/app/confirmar-reserva" element={<ConfirmReservationPage />} />
        <Route path="/app/pago" element={<PaymentMethodPage />} />
        <Route path="/app/reserva-confirmada" element={<ReservationSuccessPage />} />
        <Route path="/app/cancelar-reserva/:id" element={<CancelBookingPage />} />
        <Route path="/app/cancelacion-exitosa" element={<CancellationSuccessPage />} />
        <Route path="/app/cancelacion-error" element={<CancellationErrorPage />} />
        <Route path="/app/experiencias/:id" element={<ExperienceDetailPage />} />
        <Route path="/app/experiencias/:id/calificar" element={<RateExperiencePage />} />
        <Route path="/app/notificaciones" element={<NotificationsPage />} />
        <Route path="/app" element={<Navigate to="/explorar" replace />} />

        {/* Ruta para cualquier dirección no encontrada (404) */}
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
