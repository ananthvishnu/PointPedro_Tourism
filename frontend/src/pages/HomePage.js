import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import PlaceCard from '../components/PlaceCard';
import Plasma from '../components/Plasma';
import './HomePage.css';


const CATEGORIES = [
  { key: 'beach', label: 'Beaches', icon: '🏖️' },
  { key: 'heritage', label: 'Heritage', icon: '🏛️' },
  { key: 'lagoon', label: 'Lagoons', icon: '🌊' },
  { key: 'temple', label: 'Temples', icon: '⛩️' },
  { key: 'park', label: 'Parks', icon: '🌿' },
  { key: 'food', label: 'Food', icon: '🍛' },
];

export default function HomePage() {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/places?limit=6')
      .then(res => setFeatured(res.data.places))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) navigate(`/places?search=${encodeURIComponent(search.trim())}`);
  };

return (
    <div className="homepage">
      {/* Hero */}
      <section className="hero" style={{ position: 'relative', overflow: 'hidden' }}>

        {/* Plasma Animation Background */}
        <div style={{
          position: 'absolute',
          top: 0, left: 0,
          width: '100%',
          height: '100%',
          zIndex: 0
        }}>
          <Plasma
            color="#1a6b4a"
            speed={1}
            opacity={0.8}
            scale={1}
            mouseInteractive={true}
          />
        </div>

        {/* Dark overlay so text is readable */}
        <div className="hero-overlay" style={{ zIndex: 1 }} />

        {/* Hero Content */}
        <div className="hero-content container" style={{ position: 'relative', zIndex: 2 }}>
          <p className="hero-eyebrow">Discover the Pearl of the East</p>
          <h1 className="hero-title">Explore <em>Batticaloa</em></h1>
          <p className="hero-subtitle">Plan your perfect one-day tour through Sri Lanka's most enchanting eastern coastal city.</p>
          <form className="hero-search" onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Search beaches, temples, heritage sites..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="hero-search-input"
            />
            <button type="submit" className="btn btn-primary btn-lg">🔍 Search</button>
          </form>
          <div className="hero-actions">
            <Link to="/places" className="btn btn-primary btn-lg">Explore All Places</Link>
            <Link to="/trip-planner" className="btn btn-secondary btn-lg">Plan a Trip</Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="stats-bar">
        <div className="container stats-inner">
          <div className="stat"><span className="stat-num">8+</span><span>Tourist Spots</span></div>
          <div className="stat"><span className="stat-num">5</span><span>Categories</span></div>
          <div className="stat"><span className="stat-num">Free</span><span>Trip Planning</span></div>
          <div className="stat"><span className="stat-num">🗺️</span><span>Map Navigation</span></div>
        </div>
      </section>

      {/* Categories */}
      <section className="section container">
        <h2 className="section-title">Browse by Category</h2>
        <div className="categories-grid">
          {CATEGORIES.map(cat => (
            <Link key={cat.key} to={`/places?category=${cat.key}`} className="category-card">
              <span className="cat-icon">{cat.icon}</span>
              <span className="cat-label">{cat.label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Places */}
      <section className="section container">
        <div className="section-header">
          <h2 className="section-title">Featured Destinations</h2>
          <Link to="/places" className="btn btn-secondary">View All →</Link>
        </div>
        {loading ? (
          <div className="page-loader"><div className="spinner" /></div>
        ) : (
          <div className="places-grid">
            {featured.map(place => <PlaceCard key={place._id} place={place} />)}
          </div>
        )}
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="container cta-inner">
          <h2>Ready to Explore Batticaloa?</h2>
          <p>Use our Trip Planner to build your perfect day itinerary with travel time estimates.</p>
          <Link to="/trip-planner" className="btn btn-primary btn-lg">Start Planning →</Link>
        </div>
      </section>
    </div>
  );
}
