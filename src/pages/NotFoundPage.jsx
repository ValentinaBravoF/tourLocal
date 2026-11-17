import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import HeaderBar from "../components/HeaderBar/HeaderBar";
import CategoryPill from "../components/CategoryPill/CategoryPill";
import useReservas from "../hooks/useReservas";
import "./NotificationsPage.css";

const STORAGE_KEY = "tourlocal_notifs_leidas";

function obtenerLeidas() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function getNotifId(r) {
  return `res-${r.id ?? r.codigo ?? r.experiencia}-${r.estado ?? "confirmada"}`;
}

export default function NotificationsPage() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("Todas");
  const { reservas } = useReservas();
  const [readIds, setReadIds] = useState(() => obtenerLeidas());

  const notifications = useMemo(() => {
    const list = [];

    if (Array.isArray(reservas)) {
      reservas.forEach((r) => {
        const notifId = getNotifId(r);
        list.push({
          id: notifId,
          title:
            r.estado === "cancelada"
              ? "Reserva Cancelada"
              : "¡Reserva Confirmada!",
          desc:
            r.estado === "cancelada"
              ? `Tu reserva para "${r.experiencia}" ha sido cancelada.`
              : `Tu tour a "${r.experiencia}" está confirmado para el ${r.fecha} a las ${r.horario}.`,
          time: "Reciente",
          read: readIds.includes(notifId),
          type: "booking",
          link: "/historial",
          state: { tab: r.estado === "cancelada" ? "past" : "upcoming" },
        });
      });
    }

    const fijas = [
      {
        id: "guide-diego",
        title: "Mensaje de tu guía Diego Ramos",
        desc: "Hola, recuerda llevar calzado cómodo y bloqueador solar para el recorrido.",
        time: "Hace 2 horas",
        type: "guide",
        link: "/guias/1",
      },
      {
        id: "review-brujas",
        title: "Califica tu experiencia",
        desc: "¿Qué te pareció el tour por la Calle de las Brujas? ¡Tu opinión ayuda mucho a otros viajeros!",
        time: "Ayer",
        type: "review",
        link: "/experiencias/1/calificar",
      },
      {
        id: "promo-killi",
        title: "Nuevo destino recomendado",
        desc: "Conoce el Mirador Killi Killi: vistas panorámicas de 360 grados de toda la ciudad.",
        time: "Hace 3 días",
        type: "promo",
        link: "/lugares/5",
      },
    ];

    fijas.forEach((item) => {
      list.push({
        ...item,
        read: readIds.includes(item.id),
      });
    });

    return list;
  }, [reservas, readIds]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllAsRead = () => {
    setReadIds((prev) => {
      const nuevos = Array.from(new Set([...prev, ...notifications.map((n) => n.id)]));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(nuevos));
      window.dispatchEvent(new Event("notifs-actualizadas"));
      return nuevos;
    });
  };

  const handleNotifClick = (item) => {
    const actual = obtenerLeidas();
    const nuevos = Array.from(new Set([...actual, item.id]));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nuevos));
    setReadIds(nuevos);
    window.dispatchEvent(new Event("notifs-actualizadas"));

    if (item.link) {
      navigate(item.link, item.state ? { state: item.state } : undefined);
    }
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
        onBackClick={() => navigate("/explorar")}
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
                onClick={() => handleNotifClick(item)}
                role="button"
                tabIndex={0}
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
                {!item.read && (
                  <span className="notif-card__dot" aria-label="No leída" />
                )}
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