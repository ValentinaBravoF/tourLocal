import React from 'react';
import './FeaturedCard.css';

const FeaturedCard = ({
  image,
  title,
  location,
  tag = "Pase Libre",
  duration = "A 40 minutos",
  price,
  onClick
}) => {
  return (
    <div className="featured-card" onClick={onClick}>
      <div className="featured-card__image-container">
        <img src={image} alt={title} className="featured-card__image" />
      </div>
      <div className="featured-card__content">
        <h3 className="featured-card__title">{title}</h3>
        <p className="featured-card__location">
          <svg className="featured-card__pin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          {location}
        </p>
        <div className="featured-card__footer">
          <span className="featured-card__tag">{tag}</span>
          <span className="featured-card__meta">{price ? price : duration}</span>
        </div>
      </div>
    </div>
  );
};

export default FeaturedCard;