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
    // 1. Leer del navegador las notificaciones que ya abrimos
    const leidas = JSON.parse(localStorage.getItem("tourlocal_notifs_leidas") || "[]");
    const list = [];

    // 2. Generar notificaciones reales de la base de datos
    if (Array.isArray(reservas)) {
      reservas.forEach((r, idx) => {
        const notifId = `res-${r.codigo || r.id || idx}`;
        list.push({
          id: notifId,
          title: r.estado === "cancelada" ? "Reserva Cancelada" : "¡Reserva Confirmada!",
          desc: r.estado === "cancelada"
            ? `Tu reserva para "${r.experiencia}" ha sido cancelada.`
            : `Tu tour a "${r.experiencia}" está confirmado. Código: ${r.codigo || "TL-" + r.id}`,
          time: "Reciente",
          read: leidas.includes(notifId), // Verifica si ya está en la lista de leídas
          type: "booking",
          link: "/historial",
          state: { tab: r.estado === "cancelada" ? "past" : "upcoming" },
        });
      });
    }

    // 3. Notificaciones de sistema (estáticas)
    list.push({
      id: "guide-diego",
      title: "Mensaje de tu guía",
      desc: "Hola, recuerda llevar calzado cómodo para el recorrido. ¡Nos vemos pronto!",
      time: "Hace 2 horas",
      read: leidas.includes("guide-diego"),
      type: "guide",
      link: "/guias/1",
    });

    setNotifications(list);
  }, [reservas]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Marcar TODAS como leídas
  const markAllAsRead = () => {
    const allIds = notifications.map((n) => n.id);
    localStorage.setItem("tourlocal_notifs_leidas", JSON.stringify(allIds));
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  // Marcar UNA como leída al hacerle clic
  const handleNotifClick = (item) => {
    const leidas = JSON.parse(localStorage.getItem("tourlocal_notifs_leidas") || "[]");
    if (!leidas.includes(item.id)) {
      leidas.push(item.id);
      localStorage.setItem("tourlocal_notifs_leidas", JSON.stringify(leidas));
    }
    setNotifications((prev) =>
      prev.map((n) => (n.id === item.id ? { ...n, read: true } : n))
    );
    if (item.link) navigate(item.link, item.state ? { state: item.state } : undefined);
  };

  const filtered = notifications.filter((n) => {
    if (filter === "Sin leer") return !n.read;
    return true;
  });

  return (
    <div className="notifications-page">
      <HeaderBar title="Notificaciones" showBackButton={true} onBackClick={() => navigate(-1)} />
      <main className="notifications-page__content">
        <div className="notifications-page__top">
          <div className="notifications-page__filters">
            <CategoryPill label="Todas" active={filter === "Todas"} onClick={() => setFilter("Todas")} count={notifications.length} />
            <CategoryPill label="Sin leer" active={filter === "Sin leer"} onClick={() => setFilter("Sin leer")} count={unreadCount} />
          </div>
          {unreadCount > 0 && (
            <button type="button" className="notifications-page__mark-all" onClick={markAllAsRead}>
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
            <div className="notifications-page__empty"><p>No tienes notificaciones pendientes.</p></div>
          )}
        </div>
      </main>
    </div>
  );
}