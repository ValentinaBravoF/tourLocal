import React from "react";
import "./HeaderBar.css";

const HeaderBar = ({ title, showBackButton = false, onBackClick }) => {
  return (
    <header className="header-bar">
      <div className="header-bar__left">
        {showBackButton && (
          <button
            className="header-bar__back-btn"
            onClick={onBackClick}
            aria-label="Volver"
          >
            {/* Icono de flecha izquierda en SVG */}
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
          </button>
        )}
      </div>

      <h1 className="header-bar__title">{title}</h1>

      <div className="header-bar__right">
        {/* Espacio reservado para mantener el título centrado */}
      </div>
    </header>
  );
};

export default HeaderBar;
