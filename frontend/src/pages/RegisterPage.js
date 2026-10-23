
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import './AuthPages.css';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirm: ''
  });

  const [profileImage, setProfileImage] = useState(null);
  const [preview, setPreview] = useState('');
  const [loading, setLoading] = useState(false);

  // Release the temporary preview URL when it changes
  useEffect(() => {
    if (!profileImage) {
      setPreview('');
      return;
    }

    const imageURL = URL.createObjectURL(profileImage);
    setPreview(imageURL);

    return () => URL.revokeObjectURL(imageURL);
  }, [profileImage]);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/webp'
    ];

    if (!allowedTypes.includes(file.type)) {
      toast.error('Please select a JPG, PNG or WebP image');
      e.target.value = '';
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be smaller than 5 MB');
      e.target.value = '';
      return;
    }

    setProfileImage(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirm) {
      toast.error('Passwords do not match');
      return;
    }

    if (form.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      // Pass the selected image to AuthContext
      const user = await register(
        form.name,
        form.email,
        form.password,
        profileImage
      );

      toast.success(`Welcome, ${user.name}!`);
      navigate('/');
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
        err.response?.data?.errors?.[0]?.msg ||
        err.message ||
        'Registration failed'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card card">

        <div className="auth-header">
          <span className="auth-icon">📝</span>
          <h2>Create Account</h2>
          <p>
            Join Point Pedro Tourism and start planning your trip
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="auth-form"
        >
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              className="form-input"
              placeholder="Your name"
              value={form.name}
              onChange={(e) =>
                setForm((p) => ({
                  ...p,
                  name: e.target.value
                }))
              }
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="form-input"
              placeholder="you@example.com"
              value={form.email}
              onChange={(e) =>
                setForm((p) => ({
                  ...p,
                  email: e.target.value
                }))
              }
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-input"
              placeholder="Min. 6 characters"
              value={form.password}
              onChange={(e) =>
                setForm((p) => ({
                  ...p,
                  password: e.target.value
                }))
              }
              minLength={6}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              Confirm Password
            </label>
            <input
              type="password"
              className="form-input"
              placeholder="Repeat password"
              value={form.confirm}
              onChange={(e) =>
                setForm((p) => ({
                  ...p,
                  confirm: e.target.value
                }))
              }
              required
            />
          </div>

          {/* Profile Image Upload */}
          <div className="form-group">
            <label className="form-label">
              Profile Image (Optional)
            </label>

            <input
              type="file"
              className="form-input"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleImageChange}
            />

            {preview && (
              <div className="profile-image-preview">
                <img
                  src={preview}
                  alt="Profile preview"
                />

                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setProfileImage(null)}
                >
                  Remove Image
                </button>
              </div>
            )}
          </div>

          <button
            type="submit"
            className="btn btn-primary auth-btn"
            disabled={loading}
          >
            {loading
              ? 'Creating account...'
              : 'Create Account'}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account?{' '}
          <Link to="/login">Sign in</Link>
        </p>

      </div>
    </div>
  );
}
