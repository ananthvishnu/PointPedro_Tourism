import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTrip } from '../context/TripContext';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import toast from 'react-hot-toast';
import './TripPlannerPage.css';

const PLACEHOLDER = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&q=60';

export default function TripPlannerPage() {
  const { tripItems, removeFromTrip, clearTrip, totalVisitMinutes } = useTrip();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [tripName, setTripName] = useState('My Batticaloa Trip');
  const [tripDate, setTripDate] = useState(new Date().toISOString().split('T')[0]);
  const [saving, setSaving] = useState(false);

  // Estimate travel time: assume 20min between each stop
  const travelTime = Math.max(0, (tripItems.length - 1) * 20);
  const totalTime = totalVisitMinutes + travelTime;

  const saveTrip = async () => {
    if (!user) { toast.error('Please login to save your trip'); navigate('/login'); return; }
    if (tripItems.length === 0) { toast.error('Add at least one place to your trip'); return; }
    setSaving(true);
    try {
      await api.post('/trips', {
        name: tripName,
        date: tripDate,
        placeIds: tripItems.map(p => p._id),
      });
      toast.success('Trip saved successfully!');
      clearTrip();
      navigate('/my-trips');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save trip');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="trip-planner-page">
      <div className="trip-hero">
        <div className="container">
          <h1>🗺️ Trip Planner</h1>
          <p>Build your perfect one-day Batticaloa itinerary</p>
        </div>
      </div>

      <div className="container trip-content">
        <div className="trip-grid">
          {/* Left: Trip list */}
          <div className="trip-main">
            <div className="trip-header">
              <h2>Your Places ({tripItems.length})</h2>
              {tripItems.length > 0 && (
                <button className="btn btn-danger btn-sm" onClick={() => { clearTrip(); toast.success('Trip cleared'); }}>
                  Clear All
                </button>
              )}
            </div>

            {tripItems.length === 0 ? (
              <div className="empty-trip">
                <div className="empty-icon">🗺️</div>
                <h3>Your trip is empty</h3>
                <p>Browse places and click "Add to Trip" to start planning your day.</p>
                <Link to="/places" className="btn btn-primary">Browse Places</Link>
              </div>
            ) : (
              <div className="trip-items">
                {tripItems.map((place, idx) => (
                  <div key={place._id} className="trip-item">
                    <div className="trip-item-num">{idx + 1}</div>
                    <img src={place.images?.[0]?.url || PLACEHOLDER} alt={place.name} onError={e => e.target.src = PLACEHOLDER} />
                    <div className="trip-item-info">
                      <h4><Link to={`/places/${place._id}`}>{place.name}</Link></h4>
                      <div className="trip-item-meta">
                        <span className={`badge badge-${place.category}`}>{place.category}</span>
                        <span>⏱️ ~{place.estimatedVisitMinutes} min</span>
                        <span>💰 {place.entranceFee === 0 ? 'Free' : `Rs. ${place.entranceFee}`}</span>
                        <span>🕗 {place.openingTime}–{place.closingTime}</span>
                      </div>
                    </div>
                    <button className="btn btn-danger btn-sm remove-btn" onClick={() => { removeFromTrip(place._id); toast.success('Removed'); }}>
                      ✕
                    </button>
                  </div>
                ))}

                {/* Travel time connector */}
                {tripItems.length > 1 && (
                  <div className="travel-connector">
                    <div className="travel-line" />
                    <span>~20 min travel between each stop</span>
                    <div className="travel-line" />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right: Summary + Save */}
          <div className="trip-sidebar">
            <div className="trip-summary card">
              <h3>Trip Summary</h3>

              <div className="summary-stats">
                <div className="summary-stat">
                  <span className="s-icon">📍</span>
                  <div><strong>{tripItems.length}</strong><span>Places</span></div>
                </div>
                <div className="summary-stat">
                  <span className="s-icon">🚗</span>
                  <div><strong>{travelTime} min</strong><span>Travel Time</span></div>
                </div>
                <div className="summary-stat">
                  <span className="s-icon">⏱️</span>
                  <div><strong>{totalVisitMinutes} min</strong><span>Visit Time</span></div>
                </div>
                <div className="summary-stat total">
                  <span className="s-icon">🕐</span>
                  <div><strong>{Math.floor(totalTime / 60)}h {totalTime % 60}m</strong><span>Total Duration</span></div>
                </div>
              </div>

              {/* Entrance fees total */}
              {tripItems.length > 0 && (
                <div className="fee-total">
                  <span>Total Entrance Fees:</span>
                  <strong>Rs. {tripItems.reduce((s, p) => s + (p.entranceFee || 0), 0)}</strong>
                </div>
              )}

              {tripItems.length > 0 && (
                <div className="save-form">
                  <div className="form-group">
                    <label className="form-label">Trip Name</label>
                    <input type="text" className="form-input" value={tripName} onChange={e => setTripName(e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Trip Date</label>
                    <input type="date" className="form-input" value={tripDate} onChange={e => setTripDate(e.target.value)} />
                  </div>
                  <button className="btn btn-primary btn-lg save-btn" onClick={saveTrip} disabled={saving}>
                    {saving ? 'Saving...' : user ? '💾 Save Trip' : '🔐 Login to Save'}
                  </button>
                </div>
              )}

              {!user && tripItems.length > 0 && (
                <p className="login-hint">
                  <Link to="/login">Login</Link> or <Link to="/register">register</Link> to save your trip.
                </p>
              )}
            </div>

            {/* Map preview */}
            {tripItems.length > 0 && (
              <div className="map-preview card" style={{padding:'1rem'}}>
                <h4 style={{marginBottom:'0.75rem', color:'var(--deep-green)'}}>📍 Route Preview</h4>
                <iframe
                  title="Route Map"
                  src={`https://maps.google.com/maps?q=${tripItems[0]?.location?.latitude},${tripItems[0]?.location?.longitude}&z=12&output=embed`}
                  width="100%" height="220"
                  style={{ border: 0, borderRadius: 'var(--radius)' }}
                  loading="lazy"
                  allowFullScreen
                />
                <a
                  href={`https://www.google.com/maps/dir/?api=1&origin=${tripItems[0]?.location?.latitude},${tripItems[0]?.location?.longitude}&destination=${tripItems[tripItems.length - 1]?.location?.latitude},${tripItems[tripItems.length - 1]?.location?.longitude}${tripItems.length > 2 ? '&waypoints=' + tripItems.slice(1, -1).map(p => `${p.location?.latitude},${p.location?.longitude}`).join('|') : ''}`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-secondary"
                  style={{ width: '100%', justifyContent: 'center', marginTop: '0.75rem' }}
                >
                  Open Full Route in Maps
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
