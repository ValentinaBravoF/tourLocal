import MainLayout from "./layouts/MainLayout";
import BottomNavigation from "./components/BottomNavigation/BottomNavigation";

export default function App() {
  return (
    <>
      <MainLayout title="TourLocal">
        <h2>Proyecto TourLocal listo</h2>
        <p>La cabecera y la barra inferior ya están visibles.</p>
      </MainLayout>

      {/* La barra se coloca debajo del main (el layout) */}
      <BottomNavigation />
    </>
  );
}
