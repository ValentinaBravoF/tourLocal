import {
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import NavBar from "./components/NavBar/NavBar";

// Páginas públicas
import SplashPage from "./pages/SplashPage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";

// Páginas de la app
import ExplorePage from "./pages/ExplorePage";
import SavedPlacesPage from "./pages/SavedPlacesPage";
import HistoryPage from "./pages/HistoryPage";
import UserProfilePage from "./pages/UserProfilePage";
import EditProfilePage from "./pages/EditProfilePage";
import PlaceDetailPage from "./pages/PlaceDetailPage";
import GuideProfilePage from "./pages/GuideProfilePage";
import ScheduleVisitPage from "./pages/ScheduleVisitPage";
import ConfirmReservationPage from "./pages/ConfirmReservationPage";
import ReservationSuccessPage from "./pages/ReservationSuccessPage";
import CancelBookingPage from "./pages/CancelBookingPage";
import ExperienceDetailPage from "./pages/ExperienceDetailPage";
import RateExperiencePage from "./pages/RateExperiencePage";
import CancellationErrorPage from "./pages/CancellationErrorPage";

// Nuevas páginas añadidas
import AllPlacesPage from "./pages/AllPlacesPage";
import PaymentMethodPage from "./pages/PaymentMethodPage";
import CancellationSuccessPage from "./pages/CancellationSuccessPage";
import NotificationsPage from "./pages/NotificationsPage";

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();

  const getActiveTab = () => {
    if (location.pathname.includes("guardados")) return "saved";
    if (location.pathname.includes("historial")) return "history";
    if (location.pathname.includes("perfil")) return "profile";
    return "explore";
  };

  return (
    <Routes>
      <Route path="/" element={<SplashPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/registro" element={<SignUpPage />} />
      <Route
        path="/app/*"
        element={
          <>
            <MainLayout title="TourLocal">
              <Routes>
                <Route
                  path="*"
                  element={<Navigate to="/app/explorar" replace />}
                />
                <Route path="explorar" element={<ExplorePage />} />
                <Route path="guardados" element={<SavedPlacesPage />} />
                <Route path="historial" element={<HistoryPage />} />
                <Route path="perfil" element={<UserProfilePage />} />
                <Route path="perfil/editar" element={<EditProfilePage />} />
                <Route path="lugares" element={<AllPlacesPage />} />
                <Route path="lugares/:id" element={<PlaceDetailPage />} />
                <Route path="guias/:id" element={<GuideProfilePage />} />
                <Route path="agendar/:id" element={<ScheduleVisitPage />} />
                <Route
                  path="confirmar-reserva"
                  element={<ConfirmReservationPage />}
                />
                <Route path="pago" element={<PaymentMethodPage />} />
                <Route
                  path="reserva-confirmada"
                  element={<ReservationSuccessPage />}
                />
                <Route
                  path="cancelar-reserva/:id"
                  element={<CancelBookingPage />}
                />
                <Route
                  path="cancelacion-exitosa"
                  element={<CancellationSuccessPage />}
                />
                <Route
                  path="cancelacion-error"
                  element={<CancellationErrorPage />}
                />
                <Route
                  path="experiencias/:id"
                  element={<ExperienceDetailPage />}
                />
                <Route
                  path="experiencias/:id/calificar"
                  element={<RateExperiencePage />}
                />
                <Route path="notificaciones" element={<NotificationsPage />} />
              </Routes>
            </MainLayout>

            <NavBar
              activeTab={getActiveTab()}
              badges={{ history: 1 }}
              onTabChange={(tab) => {
                if (tab === "explore") navigate("/app/explorar");
                if (tab === "saved") navigate("/app/guardados");
                if (tab === "history") navigate("/app/historial");
                if (tab === "profile") navigate("/app/perfil");
              }}
            />
          </>
        }
      />
      <Route path="*" element={<h2>404 - Página no encontrada</h2>} />
    </Routes>
  );
}
