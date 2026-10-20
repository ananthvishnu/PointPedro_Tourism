import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const TripContext = createContext();

export function TripProvider({ children }) {
  const [tripItems, setTripItems] = useState([]);
  const { user } = useAuth();

  // Initialize trip from localStorage only if user is logged in
  useEffect(() => {
    const token = localStorage.getItem('batti_token');
    if (token) {
      const savedTrip = localStorage.getItem('batti_trip');
      if (savedTrip) {
        try {
          setTripItems(JSON.parse(savedTrip));
        } catch (e) {
          setTripItems([]);
        }
      }
    } else {
      setTripItems([]);
    }
  }, []);

  // Clear trip on logout
  useEffect(() => {
    const handleLogout = () => {
      setTripItems([]);
      localStorage.removeItem('batti_trip');
    };
    
    window.addEventListener('logout', handleLogout);
    return () => window.removeEventListener('logout', handleLogout);
  }, []);

  // Clear trip if user logs out
  useEffect(() => {
    if (!user) {
      setTripItems([]);
      localStorage.removeItem('batti_trip');
    }
  }, [user]);

  // Persist trip to localStorage
  useEffect(() => {
    const token = localStorage.getItem('batti_token');
    if (token && tripItems.length > 0) {
      localStorage.setItem('batti_trip', JSON.stringify(tripItems));
    } else if (!token || tripItems.length === 0) {
      localStorage.removeItem('batti_trip');
    }
  }, [tripItems]);

  const addToTrip = (place) => {
    if (!tripItems.find(p => p._id === place._id)) {
      setTripItems(prev => [...prev, place]);
    }
  };

  const removeFromTrip = (placeId) => {
    setTripItems(prev => prev.filter(p => p._id !== placeId));
  };

  const clearTrip = () => setTripItems([]);

  const isInTrip = (placeId) => tripItems.some(p => p._id === placeId);

  // Estimate total visit duration
  const totalVisitMinutes = tripItems.reduce((sum, p) => sum + (p.estimatedVisitMinutes || 60), 0);

  return (
    <TripContext.Provider value={{ tripItems, addToTrip, removeFromTrip, clearTrip, isInTrip, totalVisitMinutes }}>
      {children}
    </TripContext.Provider>
  );
}

export const useTrip = () => useContext(TripContext);
