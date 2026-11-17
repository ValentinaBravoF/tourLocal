import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import HeaderBar from "../components/HeaderBar/HeaderBar";
import CategoryPill from "../components/CategoryPill/CategoryPill";
import useReservas from "../hooks/useReservas";
import "./NotificationsPage.css";

export default function NotificationsPage() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("Todas");
  const { reservas } = useReservas();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const list = [];

    // Notificaciones sincronizadas con las reservas reales en el historial
    if (Array.isArray(reservas) && reservas.length > 0) {
      reservas.forEach((r, idx) => {
        list.push({
          id: `res-${r.codigo || r.id || idx}`,
          title:
            r.estado === "cancelada"
              ? "Reserva Cancelada"
              : "¡Reserva Confirmada!",
          desc:
            r.estado === "cancelada"
              ? `Tu reserva para "${r.experiencia}" ha sido cancelada.`
              : `Tu tour a "${r.experiencia}" está confirmado para el ${r.fecha} a las ${r.horario}. Código: ${r.codigo || "TL-" + r.id}`,
          time: "Reciente",
          read: false,
          type: "booking",
          link: "/historial",
          state: { tab: r.estado === "cancelada" ? "past" : "upcoming" },
        });
      });
    } else {
      list.push({
        id: "demo-booking",
        title: "¡Reserva Confirmada!",
        desc: 'Tu tour a Letrero "LA PAZ" ha sido confirmado para el 28 de octubre a las 10:00 AM.',
        time: "Hace 15 min",
        read: false,
        type: "booking",
        link: "/historial",
        state: { tab: "upcoming" },
      });
    }

    list.push(
      {
        id: "guide-diego",
        title: "Mensaje de tu guía Diego Ramos",
        desc: "Hola, recuerda llevar calzado cómodo y bloqueador solar para el recorrido.",
        time: "Hace 2 horas",
        read: false,
        type: "guide",
        link: "/guias/1",
      },
      {
        id: "review-brujas",
        title: "Califica tu experiencia",
        desc: "¿Qué te pareció el tour por la Calle de las Brujas? ¡Tu opinión ayuda mucho a otros viajeros!",
        time: "Ayer",
        read: true,
        type: "review",
        link: "/experiencias/1/calificar",
      },
      {
        id: "promo-killi",
        title: "Nuevo destino recomendado",
        desc: "Conoce el Mirador Killi Killi: vistas panorámicas de 360 grados de toda la ciudad.",
        time: "Hace 3 días",
        read: true,
        type: "promo",
        link: "/lugares/5",
      },
    );

    setNotifications(list);
  }, [reservas]);

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
                    prev.map((n) => (n.id === item.id ? { ...n, read: true } : n)),
                  );
                  if (item.link) navigate(item.link, item.state ? { state: item.state } : undefined);
                }}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    if (item.link) navigate(item.link, item.state ? { state: item.state } : undefined);
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
