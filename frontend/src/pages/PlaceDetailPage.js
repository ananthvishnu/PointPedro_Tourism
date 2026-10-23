import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../utils/api';
import { useTrip } from '../context/TripContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import './PlaceDetailPage.css';

const PLACEHOLDER = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80';

export default function PlaceDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const { addToTrip, removeFromTrip, isInTrip } = useTrip();

  const [place, setPlace] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    Promise.all([
      api.get(`/places/${id}`),
      api.get(`/reviews/place/${id}`),
    ])
      .then(([placeRes, reviewsRes]) => {
        setPlace(placeRes.data);
        setReviews(reviewsRes.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const handleTripToggle = () => {
    if (isInTrip(id)) { removeFromTrip(id); toast.success('Removed from trip'); }
    else { addToTrip(place); toast.success('Added to trip!'); }
  };

  const submitReview = async (e) => {
    e.preventDefault();
    if (!reviewForm.comment.trim()) return toast.error('Please write a comment');
    setSubmittingReview(true);
    try {
      const res = await api.post('/reviews', { place: id, ...reviewForm });
      setReviews(prev => [res.data, ...prev]);
      setReviewForm({ rating: 5, comment: '' });
      toast.success('Review submitted!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  const deleteReview = async (reviewId) => {
    try {
      await api.delete(`/reviews/${reviewId}`);
      setReviews(prev => prev.filter(r => r._id !== reviewId));
      toast.success('Review deleted');
    } catch (err) {
      toast.error('Failed to delete review');
    }
  };

  if (loading) return <div className="page-loader"><div className="spinner" /></div>;
  if (!place) return <div className="container" style={{padding:'4rem 0'}}><h2>Place not found</h2><Link to="/places">← Back</Link></div>;

  const inTrip = isInTrip(id);
  const imgSrc = place.images?.[0]?.url || PLACEHOLDER;
  const mapUrl = `https://maps.google.com/maps?q=${place.location.latitude},${place.location.longitude}&z=15&output=embed`;
  console.log(place.location.latitude);
    console.log(place.location.longitude);


  return (
    <div className="place-detail">
      {/* Hero image */}
      <div className="detail-hero" style={{ backgroundImage: `url(${imgSrc})` }}>
        <div className="detail-hero-overlay" />
        <div className="container detail-hero-content">
          <Link to="/places" className="back-link">← Back to Places</Link>
          <span className={`badge badge-${place.category}`}>{place.category}</span>
          <h1>{place.name}</h1>
          <div className="detail-meta-row">
            <span className="stars">{'★'.repeat(Math.round(place.averageRating || 0))}</span>
            <span>{place.averageRating ? place.averageRating.toFixed(1) : 'No rating'} ({place.reviewCount} reviews)</span>
            {place.entranceFee === 0
              ? <span className="fee-tag free">Free Entry</span>
              : <span className="fee-tag paid">Rs. {place.entranceFee} Entry</span>
            }
          </div>
        </div>
      </div>

      <div className="container detail-body">
        <div className="detail-grid">
          {/* Left: Info */}
          <div className="detail-main">
            <div className="detail-section">
              <h2>About this Place</h2>
              <p>{place.description}</p>
            </div>

            <div className="detail-info-cards">
              <div className="info-card"><span className="info-icon">🕗</span><div><strong>Opening Hours</strong><p>{place.openingTime} – {place.closingTime}</p></div></div>
              <div className="info-card"><span className="info-icon">💰</span><div><strong>Entrance Fee</strong><p>{place.entranceFee === 0 ? 'Free' : `Rs. ${place.entranceFee}`}</p></div></div>
              <div className="info-card"><span className="info-icon">⏱️</span><div><strong>Visit Duration</strong><p>~{place.estimatedVisitMinutes} minutes</p></div></div>
              <div className="info-card"><span className="info-icon">📍</span><div><strong>Location</strong><p>{place.location.address || 'Point Pedro, Sri Lanka'}</p></div></div>
            </div>

            {place.safetyGuidelines?.length > 0 && (
              <div className="detail-section safety-section">
                <h3>⚠️ Safety Guidelines</h3>
                <ul>{place.safetyGuidelines.map((g, i) => <li key={i}>{g}</li>)}</ul>
              </div>
            )}

            {place.seasonalWarnings?.length > 0 && (
              <div className="detail-section warning-section">
                <h3>🌦️ Seasonal Warnings</h3>
                <ul>{place.seasonalWarnings.map((w, i) => <li key={i}>{w}</li>)}</ul>
              </div>
            )}

            {/* Reviews */}
            <div className="detail-section">
              <h2>Reviews ({reviews.length})</h2>
              {user && (
                <form className="review-form" onSubmit={submitReview}>
                  <h4>Leave a Review</h4>
                  <div className="star-select">
                    {[1,2,3,4,5].map(n => (
                      <button key={n} type="button"
                        className={`star-btn ${reviewForm.rating >= n ? 'active' : ''}`}
                        onClick={() => setReviewForm(p => ({ ...p, rating: n }))}>★</button>
                    ))}
                  </div>
                  <textarea
                    className="form-input"
                    rows={3}
                    placeholder="Share your experience..."
                    value={reviewForm.comment}
                    onChange={e => setReviewForm(p => ({ ...p, comment: e.target.value }))}
                    style={{resize:'vertical'}}
                  />
                  <button className="btn btn-primary" type="submit" disabled={submittingReview}>
                    {submittingReview ? 'Submitting...' : 'Submit Review'}
                  </button>
                </form>
              )}

              <div className="reviews-list">
                {reviews.length === 0 && <p className="no-reviews">No reviews yet. Be the first!</p>}
                {reviews.map(review => (
                  <div key={review._id} className="review-item">
                    <div className="review-header">
                      <strong>{review.user?.name || 'Anonymous'}</strong>
                      <span className="stars small">{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</span>
                      <span className="review-date">{new Date(review.createdAt).toLocaleDateString()}</span>
                      {user && review.user?._id === user._id && (
                        <button className="btn btn-danger btn-sm" onClick={() => deleteReview(review._id)}>Delete</button>
                      )}
                    </div>
                    <p>{review.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Map + Trip */}
          <div className="detail-sidebar">
            <div className="sidebar-sticky">
              <button
                className={`btn btn-lg trip-btn ${inTrip ? 'btn-danger' : 'btn-primary'}`}
                onClick={handleTripToggle}
              >
                {inTrip ? '✕ Remove from Trip' : '+ Add to Trip'}
              </button>

              <div className="map-container">
                <h3>📍 Location</h3>
                <iframe
                  title="Location Map"
                  src={mapUrl}
                  width="100%"
                  height="280"
                  style={{ border: 0, borderRadius: 'var(--radius)' }}
                  loading="lazy"
                  allowFullScreen
                />
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${place.location.latitude},${place.location.longitude}`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-secondary"
                  style={{width:'100%', justifyContent:'center', marginTop:'0.75rem'}}
                >
                  🗺️ Get Directions
                </a>
              </div>

              <Link to="/trip-planner" className="btn btn-secondary" style={{width:'100%', justifyContent:'center', marginTop:'0.75rem'}}>
                View Trip Planner →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
