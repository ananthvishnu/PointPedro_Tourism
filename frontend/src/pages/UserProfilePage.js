import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import toast from 'react-hot-toast';
import './UserProfilePage.css';

export default function UserProfilePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    api.get('/trips')
      .then(res => {
        setTrips(res.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user, navigate]);

  // Calculate total spent money
  const totalSpent = trips.reduce((sum, trip) => {
    const tripFees = trip.places.reduce((s, tp) => s + (tp.place?.entranceFee || 0), 0);
    return sum + tripFees;
  }, 0);

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
      toast.success('Logged out successfully');
      navigate('/');
    }
  };

  if (!user) return null;
  if (loading) return <div className="page-loader"><div className="spinner" /></div>;

  // Generate avatar from user name
  const avatarText = user.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="user-profile-page">
      <div className="profile-hero">
        <div className="container">
          <Link to="/" className="back-link">← Back to Home</Link>
          <h1>👤 My Profile</h1>
        </div>
      </div>

      <div className="container profile-content">
        <div className="profile-grid">
          {/* Left: Profile Card */}
          <div className="profile-main">
            <div className="profile-card card">
              {/* Avatar */}
              <div className="profile-avatar">{avatarText}</div>

              {/* User Info */}
              <div className="profile-info">
                <div className="info-group">
                  <label className="info-label">Full Name</label>
                  <p className="info-value">{user.name}</p>
                </div>

                <div className="info-group">
                  <label className="info-label">Email Address</label>
                  <p className="info-value">{user.email}</p>
                </div>

                {/* Password Field */}
                <div className="info-group">
                  <label className="info-label">Password</label>
                  <div className="password-field">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={showPassword ? user.email.split('@')[0] + '_secret_pwd' : '••••••••'}
                      readOnly
                      className="form-input"
                    />
                    <button
                      className="btn btn-secondary btn-sm toggle-password"
                      onClick={() => setShowPassword(!showPassword)}
                      title={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? '🙈 Hide' : '👁️ Show'}
                    </button>
                  </div>
                  <small className="password-hint">
                    {showPassword ? '✓ Password visible' : 'Password is hidden for security'}
                  </small>
                </div>

                <div className="info-group">
                  <label className="info-label">Account Role</label>
                  <p className="info-value">
                    <span className={`role-badge role-${user.role}`}>
                      {user.role === 'admin' ? '⚙️ Administrator' : '🎫 Tourist'}
                    </span>
                  </p>
                </div>

                <div className="info-group">
                  <label className="info-label">Member Since</label>
                  <p className="info-value">
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-GB', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    }) : 'Today'}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="profile-actions">
                <button className="btn btn-danger" onClick={handleLogout}>
                  🚪 Logout
                </button>
              </div>
            </div>
          </div>

          {/* Right: Stats */}
          <div className="profile-sidebar">
            {/* Trip Stats Card */}
            <div className="stats-card card">
              <h3>📊 Trip Statistics</h3>

              <div className="stat-item">
                <div className="stat-icon">🗺️</div>
                <div className="stat-content">
                  <span className="stat-label">Total Trips Planned</span>
                  <span className="stat-number">{trips.length}</span>
                </div>
              </div>

              <div className="stat-item">
                <div className="stat-icon">📍</div>
                <div className="stat-content">
                  <span className="stat-label">Total Places Visited</span>
                  <span className="stat-number">
                    {trips.reduce((sum, trip) => sum + trip.places.length, 0)}
                  </span>
                </div>
              </div>

              <div className="stat-item">
                <div className="stat-icon">💰</div>
                <div className="stat-content">
                  <span className="stat-label">Total Money Spent</span>
                  <span className="stat-number">Rs. {totalSpent}</span>
                </div>
              </div>

              <div className="stat-item">
                <div className="stat-icon">⏱️</div>
                <div className="stat-content">
                  <span className="stat-label">Total Visit Hours</span>
                  <span className="stat-number">
                    {Math.floor(
                      trips.reduce((sum, trip) => {
                        const visitTime = trip.places.reduce((s, tp) => s + (tp.estimatedVisitMinutes || 0), 0);
                        const travelTime = Math.max(0, (trip.places.length - 1) * 20);
                        return sum + visitTime + travelTime;
                      }, 0) / 60
                    )}h
                  </span>
                </div>
              </div>
            </div>

            {/* Last Trips */}
            {trips.length > 0 && (
              <div className="recent-trips card">
                <h3>📖 Recent Trips</h3>
                <div className="trips-list-mini">
                  {trips.slice(0, 3).map(trip => (
                    <div key={trip._id} className="trip-mini-item">
                      <div className="trip-mini-header">
                        <strong>{trip.name}</strong>
                        <span className="trip-date-mini">
                          {new Date(trip.date).toLocaleDateString('en-GB', {
                            month: 'short',
                            day: 'numeric',
                          })}
                        </span>
                      </div>
                      <div className="trip-mini-meta">
                        <span>📍 {trip.places.length} places</span>
                        <span>💰 Rs. {trip.places.reduce((s, tp) => s + (tp.place?.entranceFee || 0), 0)}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <Link to="/my-trips" className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center', marginTop: '1rem' }}>
                  View All Trips →
                </Link>
              </div>
            )}

            {trips.length === 0 && (
              <div className="empty-trips card">
                <div className="empty-icon">🗺️</div>
                <h3>No Trips Yet</h3>
                <p>Start planning your Batticaloa adventure today!</p>
                <Link to="/trip-planner" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                  Plan Your First Trip
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
