import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import PlaceCard from '../components/PlaceCard';
import './HomePage.css';
import HeroVideoCarousel from './videoCarousel';

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

   {/*Add video automatic loop carosel add here*/}
<HeroVideoCarousel />
        {/* Dark overlay so text is readable */}
        <div className="hero-overlay" style={{ zIndex: 1 }} />

        {/* Hero Content */}
        <div className="hero-content container" style={{ position: 'relative', zIndex: 2 }}>
          <p className="hero-eyebrow">Discover the Untouched Beauty of Sri Lanka’s North</p>
          <h1 className="hero-title">Explore <em>PointPedro</em></h1>
          <p className="hero-subtitle">Experience sacred temples, historic landmarks, local traditions, and unforgettable coastal views.</p>
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
          <h2>Ready to Discover Point Pedro?</h2>
          <p>Explore Point Pedro’s beautiful beaches, iconic lighthouse, and rich heritage. Your adventure starts here!</p>
          <Link to="/trip-planner" className="btn btn-primary btn-lg">Start Planning →</Link>
        </div>
      </section>
    </div>
  );
}
