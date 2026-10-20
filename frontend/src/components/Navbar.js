import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTrip } from '../context/TripContext';
import './Navbar.css';

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const { tripItems } = useTrip();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="navbar-inner container">
        <Link to="/" className="navbar-brand" onClick={() => setMenuOpen(false)}>
          <span className="brand-icon">🐚</span>
          <span className="brand-text">Batti<span className="brand-accent">Tourism</span></span>
        </Link>

        <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
          {menuOpen ? '✕' : '☰'}
        </button>

        <div className={`navbar-links ${menuOpen ? 'open' : ''}`}>
          <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>Home</Link>
          <Link to="/places" className={`nav-link ${isActive('/places') ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>Explore</Link>
          <Link to="/trip-planner" className={`nav-link trip-link ${isActive('/trip-planner') ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>
            Trip Planner
            {tripItems.length > 0 && <span className="trip-badge">{tripItems.length}</span>}
          </Link>

          {user ? (
            <>
              {!isAdmin && (
                <Link to="/my-trips" className={`nav-link ${isActive('/my-trips') ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>My Trips</Link>
              )}
              {isAdmin && (
                <Link to="/admin" className={`nav-link admin-link ${isActive('/admin') ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>Admin</Link>
              )}
              <div className="nav-user">
                <Link 
                  to="/profile" 
                  className={`user-profile-link ${isActive('/profile') ? 'active' : ''}`}
                  onClick={() => setMenuOpen(false)}
                  title="View profile"
                >
                  👤 {user.name.split(' ')[0]}
                </Link>
                <button className="btn btn-secondary btn-sm" onClick={handleLogout}>Logout</button>
              </div>
            </>
          ) : (
            <div className="nav-auth">
              <Link to="/login" className="btn btn-secondary btn-sm" onClick={() => setMenuOpen(false)}>Login</Link>
              <Link to="/register" className="btn btn-primary btn-sm" onClick={() => setMenuOpen(false)}>Register</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
