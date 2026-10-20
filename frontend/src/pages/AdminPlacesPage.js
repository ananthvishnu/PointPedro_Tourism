import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';
import './AdminPages.css';

const EMPTY_FORM = {
  name: '', category: 'beach', description: '', entranceFee: 0,
  openingTime: '06:00', closingTime: '18:00', estimatedVisitMinutes: 60,
  safetyGuidelines: '', seasonalWarnings: '',
  latitude: '', longitude: '', address: '',
  imageUrl: '', imageCaption: '',
};

const CATEGORIES = ['beach', 'temple', 'heritage', 'food', 'lagoon', 'park', 'other'];

export default function AdminPlacesPage() {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const fetchPlaces = () => {
    api.get('/places?limit=50').then(res => setPlaces(res.data.places)).catch(console.error).finally(() => setLoading(false));
  };

  useEffect(() => { fetchPlaces(); }, []);

  const openNew = () => { setForm(EMPTY_FORM); setEditId(null); setShowForm(true); };

  const openEdit = (place) => {
    setForm({
      name: place.name, category: place.category, description: place.description,
      entranceFee: place.entranceFee, openingTime: place.openingTime, closingTime: place.closingTime,
      estimatedVisitMinutes: place.estimatedVisitMinutes,
      safetyGuidelines: (place.safetyGuidelines || []).join('\n'),
      seasonalWarnings: (place.seasonalWarnings || []).join('\n'),
      latitude: place.location?.latitude || '', longitude: place.location?.longitude || '',
      address: place.location?.address || '',
      imageUrl: place.images?.[0]?.url || '', imageCaption: place.images?.[0]?.caption || '',
    });
    setEditId(place._id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this place? This cannot be undone.')) return;
    try {
      await api.delete(`/places/${id}`);
      setPlaces(prev => prev.filter(p => p._id !== id));
      toast.success('Place deleted');
    } catch { toast.error('Failed to delete place'); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.description || !form.latitude || !form.longitude) {
      toast.error('Name, description, latitude and longitude are required');
      return;
    }
    setSaving(true);
    const payload = {
      name: form.name, category: form.category, description: form.description,
      entranceFee: Number(form.entranceFee), openingTime: form.openingTime, closingTime: form.closingTime,
      estimatedVisitMinutes: Number(form.estimatedVisitMinutes),
      safetyGuidelines: form.safetyGuidelines.split('\n').map(s => s.trim()).filter(Boolean),
      seasonalWarnings: form.seasonalWarnings.split('\n').map(s => s.trim()).filter(Boolean),
      location: { latitude: Number(form.latitude), longitude: Number(form.longitude), address: form.address },
      images: form.imageUrl ? [{ url: form.imageUrl, caption: form.imageCaption }] : [],
    };
    try {
      if (editId) {
        const res = await api.put(`/places/${editId}`, payload);
        setPlaces(prev => prev.map(p => p._id === editId ? res.data : p));
        toast.success('Place updated!');
      } else {
        const res = await api.post('/places', payload);
        setPlaces(prev => [res.data, ...prev]);
        toast.success('Place created!');
      }
      setShowForm(false);
      setEditId(null);
      setForm(EMPTY_FORM);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const f = (field) => ({ value: form[field], onChange: e => setForm(p => ({ ...p, [field]: e.target.value })) });

  return (
    <div className="admin-page">
      <div className="admin-hero">
        <div className="container admin-hero-row">
          <div>
            <h1>🏖️ Manage Places</h1>
            <p>Add, edit and remove tourist attractions</p>
          </div>
          <button className="btn btn-secondary" onClick={showForm ? () => setShowForm(false) : openNew}>
            {showForm ? '✕ Cancel' : '+ Add New Place'}
          </button>
        </div>
      </div>

      <div className="container admin-content">
        {/* Form */}
        {showForm && (
          <div className="admin-form-card card">
            <h3>{editId ? 'Edit Place' : 'Add New Place'}</h3>
            <form onSubmit={handleSubmit} className="admin-form">
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Place Name *</label>
                  <input className="form-input" {...f('name')} placeholder="e.g. Kallady Beach" required />
                </div>
                <div className="form-group">
                  <label className="form-label">Category *</label>
                  <select className="form-input" {...f('category')}>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Description *</label>
                <textarea className="form-input" rows={4} {...f('description')} placeholder="Describe the place..." style={{resize:'vertical'}} required />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Entrance Fee (LKR)</label>
                  <input type="number" className="form-input" {...f('entranceFee')} min="0" />
                </div>
                <div className="form-group">
                  <label className="form-label">Opening Time</label>
                  <input type="time" className="form-input" {...f('openingTime')} />
                </div>
                <div className="form-group">
                  <label className="form-label">Closing Time</label>
                  <input type="time" className="form-input" {...f('closingTime')} />
                </div>
                <div className="form-group">
                  <label className="form-label">Visit Duration (min)</label>
                  <input type="number" className="form-input" {...f('estimatedVisitMinutes')} min="10" />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Latitude *</label>
                  <input type="number" step="any" className="form-input" {...f('latitude')} placeholder="e.g. 7.7286" required />
                </div>
                <div className="form-group">
                  <label className="form-label">Longitude *</label>
                  <input type="number" step="any" className="form-input" {...f('longitude')} placeholder="e.g. 81.7011" required />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Address</label>
                <input className="form-input" {...f('address')} placeholder="Full address or area name" />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Image URL</label>
                  <input className="form-input" {...f('imageUrl')} placeholder="https://..." />
                </div>
                <div className="form-group">
                  <label className="form-label">Image Caption</label>
                  <input className="form-input" {...f('imageCaption')} placeholder="Short caption" />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Safety Guidelines (one per line)</label>
                  <textarea className="form-input" rows={3} {...f('safetyGuidelines')} placeholder="Swim in designated areas&#10;Wear sunscreen" style={{resize:'vertical'}} />
                </div>
                <div className="form-group">
                  <label className="form-label">Seasonal Warnings (one per line)</label>
                  <textarea className="form-input" rows={3} {...f('seasonalWarnings')} placeholder="Rough seas Oct–Jan" style={{resize:'vertical'}} />
                </div>
              </div>

              <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={() => { setShowForm(false); setEditId(null); }}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? 'Saving...' : editId ? '💾 Update Place' : '✚ Create Place'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Places table */}
        <div className="admin-section">
          <div className="admin-section-header">
            <h3>All Places ({places.length})</h3>
          </div>
          {loading ? (
            <div className="page-loader"><div className="spinner" /></div>
          ) : places.length === 0 ? (
            <div className="empty-state"><h3>No places yet</h3><p>Click "Add New Place" to get started.</p></div>
          ) : (
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Fee</th>
                    <th>Hours</th>
                    <th>Rating</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {places.map(place => (
                    <tr key={place._id}>
                      <td>
                        <strong>{place.name}</strong>
                        <div style={{fontSize:'0.78rem', color:'var(--gray)', marginTop:'2px'}}>{place.location?.address}</div>
                      </td>
                      <td><span className={`badge badge-${place.category}`}>{place.category}</span></td>
                      <td>{place.entranceFee === 0 ? <span className="free-tag">Free</span> : `Rs. ${place.entranceFee}`}</td>
                      <td style={{fontSize:'0.82rem', color:'var(--gray)', whiteSpace:'nowrap'}}>{place.openingTime}–{place.closingTime}</td>
                      <td>
                        <span className="stars" style={{fontSize:'0.8rem'}}>{'★'.repeat(Math.round(place.averageRating || 0))}</span>
                        {' '}<span style={{fontSize:'0.82rem', color:'var(--gray)'}}>{place.averageRating ? place.averageRating.toFixed(1) : '-'}</span>
                      </td>
                      <td>
                        <div style={{display:'flex', gap:'0.4rem'}}>
                          <button className="btn btn-secondary btn-sm" onClick={() => openEdit(place)}>✏️ Edit</button>
                          <button className="btn btn-danger btn-sm" onClick={() => handleDelete(place._id)}>🗑️ Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
