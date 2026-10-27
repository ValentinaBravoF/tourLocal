import "./BottomNavigation.css";

export default function BottomNavigation() {
  return (
    <nav className="bottom-navigation">
      {/* Inicio tiene la clase extra para que se vea en color primary */}
      <span className="bottom-navigation__item bottom-navigation__item--active">
        Inicio
      </span>
      <span className="bottom-navigation__item">Reservas</span>
      <span className="bottom-navigation__item">Perfil</span>
    </nav>
  );
}
