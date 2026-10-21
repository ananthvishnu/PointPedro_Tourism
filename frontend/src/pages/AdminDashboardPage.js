import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import './AdminPages.css';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({ places: 0, trips: 0, reviews: 0 });
  const [recentPlaces, setRecentPlaces] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/places?limit=5'),
      api.get('/trips').catch(() => ({ data: [] })),
    ]).then(([placesRes, tripsRes]) => {
      setStats({
        places: placesRes.data.total || 0,
        trips: Array.isArray(tripsRes.data) ? tripsRes.data.length : 0,
      });
      setRecentPlaces(placesRes.data.places || []);
    }).catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="page-loader"><div className="spinner" /></div>;

  return (
    <div className="admin-page">
      <div className="admin-hero">
        <div className="container">
          <h1>⚙️ Admin Dashboard</h1>
          <p>Manage the Point Pedro Tourism platform</p>
        </div>
      </div>

      <div className="container admin-content">
        {/* Quick nav */}
        <div className="admin-nav-cards">
          <Link to="/admin/places" className="admin-nav-card">
            <span className="anc-icon">🏖️</span>
            <div>
              <strong>Manage Places</strong>
              <p>Add, edit, or remove tourist attractions</p>
            </div>
            <span className="anc-arrow">→</span>
          </Link>
          <Link to="/places" className="admin-nav-card">
            <span className="anc-icon">👁️</span>
            <div>
              <strong>View Public Site</strong>
              <p>See what tourists see</p>
            </div>
            <span className="anc-arrow">→</span>
          </Link>
        </div>

        {/* Stats */}
        <div className="admin-stats">
          <div className="admin-stat-card">
            <span className="asc-num">{stats.places}</span>
            <span className="asc-label">Active Places</span>
            <span className="asc-icon">📍</span>
          </div>
          <div className="admin-stat-card">
            <span className="asc-num">8</span>
            <span className="asc-label">Categories</span>
            <span className="asc-icon">🗂️</span>
          </div>
          <div className="admin-stat-card">
            <span className="asc-num">∞</span>
            <span className="asc-label">Trip Plans</span>
            <span className="asc-icon">🗺️</span>
          </div>
          <div className="admin-stat-card">
            <span className="asc-num">✓</span>
            <span className="asc-label">System Online</span>
            <span className="asc-icon">🟢</span>
          </div>
        </div>

        {/* Recent places table */}
        <div className="admin-section">
          <div className="admin-section-header">
            <h3>Recent Places</h3>
            <Link to="/admin/places" className="btn btn-primary btn-sm">Manage All →</Link>
          </div>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Fee</th>
                  <th>Rating</th>
                  <th>Hours</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {recentPlaces.map(place => (
                  <tr key={place._id}>
                    <td><strong>{place.name}</strong></td>
                    <td><span className={`badge badge-${place.category}`}>{place.category}</span></td>
                    <td>{place.entranceFee === 0 ? <span style={{color:'var(--success)'}}>Free</span> : `Rs. ${place.entranceFee}`}</td>
                    <td>
                      <span className="stars" style={{fontSize:'0.8rem'}}>{'★'.repeat(Math.round(place.averageRating || 0))}</span>
                      {' '}{place.averageRating ? place.averageRating.toFixed(1) : '-'}
                    </td>
                    <td style={{fontSize:'0.82rem', color:'var(--gray)'}}>{place.openingTime}–{place.closingTime}</td>
                    <td>
                      <Link to={`/admin/places`} className="btn btn-secondary btn-sm">Edit</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
