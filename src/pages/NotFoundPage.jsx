import React from 'react'
import { Link } from 'react-router-dom'
import './NotFoundPage.css'

export default function NotFoundPage() {
  return (
    <main className="page not-found-page">
      <div className="not-found-page__container">
        <h1 className="not-found-page__code">404</h1>
        <h2 className="not-found-page__title">Página no encontrada</h2>
        <p className="not-found-page__text">
          La dirección que buscas no existe en TourLocal.
        </p>
        <Link to="/explorar" className="btn btn--primary not-found-page__btn">
          Volver a Explorar
        </Link>
      </div>
    </main>
  )
}
