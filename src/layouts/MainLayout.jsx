import React from 'react';
import { Outlet } from 'react-router-dom';
import NavBar from '../components/NavBar/NavBar';

export default function MainLayout() {
  return (
    <div className="main-layout" style={{ minHeight: '100vh', paddingBottom: '70px' }}>
      <main className="main-layout__content">
        <Outlet />
      </main>
      <NavBar />
    </div>
  );
}
