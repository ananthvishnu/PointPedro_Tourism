import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../utils/api';
import PlaceCard from '../components/PlaceCard';
import './PlacesPage.css';

const CATEGORIES = ['all', 'beach', 'heritage', 'lagoon', 'temple', 'park', 'food', 'other'];

export default function PlacesPage() {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [searchParams, setSearchParams] = useSearchParams();

  const category = searchParams.get('category') || 'all';
  const search = searchParams.get('search') || '';
  const page = parseInt(searchParams.get('page') || '1');

  const [searchInput, setSearchInput] = useState(search);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (category !== 'all') params.set('category', category);
    if (search) params.set('search', search);
    params.set('page', page);
    params.set('limit', '9');

    api.get(`/places?${params}`)
      .then(res => { setPlaces(res.data.places); setTotal(res.data.total); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [category, search, page]);

  const setCategory = (cat) => {
    const p = new URLSearchParams(searchParams);
    if (cat === 'all') p.delete('category'); else p.set('category', cat);
    p.delete('page');
    setSearchParams(p);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const p = new URLSearchParams(searchParams);
    if (searchInput.trim()) p.set('search', searchInput.trim()); else p.delete('search');
    p.delete('page');
    setSearchParams(p);
  };

  const setPage = (pg) => {
    const p = new URLSearchParams(searchParams);
    p.set('page', pg);
    setSearchParams(p);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const totalPages = Math.ceil(total / 9);

  return (
    <div className="places-page">
      <div className="places-hero">
        <div className="container">
          <h1>Explore Point Pedro</h1>
          <p>Discover {total} amazing destinations across the district</p>
          <form className="search-form" onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Search places..."
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              className="form-input search-input"
            />
            <button type="submit" className="btn btn-primary">Search</button>
            {search && (
              <button type="button" className="btn btn-secondary" onClick={() => {
                setSearchInput('');
                const p = new URLSearchParams(searchParams);
                p.delete('search');
                setSearchParams(p);
              }}>Clear</button>
            )}
          </form>
        </div>
      </div>

      <div className="container places-content">
        {/* Category filters */}
        <div className="category-filters">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              className={`filter-btn ${category === cat ? 'active' : ''}`}
              onClick={() => setCategory(cat)}
            >
              {cat === 'all' ? 'All Places' : cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>

        {search && (
          <p className="search-info">Showing results for "<strong>{search}</strong>" – {total} found</p>
        )}

        {loading ? (
          <div className="page-loader"><div className="spinner" /></div>
        ) : places.length === 0 ? (
          <div className="empty-state">
            <h3>No places found</h3>
            <p>Try a different search or category.</p>
          </div>
        ) : (
          <div className="places-grid">
            {places.map(place => <PlaceCard key={place._id} place={place} />)}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="pagination">
            <button className="btn btn-secondary btn-sm" onClick={() => setPage(page - 1)} disabled={page === 1}>← Prev</button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(pg => (
              <button key={pg} className={`btn btn-sm ${pg === page ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setPage(pg)}>{pg}</button>
            ))}
            <button className="btn btn-secondary btn-sm" onClick={() => setPage(page + 1)} disabled={page === totalPages}>Next →</button>
          </div>
        )}
      </div>
    </div>
  );
}
