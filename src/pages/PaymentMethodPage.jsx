import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import HeaderBar from "../components/HeaderBar/HeaderBar";
import Button from "../components/Button/Button";
import "./PaymentMethodPage.css";

export default function PaymentMethodPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const reserva = location.state?.reserva || {
    experienciaId: 1,
    experiencia: 'Letrero "LA PAZ"',
    fecha: "28 de octubre de 2026",
    horario: "10:00 AM",
    participantes: 2,
    precioPorPersona: 80,
    tarifaServicio: 10,
    ubicacion: "Murillo, La Paz, Bolivia",
    guia: "María Fernández",
  };

  const totalCalculado =
    reserva.precioPorPersona * reserva.participantes + reserva.tarifaServicio;

  const [metodo, setMetodo] = useState("qr");
  const [tarjetaNumero, setTarjetaNumero] = useState("");
  const [tarjetaVence, setTarjetaVence] = useState("");
  const [tarjetaCvv, setTarjetaCvv] = useState("");
  const [tigoTelefono, setTigoTelefono] = useState("");
  const [cupon, setCupon] = useState("");
  const [cuponAplicado, setCuponAplicado] = useState(false);
  const [procesando, setProcesando] = useState(false);

  const descuento = cuponAplicado ? 20 : 0;
  const totalFinal = Math.max(0, totalCalculado - descuento);

  function aplicarCupon() {
    if (cupon.trim().toUpperCase() === "TOUR2026" || cupon.trim().toUpperCase() === "LAPAZ") {
      setCuponAplicado(true);
    } else {
      alert("Cupón no válido. Prueba con 'LAPAZ' para Bs. 20 de descuento.");
    }
  }

  function finalizarPago() {
    setProcesando(true);

    setTimeout(() => {
      setProcesando(false);
      navigate("/app/reserva-confirmada", {
        state: {
          reserva: {
            ...reserva,
            metodoPago:
              metodo === "qr"
                ? "QR Simple"
                : metodo === "tarjeta"
                ? "Tarjeta Débito/Crédito"
                : metodo === "tigo"
                ? "Tigo Money"
                : "Efectivo al guía",
            totalPagado: totalFinal,
            estado: "confirmada",
            idReserva: `TL-${Math.floor(100000 + Math.random() * 900000)}`,
          },
        },
      });
    }, 800);
  }

  return (
    <div className="payment-page">
      <HeaderBar
        title="Método de Pago"
        showBackButton={true}
        onBackClick={() => navigate(-1)}
      />

      <main className="payment-page__content">
        {/* Resumen Superior */}
        <section className="payment-page__summary-card">
          <div className="payment-page__summary-info">
            <span className="payment-page__summary-label">Total a pagar</span>
            <strong className="payment-page__summary-amount">
              Bs. {totalFinal}.00
            </strong>
          </div>
          <p className="payment-page__summary-tour">
            {reserva.experiencia} · {reserva.participantes} personas · {reserva.horario}
          </p>
        </section>

        {/* Opciones de Pago */}
        <section className="payment-page__methods">
          <h2 className="payment-page__section-title">Selecciona cómo pagar</h2>

          {/* Opción 1: QR Simple */}
          <div
            className={`payment-method ${metodo === "qr" ? "payment-method--selected" : ""}`}
            onClick={() => setMetodo("qr")}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") setMetodo("qr");
            }}
          >
            <div className="payment-method__header">
              <input
                type="radio"
                name="metodo"
                checked={metodo === "qr"}
                onChange={() => setMetodo("qr")}
                className="payment-method__radio"
              />
              <div className="payment-method__icon-label">
                <span className="payment-method__badge-tag">Recomendado</span>
                <span className="payment-method__name">QR Simple Bolivia</span>
              </div>
            </div>
            <p className="payment-method__desc">
              Paga al instante con cualquier banco boliviano (BCP, BNB, Unión, BancoSol).
            </p>

            {metodo === "qr" && (
              <div className="payment-method__qr-box">
                <div className="payment-method__qr-mock">
                  <svg viewBox="0 0 100 100" className="payment-method__qr-svg">
                    <rect width="100" height="100" fill="#ffffff" />
                    <rect x="10" y="10" width="25" height="25" fill="#242421" />
                    <rect x="15" y="15" width="15" height="15" fill="#ffffff" />
                    <rect x="18" y="18" width="9" height="9" fill="#242421" />
                    <rect x="65" y="10" width="25" height="25" fill="#242421" />
                    <rect x="70" y="15" width="15" height="15" fill="#ffffff" />
                    <rect x="73" y="18" width="9" height="9" fill="#242421" />
                    <rect x="10" y="65" width="25" height="25" fill="#242421" />
                    <rect x="15" y="70" width="15" height="15" fill="#ffffff" />
                    <rect x="18" y="73" width="9" height="9" fill="#242421" />
                    <rect x="45" y="15" width="10" height="10" fill="#0f766e" />
                    <rect x="45" y="45" width="20" height="20" fill="#0f766e" />
                    <rect x="75" y="55" width="15" height="15" fill="#242421" />
                    <rect x="45" y="75" width="10" height="15" fill="#242421" />
                  </svg>
                </div>
                <div className="payment-method__qr-instructions">
                  <span>1. Abre tu app bancaria</span>
                  <span>2. Elige "Cobro/Pago con QR"</span>
                  <span>3. Escanea y presiona continuar</span>
                </div>
              </div>
            )}
          </div>

          {/* Opción 2: Tarjeta */}
          <div
            className={`payment-method ${metodo === "tarjeta" ? "payment-method--selected" : ""}`}
            onClick={() => setMetodo("tarjeta")}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") setMetodo("tarjeta");
            }}
          >
            <div className="payment-method__header">
              <input
                type="radio"
                name="metodo"
                checked={metodo === "tarjeta"}
                onChange={() => setMetodo("tarjeta")}
                className="payment-method__radio"
              />
              <span className="payment-method__name">Tarjeta de Débito / Crédito</span>
            </div>
            <p className="payment-method__desc">Visa, Mastercard o tarjeta de débito local.</p>

            {metodo === "tarjeta" && (
              <div className="payment-method__card-inputs" onClick={(e) => e.stopPropagation()}>
                <input
                  type="text"
                  placeholder="Número de tarjeta (16 dígitos)"
                  maxLength="19"
                  value={tarjetaNumero}
                  onChange={(e) => setTarjetaNumero(e.target.value)}
                  className="payment-input"
                />
                <div className="payment-input-row">
                  <input
                    type="text"
                    placeholder="MM/AA"
                    maxLength="5"
                    value={tarjetaVence}
                    onChange={(e) => setTarjetaVence(e.target.value)}
                    className="payment-input"
                  />
                  <input
                    type="password"
                    placeholder="CVV"
                    maxLength="4"
                    value={tarjetaCvv}
                    onChange={(e) => setTarjetaCvv(e.target.value)}
                    className="payment-input"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Opción 3: Tigo Money */}
          <div
            className={`payment-method ${metodo === "tigo" ? "payment-method--selected" : ""}`}
            onClick={() => setMetodo("tigo")}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") setMetodo("tigo");
            }}
          >
            <div className="payment-method__header">
              <input
                type="radio"
                name="metodo"
                checked={metodo === "tigo"}
                onChange={() => setMetodo("tigo")}
                className="payment-method__radio"
              />
              <span className="payment-method__name">Tigo Money</span>
            </div>
            <p className="payment-method__desc">Paga desde tu billetera móvil Tigo.</p>

            {metodo === "tigo" && (
              <div className="payment-method__card-inputs" onClick={(e) => e.stopPropagation()}>
                <input
                  type="tel"
                  placeholder="Número de celular Tigo (ej. 77212345)"
                  maxLength="8"
                  value={tigoTelefono}
                  onChange={(e) => setTigoTelefono(e.target.value)}
                  className="payment-input"
                />
              </div>
            )}
          </div>

          {/* Opción 4: Efectivo */}
          <div
            className={`payment-method ${metodo === "efectivo" ? "payment-method--selected" : ""}`}
            onClick={() => setMetodo("efectivo")}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") setMetodo("efectivo");
            }}
          >
            <div className="payment-method__header">
              <input
                type="radio"
                name="metodo"
                checked={metodo === "efectivo"}
                onChange={() => setMetodo("efectivo")}
                className="payment-method__radio"
              />
              <span className="payment-method__name">Pago en Efectivo el día del Tour</span>
            </div>
            <p className="payment-method__desc">
              Paga el monto acordado directamente a tu guía {reserva.guia} al punto de encuentro.
            </p>
          </div>
        </section>

        {/* Cupón de descuento */}
        <section className="payment-page__coupon">
          <div className="payment-page__coupon-box">
            <input
              type="text"
              placeholder="Código de descuento (ej. LAPAZ)"
              value={cupon}
              onChange={(e) => setCupon(e.target.value)}
              className="payment-input"
              disabled={cuponAplicado}
            />
            <button
              type="button"
              className="payment-page__coupon-btn"
              onClick={aplicarCupon}
              disabled={cuponAplicado || !cupon.trim()}
            >
              {cuponAplicado ? "Aplicado ✓" : "Aplicar"}
            </button>
          </div>
          {cuponAplicado && (
            <p className="payment-page__coupon-success">
              ¡Cupón aplicado! Descuento de Bs. 20.00
            </p>
          )}
        </section>

        {/* Botón de acción */}
        <div className="payment-page__actions">
          <Button
            variant="primary"
            onClick={finalizarPago}
            disabled={procesando}
          >
            {procesando ? "Procesando pago..." : `Confirmar y Pagar Bs. ${totalFinal}.00`}
          </Button>

          <Button variant="secondary" onClick={() => navigate(-1)}>
            Volver a la Reserva
          </Button>
        </div>
      </main>
    </div>
  );
}
