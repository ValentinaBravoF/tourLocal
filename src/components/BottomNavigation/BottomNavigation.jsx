import React from 'react';
import { NavLink } from 'react-router-dom';
import './BottomNavigation.css';

export default function BottomNavigation() {
  const tabs = [
    { label: 'Explorar', to: '/explorar' },
    { label: 'Guardados', to: '/guardados' },
    { label: 'Historial', to: '/historial' },
    { label: 'Perfil', to: '/perfil' },
  ];

  return (
    <nav className="bottom-navigation">
      {tabs.map((tab) => (
        <NavLink
          key={tab.to}
          to={tab.to}
          className={({ isActive }) =>
            `bottom-navigation__item ${
              isActive ? 'bottom-navigation__item--active' : ''
            }`
          }
        >
          {tab.label}
        </NavLink>
      ))}
    </nav>
  );
}
