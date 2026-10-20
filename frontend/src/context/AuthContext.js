import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('batti_token');
    const stored = localStorage.getItem('batti_user');
    if (token && stored) {
      setUser(JSON.parse(stored));
      api.get('/auth/me')
        .then(res => { setUser(res.data.user); localStorage.setItem('batti_user', JSON.stringify(res.data.user)); })
        .catch(() => logout())
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    localStorage.setItem('batti_token', res.data.token);
    localStorage.setItem('batti_user', JSON.stringify(res.data.user));
    setUser(res.data.user);
    return res.data.user;
  };

  const register = async (name, email, password) => {
    const res = await api.post('/auth/register', { name, email, password });
    localStorage.setItem('batti_token', res.data.token);
    localStorage.setItem('batti_user', JSON.stringify(res.data.user));
    setUser(res.data.user);
    return res.data.user;
  };

  const logout = () => {
    localStorage.removeItem('batti_token');
    localStorage.removeItem('batti_user');
    setUser(null);
    // Clear selected places from trip on logout
    window.dispatchEvent(new Event('logout'));
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, isAdmin: user?.role === 'admin' }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
