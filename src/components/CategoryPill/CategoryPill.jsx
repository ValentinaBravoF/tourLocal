import React from 'react';
import './CategoryPill.css';

const CategoryPill = ({ label, active = false, onClick, icon, count }) => {
  return (
    <button
      className={`category-pill ${active ? 'category-pill--active' : 'category-pill--inactive'}`}
      onClick={onClick}
      type="button"
    >
      {icon && <span className="category-pill__icon">{icon}</span>}
      <span className="category-pill__label">{label}</span>
      {count != null && (
        <span className="category-pill__count">{count}</span>
      )}
    </button>
  );
};

export default CategoryPill;
