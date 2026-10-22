import React from 'react';
import './CategoryPill.css';

const CategoryPill = ({ label, active = false, onClick }) => {
  return (
    <button
      className={`category-pill ${active ? 'category-pill--active' : ''}`}
      onClick={onClick}
      type="button"
    >
      {label}
    </button>
  );
};

export default CategoryPill;