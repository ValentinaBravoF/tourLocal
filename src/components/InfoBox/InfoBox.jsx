import React from 'react'
import './InfoBox.css'

function InfoBox({ variant = 'info', title, text }) {
  return (
    <aside className={`info-box info-box--${variant}`}>
      {title && <strong className="info-box__title">{title}</strong>}
      {text && <p className="info-box__text">{text}</p>}
    </aside>
  )
}

export default InfoBox
