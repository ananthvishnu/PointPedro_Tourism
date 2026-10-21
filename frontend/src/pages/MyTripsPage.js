import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import toast from 'react-hot-toast';
import './MyTripsPage.css';

export default function MyTripsPage() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTripForMap, setSelectedTripForMap] = useState(null);

  useEffect(() => {
    api.get('/trips')
      .then(res => setTrips(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const deleteTrip = async (id) => {
    if (!window.confirm('Delete this trip?')) return;
    try {
      await api.delete(`/trips/${id}`);
      setTrips(prev => prev.filter(t => t._id !== id));
      toast.success('Trip deleted');
    } catch {
      toast.error('Failed to delete trip');
    }
  };

  if (loading) return <div className="page-loader"><div className="spinner" /></div>;

  return (
    <div className="my-trips-page">
      <div className="trips-hero">
        <div className="container">
          <h1>My Trips</h1>
          <p>Your saved Point Pedro itineraries</p>
          <Link to="/trip-planner" className="btn btn-secondary">+ Plan New Trip</Link>
        </div>
      </div>

      <div className="container trips-content">
        {trips.length === 0 ? (
          <div className="empty-state">
            <h3>No saved trips yet</h3>
            <p>Use the trip planner to create your first Point Pedro itinerary.</p>
            <Link to="/trip-planner" className="btn btn-primary" style={{marginTop:'1rem'}}>Start Planning</Link>
          </div>
        ) : (
          <div className="trips-list">
            {trips.map(trip => (
              <div key={trip._id} className="trip-card card">
                <div className="trip-card-header">
                  <div>
                    <div style={{display:'flex', alignItems:'center', gap:'0.75rem', marginBottom:'0.5rem'}}>
                      <h3 style={{margin:0}}>{trip.name}</h3>
                      <button 
                        className="btn btn-secondary btn-sm"
                        onClick={() => setSelectedTripForMap(trip)}
                        title="View route map"
                        style={{padding:'0.4rem 0.8rem', fontSize:'1rem', display:'flex', alignItems:'center', gap:'0.4rem', whiteSpace:'nowrap'}}
                      >
                        🗺️ Map
                      </button>
                    </div>
                    <p className="trip-date">📅 {new Date(trip.date).toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                  </div>
                  <button className="btn btn-danger btn-sm" onClick={() => deleteTrip(trip._id)}>Delete</button>
                </div>

                <div className="trip-stats-row">
                  <span>📍 {trip.places.length} places</span>
                  <span>🚗 ~{trip.totalTravelTimeMinutes} min travel</span>
                  <span>💰 Rs. {trip.places.reduce((s, tp) => s + (tp.place?.entranceFee || 0), 0)} total fees</span>
                </div>

                <div className="trip-places-list">
                  {trip.places.sort((a, b) => a.visitOrder - b.visitOrder).map((tp, idx) => (
                    tp.place && (
                      <div key={tp._id || idx} className="trip-place-item">
                        <span className="tp-num">{tp.visitOrder}</span>
                        <Link to={`/places/${tp.place._id}`} className="tp-name">{tp.place.name}</Link>
                        <span className={`badge badge-${tp.place.category}`}>{tp.place.category}</span>
                        <span className="tp-time">⏱️ {tp.estimatedVisitMinutes} min</span>
                      </div>
                    )
                  ))}
                </div>

                {trip.notes && <p className="trip-notes">📝 {trip.notes}</p>}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Route Map Modal */}
      {selectedTripForMap && (
        <div className="map-modal-overlay" onClick={() => setSelectedTripForMap(null)}>
          <div className="map-modal" onClick={e => e.stopPropagation()}>
            <div className="map-modal-header">
              <h2>🗺️ Route Map - {selectedTripForMap.name}</h2>
              <button 
                className="btn btn-sm" 
                onClick={() => setSelectedTripForMap(null)}
                style={{padding:'0.4rem 0.8rem', fontSize:'1.2rem'}}
              >
                ✕
              </button>
            </div>

            <div className="map-modal-content">
              <iframe
                title="Full Route Map"
                src={`https://maps.google.com/maps?q=${selectedTripForMap.places[0]?.place?.location?.latitude},${selectedTripForMap.places[0]?.place?.location?.longitude}&z=12&output=embed`}
                width="100%" height="400"
                style={{ border: 0, borderRadius: 'var(--radius)' }}
                loading="lazy"
                allowFullScreen
              />

              <a
                href={`https://www.google.com/maps/dir/?api=1&origin=${selectedTripForMap.places[0]?.place?.location?.latitude},${selectedTripForMap.places[0]?.place?.location?.longitude}&destination=${selectedTripForMap.places[selectedTripForMap.places.length - 1]?.place?.location?.latitude},${selectedTripForMap.places[selectedTripForMap.places.length - 1]?.place?.location?.longitude}${selectedTripForMap.places.length > 2 ? '&waypoints=' + selectedTripForMap.places.slice(1, -1).map(p => `${p.place?.location?.latitude},${p.place?.location?.longitude}`).join('|') : ''}`}
                target="_blank"
                rel="noreferrer"
                className="btn btn-primary"
                style={{ width: '100%', justifyContent: 'center', marginTop: '1rem' }}
              >
                🗺️ Open Full Route in Google Maps
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
