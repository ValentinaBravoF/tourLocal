import "./HeaderBar.css";
export default function HeaderBar({ title = "TourLocal", showBack = false }) {
  return (
    <header className="header-bar">
      {showBack && (
        <button className="header-bar__back" aria-label="Volver">
          ←
        </button>
      )}
      <h1 className="header-bar__title">{title}</h1>
      <span className="header-bar__spacer" />
    </header>
  );
}
