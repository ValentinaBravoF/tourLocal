import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import HeaderBar from "../components/HeaderBar/HeaderBar";
import CategoryPill from "../components/CategoryPill/CategoryPill";
import "./NotificationsPage.css";

const INITIAL_NOTIFICATIONS = [
  {
    id: 1,
    title: "¡Reserva Confirmada!",
    desc: 'Tu tour a Letrero "LA PAZ" ha sido confirmado para el 28 de octubre a las 10:00 AM.',
    time: "Hace 15 min",
    read: false,
    type: "booking",
    link: "/app/historial",
  },
  {
    id: 2,
    title: "Mensaje de tu guía Diego",
    desc: "Hola Sofía, recuerda llevar calzado cómodo y bloqueador solar para el recorrido.",
    time: "Hace 2 horas",
    read: false,
    type: "guide",
    link: "/app/guias/1",
  },
  {
    id: 3,
    title: "Califica tu experiencia",
    desc: "¿Qué te pareció el tour por la Calle de las Brujas con Marcos? ¡Tu opinión ayuda mucho!",
    time: "Ayer",
    read: true,
    type: "review",
    link: "/app/experiencias/1/calificar",
  },
  {
    id: 4,
    title: "Nuevo destino recomendado",
    desc: "Conoce el Mirador Killi Killi: vistas panorámicas de 360 grados de toda la ciudad.",
    time: "Hace 3 días",
    read: true,
    type: "promo",
    link: "/app/lugares/5",
  },
];

export default function NotificationsPage() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("Todas");
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const filtered = notifications.filter((n) => {
    if (filter === "Sin leer") return !n.read;
    return true;
  });

  return (
    <div className="notifications-page">
      <HeaderBar
        title="Notificaciones"
        showBackButton={true}
        onBackClick={() => navigate(-1)}
      />

      <main className="notifications-page__content">
        <div className="notifications-page__top">
          <div className="notifications-page__filters">
            <CategoryPill
              label="Todas"
              active={filter === "Todas"}
              onClick={() => setFilter("Todas")}
              count={notifications.length}
            />
            <CategoryPill
              label="Sin leer"
              active={filter === "Sin leer"}
              onClick={() => setFilter("Sin leer")}
              count={unreadCount}
            />
          </div>

          {unreadCount > 0 && (
            <button
              type="button"
              className="notifications-page__mark-all"
              onClick={markAllAsRead}
            >
              Marcar leídas
            </button>
          )}
        </div>

        <div className="notifications-page__list">
          {filtered.length > 0 ? (
            filtered.map((item) => (
              <article
                key={item.id}
                className={`notif-card ${!item.read ? "notif-card--unread" : ""}`}
                onClick={() => {
                  setNotifications((prev) =>
                    prev.map((n) => (n.id === item.id ? { ...n, read: true } : n))
                  );
                  if (item.link) navigate(item.link);
                }}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    if (item.link) navigate(item.link);
                  }
                }}
              >
                <div className="notif-card__icon-wrap">
                  {item.type === "booking" && "🎟️"}
                  {item.type === "guide" && "💬"}
                  {item.type === "review" && "⭐"}
                  {item.type === "promo" && "✨"}
                </div>
                <div className="notif-card__body">
                  <div className="notif-card__header">
                    <h3 className="notif-card__title">{item.title}</h3>
                    <span className="notif-card__time">{item.time}</span>
                  </div>
                  <p className="notif-card__desc">{item.desc}</p>
                </div>
                {!item.read && <span className="notif-card__dot" aria-label="No leída" />}
              </article>
            ))
          ) : (
            <div className="notifications-page__empty">
              <p>No tienes notificaciones pendientes.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
