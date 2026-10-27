import React from "react";
import "./SlotCard.css";

const SlotCard = ({
  time,
  period,
  statusText,
  statusType = "available", // 'available', 'selected', 'no-slots'
  onClick,
}) => {
  return (
    <button
      className={`slot-card slot-card--${statusType}`}
      onClick={onClick}
      disabled={statusType === "no-slots"}
    >
      <div className="slot-card__header">
        <span className="slot-card__time">{time}</span>
      </div>

      <div className="slot-card__footer">
        <span className="slot-card__period">{period}</span>
        <span className="slot-card__status">{statusText}</span>
      </div>
    </button>
  );
};

export default SlotCard;
