import React from 'react';
import { Link } from 'react-router-dom';
import { useTrip } from '../context/TripContext';
import './PlaceCard.css';

const PLACEHOLDER = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80';

export default function PlaceCard({ place }) {
  const { addToTrip, removeFromTrip, isInTrip } = useTrip();
  const inTrip = isInTrip(place._id);

  const handleTripToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    inTrip ? removeFromTrip(place._id) : addToTrip(place);
  };

  const imgSrc = place.images?.[0]?.url || PLACEHOLDER;

  return (
    <div className="place-card card">
      <Link to={`/places/${place._id}`} className="place-card-link">
        <div className="place-card-img-wrap">
          <img src={imgSrc} alt={place.name} onError={e => { e.target.src = PLACEHOLDER; }} />
          <span className={`badge badge-${place.category} place-category-badge`}>{place.category}</span>
          {place.entranceFee === 0
            ? <span className="fee-badge free">Free Entry</span>
            : <span className="fee-badge paid">Rs. {place.entranceFee}</span>
          }
        </div>
        <div className="place-card-body">
          <h3 className="place-card-title">{place.name}</h3>
          <p className="place-card-desc">{place.description.substring(0, 100)}...</p>
          <div className="place-card-meta">
            <span className="stars">{'★'.repeat(Math.round(place.averageRating || 0))}{'☆'.repeat(5 - Math.round(place.averageRating || 0))}</span>
            <span className="meta-text">{place.averageRating ? place.averageRating.toFixed(1) : 'No rating'} ({place.reviewCount || 0})</span>
            <span className="meta-time">🕐 {place.estimatedVisitMinutes} min</span>
          </div>
          <div className="place-card-hours">
            🕗 {place.openingTime} – {place.closingTime}
          </div>
        </div>
      </Link>
      <div className="place-card-actions">
        <Link to={`/places/${place._id}`} className="btn btn-secondary btn-sm">View Details</Link>
        <button
          className={`btn btn-sm ${inTrip ? 'btn-danger' : 'btn-primary'}`}
          onClick={handleTripToggle}
        >
          {inTrip ? '✕ Remove' : '+ Add to Trip'}
        </button>
      </div>
    </div>
  );
}
