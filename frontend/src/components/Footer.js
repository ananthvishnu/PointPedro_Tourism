import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div className="footer-brand">
          <span className="footer-logo">
            <img
              src="/images/pointpedro-logo.png"
              alt="PointPedro Tourism Logo"
              className="brand-logo"
            />
            PointPedro<span>Tourism</span>
          </span>
          <p>
            Your trusted guide to exploring the beautiful Point Pedro of Sri
            Lanka.
          </p>
        </div>
        <div className="footer-links">
          <h4>🌊 Explore </h4>

          <Link to="/places">📍 All Places</Link>
          <Link to="/places?category=beach">🏖️ Beaches</Link>
          <Link to="/places?category=heritage">🏛️ Heritage</Link>
          <Link to="/trip-planner">🗺️ Trip Planner</Link>
        </div>
        <div className="footer-links">
          <h4>👤 Account</h4>
          <Link to="/login">🔑 Login</Link>
          <Link to="/register">📝 Register</Link>
          <Link to="/my-trips">🗺️ My Trips</Link>
          <Link to="/profile">👤 My Profile</Link>
        </div>
        <div className="footer-links">
          <h4>🌴 About Us</h4>
          <Link to="/">💻 E2410098 – A Vishnurathan</Link>

          <Link to="/">🎓 ITE2953 – Programming Group Project</Link>

          <Link to="/">🏛️ University of Moratuwa</Link>

          <Link
            to="/"
          >
            📍 Point Pedro, Sri Lanka 🇱🇰
          </Link>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© 2026 PointPedro Tourism. All rights reserved.</p>
      </div>
    </footer>
  );
}
